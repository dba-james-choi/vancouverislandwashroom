# vancouverislandwashroom

밴쿠버 아일랜드(Vancouver Island) 관광객을 위한 공중화장실 위치 지도 웹앱.

## 프로젝트 구조

- `src/App.tsx` — 메인 레이아웃: 검색/필터 컨트롤, 목록, 지도를 묶는 컨테이너
- `src/components/MapView.tsx` — Leaflet 지도, 화장실/내 위치 마커
- `src/components/WashroomList.tsx` — 사이드바 목록 (거리순 정렬 지원)
- `src/components/markerIcons.ts` — 이모지 기반 Leaflet DivIcon 정의
- `src/hooks/useWashrooms.ts` — OSM 데이터 + 수동 큐레이션 데이터 병합/중복 제거
- `src/lib/overpass.ts` — Overpass API로 밴쿠버 아일랜드 bounding box 내 `amenity=toilets` 조회
- `src/lib/geo.ts` — Haversine 거리 계산
- `src/data/manualWashrooms.ts` — 주요 관광지(빅토리아, 나나이모, 토피노 등) 수동 큐레이션 화장실 목록
- `src/types/washroom.ts` — `Washroom` 타입 정의

## 데이터 소스

- **OpenStreetMap (Overpass API)**: 실시간으로 `amenity=toilets` 태그된 노드/웨이를 가져옴. 무료, 라이선스는 ODbL — 앱 어딘가에 OSM 출처 표기 필요(현재 지도 하단 attribution + footer에 표기됨).
- **수동 큐레이션 데이터**: OSM에 누락되기 쉬운 주요 관광지 화장실을 보완. `src/data/manualWashrooms.ts`에서 관리. OSM 데이터와 120m 이내로 겹치면 자동으로 중복 제거됨(`useWashrooms.ts`의 `DEDUPE_RADIUS_KM`).

## 빌드/개발 명령어

```bash
npm install
npm run dev      # 개발 서버
npm run build    # tsc -b && vite build
npm run lint      # oxlint
npm run preview   # 빌드 결과 미리보기
```

## 아키텍처 개요

- Vite + React + TypeScript, 상태관리는 로컬 `useState`/`useMemo`만 사용 (전역 상태 라이브러리 없음)
- 지도: `react-leaflet` + OpenStreetMap 타일 서버 (API 키 불필요)
- 위치 기반 "내 근처 화장실 찾기"는 브라우저 Geolocation API 사용, 사용자 동의 필요
- 백엔드 없음 — 순수 정적 웹앱, Overpass API를 클라이언트에서 직접 호출
