import type { Washroom } from "../types/washroom";

interface WashroomListItem {
  washroom: Washroom;
  distanceKm: number | null;
}

interface WashroomListProps {
  items: WashroomListItem[];
  selectedId: string | null;
  onSelect: (washroom: Washroom) => void;
}

export function WashroomList({ items, selectedId, onSelect }: WashroomListProps) {
  if (items.length === 0) {
    return <p className="empty-state">조건에 맞는 화장실이 없습니다.</p>;
  }

  return (
    <ul className="washroom-list">
      {items.map(({ washroom, distanceKm }) => (
        <li key={washroom.id}>
          <button
            type="button"
            className={washroom.id === selectedId ? "washroom-item selected" : "washroom-item"}
            onClick={() => onSelect(washroom)}
          >
            <div className="washroom-item-header">
              <span className="washroom-name">{washroom.name}</span>
              {distanceKm !== null && (
                <span className="washroom-distance">{distanceKm.toFixed(1)}km</span>
              )}
            </div>
            {washroom.area && <div className="washroom-area">{washroom.area}</div>}
            <div className="washroom-badges">
              {washroom.fee && <span className="badge">💰 유료</span>}
              {washroom.wheelchairAccessible && <span className="badge">♿ 접근성</span>}
              {washroom.changingTable && <span className="badge">🧷 기저귀교환대</span>}
            </div>
          </button>
        </li>
      ))}
    </ul>
  );
}
