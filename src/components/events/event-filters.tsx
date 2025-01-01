"use client";

import {useState, useEffect, useCallback} from "react";
import {useRouter, useSearchParams} from "next/navigation";
import {Button} from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {Filter} from "lucide-react";

const statusOptions = [
  {label: "Upcoming", value: "upcoming"},
  {label: "Ongoing", value: "ongoing"},
  {label: "Finished", value: "finished"},
];

export function EventFilters() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [selectedStatuses, setSelectedStatuses] = useState<string[]>(
    searchParams.get("status")?.split(",").filter(Boolean) || []
  );

  const updateSearchParams = useCallback(
    (statuses: string[]) => {
      const params = new URLSearchParams(searchParams.toString());
      if (statuses.length > 0) {
        params.set("status", statuses.join(","));
      } else {
        params.delete("status");
      }
      return params.toString();
    },
    [searchParams]
  );

  const handleStatusChange = (status: string) => {
    setSelectedStatuses((prev) =>
      prev.includes(status)
        ? prev.filter((s) => s !== status)
        : [...prev, status]
    );
  };

  const applyFilters = useCallback(() => {
    const newParams = updateSearchParams(selectedStatuses);
    router.push(`/events?${newParams}`, {scroll: false});
  }, [selectedStatuses, updateSearchParams, router]);

  useEffect(() => {
    applyFilters();
  }, [selectedStatuses, applyFilters]);

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" className="gap-2">
          <Filter className="h-4 w-4" />
          Filters
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-[200px]">
        <DropdownMenuLabel>Event Status</DropdownMenuLabel>
        <DropdownMenuSeparator />
        {statusOptions.map((option) => (
          <DropdownMenuCheckboxItem
            key={option.value}
            checked={selectedStatuses.includes(option.value)}
            onCheckedChange={() => handleStatusChange(option.value)}>
            {option.label}
          </DropdownMenuCheckboxItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
