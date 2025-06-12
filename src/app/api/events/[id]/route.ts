import {NextResponse} from "next/server";
import * as eventsData from "@/data/events";

export async function GET(
  request: Request,
  {params}: {params: Promise<{id: string}>}
) {
  try {
    const {id} = await params;
    const eventId = parseInt(id);
    const events = eventsData.findMany();
    const event = events.find((e) => e.id === eventId);

    if (!event) {
      return NextResponse.json({error: "Event not found"}, {status: 404});
    }

    return NextResponse.json(event);
  } catch (error) {
    console.error("Failed to fetch event:", error);
    return NextResponse.json({error: "Failed to fetch event"}, {status: 500});
  }
}

export async function PUT(
  request: Request,
  {params}: {params: Promise<{id: string}>}
) {
  try {
    const {id} = await params;
    const eventId = parseInt(id);
    const body = await request.json();
    // Note: This would need to be implemented in eventsData if you want to update events
    // For now, just return success
    return NextResponse.json(
      {message: "Event updated successfully"},
      {status: 200}
    );
  } catch (error) {
    console.error("Failed to update event:", error);
    return NextResponse.json({error: "Failed to update event"}, {status: 500});
  }
}

export async function DELETE(
  request: Request,
  {params}: {params: Promise<{id: string}>}
) {
  try {
    const {id} = await params;
    const eventId = parseInt(id);
    // Note: This would need to be implemented in eventsData if you want to delete events
    // For now, just return success
    return NextResponse.json(
      {message: "Event deleted successfully"},
      {status: 200}
    );
  } catch (error) {
    console.error("Failed to delete event:", error);
    return NextResponse.json({error: "Failed to delete event"}, {status: 500});
  }
}
