import { Translations } from "./types";

export const en: Translations = {
  pageTitle: "Montreal Camps Directory",
  pageDescription:
    "Find summer and vacation camps in Greater Montreal with financial assistance options",

  appName: "Montreal Camps",
  tagline: "Find the perfect camp for your family",
  languageSwitcher: "Language",
  themeSwitcher: {
    label: "Theme",
    light: "Light",
    dark: "Dark",
    system: "System",
  },

  campTypes: {
    day: "Day Camps",
    vacation: "Vacation Camps",
  },

  views: {
    list: "List View",
    map: "Map View",
    search: "Search",
  },

  filters: {
    title: "Filters",
    clearAll: "Clear All",
    borough: "Borough",
    ageRange: "Age Range",
    cost: "Cost",
    financialAid: "Financial Aid Available",
    languages: "Languages",
    apply: "Apply Filters",
    reset: "Reset",
  },

  campFields: {
    name: "Name",
    ageRange: "Age Range",
    languages: "Languages",
    dates: "Dates",
    hours: "Hours",
    allDay: "All day",
    cost: "Cost",
    financialAid: "Financial Aid",
    link: "Website",
    phone: "Phone",
    email: "Email",
    address: "Address",
    notes: "Notes",
  },

  actions: {
    viewDetails: "View Details",
    call: "Call",
    visitWebsite: "Visit Website",
    getDirections: "Get Directions",
    close: "Close",
  },

  search: {
    placeholder: "Search camps by name, borough, or activity...",
    regionPrompt: "Search camps or regions in Montreal",
    noResults: "No camps found matching your criteria",
    searching: "Searching...",
    regions: "Regions",
    camps: "Camps",
    selectLocation: "Select a location or camp to begin",
    searchInstruction: "Start by searching for a camp or region",
    regionLabel: "Region: ",
    newSearch: "New search",
  },

  sorting: {
    label: "Sort by",
    alphabetical: "Alphabetical",
    costLowToHigh: "Cost: Low to High",
    costHighToLow: "Cost: High to Low",
    borough: "Borough",
  },

  results: {
    showing: "Showing",
    camps: "camps",
    of: "of",
    campSingular: "camp",
    campPlural: "camps",
  },

  boroughs: {
    ahuntsic: "Ahuntsic-Cartierville",
    anjou: "Anjou",
    cdnNdg: "Côte-des-Neiges–Notre-Dame-de-Grâce",
    lasalle: "LaSalle",
    lachine: "Lachine",
    outremont: "Outremont",
    pierrefonds: "Pierrefonds-Roxboro",
    plateau: "Le Plateau-Mont-Royal",
    rivierePrairies: "Rivière-des-Prairies–Pointe-aux-Trembles",
    rosemont: "Rosemont–La Petite-Patrie",
    stLaurent: "Saint-Laurent",
    stLeonard: "Saint-Léonard",
    sudOuest: "Le Sud-Ouest",
    verdun: "Verdun",
    villeray: "Villeray–Saint-Michel–Parc-Extension",
    villeMarie: "Ville-Marie",
  },

  financialAidLabels: {
    available: "Financial aid available",
    notAvailable: "No financial aid",
    contactForInfo: "Contact for information",
  },

  languageNames: {
    french: "French",
    english: "English",
    spanish: "Spanish",
    italian: "Italian",
    arabic: "Arabic",
  },

  costUnits: {
    week: "week",
    day: "day",
    month: "month",
  },

  months: [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ],

  footer: {
    madeWithLove: "Made with ❤️ by Andrei Khramtsov",
    sourceCode: "Source code available on GitHub",
  },

  sampleDataNotice: "Sample data for demonstration purposes only",

  loading: {
    camps: "Loading camps...",
  },

  error: {
    loadCamps: "Error loading camps",
  },

  regions: {
    pageTitle: "Regions",
    notFound: "Region not found",
  },

  camps: {
    notFound: "Camp not found",
  },

  manage: {
    pageTitle: "Manage Camps",
    button: "Manage",
    selectCamp: "Select a camp to edit",
    createNew: "Create New Camp",
    save: "Save",
    delete: "Delete",
    cancel: "Cancel",
    coordinates: {
      latitude: "Latitude",
      longitude: "Longitude",
    },
    validation: {
      required: "This field is required",
      invalidUrl: "Must be a valid URL",
      invalidCoordinates: "Invalid coordinates",
    },
    success: {
      saved: "Camp saved successfully",
      deleted: "Camp deleted successfully",
    },
    error: {
      saveFailed: "Failed to save camp",
      deleteFailed: "Failed to delete camp",
      loadFailed: "Failed to load camps",
    },
  },

  auth: {
    title: "Admin Access Required",
    prompt: "Please enter the admin secret word to continue:",
    placeholder: "Enter secret word",
    submit: "Submit",
    error: {
      invalid: "Invalid secret word. Please try again.",
      required: "Secret word is required",
      serverError: "Server error. Please try again later.",
    },
  },

  export: {
    tooltip: "Export all camps to Excel",
    fileName: "montreal_camps",
    sheetName: "Camps",
    columns: {
      name: "Name",
      type: "Type",
      borough: "Borough",
      ageRange: "Age Range",
      languages: "Languages",
      dates: "Dates",
      hours: "Hours",
      cost: "Cost",
      financialAid: "Financial Aid",
      link: "Website",
      phone: "Phone",
      email: "Email",
      address: "Address",
      notes: "Notes",
    },
  },
};
