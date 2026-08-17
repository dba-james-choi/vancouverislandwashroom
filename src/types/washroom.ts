export type WashroomSource = "osm" | "manual";

export interface Washroom {
  id: string;
  name: string;
  lat: number;
  lon: number;
  source: WashroomSource;
  /** Free-text place/area name, e.g. "Victoria", "Tofino" */
  area?: string;
  fee?: boolean;
  openingHours?: string;
  wheelchairAccessible?: boolean;
  changingTable?: boolean;
  notes?: string;
}
