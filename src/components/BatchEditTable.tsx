"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  formatAgeRange,
  formatCost,
  formatDates,
  formatLanguages,
  formatPhone,
  parseAgeRange,
  parseCost,
  parseDates,
  parseLanguages,
  parsePhone,
} from "@/lib/batchEditUtils";
import type { Camp } from "@/lib/validations/camp";
import { useTranslation } from "@/localization/useTranslation";
import { ArrowDown, ArrowUp, Plus, Trash2 } from "lucide-react";
import { useCallback, useEffect, useMemo, useState } from "react";

type BatchEditTableProps = {
  camps: Camp[];
  onSave: (changedCamps: Camp[], deletedNames: string[]) => Promise<void>;
  availableBoroughs: string[];
  availableLanguages: string[];
};

type SortState = {
  column: string | null;
  direction: "asc" | "desc" | null;
};

type ColumnKey =
  | "name"
  | "type"
  | "borough"
  | "ageRange"
  | "languages"
  | "dates"
  | "hours"
  | "cost"
  | "financialAid"
  | "link"
  | "phone"
  | "email"
  | "address"
  | "notes";

const DEFAULT_DAY_CAMP: Omit<Camp, "name"> = {
  type: "day",
  borough: "Ahuntsic-Cartierville",
  ageRange: { type: "range", allAges: false, from: 5, to: 15 },
  languages: ["English", "French"],
  dates: { type: "yearRound", yearRound: true },
  hours: "09:00 - 17:00",
  cost: { amount: 100, period: "week" },
  financialAid: "NA",
  link: "",
  phone: { number: "", extension: "" },
  email: "",
  address: "",
  notes: "",
};

const DEFAULT_VACATION_CAMP: Omit<Camp, "name"> = {
  type: "vacation",
  borough: null,
  ageRange: { type: "range", allAges: false, from: 5, to: 15 },
  languages: ["English", "French"],
  dates: { type: "yearRound", yearRound: true },
  hours: undefined,
  cost: { amount: 100, period: "week" },
  financialAid: "NA",
  link: "",
  phone: { number: "", extension: "" },
  email: "",
  address: "",
  notes: "",
};

