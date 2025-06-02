"use client";

import { useLanguage } from "@/components/providers/LanguageProvider";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
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
import {
  CalendarIcon,
  CheckCircleIcon,
  FileSpreadsheet,
  MapPinIcon,
  Printer,
  Search,
  UsersIcon,
} from "lucide-react";
import { useMemo, useState } from "react";
import * as XLSX from "xlsx";

interface Event {
  id: number;
  name: string;
  date: string;
  location: string;
  description: string;
  capacity: number;
}

interface Registration {
  id: number;
  eventId: number;
  name: string;
  email: string;
  phone: string;
  registrationDate: string;
}

interface EventReportProps {
  events: Event[];
  registrations: Registration[];
}

export function EventReport({ events, registrations }: EventReportProps) {
  const { t, language } = useLanguage();
  const [selectedEvent, setSelectedEvent] = useState<number | null>(null);
  const [searchTerm, setSearchTerm] = useState("");

  const selectedEventDetails = useMemo(() => {
    if (!events || selectedEvent === null) return null;
    return events.find((e) => e.id === selectedEvent) || null;
  }, [selectedEvent, events]);

  const filteredRegistrations = useMemo(() => {
    if (!selectedEvent || !registrations) return [];
    return registrations.filter(
      (reg) =>
        reg.eventId === selectedEvent &&
        (reg.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          reg.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
          reg.phone.includes(searchTerm))
    );
  }, [selectedEvent, searchTerm, registrations]);

  const handlePrint = () => {
    if (!selectedEventDetails) return;

    const printContent = `
      <h1>${selectedEventDetails.name} - ${t("Registrations Report")}</h1>
      <p>${t("Date")}: ${selectedEventDetails.date}</p>
      <p>${t("Location")}: ${selectedEventDetails.location}</p>
      <p>${t("Capacity")}: ${selectedEventDetails.capacity}</p>
      <p>${t("Total Registrations")}: ${filteredRegistrations.length}</p>
      <table border="1" cellpadding="5" cellspacing="0">
        <thead>
          <tr>
            <th>${t("Name")}</th>
            <th>${t("Email")}</th>
            <th>${t("Phone")}</th>
            <th>${t("Registration Date")}</th>
          </tr>
        </thead>
        <tbody>
          ${filteredRegistrations
            .map(
              (reg) => `
            <tr>
              <td>${reg.name}</td>
              <td>${reg.email}</td>
              <td>${reg.phone}</td>
              <td>${reg.registrationDate}</td>
            </tr>
          `
            )
            .join("")}
        </tbody>
      </table>
    `;

    const printWindow = window.open("", "_blank");
    if (printWindow) {
      printWindow.document.write(`
        <html>
          <head>
            <title>${selectedEventDetails.name} - ${t("Registrations Report")}</title>
            <style>
              body { font-family: ${language === "km" ? "'Kantumruy Pro'" : "Arial"}, sans-serif; }
              table { border-collapse: collapse; width: 100%; }
              th, td { border: 1px solid #ddd; padding: 8px; }
              th { background-color: #f2f2f2; }
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
  };

  const handleExport = () => {
    if (!selectedEventDetails) return;

    const worksheet = XLSX.utils.json_to_sheet(
      filteredRegistrations.map((reg) => ({
        [t("Name")]: reg.name,
        [t("Email")]: reg.email,
        [t("Phone")]: reg.phone,
        [t("Registration Date")]: reg.registrationDate,
      }))
    );

    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, t("Registrations"));

    const excelBuffer = XLSX.write(workbook, {
      bookType: "xlsx",
      type: "array",
    });
    const data = new Blob([excelBuffer], {
      type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    });

    const link = document.createElement("a");
    link.href = window.URL.createObjectURL(data);
    link.download = `${selectedEventDetails.name}_${t("Registrations")}.xlsx`;
    link.click();
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>{t("Event Selection")}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4">
            <div className="grid gap-2">
              <Label htmlFor="event-select">{t("Select Event")}</Label>
              <Select
                onValueChange={(value) => setSelectedEvent(Number(value))}
              >
                <SelectTrigger id="event-select">
                  <SelectValue placeholder={t("Select an event")} />
                </SelectTrigger>
                <SelectContent>
                  {events &&
                    events.map((event) => (
                      <SelectItem key={event.id} value={event.id.toString()}>
                        {event.name}
                      </SelectItem>
                    ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {selectedEventDetails && (
        <Card>
          <CardHeader>
            <CardTitle className="text-2xl">
              {selectedEventDetails.name}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <div className="flex items-center space-x-2">
                  <CalendarIcon className="h-4 w-4 text-muted-foreground" />
                  <span>{selectedEventDetails.date}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <MapPinIcon className="h-4 w-4 text-muted-foreground" />
                  <span>{selectedEventDetails.location}</span>
                </div>
              </div>
              <div className="space-y-2">
                <div className="flex items-center space-x-2">
                  <UsersIcon className="h-4 w-4 text-muted-foreground" />
                  <span>
                    {t("Capacity")}: {selectedEventDetails.capacity}
                  </span>
                </div>
                <div className="flex items-center space-x-2">
                  <CheckCircleIcon className="h-4 w-4 text-muted-foreground" />
                  <span>
                    {t("Registrations")}: {filteredRegistrations.length}
                  </span>
                </div>
              </div>
            </div>
            <div className="mt-4">
              <h4 className="text-sm font-semibold mb-2">{t("Description")}</h4>
              <p className="text-sm text-muted-foreground">
                {selectedEventDetails.description}
              </p>
            </div>
          </CardContent>
        </Card>
      )}

      {selectedEventDetails && (
        <Card>
          <CardHeader>
            <CardTitle>{t("Registrations")}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4 md:space-y-0 md:flex md:justify-between md:items-center mb-4">
              <div className="relative w-full md:w-64">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder={t("Search registrations...")}
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-8 w-full"
                />
              </div>
              <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-2">
                <Button onClick={handlePrint} className="w-full sm:w-auto">
                  <Printer className="mr-2 h-4 w-4" />
                  {t("Print Report")}
                </Button>
                <Button onClick={handleExport} className="w-full sm:w-auto">
                  <FileSpreadsheet className="mr-2 h-4 w-4" />
                  {t("Export to Excel")}
                </Button>
              </div>
            </div>
            <div className="overflow-x-auto -mx-4 sm:-mx-6 lg:-mx-8">
              <div className="inline-block min-w-full py-2 align-middle sm:px-6 lg:px-8">
                <div className="overflow-hidden shadow ring-1 ring-black ring-opacity-5 sm:rounded-lg">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>{t("Name")}</TableHead>
                        <TableHead>{t("Email")}</TableHead>
                        <TableHead>{t("Phone")}</TableHead>
                        <TableHead>{t("Registration Date")}</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredRegistrations.map((reg) => (
                        <TableRow key={reg.id}>
                          <TableCell>{reg.name}</TableCell>
                          <TableCell>{reg.email}</TableCell>
                          <TableCell>{reg.phone}</TableCell>
                          <TableCell>{reg.registrationDate}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </div>
            </div>
            {filteredRegistrations.length === 0 && (
              <p className="text-center text-muted-foreground mt-4">
                {t("No registrations found.")}
              </p>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
}
