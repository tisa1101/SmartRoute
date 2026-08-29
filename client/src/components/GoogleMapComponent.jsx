import API_BASE from '../api';
import React, { useState, useEffect, useRef } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

// Fix Leaflet default icon paths
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
});

const warehouseCoords = [19.116458, 72.902696];

const MapComponent = ({ routeData }) => {
  const mapRef = useRef(null);
  const mapInstanceRef = useRef(null);
  const layersRef = useRef([]);
  const [orders, setOrders] = useState([]);

  // Initialize map once
  useEffect(() => {
    if (!mapInstanceRef.current) {
      const map = L.map(mapRef.current).setView(warehouseCoords, 13);
      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
      }).addTo(map);

      // Warehouse marker
      const warehouseIcon = L.divIcon({
        html: `<div style="background:#f97316;color:white;padding:4px 8px;border-radius:6px;font-weight:bold;font-size:12px;white-space:nowrap;box-shadow:0 2px 6px rgba(0,0,0,0.4)">🏭 Warehouse</div>`,
        className: "",
        iconAnchor: [40, 20],
      });
      L.marker(warehouseCoords, { icon: warehouseIcon }).addTo(map);

      mapInstanceRef.current = map;
    }
  }, []);

  // Update route and markers when routeData changes
  useEffect(() => {
    const map = mapInstanceRef.current;
    if (!map) return;

    // Remove old layers
    layersRef.current.forEach((layer) => map.removeLayer(layer));
    layersRef.current = [];

    if (!routeData || !routeData.full_route || routeData.full_route.length === 0) {
      setOrders([]);
      return;
    }

    // Draw route polyline
    const latLngs = routeData.full_route.map((p) => [p.lat, p.lng]);
    const polyline = L.polyline(latLngs, {
      color: "#ef4444",
      weight: 4,
      opacity: 0.85,
    }).addTo(map);
    layersRef.current.push(polyline);
    map.fitBounds(polyline.getBounds(), { padding: [30, 30] });

    // Fetch and display order markers
    if (routeData.assigned_orders?.length) {
      fetchOrders(routeData.assigned_orders, map);
    }
  }, [routeData]);

  const fetchOrders = async (orderIds, map) => {
    try {
      const fetched = await Promise.all(
        orderIds.map((id) =>
          fetch(`${API_BASE}/api/orders/${id}`).then((r) => r.json())
        )
      );
      setOrders(fetched);

      fetched.forEach((order, i) => {
        const [lat, lng] = order.delivery_coordinates.split(",").map(Number);
        if (isNaN(lat) || isNaN(lng)) return;

        const stopIcon = L.divIcon({
          html: `<div style="background:#3b82f6;color:white;border-radius:50%;width:28px;height:28px;display:flex;align-items:center;justify-content:center;font-weight:bold;font-size:13px;box-shadow:0 2px 6px rgba(0,0,0,0.4)">${i + 1}</div>`,
          className: "",
          iconAnchor: [14, 14],
        });

        const marker = L.marker([lat, lng], { icon: stopIcon })
          .addTo(map)
          .bindPopup(
            `<div style="min-width:160px">
              <b style="font-size:14px">${order.name}</b><br/>
              <span>Priority: ${order.priority}</span><br/>
              <span>Weight: ${order.weight} kg</span><br/>
              <span>Status: <b>${order.status}</b></span><br/>
              <span>Distance: ${order.delivery_distance ?? "—"} km</span><br/>
              <span>ETA: ${order.estimate_delivery_time ?? "—"}</span>
            </div>`
          );
        layersRef.current.push(marker);
      });
    } catch (err) {
      console.error("Error fetching orders:", err);
    }
  };

  return (
    <div>
      {/* Map */}
      <div
        ref={mapRef}
        style={{ width: "100%", height: "70vh", borderRadius: "8px", zIndex: 0 }}
      />

      {/* Assigned Orders List */}
      <div className="mt-6 bg-[#1a1f2e]/80 backdrop-blur-md rounded-2xl p-6 shadow-[0_4px_20px_rgba(0,0,0,0.3)] border border-gray-700/50">
        <h2 className="text-lg font-bold text-white tracking-wide mb-4">Assigned Route Orders</h2>
        {orders.length === 0 ? (
          <p className="text-sm text-gray-500 italic">No vehicle route selected. Click a vehicle in the sidebar to load its manifest.</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {orders.map((order, i) => (
              <div key={order.id} className="bg-gray-800/40 p-4 rounded-xl border border-gray-700/30 flex flex-col gap-2 relative overflow-hidden group hover:bg-gray-800/60 transition-colors">
                <div className="absolute top-0 left-0 w-1 h-full bg-blue-500"></div>
                <div className="flex justify-between items-start">
                  <h3 className="font-semibold text-gray-200 flex items-center gap-2">
                    <span className="bg-blue-500 text-white text-xs font-bold w-5 h-5 flex items-center justify-center rounded-full">{i + 1}</span>
                    {order.name}
                  </h3>
                  <span className="text-xs px-2 py-1 bg-gray-900/50 rounded-md font-mono text-gray-400">Order #{order.id}</span>
                </div>
                
                <div className="grid grid-cols-2 gap-x-4 gap-y-2 mt-2 text-sm">
                  <p className="text-gray-400 flex justify-between">Priority: <span className="text-white font-medium">{order.priority}</span></p>
                  <p className="text-gray-400 flex justify-between">Weight: <span className="text-white font-medium">{order.weight}kg</span></p>
                  <p className="text-gray-400 flex justify-between">Distance: <span className="text-white font-medium">{order.delivery_distance ? order.delivery_distance.toFixed(1) : "—"} km</span></p>
                  <p className="text-gray-400 flex justify-between">ETA: <span className="text-white font-medium">{order.estimate_delivery_time ?? "—"}</span></p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default MapComponent;
