# Montreal Camps Directory / Répertoire des Camps de Montréal

A bilingual (English/French) web application to help families find summer and vacation camps in Greater Montreal, with special emphasis on options for families facing financial hardship.

## Features

### 🌍 Bilingual Support

- Full English and French translations
- Language switcher with persistent preference
- Default to French (Montreal's primary language)

### 🔍 Advanced Filtering

- **Camp Type**: Day camps vs. Vacation camps
- **Borough**: Filter by Montreal boroughs
- **Languages**: Filter by camp languages (English, French, Spanish, etc.)
- **Financial Aid**: Show only camps with financial assistance
- **Search**: Free text search across camp names, boroughs, and activities

### 📊 Multiple Views

- **List View**: Grid of camp cards with key information
- **Map View**: Interactive map showing camp locations
- **Responsive**: Mobile-first design with adaptive layouts

### 💡 Camp Information

Each camp listing includes:

- Name (Nom)
- Age Range (Tranche d'âge)
- Languages (Langues)
- Dates
- Hours (Heures) - for day camps only
- Cost (Coût)
- Financial Aid (Aide financière)
- Website Link (Lien)
- Phone (Tél)
- Notes (Remarques)

## Tech Stack

- **Framework**: Next.js 15 (React 19)
- **Styling**: TailwindCSS v4
- **UI Components**: ShadCN UI
- **Icons**: Lucide React
- **Maps**: React-Leaflet
- **Testing**: Vitest + React Testing Library
- **Type Safety**: TypeScript
- **Package Manager**: pnpm

## Getting Started

### Prerequisites

- Node.js 20+
- pnpm

### Installation

```bash
# Install dependencies
pnpm install

# Run development server
pnpm dev

# Open http://localhost:3000
```

### Available Scripts

```bash
# Development
pnpm dev          # Start dev server with Turbopack

# Production
pnpm build        # Build for production
pnpm start        # Start production server

# Code Quality
pnpm lint         # Run ESLint
pnpm test         # Run tests in watch mode
pnpm test:coverage # Run tests with coverage report
```

## Project Structure

```
montreal-camps/
├── src/
│   ├── app/              # Next.js app directory
│   │   ├── layout.tsx    # Root layout with LocalizationProvider
│   │   └── page.tsx      # Main camp directory page
│   ├── components/       # React components
│   │   ├── ui/           # ShadCN UI components
│   │   ├── CampCard.tsx
│   │   ├── CampDetailDialog.tsx
│   │   ├── CampFilters.tsx
│   │   ├── CampList.tsx
│   │   ├── CampMap.tsx
│   │   ├── SearchBar.tsx
│   │   ├── ActiveFilters.tsx
│   │   └── LanguageSwitcher.tsx
│   ├── data/             # Sample camp data
│   │   └── camps.ts
│   ├── lib/              # Utility functions
│   │   ├── filterCamps.ts
│   │   └── utils.ts
│   ├── localization/     # i18n system
│   │   ├── types.ts
│   │   ├── en.ts
│   │   ├── fr.ts
│   │   ├── context.tsx
│   │   └── useTranslation.ts
│   └── types/            # TypeScript type definitions
│       └── camp.ts
└── vitest.config.ts      # Test configuration
```

## Testing

The project maintains >60% code coverage across:

- **Statements**: 71.11%
- **Branches**: 82.88%
- **Functions**: 62.79%
- **Lines**: 71.11%

Run tests with:

```bash
pnpm test:coverage
```

## Data Structure

The application uses fake/sample data for demonstration. In production, this would be replaced with:

- API integration for real camp data
- Admin interface for data management
- Database backend

## Accessibility

- Semantic HTML
- ARIA labels
- Keyboard navigation
- Screen reader support
- Bilingual content

## Future Enhancements

- User accounts and saved favorites
- Advanced filtering (activities, special needs, etc.)
- Camp capacity and availability
- Online registration integration
- Reviews and ratings
- Photo galleries
- Admin dashboard for camp organizations

## License

MIT

## Contributing

This is a demonstration project. For production use, please ensure:

1. Real camp data integration
2. Security audit
3. Performance optimization
4. Accessibility testing
5. User testing with target audience

---

**Built with ❤️ for Montreal families**
