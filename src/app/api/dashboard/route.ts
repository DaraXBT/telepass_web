import {NextResponse} from "next/server";
import * as usersData from "@/data/users";
import * as eventsData from "@/data/events";

export async function GET() {
  try {
    const totalUsers = usersData.count();
    const newUsers = usersData.count({
      // Simple filter to count users created in the last month
      createdInLastMonth: true,
    });
    const totalEvents = eventsData.count();
    // Since we don't have transaction data, we'll just use a mock value
    const revenue = 10000;

    return NextResponse.json({
      totalUsers,
      newUsers,
      totalEvents,
      revenue,
    });
  } catch (error) {
    console.error("Failed to fetch dashboard data:", error);
    return NextResponse.json(
      {error: "Failed to fetch dashboard data"},
      {status: 500}
    );
  }
}
