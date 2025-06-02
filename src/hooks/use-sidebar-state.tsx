"use client";

import {useEffect, useState} from "react";

// Cookie name to store sidebar state
const SIDEBAR_COOKIE_NAME = "sidebar:state";

export function useSidebarState() {
  const [sidebarState, setSidebarState] = useState<
    "expanded" | "collapsed" | null
  >(null);

  // Read sidebar state from cookie on first render
  useEffect(() => {
    const cookies = document.cookie.split(";");
    const sidebarCookie = cookies.find((cookie) =>
      cookie.trim().startsWith(`${SIDEBAR_COOKIE_NAME}=`)
    );

    if (sidebarCookie) {
      const state = sidebarCookie.split("=")[1];
      setSidebarState(state === "true" ? "expanded" : "collapsed");
    } else {
      setSidebarState("expanded"); // Default state
    }
  }, []);

  // Update the cookie when sidebar state changes
  const updateSidebarState = (state: "expanded" | "collapsed") => {
    setSidebarState(state);
    document.cookie = `${SIDEBAR_COOKIE_NAME}=${state === "expanded"}; path=/; max-age=${60 * 60 * 24 * 7}`; // 7 days
  };

  return {
    sidebarState,
    updateSidebarState,
  };
}
