"use client";

import { Input } from "@/components/ui/input";

type DatePickerProps = {
  value: string; // ISO date string (YYYY-MM-DD)
  onChange: (value: string) => void;
  placeholder?: string;
  required?: boolean;
  disabled?: boolean;
  label?: string;
};

export function DatePicker({
  value,
  onChange,
  placeholder = "YYYY-MM-DD",
  required = false,
  disabled = false,
  label,
}: DatePickerProps) {
  return (
    <div className="w-full">
      {label && (
        <label className="block text-sm font-medium mb-2">{label}</label>
      )}
      <Input
        type="date"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        required={required}
        disabled={disabled}
      />
    </div>
  );
}

type DateRangePickerProps = {
  fromDate: string;
  toDate: string;
  onFromDateChange: (value: string) => void;
  onToDateChange: (value: string) => void;
  disabled?: boolean;
  required?: boolean;
};

export function DateRangePicker({
  fromDate,
  toDate,
  onFromDateChange,
  onToDateChange,
  disabled = false,
  required = false,
}: DateRangePickerProps) {
  return (
    <div className="flex items-center gap-2">
      <Input
        type="date"
        value={fromDate}
        onChange={(e) => onFromDateChange(e.target.value)}
        required={required}
        disabled={disabled}
        className="flex-1"
      />
      <span className="text-muted-foreground">-</span>
      <Input
        type="date"
        value={toDate}
        onChange={(e) => onToDateChange(e.target.value)}
        required={required}
        disabled={disabled}
        className="flex-1"
      />
    </div>
  );
}

