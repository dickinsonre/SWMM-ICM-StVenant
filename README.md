# SWMM-ICM-StVenant

An interactive educational web application that provides a structured, visual comparison of how **EPA SWMM 5** and **InfoWorks ICM** solve the **1D Saint-Venant equations** for unsteady flow in hydraulic and stormwater modeling.

🔗 **Live App:** [replit.com/@robertdickinson/SWMM-ICM-StVenant](https://replit.com/@robertdickinson/SWMM-ICM-StVenant)

---

## Overview

This tool was built to help hydraulic engineers, stormwater modelers, and students deeply understand the numerical differences between these two industry-standard solvers. Rather than just listing features, it uses **117 interactive diagrams**, animated SVG visualizations, and slider-driven calculators to make abstract solver concepts tangible.

### Solver Taglines

| Solver | Method |
|--------|--------|
| **SWMM 5** | Node–link dynamic-wave solver using an implicit backward Euler formulation with successive relaxation iterations |
| **InfoWorks ICM** | Distributed 1D Saint-Venant solver using a Preissmann 4‑point implicit scheme with Newton–Raphson iterations and adaptive time stepping |

---

## Features

- **117 interactive diagrams and calculators** across 16 content categories + a Favorites category (17 total)
- **Four viewing modes:**
  - 🖼️ **Visuals** — Animated SVG diagrams, canvas simulators, and slider calculators
  - 📋 **Topic Comparison** — Accordion-based SWMM5 vs ICM bullet-point comparison for 15 technical topics
  - 📊 **Summary Table** — Dense side-by-side reference across all 15 topics
  - 💻 **Source Code** — Browse the visualization source code with syntax highlighting
- **USA / SI units toggle** — Converts all displayed values between imperial and metric across every diagram and calculator
- **Favorites system** — Star any diagram or comparison topic for quick access via a dedicated Favorites category (persisted to localStorage)
- **Dark / light theme** — Blue-themed palette in both modes
- **JSON and Markdown export** — Download the full knowledge base
- **Executive Summary card** — Quick-reference overview of key solver differences
- **Companion tools** linked: [sjswmm5manualsearch.com](https://sjswmm5manualsearch.com) and [swmmdocs.com](https://swmmdocs.com)
- **Version tracker** — Targets SWMM5 v5.2.4 and ICM v2025.1

---

## Content Categories (17 Total)

| # | Category | Description | Diagrams |
|---|----------|-------------|----------|
| ⭐ | Favorites | User-starred diagrams and topics | Dynamic |
| 1 | Solver Mechanics | Core solver architecture and numerical methods | 16 |
| 2 | Solver Options | Routing methods, surcharge, adaptive timestep | 8 |
| 3 | Dynamic Wave Options | Inertial terms, normal flow, CFL stability | 10 |
| 4 | Temporal Dynamics | Wave travel, adaptive stepping, dry start | 6 |
| 5 | Operational Controls | RTC logic, PID controllers, execution timeline | 3 |
| 6 | Advanced Analysis | Convergence, mass balance, oscillation, decision trees | 10 |
| 7 | Hydrologic | Rainfall-runoff, RDII, buildup-washoff | 6 |
| 8 | Climate & Infiltration | Snowmelt algorithms, Horton/Green-Ampt/CN | 2 |
| 9 | ICM Simulation | ICM-specific Preissmann, adaptive stepping, headloss | 17 |
| 10 | Surface-to-Sewer | HEC-22 inlet efficiency, capture/bypass flow | 4 |
| 11 | Green Infrastructure | LID vs SUDS, dual solver architecture | 3 |
| 12 | Code Architecture | Input parsing, matrix solver, RTC rules, mass routing | 5+ |
| 13 | Boundary Conditions | Outfall types, inflow types, treatment, coefficient conversion | 4 |
| 14 | Real-World Scenarios | CSO modeling, detention ponds, calibration | 4 |
| 15 | Performance & Topology | Loop detection, performance scaling, warning messages | 6 |
| 16 | Historical Engineering | Animated ancient hydraulic systems (Rome, Indus, Aztec, etc.) | 13 |

---

## Interactive Calculators

All calculators respond to the global USA/SI units toggle.

| Calculator | Description |
|-----------|-------------|
| CFL Stability | Computes CFL number and stable timestep verdict |
| Preissmann Slot | Slot width and wave speed for pressurized pipe flow |
| Manning's Flow | Flow rate and velocity from slope, roughness, and geometry |
| Timestep Efficiency | Simulation time estimator based on network size |
| Froude Number | Flow regime classification (subcritical / supercritical / critical) |
| Computational Points | Number of H/Q grid points for a given conduit spacing |
| Inertial Terms | Magnitude of local and convective acceleration terms |
| HEC-22 Inlet | FHWA inlet capture efficiency from road geometry and flow |

---

## 15 Technical Comparison Topics

The structured knowledge base compares SWMM5 and ICM across these topics:

1. Governing equations (Saint-Venant continuity and momentum)
2. Spatial discretisation and primary unknowns
3. Node/manhole surface area treatment
4. Time integration scheme
5. Nonlinear solution method and convergence
6. Time-step control and stability management
7. Pressurised flow and surcharge handling
8. Inertia/supercritical handling
9. Additional numerical stabilisation devices
10. Conduit solution models
11. Engine integration and platform context
12. Dry network handling and initialization
13. Comparative stability and robustness
14. Primary use cases and strengths
15. Practical implications for modelers

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React 18 + TypeScript |
| Styling | Tailwind CSS v4 + shadcn/ui (55 components) |
| Build | Vite 5 |
| Backend | Express.js (Node 20) |
| Routing | wouter |
| Animation | Framer Motion + custom SVG/Canvas animations |
| Database | PostgreSQL 16 via Drizzle ORM (schema defined, not actively queried) |
| Hosting | Replit |

**Total codebase:** ~26,900 lines across 35 source files (27 visual component files)

---

## Project Structure

```text
/
├── client/
│   └── src/
│       ├── pages/
│       │   └── dashboard.tsx          # Main application page (1,884 lines)
│       ├── components/
│       │   ├── ui/                    # 55 shadcn/ui primitives
│       │   └── visuals/               # 27 visualization component files
│       ├── contexts/
│       │   ├── UnitsContext.tsx       # USA/SI unit toggle
│       │   └── FavoritesContext.tsx   # localStorage-backed favorites
│       └── data/
│           ├── comparison-data.ts     # Knowledge base (15 topics × 2 solvers)
│           └── source-code-snippets.ts # Source viewer data
├── server/
│   ├── index.ts                       # Express entry point
│   └── routes.ts                      # API stubs
├── shared/
│   └── schema.ts                      # Drizzle ORM schema
├── HANDOVER.md                        # Full developer handover document
└── replit.md                          # Replit project documentation
```

---

## Quick Start

### Development

```bash
# Install dependencies
npm install

# Start development server (Express + Vite HMR)
npm run dev

# App runs at http://localhost:5000
```

### Production Build

```bash
npm run build
npm start
```

### Type Checking

```bash
npm run check
```

---

## Adding a New Diagram

1. Create or add to a file in `client/src/components/visuals/`
2. Follow the standard pattern: `useUnits()` hook, `Card` wrapper, SVG `viewBox`, `setInterval` animation at 50 ms
3. Export as a named component
4. Import and render in the appropriate category section of `dashboard.tsx`
5. Wrap with `<Fav id="d-unique-slug">` for favorites support
6. Add an entry to `DIAGRAM_REGISTRY` with matching `id`, `label`, and `category`
7. Update the diagram count in `DIAGRAM_CATEGORIES`

---

## Units System

All values are stored internally in US customary units. The global `UnitsContext` provides:

- `u` — Unit label strings (`u.flow` = `"cfs"` or `"m³/s"`)
- `conv` — Conversion functions (`conv.flow(val)` = val × 0.0283168 in SI mode)
- `fmt` — Number formatter (`fmt(val, decimals)`)

**Usage in components:**

```tsx
const { u, conv, fmt } = useUnits();
// Displays "10.00 ft" (USA) or "3.05 m" (SI)
<span>{fmt(conv.length(valueInFeet))} {u.length}</span>
```

---

## Known Limitations

- No user authentication (schema exists for future use)
- All content is static TypeScript — no CMS or live API
- Source Code tab shows static snapshots of 10/27 visual files
- Favorites are device-local (localStorage only)
- No full-text search across diagrams
- English only (unit labels convert; text does not)

---

## Target Audience

Hydraulic engineers, stormwater modelers, and students who work with or are evaluating EPA SWMM 5 and InfoWorks ICM for urban drainage and flood modeling projects.

---

## References

**SWMM5:**

- [SWMM 5 Reference Manual Vol. II — Hydraulics (Rossman, 2017)](https://nepis.epa.gov/Exe/ZyPDF.cgi?Dockey=P100NYRA.pdf)
- [EPA SWMM Website](https://www.epa.gov/water-research/storm-water-management-model-swmm)
- [SWMM5 Source Code on GitHub](https://github.com/USEPA/Stormwater-Management-Model)

**ICM:**

- [InfoWorks ICM Online Help — Hydraulic Theory](https://help.autodesk.com/view/IWICMS/2025/ENU/)
- [Autodesk Blog — Does InfoWorks ICM Use the SWMM Engine? (June 2024)](https://www.autodesk.com/blogs/water/infoworks-icm-swmm-engine)

**Hydraulics:**

- Chaudhry, M.H. — *Open-Channel Flow* (Springer)

---

*Built and maintained by Robert Dickinson. Part of a broader suite of SWMM-based modeling and education tools.*
