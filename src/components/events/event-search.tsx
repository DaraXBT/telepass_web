"use client";

import {useState, useEffect, useCallback} from "react";
import {useRouter, useSearchParams} from "next/navigation";
import {Input} from "@/components/ui/input";
import {Search} from "lucide-react";

export function EventSearch() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [searchQuery, setSearchQuery] = useState(
    searchParams.get("search") || ""
  );

  const updateSearchParams = useCallback(
    (query: string) => {
      const params = new URLSearchParams(searchParams.toString());
      if (query) {
        params.set("search", query);
      } else {
        params.delete("search");
      }
      return params.toString();
    },
    [searchParams]
  );

  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      const newParams = updateSearchParams(searchQuery);
      router.push(`/events?${newParams}`, {scroll: false});
    }, 300);

    return () => clearTimeout(delayDebounceFn);
  }, [searchQuery, router, updateSearchParams]);

  return (
    <div className="relative flex-1">
      <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
      <Input
        placeholder="Search events..."
        className="pl-8"
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
      />
    </div>
  );
}
