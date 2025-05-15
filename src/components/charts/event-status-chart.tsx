"use client";

import * as React from "react";
import {
  Cell,
  Label,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
} from "recharts";
import {useLanguage} from "../providers/LanguageProvider";

export function StatusDistributionChart() {
  const {t, language} = useLanguage();

  // Color palette using theme CSS variables for consistent light/dark mode support
  const data = React.useMemo(
    () => [
      {name: t("Upcoming"), value: 15, color: "hsl(var(--chart-1))"}, // Theme blue - from your design system
      {name: t("Ongoing"), value: 7, color: "hsl(var(--chart-2))"}, // Theme green - from your design system
      {name: t("Finished"), value: 35, color: "hsl(var(--chart-3))"}, // Theme orange - from your design system
    ],
    [language, t]
  );

  const totalEvents = React.useMemo(() => {
    return data.reduce((acc, curr) => acc + curr.value, 0);
  }, [data]);

  // Calculate percentage for each status
  const getPercentage = (value: number) => {
    return Math.round((value / totalEvents) * 100);
  };

  return (
    <>
      <div className="mx-auto aspect-square max-h-[320px]">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart margin={{top: 5, right: 5, bottom: 5, left: 5}}>
            <Tooltip
              content={({active, payload}) => {
                if (active && payload && payload.length) {
                  const data = payload[0].payload;
                  return (
                    <div className="bg-background px-2 py-1.5 text-sm">
                      <div className="font-medium">{data.name}</div>
                      <div className="flex items-center gap-1.5 mt-0.5">
                        <div
                          className="h-2 w-2 rounded-full"
                          style={{backgroundColor: data.color}}
                        />
                        <span className="font-medium">{data.value}</span>
                        <span className="text-muted-foreground">
                          {t("events")} ({getPercentage(data.value)}%)
                        </span>
                      </div>
                    </div>
                  );
                }
                return null;
              }}
            />
            <Pie
              data={data}
              dataKey="value"
              nameKey="name"
              cx="50%"
              cy="50%"
              innerRadius={80}
              outerRadius={110}
              paddingAngle={5}
              strokeWidth={2}
              animationDuration={1000}
              animationBegin={100}>
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
              <Label
                content={({viewBox}) => {
                  if (viewBox && "cx" in viewBox && "cy" in viewBox) {
                    return (
                      <text
                        x={viewBox.cx}
                        y={viewBox.cy}
                        textAnchor="middle"
                        dominantBaseline="middle">
                        <tspan
                          x={viewBox.cx}
                          y={(viewBox.cy || 0) - 5}
                          className="fill-foreground text-4xl font-bold">
                          {totalEvents.toLocaleString()}
                        </tspan>
                        <tspan
                          x={viewBox.cx}
                          y={(viewBox.cy || 0) + 24}
                          className="fill-muted-foreground text-sm font-medium">
                          {t("Total Events")}
                        </tspan>
                      </text>
                    );
                  }
                  return null;
                }}
              />
            </Pie>
          </PieChart>
        </ResponsiveContainer>
      </div>

      <div className="mt-6 flex items-center justify-center gap-6 pt-4 text-sm border-t border-dashed">
        {data.map((entry, index) => (
          <div
            key={`legend-${index}`}
            className="flex items-center gap-2 group cursor-pointer hover:opacity-80 transition-opacity">
            <div
              className="h-3 w-3 rounded-full group-hover:scale-110 transition-transform"
              style={{backgroundColor: entry.color}}
            />
            <div className="flex flex-col">
              <span className="text-xs font-medium">{entry.name}</span>
              <span className="text-xs text-muted-foreground">
                {entry.value} events
              </span>
            </div>
          </div>
        ))}
      </div>
    </>
  );
}
