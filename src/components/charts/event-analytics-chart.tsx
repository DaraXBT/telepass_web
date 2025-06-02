"use client";

import {TrendingUp} from "lucide-react";
import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import {useLanguage} from "@/components/providers/LanguageProvider";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltipContent,
} from "@/components/ui/chart";

const data = [
  {month: "Jan", events: 10, attendees: 150},
  {month: "Feb", events: 15, attendees: 220},
  {month: "Mar", events: 20, attendees: 380},
  {month: "Apr", events: 25, attendees: 450},
  {month: "May", events: 30, attendees: 520},
  {month: "Jun", events: 35, attendees: 680},
];

const chartConfig = {
  events: {
    label: "Events",
    color: "hsl(var(--chart-1))",
  },
  attendees: {
    label: "Attendees",
    color: "hsl(var(--chart-2))",
  },
} satisfies ChartConfig;

export function EventAnalyticsChart() {
  const {t} = useLanguage();

  // Calculate growth percentage
  const lastTwoMonths = data.slice(-2);
  const previousEvents = lastTwoMonths[0].events;
  const currentEvents = lastTwoMonths[1].events;
  const growthPercentage = (
    ((currentEvents - previousEvents) / previousEvents) *
    100
  ).toFixed(1);

  return (
    <div className="space-y-4">
      <ChartContainer config={chartConfig}>
        <ResponsiveContainer width="100%" height={350}>
          <AreaChart
            data={data}
            margin={{
              left: 12,
              right: 12,
            }}>
            <CartesianGrid
              vertical={false}
              strokeDasharray="3 3"
              className="stroke-muted"
            />
            <XAxis
              dataKey="month"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              fontSize={12}
              stroke="#888888"
            />
            <YAxis
              stroke="#888888"
              fontSize={12}
              tickLine={false}
              axisLine={false}
              tickFormatter={(value) => `${value}`}
            />
            <Tooltip
              content={<ChartTooltipContent indicator="dot" />}
              cursor={false}
            />
            <Area
              type="monotone"
              dataKey="events"
              stroke="hsl(var(--chart-1))"
              strokeWidth={2}
              fill="hsl(var(--chart-1))"
              fillOpacity={0.2}
              activeDot={{r: 6}}
            />
            <Area
              type="monotone"
              dataKey="attendees"
              stroke="hsl(var(--chart-2))"
              strokeWidth={2}
              fill="hsl(var(--chart-2))"
              fillOpacity={0.1}
              activeDot={{r: 6}}
            />
          </AreaChart>
        </ResponsiveContainer>
      </ChartContainer>

      <div className="flex w-full items-start gap-2 text-sm">
        <div className="grid gap-2">
          <div className="flex items-center gap-2 font-medium leading-none">
            {t("Trending")} {Number(growthPercentage) > 0 ? t("up") : t("down")}{" "}
            {t("by")} {Math.abs(Number(growthPercentage))}% {t("this month")}
            <TrendingUp
              className={`h-4 w-4 ${Number(growthPercentage) > 0 ? "text-green-500" : "text-red-500"}`}
            />
          </div>
          <div className="flex items-center gap-2 leading-none text-muted-foreground">
            {t("January")} - {t("June")} 2025
          </div>
        </div>
      </div>
    </div>
  );
}
