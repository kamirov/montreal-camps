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
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { Check, ChevronsUpDown, Plus } from "lucide-react";
import { useTranslation } from "@/localization/useTranslation";
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
}: SearchableComboboxProps) {
  const { t } = useTranslation();
  const [open, setOpen] = React.useState(false);
  const [searchValue, setSearchValue] = React.useState("");

  const displayValue = value || "";
  const emptyMessageText = emptyMessage || t.combobox.noMatches;

  // Filter options based on search value
  const filteredOptions = React.useMemo(() => {
    if (!searchValue.trim()) {
      return options;
    }
    const searchLower = searchValue.toLowerCase();
    return options.filter((option) =>
      option.toLowerCase().includes(searchLower)
    );
  }, [options, searchValue]);

  // Check if the current search value is a new value (not in options)
  const isNewValue = React.useMemo(() => {
    if (!allowCreateNew || !searchValue.trim()) {
      return false;
    }
    return !options.some(
      (option) => option.toLowerCase() === searchValue.toLowerCase()
    );
  }, [allowCreateNew, options, searchValue]);

  const handleSelect = (selectedValue: string) => {
    onChange(selectedValue);
    setOpen(false);
    setSearchValue("");
  };

  const handleCreateNew = () => {
    if (allowCreateNew && searchValue.trim() && onCreateNew) {
      onCreateNew(searchValue.trim());
      onChange(searchValue.trim());
      setOpen(false);
      setSearchValue("");
    } else if (allowCreateNew && searchValue.trim()) {
      // If no onCreateNew callback, just use onChange
      onChange(searchValue.trim());
      setOpen(false);
      setSearchValue("");
    }
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
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
      </PopoverTrigger>
      <PopoverContent className="w-[var(--radix-popover-trigger-width)] p-0" align="start">
        <Command shouldFilter={false}>
          <CommandInput
            placeholder={placeholder}
            value={searchValue}
            onValueChange={setSearchValue}
          />
          <CommandList>
            {filteredOptions.length === 0 && !isNewValue && (
              <CommandEmpty>{emptyMessageText}</CommandEmpty>
            )}
            {filteredOptions.length > 0 && (
              <CommandGroup>
                {filteredOptions.map((option) => (
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
            {isNewValue && allowCreateNew && (
              <CommandGroup>
                <CommandItem
                  onSelect={handleCreateNew}
                  className="text-primary"
                >
                  <Plus className="mr-2 h-4 w-4" />
                  {t.combobox.createNew} &quot;{searchValue.trim()}&quot;
                </CommandItem>
              </CommandGroup>
            )}
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}

