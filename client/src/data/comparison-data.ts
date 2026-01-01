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
        "Variable time step mode selects the next Δt based on: (a) a Courant-type criterion over conduits and (b) a head-change limit over non-outfall, non-surcharged nodes, bounded by user-supplied Δtmin and Δtmax.",
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
      engine_integration: [
        "EPA SWMM5 is a public-domain, open-source engine maintained by the US EPA.",
        "Used as the core engine in: EPA SWMM GUI, PCSWMM, InfoSWMM, H2OMAP SWMM, and others.",
        "Can run inside InfoWorks ICM as an alternative solver (ICM SWMM networks) since December 2019.",
        "Source code available on GitHub; extensive community development and quality assurance.",
      ],
      dry_network_handling: [
        "Can simulate truly dry links and nodes (zero flow).",
        "Networks can be initialized from completely dry conditions.",
        "May require careful timestep management during initial wetting to avoid instability.",
        "Useful for modeling intermittent streams or systems with long dry periods.",
      ],
      stability_robustness: [
        "Generally stable for most urban drainage applications.",
        "Can be less stable than ICM/MOUSE in certain scenarios: small flows over long weirs, complex pressurized networks with multiple pumps, force mains with large diameter changes, highly looped networks.",
        "Requires careful parameter tuning (minimum node area, time step, surcharge method) for challenging networks.",
        "Advantage: Completely dry simulation capability.",
      ],
      use_case_strengths: [
        "Optimal for: Regulatory compliance modeling (NPDES, CSO permits), long-term continuous simulation (months to years), water quality and pollutant transport modeling, Low Impact Development (LID) analysis, academic research and method development, models requiring public-domain/open-source tools.",
        "Strengths: Zero cost (public domain), transparent/auditable source code, strong water quality capabilities, excellent LID modeling, wide regulatory acceptance.",
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
        "The momentum equation: ∂Q/∂t + ∂(Q²/A)/∂x + gA·cos(θ)·∂h/∂x = gA(S₀ − Q|Q|/K²).",
        "Pressurised flow replaces free surface width with B = g·Af/Cp², enabling the Preissmann slot concept for smooth surcharge transitions.",
        "Offers multiple solution models per conduit: 'Full' (Saint-Venant), 'Pressurised Pipe', 'Force Main', 'Permeable', and 'Finite Volume' for trans-critical flow.",
      ],
      discretisation_unknowns: [
        "Each conduit is split into N computational points (default spacing ~ 20 × conduit diameter), yielding a distributed finite-difference representation along the conduit length.",
        "Each pair of adjacent points in a conduit is linked by the discrete form of the Saint-Venant equations, resulting in 2N-2 equations available to describe the flow state.",
        "Adjacent computational points are coupled via discretised Saint‑Venant equations; internal nodes satisfy a continuity equation.",
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
        "For the Finite Volume solver: equations are discretised implicitly in time with first-order spatial discretisation, using a Roe Riemann solver for flux terms at cell interfaces.",
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
        "Employs a Preissmann slot as the standard method for smooth transition between free surface and surcharged conditions; the slot is a conceptual vertical narrow slot at the pipe soffit.",
        "A transition region (monotonic cubic) is included between the true pipe geometry and the Preissmann slot width to avoid abrupt changes in surface width derivative and wave celerity.",
        "Slot width is defined such that wave celerity in the slot is ~10× that at half the conduit height, resulting in a slot width of approximately 2% of the conduit width.",
        "Note: Maximum conveyance in a closed pipe occurs below the pipe soffit; ICM imposes monotonicity on conveyance to avoid turning points and multiple numerical solutions.",
      ],
      inertia_supercritical_handling: [
        "Provides option to exclude the inertia (dQ/dt) term via 'Drop inertia in pressure pipes' setting; can be used with 'Stay pressurised' option to prevent negative depths in force mains.",
        "Phases out inertial terms as characteristic Froude number approaches unity to preserve subcritical-like behaviour in the core solver.",
        "A separate Finite Volume solver is available for true trans-critical flow scenarios, properly resolving hydraulic jumps within conduits using a Roe Riemann solver.",
      ],
      stability_devices: [
        "Introduces a nominal base flow (defined from normal flow at a base depth of 5% of conduit height) to avoid oscillations/instability associated with multiple flow states at very low depths.",
        "Base flow is introduced inside the network solver and removed within boundary conditions, preserving volume conservation.",
        "For Force Mains: water level is maintained at least to pipe soffit level at the interface with gravity solutions throughout simulation.",
      ],
      conduit_models: [
        "'Full' (Conduit Model): Standard Saint-Venant equations with Preissmann slot for surcharge handling; supports variable roughness (bottom third vs remainder) and permanent sediment depth.",
        "'Pressurised Pipe': For rising mains/inverted siphons — more accurately predicts velocities and storage than Full model as it doesn't assign base flow or Preissmann slot.",
        "'Force Main': Advanced model for long rising mains under low hydraulic heads — assumes pipe is always full even if hydraulic grade line drops below soffit (can show negative depths like a siphon).",
        "'Permeable': For permeable pavements; uses Darcy's Law (Q = K·A·Δh/L) with porosity considerations.",
        "'Finite Volume': Prototype solver for trans-critical flow with hydraulic jumps; uses conservative vector form and Roe Riemann solver at cell interfaces.",
      ],
      engine_integration: [
        "InfoWorks ICM native engine is a proprietary, commercial solver developed by Innovyze (now Autodesk).",
        "Known for stability and performance in large, complex integrated catchment models (1D/1D, 1D/2D coupling).",
        "Since December 2019, InfoWorks ICM can also run the EPA SWMM5 engine natively (ICM SWMM), allowing side-by-side comparison or use of SWMM-specific features (e.g., true dry network simulation).",
        "Native ICM engine does not expose source code; validation through official documentation and benchmark testing.",
      ],
      dry_network_handling: [
        "Cannot simulate truly dry links — maintains a nominal base flow (typically 5% of normal depth) in all links at all times.",
        "This base flow is a numerical device to avoid instability, not representative of actual flow.",
        "Networks are typically initialized with some minimal water level or flow.",
        "For modeling intermittent/dry conditions, users may use ICM SWMM (the embedded SWMM5 engine) which can handle dry networks.",
      ],
      stability_robustness: [
        "Perceived as more numerically robust and stable, especially for large networks with complex interactions and transient conditions.",
        "The base flow mechanism and coupled matrix solver help prevent oscillations in nearly-dry conditions.",
        "Often chosen for: Complex pressurized networks, systems with multiple interacting pumps, large combined sewer systems, real-time control applications.",
        "Trade-off: Cannot model truly dry conditions; base flow may slightly affect mass balance in low-flow scenarios.",
      ],
      use_case_strengths: [
        "Optimal for: Large-scale asset planning, flood risk mapping (1D/2D), complex RTC (real-time control) systems, integrated catchment modeling (sewer/river/surface), high-performance commercial projects.",
        "Strengths: Superior numerical stability, integrated 1D/2D capabilities, efficient handling of large networks (100,000+ nodes), built-in sensitivity and optimization tools.",
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
  { key: "engine_integration", label: "Engine integration and platform context" },
  { key: "dry_network_handling", label: "Dry network handling and initialization" },
  { key: "stability_robustness", label: "Comparative stability and robustness" },
  { key: "use_case_strengths", label: "Primary use cases and strengths" },
] as const;

export type TopicKey = (typeof TOPIC_ORDER)[number]["key"];
