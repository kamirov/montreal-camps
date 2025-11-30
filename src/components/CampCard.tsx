"use client";

import { CampSingleLocationMap } from "@/components/CampSingleLocationMap";
import { GoogleMapEmbed } from "@/components/GoogleMapEmbed";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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
import { useEffect, useState } from "react";

type CampCardProps = {
  camp: Camp;
  showMap?: boolean;
};

export function CampCard({ camp, showMap = true }: CampCardProps) {
  const { t, language } = useTranslation();
  const [isLargeScreen, setIsLargeScreen] = useState(false);

  useEffect(() => {
    // Tailwind's lg breakpoint is 1024px
    const mediaQuery = window.matchMedia("(min-width: 1024px)");
    setIsLargeScreen(mediaQuery.matches);

    const handleChange = (e: MediaQueryListEvent) => {
      setIsLargeScreen(e.matches);
    };

    mediaQuery.addEventListener("change", handleChange);
    return () => mediaQuery.removeEventListener("change", handleChange);
  }, []);

  const mapHeight = isLargeScreen ? "400px" : "200px";

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
    <Card className="h-full flex flex-col hover:shadow-xl transition-all duration-300 border-2 hover:border-primary/50 overflow-hidden group">
      <CardHeader className="pb-3">
        <div className="flex justify-between items-start gap-2 mb-2">
          <CardTitle className="text-xl font-bold">{camp.name}</CardTitle>
        </div>
        {camp.borough && (
          <div className="flex items-center text-sm font-medium text-muted-foreground gap-1.5">
            <MapPin className="h-4 w-4 text-primary" />
            <span>{camp.borough}</span>
          </div>
        )}
      </CardHeader>
      <CardContent className="flex-1 space-y-3 pb-4">
        <div className="flex items-center gap-2.5 text-sm">
          <Users className="h-4 w-4 text-primary/70" />
          <span className="font-medium">
            {formatAgeRange(camp.ageRange, language)}
          </span>
        </div>
        {/* <div className="flex items-center gap-2.5 text-sm">
          <Calendar className="h-4 w-4 text-primary/70" />
          <span className="line-clamp-1">
            {formatDateRange(camp.dates, language, t)}
          </span>
        </div> */}
        {/* <div className="bg-primary/5 -mx-6 px-6 py-2 space-y-1">
          <div className="text-xs text-muted-foreground">
            <span className="font-medium">{t.campFields.financialAid}:</span>{" "}
            {camp.financialAid}
          </div>
        </div> */}
        <div className="flex items-start gap-2.5 text-sm pt-1">
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

        <div className="mt-4 pt-3 space-y-3">
          {camp.phone && (
            <div className="flex items-center gap-2.5 text-sm">
              <Phone className="h-4 w-4 text-primary/70" />
              <span className="font-medium">{formatPhone(camp.phone)}</span>
            </div>
          )}

          {camp.link && (
            <div className="flex items-center gap-2.5 text-sm">
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

          {camp.address && (
            <div className="flex items-start gap-2.5 text-sm pt-2">
              <MapPin className="h-4 w-4 text-primary/70 mt-0.5 shrink-0" />
              <div className="flex-1">
                <a
                  href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
                    camp.address
                  )}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-medium text-primary hover:underline text-xs"
                >
                  {camp.address}
                </a>
              </div>
            </div>
          )}

          {showMap && camp.latitude != null && camp.longitude != null && (
            <div className="pt-2">
              <CampSingleLocationMap
                camp={camp}
                height={mapHeight}
                className="mt-2"
              />
            </div>
          )}
          {showMap &&
            camp.latitude == null &&
            camp.longitude == null &&
            camp.address && (
              <div className="pt-2">
                <GoogleMapEmbed
                  address={camp.address}
                  height={mapHeight}
                  className="mt-2"
                />
              </div>
            )}

          {camp.notes && (
            <div className="flex items-start gap-2.5 text-sm pt-2">
              <FileText className="h-4 w-4 text-primary/70 mt-0.5 shrink-0" />
              <p className="text-xs text-muted-foreground italic">
                {camp.notes}
              </p>
            </div>
          )}
        </div>

        <div className="flex flex-wrap gap-2 pt-3">
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
      </CardContent>
    </Card>
  );
}
