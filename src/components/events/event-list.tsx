"use client";

import {useState, useMemo} from "react";
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
} from "@/components/ui/dialog";
import {Label} from "@/components/ui/label";
import {Textarea} from "@/components/ui/textarea";
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
import {MoreHorizontal, Plus, QrCode, Trash} from "lucide-react";
import {QRCodeSVG} from "qrcode.react";
import Link from "next/link";
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

interface Event {
  id: number;
  name: string;
  description: string;
  startDateTime: string;
  endDateTime: string;
  location: string;
  status: "upcoming" | "ongoing" | "finished";
  category: string;
  qrCode: string;
  capacity: number;
  registeredAttendees: number;
}

const initialEvents: Event[] = [
  {
    id: 1,
    name: "Tech Conference 2024",
    description:
      "Annual technology conference featuring the latest innovations and industry trends.",
    startDateTime: "2024-06-15T09:00",
    endDateTime: "2024-06-15T17:00",
    location: "San Francisco Convention Center, CA",
    status: "upcoming",
    category: "Conferences",
    qrCode: "TECH2024-001",
    capacity: 1000,
    registeredAttendees: 750,
  },
  {
    id: 2,
    name: "Digital Marketing Workshop",
    description:
      "Hands-on workshop covering the latest digital marketing strategies and tools.",
    startDateTime: "2024-06-20T10:00",
    endDateTime: "2024-06-20T15:00",
    location: "New York Business Center, NY",
    status: "ongoing",
    category: "Workshops",
    qrCode: "DMW2024-002",
    capacity: 100,
    registeredAttendees: 85,
  },
  {
    id: 3,
    name: "Startup Networking Event",
    description:
      "Connect with fellow entrepreneurs and investors in this dynamic networking session.",
    startDateTime: "2024-06-25T18:00",
    endDateTime: "2024-06-25T21:00",
    location: "Austin Startup Hub, TX",
    status: "upcoming",
    category: "Networking",
    qrCode: "SNE2024-003",
    capacity: 200,
    registeredAttendees: 150,
  },
];

const categories = [
  "Conferences",
  "Workshops",
  "Seminars",
  "Networking",
  "Other",
];

