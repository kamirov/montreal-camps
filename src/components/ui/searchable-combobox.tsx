"use client";

import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
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
import { Check, ChevronsUpDown, Plus } from "lucide-react";
import * as React from "react";

type SearchableComboboxProps = {
  value?: string;
  onChange: (value: string) => void;
  options: string[];
  placeholder?: string;
  emptyMessage?: string;
  allowCreateNew?: boolean;
  onCreateNew?: (value: string) => void;
  disabled?: boolean;
  className?: string;
  required?: boolean;
};

export function SearchableCombobox({
  value,
  onChange,
  options,
  placeholder = "Select option...",
  emptyMessage,
  allowCreateNew = false,
  onCreateNew,
  disabled = false,
  className,
  required = false,
}: SearchableComboboxProps) {
  const { t } = useTranslation();
  const [open, setOpen] = React.useState(false);
  const displayValue = value || "";
  // When allowCreateNew is true, use input mode (needs Input field for typing)
  const useInputMode = allowCreateNew;
  const [searchValue, setSearchValue] = React.useState(
    useInputMode ? displayValue : ""
  );
  const inputRef = React.useRef<HTMLInputElement>(null);

  const emptyMessageText = emptyMessage || t.combobox.noMatches;

  // In input mode, sync searchValue with value when it changes externally
  React.useEffect(() => {
    if (useInputMode) {
      setSearchValue(displayValue);
    }
  }, [displayValue, useInputMode]);

  const handleSelect = (selectedValue: string) => {
    onChange(selectedValue);
    setOpen(false);
    if (!useInputMode) {
      setSearchValue("");
    } else {
      // In input mode, update searchValue to match selected value
      setSearchValue(selectedValue);
    }
    if (useInputMode && inputRef.current) {
      inputRef.current.blur();
    }
  };

  const handleCreateNew = () => {
    if (allowCreateNew && searchValue.trim() && onCreateNew) {
      onCreateNew(searchValue.trim());
      onChange(searchValue.trim());
      setOpen(false);
      if (useInputMode && inputRef.current) {
        inputRef.current.blur();
      }
    } else if (allowCreateNew && searchValue.trim()) {
      // If no onCreateNew callback, just use onChange
      onChange(searchValue.trim());
      setOpen(false);
      if (useInputMode && inputRef.current) {
        inputRef.current.blur();
      }
    }
  };

  // In input mode, handle direct input changes
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    setSearchValue(newValue);
    if (useInputMode && allowCreateNew) {
      // Automatically update value as user types when allowCreateNew is true
      onChange(newValue);
    }
    setOpen(true);
  };

  const handleBlur = () => {
    // Delay closing to allow click on suggestion
    setTimeout(() => setOpen(false), 200);
  };

  // Filter options based on search value (searchValue is updated immediately as user types)
  const filterValue = searchValue;
  const filteredOptionsForDisplay = React.useMemo(() => {
    if (!filterValue || !filterValue.trim()) {
      return options;
    }
    const searchLower = filterValue.toLowerCase();
    return options.filter((option) =>
      option.toLowerCase().includes(searchLower)
    );
  }, [options, filterValue]);

  // Check if the current filter value is a new value (not in options)
  const isNewValueForDisplay = React.useMemo(() => {
    if (!allowCreateNew || !filterValue.trim()) {
      return false;
    }
    return !options.some(
      (option) => option.toLowerCase() === filterValue.trim().toLowerCase()
    );
  }, [allowCreateNew, options, filterValue]);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        {useInputMode ? (
          <Input
            ref={inputRef}
            value={displayValue}
            onChange={handleInputChange}
            onFocus={() => setOpen(true)}
            onBlur={handleBlur}
            placeholder={placeholder}
            required={required}
            disabled={disabled}
            className={className}
          />
        ) : (
          <Button
            variant="outline"
            role="combobox"
            aria-expanded={open}
            disabled={disabled}
            className={cn(
              "w-full justify-between font-normal",
              !displayValue && "text-muted-foreground",
              className
            )}
          >
            {displayValue || placeholder}
            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
          </Button>
        )}
      </PopoverTrigger>
      <PopoverContent
        className="w-[var(--radix-popover-trigger-width)] p-0"
        align="start"
      >
        <Command shouldFilter={false}>
          {!useInputMode && (
            <CommandInput
              placeholder={placeholder}
              value={searchValue}
              onValueChange={setSearchValue}
            />
          )}
          <CommandList>
            {filteredOptionsForDisplay.length === 0 &&
              !isNewValueForDisplay && (
                <CommandEmpty>{emptyMessageText}</CommandEmpty>
              )}
            {filteredOptionsForDisplay.length > 0 && (
              <CommandGroup>
                {filteredOptionsForDisplay.map((option) => (
                  <CommandItem
                    key={option}
                    value={option}
                    onSelect={() => handleSelect(option)}
                  >
                    <Check
                      className={cn(
                        "mr-2 h-4 w-4",
                        value === option ? "opacity-100" : "opacity-0"
                      )}
                    />
                    {option}
                  </CommandItem>
                ))}
              </CommandGroup>
            )}
            {isNewValueForDisplay && allowCreateNew && (
              <CommandGroup>
                <CommandItem
                  onSelect={handleCreateNew}
                  className="text-primary"
                >
                  <Plus className="mr-2 h-4 w-4" />
                  {t.combobox.createNew} &quot;{filterValue.trim()}&quot;
                </CommandItem>
              </CommandGroup>
            )}
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
