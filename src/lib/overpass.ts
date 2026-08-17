import type { Washroom } from "../types/washroom";

// Bounding box covering Vancouver Island, BC (south, west, north, east).
export const VANCOUVER_ISLAND_BBOX = {
  south: 48.28,
  west: -125.9,
  north: 50.95,
  east: -122.9,
} as const;

export const VANCOUVER_ISLAND_CENTER: [number, number] = [49.55, -125.1];

const OVERPASS_ENDPOINT = "https://overpass-api.de/api/interpreter";

interface OverpassElement {
  type: "node" | "way" | "relation";
  id: number;
  lat?: number;
  lon?: number;
  center?: { lat: number; lon: number };
  tags?: Record<string, string>;
}

interface OverpassResponse {
  elements: OverpassElement[];
}

function buildQuery(): string {
  const { south, west, north, east } = VANCOUVER_ISLAND_BBOX;
  const bbox = `${south},${west},${north},${east}`;
  return `[out:json][timeout:25];
(
  node["amenity"="toilets"](${bbox});
  way["amenity"="toilets"](${bbox});
);
out center tags;`;
}

function parseYesNo(value: string | undefined): boolean | undefined {
  if (value === undefined) return undefined;
  return value === "yes";
}

function elementToWashroom(el: OverpassElement): Washroom | null {
  const lat = el.type === "node" ? el.lat : el.center?.lat;
  const lon = el.type === "node" ? el.lon : el.center?.lon;
  if (lat === undefined || lon === undefined) return null;

  const tags = el.tags ?? {};
  const nameFromTags = tags.name;

  return {
    id: `osm-${el.type}-${el.id}`,
    name: nameFromTags || "공중화장실 (Public Washroom)",
    lat,
    lon,
    source: "osm",
    fee: tags.fee === "yes" ? true : tags.fee === "no" ? false : undefined,
    openingHours: tags.opening_hours,
    wheelchairAccessible: parseYesNo(tags.wheelchair),
    changingTable: parseYesNo(tags.changing_table),
  };
}

/** Fetches public toilet locations on Vancouver Island from OpenStreetMap via Overpass API. */
export async function fetchOsmWashrooms(
  signal?: AbortSignal,
): Promise<Washroom[]> {
  const response = await fetch(OVERPASS_ENDPOINT, {
    method: "POST",
    body: `data=${encodeURIComponent(buildQuery())}`,
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    signal,
  });

  if (!response.ok) {
    throw new Error(`Overpass API error: ${response.status}`);
  }

  const data: OverpassResponse = await response.json();
  return data.elements
    .map(elementToWashroom)
    .filter((w): w is Washroom => w !== null);
}
