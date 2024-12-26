"use client";

import {Cell, Pie, PieChart, ResponsiveContainer, Tooltip} from "recharts";

const data = [
  {name: "Upcoming", value: 15, color: "#4169E1"},
  {name: "Ongoing", value: 7, color: "#66CDAA"},
  {name: "Finished", value: 35, color: "#FF9500"},
];

export function StatusDistributionChart() {
  return (
    <div className="">
      <ResponsiveContainer width="100%" height={300}>
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            innerRadius={60}
            outerRadius={80}
            paddingAngle={5}
            dataKey="value">
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.color} />
            ))}
          </Pie>
          <Tooltip />
        </PieChart>
      </ResponsiveContainer>
      <div className="mt-4 flex justify-center gap-4">
        {data.map((entry, index) => (
          <div key={`legend-${index}`} className="flex items-center gap-2">
            <div
              className="h-3 w-3 rounded-full"
              style={{backgroundColor: entry.color}}
            />
            <span className="text-sm text-muted-foreground">{entry.name}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
