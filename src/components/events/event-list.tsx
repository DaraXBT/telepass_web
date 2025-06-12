"use client";

import {API_URL} from "@/api/interceptor";
import {useLanguage} from "@/components/providers/LanguageProvider";
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
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {Input} from "@/components/ui/input";
import {Label} from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {Textarea} from "@/components/ui/textarea";
import {toast, useToast} from "@/hooks/use-toast";
import {
  addEvent,
  deleteEvent,
  fetchEventQrCode,
  getAllEvents,
  getEventsByAdminId,
  updateEvent,
} from "@/services/event.service";
import {getAdminByUsername} from "@/services/authservice.service";
import {uploadProfileImage} from "@/services/image.service";
import {MoreHorizontal, Plus, QrCode, Sparkles, Trash} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import {useCallback, useEffect, useMemo, useRef, useState} from "react";
import {useDropzone} from "react-dropzone";
import {v4 as uuidv4} from "uuid";
import {getSession} from "next-auth/react";

export const EventList: React.FC = () => {
  const {t} = useLanguage();
  const [events, setEvents] = useState<Event[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [editingEvent, setEditingEvent] = useState<Event | null>(null);
  const [categoryFilter, setCategoryFilter] = useState<string>("All");
  const [showingQRCode, setShowingQRCode] = useState<Event | null>(null);
  const [sortBy, setSortBy] = useState<keyof Event>("name");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");
  const [isEventFormOpen, setIsEventFormOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const {toast} = useToast();
  const [qrCodeImageUrl, setQrCodeImageUrl] = useState<string | null>(null);
  const hasInitiallyLoaded = useRef(false);
  const refreshEvents = useCallback(async () => {
    try {
      setIsLoading(true);

      // Get current session to extract username
      const session = await getSession();
      if (!session?.user?.username) {
        console.error("No username found in session");
        return;
      }

      // Get admin details by username
      const adminResponse = await getAdminByUsername(session.user.username);
      if (!adminResponse.data?.id) {
        console.error("No admin ID found for username:", session.user.username);
        return;
      }

      // Fetch events using admin ID
      const response = await getEventsByAdminId(adminResponse.data.id);
      if (response.data) {
        const mappedEvents = response.data.map((event: any) => ({
          ...event,
          status: event.status || "upcoming",
          category: event.category || "General",
          description: event.description || "",
          eventImg: event.eventImg || null,
          registered: event.registered || 0,
          capacity: event.capacity || 100,
          qrCodePath: event.qrCode,
          eventRoles:
            event.eventRoles
              ?.filter(
                (role: EventRole) =>
                  role.role === "ORGANIZER" || role.role === "OWNER"
              )
              .map((role: EventRole) => ({
                id: role.user.id,
                name: role.user.username,
                email: role.user.email,
                role: role.role === "OWNER" ? "admin" : "event_organizer",
              })) || [],
        }));
        setEvents(mappedEvents);
      }
    } catch (error) {
      console.error("Error refreshing events:", error);
    } finally {
      setIsLoading(false);
    }
  }, []);
  const fetchEvents = useCallback(async () => {
    if (hasInitiallyLoaded.current) return;

    try {
      setIsLoading(true);

      // Get current session to extract username
      const session = await getSession();
      if (!session?.user?.username) {
        console.error("No username found in session");
        toast({
          title: t("Error"),
          description: t("User session not found"),
          variant: "destructive",
        });
        return;
      }

      // Get admin details by username
      const adminResponse = await getAdminByUsername(session.user.username);
      if (!adminResponse.data?.id) {
        console.error("No admin ID found for username:", session.user.username);
        toast({
          title: t("Error"),
          description: t("Admin profile not found"),
          variant: "destructive",
        });
        return;
      }

      // Fetch events using admin ID
      const response = await getEventsByAdminId(adminResponse.data.id);
      console.log(
        "Events response for admin",
        adminResponse.data.id,
        ":",
        response
      );
      if (response.data) {
        // Map the API response to match our Event interface
        const mappedEvents = response.data.map((event: any) => ({
          ...event,
          status: event.status || "upcoming", // Default status
          category: event.category || "General", // Default category
          description: event.description || "", // Default description
          eventImg: event.eventImg || null, // Default image
          registered: event.registered || 0, // Default registered count
          capacity: event.capacity || 100, // Default capacity
          qrCodePath: event.qrCode,
          eventRoles:
            event.eventRoles
              ?.filter(
                (role: EventRole) =>
                  role.role === "ORGANIZER" || role.role === "OWNER"
              )
              .map((role: EventRole) => ({
                id: role.user.id,
                name: role.user.username,
                email: role.user.email,
                role: role.role === "OWNER" ? "admin" : "event_organizer",
              })) || [], // Default to empty array if eventRoles is undefined
        }));
        setEvents(mappedEvents);
        hasInitiallyLoaded.current = true;
      }
    } catch (error) {
      console.error("Error fetching events:", error);
      toast({
        title: t("Error"),
        description: t("Failed to fetch events"),
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  }, [t, toast]);

  useEffect(() => {
    fetchEvents();
  }, [fetchEvents]);

  useEffect(() => {
    if (showingQRCode) {
      // Fetch QR code image from backend using the service
      const fetchQrCode = async () => {
        try {
          const imageBlob = await fetchEventQrCode(showingQRCode.id);
          const imageUrl = URL.createObjectURL(imageBlob);
          setQrCodeImageUrl(imageUrl);
        } catch (error) {
          setQrCodeImageUrl(null);
        }
      };
      fetchQrCode();
    } else {
      setQrCodeImageUrl(null);
    }
  }, [showingQRCode]);
  const filteredEvents = events
    .filter(
      (event) =>
        (event.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          event.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          event.category?.toLowerCase().includes(searchTerm.toLowerCase())) &&
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
      (sum, event) => sum + event.registered,
      0
    );
    const registrationPercentage =
      totalCapacity > 0
        ? Math.round((totalRegistered / totalCapacity) * 100)
        : 0;
    return {total, totalCapacity, totalRegistered, registrationPercentage};
  }, [filteredEvents]);
  const handleUpdateEvent = async (updatedEvent: Event) => {
    try {
      // Get current session
      const session = await getSession();
      if (!session?.user?.username) {
        toast({
          title: t("Authentication Error"),
          description: t("No user session found"),
          variant: "destructive",
        });
        return;
      }

      // Get admin details
      const adminResponse = await getAdminByUsername(session.user.username);
      if (!adminResponse?.data?.id) {
        toast({
          title: t("Authentication Error"),
          description: t("Admin profile not found"),
          variant: "destructive",
        });
        return;
      }

      const eventPayload = {
        name: updatedEvent.name,
        description: updatedEvent.description,
        status: updatedEvent.status,
        category: updatedEvent.category,
        capacity: updatedEvent.capacity,
        registered: updatedEvent.registered,
        qrCodePath: updatedEvent.qrCodePath,
        eventImg: updatedEvent.eventImg,
        adminId: adminResponse.data.id,
        eventRoles: updatedEvent.eventRoles.map((role: EventRole) => ({
          userId: role.user.id,
          role: role.role,
        })),
        registeredUsers: updatedEvent.registeredUsers || [],
      };

      await updateEvent(updatedEvent.id, eventPayload);

      // Update local state
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
      });

      // Refresh event list to ensure consistency
      await refreshEvents();
    } catch (error) {
      console.error("Error updating event:", error);
      toast({
        title: t("Error"),
        description: t("Failed to update event"),
        variant: "destructive",
      });
    }
  };
  const handleAddEvent = async (newEvent: Event) => {
    try {
      // Get current session
      const session = await getSession();
      if (!session?.user?.username) {
        toast({
          title: t("Authentication Error"),
          description: t("No user session found"),
          variant: "destructive",
        });
        return;
      }

      // Get admin details
      const adminResponse = await getAdminByUsername(session.user.username);
      if (!adminResponse?.data?.id) {
        toast({
          title: t("Authentication Error"),
          description: t("Admin profile not found"),
          variant: "destructive",
        });
        return;
      }

      const eventPayload = {
        id: uuidv4(),
        name: newEvent.name,
        description: newEvent.description,
        status: newEvent.status,
        category: newEvent.category,
        capacity: newEvent.capacity,
        registered: newEvent.registered,
        qrCodePath: newEvent.qrCodePath,
        eventImg: newEvent.eventImg,
        adminId: adminResponse?.data?.id,
        eventRoles: newEvent.eventRoles.map((role: EventRole) => ({
          userId: role.user.id,
          role: role.role,
        })),
        registeredUsers: [],
      };

      await addEvent(eventPayload);
      toast({
        title: t("Event added"),
        description: `"${newEvent.name}" ${t("has been successfully added to the event list.")}`,
      });
      setIsEventFormOpen(false);
      // Refresh event list
      await refreshEvents();
    } catch (error) {
      toast({
        title: t("Error"),
        description: t("Failed to add event"),
        variant: "destructive",
      });
    }
  };
  const handleDeleteEvent = async (id: string) => {
    const eventToDelete = events.find((event) => event.id === id);

    try {
      // Call the backend API to delete the event
      await deleteEvent(id);

      // Refresh the events list from the backend to ensure consistency
      await refreshEvents();

      toast({
        title: t("Event deleted"),
        description: `"${eventToDelete?.name}" ${t("has been removed from the event list.")}`,
        variant: "destructive",
      });
    } catch (error) {
      console.error("Failed to delete event:", error);
      toast({
        title: t("Error"),
        description: t("Failed to delete event. Please try again."),
        variant: "destructive",
      });
    }
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
                id: "",
                name: "",
                description: "",
                status: "upcoming",
                category: "",
                capacity: 0,
                registered: 0,
                qrCodePath: "",
                eventImg: "",
                eventRoles: [],
                registeredUsers: [],
              });
              setIsEventFormOpen(true);
            }}>
            <Plus className="h-4 w-4 mr-2" /> {t("Add Event")}
          </Button>
        </div>
        <div className="overflow-x-auto overflow-y-auto max-h-[600px] border rounded-md">
          {isLoading ? (
            <div className="flex items-center justify-center h-32">
              <p className="text-muted-foreground">{t("Loading events...")}</p>
            </div>
          ) : filteredEvents.length === 0 ? (
            <div className="flex items-center justify-center h-32">
              <p className="text-muted-foreground">{t("No events found")}</p>
            </div>
          ) : (
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
                      <div className="flex items-center space-x-4">
                        {event.eventImg && (
                          <img
                            src={event.eventImg}
                            alt={event.name}
                            className="w-12 h-12 rounded-md object-cover"
                          />
                        )}
                        <div>
                          {" "}
                          <Link
                            href={`/events/${event.id}`}
                            className="font-medium hover:underline">
                            {event.name}
                          </Link>
                          <div className="text-sm text-muted-foreground">
                            {event.description || "No description available"}
                          </div>
                        </div>
                      </div>{" "}
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
                          event.status?.charAt(0).toUpperCase() +
                            event.status?.slice(1) || "Unknown"
                        )}{" "}
                      </Badge>
                    </TableCell>
                    <TableCell>{event.category || "General"}</TableCell>
                    <TableCell>
                      <div className="flex flex-col space-y-1">
                        <span className="text-sm font-medium">
                          {event.registered || 0} / {event.capacity || 100}
                        </span>
                        <progress
                          className="w-full h-2"
                          value={event.registered || 0}
                          max={
                            event.capacity && event.capacity > 0
                              ? event.capacity
                              : 100
                          }
                        />
                        <span className="text-xs text-muted-foreground">
                          {(event.capacity || 100) > 0
                            ? Math.round(
                                ((event.registered || 0) /
                                  (event.capacity || 100)) *
                                  100
                              )
                            : 0}
                          % {t("Full")}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell>
                      {event.eventRoles
                        .filter(
                          (role) =>
                            role.role === "ORGANIZER" || role.role === "OWNER"
                        )
                        .map((role) => role.user.username)
                        .join(", ")}
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
          )}
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
              {editingEvent?.id === "" ? t("Add New Event") : t("Update Event")}
            </DialogTitle>
            <DialogDescription>
              {editingEvent?.id === ""
                ? t("Create a new event by filling out the form below.")
                : t("Update the event details using the form below.")}
            </DialogDescription>
          </DialogHeader>
          {editingEvent && (
            <EventForm
              event={editingEvent}
              onSubmit={
                editingEvent.id === "" ? handleAddEvent : handleUpdateEvent
              }
              onCancel={() => setIsEventFormOpen(false)}
            />
          )}
        </DialogContent>
      </Dialog>
      <Dialog
        open={!!showingQRCode}
        onOpenChange={(open) => {
          if (!open) setShowingQRCode(null);
        }}>
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
            {qrCodeImageUrl ? (
              <>
                <img
                  src={qrCodeImageUrl}
                  alt="QR Code"
                  width={200}
                  height={200}
                />
                <Button
                  className="mt-4 w-full max-w-xs"
                  variant="secondary"
                  onClick={() => {
                    const link = document.createElement("a");
                    link.href = qrCodeImageUrl;
                    link.download = `${showingQRCode?.name || "event"}-qrcode.png`;
                    document.body.appendChild(link);
                    link.click();
                    document.body.removeChild(link);
                  }}>
                  {t("Save QR")}
                </Button>
              </>
            ) : (
              <p>{t("Loading QR code...")}</p>
            )}
            <p className="mt-4 text-sm font-medium">
              {showingQRCode?.qrCodePath}
            </p>
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
  const [formData, setFormData] = useState<Event>({
    ...event,
    eventImg: event.eventImg || "",
  });
  const [errors, setErrors] = useState<Partial<Record<keyof Event, string>>>(
    {}
  );
  const [selectedOrganizers, setSelectedOrganizers] = useState<EventRole[]>(
    event.eventRoles || []
  );
  const [eventImage, setEventImage] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(
    event.eventImg || null
  );
  const [searchEmail, setSearchEmail] = useState("");
  const [searchResult, setSearchResult] = useState<User | null>(null);
  const [searchError, setSearchError] = useState("");

  const onDrop = useCallback((acceptedFiles: File[]) => {
    const file = acceptedFiles[0];
    setEventImage(file);
    setPreviewUrl(URL.createObjectURL(file));
  }, []);

  const {getRootProps, getInputProps, isDragActive} = useDropzone({
    onDrop,
    accept: {"image/*": []},
    multiple: false,
  });

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
        if (!formData.status) newErrors.status = t("Status is required");
        break;
      case 2:
        if (!formData.description)
          newErrors.description = t("Description is required");
        if (!formData.category) newErrors.category = t("Category is required");
        break;
      case 3:
        if (!formData.capacity) newErrors.capacity = t("Capacity is required");
        if (formData.capacity <= 0)
          newErrors.capacity = t("Capacity must be greater than 0");
        if (!formData.registered)
          newErrors.registered = t("Registered is required");
        if (formData.registered < 0)
          newErrors.registered = t("Registered cannot be negative");
        if (formData.registered > formData.capacity)
          newErrors.registered = t("Registered cannot exceed capacity");
        if (selectedOrganizers.length === 0)
          newErrors.eventRoles = t("At least one user must be selected");
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (validateStep(3)) {
      let eventImgUrl = formData.eventImg;

      if (eventImage) {
        try {
          const fileName = await uploadProfileImage(eventImage);
          eventImgUrl = `${API_URL}/api/v1/images/getImage?fileName=${fileName}`;
        } catch (error) {
          toast({
            title: t("Error"),
            description: t("Failed to upload event image"),
            variant: "destructive",
          });
          return;
        }
      }

      onSubmit({
        ...formData,
        eventImg: eventImgUrl,
        eventRoles: selectedOrganizers,
      });
    }
  };

  const handleSearchUser = async () => {
    if (!searchEmail) {
      setSearchError(t("Please enter an email address"));
      return;
    }

    try {
      const response = await fetch(
        `${API_URL}/api/v1/admin/by-email?email=${encodeURIComponent(searchEmail)}`
      );
      if (!response.ok) {
        throw new Error("User not found");
      }
      const user = await response.json();
      setSearchResult(user);
      setSearchError("");
    } catch (error) {
      setSearchResult(null);
      setSearchError(t("User not found"));
    }
  };

  const handleAddOrganizer = (user: User) => {
    const newRole: EventRole = {
      id: uuidv4(),
      event: formData,
      user: user,
      role: "ORGANIZER",
    };

    if (!selectedOrganizers.some((role) => role.user.id === user.id)) {
      setSelectedOrganizers((prev) => [...prev, newRole]);
      setFormData((prev) => ({
        ...prev,
        eventRoles: [...prev.eventRoles, newRole],
      }));
    }
    setSearchEmail("");
    setSearchResult(null);
  };

  const handleRemoveOrganizer = (userId: string) => {
    setSelectedOrganizers((prev) =>
      prev.filter((role) => role.user.id !== userId)
    );
    setFormData((prev) => ({
      ...prev,
      eventRoles: prev.eventRoles.filter((role) => role.user.id !== userId),
    }));
  };

  const generateAIContent = async () => {
    toast({
      title: t("Coming Soon"),
      description: t("AI content generation feature will be available soon!"),
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {step === 1 && (
        <>
          <div className="flex items-center justify-between">
            <Label htmlFor="name">{t("Event Name")}</Label>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={generateAIContent}
              className="flex items-center gap-2">
              <Sparkles className="h-4 w-4" />
              {t("Generate with AI")}
            </Button>
          </div>
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
          <div>
            <Label>{t("Event Image")}</Label>
            <div
              {...getRootProps()}
              className={`border-2 border-dashed rounded-xl p-4 text-center cursor-pointer bg-gray-50 hover:bg-gray-100 transition-all ${
                isDragActive ? "border-blue-500 bg-blue-50" : "border-gray-200"
              }`}>
              <input {...getInputProps()} />
              {previewUrl ? (
                <div className="flex flex-col items-center">
                  <Image
                    src={previewUrl}
                    alt="Preview"
                    width={200}
                    height={200}
                    className="rounded-lg object-cover border-4 border-blue-200 shadow-lg"
                  />
                  <p className="text-sm text-gray-500 mt-2">
                    {t("Click or drag to replace image")}
                  </p>
                </div>
              ) : (
                <div>
                  <p className="text-gray-400">
                    {t("Drag & drop or click to select an image")}
                  </p>
                  <p className="text-xs text-gray-300">
                    {t("PNG, JPG, GIF up to 2MB")}
                  </p>
                </div>
              )}
            </div>
            {errors.eventImg && (
              <p className="text-red-500 text-sm mt-1">{errors.eventImg}</p>
            )}
          </div>
          <div>
            <Label htmlFor="status">{t("Status")}</Label>
            <Select
              name="status"
              value={formData.status}
              onValueChange={(value) =>
                handleChange({target: {name: "status", value}} as any)
              }>
              <SelectTrigger className="w-full">
                <SelectValue placeholder={t("Select status")} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="upcoming">{t("Upcoming")}</SelectItem>
                <SelectItem value="ongoing">{t("Ongoing")}</SelectItem>
                <SelectItem value="finished">{t("Finished")}</SelectItem>
              </SelectContent>
            </Select>
            {errors.status && (
              <p className="text-red-500 text-sm mt-1">{errors.status}</p>
            )}
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
              <Label htmlFor="registered">{t("Registered")}</Label>
              <Input
                id="registered"
                name="registered"
                type="number"
                value={formData.registered}
                onChange={handleChange}
                className="w-full"
              />
              {errors.registered && (
                <p className="text-red-500 text-sm mt-1">{errors.registered}</p>
              )}
            </div>
          </div>
          <div className="w-full">
            <Label>{t("Add Organizers")}</Label>
            <div className="flex gap-2 mb-4">
              <Input
                type="email"
                placeholder={t("Enter email address")}
                value={searchEmail}
                onChange={(e) => setSearchEmail(e.target.value)}
                className="flex-1"
              />
              <Button type="button" onClick={handleSearchUser}>
                {t("Search")}
              </Button>
            </div>
            {searchError && (
              <p className="text-red-500 text-sm mb-2">{searchError}</p>
            )}
            {searchResult && (
              <div className="flex items-center justify-between p-2 bg-gray-50 rounded-md mb-4">
                <div>
                  <p className="font-medium">{searchResult.username}</p>
                  <p className="text-sm text-gray-500">{searchResult.email}</p>
                </div>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => handleAddOrganizer(searchResult)}>
                  {t("Add")}
                </Button>
              </div>
            )}
            <div className="space-y-2">
              <Label>{t("Selected Organizers")}</Label>
              {selectedOrganizers.map((role) => (
                <div
                  key={role.id}
                  className="flex items-center justify-between p-2 bg-gray-50 rounded-md">
                  <div>
                    <p className="font-medium">{role.user.username}</p>
                    <p className="text-sm text-gray-500">{role.user.email}</p>
                  </div>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => handleRemoveOrganizer(role.user.id)}>
                    {t("Remove")}
                  </Button>
                </div>
              ))}
            </div>
            {errors.eventRoles && (
              <p className="text-red-500 text-sm mt-1">{errors.eventRoles}</p>
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
            : event.id === ""
              ? t("Add Event")
              : t("Update Event")}
        </Button>
      </DialogFooter>
    </form>
  );
}

interface User {
  id: string;
  username: string;
  email: string;
  profile: string;
  enabled: boolean;
  accountNonExpired: boolean;
  accountNonLocked: boolean;
  credentialsNonExpired: boolean;
}

interface UserSelectUser {
  id: string;
  name: string;
  email: string;
  role: "admin" | "event_organizer";
}

interface EventRole {
  id: string;
  event: Event;
  user: User;
  role: "OWNER" | "ORGANIZER";
}

interface Event {
  id: string;
  name: string;
  description: string;
  status: string;
  category: string;
  capacity: number;
  registered: number;
  qrCodePath: string;
  eventImg: string;
  eventRoles: EventRole[];
  registeredUsers: any[];
}

const categories = [
  "Conferences",
  "Workshops",
  "Seminars",
  "Networking",
  "Other",
];
