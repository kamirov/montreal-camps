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
import { useMemo, useState } from "react";

type SearchBarProps = {
  camps: Camp[];
  onSelectCamp: (camp: Camp) => void;
  onSelectBorough?: (borough: string) => void;
  value: string;
  onValueChange: (value: string) => void;
};

export function SearchBar({
  camps,
  onSelectCamp,
  onSelectBorough,
  value,
  onValueChange,
}: SearchBarProps) {
  const { t } = useTranslation();
  const [open, setOpen] = useState(false);

  // Get unique boroughs from camps
  const uniqueBoroughs = useMemo(() => {
    const boroughSet = new Set(camps.map((camp) => camp.borough));
    return Array.from(boroughSet).sort();
  }, [camps]);

  const filteredBoroughs = useMemo(() => {
    if (!value) return [];
    const query = value.toLowerCase();
    return uniqueBoroughs.filter((borough) =>
      borough.toLowerCase().includes(query)
    );
  }, [value, uniqueBoroughs]);

  const filteredCamps = useMemo(() => {
    if (!value) return [];
    const query = value.toLowerCase();
    return camps.filter((camp) => {
      return (
        camp.name.toLowerCase().includes(query) ||
        camp.borough.toLowerCase().includes(query) ||
        camp.notes.toLowerCase().includes(query)
      );
    });
  }, [value, camps]);

  const hasResults = filteredBoroughs.length > 0 || filteredCamps.length > 0;

  return (
    <div className="relative">
      <Command className="rounded-lg border-2 shadow-md bg-background">
        <CommandInput
          placeholder={t.search.regionPrompt}
          value={value}
          onValueChange={onValueChange}
          onFocus={() => setOpen(true)}
          onBlur={() => setTimeout(() => setOpen(false), 200)}
        />
        {open && value && (
          <CommandList className="absolute top-full left-0 right-0 mt-1 max-h-[400px] overflow-y-auto rounded-lg border-2 bg-background shadow-xl z-[60]">
            {!hasResults && <CommandEmpty>{t.search.noResults}</CommandEmpty>}

            {filteredBoroughs.length > 0 && (
              <CommandGroup heading={t.search.regions}>
                {filteredBoroughs.slice(0, 5).map((borough) => (
                  <CommandItem
                    key={borough}
                    onSelect={() => {
                      if (onSelectBorough) {
                        onSelectBorough(borough);
                      }
                      setOpen(false);
                    }}
                    className="cursor-pointer"
                  >
                    <div className="flex items-center gap-2">
                      <MapPin className="h-4 w-4 text-primary" />
                      <span className="font-medium">{borough}</span>
                    </div>
                  </CommandItem>
                ))}
              </CommandGroup>
            )}

            {filteredCamps.length > 0 && (
              <CommandGroup heading={t.search.camps}>
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
            )}
          </CommandList>
        )}
      </Command>
    </div>
  );
}
