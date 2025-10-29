"use client";

import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useEffect, useState } from "react";

type CostInputProps = {
  amount: number;
  period: "year" | "month" | "week" | "hour";
  onAmountChange: (amount: number) => void;
  onPeriodChange: (period: "year" | "month" | "week" | "hour") => void;
  required?: boolean;
  disabled?: boolean;
  periodLabels?: {
    year: string;
    month: string;
    week: string;
    hour: string;
  };
};

export function CostInput({
  amount,
  period,
  onAmountChange,
  onPeriodChange,
  required = false,
  disabled = false,
  periodLabels = {
    year: "year",
    month: "month",
    week: "week",
    hour: "hour",
  },
}: CostInputProps) {
  const [displayAmount, setDisplayAmount] = useState(
    amount ? amount.toString() : ""
  );

  useEffect(() => {
    setDisplayAmount(amount ? amount.toString() : "");
  }, [amount]);

  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/[^0-9.]/g, "");
    setDisplayAmount(value);
    const numValue = parseFloat(value);
    if (!isNaN(numValue) && numValue >= 0) {
      onAmountChange(numValue);
    } else if (value === "") {
      onAmountChange(0);
    }
  };

  return (
    <div className="flex gap-2">
      <div className="relative flex-1">
        <Input
          type="text"
          inputMode="decimal"
          value={displayAmount}
          onChange={handleAmountChange}
          placeholder="0.00"
          required={required}
          disabled={disabled}
          className="pr-6"
        />
        <span className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none">
          $
        </span>
      </div>
      <Select
        value={period}
        onValueChange={(value) =>
          onPeriodChange(value as "year" | "month" | "week" | "hour")
        }
        disabled={disabled}
      >
        <SelectTrigger className="w-[120px]">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="hour">{periodLabels.hour}</SelectItem>
          <SelectItem value="week">{periodLabels.week}</SelectItem>
          <SelectItem value="month">{periodLabels.month}</SelectItem>
          <SelectItem value="year">{periodLabels.year}</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
}

