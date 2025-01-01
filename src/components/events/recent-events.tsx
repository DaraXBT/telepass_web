import {CalendarDays, MoreHorizontal} from "lucide-react";

import {Button} from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {Badge} from "@/components/ui/badge";

const recentEvents = [
  {
    id: "1",
    name: "Tech Conference 2024",
    date: "2024-06-15",
    status: "upcoming",
    attendees: 250,
  },
  {
    id: "2",
    name: "Digital Marketing Summit",
    date: "2024-06-20",
    status: "ongoing",
    attendees: 180,
  },
  {
    id: "3",
    name: "Startup Meetup",
    date: "2024-06-25",
    status: "upcoming",
    attendees: 120,
  },
  {
    id: "4",
    name: "AI Workshop",
    date: "2024-06-10",
    status: "finished",
    attendees: 150,
  },
];

export function RecentEventsTable() {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Event Name</TableHead>
          <TableHead>Date</TableHead>
          <TableHead>Status</TableHead>
          <TableHead>Attendees</TableHead>
          <TableHead className="w-[50px]"></TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {recentEvents.map((event) => (
          <TableRow key={event.id}>
            <TableCell className="font-medium">{event.name}</TableCell>
            <TableCell>{event.date}</TableCell>
            <TableCell>
              <Badge
                variant="outline"
                className={
                  event.status === "upcoming"
                    ? "bg-blue-50 text-blue-700 border-blue-300"
                    : event.status === "ongoing"
                      ? "bg-green-50 text-green-700 border-green-300"
                      : "bg-yellow-50 text-yellow-700 border-yellow-300"
                }>
                {event.status}
              </Badge>
            </TableCell>
            <TableCell>{event.attendees}</TableCell>
            <TableCell>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="h-8 w-8 p-0">
                    <MoreHorizontal className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuLabel>Actions</DropdownMenuLabel>
                  <DropdownMenuItem>View details</DropdownMenuItem>
                  <DropdownMenuItem>Edit event</DropdownMenuItem>
                  <DropdownMenuItem className="text-red-600">
                    Cancel event
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