export function BatchEditTable({
  camps,
  onSave,
  availableBoroughs,
  availableLanguages,
}: BatchEditTableProps) {
  const { t } = useTranslation();
  const [localCamps, setLocalCamps] = useState<Camp[]>(camps);
  const [originalCamps, setOriginalCamps] = useState<Map<string, Camp>>(
    new Map(camps.map((camp) => [camp.name, camp]))
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
    setChangedRows(new Set());
    setDeletedRows(new Set());
  }, [camps]);

  const dayCamps = useMemo(
    () => localCamps.filter((camp) => camp.type === "day"),
    [localCamps]
  );
  const vacationCamps = useMemo(
    () => localCamps.filter((camp) => camp.type === "vacation"),
    [localCamps]
  );

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
        let aVal: any;
        let bVal: any;

        switch (sortState.column) {
          case "name":
            aVal = a.name.toLowerCase();
            bVal = b.name.toLowerCase();
            break;
          case "type":
            aVal = a.type;
            bVal = b.type;
            break;
          case "borough":
            aVal = (a.borough || "").toLowerCase();
            bVal = (b.borough || "").toLowerCase();
            break;
          case "ageRange":
            aVal = formatAgeRange(a.ageRange);
            bVal = formatAgeRange(b.ageRange);
            break;
          case "languages":
            aVal = formatLanguages(a.languages).toLowerCase();
            bVal = formatLanguages(b.languages).toLowerCase();
            break;
          case "dates":
            aVal = formatDates(a.dates).toLowerCase();
            bVal = formatDates(b.dates).toLowerCase();
            break;
          case "hours":
            aVal = (a.hours || "").toLowerCase();
            bVal = (b.hours || "").toLowerCase();
            break;
          case "cost":
            aVal = a.cost.amount;
            bVal = b.cost.amount;
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

      let parsedValue: any = value;

      switch (field) {
        case "name": {
          const isNewCamp = !originalCamps.has(campName);
          if (isNewCamp && value !== campName) {
            // For new camps, update the name and track the change
            setLocalCamps((prev) =>
              prev.map((c) => (c.name === campName ? { ...c, name: value } : c))
            );
            // Update changedRows to use new name
            setChangedRows((prev) => {
              const next = new Set(prev);
              next.delete(campName);
              next.add(value);
              return next;
            });
          }
          return;
        }
        case "type":
          updateCamp(campName, {
            type: value as "day" | "vacation",
            borough: value === "vacation" ? null : camp.borough,
            hours: value === "vacation" ? undefined : camp.hours,
          });
          return;
        case "borough":
          updateCamp(campName, { borough: value || null });
          return;
        case "ageRange": {
          const parsed = parseAgeRange(value);
          if (parsed) {
            updateCamp(campName, { ageRange: parsed });
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
        case "hours":
          updateCamp(campName, { hours: value || undefined });
          return;
        case "cost": {
          const parsed = parseCost(value);
          if (parsed) {
            updateCamp(campName, { cost: parsed });
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
    [localCamps, updateCamp, originalCamps]
  );

  const handleAddRow = useCallback(
    (type: "day" | "vacation") => {
      const defaults = type === "day" ? DEFAULT_DAY_CAMP : DEFAULT_VACATION_CAMP;
      const newCamp: Camp = {
        ...defaults,
        name: `New ${type} camp ${Date.now()}`,
      };
      setLocalCamps((prev) => [...prev, newCamp]);
      setChangedRows((prev) => new Set(prev).add(newCamp.name));
    },
    []
  );

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
      const changedCamps = localCamps.filter((camp) => {
        if (deletedRows.has(camp.name)) return false;
        if (changedRows.has(camp.name)) return true;
        return false;
      });
      const deletedNames = Array.from(deletedRows).filter((name) =>
        originalCamps.has(name)
      );
      await onSave(changedCamps, deletedNames);
    } finally {
      setIsSaving(false);
    }
  }, [localCamps, changedRows, deletedRows, originalCamps, onSave]);

  const renderTable = useCallback(
    (campList: Camp[], campType: "day" | "vacation") => {
      const sorted = sortedCamps(campList);
      const columns: ColumnKey[] =
        campType === "day"
          ? [
              "name",
              "type",
              "borough",
              "ageRange",
              "languages",
              "dates",
              "hours",
              "cost",
              "financialAid",
              "link",
              "phone",
              "email",
              "address",
              "notes",
            ]
          : [
              "name",
              "type",
              "ageRange",
              "languages",
              "dates",
              "cost",
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
            No {campType} camps found
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
                    {t.campFields[col] || col}
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
                      let inputType: "text" | "select" = "text";

                      switch (col) {
                        case "name":
                          cellValue = camp.name;
                          break;
                        case "type":
                          cellValue = camp.type;
                          inputType = "select";
                          break;
                        case "borough":
                          cellValue = camp.borough || "";
                          break;
                        case "ageRange":
                          cellValue = formatAgeRange(camp.ageRange);
                          break;
                        case "languages":
                          cellValue = formatLanguages(camp.languages);
                          break;
                        case "dates":
                          cellValue = formatDates(camp.dates);
                          break;
                        case "hours":
                          cellValue = camp.hours || "";
                          break;
                        case "cost":
                          cellValue = formatCost(camp.cost);
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

                      const isNameField = col === "name";
                      const isNewCamp = !originalCamps.has(camp.name);
                      const isNameDisabled = isNameField && !isNewCamp;
                      return (
                        <td key={col} className="border-b border-r border-border px-2 py-1 min-w-[100px]">
                          {inputType === "select" && col === "type" ? (
                            <Select
                              value={cellValue}
                              onValueChange={(value) =>
                                handleCellChange(camp.name, col, value)
                              }
                            >
                              <SelectTrigger className="h-8 text-xs">
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="day">{t.campTypes.day}</SelectItem>
                                <SelectItem value="vacation">
                                  {t.campTypes.vacation}
                                </SelectItem>
                              </SelectContent>
                            </Select>
                          ) : (
                            <Input
                              type="text"
                              value={cellValue}
                              onChange={(e) =>
                                handleCellChange(camp.name, col, e.target.value)
                              }
                              className="h-8 text-xs w-full"
                              disabled={isDeleted || isNameDisabled}
                              title={isNameDisabled ? "Name cannot be changed in batch view. Use form view to rename camps." : undefined}
                            />
                          )}
                        </td>
                      );
                    })}
                    <td className="border-b border-r border-border px-2 py-1">
                      <Button
                        type="button"
                        variant={isDeleted ? "outline" : "destructive"}
                        size="sm"
                        onClick={() => handleDeleteRow(camp.name)}
                        className="h-8"
                        title={isDeleted ? "Click to undo deletion" : t.batchView.markForDeletion}
                      >
                        <Trash2 className="h-3 w-3" />
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

      {/* Day Camps Section */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-2xl font-bold">{t.campTypes.day}</h2>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => handleAddRow("day")}
          >
            <Plus className="h-4 w-4 mr-2" />
            {t.batchView.addRow}
          </Button>
        </div>
        {renderTable(dayCamps, "day")}
      </div>

      {/* Vacation Camps Section */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-2xl font-bold">{t.campTypes.vacation}</h2>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => handleAddRow("vacation")}
          >
            <Plus className="h-4 w-4 mr-2" />
            {t.batchView.addRow}
          </Button>
        </div>
        {renderTable(vacationCamps, "vacation")}
      </div>
    </div>
  );
}

