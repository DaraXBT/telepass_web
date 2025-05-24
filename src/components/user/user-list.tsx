"use client";

import {useState} from "react";
import {Card, CardContent, CardHeader, CardTitle} from "@/components/ui/card";
import {Input} from "@/components/ui/input";
import {Button} from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {Badge} from "@/components/ui/badge";
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
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {MoreHorizontal, Trash} from "lucide-react";
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

interface User {
  id: string;
  name: string;
  email: string;
  role: string;
  status: "active" | "inactive";
}

const initialUsers: User[] = [
  {
    id: "1",
    name: "John Doe",
    email: "john@example.com",
    role: "Admin",
    status: "active",
  },
  {
    id: "2",
    name: "Jane Smith",
    email: "jane@example.com",
    role: "Organizer",
    status: "active",
  },
  {
    id: "3",
    name: "Bob Johnson",
    email: "bob@example.com",
    role: "Organizer",
    status: "inactive",
  },
  {
    id: "4",
    name: "Alice Brown",
    email: "alice@example.com",
    role: "Admin",
    status: "active",
  },
  {
    id: "5",
    name: "Charlie Davis",
    email: "charlie@example.com",
    role: "Organizer",
    status: "inactive",
  },
];

export function UserList() {
  const [users, setUsers] = useState(initialUsers);
  const [searchTerm, setSearchTerm] = useState("");
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const {toast} = useToast();
  const {t} = useLanguage();

  const filteredUsers = users.filter(
    (user) =>
      user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.role.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.status.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleUpdateUser = (updatedUser: User) => {
    setUsers(
      users.map((user) => (user.id === updatedUser.id ? updatedUser : user))
    );
    setEditingUser(null);
    toast({
      title: t("User updated"),
      description: `${updatedUser.name}${t("'s information has been updated.")}`,
      variant: "success",
    });
  };

  const handleDeleteUser = (id: string) => {
    const userToDelete = users.find((user) => user.id === id);
    setUsers(users.filter((user) => user.id !== id));
    toast({
      title: t("User deleted"),
      description: `${userToDelete?.name} ${t("has been removed from the system.")}`,
      variant: "destructive",
    });
  };

  const handleAddUser = (newUser: Omit<User, "id">) => {
    const id = (Math.max(...users.map((u) => parseInt(u.id))) + 1).toString();
    const user = {...newUser, id};
    setUsers([...users, user]);
    setEditingUser(null);
    toast({
      title: t("User added"),
      description: `${user.name} ${t("has been added to the system.")}`,
      variant: "success",
    });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>{t("Users")}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex justify-between items-center mb-4 gap-4">
          <Input
            placeholder={t("Search...")}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="flex-grow"
          />
          <Button
            onClick={() =>
              setEditingUser({
                id: "",
                name: "",
                email: "",
                role: "Organizer",
                status: "active",
              })
            }>
            {t("Add User")}
          </Button>
        </div>
        <div className="overflow-auto max-h-[600px]">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>{t("Name")}</TableHead>
                <TableHead>{t("Email")}</TableHead>
                <TableHead>{t("Role")}</TableHead>
                <TableHead>{t("Status")}</TableHead>
                <TableHead className="text-right">{t("Actions")}</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredUsers.map((user) => (
                <TableRow key={user.id}>
                  <TableCell className="max-w-[200px]">
                    <span className="block truncate">{user.name}</span>
                  </TableCell>
                  <TableCell className="min-w-[200px]">{user.email}</TableCell>
                  <TableCell>{t(user.role)}</TableCell>
                  <TableCell>
                    <Badge
                      variant={
                        user.status === "active" ? "default" : "secondary"
                      }
                      className={`px-2 py-0.5 rounded-full text-xs font-medium inline-flex items-center justify-center w-24 ${
                        user.status === "active"
                          ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100"
                          : "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-100"
                      }`}>
                      <span
                        className={`inline-block w-2 h-2 rounded-full mr-1.5 ${
                          user.status === "active"
                            ? "bg-green-500 dark:bg-green-400"
                            : "bg-red-500 dark:bg-red-400"
                        }`}></span>
                      {t(user.status === "active" ? "Active" : "Inactive")}
                    </Badge>
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
                              <AlertDialogCancel>
                                {t("Cancel")}
                              </AlertDialogCancel>
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
        </div>
      </CardContent>
      <Dialog
        open={!!editingUser}
        onOpenChange={(open) => !open && setEditingUser(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {editingUser?.id ? t("Update User") : t("Add User")}
            </DialogTitle>
            <DialogDescription>
              {editingUser?.id
                ? t("Modify the user's information using the form below.")
                : t("Add a new user to the system.")}
            </DialogDescription>
          </DialogHeader>
          {editingUser && (
            <UserForm
              user={editingUser}
              onSubmit={editingUser.id ? handleUpdateUser : handleAddUser}
              submitLabel={editingUser.id ? t("Update User") : t("Add User")}
            />
          )}
        </DialogContent>
      </Dialog>
    </Card>
  );
}

interface UserFormProps {
  user: User;
  onSubmit: (user: User) => void;
  submitLabel: string;
}

function UserForm({user, onSubmit, submitLabel}: UserFormProps) {
  const [formData, setFormData] = useState<User>(user);
  const [errors, setErrors] = useState<{[key: string]: string}>({});
  const {t} = useLanguage();
  const {toast} = useToast();

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const {name, value} = e.target;
    setFormData((prev) => ({...prev, [name]: value}));
    // Clear error when field is edited
    if (errors[name]) {
      setErrors((prev) => ({...prev, [name]: ""}));
    }
  };
  const validateForm = () => {
    const newErrors: {[key: string]: string} = {};

    if (!formData.name.trim()) {
      newErrors.name = t("Name is required");
    }

    if (!formData.email.trim()) {
      newErrors.email = t("Email is required");
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = t("Email is invalid");
    }

    if (!formData.role) {
      newErrors.role = t("Role is required");
    }

    if (!formData.status) {
      newErrors.status = t("Status is required");
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (validateForm()) {
      onSubmit(formData);
    } else {
      toast({
        title: t("Validation Error"),
        description: t("Please fill in all required fields correctly"),
        variant: "destructive",
      });
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <Label htmlFor="name">{t("Name")}</Label>
        <Input
          id="name"
          name="name"
          value={formData.name}
          onChange={handleChange}
          className={errors.name ? "border-red-500" : ""}
        />
        {errors.name && (
          <p className="text-xs text-red-500 mt-1">{errors.name}</p>
        )}
      </div>
      <div>
        <Label htmlFor="email">{t("Email")}</Label>
        <Input
          id="email"
          name="email"
          type="email"
          value={formData.email}
          onChange={handleChange}
          className={errors.email ? "border-red-500" : ""}
        />
        {errors.email && (
          <p className="text-xs text-red-500 mt-1">{errors.email}</p>
        )}
      </div>{" "}
      <div>
        <Label htmlFor="role">{t("Role")}</Label>
        <Select
          name="role"
          value={formData.role}
          onValueChange={(value) => {
            handleChange({target: {name: "role", value}} as any);
            if (errors.role) setErrors((prev) => ({...prev, role: ""}));
          }}>
          <SelectTrigger className={errors.role ? "border-red-500" : ""}>
            <SelectValue placeholder={t("Select role")} />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="Admin">{t("Admin")}</SelectItem>
            <SelectItem value="Organizer">{t("Organizer")}</SelectItem>
          </SelectContent>
        </Select>
        {errors.role && (
          <p className="text-xs text-red-500 mt-1">{errors.role}</p>
        )}
      </div>
      <div>
        <Label htmlFor="status">{t("Status")}</Label>
        <Select
          name="status"
          value={formData.status}
          onValueChange={(value) => {
            handleChange({target: {name: "status", value}} as any);
            if (errors.status) setErrors((prev) => ({...prev, status: ""}));
          }}>
          <SelectTrigger className={errors.status ? "border-red-500" : ""}>
            <SelectValue placeholder={t("Select status")} />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="active">{t("Active")}</SelectItem>
            <SelectItem value="inactive">{t("Inactive")}</SelectItem>
          </SelectContent>
        </Select>
        {errors.status && (
          <p className="text-xs text-red-500 mt-1">{errors.status}</p>
        )}
      </div>
      <DialogFooter>
        <Button type="submit">{submitLabel}</Button>
      </DialogFooter>
    </form>
  );
}
