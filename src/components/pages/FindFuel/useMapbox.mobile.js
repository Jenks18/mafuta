import { useEffect, useRef, useState } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';

mapboxgl.accessToken = 'pk.eyJ1IjoieWF6enlqZW5rcyIsImEiOiJjbWU2b2o0eXkxNDFmMm1vbGY3dWt5aXViIn0.8hEu3t-bv3R3kGsBb_PIcw';

const haversine = (a, b) => {
  const toRad = (d) => (d * Math.PI) / 180;
  const [lng1, lat1] = a;
  const [lng2, lat2] = b;
  const R = 6371000;
  const dLat = toRad(lat2 - lat1);
  const dLng = toRad(lng2 - lng1);
  const s1 = Math.sin(dLat / 2);
  const s2 = Math.sin(dLng / 2);
  const aa = s1 * s1 + Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * s2 * s2;
  const c = 2 * Math.atan2(Math.sqrt(aa), Math.sqrt(1 - aa));
  return R * c;
};

// Mobile-specific radius curve: slightly tighter than desktop to keep lists short
const radiusForZoomMobile = (z) => 400 * Math.pow(2, 14 - z);

export const useMapboxMobile = (stations, onMarkerTap) => {
  const mapContainer = useRef(null);
  const map = useRef(null);
  const markers = useRef([]);
  const [loaded, setLoaded] = useState(false);
  const [visible, setVisible] = useState([]);
  const routeSourceId = 'route-mobile';
  const routeLayerId = 'route-mobile-layer';

  useEffect(() => {
    if (map.current || !mapContainer.current) return;
    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: 'mapbox://styles/mapbox/streets-v12',
      center: [36.8219, -1.2921],
      zoom: 12,
      dragRotate: false,
      pitchWithRotate: false,
      touchPitch: false,
    });
    map.current.on('load', () => {
      try { map.current.resize(); } catch {}
      setLoaded(true);
    });
    return () => { try { map.current?.remove(); } catch {}; map.current = null; };
  }, []);

  const render = (indices) => {
    markers.current.forEach(m => m.remove());
    markers.current = [];
    indices.forEach((i) => {
      const s = stations[i]; if (!s) return;
      const el = document.createElement('div');
      el.innerHTML = `<div class="marker-badge"><span class="marker-text">KES ${Math.max(0, Math.round((s.price||0)*130))}</span><span class="marker-tail"></span></div>`;
      el.style.cursor = 'pointer';
      el.addEventListener('click', () => onMarkerTap && onMarkerTap(i));
      const m = new mapboxgl.Marker({ element: el, anchor: 'bottom' })
        .setLngLat(s.coordinates)
        .addTo(map.current);
      markers.current.push(m);
    });
  };

  // Initial load: top 6 closest to center for concise mobile list
  useEffect(() => {
    if (!loaded || !map.current) return;
    const c = map.current.getCenter();
    const withDist = stations.map((s, idx) => ({ idx, d: haversine([c.lng, c.lat], s.coordinates) }));
    const top = withDist.sort((a,b)=>a.d-b.d).slice(0, 6).map(x=>x.idx);
    setVisible(top);
    render(top);
  }, [loaded, stations]);

  const searchArea = () => {
    if (!map.current) return;
    const c = map.current.getCenter();
    const z = map.current.getZoom();
    const r = radiusForZoomMobile(z);
    const ranked = stations
      .map((s, idx) => ({ idx, d: haversine([c.lng, c.lat], s.coordinates) }))
      .filter(x => Number.isFinite(x.d))
      .sort((a,b)=>a.d-b.d);
    const within = ranked.filter(x => x.d <= r).map(x=>x.idx).slice(0, 40);
    const finalIdx = within.length ? within : ranked.slice(0, 10).map(x=>x.idx);
    setVisible(finalIdx);
    render(finalIdx);
  };

  const flyToStation = (i) => {
    if (!map.current || !stations[i]) return;
    map.current.flyTo({ center: stations[i].coordinates, zoom: 14, speed: 1.2, curve: 1 });
  };

  const recenterMap = () => {
    if (!map.current) return;
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition((pos)=>{
        map.current.flyTo({ center: [pos.coords.longitude, pos.coords.latitude], zoom: 12, speed: 1.2 });
      }, ()=> map.current.flyTo({ center: [36.8219, -1.2921], zoom: 12 }));
    }
  };

  const drawRouteToStation = (stationCoords) => {
    if (!map.current || !stationCoords) return;
    if (!navigator.geolocation) return;
    navigator.geolocation.getCurrentPosition((pos) => {
      const user = [pos.coords.longitude, pos.coords.latitude];
      const data = {
        type: 'Feature',
        properties: {},
        geometry: { type: 'LineString', coordinates: [user, stationCoords] }
      };
      if (!map.current.getSource(routeSourceId)) {
        map.current.addSource(routeSourceId, { type: 'geojson', data });
        map.current.addLayer({
          id: routeLayerId,
          type: 'line',
          source: routeSourceId,
          layout: { 'line-cap': 'round', 'line-join': 'round' },
          paint: { 'line-color': '#2563eb', 'line-width': 3, 'line-dasharray': [2,2] }
        });
      } else {
        map.current.getSource(routeSourceId).setData(data);
      }
    });
  };

  const clearRoute = () => {
    try {
      if (map.current?.getLayer(routeLayerId)) map.current.removeLayer(routeLayerId);
      if (map.current?.getSource(routeSourceId)) map.current.removeSource(routeSourceId);
    } catch {}
  };

  return { mapContainer, flyToStation, searchArea, recenterMap, drawRouteToStation, clearRoute, visibleStations: visible.map(idx => ({ station: stations[idx], index: idx })) };
};

export default useMapboxMobile;
