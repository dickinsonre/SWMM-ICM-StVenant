# SWMM5 vs ICM InfoWorks — Complete Project Handover

**Date:** March 2026
**Stack:** React 18 + TypeScript + Express + Vite + Tailwind CSS v4 + shadcn/ui
**Hosted on:** Replit (Node.js 20, PostgreSQL 16)
**Total Lines of Code:** ~26,900 across 35 source files

---

## Table of Contents

1. [Project Overview](#1-project-overview)
2. [Architecture Summary](#2-architecture-summary)
3. [Directory Structure](#3-directory-structure)
4. [Frontend Deep Dive](#4-frontend-deep-dive)
   - 4.1 [Entry Points & Routing](#41-entry-points--routing)
   - 4.2 [Provider Nesting Order](#42-provider-nesting-order)
   - 4.3 [Dashboard — The Main Page](#43-dashboard--the-main-page)
   - 4.4 [Four Viewing Modes](#44-four-viewing-modes)
   - 4.5 [17 Diagram Categories (117 Diagrams)](#45-17-diagram-categories-117-diagrams)
   - 4.6 [27 Visual Component Files — Complete Export Map](#46-27-visual-component-files--complete-export-map)
   - 4.7 [Interactive Calculators](#47-interactive-calculators)
   - 4.8 [Units Toggle (USA / SI)](#48-units-toggle-usa--si)
   - 4.9 [Favorites System](#49-favorites-system)
   - 4.10 [Dark Mode / Theme System](#410-dark-mode--theme-system)
   - 4.11 [Export System (JSON & Markdown)](#411-export-system-json--markdown)
   - 4.12 [Executive Summary Card](#412-executive-summary-card)
   - 4.13 [TOPIC_DIAGRAM_MAP — Cross-Referencing](#413-topic_diagram_map--cross-referencing)
   - 4.14 [DIAGRAM_REGISTRY — Component Resolution](#414-diagram_registry--component-resolution)
5. [Backend Deep Dive](#5-backend-deep-dive)
6. [Data Layer](#6-data-layer)
   - 6.1 [comparison-data.ts — Knowledge Base](#61-comparison-datats--knowledge-base)
   - 6.2 [source-code-snippets.ts — Source Viewer Data](#62-source-code-snippetsts--source-viewer-data)
   - 6.3 [Database Schema](#63-database-schema)
7. [Build System & Scripts](#7-build-system--scripts)
8. [Configuration Files](#8-configuration-files)
9. [UI Component Library](#9-ui-component-library)
10. [CSS Theming System](#10-css-theming-system)
11. [Animation & Visualization Patterns](#11-animation--visualization-patterns)
12. [Unit Conversion System — Full Reference](#12-unit-conversion-system--full-reference)
13. [Favorites System — Full Reference](#13-favorites-system--full-reference)
14. [Deployment & Production](#14-deployment--production)
15. [Key Dependencies — Complete List](#15-key-dependencies--complete-list)
16. [Common Patterns & Conventions](#16-common-patterns--conventions)
17. [File Size Reference](#17-file-size-reference)
18. [Known Limitations & Future Work](#18-known-limitations--future-work)
19. [Quick Start Guide](#19-quick-start-guide)

---

## 1. Project Overview

This is an educational web application that provides a structured, interactive comparison of how **EPA SWMM 5** and **InfoWorks ICM** solve the **1D Saint-Venant equations** for unsteady flow in hydraulic/stormwater modeling.

**What it does:**
- Displays **117 interactive diagrams and calculators** across **16 content categories** (+1 Favorites category = 17 total)
- Provides four viewing modes: Visuals, Topic (accordion), Table (side-by-side), and Source Code
- Includes animated SVG visualizations, canvas-based simulators, and slider-driven calculators
- Compares **15 technical topics** with structured bullet points for each solver
- Supports a global **USA/SI units toggle** that converts all displayed values between imperial and metric
- Provides a **Favorites system** — star any diagram or comparison topic for quick access via a dedicated Favorites category
- Offers **dark/light theme** toggle with a blue-themed palette
- Allows **JSON and Markdown export** of the entire knowledge base
- Shows an **Executive Summary** comparison card
- Links to companion tools (sjswmm5manualsearch.com, swmmdocs.com)
- Tracks software versions (SWMM5 v5.2.4, ICM v2025.1)

**Target audience:** Hydraulic engineers, stormwater modelers, and students comparing these two engines.

**Solver Taglines:**
- **SWMM5:** "Node–link dynamic-wave solver using an implicit backward Euler formulation with successive relaxation iterations."
- **ICM:** "Distributed 1D Saint-Venant solver using a Preissmann 4‑point implicit scheme with Newton–Raphson iterations and adaptive time stepping."

---

## 2. Architecture Summary

```
┌───────────────────────────────────────────────────────┐
│                      Browser                           │
│   React 18 + TypeScript + Tailwind + shadcn/ui        │
│   ┌──────────┐  ┌────────────────┐  ┌──────────────┐ │
│   │ Dashboard │  │    Contexts    │  │ 27 Visual    │ │
│   │ (main pg)│  │ Units/Theme/   │  │ Component    │ │
│   │ 1,884 ln │  │ Favorites      │  │ Files        │ │
│   └──────────┘  └────────────────┘  └──────────────┘ │
│   ┌──────────────────────┐  ┌───────────────────────┐ │
│   │  comparison-data.ts  │  │ source-code-snippets  │ │
│   │  (knowledge base)    │  │ (viewable source)     │ │
│   │  15 topics × 2       │  │ 10 files indexed      │ │
│   └──────────────────────┘  └───────────────────────┘ │
└───────────────────┬───────────────────────────────────┘
                    │ HTTP (port 5000)
┌───────────────────┴───────────────────────────────────┐
│               Express.js Server                        │
│   ┌───────────┐  ┌───────────┐  ┌──────────────────┐ │
│   │ routes.ts │  │ storage.ts│  │ vite.ts          │ │
│   │ (API stub)│  │ (MemStore)│  │ (dev HMR)        │ │
│   └───────────┘  └───────────┘  └──────────────────┘ │
└───────────────────────────────────────────────────────┘
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
│       ├── App.tsx                          # Root component, provider nesting, routing
│       ├── main.tsx                         # React DOM render entry
│       ├── index.css                        # Global Tailwind styles + CSS variables
│       ├── components/
│       │   ├── ui/                          # 55 shadcn/ui primitives
│       │   │   ├── accordion.tsx
│       │   │   ├── badge.tsx
│       │   │   ├── button.tsx
│       │   │   ├── card.tsx
│       │   │   ├── dialog.tsx
│       │   │   ├── slider.tsx
│       │   │   ├── tabs.tsx
│       │   │   ├── tooltip.tsx
│       │   │   └── ... (47 more)
│       │   └── visuals/                     # 27 visualization component files
│       │       ├── SolverDiagrams.tsx            # 953 lines
│       │       ├── SolverMechanicsExtra.tsx      # 565 lines
│       │       ├── SolverOptionsDiagrams.tsx     # 1,019 lines
│       │       ├── SolverOptionsExtra.tsx        # 476 lines
│       │       ├── DynamicWaveOptionsDiagrams.tsx # 941 lines
│       │       ├── TemporalDynamicsDiagrams.tsx  # 640 lines
│       │       ├── OperationalControlsDiagrams.tsx # 503 lines
│       │       ├── AdvancedDiagrams.tsx          # 1,140 lines
│       │       ├── HydrologicDiagrams.tsx        # 737 lines
│       │       ├── HydrologyExtraDiagrams.tsx    # 689 lines
│       │       ├── ClimateInfiltrationDiagrams.tsx # 614 lines
│       │       ├── ICMSimulationDiagrams.tsx     # 2,125 lines (largest)
│       │       ├── ICMManholeSimulator.tsx       # 863 lines (canvas-based)
│       │       ├── InletDiagrams.tsx             # 836 lines
│       │       ├── GreenInfraDiagrams.tsx        # 526 lines
│       │       ├── ArchitecturalDiagrams.tsx     # 1,358 lines
│       │       ├── BoundaryDiagrams.tsx          # 893 lines
│       │       ├── ScenarioDiagrams.tsx          # 653 lines
│       │       ├── PerformanceDiagrams.tsx       # 993 lines
│       │       ├── ReviewDiagrams.tsx            # 775 lines
│       │       ├── HistoricalAnimations.tsx      # 808 lines
│       │       ├── HistoricalAnimations2.tsx     # 861 lines
│       │       ├── HistoricalAnimations3.tsx     # 824 lines
│       │       ├── NodeAnimations.tsx            # 861 lines
│       │       ├── DecisionEngineDiagram.tsx     # 413 lines
│       │       ├── CalculatorDiagrams.tsx        # 1,220 lines
│       │       └── TimestepComparisonDiagram.tsx # 598 lines
│       ├── contexts/
│       │   ├── UnitsContext.tsx              # 130 lines — USA/SI unit toggle context
│       │   └── FavoritesContext.tsx          # 67 lines — localStorage-backed favorites
│       ├── data/
│       │   ├── comparison-data.ts            # 294 lines — KB object, topics, sources
│       │   └── source-code-snippets.ts       # 1,273 lines — raw source for Source tab
│       ├── hooks/
│       │   ├── use-mobile.tsx                # 19 lines — mobile breakpoint detection
│       │   ├── use-theme.tsx                 # 46 lines — dark/light theme hook
│       │   └── use-toast.ts                  # Toast notification hook
│       ├── lib/
│       │   ├── queryClient.ts               # TanStack Query configuration
│       │   └── utils.ts                      # cn() utility (tailwind-merge + clsx)
│       └── pages/
│           ├── dashboard.tsx                 # 1,884 lines — main application page
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
├── HANDOVER.md                              # This file
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

**`client/src/main.tsx`** — Renders `<App />` into the DOM using `createRoot`.

**`client/src/App.tsx`** (38 lines) — Wraps the app in providers and sets up routing.

**Router:** Uses `wouter` (lightweight alternative to React Router). Two routes:
- `"/"` → `Dashboard` component
- Fallback → `NotFound` component

### 4.2 Provider Nesting Order

The provider chain in `App.tsx` (outermost → innermost):

```
ThemeProvider              ← Dark/light mode state
  └── UnitsProvider        ← USA/SI unit system state
      └── FavoritesProvider ← localStorage-backed favorites
          └── QueryClientProvider  ← TanStack React Query
              └── TooltipProvider  ← Radix UI tooltip context
                  ├── Toaster      ← Toast notification renderer
                  └── Router       ← wouter route matching
```

### 4.3 Dashboard — The Main Page

`client/src/pages/dashboard.tsx` (1,884 lines) is the single-page hub for the entire application.

**Imports (lines 1–114):**
- 33 Lucide icons
- 3 custom hooks/contexts: `useTheme`, `useUnits`, `useFavorites`
- 8 UI component groups: Button, Card, Tabs, Accordion, Badge, ScrollArea, Separator, Dialog
- 2 data modules: `KB`/`TOPIC_ORDER` from comparison-data, `SOURCE_CODE_FILES`/`FILE_PATHS` from source-code-snippets
- 50+ visual component imports from `components/visuals/`

**Constants (lines 116–150):**
- `TOPIC_DIAGRAM_MAP` — Maps comparison topics to related diagrams
- `DIAGRAM_CATEGORIES` — 17-entry array defining sidebar categories (favorites + 16 content categories)

**Helper Components (lines 152–174):**
- `FavoriteButton({ id })` — Absolute-positioned star overlay for diagrams
- `Fav({ id, children })` — Wrapper that adds `FavoriteButton` to any diagram

**State Variables (lines 177–182):**
| Variable | Type | Default | Purpose |
|----------|------|---------|---------|
| `activeView` | `"visuals" \| "topic" \| "table" \| "source"` | `"visuals"` | Active tab |
| `activeCategory` | `string` | `"solver"` | Selected diagram category |
| `selectedFile` | `string \| null` | `null` | Open file in Source viewer |

**Context Destructuring (line 179):**
```typescript
const { favorites, isFavorite, toggleFavorite, count: favCount, clearAll: clearFavorites } = useFavorites();
```

**Layout Sections:**
| Section | Line Range | Description |
|---------|-----------|-------------|
| DIAGRAM_REGISTRY | 184–303 | 117-entry array mapping diagram IDs to components |
| Derived state | 305–306 | `favoritedDiagrams`, `favoritedTopics` filtered arrays |
| Export functions | 310–341 | JSON and Markdown download generators |
| Main layout | 343–690 | Header, tabs, sidebar, executive summary |
| Category rendering | 699–1371 | 17 conditional sections for the Visuals view |
| Topic view | 1375–1468 | Accordion-based SWMM5 vs ICM comparison |
| Table view | 1471–1556 | Dense side-by-side reference table |
| Source view | 1558–1645 | File card grid + code dialog |
| Footer | 1760–1884 | Companion tools, version tracker, sources |

### 4.4 Four Viewing Modes

| Mode | Tab Label | Description | Key UI Pattern |
|------|-----------|-------------|----------------|
| **Visuals** | Interactive Diagrams | 117 animated diagrams, calculators, simulators | Category sidebar → responsive grid of `<Card>` wrapped in `<Fav>` |
| **Topic** | Topic Comparison | 15 topics with SWMM5 vs ICM bullet points | `<Accordion>` with star toggles on triggers, expandable to show side-by-side bullet points |
| **Table** | Summary Table | Dense reference table of all topics | `<ScrollArea>` with 3-column grid (`Topic \| SWMM5 \| ICM`), star toggles per row |
| **Source** | Source Code | Browse visualization source code | File card grid → click to open `<Dialog>` with syntax-highlighted code |

### 4.5 17 Diagram Categories (117 Diagrams)

| # | Category Key | Display Name | Icon | Count | Primary Component Files |
|---|-------------|-------------|------|-------|------------------------|
| 0 | `favorites` | Favorites | Star | dynamic | (renders favorited items from any category) |
| 1 | `solver` | Solver Mechanics | Cpu | 16 | SolverDiagrams, SolverMechanicsExtra, CalculatorDiagrams, ReviewDiagrams, NodeAnimations |
| 2 | `options` | Solver Options | Settings | 8 | SolverOptionsDiagrams, SolverOptionsExtra |
| 3 | `dynwave` | Dynamic Wave Options | Zap | 10 | DynamicWaveOptionsDiagrams, CalculatorDiagrams |
| 4 | `temporal` | Temporal Dynamics | Clock | 6 | TemporalDynamicsDiagrams, CalculatorDiagrams |
| 5 | `controls` | Operational Controls | Workflow | 3 | OperationalControlsDiagrams |
| 6 | `advanced` | Advanced Analysis | BarChart2 | 10 | AdvancedDiagrams, ReviewDiagrams, TimestepComparisonDiagram |
| 7 | `hydrologic` | Hydrologic | Droplet | 6 | HydrologicDiagrams, HydrologyExtraDiagrams |
| 8 | `climate` | Climate & Infiltration | Cloud | 2 | ClimateInfiltrationDiagrams |
| 9 | `icm` | ICM Simulation | Gauge | 17 | ICMSimulationDiagrams, ICMManholeSimulator, ReviewDiagrams, NodeAnimations |
| 10 | `inlets` | Surface-to-Sewer | Grid3X3 | 4 | InletDiagrams |
| 11 | `green` | Green Infrastructure | Leaf | 3 | GreenInfraDiagrams |
| 12 | `architecture` | Code Architecture | Code | 5+ | ArchitecturalDiagrams |
| 13 | `boundary` | Boundary Conditions | MapPin | 4 | BoundaryDiagrams |
| 14 | `scenarios` | Real-World Scenarios | FlaskConical | 4 | ScenarioDiagrams |
| 15 | `performance` | Performance & Topology | AlertTriangle | 6 | PerformanceDiagrams |
| 16 | `historical` | Historical Engineering | Landmark | 13 | HistoricalAnimations, HistoricalAnimations2, HistoricalAnimations3 |

### 4.6 27 Visual Component Files — Complete Export Map

Every file in `client/src/components/visuals/` exports named React components. Below is the complete map:

#### SolverDiagrams.tsx (953 lines)
| Export | Fav ID | Description |
|--------|--------|-------------|
| `DiscretizationDiagram` | `d-discretization` | Spatial discretization showing nodes and conduits |
| `PreissmannSlotDiagram` | `d-preissmann-slot` | Preissmann Slot method for pressurized flow |
| `WavePropagationDiagram` | `d-wave-propagation` | Wave routing method comparison (Kinematic/Diffusion/Dynamic) |
| `DryNetworkDiagram` | `d-dry-network` | Dry conduit and low-flow handling |
| `ManholeVsNodeDiagram` | `d-manhole-vs-node` | SWMM5 Manholes vs ICM Nodes |
| `NodeAreaDiagram` | `d-node-area` | Head/flow calculation point distribution |

#### SolverMechanicsExtra.tsx (565 lines)
| Export | Fav ID | Description |
|--------|--------|-------------|
| `NewtonRaphsonConvergence` | `d-newton-raphson` | Newton-Raphson vs Successive Relaxation iteration |
| `ThetaWeightingAnimation` | `d-theta-weighting` | Preissmann theta parameter effect on damping |
| `StaggeredGridAnimation` | `d-staggered-grid` | Staggered grid H/Q spatial arrangement |

#### SolverOptionsDiagrams.tsx (1,019 lines)
| Export | Fav ID | Description |
|--------|--------|-------------|
| `CFLStabilityDiagram` | `d-cfl-stability` | CFL condition visualization |
| `SurchargeMethodDiagram` | `d-surcharge-method` | Surcharged pipe handling methods |
| `RoutingMethodFlowchart` | `d-routing-flowchart` | Routing method selection logic |
| `AdaptiveTimestepDiagram` | `d-adaptive-timestep` | Adaptive timestep adjustment |
| `ThetaParameterDiagram` | `d-theta-param` | Time-level weighting factor |
| `Coupling1D2DDiagram` | `d-coupling-1d2d` | 1D pipe / 2D surface interaction |

#### SolverOptionsExtra.tsx (476 lines)
| Export | Fav ID | Description |
|--------|--------|-------------|
| `RoutingMethodComparison` | `d-routing-comparison` | Side-by-side routing method results |
| `TimestepInstabilityAnimation` | `d-timestep-instability` | Numerical oscillations from large timesteps |

#### DynamicWaveOptionsDiagrams.tsx (941 lines)
| Export | Fav ID | Description |
|--------|--------|-------------|
| `InertialTermsDiagram` | `d-inertial-terms` | Local/convective inertia in Saint-Venant equations |
| `NormalFlowCriterionDiagram` | `d-normal-flow` | Manning's equation switch criteria |
| `SurchargeMethodDeepDiveDiagram` | `d-surcharge-deep` | Extran vs Slot surcharge methods |
| `VariableTimestepDiagram` | `d-variable-timestep` | Dynamic delta-t adjustment |
| `ConduitLengtheningDiagram` | `d-conduit-lengthening` | Lengthening technique for stability |
| `MinNodalSurfaceAreaDiagram` | `d-min-nodal-area` | Artificial surface area to prevent infinite head |
| `ConvergenceTolerancesDiagram` | `d-convergence-tol` | Head/flow tolerance effects |
| `ParallelThreadsDiagram` | `d-parallel-threads` | Multi-core matrix solving |

#### TemporalDynamicsDiagrams.tsx (640 lines)
| Export | Fav ID | Description |
|--------|--------|-------------|
| `WaveTravelVsTimestepDiagram` | `d-wave-travel` | Wave speed vs timestep comparison |
| `AdaptiveTimestepSimulatorDiagram` | `d-adaptive-sim` | Interactive adaptive timestep demo |
| `ConduitLengtheningCheatCodeDiagram` | `d-conduit-cheat` | Lengthening trade-offs |
| `DryStartVsBaseFlowDiagram` | `d-dry-start` | Empty pipes vs hot start stability |

#### OperationalControlsDiagrams.tsx (503 lines)
| Export | Fav ID | Description |
|--------|--------|-------------|
| `ControlLogicBuilderDiagram` | `d-control-logic` | RTC If/Then/Else building blocks |
| `ExecutionTimelineDiagram` | `d-execution-timeline` | Control rule evaluation sequence |
| `ControllerTypesDiagram` | `d-controller-types` | PID, Step, Logical controllers |

#### AdvancedDiagrams.tsx (1,140 lines)
| Export | Fav ID | Description |
|--------|--------|-------------|
| `ConvergenceSnapshotsDiagram` | `d-convergence-snap` | Iterative convergence progress |
| `MassBalanceErrorDiagram` | `d-mass-balance` | Numerical mass loss visualization |
| `OscillationChallengeDiagram` | `d-oscillation` | Solver settings to eliminate oscillations |
| `WettingFrontDiagram` | `d-wetting-front` | Water progression into dry conduits |
| `TimestepDashboardDiagram` | `d-timestep-dash` | Performance bottleneck identifier |
| `SolverDecisionTreeDiagram` | `d-solver-decision` | Parameter selection guide |

#### HydrologicDiagrams.tsx (737 lines)
| Export | Fav ID | Description |
|--------|--------|-------------|
| `HydrologicWorkflowDiagram` | `d-hydro-workflow` | Rainfall-to-outfall process overview |
| `RunoffProcessDiagram` | `d-runoff-process` | Rainfall to subcatchment runoff |
| `RTKDiagram` | `d-rtk` | RDII method with three triangular hydrographs |
| `BuildupWashoffDiagram` | `d-buildup-washoff` | Pollutant accumulation and removal |

#### HydrologyExtraDiagrams.tsx (689 lines)
| Export | Fav ID | Description |
|--------|--------|-------------|
| `LIDLayerStackAnimation` | `d-lid-layer` | LID control internal layers (surface/soil/storage) |
| `NonlinearReservoirAnimation` | `d-nonlinear-reservoir` | Subcatchment runoff routing |
| `WidthSensitivityAnimation` | `d-width-sensitivity` | Width parameter effect on hydrograph shape |

#### ClimateInfiltrationDiagrams.tsx (614 lines)
| Export | Fav ID | Description |
|--------|--------|-------------|
| `SnowmeltAlgorithmsDiagram` | `d-snowmelt` | Heat Balance vs Degree-Day methods |
| `InfiltrationShootoutDiagram` | `d-infiltration` | Horton vs Green-Ampt vs Curve Number |

#### ICMSimulationDiagrams.tsx (2,125 lines — largest file)
| Export | Fav ID | Description |
|--------|--------|-------------|
| `BaseFlowStabilityDiagram` | `d-baseflow` | Base flow impact on stability |
| `SpatialDiscretizationDiagram` | `d-spatial-discr` | ICM mesh/network discretization |
| `ICMPreissmannSlotDiagram` | `d-icm-preissmann` | ICM's slot implementation |
| `AdaptiveTimeSteppingDiagram` | `d-icm-adaptive` | ICM dynamic timestep |
| `HeadlossTransitionDiagram` | `d-headloss-trans` | Open channel to surcharged transition |
| `ColdStartInitializationDiagram` | `d-cold-start` | Cold start stabilization period |
| `HeadlossJunctionDiagram` | `d-headloss-junction` | Energy losses at pipe junctions |
| `HeadlossSurchargeTransitionDiagram` | `d-headloss-surcharge` | Losses during pressurization |
| `HeadlossInferenceDiagram` | `d-headloss-inference` | Geometry-based coefficient inference |
| `InfoSewerSteadyStateEmulationDiagram` | `d-infosewer` | InfoSewer steady-state emulation in ICM |

#### ICMManholeSimulator.tsx (863 lines)
| Export | Fav ID | Description |
|--------|--------|-------------|
| `ICMManholeSimulator` | `d-manhole-sim` | Canvas-based real-time manhole simulation with gate valve, head-driven orifice outflow (Q=Cd·A·√2gh), and hydrograph charts |

#### InletDiagrams.tsx (836 lines)
| Export | Fav ID | Description |
|--------|--------|-------------|
| `InletElementDiagram` | `d-inlet-element` | Capture and bypass flow at street inlets |
| `HEC22InletCalculatorDiagram` | `d-hec22` | FHWA HEC-22 inlet efficiency calculator |
| `FlowTransitionDiagram` | `d-flow-transition` | Gutter to inlet transition |
| `InletEfficiencyCurvesDiagram` | `d-inlet-efficiency` | Grate/curb opening performance curves |

#### GreenInfraDiagrams.tsx (526 lines)
| Export | Fav ID | Description |
|--------|--------|-------------|
| `LIDvsSUDSDiagram` | `d-lid-suds` | North American LID vs UK SUDS comparison |
| `DualSolverArchitectureDiagram` | `d-dual-solver` | Hydrologic + hydraulic engine routing |

#### ArchitecturalDiagrams.tsx (1,358 lines)
| Export | Fav ID | Description |
|--------|--------|-------------|
| `InputFileParserDiagram` | `d-input-parser` | `.inp` file parsing into C structures |
| `MatrixSolverDiagram` | `d-matrix-solver` | Hydraulic matrix assembly (Ax=b) |
| `RTCRulesDiagram` | `d-rtc-rules` | Real-Time Control rule execution |
| `MassRoutingDiagram` | `d-mass-routing` | Bucket-and-pipe mass routing |
| `SurchargeCodeDiagram` | `d-surcharge-code` | Surcharged node identification logic |
| `GroundwaterExchangeDiagram` | `d-gw-exchange` | Aquifer–sewer pipe interaction |
| `MinorLossesDiagram` | `d-minor-losses` | Local losses (bends, contractions) |
| `ReportingSystemDiagram` | `d-reporting` | Binary output file writing |

#### BoundaryDiagrams.tsx (893 lines)
| Export | Fav ID | Description |
|--------|--------|-------------|
| `OutfallTypesAnimation` | `d-outfall-types` | Free, Tide Gate, Fixed, Stage outfall types |
| `InflowTypesAnimation` | `d-inflow-types` | Direct, DWF, RDII node inflows |
| `TreatmentAtNodesAnimation` | `d-treatment-nodes` | Pollutant removal treatment functions |
| `CoefficientConversionAnimation` | `d-coeff-conversion` | SWMM5 ↔ ICM coefficient conversion |

#### ScenarioDiagrams.tsx (653 lines)
| Export | Fav ID | Description |
|--------|--------|-------------|
| `CSOModelingAnimation` | `d-cso` | Combined Sewer Overflow events and spill logic |
| `DetentionPondAnimation` | `d-detention` | Peak flow attenuation |
| `ParallelPipeAnimation` | `d-parallel-pipe` | Capacity/flow distribution in parallel pipes |
| `CalibrationVisualAnimation` | `d-calibration` | Model vs observed data matching |

#### PerformanceDiagrams.tsx (993 lines)
| Export | Fav ID | Description |
|--------|--------|-------------|
| `LoopDetectionAnimation` | `d-loop-detection` | Dendritic vs looped network solver challenges |
| `BoundaryInfluenceAnimation` | `d-boundary-influence` | Downstream boundary upstream propagation |
| `PerformanceScalingAnimation` | `d-perf-scaling` | Simulation time vs network size |
| `WarningMessagesAnimation` | `d-warnings` | Common warning/error message decoder |
| `SolverEvolutionTimeline` | `d-solver-evolution` | 1970s to present solver development |
| `EquationsSideBySideAnimation` | `d-equations` | Saint-Venant continuity + momentum breakdown |

#### ReviewDiagrams.tsx (775 lines)
| Export | Fav ID | Description |
|--------|--------|-------------|
| `ICMSWMMEngineComparison` | `d-three-engine` | SWMM5 vs ICM SWMM vs ICM InfoWorks table |
| `LiveNetworkComparison` | `d-live-network` | Two solvers running same 5-node network |
| `ForceMainComparison` | `d-force-main` | Hazen-Williams vs Darcy-Weisbach |
| `ConduitLengthSensitivity` | `d-conduit-sensitivity` | Pipe length effect on stable timestep |
| `CommonPitfalls` | `d-migration-pitfalls` | 7 common modeling errors |
| `CompanionToolsFooter` | — | Companion tool links |
| `VersionTracker` | — | Software version tracking |

#### HistoricalAnimations.tsx (808 lines)
| Export | Fav ID | Description |
|--------|--------|-------------|
| `RomanAqueductAnimation` | `d-roman-aqueduct` | Gravity-driven Roman aqueduct flow |
| `DujiangyanAnimation` | `d-dujiangyan` | Ancient Chinese water diversion |
| `IncaFountainAnimation` | `d-inca-fountain` | Machu Picchu stepped cascades |
| `PersianQanatAnimation` | `d-persian-qanat` | Underground tunnel water transport |

#### HistoricalAnimations2.tsx (861 lines)
| Export | Fav ID | Description |
|--------|--------|-------------|
| `IndianStepwellAnimation` | `d-indian-stepwell` | Indian Vav/Baoli hydraulic design |
| `AztecDikeAnimation` | `d-aztec-dike` | Nezahualcóyotl dike system |
| `DutchPolderAnimation` | `d-dutch-polder` | Chain windmill pumping |
| `RomanSiphonAnimation` | `d-roman-siphon` | Inverted siphon valley crossing |

#### HistoricalAnimations3.tsx (824 lines)
| Export | Fav ID | Description |
|--------|--------|-------------|
| `MayaFiltrationAnimation` | `d-maya-filtration` | Zeolite/quartz filtration at Tikal |
| `KhmerBarayAnimation` | `d-khmer-baray` | Angkor reservoir management |
| `CloacaMaximaAnimation` | `d-cloaca-maxima` | Rome's Great Sewer |
| `IndusValleyDrainAnimation` | `d-indus-valley` | Mohenjo-Daro urban drainage |
| `ArchimedesScrewAnimation` | `d-archimedes-screw` | Mechanical water lifting |

#### NodeAnimations.tsx (861 lines)
| Export | Fav ID | Description |
|--------|--------|-------------|
| `BackwaterPropagation` | `d-backwater` | Downstream-to-upstream level propagation |
| `OneDTwoDCoupling` | `d-1d2d-coupling` | Manhole-to-surface 2D interaction |
| `ManholeStorageVolume` | `d-manhole-storage` | Solver-specific manhole volume treatment |
| `FloodTypeComparison` | `d-flood-type` | Ponded, lost, stored, 2D flooding types |

#### DecisionEngineDiagram.tsx (413 lines)
| Export | Fav ID | Description |
|--------|--------|-------------|
| `DecisionEngineDiagram` | — | Interactive solver equation selection flowchart |

#### CalculatorDiagrams.tsx (1,220 lines)
| Export | Fav ID | Description |
|--------|--------|-------------|
| `CFLStabilityCalculator` | `d-cfl-calc` | Stable timestep calculator |
| `PreissmannSlotCalculator` | `d-preissmann-calc` | Slot width calculator |
| `ManningsFlowCalculator` | `d-mannings-calc` | Manning's equation solver |
| `TimeStepEfficiencyEstimator` | `d-timestep-efficiency` | Simulation speedup estimator |
| `FroudeNumberCalculator` | `d-froude-calc` | Flow regime calculator (sub/super/critical) |
| `ComputationalPointsDiagram` | `d-comp-points` | Numerical grid H/Q locations |
| `InertialTermsCalculator` | `d-inertial-calc` | Acceleration term magnitude calculator |
| `SurchargeAlgorithmDiagram` | `d-surcharge-algo` | Pressurized flow transition logic |
| `SurfaceFloodingDiagram` | `d-surface-flooding` | Ponded volume vs 2D mesh comparison |

#### TimestepComparisonDiagram.tsx (598 lines)
| Export | Fav ID | Description |
|--------|--------|-------------|
| `TimestepComparisonDiagram` | `d-timestep-comparison` | Perfect vs large vs small timestep dashboard |

### 4.7 Interactive Calculators

The app includes **8+ interactive calculators** with slider inputs. All respect the global USA/SI toggle.

| Calculator | Fav ID | File | Inputs | Output |
|-----------|--------|------|--------|--------|
| CFL Stability | `d-cfl-calc` | CalculatorDiagrams | Velocity, depth, conduit length, timestep | CFL number, stability verdict |
| Preissmann Slot | `d-preissmann-calc` | CalculatorDiagrams | Pipe diameter, slot width factor | Slot width, wave speed |
| Manning's Flow | `d-mannings-calc` | CalculatorDiagrams | Slope, roughness, diameter, depth ratio | Flow rate, velocity |
| TimeStep Efficiency | `d-timestep-efficiency` | CalculatorDiagrams | Network size, timestep | Simulation time estimate |
| Froude Number | `d-froude-calc` | CalculatorDiagrams | Velocity, depth | Froude number, flow regime |
| Computational Points | `d-comp-points` | CalculatorDiagrams | Conduit length, spacing | Number of computational points |
| Inertial Terms | `d-inertial-calc` | CalculatorDiagrams | Flow parameters | Inertial term magnitudes |
| HEC-22 Inlet | `d-hec22` | InletDiagrams | Road geometry, flow | Inlet capture efficiency |

**Key design decision:** Sliders maintain their ranges in US units internally. Only the displayed labels and formatted values change when switching to SI.

### 4.8 Units Toggle (USA / SI)

**File:** `client/src/contexts/UnitsContext.tsx` (130 lines)

**Types:**
```typescript
type UnitSystem = "USA" | "SI";

interface UnitLabels {
  length, lengthSmall, flow, velocity, area, volume, slope, rainfall, pressure, diameter, flowSmall: string;
}

interface ConversionFunctions {
  length, lengthSmall, flow, velocity, area, volume, rainfall, pressure, diameter, flowSmall: (val: number) => number;
}

interface UnitsContextType {
  unitSystem: UnitSystem;
  setUnitSystem: (s: UnitSystem) => void;
  toggleUnits: () => void;
  u: UnitLabels;
  conv: ConversionFunctions;
  fmt: (val: number, decimals?: number) => string;
}
```

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

**`fmt(val, decimals=2)`** — Formats a number to the specified decimal places.

**Usage pattern in components:**
```typescript
const { u, conv, fmt } = useUnits();
// Display: {fmt(conv.length(valueInFeet))} {u.length}
// USA result: "10.00 ft"
// SI result:  "3.05 m"
```

### 4.9 Favorites System

**File:** `client/src/contexts/FavoritesContext.tsx` (67 lines)

**Types:**
```typescript
interface FavoritesContextType {
  favorites: Set<string>;
  toggleFavorite: (id: string) => void;
  isFavorite: (id: string) => boolean;
  count: number;
  clearAll: () => void;
}
```

**How it works:**
1. `FavoritesProvider` wraps the app (in `App.tsx`, inside `UnitsProvider`)
2. Stores a `Set<string>` of favorite IDs in React state
3. Persisted to `localStorage` under key `swmm-icm-favorites` (JSON-serialized array)
4. Loaded from `localStorage` on mount via `loadFavorites()` helper
5. Saved to `localStorage` on every toggle via `saveFavorites()` helper

**ID Conventions:**
| Prefix | Type | Example |
|--------|------|---------|
| `d-` | Diagram | `d-preissmann-slot`, `d-roman-aqueduct`, `d-cfl-calc` |
| `t-` | Comparison Topic | `t-governing_equations`, `t-pressurisation_surcharge` |

**UI Components (defined in `dashboard.tsx`):**

- **`FavoriteButton({ id })`** — Absolute-positioned star icon (`absolute top-3 right-3 z-10`). Yellow fill (`fill-yellow-500`) when active, muted when inactive. Calls `toggleFavorite(id)` on click with `stopPropagation` to prevent parent element activation.
- **`Fav({ id, children })`** — `<div className="relative">` wrapper that overlays a `FavoriteButton`. Every diagram in every category is wrapped: `<Fav id="d-slug"><DiagramComponent /></Fav>`
- **Topic stars (accordion)** — Inline star buttons on each `AccordionTrigger` in Topic view. Uses `t-{topic.key}` IDs with `stopPropagation` to prevent accordion toggle.
- **Topic stars (table)** — Inline star buttons in each table row's Topic cell.
- **Favorites category** — First entry in `DIAGRAM_CATEGORIES` array, rendered with yellow star icon and red badge showing `favCount` in the category sidebar.
- **Favorites view** — When selected, renders:
  - Empty state (dashed border card with guidance text) when `favCount === 0`
  - "Saved Diagrams" section showing `favoritedDiagrams` with category badge overlays
  - "Saved Comparisons" section showing `favoritedTopics` in expandable accordion
  - "Clear All" button (destructive variant) to reset all favorites

**`DIAGRAM_REGISTRY`** (lines 184–303 in dashboard.tsx) — Array of 117 entries mapping each diagram `id` to its `label`, `category`, and React `component` JSX. Used to resolve favorited diagram IDs back to renderable components in the Favorites view.

### 4.10 Dark Mode / Theme System

**File:** `client/src/hooks/use-theme.tsx` (46 lines)

**Types:**
```typescript
type Theme = "light" | "dark";
interface ThemeContextType {
  theme: Theme;
  toggleTheme: () => void;
}
```

**How it works:**
- Stores theme preference in `localStorage`
- Toggles a `dark` CSS class on the document root element
- Uses CSS variables defined in `client/src/index.css` for all colors
- Blue-themed palette in both light and dark modes
- Toggle button in the dashboard header shows Sun/Moon icon

### 4.11 Export System (JSON & Markdown)

Both exports are **client-side only** (no server calls). Defined as functions in `dashboard.tsx`.

**JSON Export:**
- Downloads the entire `KB` object from `comparison-data.ts`
- Creates a Blob and triggers download via temporary anchor element
- Filename: `swmm5-icm-comparison.json`
- Contains all topics, bullet points, and source references

**Markdown Export:**
- Generates a formatted `.md` document programmatically
- Includes: title, summary table, all 15 comparison topics with bullet points, source list
- Filename: `swmm5-icm-comparison.md`

### 4.12 Executive Summary Card

Always visible at the top of Visuals and Topic views. Provides a quick-reference comparison table:

| Aspect | SWMM5 | ICM |
|--------|-------|-----|
| Solution Method | Explicit / link-node | Implicit / distributed |
| Discretization | Node-link lumped | 4-point Preissmann Box |
| Best For | Urban drainage design | Complex integrated modeling |

### 4.13 TOPIC_DIAGRAM_MAP — Cross-Referencing

Defined at lines ~116–130 in `dashboard.tsx`. Maps textual comparison topics to related interactive diagrams.

**Current mappings:**

| Topic Key | Related Diagrams (category) |
|-----------|---------------------------|
| `pressurisation_surcharge` | Preissmann Slot (solver), ICM Preissmann Slot (icm), Surcharge Method (options) |
| `time_step_control` | CFL Stability (options), Adaptive Timestep (options) |
| `governing_equations` | Wave Propagation (solver) |
| `discretisation_unknowns` | Discretization (solver) |
| `node_surface_area` | Node Area (solver) |
| `nonlinear_solver` | Convergence (advanced) |
| `dry_network_handling` | Dry Network (solver) |
| `conduit_models` | Coupling 1D-2D (options) |

Clicking a "Related Diagram" button in Topic or Table view switches to Visuals mode and selects the correct category.

### 4.14 DIAGRAM_REGISTRY — Component Resolution

Defined inside the `Dashboard` component (lines 184–303) as a const array of 117 objects:

```typescript
const DIAGRAM_REGISTRY: { id: string; label: string; category: string; component: ReactNode }[] = [
  { id: "d-discretization", label: "Spatial Discretization", category: "solver", component: <DiscretizationDiagram /> },
  { id: "d-preissmann-slot", label: "Preissmann Slot", category: "solver", component: <PreissmannSlotDiagram /> },
  // ... 115 more entries
];
```

This registry serves two purposes:
1. **Favorites view rendering** — When a diagram ID is favorited, the registry resolves it to the actual React component for rendering
2. **Category badge** — Each entry's `category` field is used to show which category a favorited diagram belongs to

---

## 5. Backend Deep Dive

The backend is minimal and exists primarily to serve the frontend.

### server/index.ts — Entry Point
- Creates Express app with JSON and URL-encoded body parsing
- Custom request logger that intercepts `res.json` to log API responses and timing
- Filters logging to only `/api` prefixed routes
- In **development**: loads Vite middleware for HMR via `setupVite()`
- In **production**: serves static files from `dist/public` via `serveStatic()`
- Listens on `PORT` env var (default 5000) on `0.0.0.0`
- Global error handler returns 500 for unhandled exceptions

### server/routes.ts — API Routes
- Exports `registerRoutes(app)` function
- Currently a **stub** with no active endpoints
- Prepared to receive routes prefixed with `/api`
- All application data is client-side; no API calls are needed for current functionality

### server/storage.ts — Data Persistence
- `IStorage` interface: `getUser(id)`, `getUserByUsername(username)`, `createUser(user)`
- `MemStorage` class: in-memory implementation using a JavaScript `Map`
- Uses `crypto.randomUUID()` for ID generation
- Exports a singleton `storage` instance

### server/vite.ts — Development Server
- `setupVite(app, server)` creates Vite server in `middlewareMode`
- Catch-all `*` handler reads `client/index.html`, injects versioned `main.tsx` script tag, and serves Vite-transformed HTML
- Only active in development (`NODE_ENV !== "production"`)

### server/static.ts — Production Static Serving
- `serveStatic(app)` serves built assets from `dist/public`
- Fallback to `index.html` for client-side routing support

---

## 6. Data Layer

### 6.1 comparison-data.ts — Knowledge Base

**File:** `client/src/data/comparison-data.ts` (294 lines)

Contains the `KB` (Knowledge Base) object and `TOPIC_ORDER` array.

**KB Structure:**
```typescript
const KB = {
  swmm5: {
    product: "EPA SWMM 5",
    tagline: "Node–link dynamic-wave solver using an implicit backward Euler formulation...",
    topics: {
      governing_equations: ["bullet 1", "bullet 2"],
      // ... 15 topics
    },
    sources: [
      { label: "...", url: "...", notes: "..." },
      // 9 entries
    ]
  },
  icm: {
    product: "InfoWorks ICM",
    tagline: "Distributed 1D Saint-Venant solver using a Preissmann 4‑point implicit scheme...",
    topics: { /* same 15 keys */ },
    sources: [
      // 8 entries
    ]
  }
};
```

**15 Technical Topics:**

| # | Topic Key | Topic Label | SWMM5 Bullets | ICM Bullets |
|---|-----------|-------------|:---:|:---:|
| 1 | `governing_equations` | Governing equations | 2 | 5 |
| 2 | `discretisation_unknowns` | Spatial discretisation and primary unknowns | 5 | 6 |
| 3 | `node_surface_area` | Node/manhole surface area treatment | 5 | 5 |
| 4 | `time_integration` | Time integration scheme | 4 | 5 |
| 5 | `nonlinear_solver` | Nonlinear solution method and convergence | 5 | 4 |
| 6 | `time_step_control` | Time-step control and stability management | 4 | 4 |
| 7 | `pressurisation_surcharge` | Pressurised flow and surcharge handling | 4 | 5 |
| 8 | `inertia_supercritical_handling` | Inertia/supercritical handling | 4 | 4 |
| 9 | `stability_devices` | Additional numerical stabilisation devices | 4 | 4 |
| 10 | `conduit_models` | Conduit solution models | 4 | 6 |
| 11 | `engine_integration` | Engine integration and platform context | 5 | 5 |
| 12 | `dry_network_handling` | Dry network handling and initialization | 6 | 5 |
| 13 | `stability_robustness` | Comparative stability and robustness | 4 | 4 |
| 14 | `use_case_strengths` | Primary use cases and strengths | 3 | 3 |
| 15 | `practical_implications` | Practical implications for modelers | 5 | 5 |
| | **Total** | | **64** | **70** |

**SWMM5 Sources (9 entries):**
1. SWMM 5 Reference Manual, Vol. II — Hydraulics (Rossman, May 2017)
2. SWMM 5 Reference Manual Vol. II Addendum — Preissmann Slot (Feb 2022)
3. SWMM 5.1 User's Manual (Aug 2015)
4. EPA SWMM Website
5. EPA/600/R-06/097 — SWMM QA Report (Sept 2006)
6. SWMM5 Source Code on GitHub
7. swmm5.org — Community Resources
8. QA/QC Hydraulic Comparison of ICM, SWMM5 and XPSWMM (ICWMM 2018)
9. OpenSWMM Discussion — InfoWorks and Stability

**ICM Sources (8 entries):**
1. InfoWorks ICM Online Help — Hydraulic Theory
2. Autodesk InfoWorks ICM Product Overview
3. Autodesk Blog — Switch from InfoSWMM to InfoWorks ICM (May 2023)
4. Autodesk Blog — Does InfoWorks ICM Use the SWMM Engine? (June 2024)
5. QA/QC Hydraulic Comparison (ICWMM 2018) [shared with SWMM5]
6. Aquamod — InfoWorks ICM Overview
7. OpenSWMM Discussion [shared with SWMM5]
8. Chaudhry, M.H. — Open-Channel Flow (Textbook)

### 6.2 source-code-snippets.ts — Source Viewer Data

**File:** `client/src/data/source-code-snippets.ts` (1,273 lines)

**`SOURCE_CODE_FILES`** — Contains actual source code as template literal strings for 10 files:
1. `ClimateInfiltrationDiagrams.tsx`
2. `SolverDiagrams.tsx`
3. `ICMSimulationDiagrams.tsx`
4. `HydrologicDiagrams.tsx`
5. `ArchitecturalDiagrams.tsx`
6. `GreenInfraDiagrams.tsx`
7. `SolverOptionsDiagrams.tsx`
8. `AdvancedDiagrams.tsx`
9. `InletDiagrams.tsx`
10. `comparison_tool.py`

**`FILE_PATHS`** — Maps filenames to repository paths for 15 files:
```
SolverDiagrams.tsx → client/src/components/visuals/SolverDiagrams.tsx
SolverOptionsDiagrams.tsx → ...
DynamicWaveOptionsDiagrams.tsx → ...
TemporalDynamicsDiagrams.tsx → ...
OperationalControlsDiagrams.tsx → ...
AdvancedDiagrams.tsx → ...
TimestepComparisonDiagram.tsx → ...
HydrologicDiagrams.tsx → ...
ClimateInfiltrationDiagrams.tsx → ...
GreenInfraDiagrams.tsx → ...
ArchitecturalDiagrams.tsx → ...
ICMSimulationDiagrams.tsx → ...
InletDiagrams.tsx → ...
comparison-data.ts → ...
comparison_tool.py → ...
```

**Note:** These are static snapshots — they do not auto-update when component files change.

### 6.3 Database Schema

**File:** `shared/schema.ts`

```typescript
import { pgTable, text, serial } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;
```

**Note:** The database is configured but not actively used. All app content is static TypeScript data. The schema exists as a foundation for future features.

---

## 7. Build System & Scripts

### package.json Scripts

| Script | Command | Purpose |
|--------|---------|---------|
| `dev` | `NODE_ENV=development tsx server/index.ts` | Full-stack development with Vite HMR |
| `build` | `tsx script/build.ts` | Production build (client + server) |
| `start` | `NODE_ENV=production node dist/index.cjs` | Run production server |
| `dev:client` | `vite dev --port 5000` | Client-only dev server |
| `check` | `tsc` | TypeScript type checking (no emit) |
| `db:push` | `drizzle-kit push` | Push Drizzle schema to PostgreSQL |

### script/build.ts — Custom Build Process

1. Clears the `dist` directory
2. **Client build:** Calls Vite's `build()` function → outputs to `dist/public/`
3. **Server build:** Uses esbuild to bundle `server/index.ts` → outputs `dist/index.cjs`
4. **Bundling strategy:** An allowlist of dependencies (express, drizzle-orm, zod, etc.) are bundled into the server executable to reduce cold start times. Other dependencies are marked as `external`.

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
- **Strict mode:** Enabled
- **Paths:** Match Vite aliases (`@/*`, `@shared/*`)
- **Includes:** `client/src/**/*`, `shared/**/*`, `server/**/*`
- **No emit:** `true` (transpilation handled by Vite/esbuild)
- **allowImportingTsExtensions:** `true`

### drizzle.config.ts
- **Dialect:** PostgreSQL
- **Schema:** `./shared/schema.ts`
- **Output:** `./migrations`
- **Connection:** `DATABASE_URL` environment variable

### postcss.config.js
- Plugins: `tailwindcss`, `autoprefixer`

### components.json
- shadcn/ui configuration pointing to `client/src/components/ui/`

### .replit
- **Modules:** `nodejs-20`, `web`, `postgresql-16`
- **Run command:** `npm run dev`
- **Port mapping:** Internal 5000 → external 80
- **Deployment build:** `npm run build`
- **Deployment run:** `node ./dist/index.cjs`
- **Workflow:** "Project" workflow executes `npm run dev` and waits for port 5000

---

## 9. UI Component Library

The app uses **55 shadcn/ui** components — a copy-paste React library built on **Radix UI** primitives. Located in `client/src/components/ui/`.

**Layout:** Card, Dialog, Sheet, Drawer, Tabs, Accordion, Collapsible, Separator, Resizable
**Forms:** Input, Textarea, Select, Checkbox, Radio Group, Switch, Slider, Label, Form, Field
**Feedback:** Toast, Toaster, Alert, Badge, Progress, Spinner, Skeleton
**Navigation:** Navigation Menu, Menubar, Breadcrumb, Pagination, Sidebar
**Overlay:** Popover, Tooltip, Hover Card, Context Menu, Dropdown Menu, Command, Alert Dialog
**Data Display:** Table, Scroll Area, Aspect Ratio, Avatar, Carousel, Chart

**Styling approach:**
- All components use Tailwind CSS utility classes
- `cn()` utility merges classes using `tailwind-merge` + `clsx`
- `class-variance-authority` (CVA) manages component variants
- CSS variables in `index.css` define the color palette

---

## 10. CSS Theming System

**File:** `client/src/index.css`

Uses Tailwind CSS v4 with HSL-format CSS variables on `:root` (light) and `.dark` (dark).

**Key CSS Variables:**

| Variable | Light Mode (HSL) | Dark Mode (HSL) | Purpose |
|----------|-----------------|-----------------|---------|
| `--background` | `214 32% 97%` (pale blue-grey) | `220 25% 7%` (deep charcoal) | Page background |
| `--foreground` | `214 27% 17%` | `210 20% 90%` | Primary text |
| `--card` | `214 40% 100%` (white) | `220 25% 10%` | Card surfaces |
| `--primary` | `217 91% 50%` (vibrant blue) | `213 94% 56%` (lighter blue) | Buttons, links |
| `--secondary` | `214 25% 93%` | `217 25% 18%` | Secondary elements |
| `--muted` | `214 20% 90%` | `217 25% 15%` | Muted backgrounds |
| `--destructive` | `0 84% 60%` | `0 62% 30%` | Delete, errors |
| `--border` | `214 25% 87%` | `217 20% 18%` | Borders |
| `--ring` | `217 91% 50%` | `213 94% 56%` | Focus rings |
| `--chart-1` through `--chart-5` | Various | Various | Chart colors |
| `--sidebar-*` | Various | Various | Sidebar-specific colors |

**Theme Toggle Mechanism:**
1. `useTheme()` hook reads/writes theme to `localStorage`
2. Adds/removes `dark` class on `document.documentElement`
3. All Tailwind `dark:` variants respond automatically
4. Moon/Sun icon button in dashboard header triggers `toggleTheme()`

---

## 11. Animation & Visualization Patterns

### SVG Animations (most diagrams)
```tsx
const [time, setTime] = useState(0);
useEffect(() => {
  const id = setInterval(() => setTime(t => (t + 1) % 100), 50);
  return () => clearInterval(id);
}, []);
// SVG elements use `time` for positions, opacity, transforms
```

**Standard viewBox:** `"0 0 400 280"` or `"0 0 400 300"`

### Canvas Animations (ICM Manhole Simulator)
- Canvas ref with `useEffect` for draw loops
- Head-driven orifice outflow: Q = Cd · A · √(2gh)
- Real-time hydrograph charting
- Gate valve with animated open/close

### Color Conventions
| Color | Hex | Used For |
|-------|-----|----------|
| Blue | `#3b82f6` | Water/hydraulic head, SWMM5 elements |
| Orange | `#f97316` | Flow/discharge, warnings |
| Green | `#22c55e` | ICM elements, convergence, success |
| Amber | `#f59e0b` | Caution, intermediate states, favorites |
| Red | `#ef4444` | Errors, instability, divergence |
| Yellow | `#eab308` | Favorite stars (fill-yellow-500) |

### Interactive Controls
- **Sliders** (`<Slider>`) control animation parameters (depth, flow, velocity, etc.)
- **Buttons** toggle animation states (play/pause, reset)
- **Badges** display computed values with current units

### Framer Motion
Used selectively for entrance animations and smooth transitions (not for core SVG animations).

### Standard Component Pattern
```tsx
export function DiagramName() {
  const { u, conv, fmt } = useUnits();
  const [state, setState] = useState(initialValue);
  
  useEffect(() => {
    const id = setInterval(() => { /* animate */ }, 50);
    return () => clearInterval(id);
  }, []);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Diagram Title</CardTitle>
        <CardDescription>Brief description</CardDescription>
      </CardHeader>
      <CardContent>
        <svg viewBox="0 0 400 280">
          {/* Animated SVG elements using state */}
        </svg>
        <Slider value={[state]} onValueChange={([v]) => setState(v)} />
        <Badge>Value: {fmt(conv.length(val))} {u.length}</Badge>
      </CardContent>
    </Card>
  );
}
```

---

## 12. Unit Conversion System — Full Reference

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
  // USA: "10.00 ft"
  // SI:  "3.05 m"
```

### Pattern for Adding a New Unit

1. Add label to both `usaLabels` and `siLabels` in `UnitsContext.tsx`
2. Add identity function to `usaConversions` and multiplier function to `siConversions`
3. Update the `UnitLabels` and `ConversionFunctions` TypeScript interfaces
4. Use in components: `{fmt(conv.newUnit(value))} {u.newUnit}`

### Files Modified for Units
All 27 visual component files import and use `useUnits()`. No hardcoded unit strings remain in display text.

---

## 13. Favorites System — Full Reference

### Architecture
```
FavoritesProvider (App.tsx)
  └── favorites: Set<string>          ← React state
  └── localStorage "swmm-icm-favorites" ← persistence
  
Dashboard:
  └── DIAGRAM_REGISTRY[117]           ← ID → component resolution
  └── <Fav id="d-xxx"> wrapper        ← star overlay on every diagram
  └── Star buttons on Topic accordion ← t-{key} IDs
  └── Star buttons on Table rows      ← t-{key} IDs
  └── Favorites category view         ← renders saved items
```

### Data Flow

1. User clicks star → `toggleFavorite("d-preissmann-slot")` called
2. `FavoritesContext` adds/removes from `Set<string>` state
3. `saveFavorites()` serializes Set to JSON array → writes `localStorage`
4. `favCount` updates → badge count in sidebar refreshes
5. When user visits Favorites category:
   - `favoritedDiagrams = DIAGRAM_REGISTRY.filter(d => isFavorite(d.id))`
   - `favoritedTopics = TOPIC_ORDER.filter(t => isFavorite(\`t-${t.key}\`))`
   - Both arrays rendered with their original components

### localStorage Format
```json
["d-preissmann-slot", "d-cfl-calc", "t-governing_equations", "d-roman-aqueduct"]
```

---

## 14. Deployment & Production

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

## 15. Key Dependencies — Complete List

### Runtime Dependencies
| Package | Version | Purpose |
|---------|---------|---------|
| `react` | ^19.2.0 | UI framework |
| `react-dom` | ^19.2.0 | React DOM rendering |
| `wouter` | ^3.3.5 | Lightweight client-side routing |
| `@tanstack/react-query` | ^5.60.5 | Server state management |
| `express` | ^4.21.2 | HTTP server |
| `framer-motion` | ^12.23.24 | Animation library |
| `drizzle-orm` | ^0.39.3 | ORM (configured, not actively queried) |
| `zod` | ^3.25.76 | Schema validation |
| `drizzle-zod` | ^0.7.0 | Drizzle-to-Zod schema generation |
| `lucide-react` | latest | Icon library (33+ icons used) |
| `class-variance-authority` | latest | Component variant management |
| `tailwind-merge` | latest | Tailwind class deduplication |
| `clsx` | latest | Conditional class names |
| `date-fns` | latest | Date formatting utilities |
| `pg` | latest | PostgreSQL client |
| `connect-pg-simple` | latest | Session storage (available) |
| `passport` | latest | Authentication (available, not active) |
| `passport-local` | latest | Local auth strategy (available, not active) |
| `@radix-ui/*` | v1.x | Full suite of headless UI primitives |

### Dev Dependencies
| Package | Version | Purpose |
|---------|---------|---------|
| `vite` | ^5.x | Build tool and dev server |
| `typescript` | ^5.x | Type checking |
| `tsx` | latest | TypeScript execution for Node.js |
| `esbuild` | latest | Server bundling |
| `@vitejs/plugin-react` | latest | React support for Vite |
| `@tailwindcss/vite` | latest | Tailwind CSS v4 Vite plugin |
| `tailwindcss` | ^4.1.14 | CSS framework |
| `drizzle-kit` | latest | Database migration tooling |

---

## 16. Common Patterns & Conventions

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
- Favorite IDs: `d-{kebab-slug}` for diagrams, `t-{topic_key}` for topics

### State Management
- **Local state:** `useState` for component-specific animation/interaction state
- **Context:** `UnitsContext` for global unit system, `FavoritesContext` for bookmark persistence, `ThemeProvider` for theme
- **Persistence:** Favorites in `localStorage` (`swmm-icm-favorites`), theme in `localStorage`
- **Server state:** TanStack React Query (configured but minimally used since data is static)

### Import Aliases
```typescript
import { Component } from "@/components/ui/component";  // → client/src/
import { schema } from "@shared/schema";                  // → shared/
import { asset } from "@assets/file";                     // → attached_assets/
```

### Animation Conventions
- **Interval:** 50ms (`setInterval(() => { ... }, 50)`) for smooth 20fps SVG animation
- **Cleanup:** Always `return () => clearInterval(id)` in `useEffect`
- **Modular time:** `setTime(t => (t + 1) % cycleLength)` for looping animations
- **State-driven rendering:** No imperative DOM manipulation; all animation via React state

---

## 17. File Size Reference

| File | Lines | Role |
|------|------:|------|
| `ICMSimulationDiagrams.tsx` | 2,125 | Largest visual component |
| `dashboard.tsx` | 1,884 | Main application page |
| `ArchitecturalDiagrams.tsx` | 1,358 | Code structure diagrams |
| `source-code-snippets.ts` | 1,273 | Source viewer data |
| `CalculatorDiagrams.tsx` | 1,220 | Interactive calculators |
| `AdvancedDiagrams.tsx` | 1,140 | Stability/convergence diagrams |
| `SolverOptionsDiagrams.tsx` | 1,019 | Routing/timestep options |
| `PerformanceDiagrams.tsx` | 993 | Performance scaling diagrams |
| `SolverDiagrams.tsx` | 953 | Core solver visualizations |
| `DynamicWaveOptionsDiagrams.tsx` | 941 | SWMM5 dynamic wave settings |
| `BoundaryDiagrams.tsx` | 893 | Boundary condition animations |
| `ICMManholeSimulator.tsx` | 863 | Canvas-based manhole sim |
| `NodeAnimations.tsx` | 861 | Node-level animations |
| `HistoricalAnimations2.tsx` | 861 | Indian Stepwell, Aztec, Dutch, Roman |
| `InletDiagrams.tsx` | 836 | Surface-to-sewer diagrams |
| `HistoricalAnimations3.tsx` | 824 | Maya, Khmer, Cloaca, Indus, Archimedes |
| `HistoricalAnimations.tsx` | 808 | Roman Aqueduct, Dujiangyan, Inca, Persian |
| `ReviewDiagrams.tsx` | 775 | Three-engine comparison, live network |
| `HydrologicDiagrams.tsx` | 737 | Rainfall-runoff diagrams |
| `HydrologyExtraDiagrams.tsx` | 689 | LID, nonlinear reservoir, width |
| `ScenarioDiagrams.tsx` | 653 | CSO, detention, calibration |
| `TemporalDynamicsDiagrams.tsx` | 640 | CFL, adaptive stepping |
| `ClimateInfiltrationDiagrams.tsx` | 614 | Snowmelt, infiltration |
| `TimestepComparisonDiagram.tsx` | 598 | Timestep accuracy dashboard |
| `SolverMechanicsExtra.tsx` | 565 | Newton-Raphson, theta, grid |
| `GreenInfraDiagrams.tsx` | 526 | LID/SUDS, dual solver |
| `OperationalControlsDiagrams.tsx` | 503 | RTC logic, PID controllers |
| `SolverOptionsExtra.tsx` | 476 | Routing comparison, instability |
| `DecisionEngineDiagram.tsx` | 413 | Decision flowchart |
| `comparison-data.ts` | 294 | Knowledge base data |
| `UnitsContext.tsx` | 130 | Unit toggle context |
| `FavoritesContext.tsx` | 67 | Favorites context |
| `use-theme.tsx` | 46 | Theme toggle hook |
| `App.tsx` | 38 | Root component |
| `use-mobile.tsx` | 19 | Mobile detection hook |
| **Total** | **~26,900** | |

---

## 18. Known Limitations & Future Work

### Current Limitations
1. **No user accounts** — The users table schema exists but no auth is implemented
2. **No server-side data** — All content is hardcoded in TypeScript files; there's no CMS or API
3. **Source code snapshots** — The Source tab shows static strings (10 of 27 files), not live file reads
4. **TOPIC_DIAGRAM_MAP incomplete** — Only 8 of 15 topics have cross-references; newer categories (boundary, scenarios, performance, historical) work independently via the Visuals tab
5. **No search** — No full-text search across diagrams or topics
6. **No mobile optimization** — Sidebar layout may not be ideal on small screens
7. **No i18n** — English only (unit labels change but all text is English)
8. **Favorites are device-local** — Stored in `localStorage`, not synced across devices or browsers

### Potential Future Features
- User authentication and saved preferences (sync favorites to server)
- Full-text search across all diagrams and topics
- Printable PDF export
- Additional unit systems (e.g., Australian, UK variations)
- Database-backed content for easier updates
- Live source code reading from filesystem (all 27 files)
- Responsive mobile layout improvements
- Additional solver comparisons (e.g., MIKE URBAN, HEC-RAS)
- Complete TOPIC_DIAGRAM_MAP for all 15 topics

---

## 19. Quick Start Guide

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
4. Import in `dashboard.tsx` and render in the appropriate category section
5. Wrap with `<Fav id="d-unique-slug">` for favorites support
6. Add an entry to `DIAGRAM_REGISTRY` (inside `Dashboard` component) with matching ID, label, and category
7. Update the diagram count in `DIAGRAM_CATEGORIES` and the header badge
8. Optionally add a cross-reference in `TOPIC_DIAGRAM_MAP`
9. Optionally add source code to `source-code-snippets.ts` for the Source tab

### Adding a New Category

1. Add a new entry to the `DIAGRAM_CATEGORIES` array in `dashboard.tsx` (after `favorites`)
2. Add the icon mapping in the category menu's `IconComponent` conditional chain
3. Create the visual component file(s) in `components/visuals/`
4. Add the conditional rendering section (`{activeCategory === "newkey" && ...}`) in the Visuals view
5. Update the total diagram count in the header
6. Update `DIAGRAM_REGISTRY` with all new diagram entries

### Adding a New Unit Type

1. Add label to `usaLabels` and `siLabels` in `UnitsContext.tsx`
2. Add identity function to `usaConversions`, multiplier to `siConversions`
3. Update `UnitLabels` and `ConversionFunctions` TypeScript interfaces
4. Use in components: `{fmt(conv.newUnit(value))} {u.newUnit}`

---

**End of Handover Document**

**Document Statistics:**
- 19 sections covering every aspect of the codebase
- Complete export map for all 117 diagrams across 27 component files
- Full API reference for all 3 contexts and 3 hooks
- Complete dependency list with versions
- Line-count reference for every source file
