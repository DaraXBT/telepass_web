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
  DialogDescription,
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
import {DateTimePicker} from "@/components/ui/date-time-picker";
import {UserSelectPopup} from "@/components/user/user-select-popup";
import {useLanguage} from "@/components/providers/LanguageProvider";

export const EventList: React.FC = () => {
  const {t} = useLanguage();
  const [events, setEvents] = useState<Event[]>(initialEvents);
  const [searchTerm, setSearchTerm] = useState("");
  const [editingEvent, setEditingEvent] = useState<Event | null>(null);
  const [categoryFilter, setCategoryFilter] = useState<string>("All");
  const [showingQRCode, setShowingQRCode] = useState<Event | null>(null);
  const [sortBy, setSortBy] = useState<keyof Event>("startDateTime");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");
  const [isEventFormOpen, setIsEventFormOpen] = useState(false);
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
    setIsEventFormOpen(false);
    toast({
      title: t("Event updated"),
      description: `"${updatedEvent.name}" ${t("has been successfully updated.")}`,
      variant: "success",
    });
  };

  const handleAddEvent = (newEvent: Event) => {
    const newId = Math.max(...events.map((e) => e.id)) + 1;
    const newQRCode = `${newEvent.name.replace(/\s+/g, "").toUpperCase().slice(0, 3)}${new Date().getFullYear()}-${newId.toString().padStart(3, "0")}`;
    setEvents([...events, {...newEvent, id: newId, qrCode: newQRCode}]);
    setIsEventFormOpen(false);
    toast({
      title: t("Event added"),
      description: `"${newEvent.name}" ${t("has been successfully added to the event list.")}`,
      variant: "success",
    });
  };

  const handleDeleteEvent = (id: number) => {
    const eventToDelete = events.find((event) => event.id === id);
    setEvents(events.filter((event) => event.id !== id));
    toast({
      title: t("Event deleted"),
      description: `"${eventToDelete?.name}" ${t("has been removed from the event list.")}`,
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
        <CardTitle>{t("Events")}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex items-center space-x-4 mb-4">
          <div className="flex-grow">
            <Input
              placeholder={t("Search events...")}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full"
            />
          </div>
          <Select value={categoryFilter} onValueChange={setCategoryFilter}>
            <SelectTrigger className="w-[200px]">
              <SelectValue placeholder={t("Filter by category")} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="All">{t("All Categories")}</SelectItem>
              {categories.map((category) => (
                <SelectItem key={category} value={category}>
                  {category}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Button
            onClick={() => {
              setEditingEvent({
                id: 0,
                name: "",
                description: "",
                startDateTime: new Date(),
                endDateTime: new Date(),
                location: "",
                status: "upcoming",
                category: "",
                qrCode: "",
                capacity: 0,
                registeredAttendees: 0,
                organizers: [],
              });
              setIsEventFormOpen(true);
            }}>
            <Plus className="h-4 w-4 mr-2" /> {t("Add Event")}
          </Button>
        </div>
        <div className="overflow-x-auto overflow-y-auto max-h-[600px] border rounded-md">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[30%] min-w-[200px]">
                  {t("Event")}
                </TableHead>
                <TableHead className="w-[15%] min-w-[100px]">
                  {t("Status")}
                </TableHead>
                <TableHead className="w-[15%] min-w-[100px]">
                  {t("Category")}
                </TableHead>
                <TableHead className="w-[20%] min-w-[150px]">
                  {t("Capacity")}
                </TableHead>
                <TableHead className="w-[15%] min-w-[100px]">
                  {t("Organizers")}
                </TableHead>
                <TableHead className="w-[15%] min-w-[100px]">
                  {t("QR Code")}
                </TableHead>
                <TableHead className="w-[5%] min-w-[50px] text-right">
                  {t("Actions")}
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
                      {t(
                        event.status.charAt(0).toUpperCase() +
                          event.status.slice(1)
                      )}
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
                        % {t("Full")}
                      </span>
                    </div>
                  </TableCell>
                  <TableCell>
                    {event.organizers.map((org) => org.name).join(", ")}
                  </TableCell>
                  <TableCell>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setShowingQRCode(event)}>
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
                        <DropdownMenuItem
                          onClick={() => {
                            setEditingEvent(event);
                            setIsEventFormOpen(true);
                          }}>
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
                                  "This action cannot be undone. This will permanently delete the event and remove the data from our servers."
                                )}
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>
                                {t("Cancel")}
                              </AlertDialogCancel>
                              <AlertDialogAction
                                onClick={() => handleDeleteEvent(event.id)}
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
        <div className="mt-4 border-t pt-4">
          <div className="flex justify-end items-center space-x-4 text-sm">
            <div className="flex items-center">
              <span className="text-muted-foreground mr-2">
                {t("Total Events")}:
              </span>
              <span className="font-medium">{totals.total}</span>
            </div>
            <div className="flex items-center">
              <span className="text-muted-foreground mr-2">
                {t("Total Capacity")}:
              </span>
              <span className="font-medium">{totals.totalCapacity}</span>
            </div>
            <div className="flex items-center">
              <span className="text-muted-foreground mr-2">
                {t("Total Registered")}:
              </span>
              <span className="font-medium">
                {totals.totalRegistered} ({totals.registrationPercentage}%)
              </span>
            </div>
          </div>
        </div>
      </CardContent>
      <Dialog open={isEventFormOpen} onOpenChange={setIsEventFormOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>
              {editingEvent?.id === 0 ? t("Add New Event") : t("Update Event")}
            </DialogTitle>
            <DialogDescription>
              {editingEvent?.id === 0
                ? t("Create a new event by filling out the form below.")
                : t("Update the event details using the form below.")}
            </DialogDescription>
          </DialogHeader>
          {editingEvent && (
            <EventForm
              event={editingEvent}
              onSubmit={
                editingEvent.id === 0 ? handleAddEvent : handleUpdateEvent
              }
              onCancel={() => setIsEventFormOpen(false)}
            />
          )}
        </DialogContent>
      </Dialog>
      <Dialog
        open={!!showingQRCode}
        onOpenChange={(open) => !open && setShowingQRCode(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {t("QR Code for")} {showingQRCode?.name}
            </DialogTitle>
            <DialogDescription>
              {t("Scan this QR code to access event details or check-in.")}
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
};

interface EventFormProps {
  event: Event;
  onSubmit: (event: Event) => void;
  onCancel: () => void;
}

function EventForm({event, onSubmit, onCancel}: EventFormProps) {
  const {t} = useLanguage();
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState<Event>(event);
  const [errors, setErrors] = useState<Partial<Record<keyof Event, string>>>(
    {}
  );
  const [selectedOrganizers, setSelectedOrganizers] = useState<User[]>(
    event.organizers || []
  );

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const {name, value} = e.target;
    setFormData((prev) => ({...prev, [name]: value}));
    setErrors((prev) => ({...prev, [name]: ""}));
  };

  const handleDateChange = (
    date: Date | null,
    field: "startDateTime" | "endDateTime"
  ) => {
    if (date) {
      setFormData((prev) => ({...prev, [field]: date}));
      setErrors((prev) => ({...prev, [field]: ""}));
    }
  };

  const validateStep = (currentStep: number): boolean => {
    const newErrors: Partial<Record<keyof Event, string>> = {};
    switch (currentStep) {
      case 1:
        if (!formData.name) newErrors.name = t("Name is required");
        if (!formData.startDateTime)
          newErrors.startDateTime = t("Start date and time is required");
        if (!formData.endDateTime)
          newErrors.endDateTime = t("End date and time is required");
        if (formData.endDateTime <= formData.startDateTime) {
          newErrors.endDateTime = t("End date must be after start date");
        }
        break;
      case 2:
        if (!formData.description)
          newErrors.description = t("Description is required");
        if (!formData.location) newErrors.location = t("Location is required");
        if (!formData.category) newErrors.category = t("Category is required");
        break;
      case 3:
        if (!formData.capacity) newErrors.capacity = t("Capacity is required");
        if (formData.capacity <= 0)
          newErrors.capacity = t("Capacity must be greater than 0");
        if (!formData.registeredAttendees)
          newErrors.registeredAttendees = t("Registered Attendees is required");
        if (formData.registeredAttendees < 0)
          newErrors.registeredAttendees = t(
            "Registered attendees cannot be negative"
          );
        if (formData.registeredAttendees > formData.capacity)
          newErrors.registeredAttendees = t(
            "Registered attendees cannot exceed capacity"
          );
        if (selectedOrganizers.length === 0)
          newErrors.organizers = t("At least one user must be selected");
        break;
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (validateStep(step)) {
      setStep((prev) => prev + 1);
    }
  };

  const handleBack = () => {
    setStep((prev) => prev - 1);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateStep(3)) {
      onSubmit({...formData, organizers: selectedOrganizers});
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {step === 1 && (
        <>
          <div>
            <Label htmlFor="name">{t("Event Name")}</Label>
            <Input
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className="w-full"
            />
            {errors.name && (
              <p className="text-red-500 text-sm mt-1">{errors.name}</p>
            )}
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="startDateTime">{t("Start Date and Time")}</Label>
              <DateTimePicker
                value={formData.startDateTime}
                onChange={(date) => handleDateChange(date, "startDateTime")}
              />
              {errors.startDateTime && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.startDateTime}
                </p>
              )}
            </div>
            <div>
              <Label htmlFor="endDateTime">{t("End Date and Time")}</Label>
              <DateTimePicker
                value={formData.endDateTime}
                onChange={(date) => handleDateChange(date, "endDateTime")}
              />
              {errors.endDateTime && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.endDateTime}
                </p>
              )}
            </div>
          </div>
        </>
      )}

      {step === 2 && (
        <>
          <div>
            <Label htmlFor="description">{t("Description")}</Label>
            <Textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              className="w-full"
              rows={3}
            />
            {errors.description && (
              <p className="text-red-500 text-sm mt-1">{errors.description}</p>
            )}
          </div>
          <div>
            <Label htmlFor="location">{t("Location")}</Label>
            <Input
              id="location"
              name="location"
              value={formData.location}
              onChange={handleChange}
              className="w-full"
            />
            {errors.location && (
              <p className="text-red-500 text-sm mt-1">{errors.location}</p>
            )}
          </div>
          <div>
            <Label htmlFor="category">{t("Category")}</Label>
            <Select
              name="category"
              value={formData.category}
              onValueChange={(value) =>
                handleChange({target: {name: "category", value}} as any)
              }>
              <SelectTrigger className="w-full">
                <SelectValue placeholder={t("Select category")} />
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
        </>
      )}

      {step === 3 && (
        <>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="capacity">{t("Capacity")}</Label>
              <Input
                id="capacity"
                name="capacity"
                type="number"
                value={formData.capacity}
                onChange={handleChange}
                className="w-full"
              />
              {errors.capacity && (
                <p className="text-red-500 text-sm mt-1">{errors.capacity}</p>
              )}
            </div>
            <div>
              <Label htmlFor="registeredAttendees">
                {t("Registered Attendees")}
              </Label>
              <Input
                id="registeredAttendees"
                name="registeredAttendees"
                type="number"
                value={formData.registeredAttendees}
                onChange={handleChange}
                className="w-full"
              />
              {errors.registeredAttendees && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.registeredAttendees}
                </p>
              )}
            </div>
          </div>
          <div className="w-full">
            <Label htmlFor="organizers">{t("Users")}</Label>
            <p className="text-sm text-muted-foreground mb-2">
              {t("Select users for this event")}
            </p>
            <UserSelectPopup
              selectedUsers={selectedOrganizers}
              onSelectUsers={(users) => {
                setSelectedOrganizers(users);
                setFormData((prev) => ({...prev, organizers: users}));
                setErrors((prev) => ({...prev, organizers: ""}));
              }}
            />
            {errors.organizers && (
              <p className="text-red-500 text-sm mt-1">{errors.organizers}</p>
            )}
          </div>
        </>
      )}

      <DialogFooter>
        {step > 1 && (
          <Button type="button" variant="outline" onClick={handleBack}>
            {t("Back")}
          </Button>
        )}
        <Button type="button" variant="outline" onClick={onCancel}>
          {t("Cancel")}
        </Button>
        <Button type="button" onClick={step < 3 ? handleNext : handleSubmit}>
          {step < 3
            ? t("Next")
            : event.id === 0
              ? t("Add Event")
              : t("Update Event")}
        </Button>
      </DialogFooter>
    </form>
  );
}

