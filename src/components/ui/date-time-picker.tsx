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
  value: Date;
  onChange: (date: Date) => void;
}

export function DateTimePicker({value, onChange}: DateTimePickerProps) {
  const [selectedDateTime, setSelectedDateTime] = React.useState<Date>(value);

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
            "w-full justify-start text-left font-normal",
            !value && "text-muted-foreground"
          )}>
          <CalendarIcon className="mr-2 h-4 w-4" />
          {selectedDateTime ? (
            format(selectedDateTime, "PPP p")
          ) : (
            <span>Pick a date</span>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0">
        <Calendar
          mode="single"
          selected={selectedDateTime}
          onSelect={handleDateSelect}
          initialFocus
        />
        <div className="p-3 border-t border-border">
          <Select
            value={format(selectedDateTime, "HH:mm")}
            onValueChange={handleTimeChange}>
            <SelectTrigger>
              <SelectValue placeholder="Select time" />
            </SelectTrigger>
            <SelectContent>
              {Array.from({length: 24 * 4}).map((_, index) => {
                const hours = Math.floor(index / 4);
                const minutes = (index % 4) * 15;
                const timeString = `${hours.toString().padStart(2, "0")}:${minutes
                  .toString()
                  .padStart(2, "0")}`;
                return (
                  <SelectItem key={index} value={timeString}>
                    {timeString}
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
