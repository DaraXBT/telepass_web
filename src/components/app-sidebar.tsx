"use client";

import * as React from "react";
import {
  Bot,
  Calendar,
  GalleryVerticalEnd,
  Users,
  Settings2,
  CalendarDays,
  FileText,
  LayoutDashboard,
} from "lucide-react";

import {NavMain} from "@/components/nav-main";
import {NavProjects} from "@/components/nav-report";
import {NavUser} from "@/components/nav-user";
import {TeamSwitcher} from "@/components/team-switcher";
import {useLanguage} from "@/components/providers/LanguageProvider";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
} from "@/components/ui/sidebar";

export function AppSidebar({...props}: React.ComponentProps<typeof Sidebar>) {
  const {t} = useLanguage();

  // This is sample data.
  const data = {
    user: {
      name: "DRv",
      email: "daraa.veasa@gmail.com",
      avatar: "/avatars/shadcn.jpg",
    },
    teams: [
      {
        name: "TelePass",
        logo: GalleryVerticalEnd,
        plan: t("Event Management"),
      },
    ],
    navMain: [
      {
        name: t("Dashboard"),
        url: "/dashboard",
        icon: LayoutDashboard,
      },
      {
        name: t("Event List"),
        url: "/events",
        icon: CalendarDays,
        isActive: true,
      },
      {
        name: t("Audience List"),
        url: "/audience",
        icon: Users,
      },
      {
        name: t("User List"),
        url: "/user",
        icon: Bot,
      },
    ],
    projects: [
      {
        name: t("Report"),
        url: "/report",
        icon: FileText,
      },
    ],
  };

  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <TeamSwitcher teams={data.teams} />
      </SidebarHeader>
      <SidebarContent>
        <NavProjects projects={data.navMain} />
        <NavProjects projects={data.projects} />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={data.user} />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
