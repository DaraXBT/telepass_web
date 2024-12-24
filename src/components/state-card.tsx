import {Calendar, Clock, CheckCircle, Users} from "lucide-react";

interface StatsCardProps {
  title: string;
  value: string;
  change: string;
  icon: React.ReactNode;
}

function StatsCard({title, value, change, icon}: StatsCardProps) {
  return (
    <div className="rounded-lg border bg-card text-card-foreground shadow-sm p-6">
      <div className="flex justify-between items-start">
        <div>
          <p className="text-base font-medium text-muted-foreground">{title}</p>
          <p className="text-3xl font-bold mt-2 mb-1">{value}</p>
          <p className="text-sm text-muted-foreground">{change}</p>
        </div>
        <div className="text-muted-foreground">{icon}</div>
      </div>
    </div>
  );
}

export default function StatsCards() {
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      <StatsCard
        title="Total Events"
        value="42"
        change="+5 new events this month"
        icon={<Calendar className="h-5 w-5" />}
      />
      <StatsCard
        title="Ongoing Events"
        value="7"
        change="2 starting next week"
        icon={<Clock className="h-5 w-5" />}
      />
      <StatsCard
        title="Finished Events"
        value="35"
        change="3 completed this week"
        icon={<CheckCircle className="h-5 w-5" />}
      />
      <StatsCard
        title="Total Users"
        value="1,234"
        change="+21 new users this week"
        icon={<Users className="h-5 w-5" />}
      />
    </div>
  );
}
