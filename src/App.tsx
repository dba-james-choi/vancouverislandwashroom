import { useMemo, useState } from "react";
import "./App.css";
import { MapView } from "./components/MapView";
import { WashroomList } from "./components/WashroomList";
import { useWashrooms } from "./hooks/useWashrooms";
import { haversineKm } from "./lib/geo";
import type { Washroom } from "./types/washroom";

interface UserLocation {
  lat: number;
  lon: number;
}

function App() {
  const { washrooms, loading, error } = useWashrooms();
  const [query, setQuery] = useState("");
  const [freeOnly, setFreeOnly] = useState(false);
  const [accessibleOnly, setAccessibleOnly] = useState(false);
  const [userLocation, setUserLocation] = useState<UserLocation | null>(null);
  const [locationError, setLocationError] = useState<string | null>(null);
  const [selected, setSelected] = useState<Washroom | null>(null);

  function handleFindMe() {
    if (!navigator.geolocation) {
      setLocationError("이 브라우저는 위치 정보를 지원하지 않습니다.");
      return;
    }
    setLocationError(null);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setUserLocation({
          lat: pos.coords.latitude,
          lon: pos.coords.longitude,
        });
      },
      () => setLocationError("위치 정보를 가져오지 못했습니다. 권한을 확인해주세요."),
    );
  }

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return washrooms.filter((w) => {
      if (freeOnly && w.fee) return false;
      if (accessibleOnly && !w.wheelchairAccessible) return false;
      if (!q) return true;
      return (
        w.name.toLowerCase().includes(q) ||
        (w.area?.toLowerCase().includes(q) ?? false)
      );
    });
  }, [washrooms, query, freeOnly, accessibleOnly]);

  const items = useMemo(() => {
    const withDistance = filtered.map((washroom) => ({
      washroom,
      distanceKm: userLocation
        ? haversineKm(userLocation.lat, userLocation.lon, washroom.lat, washroom.lon)
        : null,
    }));
    if (userLocation) {
      withDistance.sort((a, b) => (a.distanceKm ?? 0) - (b.distanceKm ?? 0));
    }
    return withDistance;
  }, [filtered, userLocation]);

  const nearestId = userLocation ? items[0]?.washroom.id ?? null : null;

  return (
    <div className="app-shell">
      <header className="app-header">
        <h1>🚻 밴쿠버 아일랜드 공중화장실 지도</h1>
        <p className="subtitle">
          급할 때 가장 가까운 화장실을 빠르게 찾아보세요. 여행 중 실수는 이제 그만!
        </p>
      </header>

      <div className="controls">
        <input
          type="search"
          placeholder="지역명이나 장소로 검색 (예: Tofino, Victoria)"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
        <label className="checkbox">
          <input
            type="checkbox"
            checked={freeOnly}
            onChange={(e) => setFreeOnly(e.target.checked)}
          />
          무료만
        </label>
        <label className="checkbox">
          <input
            type="checkbox"
            checked={accessibleOnly}
            onChange={(e) => setAccessibleOnly(e.target.checked)}
          />
          휠체어 접근 가능만
        </label>
        <button type="button" onClick={handleFindMe}>
          📍 내 근처 화장실 찾기
        </button>
      </div>

      {locationError && <p className="status-message error">{locationError}</p>}
      {loading && <p className="status-message">OpenStreetMap에서 화장실 정보를 불러오는 중...</p>}
      {error && (
        <p className="status-message error">
          실시간 데이터를 불러오지 못해 큐레이션된 목록만 표시합니다. ({error})
        </p>
      )}

      <main className="main-layout">
        <aside className="sidebar">
          <WashroomList items={items} selectedId={selected?.id ?? null} onSelect={setSelected} />
        </aside>
        <section className="map-section">
          <MapView
            washrooms={filtered}
            userLocation={userLocation}
            nearestId={nearestId}
            focusedWashroom={selected}
          />
        </section>
      </main>

      <footer className="app-footer">
        데이터 출처: OpenStreetMap contributors (ODbL) + 자체 큐레이션. 정확한 운영시간은 현장에서 다시 확인하세요.
      </footer>
    </div>
  );
}

export default App;
