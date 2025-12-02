"use client";

import { SearchableCombobox } from "@/components/ui/searchable-combobox";

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
  return (
    <SearchableCombobox
      value={value}
      onChange={onChange}
      options={suggestions}
      placeholder={placeholder}
      allowCreateNew={true}
      required={required}
      disabled={disabled}
    />
  );
}
