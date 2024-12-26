import React from "react";
import {Calendar, Clock, CheckCircle, Users, LucideIcon} from "lucide-react";

function getIconStyle(title: string): {bg: string; iconColor: string} {
  switch (title) {
    case "Total Events":
      return {
        bg: "rgba(255, 102, 102, 0.1)",
        iconColor: "rgb(255, 102, 102)",
      };
    case "Ongoing Events":
      return {
        bg: "rgba(52, 199, 89, 0.1)",
        iconColor: "rgb(52, 199, 89)",
      };
    case "Finished Events":
      return {
        bg: "rgba(255, 149, 0, 0.1)",
        iconColor: "rgb(255, 149, 0)",
      };
    case "Total Users":
      return {
        bg: "rgba(90, 200, 250, 0.1)",
        iconColor: "rgb(90, 200, 250)",
      };
    default:
      return {
        bg: "rgba(142, 142, 147, 0.1)",
        iconColor: "rgb(142, 142, 147)",
      };
  }
}

interface StatsCardProps {
  title: string;
  value: string;
  icon: LucideIcon;
}

function StatsCard({title, value, icon: Icon}: StatsCardProps) {
  const {bg, iconColor} = getIconStyle(title);

  return (
    <div className="rounded-lg border bg-card text-card-foreground shadow-sm p-6">
      <div className="flex justify-between items-start">
        <div>
          <p className="text-base font-medium text-muted-foreground">{title}</p>
          <p className="text-3xl font-bold mt-2 mb-1">{value}</p>
        </div>
        <div
          className="rounded-full p-2 flex items-center justify-center"
          style={{
            backgroundColor: bg,
            width: "40px",
            height: "40px",
          }}>
          <Icon className="h-5 w-5" style={{color: iconColor}} />
        </div>
      </div>
    </div>
  );
}

export default function StatsCards() {
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      <StatsCard title="Total Events" value="42" icon={Calendar} />
      <StatsCard title="Ongoing Events" value="7" icon={Clock} />
      <StatsCard title="Finished Events" value="35" icon={CheckCircle} />
      <StatsCard title="Total Users" value="1,234" icon={Users} />
    </div>
  );
}
