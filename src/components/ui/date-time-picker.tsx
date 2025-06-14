"use client";

import * as React from "react";
import {CalendarIcon} from "lucide-react";
import {format} from "date-fns";
import {cn} from "@/lib/utils";
import {Button} from "@/components/ui/button";
import {Calendar} from "@/components/ui/calendar";
import {Popover, PopoverContent, PopoverTrigger} from "@/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface DateTimePickerProps {
  value?: Date;
  onChange: (date: Date) => void;
  placeholder?: string;
}

export function DateTimePicker({
  value,
  onChange,
  placeholder = "Pick a date and time",
}: DateTimePickerProps) {
  const [selectedDateTime, setSelectedDateTime] = React.useState<Date>(
    value || new Date()
  );

  React.useEffect(() => {
    if (value) {
      setSelectedDateTime(value);
    }
  }, [value]);

  const handleDateSelect = (date: Date | undefined) => {
    if (date) {
      const newDateTime = new Date(
        date.getFullYear(),
        date.getMonth(),
        date.getDate(),
        selectedDateTime.getHours(),
        selectedDateTime.getMinutes()
      );
      setSelectedDateTime(newDateTime);
      onChange(newDateTime);
    }
  };

  const handleTimeChange = (time: string) => {
    const [hours, minutes] = time.split(":").map(Number);
    const newDateTime = new Date(selectedDateTime);
    newDateTime.setHours(hours);
    newDateTime.setMinutes(minutes);
    setSelectedDateTime(newDateTime);
    onChange(newDateTime);
  };
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant={"outline"}
          className={cn(
            "w-full justify-start text-left font-normal h-10 px-3 py-2 hover:bg-accent hover:text-accent-foreground",
            !value && "text-muted-foreground"
          )}>
          <CalendarIcon className="mr-2 h-4 w-4 opacity-50" />
          {value ? (
            <span className="flex items-center gap-2">
              <span>{format(selectedDateTime, "PPP")}</span>
              <span className="text-xs bg-muted px-2 py-1 rounded">
                {format(selectedDateTime, "p")}
              </span>
            </span>
          ) : (
            <span>{placeholder}</span>
          )}
        </Button>
      </PopoverTrigger>{" "}
      <PopoverContent className="w-auto p-0" align="start">
        <Calendar
          mode="single"
          selected={selectedDateTime}
          onSelect={handleDateSelect}
          initialFocus
          className="rounded-md border"
        />
        <div className="p-3 border-t border-border bg-muted/50">
          <div className="flex items-center gap-2 mb-2">
            <CalendarIcon className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm font-medium">Select Time</span>
          </div>
          <Select
            value={format(selectedDateTime, "HH:mm")}
            onValueChange={handleTimeChange}>
            <SelectTrigger className="h-8">
              <SelectValue placeholder="Select time" />
            </SelectTrigger>
            <SelectContent className="max-h-48">
              {Array.from({length: 24 * 4}).map((_, index) => {
                const hours = Math.floor(index / 4);
                const minutes = (index % 4) * 15;
                const timeString = `${hours.toString().padStart(2, "0")}:${minutes
                  .toString()
                  .padStart(2, "0")}`;
                const displayTime = new Date();
                displayTime.setHours(hours, minutes);
                return (
                  <SelectItem key={index} value={timeString}>
                    <div className="flex items-center justify-between w-full">
                      <span>{timeString}</span>
                      <span className="text-xs text-muted-foreground ml-2">
                        {format(displayTime, "h:mm a")}
                      </span>
                    </div>
                  </SelectItem>
                );
              })}
            </SelectContent>
          </Select>
        </div>
      </PopoverContent>
    </Popover>
  );
}
