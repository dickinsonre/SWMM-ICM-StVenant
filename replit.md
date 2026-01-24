# SWMM5 vs ICM - Saint-Venant Comparison Tool

## Overview

This is an educational web application that provides a structured comparison of how EPA SWMM 5 and InfoWorks ICM solve the 1D Saint-Venant equations for unsteady flow in hydraulic modeling. The app allows users to browse technical comparisons by topic, view side-by-side summary tables, and export content to Markdown or JSON formats.

The application features **63 interactive diagrams** organized across **12 categories**, multiple viewing modes, and comprehensive source code documentation.

## User Preferences

Preferred communication style: Simple, everyday language.

## Diagram Categories (63 Total)

1. **Solver Mechanics** (7 diagrams) - Core solver algorithms, discretization, wave propagation
2. **Solver Options** (6 diagrams) - Routing methods, adaptive timesteps, CFL stability
3. **Dynamic Wave Options** (8 diagrams) - Inertial terms, surcharge methods, convergence
4. **Temporal Dynamics** (4 diagrams) - CFL conditions, adaptive stepping, startup behavior
5. **Operational Controls** (3 diagrams) - RTC logic, PID controllers, execution timeline
6. **Advanced Analysis** (8 diagrams) - Convergence, mass balance, oscillation challenges
7. **Hydrologic** (4 diagrams) - Unit hydrographs, rainfall distribution
8. **Climate & Infiltration** (2 diagrams) - Snowmelt, infiltration methods
9. **ICM Simulation** (10 diagrams) - Base flow, Preissmann slot, headloss, InfoSewer emulation
10. **Surface-to-Sewer** (4 diagrams) - Inlet elements, HEC-22 calculator
11. **Green Infrastructure** (2 diagrams) - LID/SUDS, dual-solver architecture
12. **Code Architecture** (5 diagrams) - Input parsing, matrix solver, RTC rules

## System Architecture

### Frontend Architecture
- **Framework**: React 18 with TypeScript
- **Routing**: Wouter (lightweight alternative to React Router)
- **State Management**: TanStack React Query for server state
- **UI Components**: shadcn/ui component library built on Radix UI primitives
- **Styling**: Tailwind CSS v4 with CSS variables for theming
- **Build Tool**: Vite with custom plugins for Replit integration
- **Animations**: Framer Motion for interactive diagram animations

The frontend follows a component-based architecture with:
- Pages in `client/src/pages/` (dashboard as main view)
- Reusable UI components in `client/src/components/ui/`
- Custom visualization components in `client/src/components/visuals/`:
  - `SolverDiagrams.tsx` - Core solver visualizations
  - `SolverOptionsDiagrams.tsx` - Routing and timestep options
  - `DynamicWaveOptionsDiagrams.tsx` - SWMM5 dynamic wave settings
  - `TemporalDynamicsDiagrams.tsx` - Time-related solver behavior
  - `OperationalControlsDiagrams.tsx` - RTC and control logic
  - `AdvancedDiagrams.tsx` - Stability and analysis tools
  - `HydrologicDiagrams.tsx` - Rainfall and runoff
  - `ClimateInfiltrationDiagrams.tsx` - Snowmelt and infiltration
  - `ICMSimulationDiagrams.tsx` - ICM-specific parameters and InfoSewer emulation
  - `InletDiagrams.tsx` - Surface-to-sewer connections
  - `GreenInfraDiagrams.tsx` - LID/SUDS controls
  - `ArchitecturalDiagrams.tsx` - Code structure visualization
- Static comparison data in `client/src/data/comparison-data.ts`
- Source code snippets in `client/src/data/source-code-snippets.ts`

### Backend Architecture
- **Framework**: Express.js with TypeScript
- **Server**: Node.js with HTTP server
- **Development**: tsx for TypeScript execution, Vite dev server for HMR
- **Production**: esbuild bundles server code, Vite builds client

The backend is minimal, primarily serving the static frontend and providing API endpoints structure in `server/routes.ts`. The storage layer uses an in-memory implementation with interface abstraction for future database integration.

### Data Layer
- **ORM**: Drizzle ORM configured for PostgreSQL
- **Schema**: Defined in `shared/schema.ts` using Drizzle's table definitions
- **Validation**: Zod schemas generated from Drizzle schemas via drizzle-zod
- **Current Storage**: In-memory Map-based storage (MemStorage class)

The database schema currently includes a users table, though the primary application content (hydraulic comparison data) is stored as static TypeScript data structures.

### Build System
- **Client Build**: Vite compiles React/TypeScript to `dist/public`
- **Server Build**: esbuild bundles server to `dist/index.cjs`
- **Development**: Single `npm run dev` starts Express server with Vite middleware
- **Path Aliases**: `@/` for client source, `@shared/` for shared code, `@assets/` for attached assets

## External Dependencies

### Database
- **PostgreSQL**: Configured via `DATABASE_URL` environment variable
- **Drizzle Kit**: Used for schema migrations (`npm run db:push`)
- **connect-pg-simple**: Session storage for Express (available but not currently active)

### UI Framework Dependencies
- **Radix UI**: Complete primitive component set (dialogs, accordions, tabs, etc.)
- **Lucide React**: Icon library
- **class-variance-authority**: Component variant management
- **tailwind-merge/clsx**: Utility class composition
- **Framer Motion**: Animation library for interactive diagrams

### Development Tools
- **Replit Vite Plugins**: cartographer, dev-banner, runtime-error-modal for Replit integration
- **Custom meta-images plugin**: Updates OpenGraph images with Replit deployment URLs

### Notable Patterns
- Shared code between client/server in `shared/` directory
- Type-safe API with Zod validation
- Component aliases configured in both Vite and TypeScript for clean imports
- Topic-to-diagram navigation mapping in dashboard.tsx
- Source code viewer with file path mappings

## Recent Changes

- Added interactive **Decision Engine** tool to help users choose between SWMM5 and ICM based on 9 weighted factors (network size, 2D flooding, budget, dry weather, RTC complexity, stability, timesteps, green infrastructure, EPA regulatory)
- Added Operational Controls category (3 diagrams): Control Logic Builder, Execution Timeline, Controller Types
- Added InfoSewer Steady State Emulation diagram to ICM Simulation category
- Total diagram count increased to 63 across 12 categories
