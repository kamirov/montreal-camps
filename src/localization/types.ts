export type Language = "en" | "fr";

export type Translations = {
  // Page metadata
  pageTitle: string;
  pageDescription: string;

  // Header
  appName: string;
  languageSwitcher: string;
  themeSwitcher: {
    label: string;
    light: string;
    dark: string;
    system: string;
  };

  // Camp types
  campTypes: {
    day: string;
    vacation: string;
  };

  // View modes
  views: {
    list: string;
    map: string;
    search: string;
  };

  // Filter section
  filters: {
    title: string;
    clearAll: string;
    borough: string;
    ageRange: string;
    cost: string;
    financialAid: string;
    languages: string;
    apply: string;
    reset: string;
  };

  // Camp fields
  campFields: {
    name: string;
    ageRange: string;
    languages: string;
    dates: string;
    hours: string;
    allDay: string;
    cost: string;
    financialAid: string;
    link: string;
    phone: string;
    notes: string;
  };

  // Actions
  actions: {
    viewDetails: string;
    call: string;
    visitWebsite: string;
    getDirections: string;
    close: string;
  };

  // Search
  search: {
    placeholder: string;
    regionPrompt: string;
    noResults: string;
    searching: string;
    regions: string;
    camps: string;
    selectLocation: string;
  };

  // Sorting
  sorting: {
    label: string;
    alphabetical: string;
    costLowToHigh: string;
    costHighToLow: string;
    borough: string;
  };

  // Results
  results: {
    showing: string;
    camps: string;
    of: string;
  };

  // Boroughs (Montreal)
  boroughs: {
    ahuntsic: string;
    anjou: string;
    cdnNdg: string;
    lasalle: string;
    lachine: string;
    outremont: string;
    pierrefonds: string;
    plateau: string;
    rivierePrairies: string;
    rosemont: string;
    stLaurent: string;
    stLeonard: string;
    sudOuest: string;
    verdun: string;
    villeray: string;
    villeMarie: string;
  };

  // Financial aid
  financialAidLabels: {
    available: string;
    notAvailable: string;
    contactForInfo: string;
  };

  // Language names for translation
  languageNames: {
    french: string;
    english: string;
    spanish: string;
    italian: string;
    arabic: string;
  };

  // Cost units
  costUnits: {
    week: string;
    day: string;
    month: string;
  };

  // Month names for date formatting
  months: [
    string,
    string,
    string,
    string,
    string,
    string,
    string,
    string,
    string,
    string,
    string,
    string
  ];
};
