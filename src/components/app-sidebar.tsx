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
import {useSidebarState} from "@/hooks/use-sidebar-state";
import {getAdminByUsername} from "@/services/authservice.service";
import {getSession} from "next-auth/react";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
  SidebarProvider,
} from "@/components/ui/sidebar";

export function AppSidebar({...props}: React.ComponentProps<typeof Sidebar>) {
  const {t} = useLanguage();
  const {sidebarState} = useSidebarState();
  const [userData, setUserData] = React.useState({
    name: "Loading...",
    email: "loading@example.com",
    avatar: "/avatars/shadcn.jpg",
  });

  // Fetch user data from API
  React.useEffect(() => {
    const fetchUserData = async () => {
      try {
        const session = await getSession();
        if (session?.user?.username) {
          const adminResponse = await getAdminByUsername(session.user.username);
          if (adminResponse?.data) {
            setUserData({
              name: adminResponse.data.username || "Unknown User",
              email:
                adminResponse.data.email ||
                session.user.email ||
                "unknown@example.com",
              avatar: adminResponse.data.profile || "/avatars/shadcn.jpg",
            });
          }
        }
      } catch (error) {
        console.error("Error fetching user data:", error);
        // Keep default loading state if error occurs
      }
    };

    fetchUserData();
  }, []);

  // This is sample data.
  const data = {
    user: userData,
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
      // {
      //   name: t("User List"),
      //   url: "/user",
      //   icon: Bot,
      // },
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
      <SidebarContent className="group-data-[collapsible=icon]:pt-4">
        <NavMain
          items={data.navMain.map((item) => ({
            title: item.name,
            url: item.url,
            icon: item.icon,
            isActive: item.isActive,
          }))}
        />
        <NavProjects projects={data.projects} />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={data.user} />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
