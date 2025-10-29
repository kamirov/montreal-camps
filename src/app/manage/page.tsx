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
import { getCamp, getCamps, upsertCamp, deleteCamp } from "@/lib/api/camps";
import { campUpsertSchema } from "@/lib/validations/camp";
import { useTranslation } from "@/localization/useTranslation";
import type { Camp, CampUpsert } from "@/lib/validations/camp";
import { useEffect, useState } from "react";

type FormErrors = Partial<Record<keyof CampUpsert | "name", string>>;

export default function ManagePage() {
  const { t } = useTranslation();
  const [camps, setCamps] = useState<Camp[]>([]);
  const [selectedCampName, setSelectedCampName] = useState<string | null>(null);
  const [isNewCamp, setIsNewCamp] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);
  const [errors, setErrors] = useState<FormErrors>({});

  const [campName, setCampName] = useState("");
  const [formData, setFormData] = useState<CampUpsert>({
    type: "day",
    borough: "",
    ageRange: "",
    languages: [],
    dates: "",
    hours: "",
    cost: "",
    financialAid: "",
    link: "",
    phone: "",
    notes: "",
    coordinates: [45.5017, -73.5673], // Default to Montreal coordinates
  });

  const [languageInput, setLanguageInput] = useState("");

  // Load camps on mount
  useEffect(() => {
    async function loadCamps() {
      try {
        setIsLoading(true);
        const allCamps = await getCamps();
        setCamps(allCamps);
      } catch (err) {
        setMessage({
          type: "error",
          text: err instanceof Error ? err.message : t.manage.error.loadFailed,
        });
      } finally {
        setIsLoading(false);
      }
    }

    loadCamps();
  }, [t.manage.error.loadFailed]);

  // Load camp data when selected
  useEffect(() => {
    if (selectedCampName && !isNewCamp) {
      async function loadCamp() {
        try {
          const camp = await getCamp(selectedCampName!); // Non-null assertion: guarded by if check
          setCampName(camp.name);
          setFormData({
            type: camp.type,
            borough: camp.borough,
            ageRange: camp.ageRange,
            languages: camp.languages,
            dates: camp.dates,
            hours: camp.hours ?? "",
            cost: camp.cost,
            financialAid: camp.financialAid,
            link: camp.link,
            phone: camp.phone,
            notes: camp.notes,
            coordinates: camp.coordinates,
          });
          setLanguageInput(camp.languages.join(", "));
          setErrors({});
          setMessage(null);
        } catch (err) {
          setMessage({
            type: "error",
            text: err instanceof Error ? err.message : t.manage.error.loadFailed,
          });
        }
      }

      loadCamp();
    }
  }, [selectedCampName, isNewCamp, t.manage.error.loadFailed]);

  const handleCampSelect = (value: string) => {
    if (value === "new") {
      setIsNewCamp(true);
      setSelectedCampName(null);
      setCampName("");
      setFormData({
        type: "day",
        borough: "",
        ageRange: "",
        languages: [],
        dates: "",
        hours: "",
        cost: "",
        financialAid: "",
        link: "",
        phone: "",
        notes: "",
        coordinates: [45.5017, -73.5673],
      });
      setLanguageInput("");
      setErrors({});
      setMessage(null);
    } else {
      setIsNewCamp(false);
      setSelectedCampName(value);
    }
  };

  const handleLanguageInputChange = (value: string) => {
    setLanguageInput(value);
    const languages = value
      .split(",")
      .map((lang) => lang.trim())
      .filter((lang) => lang.length > 0);
    setFormData({ ...formData, languages });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});
    setMessage(null);

    // Validate camp name
    if (!campName.trim()) {
      setErrors({ name: t.manage.validation.required });
      return;
    }

    // Client-side validation
    const validationResult = campUpsertSchema.safeParse(formData);
    if (!validationResult.success) {
      const formattedErrors: FormErrors = {};
      validationResult.error.issues.forEach((issue) => {
        if (issue.path.length > 0) {
          const field = issue.path[0] as keyof CampUpsert;
          formattedErrors[field] = issue.message;
        }
      });
      setErrors(formattedErrors);
      return;
    }

    try {
      setIsSaving(true);
      const nameToUse = campName.trim();
      await upsertCamp(nameToUse, formData);

      setMessage({
        type: "success",
        text: t.manage.success.saved,
      });

      // Refresh camps list and select the saved camp
      const allCamps = await getCamps();
      setCamps(allCamps);
      setSelectedCampName(nameToUse);
      setIsNewCamp(false);
    } catch (err) {
      setMessage({
        type: "error",
        text: err instanceof Error ? err.message : t.manage.error.saveFailed,
      });
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!selectedCampName || isNewCamp) return;

    if (!confirm("Are you sure you want to delete this camp?")) {
      return;
    }

    try {
      setIsDeleting(true);
      await deleteCamp(selectedCampName);

      setMessage({
        type: "success",
        text: t.manage.success.deleted,
      });

      // Refresh camps list and reset form
      const allCamps = await getCamps();
      setCamps(allCamps);
      setSelectedCampName(null);
      setIsNewCamp(false);
      setCampName("");
      setFormData({
        type: "day",
        borough: "",
        ageRange: "",
        languages: [],
        dates: "",
        hours: "",
        cost: "",
        financialAid: "",
        link: "",
        phone: "",
        notes: "",
        coordinates: [45.5017, -73.5673],
      });
      setLanguageInput("");
    } catch (err) {
      setMessage({
        type: "error",
        text: err instanceof Error ? err.message : t.manage.error.deleteFailed,
      });
    } finally {
      setIsDeleting(false);
    }
  };

  const handleCancel = () => {
    setSelectedCampName(null);
    setIsNewCamp(false);
    setCampName("");
    setFormData({
      type: "day",
      borough: "",
      ageRange: "",
      languages: [],
      dates: "",
      hours: "",
      cost: "",
      financialAid: "",
      link: "",
      phone: "",
      notes: "",
      coordinates: [45.5017, -73.5673],
    });
    setLanguageInput("");
    setErrors({});
    setMessage(null);
  };

  const handleTypeChange = (value: "day" | "vacation") => {
    setFormData({
      ...formData,
      type: value,
      hours: value === "vacation" ? "" : formData.hours,
    });
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-muted-foreground">{t.loading.camps}</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background py-8">
      <div className="container mx-auto px-4 max-w-4xl">
        <h1 className="text-3xl font-bold mb-8">{t.manage.pageTitle}</h1>

        {/* Camp Selector */}
        <div className="mb-6">
          <label className="block text-sm font-medium mb-2">
            {t.manage.selectCamp}
          </label>
          <Select
            value={isNewCamp ? "new" : selectedCampName || undefined}
            onValueChange={handleCampSelect}
          >
            <SelectTrigger>
              <SelectValue placeholder={t.manage.selectCamp} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="new">{t.manage.createNew}</SelectItem>
              {camps.map((camp) => (
                <SelectItem key={camp.name} value={camp.name}>
                  {camp.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Message Display */}
        {message && (
          <div
            className={`mb-4 px-4 py-3 rounded-lg border ${
              message.type === "success"
                ? "bg-green-50 dark:bg-green-950 border-green-200 dark:border-green-800 text-green-800 dark:text-green-200"
                : "bg-destructive/10 border-destructive/20 text-destructive"
            }`}
          >
            {message.text}
          </div>
        )}

        {/* Form */}
        {(selectedCampName || isNewCamp) && (
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Camp Name */}
              <div>
                <label className="block text-sm font-medium mb-2">
                  {t.campFields.name}
                </label>
                <Input
                  value={campName}
                  onChange={(e) => setCampName(e.target.value)}
                  required
                  disabled={!isNewCamp}
                />
                {errors.name && (
                  <p className="text-sm text-destructive mt-1">{errors.name}</p>
                )}
              </div>

              {/* Camp Type */}
              <div>
                <label className="block text-sm font-medium mb-2">
                  {t.campFields.name === "Name"
                    ? "Type"
                    : "Type"} {/* TODO: Add to translations */}
              </label>
              <Select
                value={formData.type}
                onValueChange={handleTypeChange}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="day">{t.campTypes.day}</SelectItem>
                  <SelectItem value="vacation">
                    {t.campTypes.vacation}
                  </SelectItem>
                </SelectContent>
              </Select>
              {errors.type && (
                <p className="text-sm text-destructive mt-1">{errors.type}</p>
              )}
            </div>

              {/* Borough */}
              <div>
                <label className="block text-sm font-medium mb-2">
                  {t.campFields.name === "Name"
                    ? "Borough"
                    : "Arrondissement"} {/* TODO: Add to translations */}
                </label>
                <Input
                  value={formData.borough}
                  onChange={(e) =>
                    setFormData({ ...formData, borough: e.target.value })
                  }
                  required
                />
                {errors.borough && (
                  <p className="text-sm text-destructive mt-1">
                    {errors.borough}
                  </p>
                )}
              </div>

              {/* Age Range */}
              <div>
                <label className="block text-sm font-medium mb-2">
                  {t.campFields.ageRange}
                </label>
                <Input
                  value={formData.ageRange}
                  onChange={(e) =>
                    setFormData({ ...formData, ageRange: e.target.value })
                  }
                  required
                />
                {errors.ageRange && (
                  <p className="text-sm text-destructive mt-1">
                    {errors.ageRange}
                  </p>
                )}
              </div>

              {/* Languages */}
              <div className="md:col-span-2">
                <label className="block text-sm font-medium mb-2">
                  {t.campFields.languages}
                </label>
                <Input
                  value={languageInput}
                  onChange={(e) => handleLanguageInputChange(e.target.value)}
                  placeholder="English, French, Spanish (comma-separated)"
                />
                {errors.languages && (
                  <p className="text-sm text-destructive mt-1">
                    {errors.languages}
                  </p>
                )}
              </div>

              {/* Dates */}
              <div>
                <label className="block text-sm font-medium mb-2">
                  {t.campFields.dates}
                </label>
                <Input
                  value={formData.dates}
                  onChange={(e) =>
                    setFormData({ ...formData, dates: e.target.value })
                  }
                  required
                />
                {errors.dates && (
                  <p className="text-sm text-destructive mt-1">{errors.dates}</p>
                )}
              </div>

              {/* Hours (only for day camps) */}
              {formData.type === "day" && (
                <div>
                  <label className="block text-sm font-medium mb-2">
                    {t.campFields.hours}
                  </label>
                  <Input
                    value={formData.hours}
                    onChange={(e) =>
                      setFormData({ ...formData, hours: e.target.value })
                    }
                  />
                  {errors.hours && (
                    <p className="text-sm text-destructive mt-1">
                      {errors.hours}
                    </p>
                  )}
                </div>
              )}

              {/* Cost */}
              <div>
                <label className="block text-sm font-medium mb-2">
                  {t.campFields.cost}
                </label>
                <Input
                  value={formData.cost}
                  onChange={(e) =>
                    setFormData({ ...formData, cost: e.target.value })
                  }
                  required
                />
                {errors.cost && (
                  <p className="text-sm text-destructive mt-1">{errors.cost}</p>
                )}
              </div>

              {/* Financial Aid */}
              <div>
                <label className="block text-sm font-medium mb-2">
                  {t.campFields.financialAid}
                </label>
                <Input
                  value={formData.financialAid}
                  onChange={(e) =>
                    setFormData({ ...formData, financialAid: e.target.value })
                  }
                  required
                />
                {errors.financialAid && (
                  <p className="text-sm text-destructive mt-1">
                    {errors.financialAid}
                  </p>
                )}
              </div>

              {/* Link */}
              <div>
                <label className="block text-sm font-medium mb-2">
                  {t.campFields.link}
                </label>
                <Input
                  type="url"
                  value={formData.link}
                  onChange={(e) =>
                    setFormData({ ...formData, link: e.target.value })
                  }
                  required
                />
                {errors.link && (
                  <p className="text-sm text-destructive mt-1">{errors.link}</p>
                )}
              </div>

              {/* Phone */}
              <div>
                <label className="block text-sm font-medium mb-2">
                  {t.campFields.phone}
                </label>
                <Input
                  value={formData.phone}
                  onChange={(e) =>
                    setFormData({ ...formData, phone: e.target.value })
                  }
                  required
                />
                {errors.phone && (
                  <p className="text-sm text-destructive mt-1">{errors.phone}</p>
                )}
              </div>

              {/* Notes */}
              <div className="md:col-span-2">
                <label className="block text-sm font-medium mb-2">
                  {t.campFields.notes}
                </label>
                <textarea
                  className="flex min-h-[80px] w-full rounded-md border border-input bg-transparent px-3 py-2 text-base shadow-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 md:text-sm"
                  value={formData.notes}
                  onChange={(e) =>
                    setFormData({ ...formData, notes: e.target.value })
                  }
                  required
                />
                {errors.notes && (
                  <p className="text-sm text-destructive mt-1">{errors.notes}</p>
                )}
              </div>

              {/* Coordinates */}
              <div>
                <label className="block text-sm font-medium mb-2">
                  {t.manage.coordinates.latitude}
                </label>
                <Input
                  type="number"
                  step="any"
                  value={formData.coordinates[0]}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      coordinates: [
                        parseFloat(e.target.value) || 0,
                        formData.coordinates[1],
                      ],
                    })
                  }
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">
                  {t.manage.coordinates.longitude}
                </label>
                <Input
                  type="number"
                  step="any"
                  value={formData.coordinates[1]}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      coordinates: [
                        formData.coordinates[0],
                        parseFloat(e.target.value) || 0,
                      ],
                    })
                  }
                  required
                />
              </div>
              {errors.coordinates && (
                <p className="text-sm text-destructive md:col-span-2">
                  {errors.coordinates}
                </p>
              )}
            </div>

            {/* Action Buttons */}
            <div className="flex gap-4">
              <Button type="submit" disabled={isSaving}>
                {isSaving ? "Saving..." : t.manage.save}
              </Button>

              {!isNewCamp && selectedCampName && (
                <Button
                  type="button"
                  variant="destructive"
                  onClick={handleDelete}
                  disabled={isDeleting}
                >
                  {isDeleting ? "Deleting..." : t.manage.delete}
                </Button>
              )}

              {isNewCamp && (
                <Button type="button" variant="outline" onClick={handleCancel}>
                  {t.manage.cancel}
                </Button>
              )}
            </div>
          </form>
        )}
      </div>
    </div>
  );
}

