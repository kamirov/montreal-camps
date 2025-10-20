"use client";

import { useTranslation } from "@/localization/useTranslation";
import { Github } from "lucide-react";

export function Footer() {
  const { t } = useTranslation();

  return (
    <footer className="border-t bg-background py-6 mt-12">
      <div className="container mx-auto px-4">
        <div className="flex flex-col items-center gap-2 text-sm text-muted-foreground">
          <p>{t.footer.madeWithLove}</p>
          <a
            href="https://github.com/kamirov/montreal-camps"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 hover:text-foreground transition-colors"
          >
            <Github className="h-4 w-4" />
            {t.footer.sourceCode}
          </a>
        </div>
      </div>
    </footer>
  );
}
