export type Language = "en" | "fr";

export type Translations = {
  // Page metadata
  pageTitle: string;
  pageDescription: string;

  // Header
  appName: string;
  tagline: string;
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
    searchInstruction: string;
    regionLabel: string;
    newSearch: string;
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
    campSingular: string;
    campPlural: string;
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

  // Footer
  footer: {
    madeWithLove: string;
    sourceCode: string;
  };

  // Sample data notice
  sampleDataNotice: string;

  // Loading states
  loading: {
    camps: string;
  };

  // Error states
  error: {
    loadCamps: string;
  };

  // Regions page
  regions: {
    pageTitle: string;
    notFound: string;
  };

  // Camps page
  camps: {
    notFound: string;
  };

  // Admin/Manage page
  manage: {
    pageTitle: string;
    button: string;
    selectCamp: string;
    createNew: string;
    save: string;
    delete: string;
    cancel: string;
    coordinates: {
      latitude: string;
      longitude: string;
    };
    validation: {
      required: string;
      invalidUrl: string;
      invalidCoordinates: string;
    };
    success: {
      saved: string;
      deleted: string;
    };
    error: {
      saveFailed: string;
      deleteFailed: string;
      loadFailed: string;
    };
  };

  // Authentication
  auth: {
    title: string;
    prompt: string;
    placeholder: string;
    submit: string;
    error: {
      invalid: string;
      required: string;
      serverError: string;
    };
  };

  // Export functionality
  export: {
    tooltip: string;
    fileName: string;
    sheetName: string;
    columns: {
      name: string;
      type: string;
      borough: string;
      ageRange: string;
      languages: string;
      dates: string;
      hours: string;
      cost: string;
      financialAid: string;
      link: string;
      phone: string;
      notes: string;
    };
  };
};
