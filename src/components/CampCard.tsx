"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  formatAgeRange,
  formatCost,
  formatDateRange,
  formatLanguage,
  formatPhone,
  formatTime,
} from "@/localization/formatters";
import { useTranslation } from "@/localization/useTranslation";
import { Camp } from "@/types/camp";
import {
  Calendar,
  Clock,
  DollarSign,
  ExternalLink,
  FileText,
  Globe,
  MapPin,
  Navigation,
  Phone,
  Users,
} from "lucide-react";

type CampCardProps = {
  camp: Camp;
};

export function CampCard({ camp }: CampCardProps) {
  const { t, language } = useTranslation();

  const handleCall = () => {
    const phoneNumber = typeof camp.phone === "string" ? camp.phone : camp.phone.number;
    window.location.href = `tel:${phoneNumber}`;
  };

  const handleWebsite = () => {
    window.open(camp.link, "_blank");
  };

  const handleDirections = () => {
    // Search by camp name and borough since coordinates are no longer available
    const query = encodeURIComponent(`${camp.name}, ${camp.borough}, Montreal`);
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
        <div className="flex items-center text-sm font-medium text-muted-foreground gap-1.5">
          <MapPin className="h-4 w-4 text-primary" />
          <span>{camp.borough}</span>
        </div>
      </CardHeader>
      <CardContent className="flex-1 space-y-3 pb-4">
        <div className="flex items-center gap-2.5 text-sm">
          <Users className="h-4 w-4 text-primary/70" />
          <span className="font-medium">
            {formatAgeRange(camp.ageRange, language)}
          </span>
        </div>
        <div className="flex items-center gap-2.5 text-sm">
          <Calendar className="h-4 w-4 text-primary/70" />
          <span className="line-clamp-1">
            {formatDateRange(camp.dates, language, t)}
          </span>
        </div>
        <div className="flex items-center gap-2.5 text-sm">
          <Clock className="h-4 w-4 text-primary/70" />
          <span>
            {camp.hours
              ? formatTime(camp.hours, language)
              : camp.type === "day"
              ? t.campTypes.day
              : t.campTypes.vacation}
          </span>
        </div>
        <div className="bg-primary/5 -mx-6 px-6 py-2 space-y-1">
          <div className="flex items-center gap-2.5 text-sm">
            <DollarSign className="h-5 w-5 text-primary" />
            <span className="font-bold text-base text-primary">
              {formatCost(camp.cost, language, t)}
            </span>
          </div>
          <div className="text-xs text-muted-foreground pl-7">
            <span className="font-medium">{t.campFields.financialAid}:</span>{" "}
            {camp.financialAid}
          </div>
        </div>
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
          <div className="flex items-center gap-2.5 text-sm">
            <Phone className="h-4 w-4 text-primary/70" />
            <span className="font-medium">{formatPhone(camp.phone)}</span>
          </div>

          <div className="flex items-center gap-2.5 text-sm">
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
            <div className="flex items-start gap-2.5 text-sm pt-2">
              <FileText className="h-4 w-4 text-primary/70 mt-0.5 shrink-0" />
              <p className="text-xs text-muted-foreground italic">
                {camp.notes}
              </p>
            </div>
          )}
        </div>

        <div className="flex flex-wrap gap-2 pt-3">
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
      </CardContent>
    </Card>
  );
}
