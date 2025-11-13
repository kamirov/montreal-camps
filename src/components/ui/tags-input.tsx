"use client";

import { Badge } from "@/components/ui/badge";
import {
  Command,
  CommandGroup,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { X } from "lucide-react";
import { useEffect, useRef, useState } from "react";

type TagsInputProps = {
  value: string[];
  onChange: (value: string[]) => void;
  suggestions: string[];
  placeholder?: string;
};

export function TagsInput({
  value,
  onChange,
  suggestions,
  placeholder = "Add languages...",
}: TagsInputProps) {
  const [inputValue, setInputValue] = useState("");
  const [open, setOpen] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const filteredSuggestions = suggestions.filter(
    (suggestion) =>
      !value.includes(suggestion) &&
      suggestion.toLowerCase().includes(inputValue.toLowerCase())
  );

  const handleAddTag = (tag: string) => {
    const trimmedTag = tag.trim();
    if (trimmedTag && !value.includes(trimmedTag)) {
      onChange([...value, trimmedTag]);
      setInputValue("");
      setOpen(false);
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    onChange(value.filter((tag) => tag !== tagToRemove));
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && inputValue.trim()) {
      e.preventDefault();
      handleAddTag(inputValue);
    } else if (e.key === "Backspace" && !inputValue && value.length > 0) {
      handleRemoveTag(value[value.length - 1]);
    }
  };

  useEffect(() => {
    if (inputValue && filteredSuggestions.length > 0) {
      setOpen(true);
    } else {
      setOpen(false);
    }
  }, [inputValue, filteredSuggestions.length]);

  return (
    <div className="relative">
      <div className="flex flex-wrap gap-2 min-h-[36px] p-2 border border-input rounded-md bg-transparent items-center">
        {value.map((tag) => (
          <Badge key={tag} variant="secondary" className="gap-1">
            {tag}
            <button
              type="button"
              onClick={() => handleRemoveTag(tag)}
              className="ml-1 hover:bg-secondary-foreground/20 rounded-full p-0.5"
            >
              <X className="h-3 w-3" />
            </button>
          </Badge>
        ))}
        <input
          ref={inputRef}
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onFocus={() => inputValue && setOpen(true)}
          onBlur={() => setTimeout(() => setOpen(false), 200)}
          onKeyDown={handleKeyDown}
          placeholder={value.length === 0 ? placeholder : ""}
          className="flex-1 min-w-[120px] border-0 bg-transparent focus-visible:outline-none p-1 h-auto text-sm"
        />
      </div>
      {open && inputValue && filteredSuggestions.length > 0 && (
        <div className="absolute z-50 w-full mt-1">
          <Command className="rounded-lg border shadow-md bg-background">
            <CommandList>
              <CommandGroup>
                {filteredSuggestions.slice(0, 10).map((suggestion) => (
                  <CommandItem
                    key={suggestion}
                    value={suggestion}
                    onSelect={() => handleAddTag(suggestion)}
                    className="cursor-pointer"
                  >
                    {suggestion}
                  </CommandItem>
                ))}
                {inputValue.trim() &&
                  !suggestions.includes(inputValue.trim()) &&
                  !value.includes(inputValue.trim()) && (
                    <CommandItem
                      value={inputValue.trim()}
                      onSelect={() => handleAddTag(inputValue)}
                      className="cursor-pointer"
                    >
                      Add &quot;{inputValue.trim()}&quot;
                    </CommandItem>
                  )}
              </CommandGroup>
            </CommandList>
          </Command>
        </div>
      )}
    </div>
  );
}

