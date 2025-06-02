import {NextResponse} from "next/server";
import * as usersData from "@/data/users";

export async function GET() {
  try {
    const users = usersData.findMany();
    return NextResponse.json(users);
  } catch (error) {
    console.error("Failed to fetch users:", error);
    return NextResponse.json({error: "Failed to fetch users"}, {status: 500});
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const newUser = usersData.create(body);
    return NextResponse.json(newUser, {status: 201});
  } catch (error) {
    console.error("Failed to create user:", error);
    return NextResponse.json({error: "Failed to create user"}, {status: 500});
  }
}
