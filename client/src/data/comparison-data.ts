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
        "Node depths are calculated by explicitly integrating the conservation of mass equation: ∂H/∂t = ΣQ / SurfaceArea. This formulation requires every node to have a non-zero surface area (defaulting to a 4ft/1.2m diameter manhole) to prevent mathematical instability (division by zero).",
      ],
      node_surface_area: [
        "Under FREE SURFACE flow: Node effective surface area = Anode + ½·Σ(Wi × Li) — each connecting conduit contributes HALF its top surface area to the node for depth change calculations.",
        "This approach concentrates all conduit storage at the nodes rather than along the conduit length, consistent with the single-link-per-conduit discretisation.",
        "For nearly full conduits (≥96% full): Surface area is calculated at 0.96 × full depth to ensure links always contribute some area and prevent numerical issues.",
        "Under SURCHARGED conditions: The calculation method switches from surface area to dQ/dH (flow change per head change); the half-link contribution becomes less relevant under pressurized flow.",
        "Minimum surface area is enforced (default: 12.566 ft² corresponding to a 4-ft diameter circle) to prevent division-by-zero errors in the head update calculation.",
        "Storage nodes: Receive half the surface area of connecting links PLUS their own depth-area curve. Use a 'dummy link' workaround to isolate wet well area from upstream conduit contributions.",
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
        "Historically SWMM used a 'surcharge algorithm' at pressurized nodes; an alternative Preissmann Slot method is available to handle pressurized flow while retaining the regular head-updating method.",
      ],
      inertia_supercritical_handling: [
        "Provides options to damp or ignore inertial terms; one option corresponds to a local inertial formulation where the convective acceleration term is dropped (while retaining local acceleration).",
        "Uses Froude-number-based logic to help with stability near supercritical conditions.",
      ],
      stability_devices: [
        "Imposes a global minimum surface area at nodes (default corresponds to a 4-ft diameter manhole) as a computational device to prevent head update formulas from becoming unbounded as surface area vanishes.",
        "Has multiple special-case adjustments for dry/critical conditions at conduit ends in dynamic wave analysis.",
      ],
      conduit_models: [
        "SWMM uses a single Dynamic Wave routing approach for all conduits — no per-conduit solution model selection.",
        "Conduit cross-sections: Supports circular, rectangular, trapezoidal, irregular, and user-defined shapes; geometry affects hydraulic radius and conveyance calculations.",
        "Force mains: Modeled using the same dynamic wave equations; pressurized flow handled via surcharge algorithm or optional Preissmann Slot.",
        "No specialized 'permeable pipe' or 'finite volume' models — advanced applications may require workarounds or external coupling.",
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
        label: "SWMM 5.1 User's Manual (Aug 2015 master PDF hosted by EPA)",
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
        "Uses the Saint-Venant conservation equations of mass (∂A/∂t + ∂Q/∂x = q) and momentum for 1D conduits; conveyance can be based on Colebrook–White or Manning formulations.",
        "The momentum equation includes terms for discharge, cross-sectional area, gravity, bed slope, and conveyance: ∂Q/∂t + ∂(Q²/A)/∂x + gA·cos(θ)·∂h/∂x = gA(S₀ − Q|Q|/K²).",
        "Pressurised flow replaces free surface width with B = g·Af/Cp², enabling the Preissmann slot concept for smooth surcharge transitions.",
        "Offers multiple solution models per conduit: 'Full' (Saint-Venant), 'Pressurised Pipe', 'Force Main', 'Permeable', and 'Finite Volume' for trans-critical flow.",
      ],
      discretisation_unknowns: [
        "Each conduit is split into N computational points (default spacing ~ 20 × conduit diameter), yielding a distributed finite-difference representation along the conduit length.",
        "Adjacent computational points are coupled via discretised Saint‑Venant equations; internal nodes satisfy a continuity equation: Σ(Qi,n + Qi,n+1)/2 = Si,n+1(yi,n+1 − yi,n)/Δt.",
        "Node water levels are solved simultaneously with link variables in the global matrix. Unlike SWMM, which strictly integrates net flow over surface area (requiring a minimum area), ICM's coupled approach can handle a wider variety of node boundary conditions implicitly.",
        "Boundary conditions between links and nodes are of outfall or headloss type, relating discharge Qi and level yi.",
      ],
      node_surface_area: [
        "Manhole/node area in ICM is the ACTUAL shaft area only — typically the physical chamber dimensions (e.g., 1.2m diameter circle ≈ 1.13 m²).",
        "Conduit storage is computed WITHIN each conduit via the distributed computational points, not lumped at nodes.",
        "Because storage is distributed along conduits, ICM does not need to add half the conduit surface area to the node area (unlike SWMM).",
        "Node area is used only for storage above the highest connecting pipe soffit (chamber/shaft storage) and for ponding calculations.",
        "No minimum area constraint is required for numerical stability because the coupled matrix solution does not use an explicit ∂H/∂t = ΣQ/A formulation.",
      ],
      time_integration: [
        "Approximates Saint‑Venant equations using the Preissmann 4‑point box scheme with a time-weighting parameter θ; functions and derivatives are replaced by weighted averages over four corners of a box in (x,t) space.",
        "The implicit nature of the scheme removes CFL restrictions for stability; in practice, θ ≈ 0.65 is used (introducing some numerical diffusion for stability).",
        "Node continuity is approximated by an implicit Euler method.",
        "For Finite Volume solver: equations are discretised implicitly in time with first-order spatial discretisation, using a Roe Riemann solver for flux terms at cell interfaces.",
      ],
      nonlinear_solver: [
        "Forms a large coupled nonlinear algebraic system at each time level and solves it iteratively using the Newton–Raphson method for stability in transitions between pressurised and free surface flow.",
        "Uses a double-sweep method (Liggett and Cunge, 1975) to reduce the matrix by local elimination of computational nodes along links between nodes.",
        "The implicit terms at time n+1 are linearised with a first-order Taylor series expansion and re-arranged into a system of linear equations.",
      ],
      time_step_control: [
        "Nonlinear effects can trigger automatic timestep reduction (progressive halvings) until Newton–Raphson convergence is achieved; rapid convergence can trigger timestep doubling.",
        "Uses a relative convergence check (change in every dependent variable at the new time level < 1%).",
        "The implicit scheme has no CFL-based timestep restriction, unlike explicit methods.",
      ],
      pressurisation_surcharge: [
        "Employs a Preissmann slot for smooth transition between free surface and surcharged conditions; the slot is a conceptual vertical narrow slot at the pipe soffit.",
        "A transition region (monotonic cubic) is included between the true pipe geometry and the Preissmann slot width to avoid abrupt changes in surface width derivative and wave celerity.",
        "Slot width is defined such that wave celerity in the slot is ~10× that at half the conduit height, resulting in a slot width of approximately 2% of the conduit width.",
        "Note: Maximum conveyance in a closed pipe occurs below the pipe soffit; ICM imposes monotonicity on conveyance to avoid turning points and multiple numerical solutions.",
      ],
      inertia_supercritical_handling: [
        "Provides option to exclude the inertia (dQ/dt) term via 'Drop inertia in pressure pipes' setting; can be used with 'Stay pressurised' option to prevent negative depths in force mains.",
        "Phases out inertial terms as characteristic Froude number approaches unity to preserve subcritical-like behaviour in the core solver.",
        "Finite Volume solver option available for complex trans-critical flow scenarios, properly resolving hydraulic jumps within conduits using a Roe Riemann solver.",
      ],
      stability_devices: [
        "Introduces a nominal base flow (defined from normal flow at a base depth of 5% of conduit height) to avoid oscillations/instability associated with multiple flow states at low depths.",
        "Base flow is introduced inside the network solver and removed within boundary conditions, preserving volume conservation.",
        "For Force Mains: water level is maintained at least to pipe soffit level at the interface with gravity solutions throughout simulation.",
      ],
      conduit_models: [
        "Full (Conduit) Model: Standard Saint-Venant equations with Preissmann slot for surcharge handling; supports variable roughness (bottom third vs remainder) and permanent sediment depth.",
        "Pressurised Pipe Model: For rising mains/inverted siphons; more accurately predicts velocities and storage than Full model as it doesn't assign base flow or Preissmann slot.",
        "Force Main Model: Advanced model for long rising mains under low hydraulic heads; assumes pipe is always full even if hydraulic grade line drops below soffit (can show negative depths like a siphon).",
        "Permeable Model: For permeable pavements; uses Darcy's Law (Q = K·A·Δh/L) with porosity considerations.",
        "Finite Volume Model: Prototype solver for trans-critical flow with hydraulic jumps; uses conservative vector form and Roe Riemann solver at cell interfaces.",
      ],
    },
    sources: [
      {
        label: "InfoWorks ICM Online Help — Hydraulic Theory",
        url: "https://help2.innovyze.com/infoworksicm/Content/HTML/ICM_ILCM/Hydraulic_Theory.htm",
        notes:
          "Documents Preissmann 4‑point scheme, θ≈0.65, Newton–Raphson with double-sweep, timestep halving/doubling, base flow, Preissmann slot details, conduit solution models.",
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
] as const;

export type TopicKey = (typeof TOPIC_ORDER)[number]["key"];
