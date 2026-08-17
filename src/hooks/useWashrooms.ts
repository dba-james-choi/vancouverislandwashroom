import { useEffect, useState } from "react";
import { manualWashrooms } from "../data/manualWashrooms";
import { haversineKm } from "../lib/geo";
import { fetchOsmWashrooms } from "../lib/overpass";
import type { Washroom } from "../types/washroom";

// Manual entries within this distance of an OSM entry are treated as
// duplicates of it and dropped, so the map doesn't show two pins for
// the same washroom.
const DEDUPE_RADIUS_KM = 0.12;

function mergeWashrooms(osm: Washroom[], manual: Washroom[]): Washroom[] {
  const uniqueManual = manual.filter(
    (m) =>
      !osm.some((o) => haversineKm(m.lat, m.lon, o.lat, o.lon) < DEDUPE_RADIUS_KM),
  );
  return [...osm, ...uniqueManual];
}

interface UseWashroomsResult {
  washrooms: Washroom[];
  loading: boolean;
  error: string | null;
}

/** Loads Vancouver Island washrooms from OSM, falling back to (and
 * always supplementing with) the curated manual list. */
export function useWashrooms(): UseWashroomsResult {
  const [washrooms, setWashrooms] = useState<Washroom[]>(manualWashrooms);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const controller = new AbortController();

    fetchOsmWashrooms(controller.signal)
      .then((osm) => {
        setWashrooms(mergeWashrooms(osm, manualWashrooms));
        setError(null);
      })
      .catch((err) => {
        if (controller.signal.aborted) return;
        setError(
          err instanceof Error ? err.message : "화장실 데이터를 불러오지 못했습니다.",
        );
      })
      .finally(() => {
        if (!controller.signal.aborted) setLoading(false);
      });

    return () => controller.abort();
  }, []);

  return { washrooms, loading, error };
}
