// In-memory storage for events
export interface Event {
  id: number;
  name: string;
  date: Date;
  createdAt: Date;
  updatedAt: Date;
}

let events: Event[] = [
  {
    id: 1,
    name: "Tech Conference",
    date: new Date("2025-06-15"),
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: 2,
    name: "Product Launch",
    date: new Date("2025-07-20"),
    createdAt: new Date(),
    updatedAt: new Date(),
  },
];

let nextId = 3;

export function findMany(): Event[] {
  return events;
}

export function create(
  data: Omit<Event, "id" | "createdAt" | "updatedAt">
): Event {
  const newEvent: Event = {
    id: nextId++,
    ...data,
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  events.push(newEvent);
  return newEvent;
}

export function count(): number {
  return events.length;
}