export function EventList() {
  const [events, setEvents] = useState<Event[]>(initialEvents);
  const [searchTerm, setSearchTerm] = useState("");
  const [editingEvent, setEditingEvent] = useState<Event | null>(null);
  const [categoryFilter, setCategoryFilter] = useState<string>("All");
  const [showingQRCode, setShowingQRCode] = useState<Event | null>(null);
  const [sortBy, setSortBy] = useState<keyof Event>("startDateTime");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");
  const {toast} = useToast();

  const filteredEvents = events
    .filter(
      (event) =>
        (event.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          event.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
          event.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
          event.location.toLowerCase().includes(searchTerm.toLowerCase())) &&
        (categoryFilter === "All" || event.category === categoryFilter)
    )
    .sort((a, b) => {
      if (a[sortBy] < b[sortBy]) return sortOrder === "asc" ? -1 : 1;
      if (a[sortBy] > b[sortBy]) return sortOrder === "asc" ? 1 : -1;
      return 0;
    });

  const totals = useMemo(() => {
    const total = filteredEvents.length;
    const totalCapacity = filteredEvents.reduce(
      (sum, event) => sum + event.capacity,
      0
    );
    const totalRegistered = filteredEvents.reduce(
      (sum, event) => sum + event.registeredAttendees,
      0
    );
    const registrationPercentage =
      totalCapacity > 0
        ? Math.round((totalRegistered / totalCapacity) * 100)
        : 0;
    return {total, totalCapacity, totalRegistered, registrationPercentage};
  }, [filteredEvents]);

  const handleUpdateEvent = (updatedEvent: Event) => {
    setEvents(
      events.map((event) =>
        event.id === updatedEvent.id ? updatedEvent : event
      )
    );
    setEditingEvent(null);
    toast({
      title: "Event updated",
      description: `${updatedEvent.name} has been successfully updated.`,
    });
  };

  const handleAddEvent = (newEvent: Event) => {
    const newId = Math.max(...events.map((e) => e.id)) + 1;
    const newQRCode = `${newEvent.name.replace(/\s+/g, "").toUpperCase().slice(0, 3)}${new Date().getFullYear()}-${newId.toString().padStart(3, "0")}`;
    setEvents([...events, {...newEvent, id: newId, qrCode: newQRCode}]);
    toast({
      title: "Event added",
      description: `${newEvent.name} has been successfully added.`,
    });
  };

  const handleDeleteEvent = (id: number) => {
    const eventToDelete = events.find((event) => event.id === id);
    setEvents(events.filter((event) => event.id !== id));
    toast({
      title: "Event deleted",
      description: `${eventToDelete?.name} has been removed.`,
      variant: "destructive",
    });
  };

  const toggleSort = (column: keyof Event) => {
    setSortBy(column);
    setSortOrder((current) => (current === "asc" ? "desc" : "asc"));
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Events</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex items-center space-x-4 mb-4">
          <div className="flex-grow">
            <Input
              placeholder="Search events..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full"
            />
          </div>
          <Select value={categoryFilter} onValueChange={setCategoryFilter}>
            <SelectTrigger className="w-[200px]">
              <SelectValue placeholder="Filter by category" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="All">All Categories</SelectItem>
              {categories.map((category) => (
                <SelectItem key={category} value={category}>
                  {category}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Button
            onClick={() =>
              setEditingEvent({
                id: 0,
                name: "",
                description: "",
                startDateTime: "",
                endDateTime: "",
                location: "",
                status: "upcoming",
                category: "",
                qrCode: "",
                capacity: 0,
                registeredAttendees: 0,
              })
            }>
            <Plus className="h-4 w-4 mr-2" /> Add Event
          </Button>
        </div>
        <div className="overflow-x-auto overflow-y-auto max-h-[600px] border rounded-md">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[30%] min-w-[200px]">Event</TableHead>
                <TableHead className="w-[15%] min-w-[100px]">Status</TableHead>
                <TableHead className="w-[15%] min-w-[100px]">
                  Category
                </TableHead>
                <TableHead className="w-[20%] min-w-[150px]">
                  Capacity
                </TableHead>
                <TableHead className="w-[15%] min-w-[100px]">QR Code</TableHead>
                <TableHead className="w-[5%] min-w-[50px] text-right">
                  Actions
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredEvents.map((event) => (
                <TableRow key={event.id}>
                  <TableCell>
                    <Link
                      href={`/events/${event.id}`}
                      className="font-medium hover:underline">
                      {event.name}
                    </Link>
                    <div className="text-sm text-muted-foreground">
                      {event.description}
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge
                      variant={
                        event.status === "upcoming"
                          ? "default"
                          : event.status === "ongoing"
                            ? "secondary"
                            : "outline"
                      }
                      className={`px-2 py-0.5 rounded-full text-xs font-medium inline-flex items-center justify-center w-24 ${
                        event.status === "upcoming"
                          ? "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-100"
                          : event.status === "ongoing"
                            ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100"
                            : "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-100"
                      }`}>
                      <span
                        className={`inline-block w-2 h-2 rounded-full mr-1.5 ${
                          event.status === "upcoming"
                            ? "bg-blue-500 dark:bg-blue-400"
                            : event.status === "ongoing"
                              ? "bg-green-500 dark:bg-green-400"
                              : "bg-yellow-500 dark:bg-yellow-400"
                        }`}></span>
                      {event.status.charAt(0).toUpperCase() +
                        event.status.slice(1)}
                    </Badge>
                  </TableCell>
                  <TableCell>{event.category}</TableCell>
                  <TableCell>
                    <div className="flex flex-col space-y-1">
                      <span className="text-sm font-medium">
                        {event.registeredAttendees} / {event.capacity}
                      </span>
                      <progress
                        className="w-full h-2"
                        value={event.registeredAttendees}
                        max={event.capacity}
                      />
                      <span className="text-xs text-muted-foreground">
                        {Math.round(
                          (event.registeredAttendees / event.capacity) * 100
                        )}
                        % Full
                      </span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setShowingQRCode(event)}>
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
                        <DropdownMenuLabel>Actions</DropdownMenuLabel>
                        <DropdownMenuItem
                          onClick={() => setEditingEvent(event)}>
                          Edit
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <DropdownMenuItem
                              onSelect={(e) => e.preventDefault()}
                              className="text-red-600 dark:text-red-400">
                              <Trash className="mr-2 h-4 w-4" />
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
                                permanently delete the event and remove the data
                                from our servers.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>Cancel</AlertDialogCancel>
                              <AlertDialogAction
                                onClick={() => handleDeleteEvent(event.id)}
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
          </Table>
        </div>
        <div className="mt-4 border-t pt-4">
          <div className="flex justify-end items-center space-x-4 text-sm">
            <div className="flex items-center">
              <span className="text-muted-foreground mr-2">Total Events:</span>
              <span className="font-medium">{totals.total}</span>
            </div>
            <div className="flex items-center">
              <span className="text-muted-foreground mr-2">
                Total Capacity:
              </span>
              <span className="font-medium">{totals.totalCapacity}</span>
            </div>
            <div className="flex items-center">
              <span className="text-muted-foreground mr-2">
                Total Registered:
              </span>
              <span className="font-medium">
                {totals.totalRegistered} ({totals.registrationPercentage}%)
              </span>
            </div>
          </div>
        </div>
      </CardContent>
      <Dialog
        open={!!editingEvent}
        onOpenChange={(open) => !open && setEditingEvent(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {editingEvent?.id === 0 ? "Add New Event" : "Update Event"}
            </DialogTitle>
          </DialogHeader>
          {editingEvent && (
            <EventForm
              event={editingEvent}
              onSubmit={
                editingEvent.id === 0 ? handleAddEvent : handleUpdateEvent
              }
            />
          )}
        </DialogContent>
      </Dialog>
      <Dialog
        open={!!showingQRCode}
        onOpenChange={(open) => !open && setShowingQRCode(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>QR Code for {showingQRCode?.name}</DialogTitle>
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

interface EventFormProps {
  event: Event;
  onSubmit: (event: Event) => void;
}

function EventForm({event, onSubmit}: EventFormProps) {
  const [formData, setFormData] = useState<Event>(event);
  const [errors, setErrors] = useState<Partial<Record<keyof Event, string>>>(
    {}
  );

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const {name, value} = e.target;
    setFormData((prev) => ({...prev, [name]: value}));
    // Clear the error when the user starts typing
    setErrors((prev) => ({...prev, [name]: ""}));
  };

  const validateForm = (): boolean => {
    const newErrors: Partial<Record<keyof Event, string>> = {};
    if (!formData.name) newErrors.name = "Name is required";
    if (!formData.description)
      newErrors.description = "Description is required";
    if (!formData.startDateTime)
      newErrors.startDateTime = "Start date and time is required";
    if (!formData.endDateTime)
      newErrors.endDateTime = "End date and time is required";
    if (new Date(formData.endDateTime) <= new Date(formData.startDateTime)) {
      newErrors.endDateTime = "End date must be after start date";
    }
    if (!formData.location) newErrors.location = "Location is required";
    if (!formData.category) newErrors.category = "Category is required";
    if (formData.capacity <= 0)
      newErrors.capacity = "Capacity must be greater than 0";
    if (formData.registeredAttendees < 0)
      newErrors.registeredAttendees = "Registered attendees cannot be negative";
    if (formData.registeredAttendees > formData.capacity)
      newErrors.registeredAttendees =
        "Registered attendees cannot exceed capacity";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateForm()) {
      onSubmit(formData);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <Label htmlFor="name">Event Name</Label>
        <Input
          id="name"
          name="name"
          value={formData.name}
          onChange={handleChange}
        />
        {errors.name && (
          <p className="text-red-500 text-sm mt-1">{errors.name}</p>
        )}
      </div>
      <div>
        <Label htmlFor="description">Description</Label>
        <Textarea
          id="description"
          name="description"
          value={formData.description}
          onChange={handleChange}
        />
        {errors.description && (
          <p className="text-red-500 text-sm mt-1">{errors.description}</p>
        )}
      </div>
      <div>
        <Label htmlFor="startDateTime">Start Date and Time</Label>
        <Input
          id="startDateTime"
          name="startDateTime"
          type="datetime-local"
          value={formData.startDateTime}
          onChange={handleChange}
        />
        {errors.startDateTime && (
          <p className="text-red-500 text-sm mt-1">{errors.startDateTime}</p>
        )}
      </div>
      <div>
        <Label htmlFor="endDateTime">End Date and Time</Label>
        <Input
          id="endDateTime"
          name="endDateTime"
          type="datetime-local"
          value={formData.endDateTime}
          onChange={handleChange}
        />
        {errors.endDateTime && (
          <p className="text-red-500 text-sm mt-1">{errors.endDateTime}</p>
        )}
      </div>
      <div>
        <Label htmlFor="location">Location</Label>
        <Input
          id="location"
          name="location"
          value={formData.location}
          onChange={handleChange}
        />
        {errors.location && (
          <p className="text-red-500 text-sm mt-1">{errors.location}</p>
        )}
      </div>
      <div>
        <Label htmlFor="status">Status</Label>
        <Select
          name="status"
          value={formData.status}
          onValueChange={(value) =>
            handleChange({target: {name: "status", value}} as any)
          }>
          <SelectTrigger>
            <SelectValue placeholder="Select status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="upcoming">Upcoming</SelectItem>
            <SelectItem value="ongoing">Ongoing</SelectItem>
            <SelectItem value="finished">Finished</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <div>
        <Label htmlFor="category">Category</Label>
        <Select
          name="category"
          value={formData.category}
          onValueChange={(value) =>
            handleChange({target: {name: "category", value}} as any)
          }>
          <SelectTrigger>
            <SelectValue placeholder="Select category" />
          </SelectTrigger>
          <SelectContent>
            {categories.map((category) => (
              <SelectItem key={category} value={category}>
                {category}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        {errors.category && (
          <p className="text-red-500 text-sm mt-1">{errors.category}</p>
        )}
      </div>
      <div>
        <Label htmlFor="capacity">Capacity</Label>
        <Input
          id="capacity"
          name="capacity"
          type="number"
          value={formData.capacity}
          onChange={handleChange}
        />
        {errors.capacity && (
          <p className="text-red-500 text-sm mt-1">{errors.capacity}</p>
        )}
      </div>
      <div>
        <Label htmlFor="registeredAttendees">Registered Attendees</Label>
        <Input
          id="registeredAttendees"
          name="registeredAttendees"
          type="number"
          value={formData.registeredAttendees}
          onChange={handleChange}
        />
        {errors.registeredAttendees && (
          <p className="text-red-500 text-sm mt-1">
            {errors.registeredAttendees}
          </p>
        )}
      </div>
      <DialogFooter>
        <Button type="submit">
          {event.id === 0 ? "Add Event" : "Update Event"}
        </Button>
      </DialogFooter>
    </form>
  );
}
