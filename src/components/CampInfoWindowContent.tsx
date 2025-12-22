"use client";

import { Button } from "@/components/ui/button";
import {
  formatAgeRange,
  formatPhone,
} from "@/localization/formatters";
import { useTranslation } from "@/localization/useTranslation";
import { Camp } from "@/types/camp";
import {
  ArrowLeft,
  ExternalLink,
  MapPin,
  Navigation,
  Phone,
  Users,
} from "lucide-react";

type CampInfoWindowContentProps = {
  camp: Camp;
  onViewOtherCamps?: () => void;
  showViewOtherCampsButton?: boolean;
};

export function CampInfoWindowContent({
  camp,
  onViewOtherCamps,
  showViewOtherCampsButton = false,
}: CampInfoWindowContentProps) {
  const { t, language } = useTranslation();

  const handleCall = () => {
    if (!camp.phone) return;
    const phoneNumber =
      typeof camp.phone === "string" ? camp.phone : camp.phone.number;
    if (phoneNumber) {
      window.location.href = `tel:${phoneNumber}`;
    }
  };

  const handleWebsite = () => {
    if (camp.link) {
      window.open(camp.link, "_blank");
    }
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
    <div className="w-80 max-w-sm px-4 pt-2 pb-4 space-y-3">
      {/* Back button */}
      {showViewOtherCampsButton && onViewOtherCamps && (
        <Button
          onClick={onViewOtherCamps}
          variant="ghost"
          size="sm"
          className="gap-2 -ml-2 -mt-1 mb-1 cursor-pointer"
        >
          <ArrowLeft className="h-4 w-4" />
          {t.actions.back}
        </Button>
      )}

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
      </div>

      {/* Contact Info */}
      <div className="pt-2 space-y-2 text-sm">
        {camp.phone && (
          <div className="flex items-center gap-2.5">
            <Phone className="h-4 w-4 text-primary/70" />
            <span className="font-medium">{formatPhone(camp.phone)}</span>
          </div>
        )}

        {camp.link && (
          <div className="flex items-center gap-2.5">
            <ExternalLink className="h-4 w-4 text-primary/70" />
            <a
              href={camp.link}
              target="_blank"
              rel="noopener noreferrer"
              className="font-medium text-primary hover:underline truncate cursor-pointer"
            >
              {camp.link.replace(/^https?:\/\//, "")}
            </a>
          </div>
        )}
      </div>

      {/* Action Buttons */}
      <div className="flex flex-wrap gap-2 pt-2">
        {camp.phone && (
          <Button
            onClick={handleCall}
            variant="outline"
            size="sm"
            className="gap-2 flex-1 cursor-pointer"
          >
            <Phone className="h-3 w-3" />
            {t.actions.call}
          </Button>
        )}
        {camp.link && (
          <Button
            onClick={handleWebsite}
            variant="outline"
            size="sm"
            className="gap-2 flex-1 cursor-pointer"
          >
            <ExternalLink className="h-3 w-3" />
            {t.actions.visitWebsite}
          </Button>
        )}
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
