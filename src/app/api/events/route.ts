// import {NextResponse} from "next/server";
// import {PrismaClient} from "@prisma/client";

// const prisma = new PrismaClient();

// export async function GET() {
//   try {
//     const events = await prisma.event.findMany();
//     return NextResponse.json(events);
//   } catch (error) {
//     console.error("Failed to fetch events:", error);
//     return NextResponse.json({error: "Failed to fetch events"}, {status: 500});
//   }
// }

// export async function POST(request: Request) {
//   try {
//     const body = await request.json();
//     const newEvent = await prisma.event.create({
//       data: body,
//     });
//     return NextResponse.json(newEvent, {status: 201});
//   } catch (error) {
//     console.error("Failed to create event:", error);
//     return NextResponse.json({error: "Failed to create event"}, {status: 500});
//   }
// }
import {NextResponse} from "next/server";

export async function GET() {
  // This is a mock API response. In a real application, you would fetch this data from a database.
  const events = [
    {id: 1, name: "Tech Conference 2024", date: "2024-06-15"},
    {id: 2, name: "Digital Marketing Summit", date: "2024-07-20"},
    {id: 3, name: "AI Workshop", date: "2024-08-10"},
  ];

  return NextResponse.json(events);
}

export async function POST(request: Request) {
  const body = await request.json();

  // In a real application, you would save this data to a database
  console.log("Received new event:", body);

  return NextResponse.json(
    {message: "Event created successfully"},
    {status: 201}
  );
}
