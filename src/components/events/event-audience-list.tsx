"use client";

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
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {MoreHorizontal, Plus, QrCode} from "lucide-react";
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

interface AudienceMember {
  id: number;
  name: string;
  email: string;
  job: string;
  checkInStatus: "Checked In" | "Not Checked";
  qrCode: string;
}

interface EventAudienceListProps {
  eventId: number;
}

export function EventAudienceList({eventId}: EventAudienceListProps) {
  const [audienceMembers, setAudienceMembers] = useState<AudienceMember[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [editingMember, setEditingMember] = useState<AudienceMember | null>(
    null
  );
  const [isAddingMember, setIsAddingMember] = useState(false);
  const [showingQRCode, setShowingQRCode] = useState<AudienceMember | null>(
    null
  );
  const [isLoading, setIsLoading] = useState(true);
  const {toast} = useToast();

  useEffect(() => {
    const fetchAudienceMembers = async () => {
      // Simulating API call
      setTimeout(() => {
        setAudienceMembers([
          {
            id: 1,
            name: "John Doe",
            email: "john@example.com",
            job: "Software Engineer",
            checkInStatus: "Checked In",
            qrCode: `EVENT-${eventId}-001`,
          },
          {
            id: 2,
            name: "Jane Smith",
            email: "jane@example.com",
            job: "Product Manager",
            checkInStatus: "Not Checked",
            qrCode: `EVENT-${eventId}-002`,
          },
          {
            id: 3,
            name: "Bob Johnson",
            email: "bob@example.com",
            job: "Data Scientist",
            checkInStatus: "Checked In",
            qrCode: `EVENT-${eventId}-003`,
          },
          {
            id: 4,
            name: "Alice Brown",
            email: "alice@example.com",
            job: "UX Designer",
            checkInStatus: "Not Checked",
            qrCode: `EVENT-${eventId}-004`,
          },
        ]);
        setIsLoading(false);
      }, 1000);
    };

    fetchAudienceMembers();
  }, [eventId]);

  const filteredMembers = useMemo(() => {
    return audienceMembers.filter(
      (member) =>
        member.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        member.email.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [audienceMembers, searchTerm]);

  const handleUpdateMember = (updatedMember: AudienceMember) => {
    setAudienceMembers(
      audienceMembers.map((member) =>
        member.id === updatedMember.id ? updatedMember : member
      )
    );
    setEditingMember(null);
    toast({
      title: "Audience member updated",
      description: `${updatedMember.name}'s information has been updated for this event.`,
      variant: "success",
    });
  };

  const handleAddMember = (newMember: AudienceMember) => {
    const newId = Math.max(...audienceMembers.map((m) => m.id)) + 1;
    const newQRCode = `EVENT-${eventId}-${newId.toString().padStart(3, "0")}`;
    setAudienceMembers([
      ...audienceMembers,
      {...newMember, id: newId, qrCode: newQRCode},
    ]);
    setIsAddingMember(false);
    toast({
      title: "Audience member added",
      description: `${newMember.name} has been added to the audience list for this event.`,
      variant: "success",
    });
  };

  const handleDeleteMember = (id: number) => {
    const memberToDelete = audienceMembers.find((member) => member.id === id);
    setAudienceMembers(audienceMembers.filter((member) => member.id !== id));
    toast({
      title: "Audience member removed",
      description: `${memberToDelete?.name} (${memberToDelete?.email}) has been removed from the audience list for this event.`,
      variant: "destructive",
    });
  };

  const totals = useMemo(() => {
    const total = filteredMembers.length;
    const checkedIn = filteredMembers.filter(
      (member) => member.checkInStatus === "Checked In"
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
    return <div>Loading audience list...</div>;
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Audience List</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex items-center space-x-4 mb-4">
          <div className="flex-grow">
            <Input
              placeholder="Search audience members..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full"
            />
          </div>
          <Button onClick={() => setIsAddingMember(true)}>
            <Plus className="h-4 w-4 mr-2" /> Add Member
          </Button>
        </div>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Job</TableHead>
              <TableHead>Check-in Status</TableHead>
              <TableHead>QR Code</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredMembers.map((member) => (
              <TableRow key={member.id}>
                <TableCell>{member.name}</TableCell>
                <TableCell>{member.email}</TableCell>
                <TableCell>{member.job}</TableCell>
                <TableCell>
                  <Badge
                    variant={
                      member.checkInStatus === "Checked In"
                        ? "default"
                        : "secondary"
                    }
                    className={`px-2 py-0.5 rounded-full text-xs font-medium inline-flex items-center justify-center w-28 ${
                      member.checkInStatus === "Checked In"
                        ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100"
                        : "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-100"
                    }`}>
                    <span
                      className={`inline-block w-2 h-2 rounded-full mr-1.5 ${
                        member.checkInStatus === "Checked In"
                          ? "bg-green-500 dark:bg-green-400"
                          : "bg-yellow-500 dark:bg-yellow-400"
                      }`}></span>
                    {member.checkInStatus}
                  </Badge>
                </TableCell>
                <TableCell>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setShowingQRCode(member)}>
                    <QrCode className="h-4 w-4 mr-2" />
                    View
                  </Button>
                </TableCell>
                <TableCell className="text-right">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" className="h-8 w-8 p-0">
                        <span className="sr-only">Open menu</span>
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem
                        onClick={() => setEditingMember(member)}>
                        Edit
                      </DropdownMenuItem>
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <DropdownMenuItem
                            onSelect={(e) => e.preventDefault()}
                            className="text-red-600 dark:text-red-400">
                            Delete
                          </DropdownMenuItem>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>
                              Are you absolutely sure?
                            </AlertDialogTitle>
                            <AlertDialogDescription>
                              This action cannot be undone. This will
                              permanently remove the audience member from this
                              event.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                            <AlertDialogAction
                              onClick={() => handleDeleteMember(member.id)}
                              className="bg-red-600 hover:bg-red-700 text-white">
                              Delete
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
              <TableCell colSpan={6}>
                <div className="flex justify-end items-center space-x-4 text-sm">
                  <div className="flex items-center">
                    <span className="text-muted-foreground mr-2">Total:</span>
                    <span className="font-medium">{totals.total}</span>
                  </div>
                  <div className="flex items-center">
                    <span className="text-muted-foreground mr-2">
                      Checked In:
                    </span>
                    <span className="font-medium text-green-600 dark:text-green-400">
                      {totals.checkedIn} ({totals.checkedInPercentage}%)
                    </span>
                  </div>
                  <div className="flex items-center">
                    <span className="text-muted-foreground mr-2">
                      Not Checked:
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
            <DialogTitle>Update Audience Member</DialogTitle>
            <DialogDescription>
              Modify the details of the audience member using the form below.
            </DialogDescription>
          </DialogHeader>
          {editingMember && (
            <AudienceMemberForm
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
            <DialogTitle>Add New Audience Member</DialogTitle>
            <DialogDescription>
              Enter the details of the new audience member using the form below.
            </DialogDescription>
          </DialogHeader>
          <AudienceMemberForm
            member={{
              id: 0,
              name: "",
              email: "",
              job: "",
              checkInStatus: "Not Checked",
              qrCode: "",
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
            <DialogTitle>QR Code for {showingQRCode?.name}</DialogTitle>
            <DialogDescription>
              Scan this QR code to access audience member details or for
              check-in.
            </DialogDescription>
          </DialogHeader>
          <div className="flex flex-col items-center justify-center p-4">
            <QRCodeSVG value={showingQRCode?.qrCode || ""} size={200} />
            <p className="mt-4 text-sm font-medium">{showingQRCode?.qrCode}</p>
          </div>
        </DialogContent>
      </Dialog>
    </Card>
  );
}

interface AudienceMemberFormProps {
  member: AudienceMember;
  onSubmit: (member: AudienceMember) => void;
  onCancel: () => void;
}

function AudienceMemberForm({
  member,
  onSubmit,
  onCancel,
}: AudienceMemberFormProps) {
  const [formData, setFormData] = useState<AudienceMember>(member);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const {name, value} = e.target;
    setFormData((prev) => ({...prev, [name]: value}));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <Label htmlFor="name">Name</Label>
        <Input
          id="name"
          name="name"
          value={formData.name}
          onChange={handleChange}
        />
      </div>
      <div>
        <Label htmlFor="email">Email</Label>
        <Input
          id="email"
          name="email"
          type="email"
          value={formData.email}
          onChange={handleChange}
        />
      </div>
      <div>
        <Label htmlFor="job">Job</Label>
        <Input
          id="job"
          name="job"
          value={formData.job}
          onChange={handleChange}
        />
      </div>
      <div>
        <Label htmlFor="checkInStatus">Check-in Status</Label>
        <select
          id="checkInStatus"
          name="checkInStatus"
          value={formData.checkInStatus}
          onChange={handleChange}
          className="w-full p-2 border rounded">
          <option value="Checked In">Checked In</option>
          <option value="Not Checked">Not Checked</option>
        </select>
      </div>
      <DialogFooter>
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit">Save</Button>
      </DialogFooter>
    </form>
  );
}
