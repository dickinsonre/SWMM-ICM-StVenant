# SWMM5 vs ICM - Saint-Venant Comparison Tool

## Overview

This is an educational web application that provides a structured comparison of how EPA SWMM 5 and InfoWorks ICM solve the 1D Saint-Venant equations for unsteady flow in hydraulic modeling. The app allows users to browse technical comparisons by topic, view side-by-side summary tables, and export content to Markdown or JSON formats.

The application is built as a full-stack TypeScript project with a React frontend and Express backend, designed to present complex hydraulic engineering concepts in an accessible, interactive format.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
- **Framework**: React 18 with TypeScript
- **Routing**: Wouter (lightweight alternative to React Router)
- **State Management**: TanStack React Query for server state
- **UI Components**: shadcn/ui component library built on Radix UI primitives
- **Styling**: Tailwind CSS v4 with CSS variables for theming
- **Build Tool**: Vite with custom plugins for Replit integration

The frontend follows a component-based architecture with:
- Pages in `client/src/pages/` (dashboard as main view)
- Reusable UI components in `client/src/components/ui/`
- Custom visualization components for solver diagrams
- Static comparison data stored in `client/src/data/comparison-data.ts`

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

### Development Tools
- **Replit Vite Plugins**: cartographer, dev-banner, runtime-error-modal for Replit integration
- **Custom meta-images plugin**: Updates OpenGraph images with Replit deployment URLs

### Notable Patterns
- Shared code between client/server in `shared/` directory
- Type-safe API with Zod validation
- Component aliases configured in both Vite and TypeScript for clean imports