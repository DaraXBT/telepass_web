"use client";

import {useLanguage} from "@/components/providers/LanguageProvider";
import {Badge} from "@/components/ui/badge";
import {Card, CardContent, CardHeader, CardTitle} from "@/components/ui/card";
import {useToast} from "@/hooks/use-toast";
import {getEvent} from "@/services/event.service";
import {Calendar, MapPin, Phone, Users} from "lucide-react";
import {useParams} from "next/navigation";
import {useEffect, useState} from "react";
import {EventAudienceList} from "./event-audience-list";

interface Event {
  id: number;
  name: string;
  description: string;
  startDateTime: string;
  endDateTime: string;
  location: string;
  status: "upcoming" | "ongoing" | "finished";
  category: string;
  capacity: number;
  registeredAttendees: number;
  organizers: string[];
  contact: string;
}

export function EventPage() {
  const {id} = useParams();
  const [event, setEvent] = useState<Event | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const {toast} = useToast();
  const {t} = useLanguage();

  useEffect(() => {
    const fetchEvent = async () => {
      try {
        setIsLoading(true);
        const eventData = await getEvent(Number(id));
        setEvent(eventData);
      } catch (error) {
        console.error("Error fetching event:", error);
        toast({
          title: t("Error"),
          description: t("Failed to load event details."),
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };

    if (id) {
      fetchEvent();
    }
  }, [id, toast, t]);

  const handleUpdateEvent = (updatedEvent: Event) => {
    setEvent(updatedEvent);
    toast({
      title: t("Event updated"),
      description: `"${updatedEvent.name}" ${t("details have been successfully updated.")}`,
    });
  };

  if (isLoading) {
    return <div>{t("Loading...")}</div>;
  }

  if (!event) {
    return <div>{t("Event not found")}</div>;
  }

  const formatDateTime = (dateTimeString: string) => {
    const date = new Date(dateTimeString);
    return date.toLocaleString(t("en-US-locale"), {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    });
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex justify-between items-start">
            <div>
              <CardTitle className="text-2xl">{event.name}</CardTitle>
              <p className="text-sm text-muted-foreground mt-1">
                {event.category}
              </p>
            </div>
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
              {event.status.charAt(0).toUpperCase() + event.status.slice(1)}
            </Badge>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-sm">{event.description}</p>
          <div className="flex items-center space-x-2 text-sm">
            <Calendar className="h-4 w-4" />{" "}
            <span>
              {formatDateTime(event.startDateTime)} -{" "}
              {formatDateTime(event.endDateTime)}
            </span>
          </div>
          <div className="flex items-center space-x-2 text-sm">
            <MapPin className="h-4 w-4" />
            <span>{event.location}</span>
          </div>
          <div className="flex items-center space-x-2 text-sm">
            <Users className="h-4 w-4" />
            <span>
              {event.registeredAttendees} / {event.capacity} {t("attendees")}
            </span>
          </div>
          <div className="flex items-center space-x-2 text-sm">
            <Phone className="h-4 w-4" />
            <span>{event.contact}</span>
          </div>
        </CardContent>
      </Card>
      {event && (
        <Card>
          <CardHeader>
            <CardTitle>{t("Event Management")}</CardTitle>
          </CardHeader>{" "}
          <CardContent>
            <div className="space-y-4">
              <div>
                <h3 className="text-lg font-semibold mb-2">
                  {t("Organizers")}
                </h3>
                <ul className="list-disc list-inside">
                  {event.organizers.map((organizer, index) => (
                    <li key={index}>{organizer}</li>
                  ))}
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
      <EventAudienceList eventId={event?.id || 0} />
    </div>
  );
}
export default EventPage;
