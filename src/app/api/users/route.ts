// import {NextResponse} from "next/server";
// import {PrismaClient} from "@prisma/client";

// const prisma = new PrismaClient();

// export async function GET() {
//   try {
//     const users = await prisma.user.findMany();
//     return NextResponse.json(users);
//   } catch (error) {
//     console.error("Failed to fetch users:", error);
//     return NextResponse.json({error: "Failed to fetch users"}, {status: 500});
//   }
// }

// export async function POST(request: Request) {
//   try {
//     const body = await request.json();
//     const newUser = await prisma.user.create({
//       data: body,
//     });
//     return NextResponse.json(newUser, {status: 201});
//   } catch (error) {
//     console.error("Failed to create user:", error);
//     return NextResponse.json({error: "Failed to create user"}, {status: 500});
//   }
// }
import {NextResponse} from "next/server";

export async function GET() {
  // This is a mock API response. In a real application, you would fetch this data from a database.
  const users = [
    {id: 1, name: "John Doe", email: "john@example.com"},
    {id: 2, name: "Jane Smith", email: "jane@example.com"},
    {id: 3, name: "Bob Johnson", email: "bob@example.com"},
  ];

  return NextResponse.json(users);
}

export async function POST(request: Request) {
  const body = await request.json();

  // In a real application, you would save this data to a database
  console.log("Received new user:", body);

  return NextResponse.json(
    {message: "User created successfully"},
    {status: 201}
  );
}
