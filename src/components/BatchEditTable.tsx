"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  formatDates,
  formatLanguages,
  formatPhone,
  parseDates,
  parseLanguages,
  parsePhone,
} from "@/lib/batchEditUtils";
import type { Camp } from "@/lib/validations/camp";
import { useTranslation } from "@/localization/useTranslation";
import { ArrowDown, ArrowUp, Plus, Trash2 } from "lucide-react";
import { useCallback, useEffect, useState } from "react";

type BatchEditTableProps = {
  camps: Camp[];
  onSave: (changedCamps: Camp[], deletedNames: string[]) => Promise<void>;
};

type SortState = {
  column: string | null;
  direction: "asc" | "desc" | null;
};

type ColumnKey =
  | "name"
  | "borough"
  | "ageFrom"
  | "ageTo"
  | "languages"
  | "dates"
  | "financialAid"
  | "link"
  | "phone"
  | "email"
  | "address"
  | "notes";

const DEFAULT_CAMP: Omit<Camp, "name"> = {
  borough: "Ahuntsic-Cartierville",
  ageRange: { type: "range", allAges: false, from: 5, to: 15 },
  languages: ["English", "French"],
  dates: { type: "yearRound", yearRound: true },
  financialAid: "NA",
  link: undefined,
  phone: undefined,
  email: "",
  address: "",
  notes: "",
};

