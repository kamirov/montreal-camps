"use client";

import { useTranslation } from "@/localization/useTranslation";
import { Github } from "lucide-react";

export function Footer() {
  const { t } = useTranslation();

  return (
    <footer className="border-t bg-background py-4 mt-12">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-center gap-3 text-xs text-muted-foreground">
          <p>{t.footer.madeWithLove}</p>
          <span>•</span>
          <a
            href="https://github.com/kamirov/montreal-camps"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-foreground transition-colors"
            aria-label={t.footer.sourceCode}
          >
            <Github className="h-4 w-4" />
          </a>
        </div>
      </div>
    </footer>
  );
}
