"use client";

import {useLanguage} from "@/components/providers/LanguageProvider";
import {Badge} from "@/components/ui/badge";
import {Card, CardContent, CardHeader, CardTitle} from "@/components/ui/card";
import {useToast} from "@/hooks/use-toast";
import {getEvent, getEventRoles} from "@/services/event.service";
import {Calendar, MapPin, Users} from "lucide-react";
import {useParams} from "next/navigation";
import {useEffect, useState} from "react";
import {EventAudienceList} from "./event-audience-list";

interface EventRole {
  userId: string;
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
  adminId: string;
  startDateTime: string;
  endDateTime: string;
  location: string;
  isFree: boolean;
  ticketPrice: number;
  currency: string;
  paymentRequired: boolean;
  eventRoles: EventRole[];
  registeredUsers: string[];
}

export function EventPage() {
  const {id} = useParams();
  const [event, setEvent] = useState<Event | null>(null);
  const [organizers, setOrganizers] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isLoadingOrganizers, setIsLoadingOrganizers] = useState(false);
  const {toast} = useToast();
  const {t} = useLanguage();
  useEffect(() => {
    const fetchEvent = async () => {
      try {
        setIsLoading(true);
        const eventData = await getEvent(id);
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
  useEffect(() => {
    const fetchOrganizers = async () => {
      if (!id) return;
      
      try {
        setIsLoadingOrganizers(true);
        const rolesData = await getEventRoles(id);
        // Filter for organizers and owners only, and ensure they have required data
        const eventOrganizers = rolesData.filter(
          (role: any) =>
            (role.role === "ORGANIZER" || role.role === "OWNER") &&
            role.username
        );
        setOrganizers(eventOrganizers);
      } catch (error) {
        console.error("Error fetching organizers:", error);
        // Don't show toast for organizers error - it's not critical
        setOrganizers([]);
      } finally {
        setIsLoadingOrganizers(false);
      }
    };

    if (id && event) {
      fetchOrganizers();
    }
  }, [id, event]);

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
          </div>          <div className="flex items-center space-x-2 text-sm">
            <MapPin className="h-4 w-4" />
            <span>{event.location}</span>
          </div>          <div className="flex items-center space-x-2 text-sm">
            <div className="p-1.5 bg-blue-100 dark:bg-blue-900 rounded">
              💰
            </div>
            <span>
              {event.isFree || event.ticketPrice === 0 ? (
                <div className="flex items-center gap-2">
                  <Badge variant="secondary" className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100 px-3 py-1">
                    <span className="mr-1">🎉</span>
                    {t("Free Event")}
                  </Badge>
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <span className="font-medium text-lg">
                    {event.currency === "USD" ? "$" : "៛"}{event.ticketPrice} {event.currency}
                  </span>
                  {event.paymentRequired && (
                    <Badge variant="outline" className="bg-yellow-50 text-yellow-700 border-yellow-300 dark:bg-yellow-950 dark:text-yellow-300">
                      <span className="mr-1">⚡</span>
                      {t("Payment Required")}
                    </Badge>
                  )}
                </div>
              )}
            </span>
          </div>
          <div className="flex items-center space-x-2 text-sm">
            <Users className="h-4 w-4" />
            <span>
              {event.registered} / {event.capacity} {t("attendees")}
            </span>
          </div>
        </CardContent>
      </Card>{" "}
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
                {isLoadingOrganizers ? (
                  <div className="text-sm text-muted-foreground">
                    {t("Loading organizers...")}
                  </div>
                ) : organizers.length === 0 ? (
                  <div className="text-sm text-muted-foreground">
                    {t("No organizers found")}
                  </div>
                ) : (                  <div className="space-y-3">
                    {organizers.map((organizer, index) => (
                      <div
                        key={organizer.id || organizer.userId || index}
                        className="flex items-center space-x-3 p-3 bg-muted/50 rounded-lg">
                        <div className="flex-1">
                          <div className="font-medium text-sm">
                            {organizer.username || `User ${organizer.userId}`}
                          </div>
                          {organizer.email && (
                            <div className="text-xs text-muted-foreground">
                              {organizer.email}
                            </div>
                          )}
                        </div>
                        <Badge variant="outline" className="text-xs px-2 py-1">
                          {organizer.role}
                        </Badge>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      )}
      <EventAudienceList eventId={event?.id || ""} />
    </div>
  );
}
export default EventPage;
