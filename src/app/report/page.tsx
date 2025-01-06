"use client";
import MenuNav from "@/components/nav-menu";
import {Separator} from "@radix-ui/react-separator";
import {EventReport} from "@/components/report/event-report";

const events = [
  {
    id: 1,
    name: "Tech Conference 2024",
    date: "2024-06-15",
    location: "San Francisco Convention Center, CA",
    description:
      "Annual technology conference featuring the latest innovations and industry trends.",
    capacity: 1000,
    organizer: "TechEvents Inc.",
    ticketPrice: 299.99,
  },
  {
    id: 2,
    name: "Digital Marketing Summit",
    date: "2024-07-20",
    location: "New York Business Center, NY",
    description:
      "A summit for digital marketing professionals to share strategies and network.",
    capacity: 500,
    organizer: "Marketing Pros Association",
    ticketPrice: 199.99,
  },
  {
    id: 3,
    name: "AI Workshop",
    date: "2024-08-10",
    location: "Boston Tech Hub, MA",
    description:
      "Hands-on workshop exploring the latest in artificial intelligence and machine learning.",
    capacity: 200,
    organizer: "AI Research Group",
    ticketPrice: 349.99,
  },
];

const registrations = [
  {
    id: 1,
    eventId: 1,
    name: "John Doe",
    email: "john@example.com",
    phone: "+85512345678",
    registrationDate: "2024-05-01",
  },
  {
    id: 2,
    eventId: 1,
    name: "Jane Smith",
    email: "jane@example.com",
    phone: "+85523456789",
    registrationDate: "2024-05-03",
  },
  {
    id: 3,
    eventId: 2,
    name: "Bob Johnson",
    email: "bob@example.com",
    phone: "+85534567890",
    registrationDate: "2024-06-15",
  },
  {
    id: 4,
    eventId: 2,
    name: "Alice Brown",
    email: "alice@example.com",
    phone: "+85545678901",
    registrationDate: "2024-06-18",
  },
  {
    id: 5,
    eventId: 3,
    name: "Charlie Davis",
    email: "charlie@example.com",
    phone: "+85556789012",
    registrationDate: "2024-07-01",
  },
];

export default function ReportPage() {
  return (
    <div>
      <header className="flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-[[data-collapsible=icon]]/sidebar-wrapper:h-12">
        <MenuNav props="Report" />
      </header>
      <Separator />
      <div className="p-4">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Audience List</h1>
            <p className="text-muted-foreground">
              Manage system users and permissions
            </p>
          </div>
        </div>
        <EventReport events={events} registrations={registrations} />
      </div>
    </div>
  );
}
