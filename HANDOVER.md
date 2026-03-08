# SWMM5 vs ICM InfoWorks — Complete Project Handover

**Date:** March 2026
**Stack:** React 18 + TypeScript + Express + Vite + Tailwind CSS v4 + shadcn/ui
**Hosted on:** Replit (Node.js 20, PostgreSQL 16)

---

## Table of Contents

1. [Project Overview](#1-project-overview)
2. [Architecture Summary](#2-architecture-summary)
3. [Directory Structure](#3-directory-structure)
4. [Frontend Deep Dive](#4-frontend-deep-dive)
   - 4.1 [Entry Points & Routing](#41-entry-points--routing)
   - 4.2 [Dashboard — The Main Page](#42-dashboard--the-main-page)
   - 4.3 [Four Viewing Modes](#43-four-viewing-modes)
   - 4.4 [16 Diagram Categories (117 Diagrams)](#44-16-diagram-categories-117-diagrams)
   - 4.5 [27 Visual Component Files](#45-27-visual-component-files)
   - 4.6 [Interactive Calculators](#46-interactive-calculators)
   - 4.7 [Units Toggle (USA / SI)](#47-units-toggle-usa--si)
   - 4.8 [Favorites System](#48-favorites-system)
   - 4.9 [Dark Mode / Theme System](#49-dark-mode--theme-system)
   - 4.10 [Export System (JSON & Markdown)](#410-export-system-json--markdown)
   - 4.11 [Executive Summary Card](#411-executive-summary-card)
   - 4.12 [TOPIC_DIAGRAM_MAP — Cross-Referencing](#412-topic_diagram_map--cross-referencing)
5. [Backend Deep Dive](#5-backend-deep-dive)
6. [Data Layer](#6-data-layer)
   - 6.1 [comparison-data.ts](#61-comparison-datats)
   - 6.2 [source-code-snippets.ts](#62-source-code-snippetsts)
   - 6.3 [Database Schema](#63-database-schema)
7. [Build System & Scripts](#7-build-system--scripts)
8. [Configuration Files](#8-configuration-files)
9. [UI Component Library](#9-ui-component-library)
10. [Animation & Visualization Patterns](#10-animation--visualization-patterns)
11. [Unit Conversion System — Full Reference](#11-unit-conversion-system--full-reference)
12. [Deployment & Production](#12-deployment--production)
13. [Key Dependencies](#13-key-dependencies)
14. [Common Patterns & Conventions](#14-common-patterns--conventions)
15. [Known Limitations & Future Work](#15-known-limitations--future-work)
16. [Quick Start Guide](#16-quick-start-guide)

---

## 1. Project Overview

This is an educational web application that provides a structured, interactive comparison of how **EPA SWMM 5** and **InfoWorks ICM** solve the **1D Saint-Venant equations** for unsteady flow in hydraulic/stormwater modeling.

**What it does:**
- Displays **117 interactive diagrams and calculators** across **16 categories**
- Provides four viewing modes: Visuals, Topic (accordion), Table (side-by-side), and Source Code
- Includes animated SVG visualizations, canvas-based simulators, and slider-driven calculators
- Supports a global **USA/SI units toggle** that converts all displayed values between imperial and metric
- Provides a **Favorites system** — star any diagram or topic for quick access via a dedicated Favorites category
- Offers **dark/light theme** toggle
- Allows **JSON and Markdown export** of the entire knowledge base
- Shows an **Executive Summary** comparison card
- Links to companion tools (sjswmm5manualsearch.com, swmmdocs.com)
- Tracks software versions (SWMM5 v5.2.4, ICM v2025.1)

**Target audience:** Hydraulic engineers, stormwater modelers, and students comparing these two engines.

---

## 2. Architecture Summary

```
┌─────────────────────────────────────────────────┐
│                   Browser                        │
│  React 18 + TypeScript + Tailwind + shadcn/ui   │
│  ┌─────────┐  ┌──────────────┐  ┌─────────────┐│
│  │Dashboard │  │   Contexts   │  │27 Visual    ││
│  │(main pg) │  │Units/Theme/  │  │Comps (SVG/  ││
│  │          │  │Favorites     │  │Canvas)      ││
│  └─────────┘  └──────────────┘  └─────────────┘│
│  ┌─────────────────────┐  ┌──────────────────┐  │
│  │ comparison-data.ts  │  │source-code-snips │  │
│  │ (knowledge base)    │  │(viewable source) │  │
│  └─────────────────────┘  └──────────────────┘  │
└────────────────────┬────────────────────────────┘
                     │ HTTP (port 5000)
┌────────────────────┴────────────────────────────┐
│              Express.js Server                   │
│  ┌──────────┐  ┌──────────┐  ┌──────────────┐  │
│  │ routes.ts│  │storage.ts│  │  vite.ts      │  │
│  │(API stub)│  │(MemStore)│  │(dev HMR)     │  │
│  └──────────┘  └──────────┘  └──────────────┘  │
└─────────────────────────────────────────────────┘
```

The app is **primarily frontend-driven**. All comparison data, diagram logic, and interactivity live in the client. The Express backend is minimal — it serves the static frontend and provides a skeleton for future API endpoints.

---

## 3. Directory Structure

```
/
├── client/
│   ├── index.html                          # HTML entry point with OG meta tags
│   ├── public/
│   │   ├── comparison_tool.py              # Python comparison script (public asset)
│   │   ├── favicon.png
│   │   └── opengraph.jpg
│   └── src/
│       ├── App.tsx                          # Root component, routing, providers
│       ├── main.tsx                         # React DOM render entry
│       ├── index.css                        # Global Tailwind styles + CSS variables
│       ├── components/
│       │   ├── ui/                          # 55+ shadcn/ui primitives
│       │   │   ├── accordion.tsx
│       │   │   ├── badge.tsx
│       │   │   ├── button.tsx
│       │   │   ├── card.tsx
│       │   │   ├── dialog.tsx
│       │   │   ├── slider.tsx
│       │   │   ├── tabs.tsx
│       │   │   ├── tooltip.tsx
│       │   │   └── ... (50+ more)
│       │   └── visuals/                     # 27 visualization component files
│       │       ├── SolverDiagrams.tsx
│       │       ├── SolverMechanicsExtra.tsx
│       │       ├── SolverOptionsDiagrams.tsx
│       │       ├── SolverOptionsExtra.tsx
│       │       ├── DynamicWaveOptionsDiagrams.tsx
│       │       ├── TemporalDynamicsDiagrams.tsx
│       │       ├── OperationalControlsDiagrams.tsx
│       │       ├── AdvancedDiagrams.tsx
│       │       ├── HydrologicDiagrams.tsx
│       │       ├── HydrologyExtraDiagrams.tsx
│       │       ├── ClimateInfiltrationDiagrams.tsx
│       │       ├── ICMSimulationDiagrams.tsx
│       │       ├── ICMManholeSimulator.tsx
│       │       ├── InletDiagrams.tsx
│       │       ├── GreenInfraDiagrams.tsx
│       │       ├── ArchitecturalDiagrams.tsx
│       │       ├── BoundaryDiagrams.tsx
│       │       ├── ScenarioDiagrams.tsx
│       │       ├── PerformanceDiagrams.tsx
│       │       ├── ReviewDiagrams.tsx
│       │       ├── HistoricalAnimations.tsx
│       │       ├── HistoricalAnimations2.tsx
│       │       ├── HistoricalAnimations3.tsx
│       │       ├── NodeAnimations.tsx
│       │       ├── DecisionEngineDiagram.tsx
│       │       ├── CalculatorDiagrams.tsx
│       │       └── TimestepComparisonDiagram.tsx
│       ├── contexts/
│       │   ├── UnitsContext.tsx              # USA/SI unit toggle context
│       │   └── FavoritesContext.tsx          # localStorage-backed favorites system
│       ├── data/
│       │   ├── comparison-data.ts            # Knowledge base (KB object, topics, sources)
│       │   └── source-code-snippets.ts       # Raw source code strings for Source tab
│       ├── hooks/
│       │   ├── use-mobile.tsx                # Mobile breakpoint detection
│       │   ├── use-theme.tsx                 # Dark/light theme hook
│       │   └── use-toast.ts                  # Toast notification hook
│       ├── lib/
│       │   ├── queryClient.ts               # TanStack Query configuration
│       │   └── utils.ts                      # cn() utility (tailwind-merge + clsx)
│       └── pages/
│           ├── dashboard.tsx                 # Main application page (everything)
│           └── not-found.tsx                 # 404 page
├── server/
│   ├── index.ts                             # Express entry point
│   ├── routes.ts                            # API route registration (stub)
│   ├── storage.ts                           # IStorage interface + MemStorage
│   ├── static.ts                            # Production static file serving
│   └── vite.ts                              # Vite dev server middleware
├── shared/
│   └── schema.ts                            # Drizzle ORM schema + Zod types
├── script/
│   └── build.ts                             # Custom build script (Vite + esbuild)
├── attached_assets/                         # Reference docs, images, research notes
├── package.json
├── vite.config.ts
├── tsconfig.json
├── drizzle.config.ts
├── postcss.config.js
├── components.json                          # shadcn/ui config
└── replit.md                                # Replit project documentation
```

---

## 4. Frontend Deep Dive

### 4.1 Entry Points & Routing

**`client/src/main.tsx`** — Renders `<App />` into the DOM.

**`client/src/App.tsx`** — Wraps the app in providers and sets up routing:
```
QueryClientProvider → UnitsProvider → FavoritesProvider → Router
  Route "/" → Dashboard
  Route (fallback) → NotFound
```

**Router:** Uses `wouter` (lightweight alternative to React Router). Currently only two routes exist.

### 4.2 Dashboard — The Main Page

`client/src/pages/dashboard.tsx` is the single-page hub for the entire application. It contains:

- **Header bar** — App title, "117 Interactive Diagrams" badge, view mode tabs, Units toggle (USA/SI), Theme toggle (dark/light), About dialog
- **Executive Summary** — Always-visible comparison card at the top
- **Content area** — Changes based on the active viewing mode
- **Favorites** — Star-based bookmarking on every diagram and comparison topic, with a dedicated Favorites category
- **Footer** — Companion tool links, version tracker

**State variables:**
- `activeView`: `"visuals" | "topic" | "table" | "source"` — which tab is active
- `activeCategory`: which diagram category is selected in the sidebar (including `"favorites"`)
- `selectedFile`: which source file is open in the Source viewer

### 4.3 Four Viewing Modes

| Mode | Description | UI Pattern |
|------|-------------|------------|
| **Visuals** | Interactive diagrams, animations, calculators | Category sidebar + responsive grid of diagram cards |
| **Topic** | Point-by-point textual comparison across 15 topics | Accordion list, each topic expands to show SWMM5 vs ICM bullet points |
| **Table** | Dense side-by-side reference table | Full-width table with all topics in rows |
| **Source** | Browse the actual source code of visualization components | File card grid → click to open syntax-highlighted code dialog |

### 4.4 16 Diagram Categories (117 Diagrams)

| # | Category Key | Display Name | Icon | Diagram Count | Primary Component Files |
|---|-------------|-------------|------|---------------|------------------------|
| 1 | `solver` | Solver Mechanics | Cpu | 16 | SolverDiagrams, SolverMechanicsExtra, NodeAnimations, CalculatorDiagrams |
| 2 | `options` | Solver Options | Settings | 8 | SolverOptionsDiagrams, SolverOptionsExtra |
| 3 | `dynwave` | Dynamic Wave Options | Waves | 10 | DynamicWaveOptionsDiagrams, CalculatorDiagrams |
| 4 | `temporal` | Temporal Dynamics | Clock | 6 | TemporalDynamicsDiagrams, CalculatorDiagrams |
| 5 | `controls` | Operational Controls | Sliders | 3 | OperationalControlsDiagrams |
| 6 | `advanced` | Advanced Analysis | BarChart3 | 10 | AdvancedDiagrams |
| 7 | `hydrologic` | Hydrologic | CloudRain | 6 | HydrologicDiagrams, HydrologyExtraDiagrams |
| 8 | `climate` | Climate & Infiltration | Thermometer | 2 | ClimateInfiltrationDiagrams |
| 9 | `icm` | ICM Simulation | Database | 17 | ICMSimulationDiagrams, ICMManholeSimulator, ReviewDiagrams |
| 10 | `inlets` | Surface-to-Sewer | ArrowDownToLine | 4 | InletDiagrams |
| 11 | `green` | Green Infrastructure | Leaf | 3 | GreenInfraDiagrams |
| 12 | `architecture` | Code Architecture | Code | 5 | ArchitecturalDiagrams |
| 13 | `boundary` | Boundary Conditions | GitBranch | 4 | BoundaryDiagrams |
| 14 | `scenarios` | Real-World Scenarios | Building2 | 4 | ScenarioDiagrams |
| 15 | `performance` | Performance & Topology | TrendingUp | 6 | PerformanceDiagrams |
| 16 | `historical` | Historical Engineering | Landmark | 13 | HistoricalAnimations, HistoricalAnimations2, HistoricalAnimations3 |

### 4.5 27 Visual Component Files

Each file in `client/src/components/visuals/` exports one or more named React components. Every component follows a consistent pattern:

```tsx
export function DiagramName() {
  const { u, conv } = useUnits();         // Unit labels + conversion functions
  const [state, setState] = useState(...); // Animation/interaction state
  
  useEffect(() => {                        // Animation loop (setInterval)
    const id = setInterval(() => { ... }, 50);
    return () => clearInterval(id);        // Cleanup
  }, []);

  return (
    <Card>
      <CardHeader><CardTitle>...</CardTitle></CardHeader>
      <CardContent>
        <svg viewBox="0 0 400 280">
          {/* Animated SVG elements */}
        </svg>
        <Slider ... />                     {/* Interactive controls */}
        <Badge>Value: {conv.length(val)} {u.length}</Badge>
      </CardContent>
    </Card>
  );
}
```

**Complete component file listing with their exported diagrams:**

| File | Exported Components |
|------|-------------------|
| `SolverDiagrams.tsx` | SpatialDiscretizationDiagram, PreissmannSlotDiagram, WavePropagationDiagram, SurchargeAlgorithmDiagram, ComputationalPointsDiagram, ManningsFlowCalculator, PreissmannSlotCalculator, LiveNetworkComparison, ForceMainComparison, BackwaterPropagation |
| `SolverMechanicsExtra.tsx` | NewtonRaphsonConvergence, ThetaWeightingDiagram, StaggeredGridVisualization |
| `SolverOptionsDiagrams.tsx` | RoutingMethodDiagram, AdaptiveTimestepDiagram, CFLStabilityDiagram |
| `SolverOptionsExtra.tsx` | RoutingMethodComparison, TimestepInstabilityDemo |
| `DynamicWaveOptionsDiagrams.tsx` | InertialTermsDiagram, SurchargeMethodDiagram, ConvergenceDiagram, FroudeNumberCalculator, InertialTermsCalculator, and more |
| `TemporalDynamicsDiagrams.tsx` | CFLConditionDiagram, AdaptiveSteppingDiagram, StartupBehaviorDiagram, CFLStabilityCalculator, TimeStepEfficiencyEstimator, and more |
| `OperationalControlsDiagrams.tsx` | RTCLogicDiagram, PIDControllerDiagram, ExecutionTimelineDiagram |
| `AdvancedDiagrams.tsx` | ConvergenceAnalysis, MassBalanceDiagram, OscillationChallenges, ConduitLengthSensitivity, CommonMigrationPitfalls, and more |
| `HydrologicDiagrams.tsx` | UnitHydrographDiagram, RainfallDistributionDiagram, RTKMethodDiagram |
| `HydrologyExtraDiagrams.tsx` | LIDLayerStack, NonlinearReservoirDiagram, WidthSensitivityDiagram |
| `ClimateInfiltrationDiagrams.tsx` | SnowmeltDiagram, InfiltrationMethodsDiagram |
| `ICMSimulationDiagrams.tsx` | BaseFlowDiagram, PreissmannSlotICM, HeadlossDiagram, InfoSewerEmulation, SurfaceFloodingComparison, ThreeEngineComparison, OneDTwoDCoupling, ManholeStorageVolume, FloodTypeComparison |
| `ICMManholeSimulator.tsx` | ICMManholeSimulator (canvas-based, full simulation) |
| `InletDiagrams.tsx` | InletElementsDiagram, HEC22Calculator, and more |
| `GreenInfraDiagrams.tsx` | LIDSUDSComparison, DualSolverArchitecture, LIDLayerStackDiagram |
| `ArchitecturalDiagrams.tsx` | InputParsingDiagram, MatrixSolverDiagram, RTCRulesDiagram, and more |
| `BoundaryDiagrams.tsx` | OutfallTypesDiagram, InflowTypesDiagram, TreatmentAtNodes, CoefficientConversionSheet |
| `ScenarioDiagrams.tsx` | CSOModelingDiagram, DetentionPondDiagram, ParallelPipeAnalysis, CalibrationVisual |
| `PerformanceDiagrams.tsx` | LoopDetection, BoundaryInfluence, PerformanceScaling, WarningMessagesDecoded, SolverEvolutionTimeline, SaintVenantEquationsSideBySide |
| `ReviewDiagrams.tsx` | DecisionEngine and review-related diagrams |
| `HistoricalAnimations.tsx` | RomanAqueductAnimation, DujiangyanAnimation, IncaFountainsAnimation, PersianQanatAnimation |
| `HistoricalAnimations2.tsx` | IndianStepwellAnimation, AztecDikeAnimation, DutchPolderAnimation, RomanSiphonAnimation |
| `HistoricalAnimations3.tsx` | MayaFiltrationAnimation, KhmerBarayAnimation, CloacaMaximaAnimation, IndusValleyDrainsAnimation, ArchimedesScrewAnimation |
| `NodeAnimations.tsx` | Node-level animated visualizations |
| `DecisionEngineDiagram.tsx` | Decision engine flowchart |
| `CalculatorDiagrams.tsx` | Dedicated calculator components |
| `TimestepComparisonDiagram.tsx` | Timestep comparison visualization |

### 4.6 Interactive Calculators

The app includes **8 interactive calculators** with slider inputs:

| Calculator | Location | Inputs | Output |
|-----------|----------|--------|--------|
| CFL Stability | TemporalDynamicsDiagrams | Velocity, depth, conduit length, timestep | CFL number, stability verdict |
| Preissmann Slot | SolverDiagrams | Pipe diameter, slot width factor | Slot width, wave speed |
| Manning's Flow | SolverDiagrams | Slope, roughness, diameter, depth ratio | Flow rate, velocity |
| TimeStep Efficiency | TemporalDynamicsDiagrams | Network size, timestep | Simulation time estimate |
| Froude Number | DynamicWaveOptionsDiagrams | Velocity, depth | Froude number, flow regime |
| Computational Points | SolverDiagrams | Conduit length, spacing | Number of computational points |
| Inertial Terms | DynamicWaveOptionsDiagrams | Flow parameters | Inertial term magnitudes |
| HEC-22 Inlet | InletDiagrams | Road geometry, flow | Inlet capture efficiency |

All calculators respect the global USA/SI toggle. Sliders maintain their ranges in US units internally; only the displayed labels and formatted values change when switching to SI.

### 4.7 Units Toggle (USA / SI)

**File:** `client/src/contexts/UnitsContext.tsx`

**How it works:**
1. `UnitsProvider` wraps the entire app (in `App.tsx`)
2. Stores a `unitSystem` state: `"USA"` or `"SI"`
3. Provides via context: `{ unitSystem, toggleUnits, u, conv, fmt }`
4. Components call `const { u, conv } = useUnits()` to get current labels and converters
5. Toggle button in the dashboard header switches between systems

**Unit Labels:**

| Property | USA | SI |
|----------|-----|-----|
| `u.length` | ft | m |
| `u.lengthSmall` | in | mm |
| `u.flow` | cfs | m³/s |
| `u.velocity` | ft/s | m/s |
| `u.area` | ft² | m² |
| `u.volume` | ft³ | m³ |
| `u.slope` | ft/ft | m/m |
| `u.rainfall` | in/hr | mm/hr |
| `u.pressure` | psi | kPa |
| `u.diameter` | in | mm |
| `u.flowSmall` | gpm | L/s |

**Conversion Functions (SI mode applies these multipliers; USA mode returns identity):**

| Function | Conversion | Factor |
|----------|-----------|--------|
| `conv.length(val)` | ft → m | × 0.3048 |
| `conv.lengthSmall(val)` | in → mm | × 25.4 |
| `conv.flow(val)` | cfs → m³/s | × 0.0283168 |
| `conv.velocity(val)` | ft/s → m/s | × 0.3048 |
| `conv.area(val)` | ft² → m² | × 0.0929 |
| `conv.volume(val)` | ft³ → m³ | × 0.0283168 |
| `conv.rainfall(val)` | in/hr → mm/hr | × 25.4 |
| `conv.pressure(val)` | psi → kPa | × 6.89476 |
| `conv.diameter(val)` | in → mm | × 25.4 |
| `conv.flowSmall(val)` | gpm → L/s | × 0.0631 |

**`fmt(val, decimals=2)`** — Formats a number to the specified decimal places. Used as `fmt(conv.length(10))` → `"3.05"` (in SI mode).

**Key design decision:** All internal calculations, slider ranges, and state values remain in US units. Only the **display text** is wrapped with conversion functions. This avoids rounding errors and simplifies the codebase.

### 4.8 Favorites System

**File:** `client/src/contexts/FavoritesContext.tsx`

**How it works:**
1. `FavoritesProvider` wraps the app (in `App.tsx`, inside `UnitsProvider`)
2. Stores a `Set<string>` of favorite IDs in React state, persisted to `localStorage` under key `swmm-icm-favorites`
3. Provides via context: `{ favorites, toggleFavorite, isFavorite, count, clearAll }`
4. Components call `const { isFavorite, toggleFavorite } = useFavorites()` to read/write favorites

**ID Conventions:**
| Prefix | Type | Example |
|--------|------|---------|
| `d-` | Diagram | `d-preissmann-slot`, `d-roman-aqueduct`, `d-cfl-calc` |
| `t-` | Comparison Topic | `t-governing_equations`, `t-pressurisation_surcharge` |

**UI Components (defined in `dashboard.tsx`):**

- **`FavoriteButton`** — Absolute-positioned star icon (`top-3 right-3`). Yellow fill when active, muted when inactive. Calls `toggleFavorite(id)` on click with `stopPropagation`.
- **`Fav` wrapper** — `<div className="relative">` that wraps any diagram component and overlays a `FavoriteButton`. Usage: `<Fav id="d-slug"><DiagramComponent /></Fav>`
- **Topic stars** — Inline star buttons on each Topic accordion trigger and Table view topic cell. Use `t-{topic.key}` IDs.
- **Favorites category** — First entry in `DIAGRAM_CATEGORIES`, shown with a yellow star icon and red badge count in the category sidebar.
- **Favorites view** — When the "Favorites" category is selected, renders:
  - Empty state with guidance text when no favorites exist
  - "Saved Diagrams" section showing favorited diagram components with category badges
  - "Saved Comparisons" section showing favorited topics in an expandable accordion
  - "Clear All" button to reset all favorites

**`DIAGRAM_REGISTRY`** — Array of 117 entries (defined inside `Dashboard` component) mapping each diagram ID to its label, category, and React component. Used to resolve favorited diagram IDs back to renderable components.

### 4.9 Dark Mode / Theme System

**File:** `client/src/hooks/use-theme.tsx`

- Stores theme preference in `localStorage`
- Toggles a CSS class on the document root
- Uses CSS variables defined in `client/src/index.css` for all colors
- Blue-themed palette in both light and dark modes

### 4.10 Export System (JSON & Markdown)

Both exports are **client-side only** (no server calls):

**JSON Export:**
- Downloads the entire `KB` object from `comparison-data.ts`
- Filename: `swmm5-icm-comparison.json`
- Contains all topics, bullet points, and source references

**Markdown Export:**
- Generates a formatted `.md` document programmatically
- Includes: title, summary table, all 15 comparison topics with bullet points, source list
- Filename: `swmm5-icm-comparison.md`

### 4.11 Executive Summary Card

Always visible at the top of Visuals and Topic views. Provides a quick-reference comparison:

| Aspect | SWMM5 | ICM |
|--------|-------|-----|
| Solution Method | Explicit / link-node | Implicit / distributed |
| Discretization | Node-link lumped | 4-point Preissmann Box |
| Best For | Urban drainage design | Complex integrated modeling |
| ... | ... | ... |

### 4.12 TOPIC_DIAGRAM_MAP — Cross-Referencing

Defined in `dashboard.tsx` (lines ~112–126). Maps textual comparison topics to related interactive diagrams, enabling "Related Diagram" buttons in Topic and Table views.

Example mapping:
```
pressurisation_surcharge → [
  { name: "Preissmann Slot", category: "solver" },
  { name: "ICM Preissmann Slot", category: "icm" },
  { name: "Surcharge Method", category: "options" }
]
```

Clicking a "Related Diagram" button switches to Visuals mode, selects the correct category, and scrolls to the diagram.

---

## 5. Backend Deep Dive

The backend is minimal and exists primarily to serve the frontend.

### server/index.ts — Entry Point
- Creates Express app with JSON and URL-encoded body parsing
- Custom request logger that intercepts `res.json` to log API responses and timing
- In **development**: loads Vite middleware for HMR
- In **production**: serves static files from `dist/public`
- Listens on `PORT` env var (default 5000) on `0.0.0.0`
- Global error handler returns 500 for unhandled exceptions

### server/routes.ts — API Routes
- Currently a **stub** with no active endpoints
- Prepared to receive routes prefixed with `/api`
- All application data is client-side; no API calls are needed for current functionality

### server/storage.ts — Data Persistence
- Defines `IStorage` interface with user CRUD methods: `getUser`, `getUserByUsername`, `createUser`
- `MemStorage` class implements in-memory storage using a JavaScript `Map`
- Uses `crypto.randomUUID()` for ID generation
- Exports a singleton `storage` instance

### server/vite.ts — Development Server
- Creates Vite server in `middlewareMode`
- Catch-all `*` handler reads `client/index.html`, injects the versioned main.tsx script tag, and serves transformed HTML
- Only active in development (`NODE_ENV !== "production"`)

### server/static.ts — Production Static Serving
- Serves built assets from `dist/public` with proper MIME types and caching headers

---

## 6. Data Layer

### 6.1 comparison-data.ts

**File:** `client/src/data/comparison-data.ts`

Contains the `KB` (Knowledge Base) object — the structured data behind the Topic, Table, and Export views.

**Structure:**
```typescript
const KB = {
  swmm5: {
    product: "EPA SWMM 5",
    tagline: "...",
    topics: {
      governing_equations: ["...", "..."],
      spatial_discretisation: ["...", "..."],
      time_integration: ["...", "..."],
      nonlinear_solver: ["...", "..."],
      pressurisation_surcharge: ["...", "..."],
      // ... 15 topics total
    },
    sources: [
      { label: "...", url: "...", notes: "..." },
      // ...
    ]
  },
  icm: {
    // Same structure as swmm5
  }
};
```

**`TOPIC_ORDER`:** Array defining display order and human-readable labels for each topic key.

**`TopicKey`:** TypeScript type derived from topic keys for type safety.

**15 Technical Topics Covered:**
1. Governing equations
2. Spatial discretisation
3. Time integration
4. Nonlinear solver
5. Pressurisation / surcharge
6. Node/manhole surface area treatment
7. Stability devices / numerical damping
8. Dry-weather / dry-network handling
9. Boundary conditions & forcing
10. Subcatchment runoff coupling
11. Control rules / RTC
12. Parallel and looped networks
13. Numerical precision & convergence
14. Output / reporting resolution
15. Practical implications for modellers

### 6.2 source-code-snippets.ts

**File:** `client/src/data/source-code-snippets.ts`

A `Record<string, string>` called `SOURCE_CODE_FILES` where:
- **Keys** = filenames (e.g., `"SolverDiagrams.tsx"`)
- **Values** = template literal strings containing the actual React/TypeScript source code

Used by the "Source" tab to display syntax-highlighted code for each visualization component. This is a static snapshot — it does not auto-update when component files change.

**Files included:** ClimateInfiltrationDiagrams, SolverDiagrams, ICMSimulationDiagrams, HydrologicDiagrams, ArchitecturalDiagrams, GreenInfraDiagrams, SolverOptionsDiagrams (and others).

### 6.3 Database Schema

**File:** `shared/schema.ts`

Defines a `users` table using Drizzle ORM:
```typescript
export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
});
```

Also exports:
- `insertUserSchema` — Zod schema for insert validation (via `drizzle-zod`)
- `InsertUser` — TypeScript type for inserts
- `User` — TypeScript type for selects

**Note:** The database is configured but not actively used. All app content is static TypeScript data. The schema exists as a foundation for future features (user accounts, saved preferences, etc.).

---

## 7. Build System & Scripts

### package.json Scripts

| Script | Command | Purpose |
|--------|---------|---------|
| `dev` | `NODE_ENV=development tsx server/index.ts` | Full-stack development with HMR |
| `build` | `tsx script/build.ts` | Production build (client + server) |
| `start` | `NODE_ENV=production node dist/index.cjs` | Run production server |
| `dev:client` | `vite dev --port 5000` | Client-only dev server |
| `check` | `tsc` | TypeScript type checking |
| `db:push` | `drizzle-kit push` | Push Drizzle schema to database |

### script/build.ts — Custom Build Process

1. **Client build:** Calls Vite's `build()` function → outputs to `dist/public/`
2. **Server build:** Uses esbuild to bundle `server/index.ts` → outputs `dist/index.cjs`
3. **Bundling strategy:** An allowlist of dependencies (express, drizzle-orm, zod, etc.) are bundled into the server executable to reduce cold start times. Other dependencies are marked as `external`.

### Build Output
```
dist/
├── public/          # Vite-built React app (HTML, JS, CSS, assets)
└── index.cjs        # Bundled Express server (single file)
```

---

## 8. Configuration Files

### vite.config.ts
- **Root:** `client/`
- **Output:** `dist/public`
- **Plugins:** React, Tailwind CSS (Vite plugin), custom `metaImagesPlugin`, Replit plugins (runtimeErrorOverlay, cartographer, devBanner)
- **Path aliases:**
  - `@` → `client/src`
  - `@shared` → `shared`
  - `@assets` → `attached_assets`
- **Server:** `0.0.0.0` (required for Replit)

### tsconfig.json
- **Target:** ESNext
- **Module resolution:** Bundler
- **Paths:** Match Vite aliases (`@/*`, `@shared/*`)
- **Includes:** `client/src/**/*`, `shared/**/*`, `server/**/*`
- **No emit:** `true` (transpilation handled by Vite/esbuild)

### drizzle.config.ts
- **Dialect:** PostgreSQL
- **Schema:** `./shared/schema.ts`
- **Output:** `./migrations`
- **Connection:** `DATABASE_URL` environment variable

### postcss.config.js
- Plugins: `tailwindcss`, `autoprefixer`

### components.json
- shadcn/ui configuration pointing to the component directory and style preferences

### .replit
- **Modules:** nodejs-20, web, postgresql-16
- **Run command:** `npm run dev`
- **Deployment build:** `npm run build`
- **Deployment run:** `node ./dist/index.cjs`
- **Port:** 5000

---

## 9. UI Component Library

The app uses **shadcn/ui** — a collection of copy-paste React components built on **Radix UI** primitives. These live in `client/src/components/ui/` and include:

**Layout:** Card, Dialog, Sheet, Drawer, Tabs, Accordion, Collapsible, Separator, Resizable
**Forms:** Input, Textarea, Select, Checkbox, Radio Group, Switch, Slider, Label, Form, Field
**Feedback:** Toast, Toaster, Alert, Badge, Progress, Spinner, Skeleton
**Navigation:** Navigation Menu, Menubar, Breadcrumb, Pagination, Sidebar
**Overlay:** Popover, Tooltip, Hover Card, Context Menu, Dropdown Menu, Command, Alert Dialog
**Data Display:** Table, Scroll Area, Aspect Ratio, Avatar, Carousel, Chart

**Styling approach:**
- All components use Tailwind CSS utility classes
- `cn()` utility (from `client/src/lib/utils.ts`) merges Tailwind classes using `tailwind-merge` + `clsx`
- `class-variance-authority` (CVA) manages component variants (e.g., button sizes, badge colors)
- CSS variables in `index.css` define the color palette for both light and dark themes

---

## 10. Animation & Visualization Patterns

### SVG Animations
Most diagrams use inline SVG with React state-driven animations:
```tsx
const [time, setTime] = useState(0);
useEffect(() => {
  const id = setInterval(() => setTime(t => (t + 1) % 100), 50);
  return () => clearInterval(id);
}, []);
// SVG elements use `time` for positions, opacity, transforms
```

**Standard viewBox:** `"0 0 400 280"` (most diagrams) or `"0 0 400 300"`

### Canvas Animations
The **ICM Manhole Simulator** (`ICMManholeSimulator.tsx`) uses HTML5 Canvas for more complex rendering:
- Canvas ref with `useEffect` for draw loops
- Head-driven orifice outflow formula: Q = Cd · A · √(2gh)
- Real-time hydrograph charting
- Gate valve with animated open/close

### Color Conventions
| Color | Hex | Used For |
|-------|-----|----------|
| Blue | `#3b82f6` | Water/hydraulic head, SWMM5 elements |
| Orange | `#f97316` | Flow/discharge, warnings |
| Green | `#22c55e` | ICM elements, convergence, success |
| Amber | `#f59e0b` | Caution, intermediate states |
| Red | `#ef4444` | Errors, instability, divergence |

### Interactive Controls
- **Sliders** (`<Slider>`) control animation parameters (depth, flow, velocity, etc.)
- **Buttons** toggle animation states (play/pause, reset)
- **Badges** display computed values with current units

### Framer Motion
Used selectively for entrance animations and smooth transitions (not for the core SVG diagram animations).

---

## 11. Unit Conversion System — Full Reference

### Architecture
```
UnitsProvider (App.tsx)
  └── unitSystem state: "USA" | "SI"
  └── toggleUnits() callback
  └── u = usaLabels | siLabels
  └── conv = usaConversions | siConversions
  └── fmt(val, decimals)

Component (any visual):
  const { u, conv, fmt } = useUnits();
  // Display: {fmt(conv.length(valueInFeet))} {u.length}
  // Result (USA): "10.00 ft"
  // Result (SI):  "3.05 m"
```

### Pattern for Adding a New Unit

1. Add label to both `usaLabels` and `siLabels` in `UnitsContext.tsx`
2. Add identity function to `usaConversions` and multiplier function to `siConversions`
3. Update the `UnitLabels` and `UnitConversions` TypeScript types
4. Use in components: `{conv.newUnit(value)} {u.newUnit}`

### Files Modified for Units (all 27 visual component files)
Every file in `client/src/components/visuals/` imports and uses `useUnits()`. No hardcoded unit strings remain in display text.

---

## 12. Deployment & Production

### Replit Deployment
- **Build command:** `npm run build`
- **Start command:** `node ./dist/index.cjs`
- **Public directory:** `dist/public`
- **Port:** 5000

### Production Flow
1. `npm run build` runs `script/build.ts`
2. Vite builds the React app → `dist/public/`
3. esbuild bundles the Express server → `dist/index.cjs`
4. `node dist/index.cjs` starts the server in production mode
5. Express serves static files from `dist/public/` and handles API routes

### Environment Variables
| Variable | Required | Purpose |
|----------|----------|---------|
| `DATABASE_URL` | No (not actively used) | PostgreSQL connection string |
| `PORT` | No (default 5000) | Server port |
| `NODE_ENV` | Auto-set | `development` or `production` |

---

## 13. Key Dependencies

### Runtime Dependencies
| Package | Version | Purpose |
|---------|---------|---------|
| `react` | 18.x | UI framework |
| `react-dom` | 18.x | React DOM rendering |
| `wouter` | 3.x | Lightweight client-side routing |
| `@tanstack/react-query` | 7.x | Server state management |
| `express` | 4.x | HTTP server |
| `framer-motion` | 11.x | Animation library |
| `drizzle-orm` | 0.38.x | ORM (configured, not actively queried) |
| `zod` | 3.x | Schema validation |
| `drizzle-zod` | 0.7.x | Drizzle-to-Zod schema generation |
| `lucide-react` | latest | Icon library |
| `class-variance-authority` | latest | Component variant management |
| `tailwind-merge` | latest | Tailwind class deduplication |
| `clsx` | latest | Conditional class names |
| `@radix-ui/*` | various | Headless UI primitives (full suite) |

### Dev Dependencies
| Package | Version | Purpose |
|---------|---------|---------|
| `vite` | 5.x | Build tool and dev server |
| `typescript` | 5.x | Type checking |
| `tsx` | latest | TypeScript execution for Node.js |
| `esbuild` | latest | Server bundling |
| `@vitejs/plugin-react` | latest | React support for Vite |
| `@tailwindcss/vite` | latest | Tailwind CSS v4 Vite plugin |
| `drizzle-kit` | latest | Database migration tooling |

---

## 14. Common Patterns & Conventions

### File Organization
- One page = one file in `pages/`
- UI primitives in `components/ui/` (shadcn — do not edit directly)
- Domain-specific visuals in `components/visuals/`
- Shared data in `data/`
- React contexts in `contexts/`
- Custom hooks in `hooks/`
- Utility functions in `lib/`

### Naming Conventions
- Components: PascalCase (`SpatialDiscretizationDiagram`)
- Files: PascalCase for components, camelCase for utilities
- CSS: Tailwind utility classes only (no custom CSS classes except in `index.css`)
- Test IDs: `data-testid="{action}-{target}"` on all interactive elements

### State Management
- **Local state:** `useState` for component-specific animation/interaction state
- **Context:** `UnitsContext` for global unit system, `FavoritesContext` for bookmark persistence, `useTheme` for theme
- **Persistence:** Favorites stored in `localStorage` (key: `swmm-icm-favorites`), theme in `localStorage`
- **Server state:** TanStack React Query (configured but minimally used since data is static)

### Import Aliases
```typescript
import { Component } from "@/components/ui/component";  // → client/src/
import { schema } from "@shared/schema";                  // → shared/
import { asset } from "@assets/file";                     // → attached_assets/
```

---

## 15. Known Limitations & Future Work

### Current Limitations
1. **No user accounts** — The users table schema exists but no auth is implemented
2. **No server-side data** — All content is hardcoded in TypeScript files; there's no CMS or API
3. **Source code snapshots** — The Source tab shows static strings, not live file reads
4. **TOPIC_DIAGRAM_MAP incomplete** — Not all 16 categories have cross-references from the Topic view; newer categories (boundary, scenarios, performance, historical) work independently via the Visuals tab
5. **No search** — No full-text search across diagrams or topics
6. **No mobile optimization** — Sidebar layout may not be ideal on small screens
7. **No i18n** — English only (unit labels change but all text is English)

### Potential Future Features
- User authentication and saved preferences (favorites currently use localStorage only)
- Full-text search across all diagrams and topics
- Printable PDF export
- Additional unit systems (e.g., Australian, UK variations)
- Database-backed content for easier updates
- Live source code reading from filesystem
- Responsive mobile layout improvements
- Additional solver comparisons (e.g., MIKE URBAN, HEC-RAS)

---

## 16. Quick Start Guide

### Development
```bash
# Install dependencies
npm install

# Start development server (Express + Vite HMR)
npm run dev

# App runs at http://localhost:5000
```

### Type Checking
```bash
npm run check
```

### Production Build
```bash
# Build client (Vite) and server (esbuild)
npm run build

# Start production server
npm start
# or
NODE_ENV=production node dist/index.cjs
```

### Database (if needed in future)
```bash
# Push schema to PostgreSQL
npm run db:push
```

### Adding a New Diagram

1. Create or add to an existing file in `client/src/components/visuals/`
2. Follow the standard pattern: `useUnits()` hook, Card wrapper, SVG viewBox, setInterval animation
3. Export the component as a named export
4. Import and render it in the appropriate category section of `dashboard.tsx`
5. Wrap with `<Fav id="d-unique-slug">` for favorites support
6. Add an entry to `DIAGRAM_REGISTRY` (inside `Dashboard` component) with matching ID, label, and category
7. Update the diagram count badge in the dashboard header
8. Optionally add a cross-reference entry in `TOPIC_DIAGRAM_MAP`
9. Optionally add source code to `source-code-snippets.ts` for the Source tab

### Adding a New Category

1. Add a new entry to the `DIAGRAM_CATEGORIES` array in `dashboard.tsx`
2. Create the visual component file(s) in `components/visuals/`
3. Add the rendering logic in the category switch/conditional in the dashboard's Visuals view
4. Update the total diagram count

---

**End of Handover Document**
