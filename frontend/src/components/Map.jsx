import { useEffect, useRef, useState } from "react";
import mapboxgl from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";
import { fetchPins, createPin } from "../api/pins";

mapboxgl.accessToken = import.meta.env.VITE_MAPBOX_TOKEN;

export default function Map({ onPinSelect }) {
  const mapContainer = useRef(null);
  const map = useRef(null);
  const [dropping, setDropping] = useState(false);

  useEffect(() => {
    if (map.current) return;

    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: "mapbox://styles/mapbox/streets-v12",
      center: [0, 20],
      zoom: 2,
    });

    map.current.addControl(new mapboxgl.NavigationControl());
    map.current.on("load", loadPins);
  }, []);

  useEffect(() => {
    if (!map.current) return;
    map.current.on("click", handleMapClick);
    return () => map.current.off("click", handleMapClick);
  }, [dropping]);

  async function loadPins() {
    const pins = await fetchPins();
    pins.forEach(addMarker);
  }

  function addMarker(pin) {
    const el = document.createElement("div");
    el.style.cssText = `
      width: 24px; height: 24px;
      background: #6366f1; border-radius: 50% 50% 50% 0;
      transform: rotate(-45deg); border: 2px solid white;
      cursor: pointer; box-shadow: 0 2px 6px rgba(0,0,0,0.3);
    `;

    new mapboxgl.Marker(el)
      .setLngLat([pin.longitude, pin.latitude])
      .addTo(map.current);

    el.addEventListener("click", (e) => {
      e.stopPropagation();
      onPinSelect(pin);
    });
  }

  async function handleMapClick(e) {
    if (!dropping) return;
    const title = prompt("Pin title:");
    if (!title) return;

    const pin = await createPin({
      title,
      latitude: e.lngLat.lat,
      longitude: e.lngLat.lng,
    });

    addMarker(pin);
    onPinSelect(pin);
    setDropping(false);
  }

  return (
    <div style={{ position: "relative", width: "100%", height: "100vh" }}>
      <div ref={mapContainer} style={{ width: "100%", height: "100%" }} />
      <button
        onClick={() => setDropping((d) => !d)}
        style={{
          position: "absolute", top: 16, left: 16, zIndex: 10,
          padding: "10px 18px", borderRadius: 8, border: "none",
          background: dropping ? "#ef4444" : "#6366f1",
          color: "white", fontWeight: 600, cursor: "pointer",
          boxShadow: "0 2px 8px rgba(0,0,0,0.25)",
        }}
      >
        {dropping ? "Cancel" : "+ Drop Pin"}
      </button>
    </div>
  );
}