import {notFound} from "next/navigation";
import EventDetails from "@/components/events/event-details";

// This would typically come from a database
const events = [
  {
    id: "1",
    name: "Tech Conference 2024",
    date: "2024-06-15",
    time: "09:00 AM",
    location: "Convention Center",
    description:
      "Join us for the biggest tech conference of the year. Featuring keynote speakers, workshops, and networking opportunities.",
    attendees: 250,
    capacity: 300,
    status: "upcoming" as const,
  },
  // ... other events
];

export default function EventPage({params}: {params: {id: string}}) {
  const event = events.find((e) => e.id === params.id);

  if (!event) {
    notFound();
  }

  return (
    <div className="flex flex-1 flex-col gap-4 p-4 pt-6 my-4">
      <div className="mb-8">
        <nav className="flex" aria-label="Breadcrumb">
          <ol className="inline-flex items-center space-x-1 text-sm text-muted-foreground">
            <li>
              <a href="/" className="hover:text-foreground">
                Home
              </a>
            </li>
            <li>
              <span className="mx-2">/</span>
            </li>
            <li>
              <a href="/events" className="hover:text-foreground">
                Events
              </a>
            </li>
            <li>
              <span className="mx-2">/</span>
            </li>
            <li>
              <span className="text-foreground">{event.name}</span>
            </li>
          </ol>
        </nav>
      </div>

      <EventDetails event={event} />
    </div>
  );
}
