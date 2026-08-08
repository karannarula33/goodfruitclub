import { useEffect, useRef, useState } from "react";
import BottomSheet from "./BottomSheet.jsx";
import { BRAND } from "./theme.js";

const GURGAON_CENTER = { lat: 28.4595, lng: 77.0266 };

let mapsLoadPromise = null;
function loadGoogleMaps() {
  if (mapsLoadPromise) return mapsLoadPromise;
  mapsLoadPromise = new Promise((resolve, reject) => {
    if (window.google?.maps) { resolve(window.google.maps); return; }
    const key = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;
    if (!key) { reject(new Error("Maps API key missing")); return; }
    window.__gfcMapsLoaded = () => resolve(window.google.maps);
    const script = document.createElement("script");
    script.src = `https://maps.googleapis.com/maps/api/js?key=${encodeURIComponent(key)}&loading=async&callback=__gfcMapsLoaded`;
    script.async = true;
    script.onerror = () => reject(new Error("Failed to load Google Maps"));
    document.head.appendChild(script);
  });
  return mapsLoadPromise;
}

export default function LocationPicker({ open, onClose, onConfirm }) {
  const mapElRef = useRef(null);
  const mapRef = useRef(null);
  const markerRef = useRef(null);
  const geocoderRef = useRef(null);
  const [address, setAddress] = useState("");
  const [coords, setCoords] = useState(null);
  const [loading, setLoading] = useState(true);
  const [locating, setLocating] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!open) return;
    let cancelled = false;
    setLoading(true);
    setError("");
    setCoords(null);
    setAddress("");

    loadGoogleMaps().then((maps) => {
      if (cancelled || !mapElRef.current) return;

      geocoderRef.current = new maps.Geocoder();
      const map = new maps.Map(mapElRef.current, {
        center: GURGAON_CENTER, zoom: 13,
        disableDefaultUI: true, zoomControl: true, gestureHandling: "greedy",
      });
      const marker = new maps.Marker({ position: GURGAON_CENTER, map, draggable: true });
      mapRef.current = map;
      markerRef.current = marker;

      const reverseGeocode = (latLng) => {
        setCoords({ lat: latLng.lat(), lng: latLng.lng() });
        geocoderRef.current.geocode({ location: latLng }, (results, status) => {
          if (status === "OK" && results[0]) setAddress(results[0].formatted_address);
        });
      };

      marker.addListener("dragend", () => reverseGeocode(marker.getPosition()));
      map.addListener("click", (e) => {
        marker.setPosition(e.latLng);
        reverseGeocode(e.latLng);
      });

      setLoading(false);
    }).catch(() => {
      if (!cancelled) {
        setError("Couldn't load the map right now. You can still type your address below.");
        setLoading(false);
      }
    });

    return () => { cancelled = true; };
  }, [open]);

  function useMyLocation() {
    if (!navigator.geolocation || !mapRef.current) return;
    setLocating(true);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const latLng = new window.google.maps.LatLng(pos.coords.latitude, pos.coords.longitude);
        mapRef.current.panTo(latLng);
        mapRef.current.setZoom(16);
        markerRef.current.setPosition(latLng);
        setCoords({ lat: latLng.lat(), lng: latLng.lng() });
        geocoderRef.current.geocode({ location: latLng }, (results, status) => {
          if (status === "OK" && results[0]) setAddress(results[0].formatted_address);
        });
        setLocating(false);
      },
      () => setLocating(false),
      { enableHighAccuracy: true, timeout: 10000 }
    );
  }

  function confirm() {
    if (!coords) return;
    onConfirm({ address, lat: coords.lat, lng: coords.lng });
    onClose();
  }

  return (
    <BottomSheet open={open} onClose={onClose}>
      <div style={{ padding: "12px 20px 28px" }}>
        <h2 style={{ fontFamily: "'DM Serif Display', serif", fontSize: 20, color: BRAND.green, margin: "0 0 4px" }}>
          Pin Your Delivery Location
        </h2>
        <p style={{ color: BRAND.muted, fontSize: 13, margin: "0 0 14px" }}>
          Tap the map or drag the pin to your exact spot.
        </p>

        {error ? (
          <p style={{ color: "#DC2626", fontSize: 13.5 }}>{error}</p>
        ) : (
          <>
            <div
              ref={mapElRef}
              style={{ width: "100%", height: 280, borderRadius: 12, background: "#eee", marginBottom: 12 }}
            />
            {loading && <p style={{ fontSize: 13, color: BRAND.muted, margin: "0 0 12px" }}>Loading map…</p>}

            <button
              type="button"
              onClick={useMyLocation}
              disabled={loading || locating}
              style={{
                width: "100%", padding: "11px", borderRadius: 10, marginBottom: 14,
                border: `1.5px solid ${BRAND.green}`, background: "#fff", color: BRAND.green,
                fontSize: 13.5, fontWeight: 600, cursor: loading || locating ? "default" : "pointer",
                opacity: loading || locating ? 0.6 : 1,
              }}
            >
              {locating ? "Locating…" : "📍 Use my current location"}
            </button>

            <div style={{
              fontSize: 13.5, color: coords ? BRAND.text : BRAND.muted, fontWeight: coords ? 600 : 400,
              padding: "10px 12px", borderRadius: 10, background: BRAND.warm, marginBottom: 16, minHeight: 20,
            }}>
              {address || (coords ? "Detecting address…" : "Drop a pin to detect the address")}
            </div>

            <button
              type="button"
              onClick={confirm}
              disabled={!coords}
              style={{
                width: "100%", padding: "13px", background: BRAND.green, color: "#fff",
                border: "none", borderRadius: 10, fontSize: 14.5, fontWeight: 600,
                cursor: coords ? "pointer" : "default", opacity: coords ? 1 : 0.5,
              }}
            >
              Confirm Location
            </button>
          </>
        )}
      </div>
    </BottomSheet>
  );
}
