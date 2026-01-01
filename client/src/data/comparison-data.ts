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
        "Uses an EXTRAN-derived node–link approach: conduits are links between nodes, with a continuous water surface assumed between node head and conduit end conditions.",
        "Because SWMM uses a node–link approach (a conduit is a single link between two nodes), it does not automatically create internal computational points along a conduit; when finer longitudinal resolution is needed, modelers may represent a long conduit as multiple shorter links.",
      ],
      time_integration: [
        "Momentum equation is solved with an implicit backward Euler method (introduced in SWMM 5 for improved stability over the explicit/modified Euler methods used historically).",
        "Solution advances from t to t+Δt via an iterative procedure that alternates between updating link flows and node heads.",
      ],
      nonlinear_solver: [
        "Uses a successive approximation (functional iteration) scheme with relaxation; the relaxation factor θ is 0.5.",
        "Convergence tolerance and maximum trials are user-configurable; documented defaults are 0.005 ft and 8 trials.",
        "Links whose end-node heads have converged can be skipped in subsequent iterations for that time step.",
      ],
      time_step_control: [
        "Supports a fixed computational time step or a variable time step mode.",
        "Variable time step mode selects the next Δt based on (a) a Courant-type criterion over conduits and (b) a head-change limit over non-outfall, non-surcharged nodes, bounded by user-supplied Δtmin and Δtmax.",
      ],
      pressurisation_surcharge: [
        "A node is considered surcharged when all connected conduits are full or when node water level exceeds the crown of the highest connected conduit; pressurized flow can occur in a conduit even if neither end node is surcharged.",
        "Historically SWMM used a “surcharge algorithm” at pressurized nodes; an alternative Preissmann Slot method is available to handle pressurized flow while retaining the regular head-updating method.",
      ],
      inertia_supercritical_handling: [
        "Provides options to damp or ignore inertial terms; one option corresponds to a local inertial formulation where the convective acceleration term is dropped (while retaining local acceleration).",
        "Uses Froude-number-based logic to help with stability near supercritical conditions.",
      ],
      stability_devices: [
        "Imposes a global minimum surface area at nodes (default corresponds to a 4-ft diameter manhole) as a computational device to prevent head update formulas from becoming unbounded as surface area vanishes.",
        "Has multiple special-case adjustments for dry/critical conditions at conduit ends in dynamic wave analysis.",
      ],
    },
    sources: [
      {
        label:
          "SWMM 5 Reference Manual, Volume II – Hydraulics (Rossman, May 2017)",
        url: "https://downloads.tuflow.com/SWMM/SWMM5_Reference_Manual_Volume2_Hydaulics_P100S9AS.pdf",
        notes:
          "See Dynamic Wave Analysis (Ch. 3): node–link approach, implicit backward Euler, solution procedure, variable time step.",
      },
      {
        label:
          "SWMM 5 Reference Manual Volume II Addendum — Preissmann Slot (Feb 2022)",
        url: "https://www.epa.gov/system/files/documents/2022-02/swmm5-reference-manual-ii-addendum-20220210mas2wr-1.pdf",
        notes: "Explains optional Preissmann Slot method for pressurized flow in SWMM.",
      },
      {
        label: "SWMM 5.1 User’s Manual (Aug 2015 master PDF hosted by EPA)",
        url: "https://www.epa.gov/sites/default/files/2019-02/documents/epaswmm5_1_manual_master_8-2-15.pdf",
        notes:
          "High-level description of Dynamic Wave routing capabilities and stability/time step considerations.",
      },
    ],
  },
  icm: {
    product: "InfoWorks ICM (1D engine for InfoWorks networks)",
    tagline:
      "Distributed 1D Saint-Venant solver using a Preissmann 4‑point implicit scheme with Newton–Raphson iterations and adaptive time stepping.",
    topics: {
      governing_equations: [
        "Uses the Saint-Venant conservation equations of mass and momentum for 1D conduits; conveyance can be based on Colebrook–White or Manning formulations.",
        "Pressurised flow can be represented via the Preissmann slot concept within the full (Saint‑Venant) conduit model.",
      ],
      discretisation_unknowns: [
        "Each conduit is split into N computational points (default spacing ~ 20 × conduit diameter), yielding a distributed finite-difference representation along the conduit length.",
        "Adjacent computational points are coupled via discretised Saint‑Venant equations; internal nodes satisfy a continuity equation.",
      ],
      time_integration: [
        "Approximates Saint‑Venant equations using the Preissmann 4‑point box scheme with a time-weighting parameter (q).",
        "The implicit nature of the scheme removes a CFL restriction for stability when entering the Preissmann slot; in practice, q ≈ 0.65 is used (introducing some numerical diffusion).",
        "Node continuity is approximated by an implicit Euler method.",
      ],
      nonlinear_solver: [
        "Forms a large coupled nonlinear algebraic system at each time level and solves it iteratively using a Newton–Raphson method.",
        "Uses a double-sweep approach to reduce the matrix system by local elimination along links between nodes.",
      ],
      time_step_control: [
        "Nonlinear effects can trigger automatic timestep reduction (progressive halvings) until Newton–Raphson convergence is achieved; rapid convergence can trigger timestep doubling.",
        "Uses a relative convergence check (change in every dependent variable at the new time level < 1%).",
      ],
      pressurisation_surcharge: [
        "Employs a Preissmann slot for smooth transition between free surface and surcharged conditions; includes a transition region to avoid abrupt changes in wave celerity at the pipe soffit.",
        "Slot width is defined such that wave celerity in the slot is ~10× that at half the conduit height, resulting in a slot width on the order of ~2% of the conduit width (per documentation).",
        "Provides alternative ‘Pressurised Pipe Model’ and ‘Force Main’ models for cases where always-full assumptions are more appropriate.",
      ],
      inertia_supercritical_handling: [
        "Provides options to include/exclude the inertia (dQ/dt) term in pressure pipes; can be used with ‘Stay pressurised’ options to avoid negative depths in force mains.",
        "Phases out inertial terms as a characteristic Froude number approaches unity to preserve subcritical-like behaviour in the core solver (finite-volume option exists for true trans-critical resolution).",
      ],
      stability_devices: [
        "Introduces a nominal base flow (defined from normal flow at a base depth) to avoid oscillations/instability associated with multiple flow states at low depths; base depth is 5% of conduit height (documentation provides example percentages).",
        "Notes that base flow is introduced inside the network solver and removed within boundary conditions, preserving volume conservation.",
      ],
    },
    sources: [
      {
        label: "InfoWorks ICM Online Help — Hydraulic Theory",
        url: "https://help2.innovyze.com/infoworksicm/Content/HTML/ICM_ILCM/Hydraulic_Theory.htm",
        notes:
          "Documents Preissmann 4‑point scheme, q≈0.65, Newton–Raphson with double-sweep, timestep halving/doubling, base flow, Preissmann slot details.",
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
  { key: "time_integration", label: "Time integration scheme" },
  { key: "nonlinear_solver", label: "Nonlinear solution method and convergence" },
  { key: "time_step_control", label: "Time-step control and stability management" },
  {
    key: "pressurisation_surcharge",
    label: "Pressurised flow and surcharge handling",
  },
  { key: "inertia_supercritical_handling", label: "Inertia/supercritical handling" },
  { key: "stability_devices", label: "Additional numerical stabilisation devices" },
] as const;

export type TopicKey = typeof TOPIC_ORDER[number]["key"];
