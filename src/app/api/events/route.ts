import {NextResponse} from "next/server";
import {PrismaClient} from "@prisma/client";

const prisma = new PrismaClient();

export async function GET() {
  try {
    const events = await prisma.event.findMany();
    return NextResponse.json(events);
  } catch (error) {
    console.error("Failed to fetch events:", error);
    return NextResponse.json({error: "Failed to fetch events"}, {status: 500});
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const newEvent = await prisma.event.create({
      data: body,
    });
    return NextResponse.json(newEvent, {status: 201});
  } catch (error) {
    console.error("Failed to create event:", error);
    return NextResponse.json({error: "Failed to create event"}, {status: 500});
  }
}
