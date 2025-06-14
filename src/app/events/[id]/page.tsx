"use client";

import {EventPage} from "@/components/events/event-page";
import MenuNav from "@/components/nav-menu";
import {Separator} from "@/components/ui/separator";
import {useLanguage} from "@/components/providers/LanguageProvider";

export default function EventDetailPage() {
  const {t} = useLanguage();

  return (
    <div>
      <header className="flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-[[data-collapsible=icon]]/sidebar-wrapper:h-12">
        <MenuNav props={t("Event List")} />
      </header>
      <Separator />
      <div className="mx-auto p-4">
        <h1 className="text-3xl font-semibold mb-6">{t("Event Details")}</h1>
        <EventPage />
      </div>
    </div>
  );
}
