"use client";

import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

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
  labels?: {
    from: string;
    to: string;
  };
};

export function DateRangePicker({
  fromDate,
  toDate,
  onFromDateChange,
  onToDateChange,
  disabled = false,
  required = false,
  labels = { from: "From", to: "To" },
}: DateRangePickerProps) {
  return (
    <div className="grid grid-cols-2 gap-4">
      <DatePicker
        value={fromDate}
        onChange={onFromDateChange}
        label={labels.from}
        required={required}
        disabled={disabled}
      />
      <DatePicker
        value={toDate}
        onChange={onToDateChange}
        label={labels.to}
        required={required}
        disabled={disabled}
      />
    </div>
  );
}

