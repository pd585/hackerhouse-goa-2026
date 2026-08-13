export type Stage = "enter" | "builder" | "stack" | "team" | "network" | "wave";

export const STAGES: Stage[] = ["enter", "builder", "stack", "team", "network", "wave"];

export interface BuilderData {
  photo: string | null;
  photoZoom: number;
  photoOffsetX: number;
  photoOffsetY: number;
  name: string;
  role: string;
  teamName: string;
  stack: string[];
  signalId: string;
}

export const emptyBuilder = (): BuilderData => ({
  photo: null,
  photoZoom: 1,
  photoOffsetX: 0,
  photoOffsetY: 0,
  name: "",
  role: "",
  teamName: "",
  stack: [],
  signalId: "",
});

export const ROLE_TITLES: Record<string, string> = {
  "Full Stack Developer": "Code Voyager",
  "Frontend Engineer": "Interface Architect",
  "Backend Engineer": "Systems Architect",
  "AI Engineer": "Intelligence Builder",
  "Machine Learning Engineer": "Model Alchemist",
  "Data Engineer": "Data Pipeline Architect",
  "Product Engineer": "Product Forge",
  Designer: "Visual Storyteller",
  "Product Designer": "Experience Sculptor",
  Founder: "Venture Builder",
  "Indie Hacker": "Solo Ship Captain",
  Researcher: "Frontier Explorer",
  DevRel: "Ecosystem Catalyst",
  "Student Builder": "NextGen Pioneer",
};

export const ROLES = Object.keys(ROLE_TITLES);

export const builderTitle = (role: string) => ROLE_TITLES[role] ?? "Signal Builder";

/** Deterministic stack -> signal colour mapping. */
export const SIGNAL_COLORS = {
  blue: "#4FC3F7",
  green: "#39D98A",
  gold: "#F5DE19",
  magenta: "#F4237F",
} as const;

export type SignalColor = keyof typeof SIGNAL_COLORS;

export const TECHS: { name: string; color: SignalColor }[] = [
  { name: "React", color: "blue" },
  { name: "TypeScript", color: "blue" },
  { name: "Docker", color: "blue" },
  { name: "Node.js", color: "green" },
  { name: "MongoDB", color: "green" },
  { name: "Vue", color: "green" },
  { name: "Go", color: "green" },
  { name: "Python", color: "gold" },
  { name: "AWS", color: "gold" },
  { name: "SQL", color: "gold" },
  { name: "Solidity", color: "gold" },
  { name: "Next.js", color: "magenta" },
  { name: "Rust", color: "magenta" },
  { name: "Security", color: "magenta" },
];

export const techColor = (name: string): string => {
  const found = TECHS.find((t) => t.name.toLowerCase() === name.toLowerCase());
  return SIGNAL_COLORS[found?.color ?? "gold"];
};

export const generateSignalId = (name: string) => {
  const initials = (name.trim() || "GOA")
    .split(/\s+/)
    .map((p) => p[0])
    .join("")
    .slice(0, 2)
    .toUpperCase()
    .padEnd(2, "X");
  const n = Math.floor(1000 + Math.random() * 9000);
  return `HH26-${initials}${n}`;
};

/** Real Goa coordinates [lng, lat]. */
export const NODES = {
  hackerHouse: { name: "HACKER HOUSE GOA", coord: [73.7407, 15.5735] as [number, number] },
  builderCove: { name: "BUILDER COVE · ANJUNA", coord: [73.7444, 15.5865] as [number, number] },
  stackBay: { name: "STACK BAY · PALOLEM", coord: [74.0233, 15.01] as [number, number] },
  teamNode: { name: "TEAM NODE · ASSAGAO", coord: [73.7833, 15.59] as [number, number] },
  lighthouse: { name: "SIGNAL LIGHTHOUSE · AGUADA", coord: [73.7735, 15.4926] as [number, number] },
  panaji: { name: "GOA NODE · PANAJI", coord: [73.8278, 15.4909] as [number, number] },
};

export const fmtCoord = ([lng, lat]: [number, number]) => `${lat.toFixed(4)}°N ${lng.toFixed(4)}°E`;
