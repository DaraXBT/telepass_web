"use client";

import {Separator} from "@/components/ui/separator";
import StatsCards from "@/components/dashboard/state-card";
import {EventAnalyticsChart} from "@/components/charts/event-analytics-chart";
import {StatusDistributionChart} from "@/components/charts/event-status-chart";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import MenuNav from "@/components/nav-menu";
import {useLanguage} from "@/components/providers/LanguageProvider";

export function DashboardContent() {
  const {t} = useLanguage();

  return (
    <div>
      <header className="flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-[[data-collapsible=icon]]/sidebar-wrapper:h-12">
        <MenuNav props={t("Dashboard")} />
      </header>
      <Separator />
      <div className="flex flex-1 flex-col gap-4 p-4 pt-6">
        <StatsCards />
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-8">
          <Card className="col-span-4">
            <CardHeader>
              <CardTitle>{t("Event Analytics")}</CardTitle>
              <CardDescription>
                {t("Number of events and attendees over time")}
              </CardDescription>
            </CardHeader>
            <CardContent className="px-6 pb-0">
              <EventAnalyticsChart />
            </CardContent>
          </Card>

          <Card className="col-span-4">
            <CardHeader>
              <CardTitle>{t("Event Status")}</CardTitle>
              <CardDescription>
                {t("Overview of event statuses")}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <StatusDistributionChart />
            </CardContent>
          </Card>
        </div>
      </div>
      <div className="min-h-[100vh] flex-1 rounded-xl bg-muted/50 md:min-h-min" />
    </div>
  );
}
