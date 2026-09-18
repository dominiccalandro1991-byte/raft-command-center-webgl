export type AppState = "MATERIALS" | "ASSEMBLY" | "RENDER" | "SIMULATION";
export type MaterialKey = "Pontoons" | "Decking" | "Bindings" | "Tools";
export type TheaterId = "mississippi" | "illinois";

export type MaterialSpec = {
  key: MaterialKey;
  title: string;
  source: string;
  qty: string;
  size: string;
  function: string;
};

export type AssemblyPhase = {
  id: string;
  title: string;
  summary: string;
  steps: string[];
};

export type Theater = {
  id: TheaterId;
  title: string;
  currentMin: number;
  currentMax: number;
  vector: string;
  steering: string;
  propulsion: string;
  hazards: string[];
};

export const MATERIALS: Record<MaterialKey, MaterialSpec> = {
  Pontoons: {
    key: "Pontoons",
    title: "Pontoons",
    source: "Standing dead pine / cottonwood",
    qty: "2–4",
    size: "L 2.5 m · D 15 cm",
    function: "Primary buoyancy",
  },
  Decking: {
    key: "Decking",
    title: "Decking",
    source: "Hardwood saplings",
    qty: "10–15",
    size: "L 1.5 m · D 5 cm",
    function: "Load distribution",
  },
  Bindings: {
    key: "Bindings",
    title: "Bindings",
    source: "Wild grapevine",
    qty: "50 ft",
    size: "High-tension lash",
    function: "Structural lashing",
  },
  Tools: {
    key: "Tools",
    title: "Tools",
    source: "Folding saw, claw hammer, 16d nails",
    qty: "Field kit",
    size: "Handheld",
    function: "Extraction and fastening",
  },
};

export const ASSEMBLY: AssemblyPhase[] = [
  {
    id: "harvest",
    title: "Phase 1 — Pontoon harvesting",
    summary: "Fell logs with the folding saw. Cut uniform 2.4 m lengths. Stage at the waterline before any lashing.",
    steps: [
      "Select standing dead pine or cottonwood with no rot through the pith.",
      "Fell and buck to 2.4 m. Debark only enough to seat lashings.",
      "Roll to waterline. Keep the pair matched within 5 cm of length.",
    ],
  },
  {
    id: "frame",
    title: "Phase 2 — Frame integration",
    summary: "Space primary logs 90 cm apart. Lay saplings perpendicular at ~10 cm intervals. Fasten with 16d nails or grapevine square lashings.",
    steps: [
      "Set two (or four) pontoons parallel, 90 cm center-to-center.",
      "Lay 10–15 hardwood saplings across the span.",
      "Square-lash every crossing; drive 16d nails at the outer rails if available.",
    ],
  },
  {
    id: "propulsion",
    title: "Phase 3 — Propulsion mounting",
    summary: "Raise an A-frame telescopic pole. Taper distal ends. Fasten proximal ends with overlapping grapevine bindings.",
    steps: [
      "Taper two saplings and bind them into an A-frame at the stern.",
      "Seat a punt pole in the apex; leave it free to slide.",
      "Test lashings dry before committing to current.",
    ],
  },
];

export const THEATERS: Record<TheaterId, Theater> = {
  mississippi: {
    id: "mississippi",
    title: "Mississippi River",
    currentMin: 1.5,
    currentMax: 2.2,
    vector: "Downstream drift is primary. Lateral shear from wing-dam boils.",
    steering: "Box-paddle for lateral shear correction.",
    propulsion: "Current + punt pole. Do not fight the main stem.",
    hazards: ["Wing dams", "Commercial barge wakes", "Undercut banks", "Debris rafts"],
  },
  illinois: {
    id: "illinois",
    title: "Southern Illinois lakes",
    currentMin: 0.02,
    currentMax: 0.18,
    vector: "Wind-dependent fetch. No reliable downstream.",
    steering: "Quarter into the breeze; keep the bow light.",
    propulsion: "A-frame punt pole or eolian kite sail.",
    hazards: ["Submerged timber (Rend Lake)", "Lake of Egypt stumps", "Sudden fetch chop"],
  },
};
