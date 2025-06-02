import React, {useState, useEffect} from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogDescription,
} from "@/components/ui/dialog";
import {Button} from "@/components/ui/button";
import {Checkbox} from "@/components/ui/checkbox";
import {ScrollArea} from "@/components/ui/scroll-area";
import {Input} from "@/components/ui/input";
import {Search} from "lucide-react";

interface User {
  id: string;
  name: string;
  email: string;
  role: "admin" | "event_organizer";
}

interface UserSelectPopupProps {
  selectedUsers: User[];
  onSelectUsers: (users: User[]) => void;
}

export function UserSelectPopup({
  selectedUsers,
  onSelectUsers,
}: UserSelectPopupProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [users, setUsers] = useState<User[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedUserIds, setSelectedUserIds] = useState<Set<string>>(
    new Set(selectedUsers.map((u) => u.id))
  );

  useEffect(() => {
    // Simulated API call to fetch users
    const fetchUsers = async () => {
      // In a real application, this would be an API call
      await new Promise((resolve) => setTimeout(resolve, 500));
      setUsers([
        {
          id: "1",
          name: "John Doe",
          email: "john@example.com",
          role: "event_organizer",
        },
        {id: "2", name: "Jane Smith", email: "jane@example.com", role: "admin"},
        {
          id: "3",
          name: "Alice Johnson",
          email: "alice@example.com",
          role: "event_organizer",
        },
        {
          id: "4",
          name: "Bob Brown",
          email: "bob@example.com",
          role: "event_organizer",
        },
        {
          id: "5",
          name: "Charlie Davis",
          email: "charlie@example.com",
          role: "admin",
        },
      ]);
    };
    fetchUsers();
  }, []);

  const filteredUsers = users.filter(
    (user) =>
      user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleUserToggle = (userId: string) => {
    const newSelectedUserIds = new Set(selectedUserIds);
    if (newSelectedUserIds.has(userId)) {
      newSelectedUserIds.delete(userId);
    } else {
      newSelectedUserIds.add(userId);
    }
    setSelectedUserIds(newSelectedUserIds);
  };

  const handleSave = () => {
    const selectedUsers = users.filter((user) => selectedUserIds.has(user.id));
    onSelectUsers(selectedUsers);
    setIsOpen(false);
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button
          variant="outline"
          className="w-full justify-start text-left font-normal">
          <span className="truncate">
            {selectedUsers.length > 0
              ? `${selectedUsers.length} User${selectedUsers.length > 1 ? "s" : ""} Selected`
              : "Select Users"}
          </span>
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Select Users</DialogTitle>
          <DialogDescription>
            Choose the users you want to add to this event or group.
          </DialogDescription>
        </DialogHeader>
        <div className="py-4">
          <div className="relative mb-4">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search users..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-8"
            />
          </div>
          <ScrollArea className="h-[300px] rounded-md border p-4">
            {filteredUsers.map((user) => (
              <div key={user.id} className="flex items-center space-x-2 py-2">
                <Checkbox
                  id={`user-${user.id}`}
                  checked={selectedUserIds.has(user.id)}
                  onCheckedChange={() => handleUserToggle(user.id)}
                />
                <label
                  htmlFor={`user-${user.id}`}
                  className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                  {user.name} ({user.email})
                </label>
              </div>
            ))}
          </ScrollArea>
        </div>
        <div className="flex justify-end">
          <Button onClick={handleSave}>Save</Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
