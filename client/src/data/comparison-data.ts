export const KB = {
  swmm5: {
    product: "EPA SWMM 5 (Dynamic Wave routing)",
    tagline:
      "Node–link dynamic-wave solver using an implicit backward Euler formulation with successive relaxation iterations.",
    topics: {
      governing_equations: [
        "Solves the complete 1D Saint-Venant continuity and momentum equations for conduits, together with a nodal continuity (volume balance) relationship in a node–link network representation.",
        "Dynamic wave accounts for storage, backwater, entrance/exit losses, flow reversal, and pressurized flow; this generality typically requires small time steps for numerical stability.",
      ],
      discretisation_unknowns: [
        "Uses an EXTRAN-derived node–link approach: conduits are links between nodes.",
        "A single conduit is one computational link; finer longitudinal resolution requires manual subdivision into multiple shorter links.",
        "Node depths are calculated by explicitly integrating the conservation of mass equation: ∂H/∂t = ΣQ / SurfaceArea.",
        "This formulation requires every node to have a non-zero surface area (defaulting to a 4ft/1.2m diameter manhole) to prevent mathematical instability.",
      ],
      node_surface_area: [
        "Node effective surface area = Anode + ½·Σ(Wi × Li). Connecting conduits contribute half their top surface area.",
        "Requires a minimum surface area (default: 12.566 ft², 4-ft diameter) to prevent division-by-zero errors in the head update formula.",
        "This approach concentrates all conduit storage at the nodes rather than along the conduit length.",
        "Under surcharged conditions, the method switches from surface area to dQ/dH.",
      ],
      time_integration: [
        "Momentum equation is solved with an implicit backward Euler method.",
        "Solution advances from t to t+Δt via an iterative procedure that alternates between updating link flows and node heads.",
        "Both SWMM5's implicit backward Euler and ICM's Preissmann scheme are implicit methods, but they differ in implementation and coupling.",
      ],
      nonlinear_solver: [
        "Uses a successive approximation (functional iteration) scheme with relaxation.",
        "Convergence tolerance and maximum trials are user-configurable.",
        "SWMM5 uses simpler functional iteration; this is computationally lighter but may converge more slowly for highly nonlinear problems.",
      ],
      time_step_control: [
        "Supports a fixed or variable time step.",
        "Variable time step mode selects the next Δt based on a Courant-type criterion and a head-change limit, bounded by user-supplied Δtmin and Δtmax.",
        "Both SWMM5 and ICM allow variable time steps, but with different control mechanisms.",
      ],
      pressurisation_surcharge: [
        "Historically used a 'surcharge algorithm'.",
        "An alternative Preissmann Slot method is available to handle pressurized flow while retaining the regular head-updating method.",
        "ICM standardly uses a Preissmann slot with a smooth transition region; SWMM5 offers this as an option.",
      ],
      inertia_supercritical_handling: [
        "Provides options to damp or ignore inertial terms (e.g., local inertial formulation).",
        "Uses Froude-number-based logic to help with stability near supercritical conditions.",
        "Both SWMM5 and ICM offer inertia damping options, though implemented differently.",
      ],
      stability_devices: [
        "Imposes a global minimum surface area at nodes (default 4-ft diameter manhole) to prevent head update instability.",
        "Has multiple special-case adjustments for dry/critical conditions at conduit ends.",
        "SWMM5 relies on minimum node area; ICM relies on base flow — both are numerical stabilization devices.",
      ],
      conduit_models: [
        "Uses a single Dynamic Wave routing approach for all conduits.",
        "Force mains are modeled using the same dynamic wave equations; pressurized flow handled via surcharge algorithm or optional Preissmann Slot.",
        "No per-conduit solution model selection (unlike ICM's multiple specialized models).",
      ],
      engine_integration: [
        "EPA SWMM5 engine is public-domain, integrated hydrology-hydraulics model.",
        "Used as the basis for many commercial platforms (PCSWMM, InfoSWMM, XPSWMM).",
        "Can be run as an alternative solver within InfoWorks ICM (integrated since Dec 2019).",
        "Source code available on GitHub; extensive community development.",
      ],
      dry_network_handling: [
        "Can simulate truly dry links and nodes (zero flow).",
        "Networks can be initialized from completely dry conditions.",
        "May require careful timestep management during initial wetting to avoid instability.",
        "Advantage over ICM: Can model intermittent streams or systems with long dry periods.",
      ],
      stability_robustness: [
        "Can be less numerically stable than ICM/MOUSE in certain scenarios: small flows over long weirs, complex pressurized networks, highly looped networks.",
        "Requires careful parameter tuning (minimum node area, time step, surcharge method) for challenging networks.",
        "Advantage: Can simulate truly dry links and nodes.",
      ],
      use_case_strengths: [
        "Optimal for: Regulatory compliance modeling (NPDES), long-term continuous simulation, water quality and LID analysis, academic research.",
        "Strengths: Zero cost (public domain), transparent source code, strong water quality capabilities, wide regulatory acceptance.",
      ],
    },
    sources: [
      {
        label: "SWMM 5 Reference Manual, Volume II – Hydraulics (Rossman, May 2017)",
        url: "https://downloads.tuflow.com/SWMM/SWMM5_Reference_Manual_Volume2_Hydaulics_P100S9AS.pdf",
        notes: "Dynamic Wave Analysis: node–link approach, implicit backward Euler, solution procedure, variable time step.",
      },
      {
        label: "SWMM 5 Reference Manual Volume II Addendum — Preissmann Slot (Feb 2022)",
        url: "https://www.epa.gov/system/files/documents/2022-02/swmm5-reference-manual-ii-addendum-20220210mas2wr-1.pdf",
        notes: "Optional Preissmann Slot method for pressurized flow.",
      },
      {
        label: "SWMM 5.1 User's Manual (Aug 2015)",
        url: "https://www.epa.gov/sites/default/files/2019-02/documents/epaswmm5_1_manual_master_8-2-15.pdf",
        notes: "Dynamic Wave routing capabilities and stability/time step considerations.",
      },
      {
        label: "EPA SWMM Website — Storm Water Management Model",
        url: "https://www.epa.gov/water-research/storm-water-management-model-swmm",
        notes: "Official EPA page describing SWMM applications.",
      },
      {
        label: "EPA/600/R-06/097 — SWMM Quality Assurance Report (Sept 2006)",
        url: "https://www.epa.gov/water-research/storm-water-management-model-swmm",
        notes: "Quality assurance testing of dynamic wave routing implementation.",
      },
      {
        label: "SWMM5 Source Code on GitHub",
        url: "https://github.com/USEPA/Stormwater-Management-Model",
        notes: "Open-source engine code for verification and community development.",
      },
      {
        label: "swmm5.org — Community Resources",
        url: "https://swmm5.org/",
        notes: "Community resources, tutorials, and engine updates.",
      },
      {
        label: "QA/QC Hydraulic Comparison of ICM, SWMM5 and XPSWMM (ICWMM 2018)",
        url: "https://www.icwmm.org/Archive/2018-C027-08/qa-qc-hydraulic-comparison-of-infoworks-icm-swmm5-and-xpswmm-for-gravity-partial-pressure-and-force",
        notes: "Detailed comparison: node-link solution, area calculation, Froude handling, dry network.",
      },
      {
        label: "OpenSWMM Discussion — InfoWorks and Stability",
        url: "https://openswmm.org/Topic/4140/infoworks-and-stability",
        notes: "User discussion on relative numerical stability.",
      },
    ],
  },
  icm: {
    product: "InfoWorks ICM (1D engine for InfoWorks networks)",
    tagline:
      "Distributed 1D Saint-Venant solver using a Preissmann 4‑point implicit scheme with Newton–Raphson iterations and adaptive time stepping.",
    topics: {
      governing_equations: [
        "Uses the Saint-Venant conservation equations of mass (∂A/∂t + ∂Q/∂x = q) and momentum for 1D conduits.",
        "Momentum equation: ∂Q/∂t + ∂(Q²/A)/∂x + gA·cos(θ)·∂h/∂x = gA(S₀ − Q|Q|/K²).",
        "Conveyance can be based on Colebrook–White or Manning formulations.",
        "Pressurised flow replaces free surface width with B = g·Af/Cp², enabling the Preissmann slot concept.",
      ],
      discretisation_unknowns: [
        "Each conduit is split into N computational points (default spacing ~ 20 × conduit diameter).",
        "Yields a distributed finite-difference representation along the conduit length.",
        "Each pair of adjacent points is linked by the discrete form of the Saint-Venant equations (2N-2 equations per conduit).",
        "Node water levels are solved simultaneously with link variables in the global matrix.",
        "Unlike SWMM, ICM's coupled approach handles node boundary conditions implicitly.",
      ],
      node_surface_area: [
        "Manhole/node area is the ACTUAL shaft area only (e.g., 1.2m diameter circle).",
        "Conduit storage is computed within the conduit via distributed points; no addition of half-link area to the node.",
        "No minimum area constraint is required for numerical stability.",
        "ICM's global matrix solution does not require node area for stability (unlike SWMM's explicit head update).",
      ],
      time_integration: [
        "Approximates Saint-Venant equations using the Preissmann 4-point box scheme with time-weighting parameter θ (θ ≈ 0.65).",
        "Node continuity is approximated by an implicit Euler method.",
        "The implicit nature removes CFL restrictions for stability; numerical diffusion provides damping.",
        "Finite Volume solver uses Roe Riemann solver for flux terms at cell interfaces.",
      ],
      nonlinear_solver: [
        "Forms a large coupled nonlinear algebraic system and solves it iteratively using the Newton–Raphson method.",
        "Uses a double-sweep method to reduce the matrix by local elimination of computational nodes along links.",
        "More robust than SWMM5's functional iteration for highly nonlinear or tightly coupled problems.",
      ],
      time_step_control: [
        "The implicit scheme has no CFL-based timestep restriction.",
        "Manages time steps through Newton-Raphson convergence failures; rapid convergence can trigger timestep doubling.",
        "Uses a relative convergence check (< 1% change in dependent variables).",
      ],
      pressurisation_surcharge: [
        "Employs a Preissmann slot for smooth transition between free surface and surcharged conditions.",
        "A transition region (monotonic cubic) is included between the true pipe geometry and the slot.",
        "Slot width defined such that wave celerity in slot is ~10× that at half conduit height (~2% of conduit width).",
        "Imposes monotonicity on conveyance to avoid multiple numerical solutions near pipe crown.",
      ],
      inertia_supercritical_handling: [
        "Offers option to exclude the inertia (dQ/dt) term via 'Drop inertia in pressure pipes' setting.",
        "Phases out inertial terms as characteristic Froude number approaches unity.",
        "Finite Volume solver option available for complex trans-critical flow scenarios with hydraulic jumps.",
      ],
      stability_devices: [
        "Introduces a nominal base flow (defined from normal flow at a base depth of 5% of conduit height) to avoid oscillations at low depths.",
        "For Force Mains, water level is maintained at least to pipe soffit level.",
        "Base flow is a numerical device, not representative of actual flow; removed at boundary conditions.",
      ],
      conduit_models: [
        "1. Full: Standard Saint-Venant equations with Preissmann slot.",
        "2. Pressurised Pipe: For rising mains/inverted siphons; no base flow or slot.",
        "3. Force Main: For long rising mains under low heads; assumes pipe always full.",
        "4. Permeable: For permeable pavements; uses Darcy's Law.",
        "5. Finite Volume: For trans-critical flow with hydraulic jumps; uses Roe Riemann solver.",
      ],
      engine_integration: [
        "InfoWorks ICM native engine is a proprietary, robust commercial solver optimized for complex integrated catchment models.",
        "The software platform integrates hydrology, 1D hydraulics, 2D overland flow, and groundwater.",
        "Since December 2019, can also run the EPA SWMM5 engine natively (ICM SWMM networks).",
        "Allows side-by-side comparison or use of SWMM-specific features like dry network simulation.",
      ],
      dry_network_handling: [
        "Cannot simulate truly dry links — maintains a nominal base flow (typically 5% of normal depth) in all links.",
        "This base flow is a numerical device to avoid instability, not representative of actual flow.",
        "For modeling dry conditions, users may use ICM SWMM (the embedded SWMM5 engine).",
        "Trade-off: More stable but cannot model truly intermittent/ephemeral systems.",
      ],
      stability_robustness: [
        "Perceived as more numerically robust and stable, particularly for large-scale networks, complex integrated 1D/2D models, and real-time operational models.",
        "The base flow mechanism and coupled Newton-Raphson solver prevent oscillations.",
        "Trade-off: Cannot simulate truly dry conditions; base flow may slightly affect mass balance in low-flow scenarios.",
      ],
      use_case_strengths: [
        "Optimal for: Large-scale integrated catchment modeling (1D/2D), real-time operational forecasting and control, flood risk assessment, complex scenario analysis, enterprise-level multi-user modeling.",
        "Strengths: Superior numerical stability, integrated 1D/2D capabilities, efficient handling of large networks (100,000+ nodes), built-in sensitivity and optimization tools.",
      ],
    },
    sources: [
      {
        label: "InfoWorks ICM Online Help — Hydraulic Theory",
        url: "https://help2.innovyze.com/infoworksicm/Content/HTML/ICM_ILCM/Hydraulic_Theory.htm",
        notes: "Preissmann 4‑point scheme, θ≈0.65, Newton–Raphson, base flow, Preissmann slot, conduit models.",
      },
      {
        label: "Autodesk InfoWorks ICM Product Overview",
        url: "https://www.autodesk.com/products/infoworks-icm/overview",
        notes: "Engine described as 'fast, robust, stable, and efficient'.",
      },
      {
        label: "Autodesk Blog — Switch from InfoSWMM to InfoWorks ICM (May 2023)",
        url: "https://www.autodesk.com/blogs/water/2023/05/10/is-it-time-for-you-to-make-the-switch-from-infoswmm-to-infoworks-icm/",
        notes: "Addition of EPA SWMM5 engine as alternative solver (December 2019).",
      },
      {
        label: "Autodesk Blog — Does InfoWorks ICM Use the SWMM Engine? (June 2024)",
        url: "https://www.autodesk.com/blogs/water/2024/06/11/does-infoworks-icm-use-the-swmm-engine-yes-heres-everything-else-you-need-to-know/",
        notes: "Clarifies relationship between ICM native engine and embedded SWMM5 engine.",
      },
      {
        label: "QA/QC Hydraulic Comparison of ICM, SWMM5 and XPSWMM (ICWMM 2018)",
        url: "https://www.icwmm.org/Archive/2018-C027-08/qa-qc-hydraulic-comparison-of-infoworks-icm-swmm5-and-xpswmm-for-gravity-partial-pressure-and-force",
        notes: "4-point implicit solution, computational points, Froude handling, base flow.",
      },
      {
        label: "Aquamod — InfoWorks ICM Overview",
        url: "https://aquamod.eu/infoworks-icm-en.html",
        notes: "Third-party overview of InfoWorks ICM capabilities.",
      },
      {
        label: "OpenSWMM Discussion — InfoWorks and Stability",
        url: "https://openswmm.org/Topic/4140/infoworks-and-stability",
        notes: "User discussion comparing numerical stability.",
      },
      {
        label: "Chaudhry, M.H. — Open-Channel Flow (Textbook)",
        url: "",
        notes: "Standard reference for Saint-Venant equations and numerical methods.",
      },
    ],
  },
};

export const TOPIC_ORDER = [
  { key: "governing_equations", label: "Governing equations" },
  {
    key: "discretisation_unknowns",
    label: "Spatial discretisation and primary unknowns",
  },
  { key: "node_surface_area", label: "Node/manhole surface area treatment" },
  { key: "time_integration", label: "Time integration scheme" },
  { key: "nonlinear_solver", label: "Nonlinear solution method and convergence" },
  { key: "time_step_control", label: "Time-step control and stability management" },
  {
    key: "pressurisation_surcharge",
    label: "Pressurised flow and surcharge handling",
  },
  { key: "inertia_supercritical_handling", label: "Inertia/supercritical handling" },
  { key: "stability_devices", label: "Additional numerical stabilisation devices" },
  { key: "conduit_models", label: "Conduit solution models" },
  { key: "engine_integration", label: "Engine integration and platform context" },
  { key: "dry_network_handling", label: "Dry network handling and initialization" },
  { key: "stability_robustness", label: "Comparative stability and robustness" },
  { key: "use_case_strengths", label: "Primary use cases and strengths" },
] as const;

export type TopicKey = (typeof TOPIC_ORDER)[number]["key"];
