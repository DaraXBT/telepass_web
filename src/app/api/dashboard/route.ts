// import {NextResponse} from "next/server";
// import {PrismaClient} from "@prisma/client";

// const prisma = new PrismaClient();

// export async function GET() {
//   try {
//     const totalUsers = await prisma.user.count();
//     const newUsers = await prisma.user.count({
//       where: {
//         createdAt: {
//           gte: new Date(new Date().setMonth(new Date().getMonth() - 1)),
//         },
//       },
//     });
//     const totalEvents = await prisma.event.count();
//     const revenue = await prisma.transaction.aggregate({
//       _sum: {
//         amount: true,
//       },
//     });

//     return NextResponse.json({
//       totalUsers,
//       newUsers,
//       totalEvents,
//       revenue: revenue._sum.amount || 0,
//     });
//   } catch (error) {
//     console.error("Failed to fetch dashboard data:", error);
//     return NextResponse.json(
//       {error: "Failed to fetch dashboard data"},
//       {status: 500}
//     );
//   }
// }
