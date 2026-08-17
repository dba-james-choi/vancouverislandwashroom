# 밴쿠버 아일랜드 공중화장실 지도

밴쿠버 아일랜드를 여행하는 관광객이 가장 가까운 공중화장실을 빠르게 찾을 수 있도록 돕는 지도 웹앱입니다.

## 주요 기능

- 지도(Leaflet + OpenStreetMap 타일)에서 화장실 위치 확인
- 지역명/장소명으로 검색
- 무료 화장실만 / 휠체어 접근 가능만 필터링
- "내 근처 화장실 찾기" — 브라우저 위치 정보 기반으로 가장 가까운 화장실을 지도에서 강조하고 목록을 거리순 정렬

## 데이터 출처

- [OpenStreetMap](https://www.openstreetmap.org/copyright) contributors (ODbL) — Overpass API로 실시간 조회
- 주요 관광지 큐레이션 데이터 (`src/data/manualWashrooms.ts`)로 OSM 누락분 보완

## 개발

```bash
npm install
npm run dev
```

## 빌드

```bash
npm run build
npm run preview
```
