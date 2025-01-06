"use client";

import {Geist, Geist_Mono} from "next/font/google";
import "./globals.css";
import {ThemeProvider} from "@/components/providers/ThemeProvider";
import {ThemeToggler} from "@/components/theme-toggler";
import {SidebarInset, SidebarProvider} from "@/components/ui/sidebar";
import {AppSidebar} from "@/components/app-sidebar";
import {usePathname} from "next/navigation";
import {Toaster} from "@/components/ui/toaster";

// const geistSans = Geist({
//   variable: "--font-geist-sans",
//   subsets: ["latin"],
// });

// const geistMono = Geist_Mono({
//   variable: "--font-geist-mono",
//   subsets: ["latin"],
// });

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const pathname = usePathname();
  const isLoginPage = pathname === "/";
  return (
    <html lang="en">
      <body
        // className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        className={`antialiased`}>
        <ThemeProvider>
          {!isLoginPage && (
            <div className="absolute bottom-5 right-4 text-white">
              <ThemeToggler />
            </div>
          )}
          {isLoginPage ? (
            children
          ) : (
            <div className="flex h-screen overflow-hidden">
              <SidebarProvider>
                <AppSidebar />
                <SidebarInset>
                  <div className="flex-1 overflow-auto">{children}</div>
                </SidebarInset>
                <Toaster />
              </SidebarProvider>
            </div>
          )}
        </ThemeProvider>
      </body>
    </html>
  );
}
