import { Translations } from "./types";

export const fr: Translations = {
  pageTitle: "Répertoire des Camps de Montréal",
  pageDescription:
    "Trouvez des camps d'été et de vacances dans le Grand Montréal avec des options d'aide financière",

  appName: "Camps de Montréal",
  tagline: "Trouvez le camp parfait pour votre famille",
  languageSwitcher: "Langue",
  themeSwitcher: {
    label: "Thème",
    light: "Clair",
    dark: "Sombre",
    system: "Système",
  },

  campTypes: {
    day: "Camps de jour",
    vacation: "Camps de vacances",
  },

  views: {
    list: "Vue liste",
    map: "Vue carte",
    search: "Recherche",
  },

  filters: {
    title: "Filtres",
    clearAll: "Tout effacer",
    borough: "Arrondissement",
    ageRange: "Tranche d'âge",
    cost: "Coût",
    financialAid: "Aide financière disponible",
    languages: "Langues",
    apply: "Appliquer les filtres",
    reset: "Réinitialiser",
  },

  campFields: {
    name: "Nom",
    ageRange: "Tranche d'âge",
    languages: "Langues",
    dates: "Dates",
    hours: "Heures",
    allDay: "Toute la journée",
    cost: "Coût",
    financialAid: "Aide financière",
    link: "Site web",
    phone: "Téléphone",
    email: "Courriel",
    address: "Adresse",
    notes: "Remarques",
  },

  actions: {
    viewDetails: "Voir les détails",
    call: "Appeler",
    visitWebsite: "Visiter le site web",
    getDirections: "Obtenir l'itinéraire",
    close: "Fermer",
  },

  search: {
    placeholder: "Rechercher des camps par nom, arrondissement ou activité...",
    regionPrompt: "Rechercher des camps ou des régions à Montréal",
    noResults: "Aucun camp trouvé correspondant à vos critères",
    searching: "Recherche en cours...",
    regions: "Régions",
    camps: "Camps",
    selectLocation: "Sélectionnez un emplacement ou un camp pour commencer",
    searchInstruction: "Commencez par rechercher un camp ou une région",
    regionLabel: "Région: ",
    newSearch: "Nouvelle recherche",
  },

  sorting: {
    label: "Trier par",
    alphabetical: "Alphabétique",
    costLowToHigh: "Coût: Bas à élevé",
    costHighToLow: "Coût: Élevé à bas",
    borough: "Arrondissement",
  },

  results: {
    showing: "Affichage de",
    camps: "camps",
    of: "sur",
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
    available: "Aide financière disponible",
    notAvailable: "Pas d'aide financière",
    contactForInfo: "Contactez pour plus d'informations",
  },

  languageNames: {
    french: "Français",
    english: "Anglais",
    spanish: "Espagnol",
    italian: "Italien",
    arabic: "Arabe",
  },

  costUnits: {
    week: "semaine",
    day: "jour",
    month: "mois",
  },

  months: [
    "janvier",
    "février",
    "mars",
    "avril",
    "mai",
    "juin",
    "juillet",
    "août",
    "septembre",
    "octobre",
    "novembre",
    "décembre",
  ],

  footer: {
    madeWithLove: "Fait avec ❤️ par Andrei Khramtsov",
    sourceCode: "Code source disponible sur GitHub",
  },

  sampleDataNotice: "Données d'exemple à titre de démonstration seulement",

  loading: {
    camps: "Chargement des camps...",
  },

  error: {
    loadCamps: "Erreur lors du chargement des camps",
  },

  regions: {
    pageTitle: "Régions",
    notFound: "Région introuvable",
  },

  camps: {
    notFound: "Camp introuvable",
  },

  manage: {
    pageTitle: "Gérer les camps",
    button: "Gérer",
    selectCamp: "Sélectionnez un camp à modifier",
    createNew: "Créer un nouveau camp",
    save: "Enregistrer",
    delete: "Supprimer",
    cancel: "Annuler",
    coordinates: {
      latitude: "Latitude",
      longitude: "Longitude",
    },
    validation: {
      required: "Ce champ est obligatoire",
      invalidUrl: "Doit être une URL valide",
      invalidCoordinates: "Coordonnées invalides",
    },
    success: {
      saved: "Camp enregistré avec succès",
      deleted: "Camp supprimé avec succès",
    },
    error: {
      saveFailed: "Échec de l'enregistrement du camp",
      deleteFailed: "Échec de la suppression du camp",
      loadFailed: "Échec du chargement des camps",
    },
  },

  auth: {
    title: "Accès administrateur requis",
    prompt: "Veuillez entrer le mot secret d'administrateur pour continuer :",
    placeholder: "Entrez le mot secret",
    submit: "Soumettre",
    error: {
      invalid: "Mot secret invalide. Veuillez réessayer.",
      required: "Le mot secret est obligatoire",
      serverError: "Erreur du serveur. Veuillez réessayer plus tard.",
    },
  },

  export: {
    tooltip: "Exporter tous les camps vers Excel",
    fileName: "camps_montreal",
    sheetName: "Camps",
    columns: {
      name: "Nom",
      type: "Type",
      borough: "Arrondissement",
      ageRange: "Tranche d'âge",
      languages: "Langues",
      dates: "Dates",
      hours: "Heures",
      cost: "Coût",
      financialAid: "Aide financière",
      link: "Site web",
      phone: "Téléphone",
      email: "Courriel",
      address: "Adresse",
      notes: "Remarques",
    },
  },
};
