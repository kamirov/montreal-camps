"use client";

import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { Input } from "@/components/ui/input";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { useTranslation } from "@/localization/useTranslation";
import { Check, Plus } from "lucide-react";
import { useEffect, useRef, useState } from "react";

type BoroughAutocompleteProps = {
  value: string;
  onChange: (value: string) => void;
  suggestions: string[];
  placeholder?: string;
  required?: boolean;
  disabled?: boolean;
};

export function BoroughAutocomplete({
  value,
  onChange,
  suggestions,
  placeholder = "Select or enter borough",
  required = false,
  disabled = false,
}: BoroughAutocompleteProps) {
  const { t } = useTranslation();
  const [open, setOpen] = useState(false);
  const [inputValue, setInputValue] = useState(value);
  const inputRef = useRef<HTMLInputElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setInputValue(value);
  }, [value]);

  // Filter suggestions based on input value
  const filteredSuggestions = suggestions.filter((borough) =>
    borough.toLowerCase().includes(inputValue.toLowerCase())
  );

  // Check if the current input value is a new value (not in suggestions)
  const isNewValue =
    inputValue.trim() &&
    !suggestions.some(
      (suggestion) =>
        suggestion.toLowerCase() === inputValue.trim().toLowerCase()
    );

  const handleSelect = (selectedValue: string) => {
    setInputValue(selectedValue);
    onChange(selectedValue);
    setOpen(false);
    inputRef.current?.blur();
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    setInputValue(newValue);
    onChange(newValue);
    setOpen(true);
  };

  const handleBlur = () => {
    // Delay closing to allow click on suggestion
    setTimeout(() => setOpen(false), 200);
  };

  const handleCreateNew = () => {
    if (inputValue.trim()) {
      onChange(inputValue.trim());
      setOpen(false);
      inputRef.current?.blur();
    }
  };

  return (
    <div className="relative" ref={containerRef}>
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Input
            ref={inputRef}
            value={inputValue}
            onChange={handleInputChange}
            onFocus={() => setOpen(true)}
            onBlur={handleBlur}
            placeholder={placeholder}
            required={required}
            disabled={disabled}
          />
        </PopoverTrigger>
        <PopoverContent
          className="w-[var(--radix-popover-trigger-width)] p-0"
          align="start"
        >
          <Command shouldFilter={false}>
            <CommandList>
              {filteredSuggestions.length === 0 && !isNewValue && (
                <CommandEmpty>{t.combobox.noMatches}</CommandEmpty>
              )}
              {filteredSuggestions.length > 0 && (
                <CommandGroup>
                  {filteredSuggestions.map((borough) => (
                    <CommandItem
                      key={borough}
                      value={borough}
                      onSelect={() => handleSelect(borough)}
                      className="cursor-pointer"
                    >
                      <Check
                        className={cn(
                          "mr-2 h-4 w-4",
                          value === borough ? "opacity-100" : "opacity-0"
                        )}
                      />
                      {borough}
                    </CommandItem>
                  ))}
                </CommandGroup>
              )}
              {isNewValue && (
                <CommandGroup>
                  <CommandItem
                    onSelect={handleCreateNew}
                    className="cursor-pointer text-primary"
                  >
                    <Plus className="mr-2 h-4 w-4" />
                    {t.combobox.createNew} &quot;{inputValue.trim()}&quot;
                  </CommandItem>
                </CommandGroup>
              )}
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>
    </div>
  );
}
