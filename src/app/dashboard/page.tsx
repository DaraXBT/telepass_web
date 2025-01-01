import {Separator} from "@/components/ui/separator";

import StatsCards from "@/components/state-card";
import {EventAnalyticsChart} from "@/components/charts/event-analytics-chart";
import {StatusDistributionChart} from "@/components/charts/event-status-chart";
import {RecentEventsTable} from "@/components/events/recent-events";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import MenuNav from "@/components/nav-menu";

export default function Dashboard() {
  return (
    <div>
      <header className="flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-[[data-collapsible=icon]]/sidebar-wrapper:h-12">
        <MenuNav props="Dashboard" />
      </header>
      <Separator />
      <div className="flex flex-1 flex-col gap-4 p-4 pt-6">
        <StatsCards />
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-8">
          <Card className="col-span-4">
            <CardHeader>
              <CardTitle>Event Analytics</CardTitle>
              <CardDescription>
                Number of events and attendees over time
              </CardDescription>
            </CardHeader>
            <CardContent>
              <EventAnalyticsChart />
            </CardContent>
          </Card>

          <Card className="col-span-4">
            <CardHeader>
              <CardTitle>Event Status</CardTitle>
              <CardDescription>Overview of event statuses</CardDescription>
            </CardHeader>
            <CardContent>
              <StatusDistributionChart />
            </CardContent>
          </Card>
        </div>
        <Card>
          <CardHeader>
            <CardTitle>Recent Events</CardTitle>
            <CardDescription>
              Overview of the latest events and their status
            </CardDescription>
          </CardHeader>
          <CardContent>
            <RecentEventsTable />
          </CardContent>
        </Card>
      </div>
      <div className="min-h-[100vh] flex-1 rounded-xl bg-muted/50 md:min-h-min" />
    </div>
  );
}
