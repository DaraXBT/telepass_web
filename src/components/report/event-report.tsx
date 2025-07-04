/**
 * Event Report Component with Enhanced API Integration
 *
 * Features:
 * - Fetches events from backend API with proper error handling
 * - Supports retry mechanism for failed API calls
 * - Maps API response to component Event interface
 * - Handles multiple response formats from the API
 * - Includes detailed logging for debugging
 * - Shows Google Maps with location preview
 * - Exports data to Excel format
 * - Responsive design with loading states
 */

"use client";

import {useLanguage} from "@/components/providers/LanguageProvider";
import {Button} from "@/components/ui/button";
import {Card, CardContent, CardHeader, CardTitle} from "@/components/ui/card";
import {Input} from "@/components/ui/input";
import {Badge} from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  CalendarIcon,
  CheckCircleIcon,
  FileSpreadsheet,
  MapPinIcon,
  Search,
  UsersIcon,
  RefreshCw,
  Eye,
  Clock,
  CheckCircle,
  MapPin,
  Calendar,
  Users,
  FileText,
  ExternalLink,
} from "lucide-react";
import {useMemo, useState, useEffect, useCallback} from "react";
import * as XLSX from "xlsx";
import {getSession} from "next-auth/react";
import {getAdminByUsername} from "@/services/authservice.service";
import {getEventsByAdminId, getEventAudiences} from "@/services/event.service";
import {useToast} from "@/hooks/use-toast";
import {EventAudienceList} from "@/components/events/event-audience-list";

