"use client";

import { BatchEditTable } from "@/components/BatchEditTable";
import { Header } from "@/components/Header";
import { BoroughAutocomplete } from "@/components/ui/borough-autocomplete";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { CostInput } from "@/components/ui/cost-input";
import { DateRangePicker } from "@/components/ui/date-picker";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { PhoneInput } from "@/components/ui/phone-input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { TagsInput } from "@/components/ui/tags-input";
import { TimeRangeInput } from "@/components/ui/time-range-input";
import { deleteCamp, getCamp, getCamps, upsertCamp } from "@/lib/api/camps";
import type { Camp, CampUpsert } from "@/lib/validations/camp";
import { campUpsertSchema } from "@/lib/validations/camp";
import { useTranslation } from "@/localization/useTranslation";
import { ExternalLink } from "lucide-react";
import { useEffect, useMemo, useState } from "react";

type FormErrors = Partial<Record<keyof CampUpsert | "name", string>>;

export default function ManagePage() {
  const { t } = useTranslation();
  const [camps, setCamps] = useState<Camp[]>([]);
  const [selectedCampName, setSelectedCampName] = useState<string | null>(null);
  const [isNewCamp, setIsNewCamp] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [message, setMessage] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);
  const [errors, setErrors] = useState<FormErrors>({});
  const [viewMode, setViewMode] = useState<"form" | "batch">("form");

  // Authentication state
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isAuthenticating, setIsAuthenticating] = useState(true);
  const [showAuthDialog, setShowAuthDialog] = useState(false);
  const [secretInput, setSecretInput] = useState("");
  const [authError, setAuthError] = useState("");

  const [campName, setCampName] = useState("");
  const [formData, setFormData] = useState<CampUpsert>({
    type: "day",
    borough: null,
    ageRange: { type: "range", allAges: false, from: 5, to: 15 },
    languages: ["English", "French"],
    dates: { type: "yearRound", yearRound: true },
    hours: "09:00 - 17:00",
    // TODO: Temporary cost and financial aid values
    cost: { amount: 100, period: "week" },
    financialAid: "NA",

    link: "",
    phone: { number: "", extension: "" },
    email: "",
    address: "",
    notes: "",
  });

  // Validate secret via API
  const validateSecret = async (secret: string): Promise<boolean> => {
    try {
      const response = await fetch("/api/auth/validate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ secret }),
      });

      if (response.ok) {
        const data = await response.json();
        return data.valid;
      }
      return false;
    } catch (error) {
      console.error("Error validating secret:", error);
      return false;
    }
  };

  // Check for stored secret on mount
  useEffect(() => {
    async function checkAuth() {
      const storedSecret = localStorage.getItem("adminSecret");

      if (storedSecret) {
        const isValid = await validateSecret(storedSecret);
        if (isValid) {
          setIsAuthenticated(true);
          setIsAuthenticating(false);
        } else {
          // Clear invalid secret
          localStorage.removeItem("adminSecret");
          setShowAuthDialog(true);
          setIsAuthenticating(false);
        }
      } else {
        setShowAuthDialog(true);
        setIsAuthenticating(false);
      }
    }

    checkAuth();
  }, []);

  // Handle auth dialog submission
  const handleAuthSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError("");

    if (!secretInput.trim()) {
      setAuthError(t.auth.error.required);
      return;
    }

    const isValid = await validateSecret(secretInput);
    if (isValid) {
      localStorage.setItem("adminSecret", secretInput);
      setIsAuthenticated(true);
      setShowAuthDialog(false);
      setSecretInput("");
    } else {
      setAuthError(t.auth.error.invalid);
    }
  };

  // Extract unique boroughs and languages from camps
  const availableBoroughs = useMemo(() => {
    const boroughs = new Set<string>();
    camps.forEach((camp) => {
      if (camp.borough !== null) {
        boroughs.add(camp.borough);
      }
    });
    return Array.from(boroughs).sort();
  }, [camps]);

  const availableLanguages = useMemo(() => {
    const languages = new Set<string>();
    camps.forEach((camp) => {
      camp.languages.forEach((lang) => languages.add(lang));
    });
    return Array.from(languages).sort();
  }, [camps]);

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
          const camp = await getCamp(selectedCampName!);
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
            email: camp.email ?? "",
            address: camp.address ?? "",
            notes: camp.notes ?? "",
          });
          setErrors({});
          setMessage(null);
        } catch (err) {
          setMessage({
            type: "error",
            text:
              err instanceof Error ? err.message : t.manage.error.loadFailed,
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
      });
      setErrors({});
      setMessage(null);
    } else {
      setIsNewCamp(false);
      setSelectedCampName(value);
    }
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

      // Prepare camp data with coordinates
      const campDataToSave = { ...formData };

      // Check if we need to geocode the address
      let needsGeocoding = false;
      let existingCamp: Camp | null = null;

      if (!isNewCamp && selectedCampName) {
        // Get existing camp to check if address changed
        try {
          existingCamp = await getCamp(selectedCampName);
        } catch (err) {
          console.error("Error fetching existing camp:", err);
        }
      }

      // Determine if geocoding is needed
      if (campDataToSave.address && campDataToSave.address.trim().length > 0) {
        // Need to geocode if:
        // 1. It's a new camp, OR
        // 2. Address has changed
        const addressChanged =
          isNewCamp ||
          !existingCamp ||
          existingCamp.address !== campDataToSave.address;

        if (addressChanged) {
          needsGeocoding = true;
        } else if (existingCamp) {
          // Address unchanged, keep existing coordinates
          campDataToSave.latitude = existingCamp.latitude;
          campDataToSave.longitude = existingCamp.longitude;
        }
      } else {
        // Address removed, clear coordinates
        campDataToSave.latitude = null;
        campDataToSave.longitude = null;
      }

      console.log("needsGeocoding", needsGeocoding);
      console.log("campDataToSave.address", campDataToSave.address);

      // Geocode if needed
      if (needsGeocoding && campDataToSave.address) {
        try {
          const response = await fetch(
            `/api/geocode?address=${encodeURIComponent(campDataToSave.address)}`
          );

          if (response.ok) {
            const coords = await response.json();
            if (coords.lat && coords.lng) {
              campDataToSave.latitude = coords.lat;
              campDataToSave.longitude = coords.lng;
            }
          } else {
            console.warn("Geocoding failed, saving camp without coordinates");
            // Continue saving without coordinates - user can retry later
          }
        } catch (error) {
          console.error("Error geocoding address:", error);
          // Continue saving without coordinates - user can retry later
        }
      }

      await upsertCamp(nameToUse, campDataToSave);

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
        borough: null,
        ageRange: { type: "all", allAges: true },
        languages: [],
        dates: { type: "yearRound", yearRound: true },
        hours: "09:00 - 17:00",
        cost: { amount: 0, period: "week" },
        financialAid: "",
        link: "",
        phone: { number: "", extension: "" },
        email: "",
        notes: "",
      });
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
      borough: null,
      ageRange: { type: "all", allAges: true },
      languages: [],
      dates: { type: "yearRound", yearRound: true },
      hours: "09:00 - 17:00",
      cost: { amount: 0, period: "week" },
      financialAid: "",
      link: "",
      phone: { number: "", extension: "" },
      email: "",
      notes: "",
    });
    setErrors({});
    setMessage(null);
  };

  const handleTypeChange = (value: "day" | "vacation") => {
    setFormData({
      ...formData,
      type: value,
      hours: value === "vacation" ? "" : formData.hours || "09:00 - 17:00",
      borough: value === "vacation" ? null : formData.borough,
    });
  };

  const handleBatchSave = async (
    changedCamps: Camp[],
    deletedNames: string[]
  ) => {
    try {
      setIsSaving(true);
      setMessage(null);

      // Validate all changed camps
      for (const camp of changedCamps) {
        const validationResult = campUpsertSchema.safeParse({
          type: camp.type,
          borough: camp.borough,
          ageRange: camp.ageRange,
          languages: camp.languages,
          dates: camp.dates,
          hours: camp.hours,
          cost: camp.cost,
          financialAid: camp.financialAid,
          link: camp.link,
          phone: camp.phone,
          email: camp.email,
          address: camp.address,
          notes: camp.notes,
        });

        if (!validationResult.success) {
          throw new Error(
            `Validation failed for camp "${
              camp.name
            }": ${validationResult.error.issues
              .map((i) => i.message)
              .join(", ")}`
          );
        }
      }

      // Upsert changed camps
      for (const camp of changedCamps) {
        const { name, ...campData } = camp;
        await upsertCamp(name, campData);
      }

      // Delete marked camps
      for (const name of deletedNames) {
        await deleteCamp(name);
      }

      // Refresh camps list
      const allCamps = await getCamps();
      setCamps(allCamps);

      setMessage({
        type: "success",
        text: `Successfully saved ${changedCamps.length} camp(s) and deleted ${deletedNames.length} camp(s)`,
      });
    } catch (err) {
      setMessage({
        type: "error",
        text: err instanceof Error ? err.message : t.manage.error.saveFailed,
      });
      throw err;
    } finally {
      setIsSaving(false);
    }
  };

  // Show loading state during authentication
  if (isAuthenticating) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-muted-foreground">{t.loading.camps}</p>
      </div>
    );
  }

  // Show authentication dialog if not authenticated
  if (!isAuthenticated) {
    return (
      <>
        <Header showBackButton />
        <Dialog open={showAuthDialog} onOpenChange={setShowAuthDialog}>
          <DialogContent onInteractOutside={(e) => e.preventDefault()}>
            <form onSubmit={handleAuthSubmit}>
              <DialogHeader>
                <DialogTitle>{t.auth.title}</DialogTitle>
                <DialogDescription>{t.auth.prompt}</DialogDescription>
              </DialogHeader>
              <div className="py-4">
                <Input
                  type="text"
                  value={secretInput}
                  onChange={(e) => setSecretInput(e.target.value)}
                  placeholder={t.auth.placeholder}
                  autoFocus
                />
                {authError && (
                  <p className="text-sm text-destructive mt-2">{authError}</p>
                )}
              </div>
              <DialogFooter>
                <Button type="submit">{t.auth.submit}</Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </>
    );
  }

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-muted-foreground">{t.loading.camps}</p>
      </div>
    );
  }

  const isAllAges = formData.ageRange.type === "all";
  const isYearRound = formData.dates.type === "yearRound";

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Header showBackButton />
      <div className="flex-1 container mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold">{t.manage.pageTitle}</h1>
          <Tabs
            value={viewMode}
            onValueChange={(v) => setViewMode(v as "form" | "batch")}
          >
            <TabsList>
              <TabsTrigger value="form">{t.batchView.formView}</TabsTrigger>
              <TabsTrigger value="batch">{t.batchView.batchView}</TabsTrigger>
            </TabsList>
          </Tabs>
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

        {viewMode === "batch" ? (
          <BatchEditTable
            camps={camps}
            onSave={handleBatchSave}
            availableBoroughs={availableBoroughs}
            availableLanguages={availableLanguages}
          />
        ) : (
          <>
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
                      <p className="text-sm text-destructive mt-1">
                        {errors.name}
                      </p>
                    )}
                  </div>

                  {/* Camp Type */}
                  <div>
                    <label className="block text-sm font-medium mb-2">
                      {t.campFields.name === "Name" ? "Type" : "Type"}
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
                      <p className="text-sm text-destructive mt-1">
                        {errors.type}
                      </p>
                    )}
                  </div>

                  {/* Borough - only for day camps */}
                  {formData.type === "day" && (
                    <div>
                      <label className="block text-sm font-medium mb-2">
                        {t.campFields.name === "Name"
                          ? "Borough"
                          : "Arrondissement"}
                      </label>
                      <BoroughAutocomplete
                        value={formData.borough || ""}
                        onChange={(value) =>
                          setFormData({ ...formData, borough: value })
                        }
                        suggestions={availableBoroughs}
                        required
                      />
                      {errors.borough && (
                        <p className="text-sm text-destructive mt-1">
                          {errors.borough}
                        </p>
                      )}
                    </div>
                  )}

                  {/* Age Range */}
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium mb-2">
                      {t.campFields.ageRange}
                    </label>
                    <div className="space-y-3">
                      <div className="flex items-center space-x-2">
                        <Checkbox
                          id="allAges"
                          checked={isAllAges}
                          onCheckedChange={(checked) => {
                            setFormData({
                              ...formData,
                              ageRange: checked
                                ? { type: "all", allAges: true }
                                : {
                                    type: "range",
                                    allAges: false,
                                    from: 5,
                                    to: 12,
                                  },
                            });
                          }}
                        />
                        <label
                          htmlFor="allAges"
                          className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                        >
                          All ages
                        </label>
                      </div>
                      {!isAllAges && formData.ageRange.type === "range" && (
                        <div className="flex items-center gap-2">
                          <Input
                            type="number"
                            min="1"
                            value={formData.ageRange.from}
                            onChange={(e) => {
                              const from = parseInt(e.target.value) || 1;
                              const currentRange = formData.ageRange;
                              if (currentRange.type === "range") {
                                setFormData({
                                  ...formData,
                                  ageRange: {
                                    type: "range",
                                    allAges: false,
                                    from,
                                    to: Math.max(from, currentRange.to),
                                  },
                                });
                              }
                            }}
                            required
                            className="flex-1"
                          />
                          <span className="text-muted-foreground">-</span>
                          <Input
                            type="number"
                            min="1"
                            value={formData.ageRange.to}
                            onChange={(e) => {
                              const to = parseInt(e.target.value) || 1;
                              const currentRange = formData.ageRange;
                              if (currentRange.type === "range") {
                                setFormData({
                                  ...formData,
                                  ageRange: {
                                    type: "range",
                                    allAges: false,
                                    from: currentRange.from,
                                    to: Math.max(to, currentRange.from),
                                  },
                                });
                              }
                            }}
                            required
                            className="flex-1"
                          />
                        </div>
                      )}
                    </div>
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
                    <TagsInput
                      value={formData.languages}
                      onChange={(languages) =>
                        setFormData({ ...formData, languages })
                      }
                      suggestions={availableLanguages}
                    />
                    {errors.languages && (
                      <p className="text-sm text-destructive mt-1">
                        {errors.languages}
                      </p>
                    )}
                  </div>

                  {/* Dates */}
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium mb-2">
                      {t.campFields.dates}
                    </label>
                    <div className="space-y-3">
                      <div className="flex items-center space-x-2">
                        <Checkbox
                          id="yearRound"
                          checked={isYearRound}
                          onCheckedChange={(checked) => {
                            setFormData({
                              ...formData,
                              dates: checked
                                ? { type: "yearRound", yearRound: true }
                                : {
                                    type: "range",
                                    yearRound: false,
                                    fromDate: new Date()
                                      .toISOString()
                                      .split("T")[0],
                                    toDate: new Date()
                                      .toISOString()
                                      .split("T")[0],
                                  },
                            });
                          }}
                        />
                        <label
                          htmlFor="yearRound"
                          className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                        >
                          Year round
                        </label>
                      </div>
                      {!isYearRound && formData.dates.type === "range" && (
                        <DateRangePicker
                          fromDate={formData.dates.fromDate}
                          toDate={formData.dates.toDate}
                          onFromDateChange={(fromDate) => {
                            const currentDates = formData.dates;
                            if (currentDates.type === "range") {
                              setFormData({
                                ...formData,
                                dates: {
                                  type: "range",
                                  yearRound: false,
                                  fromDate,
                                  toDate:
                                    fromDate > currentDates.toDate
                                      ? fromDate
                                      : currentDates.toDate,
                                },
                              });
                            }
                          }}
                          onToDateChange={(toDate) => {
                            const currentDates = formData.dates;
                            if (currentDates.type === "range") {
                              setFormData({
                                ...formData,
                                dates: {
                                  type: "range",
                                  yearRound: false,
                                  fromDate: currentDates.fromDate,
                                  toDate:
                                    toDate < currentDates.fromDate
                                      ? currentDates.fromDate
                                      : toDate,
                                },
                              });
                            }
                          }}
                          required
                        />
                      )}
                    </div>
                    {errors.dates && (
                      <p className="text-sm text-destructive mt-1">
                        {errors.dates}
                      </p>
                    )}
                  </div>

                  {/* Hours (only for day camps) */}
                  {formData.type === "day" && (
                    <div>
                      <label className="block text-sm font-medium mb-2">
                        {t.campFields.hours}
                      </label>
                      <TimeRangeInput
                        value={formData.hours ?? ""}
                        onChange={(value) =>
                          setFormData({ ...formData, hours: value })
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
                    <CostInput
                      amount={formData.cost.amount}
                      period={formData.cost.period}
                      onAmountChange={(amount) =>
                        setFormData({
                          ...formData,
                          cost: { ...formData.cost, amount },
                        })
                      }
                      onPeriodChange={(period) =>
                        setFormData({
                          ...formData,
                          cost: { ...formData.cost, period },
                        })
                      }
                      required
                    />
                    {errors.cost && (
                      <p className="text-sm text-destructive mt-1">
                        {errors.cost}
                      </p>
                    )}
                  </div>

                  {/* Financial Aid */}
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium mb-2">
                      {t.campFields.financialAid}
                    </label>
                    <textarea
                      className="flex min-h-[80px] w-full rounded-md border border-input bg-transparent px-3 py-2 text-base shadow-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 md:text-sm"
                      value={formData.financialAid}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          financialAid: e.target.value,
                        })
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
                    <div className="flex gap-2">
                      <Input
                        type="url"
                        value={formData.link}
                        onChange={(e) =>
                          setFormData({ ...formData, link: e.target.value })
                        }
                        required
                        className="flex-1"
                      />
                      {formData.link && (
                        <Button
                          type="button"
                          variant="outline"
                          size="icon"
                          onClick={() => {
                            const url =
                              formData.link.startsWith("http://") ||
                              formData.link.startsWith("https://")
                                ? formData.link
                                : `https://${formData.link}`;
                            window.open(url, "_blank");
                          }}
                        >
                          <ExternalLink className="h-4 w-4" />
                        </Button>
                      )}
                    </div>
                    {errors.link && (
                      <p className="text-sm text-destructive mt-1">
                        {errors.link}
                      </p>
                    )}
                  </div>

                  {/* Phone */}
                  <div>
                    <label className="block text-sm font-medium mb-2">
                      {t.campFields.phone}
                    </label>
                    <PhoneInput
                      value={formData.phone.number}
                      extension={formData.phone.extension}
                      onChange={(number) =>
                        setFormData({
                          ...formData,
                          phone: { ...formData.phone, number },
                        })
                      }
                      onExtensionChange={(extension) =>
                        setFormData({
                          ...formData,
                          phone: { ...formData.phone, extension },
                        })
                      }
                      required
                    />
                    {errors.phone && (
                      <p className="text-sm text-destructive mt-1">
                        {errors.phone}
                      </p>
                    )}
                  </div>

                  {/* Email */}
                  <div>
                    <label className="block text-sm font-medium mb-2">
                      {t.campFields.email}{" "}
                      <span className="text-muted-foreground">(Optional)</span>
                    </label>
                    <Input
                      type="email"
                      value={formData.email ?? ""}
                      onChange={(e) =>
                        setFormData({ ...formData, email: e.target.value })
                      }
                      placeholder="example@email.com"
                    />
                    {errors.email && (
                      <p className="text-sm text-destructive mt-1">
                        {errors.email}
                      </p>
                    )}
                  </div>

                  {/* Address */}
                  <div>
                    <label className="block text-sm font-medium mb-2">
                      {t.campFields.address}{" "}
                      <span className="text-muted-foreground">(Optional)</span>
                    </label>
                    <Input
                      type="text"
                      value={formData.address ?? ""}
                      onChange={(e) =>
                        setFormData({ ...formData, address: e.target.value })
                      }
                      placeholder="e.g., 123 Main St, Montreal, QC or Henri-Julien Park"
                    />
                    {errors.address && (
                      <p className="text-sm text-destructive mt-1">
                        {errors.address}
                      </p>
                    )}
                  </div>

                  {/* Notes */}
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium mb-2">
                      {t.campFields.notes}{" "}
                      <span className="text-muted-foreground">(Optional)</span>
                    </label>
                    <textarea
                      className="flex min-h-[80px] w-full rounded-md border border-input bg-transparent px-3 py-2 text-base shadow-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 md:text-sm"
                      value={formData.notes}
                      onChange={(e) =>
                        setFormData({ ...formData, notes: e.target.value })
                      }
                    />
                    {errors.notes && (
                      <p className="text-sm text-destructive mt-1">
                        {errors.notes}
                      </p>
                    )}
                  </div>
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
                    <Button
                      type="button"
                      variant="outline"
                      onClick={handleCancel}
                    >
                      {t.manage.cancel}
                    </Button>
                  )}
                </div>
              </form>
            )}
          </>
        )}
      </div>
    </div>
  );
}
