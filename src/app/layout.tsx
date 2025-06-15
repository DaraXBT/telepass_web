"use client";

import {AppSidebar} from "@/components/app-sidebar";
import {LanguageToggler} from "@/components/language-toggler";
import {LanguageProvider} from "@/components/providers/LanguageProvider";
import {ThemeProvider} from "@/components/providers/ThemeProvider";
import {ThemeToggler} from "@/components/theme-toggler";
import {SidebarInset, SidebarProvider} from "@/components/ui/sidebar";
import {Toaster} from "@/components/ui/toaster";
import {useSidebarState} from "@/hooks/use-sidebar-state";
import {usePathname} from "next/navigation";
import "./globals.css";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const pathname = usePathname();
  const isLoginPage =
    pathname === "/" ||
    pathname === "/register" ||
    pathname === "/email-verified" ||
    pathname === "/reset-password" ||
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
            {!isLoginPage && (
              <div className="absolute bottom-5 right-4 text-white flex items-center gap-2">
                <LanguageToggler />
                <ThemeToggler />
              </div>
            )}{" "}
            {isLoginPage ? (
              <>{children}</>
            ) : (
              <div className="flex h-screen overflow-hidden">
                <SidebarProvider defaultOpen={sidebarState !== "collapsed"}>
                  <AppSidebar />
                  <SidebarInset className="overflow-hidden">
                    <div className="flex-1 h-full overflow-y-auto">
                      {children}
                    </div>
                  </SidebarInset>
                </SidebarProvider>
              </div>
            )}
            <Toaster />
          </LanguageProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
