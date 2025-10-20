"use client";

import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { useTranslation } from "@/localization/useTranslation";
import { Camp } from "@/types/camp";
import { MapPin, Users } from "lucide-react";
import { useState } from "react";

type SearchBarProps = {
  camps: Camp[];
  onSelectCamp: (camp: Camp) => void;
  value: string;
  onValueChange: (value: string) => void;
};

export function SearchBar({
  camps,
  onSelectCamp,
  value,
  onValueChange,
}: SearchBarProps) {
  const { t } = useTranslation();
  const [open, setOpen] = useState(false);

  const filteredCamps = camps.filter((camp) => {
    const query = value.toLowerCase();
    return (
      camp.name.toLowerCase().includes(query) ||
      camp.borough.toLowerCase().includes(query) ||
      camp.notes.toLowerCase().includes(query)
    );
  });

  return (
    <div className="relative">
      <Command className="rounded-lg border-2 shadow-md bg-background">
        <CommandInput
          placeholder={t.search.placeholder}
          value={value}
          onValueChange={onValueChange}
          onFocus={() => setOpen(true)}
          onBlur={() => setTimeout(() => setOpen(false), 200)}
        />
        {open && value && (
          <CommandList className="absolute top-full left-0 right-0 mt-1 max-h-[300px] overflow-y-auto rounded-lg border-2 bg-background shadow-xl z-[60]">
            <CommandEmpty>{t.search.noResults}</CommandEmpty>
            <CommandGroup heading="Camps">
              {filteredCamps.slice(0, 8).map((camp) => (
                <CommandItem
                  key={camp.id}
                  onSelect={() => {
                    onSelectCamp(camp);
                    setOpen(false);
                  }}
                  className="cursor-pointer"
                >
                  <div className="flex flex-col">
                    <div className="font-medium">{camp.name}</div>
                    <div className="flex items-center gap-3 text-xs text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <MapPin className="h-3 w-3" />
                        {camp.borough}
                      </div>
                      <div className="flex items-center gap-1">
                        <Users className="h-3 w-3" />
                        {camp.ageRange}
                      </div>
                    </div>
                  </div>
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        )}
      </Command>
    </div>
  );
}
