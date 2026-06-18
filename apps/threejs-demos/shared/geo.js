/**
 * 小范围园区：经纬度 → Three.js 本地坐标（米，Y-up，Z 北向负）
 * @see docs/3d/threejs/advanced/17-gis-coordinates.md
 */
const EARTH_RADIUS = 6378137;

export function lngLatToLocal(lng, lat, refLng, refLat) {
  const x = ((lng - refLng) * Math.PI / 180) * EARTH_RADIUS * Math.cos(refLat * Math.PI / 180);
  const z = -((lat - refLat) * Math.PI / 180) * EARTH_RADIUS;
  return { x, y: 0, z };
}

/** 园区锚点：上海张江附近（示例） */
export const REF = { lng: 121.602, lat: 31.204, label: '园区中心' };

/** 示例 POI */
export const POIS = [
  { id: 'gate', name: '南门', lng: 121.6008, lat: 31.2032, color: 0x58a6ff },
  { id: 'a1', name: 'A1 栋', lng: 121.6025, lat: 31.2048, color: 0x7ee787 },
  { id: 'b2', name: 'B2 栋', lng: 121.6038, lat: 31.2035, color: 0xffa657 },
  { id: 'sub', name: '变电站', lng: 121.6015, lat: 31.2055, color: 0xf85149 },
  { id: 'park', name: '停车场', lng: 121.6042, lat: 31.2042, color: 0xd2a8ff },
];

export function poiToPosition(poi, ref = REF) {
  return lngLatToLocal(poi.lng, poi.lat, ref.lng, ref.lat);
}
