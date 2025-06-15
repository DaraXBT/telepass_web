"use client";

// Updated EventAudienceList component with enhanced functionality from audience-list.tsx
// Features:
// - Language provider support with translation keys
// - Enhanced User interface with full user details (fullName, phoneNumber, gender, dateOfBirth, address, occupation, registrationToken)
// - API integration with proper error handling
// - Improved UI components (Select, Textarea, proper icons)
// - Better search functionality across multiple fields
// - Comprehensive user form with all required fields

import {useState, useEffect, useMemo} from "react";
import {Card, CardContent, CardHeader, CardTitle} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
  TableFooter,
} from "@/components/ui/table";
import {Badge} from "@/components/ui/badge";
import {Input} from "@/components/ui/input";
import {Button} from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from "@/components/ui/dialog";
import {Label} from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {Textarea} from "@/components/ui/textarea";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {BadgeCheck, MoreHorizontal, Plus, QrCode, Trash} from "lucide-react";
import {QRCodeSVG} from "qrcode.react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import {useToast} from "@/hooks/use-toast";
import {useLanguage} from "@/components/providers/LanguageProvider";
import {getEventAudiences, getAudienceQrCode} from "@/services/event.service";

interface User {
  id: string;
  fullName: string;
  phoneNumber: string;
  gender: "MALE" | "FEMALE" | "OTHER";
  dateOfBirth: string;
  address: string;
  email: string;
  occupation: string;
  registrationToken: string;
  checkedIn: boolean;
  qrCode: string | null;
}

interface EventAudienceListProps {
  eventId: string;
}

