"use client";

import React from "react";
import {useRouter} from "next/navigation";
import {SidebarTrigger} from "./ui/sidebar";
import {Separator} from "@/components/ui/separator";
import {ThemeToggler} from "@/components/theme-toggler";
import {LanguageToggler} from "@/components/language-toggler";
import {useLanguage} from "@/components/providers/LanguageProvider";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbSeparator,
} from "./ui/breadcrumb";

// Map to store the fixed route paths for each menu item
const routePathMap: Record<string, string> = {
  // English routes
  Dashboard: "dashboard",
  Account: "account",
  User: "user",
  Users: "user", // Handle both singular and plural forms
  "User List": "user", // Match sidebar naming
  Report: "report",
  Events: "events",
  "Event List": "events", // Match sidebar naming
  Audience: "audience",
  "Audience List": "audience", // Match sidebar naming

  // Khmer translations with English routes
  ផ្ទាំងគ្រប់គ្រង: "dashboard", // Dashboard in Khmer
  គណនី: "account", // Account in Khmer
  អ្នកប្រើប្រាស់: "user", // User in Khmer
  អ្នកគ្រប់គ្រង: "user", // Users in Khmer
  បញ្ជីអ្នកគ្រប់គ្រង: "user", // User List in Khmer
  របាយការណ៍: "report", // Report in Khmer
  ព្រឹត្តិការណ៍: "events", // Events in Khmer
  បញ្ជីព្រឹត្តិការណ៍: "events", // Event List in Khmer
  ទស្សនិកជន: "audience", // Audience in Khmer
  បញ្ជីអ្នកចូលរួម: "audience", // Audience List in Khmer
};

export default function MenuNav({props}: {props: string}) {
  const router = useRouter();
  const {t} = useLanguage();

  const handleBreadcrumbClick = (props: string) => {
    // Get the fixed route path from the map, or fallback to lowercase props if not found
    const routePath = routePathMap[props] || props.toLowerCase();
    router.push(`/${routePath}`);
  };

  return (
    <div className="flex items-center gap-2 px-4 w-full">
      <SidebarTrigger className="-ml-1" />
      <Separator orientation="vertical" className="h-6" />
      <Breadcrumb className="flex-grow">
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink href="/dashboard">{t("Home")}</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbLink
              href="#"
              onClick={() => handleBreadcrumbClick(props)}>
              {props}
            </BreadcrumbLink>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>
      <div className="ml-auto flex items-center gap-3">
        <ThemeToggler />
        <LanguageToggler />
      </div>
    </div>
  );
}
