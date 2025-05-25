"use client";

import "./globals.css";
import {ThemeProvider} from "@/components/providers/ThemeProvider";
import {LanguageProvider} from "@/components/providers/LanguageProvider";
import {ThemeToggler} from "@/components/theme-toggler";
import {LanguageToggler} from "@/components/language-toggler";
import {SidebarInset, SidebarProvider} from "@/components/ui/sidebar";
import {AppSidebar} from "@/components/app-sidebar";
import {usePathname} from "next/navigation";
import {Toaster} from "@/components/ui/toaster";
import {useSidebarState} from "@/hooks/use-sidebar-state";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const pathname = usePathname();
  const isAuthPage =
    pathname === "/" ||
    pathname === "/register" ||
    pathname === "/forgot-password";
  const {sidebarState} = useSidebarState();
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin=""
        />
      </head>
      <body className="antialiased">
        <ThemeProvider>
          <LanguageProvider>
            {!isAuthPage && (
              <div className="absolute bottom-5 right-4 text-white flex items-center gap-2">
                <LanguageToggler />
                <ThemeToggler />
              </div>
            )}
            {isAuthPage ? (
              children
            ) : (
              <div className="flex h-screen overflow-hidden">
                <SidebarProvider defaultOpen={sidebarState !== "collapsed"}>
                  <AppSidebar />
                  <SidebarInset>
                    <div className="flex-1 overflow-auto">{children}</div>
                  </SidebarInset>
                  <Toaster />
                </SidebarProvider>
              </div>
            )}
          </LanguageProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
