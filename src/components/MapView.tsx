import { MapContainer, Marker, Popup, TileLayer, useMap } from "react-leaflet";
import { useEffect } from "react";
import { VANCOUVER_ISLAND_CENTER } from "../lib/overpass";
import type { Washroom } from "../types/washroom";
import {
  nearestWashroomIcon,
  userLocationIcon,
  washroomIcon,
} from "./markerIcons";

interface MapViewProps {
  washrooms: Washroom[];
  userLocation: { lat: number; lon: number } | null;
  nearestId: string | null;
  focusedWashroom: Washroom | null;
}

function MapFlyTo({ target }: { target: [number, number] | null }) {
  const map = useMap();
  useEffect(() => {
    if (target) map.flyTo(target, 16, { duration: 0.6 });
  }, [target, map]);
  return null;
}

function washroomLabel(w: Washroom): string {
  const parts: string[] = [];
  if (w.fee) parts.push("💰 유료");
  if (w.wheelchairAccessible) parts.push("♿ 휠체어 접근 가능");
  if (w.changingTable) parts.push("🧷 기저귀 교환대");
  if (w.openingHours) parts.push(`🕒 ${w.openingHours}`);
  return parts.join(" · ");
}

export function MapView({
  washrooms,
  userLocation,
  nearestId,
  focusedWashroom,
}: MapViewProps) {
  const focusTarget: [number, number] | null = focusedWashroom
    ? [focusedWashroom.lat, focusedWashroom.lon]
    : null;

  return (
    <MapContainer
      center={VANCOUVER_ISLAND_CENTER}
      zoom={8}
      scrollWheelZoom
      className="map-container"
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      <MapFlyTo target={focusTarget} />

      {userLocation && (
        <Marker
          position={[userLocation.lat, userLocation.lon]}
          icon={userLocationIcon}
        >
          <Popup>현재 위치</Popup>
        </Marker>
      )}

      {washrooms.map((w) => (
        <Marker
          key={w.id}
          position={[w.lat, w.lon]}
          icon={w.id === nearestId ? nearestWashroomIcon : washroomIcon}
        >
          <Popup>
            <strong>{w.name}</strong>
            {w.area && <div>{w.area}</div>}
            {washroomLabel(w) && <div>{washroomLabel(w)}</div>}
          </Popup>
        </Marker>
      ))}
    </MapContainer>
  );
}
