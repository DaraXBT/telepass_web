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
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
} from "@/components/ui/sidebar";

// This is sample data.
const data = {
  user: {
    name: "DRv",
    email: "daraa.veasa@gmail.com",
    avatar: "/avatars/shadcn.jpg",
  },
  teams: [
    {
      name: "Te\\ePass",
      logo: GalleryVerticalEnd,
      plan: "Event Management",
    },
  ],
  navMain: [
    {
      name: "Dashboard",
      url: "/dashboard",
      icon: LayoutDashboard,
    },
    {
      name: "Event List",
      url: "/events",
      icon: CalendarDays,
      isActive: true,
    },
    {
      name: "Audience List",
      url: "/audience",
      icon: Users,
    },
    {
      name: "User List",
      url: "/user",
      icon: Bot,
      // items: [
      //   {
      //     title: "Introduction",
      //     url: "#",
      //   },
      //   {
      //     title: "Get Started",
      //     url: "#",
      //   },
      //   {
      //     title: "Tutorials",
      //     url: "#",
      //   },
      //   {
      //     title: "Changelog",
      //     url: "#",
      //   },
      // ],
    },
  ],
  projects: [
    {
      name: "Report",
      url: "/report",
      icon: FileText,
    },
  ],
};

const sidebarItems = [
  {
    title: "Dashboard",
    url: "/dashboard",
    icon: Settings2,
  },
  {
    title: "Event List",
    url: "/events",
    icon: Calendar,
  },
  {
    title: "Audience List",
    url: "#",
    icon: Users,
  },
  {
    title: "User List",
    url: "#",
    icon: Bot,
  },
  // ...other items
];

export function AppSidebar({...props}: React.ComponentProps<typeof Sidebar>) {
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
