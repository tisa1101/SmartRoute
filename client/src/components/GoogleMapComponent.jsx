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
      <div className="p-6 bg-gray-800 rounded-lg shadow-md mt-6">
        <h1 className="text-3xl font-bold text-orange-400 mb-4">Assigned Orders</h1>
        {orders.length === 0 ? (
          <p className="text-gray-300">No orders assigned</p>
        ) : (
          <ul className="space-y-4">
            {orders.map((order) => (
              <li key={order.id} className="bg-gray-700 p-4 rounded-lg shadow-md">
                <p className="text-lg font-medium text-white">
                  <strong>Name:</strong> {order.name}
                </p>
                <p className="text-sm text-gray-300">
                  <strong>Priority:</strong> {order.priority}
                </p>
                <p className="text-sm text-gray-300">
                  <strong>Weight:</strong> {order.weight} kg
                </p>
                <p className="text-sm text-gray-300">
                  <strong>Status:</strong> {order.status}
                </p>
                <p className="text-sm text-gray-300">
                  <strong>Distance:</strong> {order.delivery_distance ?? "—"} km
                </p>
                <p className="text-sm text-gray-300">
                  <strong>Estimated Delivery:</strong> {order.estimate_delivery_time ?? "—"}
                </p>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default MapComponent;