export function BatchEditTable({
  camps,
  onSave,
}: BatchEditTableProps) {
  const { t } = useTranslation();
  const [localCamps, setLocalCamps] = useState<Camp[]>(camps);
  const [originalCamps, setOriginalCamps] = useState<Map<string, Camp>>(
    new Map(camps.map((camp) => [camp.name, camp]))
  );
  const [nameMapping, setNameMapping] = useState<Map<string, string>>(
    new Map(camps.map((camp) => [camp.name, camp.name]))
  );
  const [changedRows, setChangedRows] = useState<Set<string>>(new Set());
  const [deletedRows, setDeletedRows] = useState<Set<string>>(new Set());
  const [sortState, setSortState] = useState<SortState>({
    column: null,
    direction: null,
  });
  const [isSaving, setIsSaving] = useState(false);

  // Update local camps when props change
  useEffect(() => {
    setLocalCamps(camps);
    setOriginalCamps(new Map(camps.map((camp) => [camp.name, camp])));
    setNameMapping(new Map(camps.map((camp) => [camp.name, camp.name])));
    setChangedRows(new Set());
    setDeletedRows(new Set());
  }, [camps]);


  const handleSort = useCallback((column: string) => {
    setSortState((prev) => {
      if (prev.column === column) {
        if (prev.direction === "asc") {
          return { column, direction: "desc" };
        }
        if (prev.direction === "desc") {
          return { column: null, direction: null };
        }
      }
      return { column, direction: "asc" };
    });
  }, []);

  const sortedCamps = useCallback(
    (campList: Camp[]) => {
      if (!sortState.column || !sortState.direction) {
        return campList;
      }

      const sorted = [...campList].sort((a, b) => {
        let aVal: string | number;
        let bVal: string | number;

        switch (sortState.column) {
          case "name":
            aVal = a.name.toLowerCase();
            bVal = b.name.toLowerCase();
            break;
          case "borough":
            aVal = (a.borough || "").toLowerCase();
            bVal = (b.borough || "").toLowerCase();
            break;
          case "ageFrom":
            aVal = a.ageRange.type === "all" ? 0 : a.ageRange.from;
            bVal = b.ageRange.type === "all" ? 0 : b.ageRange.from;
            break;
          case "ageTo":
            aVal = a.ageRange.type === "all" ? 999 : a.ageRange.to;
            bVal = b.ageRange.type === "all" ? 999 : b.ageRange.to;
            break;
          case "languages":
            aVal = formatLanguages(a.languages).toLowerCase();
            bVal = formatLanguages(b.languages).toLowerCase();
            break;
          case "dates":
            aVal = formatDates(a.dates).toLowerCase();
            bVal = formatDates(b.dates).toLowerCase();
            break;
          case "financialAid":
            aVal = a.financialAid.toLowerCase();
            bVal = b.financialAid.toLowerCase();
            break;
          case "link":
            aVal = a.link.toLowerCase();
            bVal = b.link.toLowerCase();
            break;
          case "phone":
            aVal = formatPhone(a.phone).toLowerCase();
            bVal = formatPhone(b.phone).toLowerCase();
            break;
          case "email":
            aVal = (a.email || "").toLowerCase();
            bVal = (b.email || "").toLowerCase();
            break;
          case "address":
            aVal = (a.address || "").toLowerCase();
            bVal = (b.address || "").toLowerCase();
            break;
          case "notes":
            aVal = (a.notes || "").toLowerCase();
            bVal = (b.notes || "").toLowerCase();
            break;
          default:
            return 0;
        }

        if (aVal < bVal) return sortState.direction === "asc" ? -1 : 1;
        if (aVal > bVal) return sortState.direction === "asc" ? 1 : -1;
        return 0;
      });

      return sorted;
    },
    [sortState]
  );

  const updateCamp = useCallback(
    (campName: string, updates: Partial<Camp>) => {
      setLocalCamps((prev) =>
        prev.map((camp) => (camp.name === campName ? { ...camp, ...updates } : camp))
      );

      // Check if changed from original
      const original = originalCamps.get(campName);
      if (original) {
        const updated = { ...original, ...updates };
        const isChanged = JSON.stringify(original) !== JSON.stringify(updated);
        setChangedRows((prev) => {
          const next = new Set(prev);
          if (isChanged) {
            next.add(campName);
          } else {
            next.delete(campName);
          }
          return next;
        });
      }
    },
    [originalCamps]
  );

  const handleCellChange = useCallback(
    (campName: string, field: ColumnKey, value: string) => {
      const camp = localCamps.find((c) => c.name === campName);
      if (!camp) return;

      switch (field) {
        case "name": {
          // Check for uniqueness
          const trimmedValue = value.trim();
          if (trimmedValue && trimmedValue !== campName) {
            const isDuplicate = localCamps.some(
              (c) => c.name === trimmedValue && c.name !== campName
            );
            if (isDuplicate) {
              // Don't update if duplicate
              return;
            }
            // Update name and track change
            const isNewCamp = !originalCamps.has(campName);
            const originalName = nameMapping.get(campName) || campName;
            
            setLocalCamps((prev) =>
              prev.map((c) => (c.name === campName ? { ...c, name: trimmedValue } : c))
            );
            
            // Update name mapping
            setNameMapping((prev) => {
              const next = new Map(prev);
              next.set(trimmedValue, originalName);
              if (next.has(campName)) {
                next.delete(campName);
              }
              return next;
            });
            
            // Update changedRows
            setChangedRows((prev) => {
              const next = new Set(prev);
              if (isNewCamp) {
                // For new camps, update the key
                next.delete(campName);
                next.add(trimmedValue);
              } else {
                // For existing camps, track by original name
                next.add(originalName);
              }
              return next;
            });
            
            // Update originalCamps if it's a new camp
            if (isNewCamp) {
              setOriginalCamps((prev) => {
                const next = new Map(prev);
                const camp = next.get(campName);
                if (camp) {
                  next.delete(campName);
                  next.set(trimmedValue, { ...camp, name: trimmedValue });
                }
                return next;
              });
            }
          }
          return;
        }
        case "borough":
          updateCamp(campName, { borough: value || null });
          return;
        case "ageFrom": {
          const numValue = parseInt(value, 10);
          if (!isNaN(numValue) && numValue > 0) {
            const currentRange = camp.ageRange;
            if (currentRange.type === "range") {
              updateCamp(campName, {
                ageRange: {
                  type: "range",
                  allAges: false,
                  from: numValue,
                  to: Math.max(numValue, currentRange.to),
                },
              });
            } else {
              updateCamp(campName, {
                ageRange: {
                  type: "range",
                  allAges: false,
                  from: numValue,
                  to: numValue,
                },
              });
            }
          }
          return;
        }
        case "ageTo": {
          const numValue = parseInt(value, 10);
          if (!isNaN(numValue) && numValue > 0) {
            const currentRange = camp.ageRange;
            if (currentRange.type === "range") {
              updateCamp(campName, {
                ageRange: {
                  type: "range",
                  allAges: false,
                  from: currentRange.from,
                  to: Math.max(numValue, currentRange.from),
                },
              });
            } else {
              updateCamp(campName, {
                ageRange: {
                  type: "range",
                  allAges: false,
                  from: 1,
                  to: numValue,
                },
              });
            }
          }
          return;
        }
        case "languages": {
          const parsed = parseLanguages(value);
          if (parsed.length > 0) {
            updateCamp(campName, { languages: parsed });
          }
          return;
        }
        case "dates": {
          const parsed = parseDates(value);
          if (parsed) {
            updateCamp(campName, { dates: parsed });
          }
          return;
        }
        case "financialAid":
          updateCamp(campName, { financialAid: value });
          return;
        case "link":
          updateCamp(campName, { link: value });
          return;
        case "phone": {
          const parsed = parsePhone(value);
          if (parsed) {
            updateCamp(campName, { phone: parsed });
          }
          return;
        }
        case "email":
          updateCamp(campName, { email: value || undefined });
          return;
        case "address":
          updateCamp(campName, { address: value || undefined });
          return;
        case "notes":
          updateCamp(campName, { notes: value || undefined });
          return;
      }
    },
    [localCamps, updateCamp, originalCamps, nameMapping]
  );

  const handleAddRow = useCallback(() => {
    const newCamp: Camp = {
      ...DEFAULT_CAMP,
      name: `New camp ${Date.now()}`,
    };
    setLocalCamps((prev) => [...prev, newCamp]);
    setNameMapping((prev) => new Map(prev).set(newCamp.name, newCamp.name));
    setChangedRows((prev) => new Set(prev).add(newCamp.name));
  }, []);

  const handleDeleteRow = useCallback((campName: string) => {
    setDeletedRows((prev) => {
      const next = new Set(prev);
      if (next.has(campName)) {
        next.delete(campName);
        // If it was a new camp, remove it entirely
        const isNew = !originalCamps.has(campName);
        if (isNew) {
          setLocalCamps((prev) => prev.filter((c) => c.name !== campName));
          setChangedRows((prevChanged) => {
            const nextChanged = new Set(prevChanged);
            nextChanged.delete(campName);
            return nextChanged;
          });
        }
      } else {
        next.add(campName);
        setChangedRows((prev) => {
          const nextChanged = new Set(prev);
          nextChanged.delete(campName);
          return nextChanged;
        });
      }
      return next;
    });
  }, [originalCamps]);

  const handleSave = useCallback(async () => {
    setIsSaving(true);
    try {
      // Get all camps that have been changed
      const campsToSave: Camp[] = [];
      const renamedCamps: Array<{ oldName: string; newName: string }> = [];
      
      for (const camp of localCamps) {
        if (deletedRows.has(camp.name)) continue;
        
        // Get the original name for this camp
        const originalName = nameMapping.get(camp.name) || camp.name;
        
        // Check if this camp was changed (tracked by original name)
        if (changedRows.has(originalName)) {
          campsToSave.push(camp);
          
          // If the name changed, track it for deletion of old camp
          if (originalName !== camp.name) {
            renamedCamps.push({ oldName: originalName, newName: camp.name });
          }
        }
      }

      // Get deleted names (excluding renamed camps' old names, as they'll be handled separately)
      const deletedNames = Array.from(deletedRows)
        .filter((name) => {
          // Get original name if this was renamed
          const originalName = nameMapping.get(name) || name;
          return originalCamps.has(originalName);
        })
        .filter((name) => {
          const originalName = nameMapping.get(name) || name;
          return !renamedCamps.some((rc) => rc.oldName === originalName);
        });

      // Add old names from renamed camps to deleted names
      const allDeletedNames = [
        ...deletedNames.map((name) => nameMapping.get(name) || name),
        ...renamedCamps.map((rc) => rc.oldName),
      ];

      await onSave(campsToSave, allDeletedNames);
    } finally {
      setIsSaving(false);
    }
  }, [localCamps, changedRows, deletedRows, originalCamps, nameMapping, onSave]);

  const renderTable = useCallback(
    (campList: Camp[]) => {
      const sorted = sortedCamps(campList);
      const columns: ColumnKey[] = [
        "name",
        "borough",
        "ageFrom",
        "ageTo",
        "languages",
        "dates",
        "financialAid",
        "link",
        "phone",
        "email",
        "address",
        "notes",
      ];

      const getSortIcon = (column: string) => {
        if (sortState.column !== column) return null;
        if (sortState.direction === "asc")
          return <ArrowUp className="h-3 w-3 inline ml-1" />;
        if (sortState.direction === "desc")
          return <ArrowDown className="h-3 w-3 inline ml-1" />;
        return null;
      };

      if (sorted.length === 0) {
        return (
          <div className="text-center py-8 text-muted-foreground">
            No camps found
          </div>
        );
      }

      return (
        <div className="overflow-x-auto border border-border rounded-md">
          <table className="w-full border-collapse min-w-full">
            <thead className="bg-muted sticky top-0 z-10">
              <tr>
                {columns.map((col) => (
                  <th
                    key={col}
                    className="border-b border-border px-2 py-2 text-left text-sm font-medium cursor-pointer hover:bg-muted/80 whitespace-nowrap"
                    onClick={() => handleSort(col)}
                  >
                    {col === "ageFrom"
                      ? "Age From"
                      : col === "ageTo"
                        ? "Age To"
                        : t.campFields[col as keyof typeof t.campFields] || col}
                    {getSortIcon(col)}
                  </th>
                ))}
                <th className="border-b border-border px-2 py-2 text-left text-sm font-medium whitespace-nowrap">
                  {t.batchView.deleteRow}
                </th>
              </tr>
            </thead>
            <tbody>
              {sorted.map((camp) => {
                const isChanged = changedRows.has(camp.name);
                const isDeleted = deletedRows.has(camp.name);
                return (
                  <tr
                    key={camp.name}
                    className={`${
                      isChanged ? "bg-yellow-50 dark:bg-yellow-950/20" : ""
                    } ${isDeleted ? "line-through opacity-60" : ""}`}
                  >
                    {columns.map((col) => {
                      let cellValue = "";

                      switch (col) {
                        case "name":
                          cellValue = camp.name;
                          break;
                        case "borough":
                          cellValue = camp.borough || "";
                          break;
                        case "ageFrom":
                          cellValue =
                            camp.ageRange.type === "all"
                              ? ""
                              : camp.ageRange.from.toString();
                          break;
                        case "ageTo":
                          cellValue =
                            camp.ageRange.type === "all"
                              ? ""
                              : camp.ageRange.to.toString();
                          break;
                        case "languages":
                          cellValue = formatLanguages(camp.languages);
                          break;
                        case "dates":
                          cellValue = formatDates(camp.dates);
                          break;
                        case "financialAid":
                          cellValue = camp.financialAid;
                          break;
                        case "link":
                          cellValue = camp.link;
                          break;
                        case "phone":
                          cellValue = formatPhone(camp.phone);
                          break;
                        case "email":
                          cellValue = camp.email || "";
                          break;
                        case "address":
                          cellValue = camp.address || "";
                          break;
                        case "notes":
                          cellValue = camp.notes || "";
                          break;
                      }

                      return (
                        <td key={col} className="border-b border-r border-border px-2 py-1 min-w-[100px]">
                          <Input
                            type={col === "ageFrom" || col === "ageTo" ? "number" : "text"}
                            value={cellValue}
                            onChange={(e) =>
                              handleCellChange(camp.name, col, e.target.value)
                            }
                            className="h-8 text-xs w-full"
                            disabled={isDeleted}
                            placeholder={col === "ageFrom" || col === "ageTo" ? (camp.ageRange.type === "all" ? "all" : "") : undefined}
                          />
                        </td>
                      );
                    })}
                    <td className="border-b border-r border-border px-2 py-1">
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDeleteRow(camp.name)}
                        className={`h-8 ${
                          isDeleted
                            ? "bg-red-50 dark:bg-red-950/20 border border-red-300 dark:border-red-800"
                            : "bg-red-50 dark:bg-red-950/20 border border-red-500 dark:border-red-700"
                        }`}
                        title={isDeleted ? "Click to undo deletion" : t.batchView.markForDeletion}
                      >
                        <Trash2
                          className={`h-3 w-3 ${
                            isDeleted
                              ? "text-red-400 dark:text-red-600"
                              : "text-red-600 dark:text-red-400"
                          }`}
                        />
                      </Button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      );
    },
    [
      sortedCamps,
      sortState,
      changedRows,
      deletedRows,
      handleSort,
      handleCellChange,
      handleDeleteRow,
      t,
    ]
  );

  const changedCount = changedRows.size;
  const deletedCount = deletedRows.size;

  return (
    <div className="space-y-6">
      {/* Stats and Save Button */}
      <div className="flex items-center justify-between">
        <div className="text-sm text-muted-foreground">
          {changedCount > 0 && (
            <span>
              {t.batchView.rowsChanged.replace("X", changedCount.toString())}
            </span>
          )}
          {changedCount > 0 && deletedCount > 0 && <span className="mx-2">•</span>}
          {deletedCount > 0 && (
            <span>
              {t.batchView.rowsDeleted.replace("X", deletedCount.toString())}
            </span>
          )}
          {changedCount === 0 && deletedCount === 0 && (
            <span>{t.batchView.noChanges}</span>
          )}
        </div>
        <Button
          onClick={handleSave}
          disabled={isSaving || (changedCount === 0 && deletedCount === 0)}
        >
          {isSaving ? t.batchView.saving : t.batchView.saveChanges}
        </Button>
      </div>

      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-2xl font-bold">{t.campTypes.day}</h2>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={handleAddRow}
          >
            <Plus className="h-4 w-4 mr-2" />
            {t.batchView.addRow}
          </Button>
        </div>
        {renderTable(localCamps)}
      </div>
    </div>
  );
}