export function EventAudienceList({eventId}: EventAudienceListProps) {
  const {t} = useLanguage();
  const [audienceMembers, setAudienceMembers] = useState<User[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [editingMember, setEditingMember] = useState<User | null>(null);
  const [isAddingMember, setIsAddingMember] = useState(false);
  const [showingQRCode, setShowingQRCode] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const {toast} = useToast();
  useEffect(() => {
    const fetchAudienceMembers = async () => {
      try {
        const audienceData = await getEventAudiences(eventId);
        // The API now returns checkedIn and qrCode directly
        setAudienceMembers(audienceData);
      } catch (error) {
        console.error("API call failed:", error);
        toast({
          title: t("Error fetching users"),
          description: t("Failed to load user data. Using sample data."),
          variant: "destructive",
        });

        // Fallback to mock data for demonstration
        const mockUsers: User[] = [
          {
            id: "1",
            fullName: "John Doe",
            phoneNumber: "+1234567890",
            gender: "MALE",
            dateOfBirth: "1990-01-15",
            address: "123 Main St, City, Country",
            email: "john.doe@example.com",
            occupation: "Software Engineer",
            registrationToken: "token123",
            checkedIn: true,
            qrCode: `qrcode/user_1_${eventId}.png`,
          },
          {
            id: "2",
            fullName: "Jane Smith",
            phoneNumber: "+1234567891",
            gender: "FEMALE",
            dateOfBirth: "1992-05-20",
            address: "456 Oak Ave, City, Country",
            email: "jane.smith@example.com",
            occupation: "Product Manager",
            registrationToken: "token456",
            checkedIn: false,
            qrCode: null,
          },
          {
            id: "3",
            fullName: "Bob Johnson",
            phoneNumber: "+1234567892",
            gender: "MALE",
            dateOfBirth: "1988-09-10",
            address: "789 Pine St, City, Country",
            email: "bob.johnson@example.com",
            occupation: "Data Scientist",
            registrationToken: "token789",
            checkedIn: true,
            qrCode: `qrcode/user_3_${eventId}.png`,
          },
          {
            id: "4",
            fullName: "Alice Brown",
            phoneNumber: "+1234567893",
            gender: "FEMALE",
            dateOfBirth: "1995-03-25",
            address: "321 Elm St, City, Country",
            email: "alice.brown@example.com",
            occupation: "UX Designer",
            registrationToken: "token321",
            checkedIn: false,
            qrCode: null,
          },
        ];
        setAudienceMembers(mockUsers);
      } finally {
        setIsLoading(false);
      }
    };

    fetchAudienceMembers();
  }, [eventId, toast, t]);
  const filteredMembers = useMemo(() => {
    return audienceMembers.filter(
      (member) =>
        member.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        member.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        member.phoneNumber.includes(searchTerm)
    );
  }, [audienceMembers, searchTerm]);
  const handleUpdateMember = async (updatedMember: User) => {
    try {
      // Add your API update call here
      setAudienceMembers(
        audienceMembers.map((member) =>
          member.id === updatedMember.id ? updatedMember : member
        )
      );
      setEditingMember(null);
      toast({
        title: t("User updated"),
        description: `${updatedMember.fullName} ${t("'s information has been updated.")}`,
      });
    } catch (error) {
      toast({
        title: t("Error updating user"),
        description: t("Failed to update user information."),
        variant: "destructive",
      });
    }
  };
  const handleAddMember = async (newMember: User) => {
    try {
      // Add your API create call here
      const qrCode = `EVENT-${eventId}-${Date.now().toString(36)}`;
      setAudienceMembers([...audienceMembers, {...newMember, qrCode}]);
      setIsAddingMember(false);
      toast({
        title: t("User added"),
        description: `${newMember.fullName} ${t("has been added to the system.")}`,
      });
    } catch (error) {
      toast({
        title: t("Error adding user"),
        description: t("Failed to add new user."),
        variant: "destructive",
      });
    }
  };
  const handleDeleteMember = async (id: string) => {
    try {
      // Add your API delete call here
      const memberToDelete = audienceMembers.find((member) => member.id === id);
      setAudienceMembers(audienceMembers.filter((member) => member.id !== id));
      toast({
        title: t("User deleted"),
        description: `${memberToDelete?.fullName} ${t("has been removed from the system.")}`,
      });
    } catch (error) {
      toast({
        title: t("Error deleting user"),
        description: t("Failed to delete user."),
        variant: "destructive",
      });
    }
  };
  const totals = useMemo(() => {
    const total = filteredMembers.length;
    const checkedIn = filteredMembers.filter(
      (member) => member.checkedIn === true
    ).length;
    const notChecked = total - checkedIn;
    const checkedInPercentage =
      total > 0 ? Math.round((checkedIn / total) * 100) : 0;
    const notCheckedPercentage =
      total > 0 ? Math.round((notChecked / total) * 100) : 0;
    return {
      total,
      checkedIn,
      notChecked,
      checkedInPercentage,
      notCheckedPercentage,
    };
  }, [filteredMembers]);
  if (isLoading) {
    return <div>{t("Loading...")}</div>;
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>{t("User List")}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex items-center space-x-4 mb-4">
          <div className="flex-grow">
            <Input
              placeholder={t("Search...")}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full"
            />
          </div>
          <Button onClick={() => setIsAddingMember(true)}>
            <Plus className="h-4 w-4 mr-2" /> {t("Add User")}
          </Button>
        </div>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>{t("Name")}</TableHead>
              <TableHead>{t("Email")}</TableHead>
              <TableHead>{t("Phone Number")}</TableHead>{" "}
              <TableHead>{t("Occupation")}</TableHead>
              <TableHead>{t("Gender")}</TableHead>
              <TableHead>{t("Status")}</TableHead>
              <TableHead>{t("QR Code")}</TableHead>
              <TableHead className="text-right">{t("Actions")}</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredMembers.map((member) => (
              <TableRow key={member.id}>
                <TableCell>{member.fullName}</TableCell>
                <TableCell>{member.email}</TableCell>
                <TableCell>{member.phoneNumber}</TableCell>
                <TableCell>{member.occupation}</TableCell>
                <TableCell>{t(member.gender)}</TableCell>
                <TableCell>
                  {member.checkedIn ? (
                    <Badge
                      variant="secondary"
                      className="bg-blue-500 text-white dark:bg-blue-600 px-2 py-0.5 rounded-full text-xs font-medium inline-flex items-center justify-center w-28 gap-1">
                      <BadgeCheck className="h-3 w-3" />
                      {t("Checked In")}
                    </Badge>
                  ) : (
                    <Badge
                      variant="secondary"
                      className="px-2 py-0.5 rounded-full text-xs font-medium inline-flex items-center justify-center w-28">
                      {t("Not Checked")}
                    </Badge>
                  )}
                </TableCell>
                <TableCell>
                  <Button
                    variant="outline"
                    size="sm"
                    disabled={!member.qrCode}
                    onClick={() => setShowingQRCode(member)}>
                    <QrCode className="h-4 w-4 mr-2" />
                    {member.qrCode ? t("View") : t("No QR Code")}
                  </Button>
                </TableCell>
                <TableCell className="text-right">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" className="h-8 w-8 p-0">
                        <span className="sr-only">{t("Open menu")}</span>
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuLabel>{t("Actions")}</DropdownMenuLabel>
                      <DropdownMenuItem
                        onClick={() => setEditingMember(member)}>
                        {t("Edit")}
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <DropdownMenuItem
                            onSelect={(e) => e.preventDefault()}
                            className="text-red-600 dark:text-red-400">
                            <Trash className="mr-2 h-4 w-4" />
                            {t("Delete")}
                          </DropdownMenuItem>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>
                              {t("Are you absolutely sure?")}
                            </AlertDialogTitle>
                            <AlertDialogDescription>
                              {t(
                                "This action cannot be undone. This will permanently delete the user and remove their data from our servers."
                              )}
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>{t("Cancel")}</AlertDialogCancel>{" "}
                            <AlertDialogAction
                              onClick={() => handleDeleteMember(member.id)}
                              className="bg-red-600 hover:bg-red-700 text-white">
                              {t("Delete")}
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
          <TableFooter>
            <TableRow>
              <TableCell colSpan={8}>
                <div className="flex justify-end items-center space-x-4 text-sm">
                  <div className="flex items-center">
                    <span className="text-muted-foreground mr-2">
                      {t("Total")}:
                    </span>
                    <span className="font-medium">{totals.total}</span>
                  </div>
                  <div className="flex items-center">
                    <span className="text-muted-foreground mr-2">
                      {t("Checked In")}:
                    </span>
                    <span className="font-medium text-green-600 dark:text-green-400">
                      {totals.checkedIn} ({totals.checkedInPercentage}%)
                    </span>
                  </div>{" "}
                  <div className="flex items-center">
                    <span className="text-muted-foreground mr-2">
                      {t("Not Checked")}:
                    </span>
                    <span className="font-medium text-yellow-600 dark:text-yellow-400">
                      {totals.notChecked} ({totals.notCheckedPercentage}%)
                    </span>
                  </div>
                </div>
              </TableCell>
            </TableRow>
          </TableFooter>
        </Table>
      </CardContent>
      <Dialog
        open={!!editingMember}
        onOpenChange={(open) => !open && setEditingMember(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{t("Update Audience Member")}</DialogTitle>
            <DialogDescription>
              {t(
                "Modify the details of the audience member using the form below."
              )}
            </DialogDescription>
          </DialogHeader>
          {editingMember && (
            <UserForm
              member={editingMember}
              onSubmit={handleUpdateMember}
              onCancel={() => setEditingMember(null)}
            />
          )}
        </DialogContent>
      </Dialog>
      <Dialog open={isAddingMember} onOpenChange={setIsAddingMember}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{t("Add New Audience Member")}</DialogTitle>
            <DialogDescription>
              {t(
                "Enter the details of the new audience member using the form below."
              )}
            </DialogDescription>
          </DialogHeader>{" "}
          <UserForm
            member={{
              id: "",
              fullName: "",
              phoneNumber: "",
              gender: "MALE",
              dateOfBirth: "",
              address: "",
              email: "",
              occupation: "",
              registrationToken: "",
              checkedIn: false,
              qrCode: null,
            }}
            onSubmit={handleAddMember}
            onCancel={() => setIsAddingMember(false)}
          />
        </DialogContent>
      </Dialog>
      <Dialog
        open={!!showingQRCode}
        onOpenChange={(open) => !open && setShowingQRCode(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {t("QR Code for")} {showingQRCode?.fullName}
            </DialogTitle>
            <DialogDescription>
              {t(
                "Scan this QR code to access audience member details or for check-in."
              )}
            </DialogDescription>
          </DialogHeader>{" "}
          <div className="flex flex-col items-center justify-center p-4">
            {showingQRCode?.qrCode ? (
              <>
                <QRCodeSVG value={showingQRCode.qrCode} size={200} />
                <p className="mt-4 text-lg   font-medium">
                  {showingQRCode.fullName}
                </p>
              </>
            ) : (
              <div className="text-center">
                <QrCode className="h-16 w-16 mx-auto text-gray-400 mb-4" />
                <p className="text-sm text-gray-500">
                  {t("No QR code available for this user")}
                </p>
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </Card>
  );
}

interface UserFormProps {
  member: User;
  onSubmit: (member: User) => void;
  onCancel: () => void;
}

function UserForm({member, onSubmit, onCancel}: UserFormProps) {
  const {t} = useLanguage();
  const [formData, setFormData] = useState<User>(member);
  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => {
    const {name, value} = e.target;
    setFormData((prev: User) => ({...prev, [name]: value}));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <Label htmlFor="fullName">{t("Full Name")}</Label>
        <Input
          id="fullName"
          name="fullName"
          value={formData.fullName}
          onChange={handleChange}
          required
        />
      </div>
      <div>
        <Label htmlFor="email">{t("Email")}</Label>
        <Input
          id="email"
          name="email"
          type="email"
          value={formData.email}
          onChange={handleChange}
          required
        />
      </div>
      <div>
        <Label htmlFor="phoneNumber">{t("Phone Number")}</Label>
        <Input
          id="phoneNumber"
          name="phoneNumber"
          value={formData.phoneNumber}
          onChange={handleChange}
          required
        />
      </div>
      <div>
        <Label htmlFor="occupation">{t("Occupation")}</Label>
        <Input
          id="occupation"
          name="occupation"
          value={formData.occupation}
          onChange={handleChange}
          required
        />
      </div>{" "}
      <div>
        <Label htmlFor="gender">{t("Gender")}</Label>
        <Select
          value={formData.gender}
          onValueChange={(value) =>
            setFormData((prev: User) => ({
              ...prev,
              gender: value as "MALE" | "FEMALE" | "OTHER",
            }))
          }>
          <SelectTrigger>
            <SelectValue placeholder={t("Select gender")} />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="MALE">{t("MALE")}</SelectItem>
            <SelectItem value="FEMALE">{t("FEMALE")}</SelectItem>
            <SelectItem value="OTHER">{t("OTHER")}</SelectItem>
          </SelectContent>
        </Select>
      </div>{" "}
      <div>
        <Label htmlFor="address">{t("Address")}</Label>
        <Textarea
          id="address"
          name="address"
          value={formData.address}
          onChange={handleChange}
          placeholder={t("Enter full address")}
          className="min-h-[80px]"
          required
        />
      </div>
      <div>
        <Label htmlFor="dateOfBirth">{t("Date of Birth")}</Label>
        <Input
          id="dateOfBirth"
          name="dateOfBirth"
          type="date"
          value={formData.dateOfBirth}
          onChange={handleChange}
          required
        />
      </div>{" "}
      <div>
        <Label htmlFor="checkedIn">{t("Check-in Status")}</Label>
        <Select
          value={formData.checkedIn ? "Checked In" : "Not Checked"}
          onValueChange={(value) =>
            setFormData((prev: User) => ({
              ...prev,
              checkedIn: value === "Checked In",
            }))
          }>
          <SelectTrigger>
            <SelectValue placeholder={t("Select status")} />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="Checked In">{t("Checked In")}</SelectItem>
            <SelectItem value="Not Checked">{t("Not Checked")}</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <DialogFooter>
        <Button type="button" variant="outline" onClick={onCancel}>
          {t("Cancel")}
        </Button>
        <Button type="submit">{t("Save")}</Button>
      </DialogFooter>
    </form>
  );
}
