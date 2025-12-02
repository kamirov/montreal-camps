"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useTranslation } from "@/localization/useTranslation";
import { Camp } from "@/types/camp";

type CampSelectionDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  camps: Camp[];
  onSelectCamp: (camp: Camp) => void;
};

export function CampSelectionDialog({
  open,
  onOpenChange,
  camps,
  onSelectCamp,
}: CampSelectionDialogProps) {
  const { t } = useTranslation();

  const handleSelectCamp = (camp: Camp) => {
    onSelectCamp(camp);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{t.campSelection.title}</DialogTitle>
          <DialogDescription>{t.campSelection.description}</DialogDescription>
        </DialogHeader>
        <div className="space-y-2 max-h-[400px] overflow-y-auto">
          {camps.map((camp) => (
            <Button
              key={camp.name}
              variant="outline"
              className="w-full justify-start text-left h-auto py-3 px-4"
              onClick={() => handleSelectCamp(camp)}
            >
              <div className="flex flex-col items-start gap-1">
                <span className="font-semibold">{camp.name}</span>
                {camp.borough && (
                  <span className="text-xs text-muted-foreground">
                    {camp.borough}
                  </span>
                )}
              </div>
            </Button>
          ))}
        </div>
      </DialogContent>
    </Dialog>
  );
}
