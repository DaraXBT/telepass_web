"use client";

import * as React from "react";
import {ChevronDownIcon} from "lucide-react";
import {format} from "date-fns";
import {cn} from "@/lib/utils";
import {Button} from "@/components/ui/button";
import {Calendar} from "@/components/ui/calendar";
import {Input} from "@/components/ui/input";
import {Label} from "@/components/ui/label";
import {Popover, PopoverContent, PopoverTrigger} from "@/components/ui/popover";

interface DateTimePickerProps {
  value?: Date;
  onChange: (date: Date) => void;
  placeholder?: string;
  label?: string;
}

export function DateTimePicker({
  value,
  onChange,
  placeholder = "Select date",
  label,
}: DateTimePickerProps) {
  const [open, setOpen] = React.useState(false);
  const [selectedDate, setSelectedDate] = React.useState<Date | undefined>(
    value
  );
  const [timeValue, setTimeValue] = React.useState<string>("");

  React.useEffect(() => {
    if (value) {
      setSelectedDate(value);
      const hours = value.getHours().toString().padStart(2, "0");
      const minutes = value.getMinutes().toString().padStart(2, "0");
      setTimeValue(`${hours}:${minutes}`);
    }
  }, [value]);

  const handleDateSelect = (date: Date | undefined) => {
    if (date) {
      setSelectedDate(date);
      // Preserve existing time or use current time
      const newDateTime = new Date(date);
      if (timeValue) {
        const [hours, minutes] = timeValue.split(":");
        newDateTime.setHours(parseInt(hours), parseInt(minutes));
      } else {
        // Use current time as default
        const now = new Date();
        newDateTime.setHours(now.getHours(), now.getMinutes());
        const defaultTime = `${now.getHours().toString().padStart(2, "0")}:${now.getMinutes().toString().padStart(2, "0")}`;
        setTimeValue(defaultTime);
      }
      onChange(newDateTime);
      setOpen(false);
    }
  };

  const handleTimeChange = (time: string) => {
    setTimeValue(time);
    if (selectedDate && time) {
      const [hours, minutes] = time.split(":");
      const newDateTime = new Date(selectedDate);
      newDateTime.setHours(parseInt(hours), parseInt(minutes));
      onChange(newDateTime);
    }
  };

  return (
    <div className="flex gap-3 w-full">
      <div className="flex flex-col gap-2 flex-1">
        {label && (
          <Label htmlFor="date" className="px-1 text-sm font-medium">
            Date
          </Label>
        )}
        <Popover open={open} onOpenChange={setOpen}>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              id="date"
              className={cn(
                "justify-between font-normal text-left",
                !selectedDate && "text-muted-foreground"
              )}>
              {selectedDate
                ? format(selectedDate, "MMM dd, yyyy")
                : placeholder}
              <ChevronDownIcon className="h-4 w-4 opacity-50" />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto overflow-hidden p-0" align="start">
            <Calendar
              mode="single"
              selected={selectedDate}
              captionLayout="dropdown"
              onSelect={handleDateSelect}
              className="rounded-md border"
            />
          </PopoverContent>
        </Popover>
      </div>

      <div className="flex flex-col gap-2 w-32">
        {label && (
          <Label htmlFor="time" className="px-1 text-sm font-medium">
            Time
          </Label>
        )}
        <Input
          type="time"
          id="time"
          value={timeValue}
          onChange={(e) => handleTimeChange(e.target.value)}
          className="bg-background appearance-none [&::-webkit-calendar-picker-indicator]:hidden [&::-webkit-calendar-picker-indicator]:appearance-none"
        />
      </div>
    </div>
  );
}