interface Event {
  id: number;
  name: string;
  description: string;
  startDateTime: Date;
  endDateTime: Date;
  location: string;
  status: "upcoming" | "ongoing" | "finished";
  category: string;
  qrCode: string;
  capacity: number;
  registeredAttendees: number;
  organizers: User[];
}

interface User {
  id: string;
  name: string;
  email: string;
  role: "admin" | "event_organizer";
}

const initialEvents: Event[] = [
  {
    id: 1,
    name: "Tech Conference 2024",
    description:
      "Annual technology conference featuring the latest innovations and industry trends.",
    startDateTime: new Date("2024-06-15T09:00"),
    endDateTime: new Date("2024-06-15T17:00"),
    location: "San Francisco Convention Center, CA",
    status: "upcoming",
    category: "Conferences",
    qrCode: "TECH2024-001",
    capacity: 1000,
    registeredAttendees: 750,
    organizers: [
      {
        id: "1",
        name: "John Doe",
        email: "john@example.com",
        role: "event_organizer",
      },
      {id: "2", name: "Jane Smith", email: "jane@example.com", role: "admin"},
    ],
  },
  {
    id: 2,
    name: "Digital Marketing Workshop",
    description:
      "Hands-on workshop covering the latest digital marketing strategies and tools.",
    startDateTime: new Date("2024-06-20T10:00"),
    endDateTime: new Date("2024-06-20T15:00"),
    location: "New York Business Center, NY",
    status: "ongoing",
    category: "Workshops",
    qrCode: "DMW2024-002",
    capacity: 100,
    registeredAttendees: 85,
    organizers: [
      {
        id: "3",
        name: "Alice Johnson",
        email: "alice@example.com",
        role: "event_organizer",
      },
    ],
  },
  {
    id: 3,
    name: "Startup Networking Event",
    description:
      "Connect with fellow entrepreneurs and investors in this dynamic networking session.",
    startDateTime: new Date("2024-06-25T18:00"),
    endDateTime: new Date("2024-06-25T21:00"),
    location: "Austin Startup Hub, TX",
    status: "upcoming",
    category: "Networking",
    qrCode: "SNE2024-003",
    capacity: 200,
    registeredAttendees: 150,
    organizers: [
      {
        id: "4",
        name: "Bob Brown",
        email: "bob@example.com",
        role: "event_organizer",
      },
    ],
  },
];

const categories = [
  "Conferences",
  "Workshops",
  "Seminars",
  "Networking",
  "Other",
];
