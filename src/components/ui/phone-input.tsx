"use client";

import { Input } from "@/components/ui/input";
import { useEffect, useState } from "react";

type PhoneInputProps = {
  value: string;
  extension?: string;
  onChange: (value: string) => void;
  onExtensionChange?: (extension: string) => void;
  required?: boolean;
  disabled?: boolean;
};

export function PhoneInput({
  value,
  extension = "",
  onChange,
  onExtensionChange,
  required = false,
  disabled = false,
}: PhoneInputProps) {
  const [displayValue, setDisplayValue] = useState("");

  // Format phone number as (XXX)-XXX-XXXX
  const formatPhoneNumber = (input: string): string => {
    // Remove all non-numeric characters
    const numbers = input.replace(/\D/g, "");

    // Limit to 10 digits
    const limited = numbers.slice(0, 10);

    if (limited.length === 0) return "";
    if (limited.length <= 3) return `(${limited}`;
    if (limited.length <= 6)
      return `(${limited.slice(0, 3)})-${limited.slice(3)}`;
    return `(${limited.slice(0, 3)})-${limited.slice(3, 6)}-${limited.slice(6)}`;
  };

  // Extract numeric value from formatted display
  const extractNumbers = (formatted: string): string => {
    return formatted.replace(/\D/g, "");
  };

  useEffect(() => {
    setDisplayValue(formatPhoneNumber(value));
  }, [value]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatPhoneNumber(e.target.value);
    setDisplayValue(formatted);
    const numbers = extractNumbers(formatted);
    onChange(numbers);
  };

  return (
    <div className="flex gap-2">
      <Input
        type="tel"
        value={displayValue}
        onChange={handleChange}
        placeholder="(___)-___-____"
        required={required}
        disabled={disabled}
        className="flex-1"
      />
      {onExtensionChange && (
        <Input
          type="text"
          value={extension}
          onChange={(e) => onExtensionChange(e.target.value)}
          placeholder="Ext."
          disabled={disabled}
          className="w-20"
        />
      )}
    </div>
  );
}

