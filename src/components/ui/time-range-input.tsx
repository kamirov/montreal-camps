"use client";

import { Input } from "@/components/ui/input";
import { useEffect, useState } from "react";

type TimeRangeInputProps = {
  value: string; // Format: "HH:MM - HH:MM" or empty string
  onChange: (value: string) => void;
  required?: boolean;
  disabled?: boolean;
};

export function TimeRangeInput({
  value,
  onChange,
  required = false,
  disabled = false,
}: TimeRangeInputProps) {
  // Parse initial value
  const parseTime = (timeStr: string) => {
    const parts = timeStr.split(" - ");
    if (parts.length === 2) {
      const [fromTime, toTime] = parts;
      const [fromHours, fromMinutes] = fromTime.split(":").map((v) => v || "0");
      const [toHours, toMinutes] = toTime.split(":").map((v) => v || "0");
      return {
        fromHours: parseInt(fromHours, 10) || 0,
        fromMinutes: parseInt(fromMinutes, 10) || 0,
        toHours: parseInt(toHours, 10) || 0,
        toMinutes: parseInt(toMinutes, 10) || 0,
      };
    }
    return {
      fromHours: 9,
      fromMinutes: 0,
      toHours: 17,
      toMinutes: 0,
    };
  };

  const initialValues = parseTime(value);
  const [fromHours, setFromHours] = useState(initialValues.fromHours);
  const [fromMinutes, setFromMinutes] = useState(initialValues.fromMinutes);
  const [toHours, setToHours] = useState(initialValues.toHours);
  const [toMinutes, setToMinutes] = useState(initialValues.toMinutes);

  useEffect(() => {
    const parsed = parseTime(value);
    setFromHours(parsed.fromHours);
    setFromMinutes(parsed.fromMinutes);
    setToHours(parsed.toHours);
    setToMinutes(parsed.toMinutes);
  }, [value]);

  const formatTimeValue = (hours: number, minutes: number) => {
    const h = String(hours).padStart(2, "0");
    const m = String(minutes).padStart(2, "0");
    return `${h}:${m}`;
  };

  const updateTime = (
    newFromHours: number,
    newFromMinutes: number,
    newToHours: number,
    newToMinutes: number
  ) => {
    const fromTime = formatTimeValue(newFromHours, newFromMinutes);
    const toTime = formatTimeValue(newToHours, newToMinutes);
    onChange(`${fromTime} - ${toTime}`);
  };

  const handleNumberInput = (
    value: string,
    setter: (val: number) => void,
    max: number
  ) => {
    const num = parseInt(value, 10);
    if (!isNaN(num) && num >= 0 && num <= max) {
      setter(num);
      return num;
    } else if (value === "") {
      setter(0);
      return 0;
    }
    return null;
  };

  return (
    <div className="flex items-center gap-2">
      <div className="flex items-center gap-1">
        <Input
          type="number"
          min="0"
          max="23"
          value={fromHours}
          onChange={(e) => {
            const newVal = handleNumberInput(e.target.value, setFromHours, 23);
            if (newVal !== null) {
              updateTime(newVal, fromMinutes, toHours, toMinutes);
            }
          }}
          className="w-16 text-center"
          required={required}
          disabled={disabled}
        />
        <span className="text-sm text-muted-foreground">h</span>
        <Input
          type="number"
          min="0"
          max="59"
          value={fromMinutes}
          onChange={(e) => {
            const newVal = handleNumberInput(e.target.value, setFromMinutes, 59);
            if (newVal !== null) {
              updateTime(fromHours, newVal, toHours, toMinutes);
            }
          }}
          className="w-16 text-center"
          required={required}
          disabled={disabled}
        />
      </div>
      <span className="text-muted-foreground">-</span>
      <div className="flex items-center gap-1">
        <Input
          type="number"
          min="0"
          max="23"
          value={toHours}
          onChange={(e) => {
            const newVal = handleNumberInput(e.target.value, setToHours, 23);
            if (newVal !== null) {
              updateTime(fromHours, fromMinutes, newVal, toMinutes);
            }
          }}
          className="w-16 text-center"
          required={required}
          disabled={disabled}
        />
        <span className="text-sm text-muted-foreground">h</span>
        <Input
          type="number"
          min="0"
          max="59"
          value={toMinutes}
          onChange={(e) => {
            const newVal = handleNumberInput(e.target.value, setToMinutes, 59);
            if (newVal !== null) {
              updateTime(fromHours, fromMinutes, toHours, newVal);
            }
          }}
          className="w-16 text-center"
          required={required}
          disabled={disabled}
        />
      </div>
    </div>
  );
}


