"use client";

import React from "react";
import {useRouter} from "next/navigation";
import {SidebarTrigger} from "./ui/sidebar";
import {Separator} from "@/components/ui/separator";
import {ThemeToggler} from "@/components/theme-toggler";
import {LanguageToggler} from "@/components/language-toggler";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbSeparator,
} from "./ui/breadcrumb";
import {Sliders} from "lucide-react";

export default function MenuNav({props}: {props: string}) {
  const router = useRouter();

  const handleBreadcrumbClick = (path: string) => {
    router.push(path);
  };

  return (
    <div className="flex items-center gap-2 px-4 w-full">
      <SidebarTrigger className="-ml-1" />
      <Separator orientation="vertical" className="h-6" />
      <Breadcrumb className="flex-grow">
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink href="/dashboard">Home</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbLink
              href="#"
              onClick={() => handleBreadcrumbClick(`/${props.toLowerCase()}`)}>
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
