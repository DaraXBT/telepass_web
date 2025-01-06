"use client";

import MenuNav from "@/components/nav-menu";
import {Suspense} from "react";
import {EventList} from "@/components/events/event-list";
import {Separator} from "@radix-ui/react-separator";

export default function EventListPage() {
  return (
    <div>
      <header className="flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-[[data-collapsible=icon]]/sidebar-wrapper:h-12">
        <MenuNav props="User" />
      </header>
      <Separator />
      <div className="p-6">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Event List</h1>
            <p className="text-muted-foreground">
              Manage event system and permissions
            </p>
          </div>
        </div>
        <EventList />
      </div>
    </div>
  );
}
