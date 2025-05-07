"use client";

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
import {Badge} from "@/components/ui/badge";
import {Button} from "@/components/ui/button";
import {Card, CardContent, CardHeader, CardTitle} from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {Input} from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {useToast} from "@/hooks/use-toast";
import {useLanguage} from "@/components/providers/LanguageProvider";
import axios from "axios";
import {MoreHorizontal, Plus, QrCode, Trash} from "lucide-react";
import {useEffect, useMemo, useState} from "react";

interface ApiResponse {
  message: string;
  payload: User[];
  status: string | null;
  date: string;
}

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
  checkInStatus?: "Checked In" | "Not Checked";
  qrCode?: string;
}

export function AudienceList() {
  const {t} = useLanguage();
  const [users, setUsers] = useState<User[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [isAddingUser, setIsAddingUser] = useState(false);
  const [showingQRCode, setShowingQRCode] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const {toast} = useToast();

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await axios.get<ApiResponse>(
          "http://localhost:8080/api/v1/auth/getUSer"
        );
        const usersWithStatus = response.data.payload.map((user) => ({
          ...user,
          checkInStatus: "Not Checked" as const,
          qrCode: `USER-${user.id.slice(0, 8)}`,
        }));
        setUsers(usersWithStatus);
      } catch (error) {
        toast({
          title: t("Error fetching users"),
          description: t("Failed to load user data. Please try again later."),
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchUsers();
  }, [toast, t]);

  const filteredUsers = useMemo(() => {
    return users.filter(
      (user) =>
        user.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.phoneNumber.includes(searchTerm)
    );
  }, [users, searchTerm]);

  const handleUpdateUser = async (updatedUser: User) => {
    try {
      // Add your API update call here
      setUsers(
        users.map((user) => (user.id === updatedUser.id ? updatedUser : user))
      );
      setEditingUser(null);
      toast({
        title: t("User updated"),
        description: `${updatedUser.fullName} ${t("'s information has been updated.")}`,
      });
    } catch (error) {
      toast({
        title: t("Error updating user"),
        description: t("Failed to update user information."),
        variant: "destructive",
      });
    }
  };

  const handleAddUser = async (newUser: User) => {
    try {
      // Add your API create call here
      const qrCode = `USER-${Date.now().toString(36)}`;
      setUsers([...users, {...newUser, qrCode}]);
      setIsAddingUser(false);
      toast({
        title: t("User added"),
        description: `${newUser.fullName} ${t("has been added to the system.")}`,
      });
    } catch (error) {
      toast({
        title: t("Error adding user"),
        description: t("Failed to add new user."),
        variant: "destructive",
      });
    }
  };

  const handleDeleteUser = async (id: string) => {
    try {
      // Add your API delete call here
      const userToDelete = users.find((user) => user.id === id);
      setUsers(users.filter((user) => user.id !== id));
      toast({
        title: t("User deleted"),
        description: `${userToDelete?.fullName} ${t("has been removed from the system.")}`,
      });
    } catch (error) {
      toast({
        title: t("Error deleting user"),
        description: t("Failed to delete user."),
        variant: "destructive",
      });
    }
  };

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
          <Button onClick={() => setIsAddingUser(true)}>
            <Plus className="h-4 w-4 mr-2" /> {t("Add User")}
          </Button>
        </div>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>{t("Name")}</TableHead>
              <TableHead>{t("Email")}</TableHead>
              <TableHead>{t("Phone Number")}</TableHead>
              <TableHead>{t("Occupation")}</TableHead>
              <TableHead>{t("Gender")}</TableHead>
              <TableHead>{t("Status")}</TableHead>
              <TableHead>{t("QR Code")}</TableHead>
              <TableHead className="text-right">{t("Actions")}</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredUsers.map((user) => (
              <TableRow key={user.id}>
                <TableCell>{user.fullName}</TableCell>
                <TableCell>{user.email}</TableCell>
                <TableCell>{user.phoneNumber}</TableCell>
                <TableCell>{user.occupation}</TableCell>
                <TableCell>{t(user.gender)}</TableCell>
                <TableCell>
                  <Badge
                    variant={
                      user.checkInStatus === "Checked In"
                        ? "default"
                        : "secondary"
                    }
                    className="px-2 py-0.5 rounded-full text-xs font-medium inline-flex items-center justify-center w-28">
                    {t(user.checkInStatus || "")}
                  </Badge>
                </TableCell>
                <TableCell>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setShowingQRCode(user)}>
                    <QrCode className="h-4 w-4 mr-2" />
                    {t("View")}
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
                      <DropdownMenuItem onClick={() => setEditingUser(user)}>
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
                            <AlertDialogCancel>{t("Cancel")}</AlertDialogCancel>
                            <AlertDialogAction
                              onClick={() => handleDeleteUser(user.id)}
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
        </Table>
      </CardContent>
      {/* Add UserForm component here similar to AudienceMemberForm but with updated fields */}
    </Card>
  );
}
