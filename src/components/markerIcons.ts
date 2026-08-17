import L from "leaflet";

function emojiDivIcon(emoji: string, background: string): L.DivIcon {
  return L.divIcon({
    className: "emoji-marker",
    html: `<span style="background:${background}">${emoji}</span>`,
    iconSize: [32, 32],
    iconAnchor: [16, 30],
    popupAnchor: [0, -28],
  });
}

export const washroomIcon = emojiDivIcon("🚻", "#2563eb");
export const nearestWashroomIcon = emojiDivIcon("🚻", "#16a34a");
export const userLocationIcon = emojiDivIcon("📍", "#dc2626");
