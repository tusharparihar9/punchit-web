"use client";

import { useEffect, useState } from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

// Fix Leaflet's default icon path issues in Next.js/Webpack
const icon = L.icon({
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});

export default function MapComponent({ logs }: { logs: any[] }) {
  // Default center (e.g., center of US or a default company location). 
  // In a full app, we'd center this on the Company's Geofence coordinates.
  const defaultCenter: [number, number] = [37.7749, -122.4194]; 

  return (
    <MapContainer center={defaultCenter} zoom={4} style={{ height: "100%", width: "100%" }}>
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      
      {/* Render a marker for every attendance log that has coordinates */}
      {logs.map((log) => {
        if (!log.checkInLat || !log.checkInLng) return null;
        return (
          <Marker 
            key={log.id} 
            position={[log.checkInLat, log.checkInLng]} 
            icon={icon}
          >
            <Popup>
              <strong>{log.user?.firstName} {log.user?.lastName}</strong><br />
              Status: {log.status}<br />
              Time: {new Date(log.checkInTime).toLocaleTimeString()}
            </Popup>
          </Marker>
        );
      })}
    </MapContainer>
  );
}