// Declare Google Maps types
declare global {
  interface Window {
    google: any;
  }
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

interface EventRole {
  userId: string;
  role: "OWNER" | "ORGANIZER";
}

interface Audience {
  id: string;
  name?: string;
  email?: string;
  phone?: string;
  registrationDate: string;
  eventId: string;
}

export function EventReport() {
  const {t, language} = useLanguage();
  const [events, setEvents] = useState<Event[]>([]);
  const [audiences, setAudiences] = useState<Audience[]>([]);
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
  const [adminData, setAdminData] = useState<any>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [eventSearchTerm, setEventSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<
    "all" | "upcoming" | "ongoing" | "finished"
  >("finished");
  const [currentPage, setCurrentPage] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const [isLoadingAudiences, setIsLoadingAudiences] = useState(false);
  const [isSheetOpen, setIsSheetOpen] = useState(false);
  const {toast} = useToast();

  const EVENTS_PER_PAGE = 10;
  // Google Maps API configuration
  // To use Google Maps API:
  // 1. Get an API key from Google Cloud Console: https://console.cloud.google.com/
  // 2. Enable Maps JavaScript API and Places API
  // 3. Add NEXT_PUBLIC_GOOGLE_MAPS_API_KEY to your .env.local file
  // 4. Replace 'YOUR_API_KEY_HERE' with your actual API key if not using env variables
  const GOOGLE_MAPS_API_KEY =
    process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || "YOUR_API_KEY_HERE";
  // Fetch all events from API
  const fetchEvents = useCallback(async () => {
    try {
      setIsLoading(true);

      // Get current session to extract username
      const session = await getSession();
      if (!session?.user?.username) {
        toast({
          title: t("Error"),
          description: t("User session not found"),
          variant: "destructive",
        });        return;
      }
      
      // Get admin details by username
      const adminResponse = await getAdminByUsername(session.user.username);
      if (!adminResponse.data?.id) {
        toast({
          title: t("Error"),
          description: t("Admin profile not found"),
          variant: "destructive",
        });
        return;
      }

      // Store admin data for display
      setAdminData(adminResponse.data);
      console.log("Admin data:", adminResponse.data); // Fetch all events using admin ID with retry mechanism
      const response = await retryApiCall(async () => {
        return await getEventsByAdminId(adminResponse.data.id);
      });
      console.log("Raw API response:", response);

      // Handle response based on the service structure
      const eventData = response?.data || response || [];
      console.log("Extracted event data:", eventData);      if (Array.isArray(eventData) && eventData.length > 0) {
        // Map events to proper format
        const mappedEvents = eventData.map((eventFromApi: any): Event => {
          // Ensure required fields have defaults
          const mappedEvent: Event = {
            id: eventFromApi.id || eventFromApi._id || `temp-${Date.now()}-${Math.random()}`,
            name: eventFromApi.title || eventFromApi.name || "Untitled Event",
            description: eventFromApi.description || "",
            location: eventFromApi.location || "Location not specified",
            startDateTime:
              eventFromApi.startDate ||
              eventFromApi.startDateTime ||
              eventFromApi.date ||
              new Date().toISOString(),
            endDateTime:
              eventFromApi.endDate ||
              eventFromApi.endDateTime ||
              eventFromApi.startDate ||
              eventFromApi.date ||
              new Date().toISOString(),
            status: eventFromApi.status || "upcoming",
            category: eventFromApi.category || "General",
            eventImg: eventFromApi.eventImg || eventFromApi.image || "",
            registered: Number(eventFromApi.registered || eventFromApi.registeredCount || 0),
            capacity: Number(eventFromApi.capacity || eventFromApi.maxCapacity || 100),
            qrCodePath: eventFromApi.qrCode || eventFromApi.qrCodePath || "",
            isFree: eventFromApi.isFree !== undefined ? Boolean(eventFromApi.isFree) : true,
            ticketPrice: Number(eventFromApi.ticketPrice || 0),
            currency: eventFromApi.currency || "USD",
            paymentRequired: eventFromApi.paymentRequired !== undefined ? Boolean(eventFromApi.paymentRequired) : false,
            eventRoles: Array.isArray(eventFromApi.eventRoles)
              ? eventFromApi.eventRoles
              : Array.isArray(eventFromApi.organizers)
                ? eventFromApi.organizers
                : [],
            registeredUsers: Array.isArray(eventFromApi.registeredUsers)
              ? eventFromApi.registeredUsers
              : Array.isArray(eventFromApi.attendees)
                ? eventFromApi.attendees
                : [],
            adminId: eventFromApi.adminId || adminResponse.data.id || "",
          };

          console.log("Mapped event:", mappedEvent);
          return mappedEvent;
        });

        console.log("Fetched and mapped events:", mappedEvents);
        setEvents(mappedEvents);
      } else {
        console.log("No events found or empty response");
        setEvents([]);
      }
    } catch (error: any) {
      console.error("Error fetching events:", error);

      // Clear admin data on error
      setAdminData(null);

      // Handle different types of errors
      let errorMessage = t("Failed to fetch events");

      if (
        error.message === "missing access token" ||
        error.code === "UNAUTHENTICATED"
      ) {
        errorMessage = t("Please log in again");
      } else if (error.response?.status === 500) {
        errorMessage = t("Server error occurred");
      } else if (error.message.includes("fetch")) {
        errorMessage = t("Network error - please check your connection");
      }

      toast({
        title: t("Error"),
        description: errorMessage,
        variant: "destructive",
      });
      setEvents([]); // Set empty array on error
    } finally {
      setIsLoading(false);
    }
  }, [t, toast]);
  // Fetch audiences for selected event
  const fetchEventAudiences = useCallback(
    async (eventId: string) => {
      try {
        setIsLoadingAudiences(true);
        console.log("Fetching audiences for event:", eventId);

        const audienceData = await getEventAudiences(eventId);
        console.log("Audience data received:", audienceData);

        // Handle different response structures
        let audiences = [];
        if (Array.isArray(audienceData)) {
          audiences = audienceData;
        } else if (audienceData && Array.isArray(audienceData.data)) {
          audiences = audienceData.data;
        } else if (
          audienceData &&
          audienceData.audiences &&
          Array.isArray(audienceData.audiences)
        ) {
          audiences = audienceData.audiences;
        }

        console.log("Processed audiences:", audiences);
        setAudiences(audiences);
      } catch (error) {
        console.error("Error fetching event audiences:", error);
        setAudiences([]);
        toast({
          title: t("Error"),
          description: t("Failed to fetch event audiences"),
          variant: "destructive",
        });
      } finally {
        setIsLoadingAudiences(false);
      }
    },
    [t, toast]
  );
  // Retry mechanism for API calls
  const retryApiCall = async (
    apiCall: () => Promise<any>,
    maxRetries: number = 2
  ): Promise<any> => {
    let lastError: any;

    for (let i = 0; i <= maxRetries; i++) {
      try {
        const result = await apiCall();
        return result;
      } catch (error: any) {
        lastError = error;
        console.log(`API call attempt ${i + 1} failed:`, error);

        // Don't retry authentication errors
        if (
          error &&
          (error.message === "missing access token" ||
            error.code === "UNAUTHENTICATED")
        ) {
          throw error;
        }

        // Wait before retrying (exponential backoff)
        if (i < maxRetries) {
          await new Promise((resolve) =>
            setTimeout(resolve, 1000 * Math.pow(2, i))
          );
        }
      }
    }

    throw lastError;
  };

  useEffect(() => {
    fetchEvents();
  }, [fetchEvents]);

  useEffect(() => {
    if (selectedEvent) {
      fetchEventAudiences(selectedEvent.id);
    } else {
      setAudiences([]);
    }
  }, [selectedEvent, fetchEventAudiences]);

  const filteredEventsByStatus = useMemo(() => {
    return events.filter((event: Event) => {
      if (statusFilter === "all") return true;
      return event.status === statusFilter;
    });
  }, [events, statusFilter]);

  const filteredEvents = useMemo(() => {
    if (!eventSearchTerm) return filteredEventsByStatus;
    return filteredEventsByStatus.filter(
      (event: Event) =>
        event.name.toLowerCase().includes(eventSearchTerm.toLowerCase()) ||
        event.location.toLowerCase().includes(eventSearchTerm.toLowerCase()) ||
        event.description?.toLowerCase().includes(eventSearchTerm.toLowerCase())
    );
  }, [filteredEventsByStatus, eventSearchTerm]);

  const paginatedEvents = useMemo(() => {
    const startIndex = (currentPage - 1) * EVENTS_PER_PAGE;
    return filteredEvents.slice(startIndex, startIndex + EVENTS_PER_PAGE);
  }, [filteredEvents, currentPage, EVENTS_PER_PAGE]);

  const totalPages = Math.ceil(filteredEvents.length / EVENTS_PER_PAGE);
  const filteredAudiences = useMemo(() => {
    if (!selectedEvent || !audiences) return [];
    return audiences.filter(
      (audience: Audience) =>
        (audience.name?.toLowerCase() || "").includes(
          searchTerm.toLowerCase()
        ) ||
        (audience.email?.toLowerCase() || "").includes(
          searchTerm.toLowerCase()
        ) ||
        (audience.phone || "").includes(searchTerm)
    );
  }, [selectedEvent, searchTerm, audiences]);

  // Format date for display
  const formatDate = (dateString: string) => {
    if (!dateString) return "";
    try {
      return new Date(dateString).toLocaleDateString(
        language === "km" ? "km-KH" : "en-US",
        {
          year: "numeric",
          month: "long",
          day: "numeric",
          hour: "2-digit",
          minute: "2-digit",
        }
      );
    } catch (error) {
      return dateString;
    }
  };
  const handlePrint = async () => {
    if (!selectedEvent) return;

    try {
      // Use existing filteredAudiences data that's already loaded in the component
      // Also try to get fresh data from the API for more complete information
      let audienceData = filteredAudiences;
      let detailedAudienceData = [];

      try {
        // Try to get more detailed audience data from the API
        detailedAudienceData = await getEventAudiences(selectedEvent.id);
      } catch (error) {
        console.warn(
          "Could not fetch detailed audience data, using filtered data:",
          error
        );
        // Fall back to using filteredAudiences if API call fails
      }

      // Use detailed data if available and not empty, otherwise use filtered data
      const printData =
        detailedAudienceData.length > 0 ? detailedAudienceData : audienceData;

      const currentDate = new Date().toLocaleDateString(
        language === "km" ? "km-KH" : "en-US",
        {
          year: "numeric",
          month: "long",
          day: "numeric",
        }
      );

      const printContent = `
        <div style="max-width: 800px; margin: 0 auto; padding: 20px;">
          <div style="text-align: center; margin-bottom: 30px; border-bottom: 2px solid #333; padding-bottom: 20px;">
            <h1 style="color: #333; margin-bottom: 10px;">${selectedEvent.name}</h1>
            <h2 style="color: #666; font-weight: normal; margin-bottom: 5px;">${t("Event Registration Report")}</h2>
            <p style="color: #999; margin: 0;">${t("Generated on")}: ${currentDate}</p>
          </div>

          <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 20px; margin-bottom: 30px;">
            <div style="background: #f8f9fa; padding: 15px; border-radius: 8px;">
              <h3 style="color: #333; margin-top: 0;">${t("Event Information")}</h3>
              <p><strong>${t("Event Name")}:</strong> ${selectedEvent.name}</p>
              <p><strong>${t("Category")}:</strong> ${selectedEvent.category}</p>
              <p><strong>${t("Start Date")}:</strong> ${formatDate(selectedEvent.startDateTime)}</p>
              <p><strong>${t("End Date")}:</strong> ${formatDate(selectedEvent.endDateTime)}</p>
              <p><strong>${t("Status")}:</strong> ${selectedEvent.status}</p>
            </div>
            
            <div style="background: #f8f9fa; padding: 15px; border-radius: 8px;">
              <h3 style="color: #333; margin-top: 0;">${t("Registration Statistics")}</h3>
              <p><strong>${t("Total Capacity")}:</strong> ${selectedEvent.capacity}</p>
              <p><strong>${t("Total Registered")}:</strong> ${printData.length}</p>
              <p><strong>${t("Available Spots")}:</strong> ${selectedEvent.capacity - printData.length}</p>
              <p><strong>${t("Occupancy Rate")}:</strong> ${selectedEvent.capacity > 0 ? Math.round((printData.length / selectedEvent.capacity) * 100) : 0}%</p>
            </div>
          </div>

          ${
            selectedEvent.description
              ? `
            <div style="margin-bottom: 30px;">
              <h3 style="color: #333;">${t("Event Description")}</h3>
              <p style="background: #f8f9fa; padding: 15px; border-radius: 8px; line-height: 1.6;">${selectedEvent.description}</p>
            </div>
          `
              : ""
          }

          <div>
            <h3 style="color: #333; margin-bottom: 20px;">${t("Registered Participants")} (${printData.length})</h3>
            ${
              printData.length > 0
                ? `
              <table style="width: 100%; border-collapse: collapse; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
                <thead>
                  <tr style="background: #333; color: white;">
                    <th style="padding: 12px; text-align: left; border: 1px solid #ddd;">#</th>
                    <th style="padding: 12px; text-align: left; border: 1px solid #ddd;">${t("Full Name")}</th>
                    <th style="padding: 12px; text-align: left; border: 1px solid #ddd;">${t("Email")}</th>
                    <th style="padding: 12px; text-align: left; border: 1px solid #ddd;">${t("Phone Number")}</th>
                    <th style="padding: 12px; text-align: left; border: 1px solid #ddd;">${t("Registration Date")}</th>
                    ${detailedAudienceData.length > 0 ? `<th style="padding: 12px; text-align: left; border: 1px solid #ddd;">${t("Check-in Status")}</th>` : ""}
                  </tr>
                </thead>
                <tbody>
                  ${printData
                    .map((participant: any, index: number) => {
                      // Check if this is detailed data (User interface) or basic data (Audience interface)
                      const isDetailedData = participant.fullName !== undefined;

                      return `
                        <tr style="background: ${index % 2 === 0 ? "#f8f9fa" : "white"};">
                          <td style="padding: 10px; border: 1px solid #ddd;">${index + 1}</td>
                          <td style="padding: 10px; border: 1px solid #ddd;">${isDetailedData ? participant.fullName || "N/A" : participant.name || "N/A"}</td>
                          <td style="padding: 10px; border: 1px solid #ddd;">${participant.email || "N/A"}</td>
                          <td style="padding: 10px; border: 1px solid #ddd;">${isDetailedData ? participant.phoneNumber || "N/A" : participant.phone || "N/A"}</td>
                          <td style="padding: 10px; border: 1px solid #ddd;">${participant.registrationDate ? formatDate(participant.registrationDate) : "N/A"}</td>
                          ${
                            detailedAudienceData.length > 0
                              ? `
                            <td style="padding: 10px; border: 1px solid #ddd;">
                              <span style="padding: 4px 8px; border-radius: 4px; font-size: 12px; color: white; background: ${participant.checkedIn ? "#22c55e" : "#ef4444"};">
                                ${participant.checkedIn ? t("Checked In") : t("Not Checked In")}
                              </span>
                            </td>
                          `
                              : ""
                          }
                        </tr>
                      `;
                    })
                    .join("")}
                </tbody>
              </table>
            `
                : `
              <div style="text-align: center; padding: 40px; background: #f8f9fa; border-radius: 8px;">
                <p style="color: #666; font-size: 16px;">${t("No registered participants yet")}</p>
              </div>
            `
            }
          </div>

          <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #ddd; text-align: center; color: #666; font-size: 12px;">
            <p>${t("This report was generated automatically")} - ${new Date().toLocaleString(language === "km" ? "km-KH" : "en-US")}</p>
          </div>
        </div>
      `;

      const printWindow = window.open("", "_blank");
      if (printWindow) {
        printWindow.document.write(`
          <html>
            <head>
              <title>${selectedEvent.name} - ${t("Registration Report")}</title>
              <style>
                @media print {
                  body { margin: 0; }
                  .no-print { display: none; }
                }
                body { 
                  font-family: ${language === "km" ? "'Kantumruy Pro'" : "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif"}; 
                  line-height: 1.4;
                  color: #333;
                  background: white;
                }
                h1, h2, h3 { margin-top: 0; }
                table { border-collapse: collapse; }
                .header { page-break-after: avoid; }
                .participant-table { page-break-inside: avoid; }
              </style>
            </head>
            <body>
              ${printContent}
            </body>
          </html>
        `);
        printWindow.document.close();
        printWindow.print();
      }
    } catch (error) {
      console.error("Error generating print report:", error);
      toast({
        title: t("Error"),
        description: t("Failed to generate print report. Please try again."),
        variant: "destructive",
      });
    }
  };
  const handleExport = async () => {
    if (!selectedEvent) return;

    try {
      // Use existing filteredAudiences data that's already loaded in the component
      // Also try to get fresh data from the API for more complete information
      let audienceData = filteredAudiences;
      let detailedAudienceData = [];

      try {
        // Try to get more detailed audience data from the API
        detailedAudienceData = await getEventAudiences(selectedEvent.id);
        console.log("Detailed audience data:", detailedAudienceData);
      } catch (error) {
        console.warn(
          "Could not fetch detailed audience data, using filtered data:",
          error
        );
        // Fall back to using filteredAudiences if API call fails
      }

      // Use detailed data if available and not empty, otherwise use filtered data
      const exportData =
        detailedAudienceData.length > 0 ? detailedAudienceData : audienceData;
      console.log("Export data to use:", exportData);

      // Create event information sheet
      const eventInfoData = [
        [t("Event Information"), ""],
        [t("Event Name"), selectedEvent.name],
        [t("Category"), selectedEvent.category],
        [
          t("Description"),
          selectedEvent.description || t("No description available"),
        ],
        [t("Start Date"), formatDate(selectedEvent.startDateTime)],
        [t("End Date"), formatDate(selectedEvent.endDateTime)],
        [t("Status"), selectedEvent.status],
        [t("Location"), selectedEvent.location],
        ["", ""],
        [t("Registration Statistics"), ""],
        [t("Total Capacity"), selectedEvent.capacity],
        [t("Total Registered"), exportData.length],
        [t("Available Spots"), selectedEvent.capacity - exportData.length],
        [
          t("Occupancy Rate"),
          `${selectedEvent.capacity > 0 ? Math.round((exportData.length / selectedEvent.capacity) * 100) : 0}%`,
        ],
        ["", ""],
        [
          t("Report Generated"),
          new Date().toLocaleString(language === "km" ? "km-KH" : "en-US"),
        ],
      ];

      // Create participants data sheet - handle both data structures
      const participantsData = exportData.map(
        (participant: any, index: number) => {
          // Check if this is detailed data (User interface) or basic data (Audience interface)
          const isDetailedData = participant.fullName !== undefined;

          return {
            [t("No.")]: index + 1,
            [t("Full Name")]: isDetailedData
              ? participant.fullName || "N/A"
              : participant.name || "N/A",
            [t("Email")]: participant.email || "N/A",
            [t("Phone Number")]: isDetailedData
              ? participant.phoneNumber || "N/A"
              : participant.phone || "N/A",
            [t("Gender")]: participant.gender || "N/A",
            [t("Date of Birth")]: participant.dateOfBirth || "N/A",
            [t("Address")]: participant.address || "N/A",
            [t("Occupation")]: participant.occupation || "N/A",
            [t("Registration Date")]: participant.registrationDate
              ? formatDate(participant.registrationDate)
              : "N/A",
            [t("Check-in Status")]:
              participant.checkedIn !== undefined
                ? participant.checkedIn
                  ? t("Checked In")
                  : t("Not Checked In")
                : "N/A",
            [t("Registration Token")]: participant.registrationToken || "N/A",
          };
        }
      );

      // Create workbook
      const workbook = XLSX.utils.book_new();

      // Add event information sheet
      const eventInfoSheet = XLSX.utils.aoa_to_sheet(eventInfoData);
      XLSX.utils.book_append_sheet(
        workbook,
        eventInfoSheet,
        t("Event Information")
      );

      // Add participants sheet only if we have data
      if (participantsData.length > 0) {
        const participantsSheet = XLSX.utils.json_to_sheet(participantsData);
        XLSX.utils.book_append_sheet(
          workbook,
          participantsSheet,
          t("Participants")
        );
      } else {
        // Add an empty participants sheet with headers only
        const emptyParticipantsData = [
          {
            [t("No.")]: "",
            [t("Full Name")]: "",
            [t("Email")]: "",
            [t("Phone Number")]: "",
            [t("Gender")]: "",
            [t("Date of Birth")]: "",
            [t("Address")]: "",
            [t("Occupation")]: "",
            [t("Registration Date")]: "",
            [t("Check-in Status")]: "",
            [t("Registration Token")]: "",
          },
        ];
        const emptySheet = XLSX.utils.json_to_sheet(emptyParticipantsData);
        XLSX.utils.book_append_sheet(workbook, emptySheet, t("Participants"));
      }

      // Generate and download file
      const excelBuffer = XLSX.write(workbook, {
        bookType: "xlsx",
        type: "array",
      });

      const data = new Blob([excelBuffer], {
        type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      });

      const link = document.createElement("a");
      link.href = window.URL.createObjectURL(data);
      const fileName = `${selectedEvent.name.replace(/[^a-z0-9]/gi, "_")}_${t("Registration_Report")}_${new Date().toISOString().split("T")[0]}.xlsx`;
      link.download = fileName;
      link.click();
      toast({
        title: t("Success"),
        description: `${t("Report exported successfully")} - ${exportData.length} ${t("participants included")}`,
      });
    } catch (error) {
      console.error("Error exporting report:", error);
      toast({
        title: t("Error"),
        description: t("Failed to export report. Please try again."),
        variant: "destructive",
      });
    }
  };

  const handlePDFExport = async () => {
    if (!selectedEvent) return;

    try {
      // Use existing filteredAudiences data that's already loaded in the component
      // Also try to get fresh data from the API for more complete information
      let audienceData = filteredAudiences;
      let detailedAudienceData = [];

      try {
        // Try to get more detailed audience data from the API
        detailedAudienceData = await getEventAudiences(selectedEvent.id);
      } catch (error) {
        console.warn(
          "Could not fetch detailed audience data, using filtered data:",
          error
        );
        // Fall back to using filteredAudiences if API call fails
      }

      // Use detailed data if available and not empty, otherwise use filtered data
      const exportData =
        detailedAudienceData.length > 0 ? detailedAudienceData : audienceData;

      const currentDate = new Date().toLocaleDateString(
        language === "km" ? "km-KH" : "en-US",
        {
          year: "numeric",
          month: "long",
          day: "numeric",
        }
      );

      const currentTime = new Date().toLocaleTimeString(
        language === "km" ? "km-KH" : "en-US",
        {
          hour: "2-digit",
          minute: "2-digit",
        }
      );

      const pdfContent = `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="UTF-8">
          <title>${selectedEvent.name} - ${t("Registration Report")}</title>
          <style>
            @page {
              size: A4;
              margin: 0.5in;
            }
            
            * {
              margin: 0;
              padding: 0;
              box-sizing: border-box;
            }
            
            body {
              font-family: ${language === "km" ? "'Kantumruy Pro'" : "'Arial', 'Helvetica', sans-serif"};
              font-size: 10px;
              line-height: 1.3;
              color: #2c2c2c;
              background: white;
            }
            
            .header {
              text-align: center;
              padding: 15px 0;
              border-bottom: 2px solid #1a365d;
              margin-bottom: 20px;
            }
            
            .header h1 {
              font-size: 18px;
              color: #1a365d;
              margin-bottom: 5px;
              font-weight: bold;
            }
            
            .header h2 {
              font-size: 14px;
              color: #4a5568;
              margin-bottom: 3px;
              font-weight: normal;
            }
            
            .header .meta {
              font-size: 9px;
              color: #718096;
            }
            
            .info-grid {
              display: grid;
              grid-template-columns: 1fr 1fr;
              gap: 15px;
              margin-bottom: 20px;
            }
            
            .info-box {
              background: #f7fafc;
              border: 1px solid #e2e8f0;
              border-radius: 4px;
              padding: 12px;
            }
            
            .info-box h3 {
              font-size: 11px;
              color: #2d3748;
              margin-bottom: 8px;
              font-weight: bold;
              border-bottom: 1px solid #e2e8f0;
              padding-bottom: 3px;
            }
            
            .info-item {
              margin-bottom: 4px;
              font-size: 9px;
            }
            
            .info-label {
              font-weight: bold;
              color: #4a5568;
              display: inline-block;
              width: 80px;
            }
            
            .info-value {
              color: #2d3748;
            }
            
            .description-section {
              margin-bottom: 20px;
            }
            
            .description-section h3 {
              font-size: 11px;
              color: #2d3748;
              margin-bottom: 8px;
              font-weight: bold;
            }
            
            .description-content {
              background: #f7fafc;
              border: 1px solid #e2e8f0;
              border-radius: 4px;
              padding: 10px;
              font-size: 9px;
              line-height: 1.4;
              color: #4a5568;
            }
            
            .participants-section h3 {
              font-size: 12px;
              color: #2d3748;
              margin-bottom: 10px;
              font-weight: bold;
              display: flex;
              justify-content: space-between;
              align-items: center;
            }
            
            .participant-count {
              background: #1a365d;
              color: white;
              padding: 2px 6px;
              border-radius: 3px;
              font-size: 9px;
            }
            
            table {
              width: 100%;
              border-collapse: collapse;
              margin-bottom: 15px;
              font-size: 8px;
            }
            
            th {
              background: #2d3748;
              color: white;
              padding: 6px 4px;
              text-align: left;
              border: 1px solid #4a5568;
              font-weight: bold;
              font-size: 8px;
            }
            
            td {
              padding: 4px 4px;
              border: 1px solid #e2e8f0;
              vertical-align: top;
              font-size: 8px;
            }
            
            tr:nth-child(even) {
              background: #f7fafc;
            }
            
            tr:nth-child(odd) {
              background: white;
            }
            
            .status-badge {
              padding: 2px 4px;
              border-radius: 2px;
              font-size: 7px;
              font-weight: bold;
              color: white;
              text-align: center;
              display: inline-block;
              min-width: 60px;
            }
            
            .status-checked-in {
              background: #38a169;
            }
            
            .status-not-checked-in {
              background: #e53e3e;
            }
            
            .footer {
              margin-top: 20px;
              padding-top: 10px;
              border-top: 1px solid #e2e8f0;
              text-align: center;
              font-size: 8px;
              color: #718096;
            }
            
            .no-participants {
              text-align: center;
              padding: 30px;
              background: #f7fafc;
              border: 1px dashed #cbd5e0;
              border-radius: 4px;
              color: #718096;
              font-size: 10px;
            }
            
            .summary-stats {
              display: grid;
              grid-template-columns: repeat(4, 1fr);
              gap: 8px;
              margin-bottom: 15px;
            }
            
            .stat-card {
              background: #edf2f7;
              border: 1px solid #d2d8e0;
              border-radius: 4px;
              padding: 8px;
              text-align: center;
            }
            
            .stat-number {
              font-size: 14px;
              font-weight: bold;
              color: #2d3748;
              display: block;
            }
            
            .stat-label {
              font-size: 8px;
              color: #4a5568;
              margin-top: 2px;
            }
            
            @media print {
              body { -webkit-print-color-adjust: exact; }
              .info-grid { page-break-inside: avoid; }
              .participants-section { page-break-before: auto; }
              table { page-break-inside: auto; }
              tr { page-break-inside: avoid; page-break-after: auto; }
              thead { display: table-header-group; }
            }
          </style>
        </head>
        <body>
          <div class="header">
            <h1>${selectedEvent.name}</h1>
            <h2>${t("Event Registration Report")}</h2>
            <div class="meta">
              ${t("Generated on")}: ${currentDate} ${t("at")} ${currentTime} | 
              ${t("Total Participants")}: ${exportData.length} | 
              ${t("Capacity")}: ${selectedEvent.capacity}
            </div>
          </div>

          <div class="summary-stats">
            <div class="stat-card">
              <span class="stat-number">${selectedEvent.capacity}</span>
              <div class="stat-label">${t("Total Capacity")}</div>
            </div>
            <div class="stat-card">
              <span class="stat-number">${exportData.length}</span>
              <div class="stat-label">${t("Registered")}</div>
            </div>
            <div class="stat-card">
              <span class="stat-number">${selectedEvent.capacity - exportData.length}</span>
              <div class="stat-label">${t("Available")}</div>
            </div>
            <div class="stat-card">
              <span class="stat-number">${selectedEvent.capacity > 0 ? Math.round((exportData.length / selectedEvent.capacity) * 100) : 0}%</span>
              <div class="stat-label">${t("Filled")}</div>
            </div>
          </div>

          <div class="info-grid">
            <div class="info-box">
              <h3>${t("Event Details")}</h3>
              <div class="info-item">
                <span class="info-label">${t("Category")}:</span>
                <span class="info-value">${selectedEvent.category}</span>
              </div>
              <div class="info-item">
                <span class="info-label">${t("Status")}:</span>
                <span class="info-value">${selectedEvent.status}</span>
              </div>
              <div class="info-item">
                <span class="info-label">${t("Start Date")}:</span>
                <span class="info-value">${formatDate(selectedEvent.startDateTime)}</span>
              </div>
              <div class="info-item">
                <span class="info-label">${t("End Date")}:</span>
                <span class="info-value">${formatDate(selectedEvent.endDateTime)}</span>
              </div>
            </div>
            
            <div class="info-box">
              <h3>${t("Location & Contact")}</h3>
              <div class="info-item">
                <span class="info-label">${t("Venue")}:</span>
                <span class="info-value">${selectedEvent.location}</span>
              </div>
              ${
                adminData
                  ? `
                <div class="info-item">
                  <span class="info-label">${t("Organizer")}:</span>
                  <span class="info-value">${getAdminDisplayName(adminData)}</span>
                </div>
                ${
                  adminData.email
                    ? `
                  <div class="info-item">
                    <span class="info-label">${t("Email")}:</span>
                    <span class="info-value">${adminData.email}</span>
                  </div>
                `
                    : ""
                }
                ${
                  adminData.phone
                    ? `
                  <div class="info-item">
                    <span class="info-label">${t("Phone")}:</span>
                    <span class="info-value">${adminData.phone}</span>
                  </div>
                `
                    : ""
                }
              `
                  : ""
              }
            </div>
          </div>

          ${
            selectedEvent.description
              ? `
            <div class="description-section">
              <h3>${t("Event Description")}</h3>
              <div class="description-content">${selectedEvent.description}</div>
            </div>
          `
              : ""
          }

          <div class="participants-section">
            <h3>
              ${t("Registered Participants")}
              <span class="participant-count">${exportData.length}</span>
            </h3>
            
            ${
              exportData.length > 0
                ? `
              <table>
                <thead>
                  <tr>
                    <th style="width: 25px;">#</th>
                    <th style="width: 120px;">${t("Full Name")}</th>
                    <th style="width: 100px;">${t("Email")}</th>
                    <th style="width: 80px;">${t("Phone")}</th>
                    ${
                      detailedAudienceData.length > 0
                        ? `
                      <th style="width: 45px;">${t("Gender")}</th>
                      <th style="width: 80px;">${t("Occupation")}</th>
                    `
                        : ""
                    }
                    <th style="width: 70px;">${t("Reg. Date")}</th>
                    ${
                      detailedAudienceData.length > 0
                        ? `
                      <th style="width: 65px;">${t("Status")}</th>
                    `
                        : ""
                    }
                  </tr>
                </thead>
                <tbody>
                  ${exportData
                    .map((participant: any, index: number) => {
                      // Check if this is detailed data (User interface) or basic data (Audience interface)
                      const isDetailedData = participant.fullName !== undefined;

                      return `
                        <tr>
                          <td>${index + 1}</td>
                          <td>${isDetailedData ? participant.fullName || "N/A" : participant.name || "N/A"}</td>
                          <td>${participant.email || "N/A"}</td>
                          <td>${isDetailedData ? participant.phoneNumber || "N/A" : participant.phone || "N/A"}</td>
                          ${
                            detailedAudienceData.length > 0
                              ? `
                            <td>${participant.gender || "N/A"}</td>
                            <td>${participant.occupation || "N/A"}</td>
                          `
                              : ""
                          }
                          <td>${participant.registrationDate ? new Date(participant.registrationDate).toLocaleDateString(language === "km" ? "km-KH" : "en-US", {month: "short", day: "numeric"}) : "N/A"}</td>
                          ${
                            detailedAudienceData.length > 0
                              ? `
                            <td>
                              <span class="status-badge ${participant.checkedIn ? "status-checked-in" : "status-not-checked-in"}">
                                ${participant.checkedIn ? t("In") : t("Out")}
                              </span>
                            </td>
                          `
                              : ""
                          }
                        </tr>
                      `;
                    })
                    .join("")}
                </tbody>
              </table>
            `
                : `
              <div class="no-participants">
                <strong>${t("No registered participants yet")}</strong><br>
                ${t("This event currently has no registered participants.")}
              </div>
            `
            }
          </div>

          <div class="footer">
            <div>
              ${t("This report was automatically generated on")} ${new Date().toLocaleString(language === "km" ? "km-KH" : "en-US")}
            </div>
            <div style="margin-top: 3px;">
              ${t("Event Management System")} | ${t("Confidential Document")}
            </div>
          </div>
        </body>
        </html>
      `;

      // Create and open PDF in new window for printing
      const printWindow = window.open("", "_blank");
      if (printWindow) {
        printWindow.document.write(pdfContent);
        printWindow.document.close();

        // Trigger print dialog after a short delay to ensure content is loaded
        setTimeout(() => {
          printWindow.print();
        }, 500);
      }

      toast({
        title: t("Success"),
        description: `${t("PDF report generated successfully")} - ${exportData.length} ${t("participants included")}`,
      });
    } catch (error) {
      console.error("Error generating PDF report:", error);
      toast({
        title: t("Error"),
        description: t("Failed to generate PDF report. Please try again."),
        variant: "destructive",
      });
    }
  };

  // Google Maps URL handler
  const getGoogleMapsEmbedUrl = (location: string) => {
    // Check if location is already a Google Maps URL
    if (location.includes("maps.app.goo.gl")) {
      // For shortened URLs, we need to use a different approach
      // Convert goo.gl URL to a shareable embed format
      const urlParts = location.split("/");
      const shortCode = urlParts[urlParts.length - 1];
      return `https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3153.8197573808573!2d-122.41941734869295!3d37.77492097975963!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMzfCsDQ2JzI5LjciTiAxMjLCsDI1JzA5LjkiVw!5e0!3m2!1sen!2sus!4v1234567890123!5m2!1sen!2sus&q=${encodeURIComponent(location)}`;
    } else if (location.includes("google.com/maps")) {
      // For full Google Maps URLs, try to extract embed format
      return location.replace("/maps/", "/maps/embed/");
    }

    // If it's a regular address, use simple embed without API key
    return `https://maps.google.com/maps?q=${encodeURIComponent(location)}&output=embed`;
  };
  const initializeMap = (mapDiv: HTMLElement, location: string) => {
    // Show loading state initially
    const loading = mapDiv.parentElement?.querySelector(
      ".map-loading"
    ) as HTMLElement;
    const fallback = mapDiv.parentElement?.querySelector(
      ".map-fallback"
    ) as HTMLElement;

    if (loading) {
      loading.style.display = "flex";
      loading.classList.remove("hidden");
    }
    if (fallback) {
      fallback.style.display = "none";
      fallback.classList.add("hidden");
    }

    // Show the map div
    mapDiv.style.display = "block";

    // Check if Google Maps API is available
    if (
      typeof window !== "undefined" &&
      (window as any).google &&
      (window as any).google.maps
    ) {
      // Hide loading and use Google Maps API
      if (loading) {
        loading.style.display = "none";
        loading.classList.add("hidden");
      }
      createInteractiveMap(mapDiv, location);
    } else {
      // Load Google Maps API and then create map
      loadGoogleMapsAPI()
        .then(() => {
          if (loading) {
            loading.style.display = "none";
            loading.classList.add("hidden");
          }
          createInteractiveMap(mapDiv, location);
        })
        .catch((error) => {
          console.error("Failed to load Google Maps API:", error);
          if (loading) {
            loading.style.display = "none";
            loading.classList.add("hidden");
          }
          // Fallback to iframe if API fails to load
          createIframeMap(mapDiv, location);
        });
    }
  };
  const createIframeMap = (mapDiv: HTMLElement, location: string) => {
    try {
      const iframe = document.createElement("iframe");
      iframe.width = "100%";
      iframe.height = "100%";
      iframe.style.border = "0";
      iframe.loading = "lazy";
      iframe.allowFullscreen = true;
      iframe.referrerPolicy = "no-referrer-when-downgrade";

      // Use different approaches based on URL type
      let embedUrl = "";
      if (location.includes("maps.app.goo.gl")) {
        // For shortened URLs, use simple embed approach
        embedUrl = `https://maps.google.com/maps?q=${encodeURIComponent(location)}&output=embed`;
      } else if (location.includes("google.com/maps")) {
        // For full Google Maps URLs, convert to embed format
        embedUrl = convertToEmbedUrl(location);
      } else {
        // For regular addresses
        embedUrl = `https://maps.google.com/maps?q=${encodeURIComponent(location)}&output=embed`;
      }

      iframe.src = embedUrl;

      // Set up a timer to check if the iframe loads successfully
      let hasLoaded = false;
      let loadTimeout: NodeJS.Timeout;

      const onLoad = () => {
        if (!hasLoaded) {
          hasLoaded = true;
          clearTimeout(loadTimeout);
          console.log("Map loaded successfully");

          // Hide the fallback if it's showing
          const fallback = mapDiv.parentElement?.querySelector(
            ".map-fallback"
          ) as HTMLElement;
          if (fallback) {
            fallback.style.display = "none";
            fallback.classList.add("hidden");
          }
          mapDiv.style.display = "block";
        }
      };

      const onError = () => {
        if (!hasLoaded) {
          hasLoaded = true;
          clearTimeout(loadTimeout);
          console.log("Map failed to load, showing fallback");
          showMapFallback(mapDiv);
        }
      };

      iframe.onload = onLoad;
      iframe.onerror = onError;

      // Fallback timer - if map doesn't load within 3 seconds, show fallback
      loadTimeout = setTimeout(() => {
        if (!hasLoaded) {
          console.log("Map loading timeout, showing fallback");
          onError();
        }
      }, 3000);

      // Clear existing content and add iframe
      mapDiv.innerHTML = "";
      mapDiv.appendChild(iframe);

      // Also try to detect if the iframe content is blocked
      setTimeout(() => {
        try {
          if (iframe.contentWindow && !hasLoaded) {
            // If we can't access the iframe content, it might be blocked
            const fallback = mapDiv.parentElement?.querySelector(
              ".map-fallback"
            ) as HTMLElement;
            if (fallback && fallback.style.display === "none") {
              // Map seems to be working, keep it
              onLoad();
            }
          }
        } catch (e) {
          // Cross-origin restrictions are normal for Google Maps embeds
          // This means the iframe is likely working
          if (!hasLoaded) {
            onLoad();
          }
        }
      }, 1500);
    } catch (error) {
      console.error("Error creating iframe map:", error);
      showMapFallback(mapDiv);
    }
  };

  // Load Google Maps API dynamically
  const loadGoogleMapsAPI = (): Promise<void> => {
    return new Promise((resolve, reject) => {
      // Check if already loaded
      if ((window as any).google && (window as any).google.maps) {
        resolve();
        return;
      }

      // Check if script is already being loaded
      if (document.querySelector('script[src*="maps.googleapis.com"]')) {
        // Wait for it to load
        const checkLoaded = () => {
          if ((window as any).google && (window as any).google.maps) {
            resolve();
          } else {
            setTimeout(checkLoaded, 100);
          }
        };
        checkLoaded();
        return;
      }

      // Create script tag
      const script = document.createElement("script");
      script.src = `https://maps.googleapis.com/maps/api/js?key=${GOOGLE_MAPS_API_KEY}&libraries=places`;
      script.async = true;
      script.defer = true;

      script.onload = () => {
        if ((window as any).google && (window as any).google.maps) {
          resolve();
        } else {
          reject(new Error("Google Maps API failed to load"));
        }
      };

      script.onerror = () => {
        reject(new Error("Failed to load Google Maps API script"));
      };

      document.head.appendChild(script);
    });
  };

  // Helper function to resolve shortened Google Maps URLs
  const resolveGoogleMapsUrl = async (
    shortUrl: string
  ): Promise<string | null> => {
    try {
      // Try to resolve the shortened URL by fetching it
      const response = await fetch(shortUrl, {
        method: "HEAD",
        redirect: "follow",
      });

      if (response.url && response.url.includes("google.com/maps")) {
        return response.url;
      }

      return null;
    } catch (error) {
      console.error("Error resolving short URL:", error);
      return null;
    }
  };

  // Helper function to convert Google Maps URL to embed format
  const convertToEmbedUrl = (url: string): string => {
    try {
      // Extract coordinates or place ID from the URL
      const urlObj = new URL(url);

      // Look for coordinates in the URL
      const coordMatch = url.match(/@(-?\d+\.?\d*),(-?\d+\.?\d*)/);
      if (coordMatch) {
        const lat = coordMatch[1];
        const lng = coordMatch[2];
        return `https://maps.google.com/maps?q=${lat},${lng}&output=embed`;
      }

      // Look for place ID
      const placeMatch = url.match(/place\/([^\/]+)/);
      if (placeMatch) {
        const placeName = decodeURIComponent(placeMatch[1]);
        return `https://maps.google.com/maps?q=${encodeURIComponent(placeName)}&output=embed`;
      }

      // Look for search query
      const searchMatch = url.match(/[?&]q=([^&]+)/);
      if (searchMatch) {
        const query = decodeURIComponent(searchMatch[1]);
        return `https://maps.google.com/maps?q=${encodeURIComponent(query)}&output=embed`;
      }

      // Fallback: just replace the base URL
      return url.replace("google.com/maps", "google.com/maps/embed");
    } catch (error) {
      console.error("Error converting URL:", error);
      return url.replace("google.com/maps", "google.com/maps/embed");
    }
  };
  const createInteractiveMap = (mapDiv: HTMLElement, location: string) => {
    try {
      // Check if Google Maps API is available
      if (!(window as any).google || !(window as any).google.maps) {
        console.log("Google Maps API not available, showing fallback");
        showMapFallback(mapDiv);
        return;
      }

      const geocoder = new (window as any).google.maps.Geocoder();

      // Handle different types of locations
      if (
        location.includes("maps.app.goo.gl") ||
        location.includes("google.com/maps")
      ) {
        // For Google Maps URLs, try to extract coordinates or place ID
        handleGoogleMapsUrl(mapDiv, location, geocoder);
      } else {
        // For regular addresses, geocode them
        geocodeAndCreateMap(mapDiv, location, geocoder);
      }
    } catch (error) {
      console.error("Error creating interactive map:", error);
      showMapFallback(mapDiv);
    }
  };

  const handleGoogleMapsUrl = (
    mapDiv: HTMLElement,
    url: string,
    geocoder: any
  ) => {
    // Try to extract place information from Google Maps URL
    try {
      // Check for place ID in URL
      const placeIdMatch = url.match(/place_id:([^&]+)/);
      if (placeIdMatch) {
        const placeId = placeIdMatch[1];
        createMapWithPlaceId(mapDiv, placeId);
        return;
      }

      // Check for coordinates in URL
      const coordMatch = url.match(/@(-?\d+\.\d+),(-?\d+\.\d+)/);
      if (coordMatch) {
        const lat = parseFloat(coordMatch[1]);
        const lng = parseFloat(coordMatch[2]);
        createMapWithCoordinates(mapDiv, {lat, lng}, url);
        return;
      }

      // Check for search query in URL
      const queryMatch = url.match(/[?&]q=([^&]+)/);
      if (queryMatch) {
        const query = decodeURIComponent(queryMatch[1]);
        geocodeAndCreateMap(mapDiv, query, geocoder);
        return;
      }

      // If we can't parse the URL, show fallback
      console.log("Could not parse Google Maps URL, showing fallback");
      showMapFallback(mapDiv);
    } catch (error) {
      console.error("Error handling Google Maps URL:", error);
      showMapFallback(mapDiv);
    }
  };

  const geocodeAndCreateMap = (
    mapDiv: HTMLElement,
    location: string,
    geocoder: any
  ) => {
    geocoder.geocode({address: location}, (results: any, status: any) => {
      if (status === "OK" && results && results[0]) {
        const position = results[0].geometry.location;
        createMapWithCoordinates(mapDiv, position, location);
      } else {
        console.log("Geocoding failed:", status);
        showMapFallback(mapDiv);
      }
    });
  };

  const createMapWithCoordinates = (
    mapDiv: HTMLElement,
    position: any,
    title: string
  ) => {
    try {
      const mapOptions = {
        center: position,
        zoom: 15,
        mapTypeControl: false,
        streetViewControl: false,
        fullscreenControl: true,
        zoomControl: true,
        mapTypeId: (window as any).google.maps.MapTypeId.ROADMAP,
      };

      const map = new (window as any).google.maps.Map(mapDiv, mapOptions);

      // Add marker
      const marker = new (window as any).google.maps.Marker({
        position: position,
        map: map,
        title: title,
      });

      // Add info window
      const infoWindow = new (window as any).google.maps.InfoWindow({
        content: `<div style="padding: 8px; font-family: system-ui, -apple-system, sans-serif;">
          <strong style="color: #1f2937;">${title}</strong>
        </div>`,
      });

      marker.addListener("click", () => {
        infoWindow.open(map, marker);
      });

      // Auto-open info window
      setTimeout(() => {
        infoWindow.open(map, marker);
      }, 500);
    } catch (error) {
      console.error("Error creating map with coordinates:", error);
      showMapFallback(mapDiv);
    }
  };

  const createMapWithPlaceId = (mapDiv: HTMLElement, placeId: string) => {
    try {
      const map = new (window as any).google.maps.Map(mapDiv, {
        zoom: 15,
        mapTypeControl: false,
        streetViewControl: false,
        fullscreenControl: true,
        zoomControl: true,
      });

      const service = new (window as any).google.maps.places.PlacesService(map);
      service.getDetails(
        {
          placeId: placeId,
          fields: ["name", "geometry", "formatted_address"],
        },
        (place: any, status: any) => {
          if (status === "OK" && place && place.geometry) {
            map.setCenter(place.geometry.location);

            const marker = new (window as any).google.maps.Marker({
              position: place.geometry.location,
              map: map,
              title: place.name || place.formatted_address,
            });

            const infoWindow = new (window as any).google.maps.InfoWindow({
              content: `<div style="padding: 8px; font-family: system-ui, -apple-system, sans-serif;">
              <strong style="color: #1f2937;">${place.name || "Location"}</strong>
              ${place.formatted_address ? `<br><span style="color: #6b7280; font-size: 0.875rem;">${place.formatted_address}</span>` : ""}
            </div>`,
            });

            marker.addListener("click", () => {
              infoWindow.open(map, marker);
            });

            setTimeout(() => {
              infoWindow.open(map, marker);
            }, 500);
          } else {
            console.log("Place details request failed:", status);
            showMapFallback(mapDiv);
          }
        }
      );
    } catch (error) {
      console.error("Error creating map with place ID:", error);
      showMapFallback(mapDiv);
    }
  };
  const showMapFallback = (mapDiv: HTMLElement) => {
    // Hide the map div
    mapDiv.style.display = "none";

    // Show the fallback
    const fallback = mapDiv.parentElement?.querySelector(
      ".map-fallback"
    ) as HTMLElement;
    if (fallback) {
      fallback.style.display = "flex";
      fallback.classList.remove("hidden");
    }
  };

  const handleEventSelect = (event: Event) => {
    setSelectedEvent(event);
    setIsSheetOpen(true);
  };
  const getEventStatusBadge = (event: Event) => {
    return (
      <Badge
        variant={
          event.status === "upcoming"
            ? "default"
            : event.status === "ongoing"
              ? "secondary"
              : "outline"
        }
        className={`border transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 px-2 py-0.5 rounded-full text-xs font-medium inline-flex items-center justify-center w-24 ${
          event.status === "upcoming"
            ? "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-100"
            : event.status === "ongoing"
              ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100"
              : event.status === "finished"
                ? "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-100"
                : "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-100"
        }`}>
        <span
          className={`inline-block w-2 h-2 rounded-full mr-1.5 ${
            event.status === "upcoming"
              ? "bg-blue-500 dark:bg-blue-400"
              : event.status === "ongoing"
                ? "bg-green-500 dark:bg-green-400"
                : event.status === "finished"
                  ? "bg-yellow-500 dark:bg-yellow-400"
                  : "bg-gray-500 dark:bg-gray-400"
          }`}></span>
        {t(
          event.status?.charAt(0).toUpperCase() + event.status?.slice(1) ||
            "Unknown"
        )}
      </Badge>
    );
  };

  // Category badge function with colors
  const getCategoryBadge = (category: string) => {
    const categoryColors = {
      General: "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-100",
      Technology:
        "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-100",
      Education:
        "bg-indigo-100 text-indigo-800 dark:bg-indigo-900 dark:text-indigo-100",
      Business:
        "bg-emerald-100 text-emerald-800 dark:bg-emerald-900 dark:text-emerald-100",
      Health: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-100",
      Sports:
        "bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-100",
      Entertainment:
        "bg-pink-100 text-pink-800 dark:bg-pink-900 dark:text-pink-100",
      Food: "bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-100",
      Travel: "bg-cyan-100 text-cyan-800 dark:bg-cyan-900 dark:text-cyan-100",
      Music:
        "bg-violet-100 text-violet-800 dark:bg-violet-900 dark:text-violet-100",
    };

    const categoryDots = {
      General: "bg-gray-500 dark:bg-gray-400",
      Technology: "bg-purple-500 dark:bg-purple-400",
      Education: "bg-indigo-500 dark:bg-indigo-400",
      Business: "bg-emerald-500 dark:bg-emerald-400",
      Health: "bg-red-500 dark:bg-red-400",
      Sports: "bg-orange-500 dark:bg-orange-400",
      Entertainment: "bg-pink-500 dark:bg-pink-400",
      Food: "bg-amber-500 dark:bg-amber-400",
      Travel: "bg-cyan-500 dark:bg-cyan-400",
      Music: "bg-violet-500 dark:bg-violet-400",
    };

    const colorClass =
      categoryColors[category as keyof typeof categoryColors] ||
      categoryColors["General"];
    const dotClass =
      categoryDots[category as keyof typeof categoryDots] ||
      categoryDots["General"];

    return (
      <Badge
        variant="outline"
        className={`px-2 py-0.5 rounded-full text-xs font-medium inline-flex items-center justify-center ${colorClass}`}>
        <span
          className={`inline-block w-2 h-2 rounded-full mr-1.5 ${dotClass}`}></span>
        {category}
      </Badge>
    );
  };

  // Helper function to format admin display name
  const getAdminDisplayName = (admin: any): string => {
    if (!admin) return "Administrator";

    // Try different name combinations
    if (admin.firstName && admin.lastName) {
      return `${admin.firstName} ${admin.lastName}`;
    }
    if (admin.fullName) {
      return admin.fullName;
    }
    if (admin.displayName) {
      return admin.displayName;
    }
    if (admin.name) {
      return admin.name;
    }
    if (admin.username) {
      return admin.username;
    }

    return "Administrator";
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>{t("Select Event for Report")}</CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex flex-col items-center justify-center py-12">
              <RefreshCw className="h-8 w-8 animate-spin text-primary mb-4" />
              <h3 className="text-lg font-medium text-foreground mb-2">
                {t("Loading events...")}
              </h3>
              <p className="text-sm text-muted-foreground">
                {t("Please wait while we fetch your events")}
              </p>
            </div>
          ) : events.length === 0 ? (
            <div className="text-center py-12">
              <div className="mx-auto max-w-sm">
                <FileText className="mx-auto h-12 w-12 text-muted-foreground" />
                <h3 className="mt-4 text-lg font-medium text-foreground">
                  {t("No events found")}
                </h3>
                <p className="mt-2 text-sm text-muted-foreground">
                  {t(
                    "You haven't created any events yet. Create your first event to get started with reporting."
                  )}
                </p>
              </div>
            </div>
          ) : (
            <div className="space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    placeholder={t(
                      "Search events by name, location, or description..."
                    )}
                    value={eventSearchTerm}
                    onChange={(e) => {
                      setEventSearchTerm(e.target.value);
                      setCurrentPage(1);
                    }}
                    className="pl-10 h-10"
                  />
                </div>
                <div className="flex items-center space-x-2">
                  <Select
                    value={statusFilter}
                    onValueChange={(
                      value: "all" | "upcoming" | "ongoing" | "finished"
                    ) => setStatusFilter(value)}>
                    <SelectTrigger className="w-[140px]">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">{t("All Events")}</SelectItem>
                      <SelectItem value="upcoming">{t("Upcoming")}</SelectItem>
                      <SelectItem value="ongoing">{t("Ongoing")}</SelectItem>
                      <SelectItem value="finished">{t("Finished")}</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>{" "}
              <div className="border rounded-lg overflow-hidden bg-card">
                <Table>
                  <TableHeader>
                    <TableRow className="bg-muted/50">
                      <TableHead className="font-semibold">
                        {t("Event Name")}
                      </TableHead>
                      <TableHead className="font-semibold">
                        {t("Category")}
                      </TableHead>
                      <TableHead className="font-semibold">
                        {t("Location")}
                      </TableHead>{" "}
                      <TableHead className="font-semibold">
                        {t("End Date")}
                      </TableHead>
                      <TableHead className="font-semibold">
                        {t("Capacity")}
                      </TableHead>
                      <TableHead className="font-semibold">
                        {t("Registrations")}
                      </TableHead>
                      <TableHead className="font-semibold">
                        {t("Status")}
                      </TableHead>
                      <TableHead className="text-right font-semibold">
                        {t("Actions")}
                      </TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {paginatedEvents.map((event: Event) => (
                      <TableRow
                        key={event.id}
                        className="hover:bg-muted/50 transition-colors cursor-pointer"
                        onClick={() => handleEventSelect(event)}>
                        <TableCell className="font-medium">
                          <div className="space-y-1 max-w-xs">
                            <div className="font-semibold text-foreground truncate">
                              {event.name}
                            </div>
                            {event.description && (
                              <div className="text-sm text-muted-foreground line-clamp-2">
                                {event.description}
                              </div>
                            )}
                          </div>
                        </TableCell>
                        <TableCell>
                          {getCategoryBadge(event.category)}
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center space-x-2 text-sm">
                            <MapPin className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                            <span className="truncate max-w-[150px]">
                              {event.location}
                            </span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center space-x-2 text-sm">
                            <Calendar className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                            <span className="whitespace-nowrap">
                              {formatDate(event.endDateTime)}
                            </span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center space-x-2 text-sm">
                            <Users className="h-4 w-4 text-muted-foreground flex-shrink-0" />{" "}
                            <span className="font-medium">
                              {event.capacity}
                            </span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center space-x-2">
                            <CheckCircle className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                            <span className="font-medium">
                              {event.registered || 0}
                            </span>
                          </div>
                        </TableCell>
                        <TableCell>{getEventStatusBadge(event)}</TableCell>
                        <TableCell className="text-right">
                          <Button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleEventSelect(event);
                            }}
                            size="sm"
                            variant="outline"
                            className="hover:bg-primary hover:text-primary-foreground transition-colors">
                            <Eye className="h-4 w-4 mr-2" />
                            {t("View Report")}
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
              {totalPages > 1 && (
                <div className="flex items-center justify-between pt-4 border-t">
                  <div className="text-sm text-muted-foreground">
                    {t("Showing")}{" "}
                    <span className="font-medium">
                      {(currentPage - 1) * EVENTS_PER_PAGE + 1}
                    </span>{" "}
                    {t("to")}{" "}
                    <span className="font-medium">
                      {Math.min(
                        currentPage * EVENTS_PER_PAGE,
                        filteredEvents.length
                      )}
                    </span>{" "}
                    {t("of")}{" "}
                    <span className="font-medium">{filteredEvents.length}</span>{" "}
                    {t("events")}
                  </div>
                  <div className="flex items-center space-x-2">
                    <Button
                      onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                      disabled={currentPage === 1}
                      size="sm"
                      variant="outline"
                      className="h-8 px-3">
                      {t("Previous")}
                    </Button>
                    <div className="flex items-center space-x-1">
                      <span className="text-sm font-medium">
                        {t("Page")} {currentPage} {t("of")} {totalPages}
                      </span>
                    </div>
                    <Button
                      onClick={() =>
                        setCurrentPage((p) => Math.min(totalPages, p + 1))
                      }
                      disabled={currentPage === totalPages}
                      size="sm"
                      variant="outline"
                      className="h-8 px-3">
                      {t("Next")}
                    </Button>
                  </div>
                </div>
              )}
            </div>
          )}{" "}
        </CardContent>
      </Card>
      {/* Sheet for Event Report Details */}
      <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
        {" "}
        <SheetContent className="w-[600px] sm:max-w-[90vw] overflow-y-auto [&>button]:hidden">
          <SheetHeader className="sr-only">
            <SheetTitle>{t("Event Report Details")}</SheetTitle>
            <SheetDescription>
              {t("Detailed view of event information and registration data")}
            </SheetDescription>
          </SheetHeader>
          {selectedEvent && (
            <div className="space-y-6 pb-6">
              {/* Header with Action Buttons */}{" "}
              <div className="flex items-center justify-between mb-4">
                {" "}
                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleExport}
                    className="flex items-center gap-2">
                    <FileSpreadsheet className="h-4 w-4" />
                    {t("Export")}
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handlePDFExport}
                    className="flex items-center gap-2">
                    <FileText className="h-4 w-4" />
                    {t("PDF")}
                  </Button>
                </div>{" "}
                <Button
                  variant="default"
                  size="sm"
                  onClick={() => {
                    // Navigate to event page - adjust this URL as needed
                    window.open(`/events/${selectedEvent.id}`, "_blank");
                  }}
                  className="flex items-center gap-2">
                  <ExternalLink className="h-4 w-4" />
                  {t("Event Page")}{" "}
                </Button>{" "}
              </div>{" "}
              {/* Full Width Separator Line */}
              <div className="relative w-full h-6 mb-4">
                <div className="absolute left-[-24px] right-[-24px] border-t border-border"></div>
              </div>
              {/* Square Event Image */}
              {selectedEvent.eventImg && (
                <div className="w-72 aspect-square mx-auto rounded-lg overflow-hidden bg-muted">
                  <img
                    src={selectedEvent.eventImg}
                    alt={selectedEvent.name}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      e.currentTarget.style.display = "none";
                    }}
                  />
                </div>
              )}{" "}
              {/* Event Title and Category */}
              <div className="text-start space-y-3">
                <h1 className="text-2xl font-bold text-foreground">
                  {selectedEvent.name}
                </h1>
                <div className="flex items-center gap-2">
                  {getCategoryBadge(selectedEvent.category)}
                  {getEventStatusBadge(selectedEvent)}
                </div>
              </div>
              {/* Date & Time with Calendar Icon */}
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <div className="flex items-center justify-center w-8 h-8 bg-muted rounded-md">
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                  </div>{" "}
                  <div className="flex-1">
                    <div className="text-base font-semibold text-foreground">
                      {new Date(selectedEvent.startDateTime).toLocaleDateString(
                        language === "km" ? "km-KH" : "en-US",
                        {
                          weekday: "long",
                          year: "numeric",
                          month: "long",
                          day: "numeric",
                        }
                      )}
                    </div>
                    <div className="text-sm text-muted-foreground">
                      {new Date(selectedEvent.startDateTime).toLocaleTimeString(
                        language === "km" ? "km-KH" : "en-US",
                        {hour: "2-digit", minute: "2-digit"}
                      )}{" "}
                      -{" "}
                      {new Date(selectedEvent.endDateTime).toLocaleTimeString(
                        language === "km" ? "km-KH" : "en-US",
                        {hour: "2-digit", minute: "2-digit"}
                      )}
                    </div>
                  </div>
                </div>{" "}
                {/* Location with Map Icon (Clickable) */}
                <div
                  className="flex items-center gap-3 cursor-pointer hover:opacity-70 transition-opacity"
                  onClick={() => {
                    // Handle Google Maps URLs directly
                    if (
                      selectedEvent.location.includes("maps.app.goo.gl") ||
                      selectedEvent.location.includes("google.com/maps")
                    ) {
                      window.open(selectedEvent.location, "_blank");
                    } else {
                      const query = encodeURIComponent(selectedEvent.location);
                      window.open(
                        `https://www.google.com/maps/search/?api=1&query=${query}`,
                        "_blank"
                      );
                    }
                  }}>
                  <div className="flex items-center justify-center w-8 h-8 bg-muted rounded-md">
                    <MapPin className="h-4 w-4 text-muted-foreground" />
                  </div>{" "}
                  <div className="flex-1">
                    <div className="text-base font-semibold text-foreground hover:underline">
                      {selectedEvent.location.includes("maps.app.goo.gl")
                        ? t("Location on Google Maps")
                        : selectedEvent.location}
                    </div>
                    <div className="text-sm text-muted-foreground">
                      {selectedEvent.location.includes("maps.app.goo.gl")
                        ? t("View on Google Maps")
                        : t("Venue Address")}
                    </div>
                  </div>
                  <div className="flex items-center justify-center w-4 h-4">
                    <ExternalLink className="h-5 w-5 text-muted-foreground" />
                  </div>
                </div>
              </div>{" "}
              {/* Organizer Information */}
              <div className="space-y-3">
                {/* Main Event Administrator */}
                <div className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg">
                  <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                    <Users className="h-5 w-5 text-primary" />
                  </div>
                  <div className="flex-1 flex items-center justify-between">
                    <div className="flex-1">
                      {adminData ? (
                        <div>
                          <div className="text-sm font-semibold text-foreground">
                            {getAdminDisplayName(adminData)}
                          </div>
                          {adminData.email && (
                            <div className="text-xs text-muted-foreground mt-1 flex items-center gap-1">
                              <span className="break-all">
                                {adminData.email}
                              </span>
                            </div>
                          )}
                          {adminData.phone && (
                            <div className="text-xs text-muted-foreground flex items-center gap-1">
                              <span>📞</span>
                              {adminData.phone}
                            </div>
                          )}
                          {adminData.department && (
                            <div className="text-xs text-muted-foreground flex items-center gap-1">
                              <span>🏢</span>
                              {adminData.department}
                            </div>
                          )}
                        </div>
                      ) : isLoading ? (
                        <div className="flex items-center gap-2">
                          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-primary"></div>
                          <span>{t("Loading administrator info...")}</span>
                        </div>
                      ) : (
                        t("Administrator information not available")
                      )}
                    </div>
                    <div className="text-right">
                      <div className="text-xs text-muted-foreground">
                        {t("Event Administrator")}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Additional Organizers from Event Roles */}
                {selectedEvent?.eventRoles &&
                  selectedEvent.eventRoles.length > 0 && (
                    <div className="space-y-2">
                      <div className="text-sm font-medium text-foreground">
                        {t("Additional Organizers")}
                      </div>
                      {selectedEvent.eventRoles.map((role, index) => (
                        <div
                          key={index}
                          className="flex items-center gap-3 p-2 bg-muted/30 rounded-lg">
                          <div className="w-8 h-8 bg-muted rounded-lg flex items-center justify-center">
                            <Users className="h-4 w-4 text-muted-foreground" />
                          </div>
                          <div className="flex-1">
                            <div className="text-sm font-medium text-foreground">
                              {t("User ID")}: {role.userId}
                            </div>
                            <div className="text-xs text-muted-foreground">
                              {t("Role")}: {role.role}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
              </div>{" "}
              {/* Registration Stats */}
              <div className="grid grid-cols-3 gap-4">
                <Card className="p-4 text-center">
                  <div className="text-2xl font-bold text-foreground mb-1">
                    {filteredAudiences.length}
                  </div>
                  <div className="text-xs text-muted-foreground">
                    {t("Registered")}
                  </div>
                </Card>
                <Card className="p-4 text-center">
                  <div className="text-2xl font-bold text-foreground mb-1">
                    {selectedEvent.capacity}
                  </div>
                  <div className="text-xs text-muted-foreground">
                    {t("Capacity")}
                  </div>
                </Card>
                <Card className="p-4 text-center">
                  <div className="text-2xl font-bold text-foreground mb-1">
                    {selectedEvent.capacity > 0
                      ? Math.round(
                          (filteredAudiences.length / selectedEvent.capacity) *
                            100
                        )
                      : 0}
                    %
                  </div>
                  <div className="text-xs text-muted-foreground">
                    {t("Full")}
                  </div>
                </Card>
              </div>{" "}
              {/* About Event Description */}
              <div>
                <h2 className="text-lg font-semibold text-foreground mb-3">
                  {t("About Event")}
                  <div className="w-full border-t border-border mt-2 opacity-50"></div>
                </h2>{" "}
                <div className="text-sm text-muted-foreground leading-relaxed">
                  {selectedEvent.description ||
                    t("No description available for this event.")}
                </div>
              </div>
              {/* Event Audience List */}
              <div>
                <h2 className="text-lg font-semibold text-foreground mb-3">
                  {t("Registered Audience")}
                  <div className="w-full border-t border-border mt-2 opacity-50"></div>
                </h2>
                <EventAudienceList eventId={selectedEvent.id} />
              </div>
              {/* Location Section with Google Maps */}
            </div>
          )}
        </SheetContent>
      </Sheet>
    </div>
  );
}
