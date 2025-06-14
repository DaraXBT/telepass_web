"use client";
import MenuNav from "@/components/nav-menu";
import {Separator} from "@/components/ui/separator";
import {EventReport} from "@/components/report/event-report";
import {useLanguage} from "@/components/providers/LanguageProvider";

export default function ReportPage() {
  const {t} = useLanguage();

  return (
    <div>
      <header className="flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-[[data-collapsible=icon]]/sidebar-wrapper:h-12">
        <MenuNav props={t("Report")} />
      </header>
      <Separator />
      <div className="p-4">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">{t("Report")}</h1>
            <p className="text-muted-foreground">
              {t("View reports for finished events and their registrations.")}
            </p>
          </div>
        </div>
        <EventReport />
      </div>
    </div>
  );
}
