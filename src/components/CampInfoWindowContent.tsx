"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
    formatAgeRange,
    formatLanguage,
    formatPhone,
} from "@/localization/formatters";
import { useTranslation } from "@/localization/useTranslation";
import { Camp } from "@/types/camp";
import {
    ExternalLink,
    FileText,
    Globe,
    MapPin,
    Navigation,
    Phone,
    Users,
} from "lucide-react";

type CampInfoWindowContentProps = {
  camp: Camp;
};

export function CampInfoWindowContent({ camp }: CampInfoWindowContentProps) {
  const { t, language } = useTranslation();

  const handleCall = () => {
    const phoneNumber =
      typeof camp.phone === "string" ? camp.phone : camp.phone.number;
    window.location.href = `tel:${phoneNumber}`;
  };

  const handleWebsite = () => {
    window.open(camp.link, "_blank");
  };

  const handleDirections = () => {
    // Use address if available, otherwise fall back to camp name and borough
    const location =
      camp.address ||
      (camp.borough
        ? `${camp.name}, ${camp.borough}, Montreal`
        : `${camp.name}, Montreal`);
    const query = encodeURIComponent(location);
    window.open(
      `https://www.google.com/maps/search/?api=1&query=${query}`,
      "_blank"
    );
  };

  return (
    <div className="w-80 max-w-sm p-4 space-y-3">
      {/* Header */}
      <div>
        <h3 className="text-lg font-bold mb-1">{camp.name}</h3>
        {camp.borough && (
          <div className="flex items-center text-sm font-medium text-muted-foreground gap-1.5">
            <MapPin className="h-4 w-4 text-primary" />
            <span>{camp.borough}</span>
          </div>
        )}
      </div>

      {/* Details */}
      <div className="space-y-2 text-sm">
        <div className="flex items-center gap-2.5">
          <Users className="h-4 w-4 text-primary/70" />
          <span className="font-medium">
            {formatAgeRange(camp.ageRange, language)}
          </span>
        </div>
        <div className="bg-primary/5 -mx-4 px-4 py-2">
          <div className="text-xs text-muted-foreground">
            <span className="font-medium">{t.campFields.financialAid}:</span>{" "}
            {camp.financialAid}
          </div>
        </div>
        <div className="flex items-start gap-2.5">
          <Globe className="h-4 w-4 text-primary/70 mt-0.5" />
          <div className="flex flex-wrap gap-1.5">
            {camp.languages.map((lang) => (
              <Badge
                key={lang}
                variant="outline"
                className="text-xs border-primary/20"
              >
                {formatLanguage(lang, t)}
              </Badge>
            ))}
          </div>
        </div>
      </div>

      {/* Contact Info */}
      <div className="pt-2 space-y-2 text-sm">
        <div className="flex items-center gap-2.5">
          <Phone className="h-4 w-4 text-primary/70" />
          <span className="font-medium">{formatPhone(camp.phone)}</span>
        </div>

        <div className="flex items-center gap-2.5">
          <ExternalLink className="h-4 w-4 text-primary/70" />
          <a
            href={camp.link}
            target="_blank"
            rel="noopener noreferrer"
            className="font-medium text-primary hover:underline truncate cursor-pointer"
          >
            {(camp.link || "").replace(/^https?:\/\//, "")}
          </a>
        </div>

        {camp.notes && (
          <div className="flex items-start gap-2.5 pt-1">
            <FileText className="h-4 w-4 text-primary/70 mt-0.5 shrink-0" />
            <p className="text-xs text-muted-foreground italic">{camp.notes}</p>
          </div>
        )}
      </div>

      {/* Action Buttons */}
      <div className="flex flex-wrap gap-2 pt-2">
        <Button
          onClick={handleCall}
          variant="outline"
          size="sm"
          className="gap-2 flex-1 cursor-pointer"
        >
          <Phone className="h-3 w-3" />
          {t.actions.call}
        </Button>
        <Button
          onClick={handleWebsite}
          variant="outline"
          size="sm"
          className="gap-2 flex-1 cursor-pointer"
        >
          <ExternalLink className="h-3 w-3" />
          {t.actions.visitWebsite}
        </Button>
        <Button
          onClick={handleDirections}
          variant="outline"
          size="sm"
          className="gap-2 flex-1 cursor-pointer"
        >
          <Navigation className="h-3 w-3" />
          {t.actions.getDirections}
        </Button>
      </div>
    </div>
  );
}
