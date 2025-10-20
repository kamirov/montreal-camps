import { useLocalization } from "./context";

export function useTranslation() {
  const { t, language } = useLocalization();
  return { t, language };
}
