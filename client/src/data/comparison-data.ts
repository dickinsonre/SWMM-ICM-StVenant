export const KB = {
  swmm5: {
    product: "EPA SWMM 5 (Dynamic Wave routing)",
    tagline:
      "Node–link dynamic-wave solver using an implicit backward Euler formulation with successive relaxation iterations.",
    topics: {
      governing_equations: [
        "Solves the complete 1D Saint-Venant continuity and momentum equations for conduits, together with a nodal continuity (volume balance) relationship in a node–link network representation.",
        "Dynamic wave accounts for storage, backwater, entrance/exit losses, flow reversal, and pressurized flow.",
      ],
      discretisation_unknowns: [
        "Uses an EXTRAN-derived node–link approach: conduits are links between two nodes.",
        "Node depths are calculated by explicitly integrating the conservation of mass equation: ∂H/∂t = ΣQ / SurfaceArea. This formulation requires every node to have a non-zero surface area (defaulting to a 4ft/1.2m diameter) to prevent instability.",
        "A long conduit is represented as a single link unless manually subdivided.",
      ],
      node_surface_area: [
        "Under FREE SURFACE flow: Node effective surface area = A_node + ½·Σ(W_i × L_i) — each connecting conduit contributes HALF its top surface area to the node for depth change calculations.",
        "A minimum surface area is enforced (default: 12.566 ft² for a 4-ft diameter) to prevent division-by-zero.",
        "Under SURCHARGE, the method switches to using dQ/dH.",
      ],
      time_integration: [
        "Momentum equation is solved with an implicit backward Euler method.",
        "Solution advances via an iterative procedure that alternates between updating link flows and node heads.",
      ],
      nonlinear_solver: [
        "Uses a successive approximation (functional iteration) scheme with relaxation (factor θ = 0.5).",
        "Convergence tolerance and maximum trials are user-configurable.",
        "Links whose end-node heads have converged can be skipped in subsequent iterations.",
      ],
      time_step_control: [
        "Supports fixed or variable time step mode.",
        "Variable mode selects Δt based on a Courant-type criterion and a head-change limit, bounded by user-defined min/max values.",
        "Nonlinear effects can trigger automatic timestep reduction; rapid convergence can trigger doubling.",
      ],
      pressurisation_surcharge: [
        "A node is surcharged when all connected conduits are full or when node water level exceeds the crown of the highest connected conduit.",
        "Historically used a 'surcharge algorithm' at pressurized nodes; an optional Preissmann Slot method is available to handle pressurized flow smoothly.",
      ],
      inertia_supercritical_handling: [
        "Provides user options to damp or ignore inertial terms (convective acceleration).",
        "Uses Froude-number-based logic to aid stability near supercritical conditions (terms phased out as Froude number increases from 0.5 to 1).",
      ],
      stability_devices: [
        "Imposes a global minimum surface area at nodes (default 4-ft diameter) as a computational device to prevent the head update formula (∂H/∂t = ΣQ/A) from becoming unbounded.",
        "Has special-case adjustments for dry/critical conditions at conduit ends.",
      ],
      conduit_models: [
        "SWMM uses a single Dynamic Wave routing approach for all conduits — no per-conduit solution model selection.",
        "Supports standard shapes (circular, rectangular, etc.).",
        "Force mains are modeled using the same dynamic wave equations with surcharge or Preissmann slot handling.",
      ],
      engine_integration: [
        "The EPA SWMM5 engine is a public-domain, integrated hydrology-hydraulics model.",
        "It is the core engine used in EPA SWMM, PCSWMM, InfoSWMM, and others.",
        "It can also be run inside InfoWorks ICM as an alternative solver (ICM SWMM).",
      ],
      stability_perception: [
        "Can be less numerically stable in certain conditions (e.g., small flows over long weirs, fully dry systems) compared to commercial engines like ICM or MOUSE.",
        "Requires careful tuning of parameters (minimum node area, time step) for challenging networks.",
        "Can simulate truly dry links and nodes (zero flow).",
      ],
      use_case_strengths: [
        "Excellent for public domain, standardized modeling.",
        "Highly effective for urban drainage systems, LID modeling, water quality, and long-term continuous simulation.",
        "The dynamic wave solver is theoretically complete but may require more user intervention for stability in complex pressurised or looped networks.",
      ],
    },
    sources: [
      {
        label: "SWMM 5 Reference Manual, Volume II – Hydraulics (Rossman, May 2017)",
        url: "https://downloads.tuflow.com/SWMM/SWMM5_Reference_Manual_Volume2_Hydaulics_P100S9AS.pdf",
        notes: "See Dynamic Wave Analysis (Ch. 3): node–link approach, implicit backward Euler, solution procedure, variable time step.",
      },
      {
        label: "SWMM 5 Reference Manual Volume II Addendum — Preissmann Slot (Feb 2022)",
        url: "https://www.epa.gov/system/files/documents/2022-02/swmm5-reference-manual-ii-addendum-20220210mas2wr-1.pdf",
        notes: "Explains optional Preissmann Slot method for pressurized flow in SWMM.",
      },
      {
        label: "SWMM 5.1 User's Manual (Aug 2015)",
        url: "https://www.epa.gov/sites/default/files/2019-02/documents/epaswmm5_1_manual_master_8-2-15.pdf",
        notes: "High-level description of Dynamic Wave routing capabilities and stability/time step considerations.",
      },
      {
        label: "EPA SWMM Website — Storm Water Management Model",
        url: "https://www.epa.gov/water-research/storm-water-management-model-swmm",
        notes: "Official EPA page describing SWMM applications and capabilities.",
      },
      {
        label: "QA/QC Hydraulic Comparison of InfoWorks ICM, SWMM5 and XPSWMM (ICWMM 2018)",
        url: "https://www.icwmm.org/Archive/2018-C027-08/qa-qc-hydraulic-comparison-of-infoworks-icm-swmm5-and-xpswmm-for-gravity-partial-pressure-and-force",
        notes: "Detailed comparison of node-link solution, area calculation, and Froude number handling across models.",
      },
      {
        label: "OpenSWMM Discussion — InfoWorks and Stability",
        url: "https://openswmm.org/Topic/4140/infoworks-and-stability",
        notes: "User discussion on relative numerical stability of SWMM5 vs. commercial engines.",
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
        "The momentum equation includes terms for discharge, cross-sectional area, gravity, bed slope, and conveyance.",
        "Pressurised flow replaces free surface width with B = g·Af/Cp², enabling the Preissmann slot concept for smooth surcharge transitions.",
        "Offers multiple solution models per conduit: 'Full' (Saint-Venant), 'Pressurised Pipe', 'Force Main', 'Permeable', and 'Finite Volume' for trans-critical flow.",
      ],
      discretisation_unknowns: [
        "Each conduit is split into N computational points (default spacing ~ 20 × conduit diameter), yielding a distributed finite-difference representation along the conduit length.",
        "Adjacent computational points are coupled via discretised Saint‑Venant equations; internal nodes satisfy a continuity equation.",
        "Node water levels are solved simultaneously with link variables in the global matrix.",
        "Boundary conditions between links and nodes are of outfall or headloss type, relating discharge Qi and level yi.",
      ],
      node_surface_area: [
        "Manhole/node area in ICM is the ACTUAL shaft area only (e.g., physical chamber dimensions).",
        "Conduit storage is computed WITHIN each conduit via the distributed computational points, not lumped at nodes.",
        "Because storage is distributed along conduits, ICM does not need to add half the conduit surface area to the node area (unlike SWMM).",
        "Node area is used only for storage above the highest connecting pipe soffit (chamber/shaft storage) and for ponding calculations.",
        "No minimum area constraint is required for numerical stability because the coupled matrix solution does not use an explicit ∂H/∂t = ΣQ/A formulation.",
      ],
      time_integration: [
        "Approximates Saint‑Venant equations using the Preissmann 4‑point box scheme with a time-weighting parameter θ (typically ~0.65).",
        "The implicit nature removes CFL restrictions for stability.",
        "Node continuity is approximated by an implicit Euler method.",
        "For the Finite Volume solver, equations are discretised implicitly in time with first-order spatial discretisation, using a Roe Riemann solver.",
      ],
      nonlinear_solver: [
        "Forms a large coupled nonlinear algebraic system at each time level and solves it iteratively using the Newton–Raphson method.",
        "Uses a double-sweep method (Liggett and Cunge, 1975) to reduce the matrix by local elimination along links between nodes.",
        "The implicit terms at time n+1 are linearised with a first-order Taylor series expansion.",
      ],
      time_step_control: [
        "The implicit scheme has no CFL-based timestep restriction.",
        "Time-step control is managed through the nonlinear solver's convergence.",
        "If Newton-Raphson iteration fails to converge, timestep is progressively halved; if convergence is quick, timestep can be doubled.",
      ],
      pressurisation_surcharge: [
        "Employs a Preissmann slot as the standard method for smooth transition between free surface and surcharged conditions.",
        "A transition region (monotonic cubic) is included between true pipe geometry and Preissmann slot width to avoid abrupt changes in wave celerity.",
        "Slot width is defined such that wave celerity in the slot is ~10× that at half the conduit height, resulting in a slot width of approximately 2% of the conduit width.",
        "Note: Maximum conveyance in a closed pipe occurs below the pipe soffit; ICM imposes monotonicity on conveyance to avoid multiple numerical solutions.",
      ],
      inertia_supercritical_handling: [
        "Provides option to exclude the inertia (dQ/dt) term via 'Drop inertia in pressure pipes' setting.",
        "Phases out inertial terms as characteristic Froude number approaches unity to preserve subcritical-like behaviour in the core solver.",
        "A separate Finite Volume solver is available for true trans-critical flow scenarios, properly resolving hydraulic jumps within conduits.",
      ],
      stability_devices: [
        "Introduces a nominal base flow (defined from normal flow at a base depth of 5% of conduit height) to avoid oscillations/instability at very low depths.",
        "Base flow is introduced inside the network solver and removed within boundary conditions, preserving volume conservation.",
        "For Force Mains: water level is maintained at least to pipe soffit level at the interface with gravity solutions.",
      ],
      conduit_models: [
        "'Full' (Saint-Venant): Standard conduit model with Preissmann slot for surcharge handling.",
        "'Pressurised Pipe': For rising mains/inverted siphons — more accurate velocities and storage than Full model.",
        "'Force Main': For long rising mains under low hydraulic heads — assumes pipe is always full.",
        "'Permeable': For permeable pavements; uses Darcy's Law with porosity considerations.",
        "'Finite Volume': Prototype solver for trans-critical flow with hydraulic jumps.",
      ],
      engine_integration: [
        "InfoWorks ICM's native engine is a proprietary, commercial hydraulic solver developed by Innovyze (now Autodesk).",
        "Known for stability and performance in large, complex integrated catchment models.",
        "Since December 2019, InfoWorks ICM can also run the EPA SWMM5 engine natively (ICM SWMM), allowing side-by-side comparison or use of SWMM-specific features.",
      ],
      stability_perception: [
        "Generally perceived as more numerically robust and stable, especially for large networks with complex interactions and transient conditions.",
        "The base flow mechanism and coupled matrix solver help prevent oscillations in nearly-dry conditions.",
        "However, a network cannot be simulated as truly 'dry' (zero flow); the base flow represents a persistent minimal flow.",
      ],
      use_case_strengths: [
        "Designed for large-scale, integrated catchment modeling (1D/2D).",
        "Excels in complex sewer and river systems, real-time control (RTC), flood risk mapping, and large-scale asset planning.",
        "The multiple solution models and inherent stability make it well-suited for challenging hydraulic scenarios with minimal user intervention.",
      ],
    },
    sources: [
      {
        label: "InfoWorks ICM Online Help — Hydraulic Theory",
        url: "https://help2.innovyze.com/infoworksicm/Content/HTML/ICM_ILCM/Hydraulic_Theory.htm",
        notes: "Documents Preissmann 4‑point scheme, θ≈0.65, Newton–Raphson with double-sweep, timestep halving/doubling, base flow, Preissmann slot details, conduit solution models.",
      },
      {
        label: "Autodesk InfoWorks ICM Product Overview",
        url: "https://www.autodesk.com/products/infoworks-icm/overview",
        notes: "Describes InfoWorks ICM engine as 'fast, robust, stable, and efficient'.",
      },
      {
        label: "Autodesk Blog — Switch from InfoSWMM to InfoWorks ICM",
        url: "https://www.autodesk.com/blogs/water/2023/05/10/is-it-time-for-you-to-make-the-switch-from-infoswmm-to-infoworks-icm/",
        notes: "Documents addition of EPA SWMM5 engine as alternative solver inside InfoWorks ICM (December 2019).",
      },
      {
        label: "QA/QC Hydraulic Comparison of InfoWorks ICM, SWMM5 and XPSWMM (ICWMM 2018)",
        url: "https://www.icwmm.org/Archive/2018-C027-08/qa-qc-hydraulic-comparison-of-infoworks-icm-swmm5-and-xpswmm-for-gravity-partial-pressure-and-force",
        notes: "Describes ICM's 4-point implicit link solution with computational points, Froude number handling, and base flow mechanism.",
      },
      {
        label: "OpenSWMM Discussion — InfoWorks and Stability",
        url: "https://openswmm.org/Topic/4140/infoworks-and-stability",
        notes: "User discussion comparing numerical stability of ICM vs SWMM5.",
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
  { key: "engine_integration", label: "Engine integration and context" },
  { key: "stability_perception", label: "Perceived stability and dry network handling" },
  { key: "use_case_strengths", label: "Primary use case and strengths" },
] as const;

export type TopicKey = (typeof TOPIC_ORDER)[number]["key"];
