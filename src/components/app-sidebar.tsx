"use client";

import * as React from "react";
import {
  Bot,
  Calendar,
  GalleryVerticalEnd,
  Users,
  Settings2,
  FileText,
} from "lucide-react";

import {NavMain} from "@/components/nav-main";
import {NavProjects} from "@/components/nav-projects";
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
      plan: "Event Managerment",
    },
  ],
  navMain: [
    {
      title: "Event List",
      url: "#",
      icon: Settings2,
      isActive: true,
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
      url: "#",
      icon: FileText,
    },
  ],
};

const sidebarItems = [
  {
    title: "Event List",
    url: "#",
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
        <NavMain items={data.navMain} />
        <NavProjects projects={data.projects} />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={data.user} />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
