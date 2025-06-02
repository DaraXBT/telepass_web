import {NextResponse} from "next/server";
import * as eventsData from "@/data/events";

export async function GET() {
  try {
    const events = eventsData.findMany();
    return NextResponse.json(events);
  } catch (error) {
    console.error("Failed to fetch events:", error);
    return NextResponse.json({error: "Failed to fetch events"}, {status: 500});
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const newEvent = eventsData.create(body);
    return NextResponse.json(newEvent, {status: 201});
  } catch (error) {
    console.error("Failed to create event:", error);
    return NextResponse.json({error: "Failed to create event"}, {status: 500});
  }
}
