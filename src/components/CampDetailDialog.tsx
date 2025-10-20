"use client";

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
import { useTranslation } from "@/localization/useTranslation";
import { Camp } from "@/types/camp";
import {
  Calendar,
  Clock,
  DollarSign,
  ExternalLink,
  Globe,
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
  const { t } = useTranslation();

  if (!camp) return null;

  const hasFinancialAid =
    camp.financialAid.toLowerCase().includes("available") ||
    camp.financialAid.toLowerCase().includes("disponible");

  const handleCall = () => {
    window.location.href = `tel:${camp.phone}`;
  };

  const handleWebsite = () => {
    window.open(camp.link, "_blank");
  };

  const handleDirections = () => {
    const [lat, lng] = camp.coordinates;
    window.open(
      `https://www.google.com/maps/dir/?api=1&destination=${lat},${lng}`,
      "_blank"
    );
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
          <DialogDescription className="flex items-center gap-2">
            <MapPin className="h-4 w-4" />
            <span>{camp.borough}</span>
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <div className="grid gap-4">
            <div className="flex items-start gap-3">
              <Users className="h-5 w-5 text-muted-foreground mt-0.5" />
              <div>
                <div className="font-medium">{t.campFields.ageRange}</div>
                <div className="text-sm text-muted-foreground">
                  {camp.ageRange}
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
                      {lang}
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
                  {camp.dates}
                </div>
              </div>
            </div>

            {camp.hours && (
              <div className="flex items-start gap-3">
                <Clock className="h-5 w-5 text-muted-foreground mt-0.5" />
                <div>
                  <div className="font-medium">{t.campFields.hours}</div>
                  <div className="text-sm text-muted-foreground">
                    {camp.hours}
                  </div>
                </div>
              </div>
            )}

            <div className="flex items-start gap-3">
              <DollarSign className="h-5 w-5 text-muted-foreground mt-0.5" />
              <div>
                <div className="font-medium">{t.campFields.cost}</div>
                <div className="text-sm text-muted-foreground">{camp.cost}</div>
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
                  {camp.phone}
                </div>
              </div>
            </div>
          </div>

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
