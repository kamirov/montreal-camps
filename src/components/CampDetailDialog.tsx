"use client";

import { CampLocationMap } from "@/components/CampLocationMap";
import { GoogleMapEmbed } from "@/components/GoogleMapEmbed";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Separator } from "@/components/ui/separator";
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
  Globe,
  Mail,
  MapPin,
  Navigation,
  Phone,
  Users,
} from "lucide-react";

type CampDetailDialogProps = {
  camp: Camp | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

export function CampDetailDialog({
  camp,
  open,
  onOpenChange,
}: CampDetailDialogProps) {
  const { t, language } = useTranslation();

  if (!camp) return null;

  const hasFinancialAid =
    camp.financialAid.toLowerCase().includes("available") ||
    camp.financialAid.toLowerCase().includes("disponible");

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

  const handleEmail = () => {
    if (camp.email) {
      window.location.href = `mailto:${camp.email}`;
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-start justify-between gap-4">
            <DialogTitle className="text-2xl">{camp.name}</DialogTitle>
            <Badge variant={camp.type === "day" ? "default" : "secondary"}>
              {camp.type === "day" ? t.campTypes.day : t.campTypes.vacation}
            </Badge>
          </div>
          {camp.borough && (
            <DialogDescription className="flex items-center gap-2">
              <MapPin className="h-4 w-4" />
              <span>{camp.borough}</span>
            </DialogDescription>
          )}
        </DialogHeader>

        <div className="space-y-4 py-4">
          <div className="grid gap-4">
            <div className="flex items-start gap-3">
              <Users className="h-5 w-5 text-muted-foreground mt-0.5" />
              <div>
                <div className="font-medium">{t.campFields.ageRange}</div>
                <div className="text-sm text-muted-foreground">
                  {formatAgeRange(camp.ageRange, language)}
                </div>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <Globe className="h-5 w-5 text-muted-foreground mt-0.5" />
              <div>
                <div className="font-medium">{t.campFields.languages}</div>
                <div className="flex flex-wrap gap-1 mt-1">
                  {camp.languages.map((lang) => (
                    <Badge key={lang} variant="outline">
                      {formatLanguage(lang, t)}
                    </Badge>
                  ))}
                </div>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <Calendar className="h-5 w-5 text-muted-foreground mt-0.5" />
              <div>
                <div className="font-medium">{t.campFields.dates}</div>
                <div className="text-sm text-muted-foreground">
                  {formatDateRange(camp.dates, language, t)}
                </div>
              </div>
            </div>

            {camp.hours && (
              <div className="flex items-start gap-3">
                <Clock className="h-5 w-5 text-muted-foreground mt-0.5" />
                <div>
                  <div className="font-medium">{t.campFields.hours}</div>
                  <div className="text-sm text-muted-foreground">
                    {formatTime(camp.hours, language)}
                  </div>
                </div>
              </div>
            )}

            <div className="flex items-start gap-3">
              <DollarSign className="h-5 w-5 text-muted-foreground mt-0.5" />
              <div>
                <div className="font-medium">{t.campFields.cost}</div>
                <div className="text-sm text-muted-foreground">
                  {formatCost(camp.cost, language, t)}
                </div>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="h-5 w-5 flex items-center justify-center text-muted-foreground mt-0.5">
                💰
              </div>
              <div>
                <div className="font-medium">{t.campFields.financialAid}</div>
                <div className="text-sm text-muted-foreground">
                  {camp.financialAid}
                </div>
                {hasFinancialAid && (
                  <Badge
                    variant="default"
                    className="bg-success hover:bg-success/90 mt-1"
                  >
                    {t.financialAidLabels.available}
                  </Badge>
                )}
              </div>
            </div>

            <div className="flex items-start gap-3">
              <Phone className="h-5 w-5 text-muted-foreground mt-0.5" />
              <div>
                <div className="font-medium">{t.campFields.phone}</div>
                <div className="text-sm text-muted-foreground">
                  {formatPhone(camp.phone)}
                </div>
              </div>
            </div>

            {camp.email && (
              <div className="flex items-start gap-3">
                <Mail className="h-5 w-5 text-muted-foreground mt-0.5" />
                <div>
                  <div className="font-medium">{t.campFields.email}</div>
                  <a
                    href={`mailto:${camp.email}`}
                    onClick={handleEmail}
                    className="text-sm text-primary hover:underline"
                  >
                    {camp.email}
                  </a>
                </div>
              </div>
            )}

            {camp.address && (
              <div className="flex items-start gap-3">
                <MapPin className="h-5 w-5 text-muted-foreground mt-0.5" />
                <div className="flex-1">
                  <div className="font-medium">{t.campFields.address}</div>
                  <a
                    href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
                      camp.address
                    )}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm text-primary hover:underline"
                  >
                    {camp.address}
                  </a>
                </div>
              </div>
            )}
          </div>

          {camp.address && (
            <>
              <Separator />
              <div>
                <div className="font-medium mb-2">{t.campFields.address}</div>
                {camp.latitude != null && camp.longitude != null ? (
                  <CampLocationMap
                    latitude={camp.latitude}
                    longitude={camp.longitude}
                    address={camp.address}
                    height="300px"
                    className="mt-2"
                  />
                ) : (
                  <GoogleMapEmbed
                    address={camp.address}
                    height="300px"
                    className="mt-2"
                  />
                )}
              </div>
            </>
          )}

          {camp.notes && (
            <>
              <Separator />
              <div>
                <div className="font-medium mb-2">{t.campFields.notes}</div>
                <p className="text-sm text-muted-foreground">{camp.notes}</p>
              </div>
            </>
          )}

          <Separator />

          <div className="flex flex-wrap gap-2">
            <Button onClick={handleCall} variant="outline" className="gap-2">
              <Phone className="h-4 w-4" />
              {t.actions.call}
            </Button>
            <Button onClick={handleWebsite} variant="outline" className="gap-2">
              <ExternalLink className="h-4 w-4" />
              {t.actions.visitWebsite}
            </Button>
            <Button
              onClick={handleDirections}
              variant="outline"
              className="gap-2"
            >
              <Navigation className="h-4 w-4" />
              {t.actions.getDirections}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
