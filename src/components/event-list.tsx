import * as React from "react";
import {CalendarDays, CheckCircle, Clock} from "lucide-react";

import {Badge} from "@/components/ui/badge";
import {Card, CardContent, CardHeader, CardTitle} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {Tabs, TabsContent, TabsList, TabsTrigger} from "@/components/ui/tabs";

interface Event {
  id: string;
  name: string;
  date: string;
  status: "ongoing" | "finished";
  organizer: string;
}

const events: Event[] = [
  {
    id: "1",
    name: "Tech Conference 2024",
    date: "2024-06-15",
    status: "ongoing",
    organizer: "John Doe",
  },
  {
    id: "2",
    name: "Music Festival",
    date: "2024-07-20",
    status: "ongoing",
    organizer: "Jane Smith",
  },
  {
    id: "3",
    name: "Art Exhibition",
    date: "2024-05-10",
    status: "finished",
    organizer: "Alice Johnson",
  },
  {
    id: "4",
    name: "Sports Tournament",
    date: "2024-08-05",
    status: "ongoing",
    organizer: "Bob Williams",
  },
  {
    id: "5",
    name: "Food Fair",
    date: "2024-04-30",
    status: "finished",
    organizer: "Emma Brown",
  },
];

export function EventList() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Event List</CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="all">
          <TabsList>
            <TabsTrigger value="all">All Events</TabsTrigger>
            <TabsTrigger value="ongoing">Ongoing</TabsTrigger>
            <TabsTrigger value="finished">Finished</TabsTrigger>
          </TabsList>
          <TabsContent value="all">
            <EventTable events={events} />
          </TabsContent>
          <TabsContent value="ongoing">
            <EventTable
              events={events.filter((event) => event.status === "ongoing")}
            />
          </TabsContent>
          <TabsContent value="finished">
            <EventTable
              events={events.filter((event) => event.status === "finished")}
            />
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}

function EventTable({events}: {events: Event[]}) {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Event Name</TableHead>
          <TableHead>Date</TableHead>
          <TableHead>Status</TableHead>
          <TableHead>Organizer</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {events.map((event) => (
          <TableRow key={event.id}>
            <TableCell>{event.name}</TableCell>
            <TableCell>{event.date}</TableCell>
            <TableCell>
              <Badge
                variant="outline"
                className={
                  event.status === "ongoing"
                    ? "bg-green-100 text-green-800 border-green-300"
                    : "bg-gray-100 text-gray-800 border-gray-300"
                }>
                {event.status === "ongoing" ? (
                  <Clock className="mr-1 h-3 w-3" />
                ) : (
                  <CheckCircle className="mr-1 h-3 w-3" />
                )}
                {event.status.charAt(0).toUpperCase() + event.status.slice(1)}
              </Badge>
            </TableCell>
            <TableCell>{event.organizer}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
