"use client";

import {EventPage} from "@/components/events/event-page";
import MenuNav from "@/components/nav-menu";
import {Separator} from "@radix-ui/react-separator";
import {useLanguage} from "@/components/providers/LanguageProvider";

export default function EventDetailPage() {
  const {t} = useLanguage();

  return (
    <div className="container mx-auto p-6">
      <header className="flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-[[data-collapsible=icon]]/sidebar-wrapper:h-12">
        <MenuNav props={t("Event List")} />
      </header>
      <Separator />
      <h1 className="text-3xl font-semibold mb-6">{t("Event Details")}</h1>
      <EventPage />
    </div>
  );
}
