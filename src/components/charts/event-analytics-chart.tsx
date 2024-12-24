"use client"

import { Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts"

const data = [
  { month: "Jan", events: 10, attendees: 150 },
  { month: "Feb", events: 15, attendees: 220 },
  { month: "Mar", events: 20, attendees: 380 },
  { month: "Apr", events: 25, attendees: 450 },
  { month: "May", events: 30, attendees: 520 },
  { month: "Jun", events: 35, attendees: 680 },
]

export function EventAnalyticsChart() {
  return (
    <ResponsiveContainer width="100%" height={350}>
      <LineChart data={data}>
        <XAxis dataKey="month" stroke="#888888" fontSize={12} tickLine={false} axisLine={false} />
        <YAxis
          stroke="#888888"
          fontSize={12}
          tickLine={false}
          axisLine={false}
          tickFormatter={(value) => `${value}`}
        />
        <Tooltip />
        <Line type="monotone" dataKey="events" stroke="#8884d8" strokeWidth={2} />
        <Line type="monotone" dataKey="attendees" stroke="#82ca9d" strokeWidth={2} />
      </LineChart>
    </ResponsiveContainer>
  )
}

