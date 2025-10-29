"use client";

import { Button } from "@/components/ui/button";
import { LanguageSwitcher } from "@/components/LanguageSwitcher";
import { ThemeSwitcher } from "@/components/ThemeSwitcher";
import { useTranslation } from "@/localization/useTranslation";
import { ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";

type HeaderProps = {
  showManageButton?: boolean;
  showBackButton?: boolean;
  onTitleClick?: () => void;
};

export function Header({
  showManageButton = false,
  showBackButton = false,
  onTitleClick,
}: HeaderProps) {
  const { t } = useTranslation();
  const router = useRouter();

  const handleTitleClick = () => {
    if (onTitleClick) {
      onTitleClick();
    } else {
      router.push("/");
    }
  };

  return (
    <header className="bg-header backdrop-blur-sm sticky top-0 z-50 shadow-lg">
      <div className="container mx-auto px-4 py-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            {showBackButton && (
              <Button
                variant="ghost"
                size="icon"
                onClick={() => router.push("/")}
                className="hover:bg-accent"
              >
                <ArrowLeft className="h-5 w-5" />
              </Button>
            )}
            <h1
              onClick={handleTitleClick}
              className="text-3xl font-bold text-primary cursor-pointer transition-all duration-200 hover:scale-105 hover:text-primary/90 active:scale-95 select-none"
            >
              {t.appName}
            </h1>
          </div>
          <div className="flex items-center gap-2">
            {showManageButton && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => router.push("/manage")}
              >
                {t.manage?.button || "Manage"}
              </Button>
            )}
            <ThemeSwitcher />
            <LanguageSwitcher />
          </div>
        </div>
      </div>
    </header>
  );
}

