"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useTranslation } from "@/localization/useTranslation";
import { Camp } from "@/types/camp";
import {
  Calendar,
  Clock,
  DollarSign,
  Globe,
  MapPin,
  Users,
} from "lucide-react";

type CampCardProps = {
  camp: Camp;
  onViewDetails: (camp: Camp) => void;
};

export function CampCard({ camp, onViewDetails }: CampCardProps) {
  const { t } = useTranslation();

  const hasFinancialAid =
    camp.financialAid.toLowerCase().includes("available") ||
    camp.financialAid.toLowerCase().includes("disponible");

  return (
    <Card className="h-full flex flex-col hover:shadow-xl transition-all duration-300 hover:-translate-y-1 border-2 hover:border-primary/20 overflow-hidden group">
      <CardHeader className="pb-3">
        <div className="flex justify-between items-start gap-2 mb-2">
          <CardTitle className="text-xl font-bold group-hover:text-primary transition-colors">
            {camp.name}
          </CardTitle>
          <Badge
            variant={camp.type === "day" ? "default" : "secondary"}
            className="shrink-0 text-xs px-3 py-1"
          >
            {camp.type === "day" ? t.campTypes.day : t.campTypes.vacation}
          </Badge>
        </div>
        <div className="flex items-center text-sm font-medium text-muted-foreground gap-1.5">
          <MapPin className="h-4 w-4 text-primary" />
          <span>{camp.borough}</span>
        </div>
      </CardHeader>
      <CardContent className="flex-1 space-y-3 pb-4">
        <div className="flex items-center gap-2.5 text-sm">
          <Users className="h-4 w-4 text-primary/70" />
          <span className="font-medium">{camp.ageRange}</span>
        </div>
        <div className="flex items-center gap-2.5 text-sm">
          <Calendar className="h-4 w-4 text-primary/70" />
          <span className="line-clamp-1">{camp.dates}</span>
        </div>
        {camp.hours && (
          <div className="flex items-center gap-2.5 text-sm">
            <Clock className="h-4 w-4 text-primary/70" />
            <span>{camp.hours}</span>
          </div>
        )}
        <div className="flex items-center gap-2.5 text-sm bg-primary/5 -mx-6 px-6 py-2">
          <DollarSign className="h-5 w-5 text-primary" />
          <span className="font-bold text-base text-primary">{camp.cost}</span>
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
                {lang}
              </Badge>
            ))}
          </div>
        </div>
        {hasFinancialAid && (
          <Badge
            variant="default"
            className="bg-success hover:bg-success/90 text-xs px-3 py-1"
          >
            ✓ {t.financialAidLabels.available}
          </Badge>
        )}
      </CardContent>
      <CardFooter className="pt-0">
        <Button
          onClick={() => onViewDetails(camp)}
          className="w-full group-hover:bg-primary group-hover:shadow-md transition-all"
          size="lg"
        >
          {t.actions.viewDetails}
        </Button>
      </CardFooter>
    </Card>
  );
}
