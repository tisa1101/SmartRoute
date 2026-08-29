import API_BASE from '../api';
import React, { useState, useRef, useEffect } from "react";
import axios from "axios";
import L from 'leaflet';
import "leaflet/dist/leaflet.css"; // Import Leaflet CSS

const OrderInputForm = () => {
  const [orderData, setOrderData] = useState({
    name: "",
    priority: 0,
    weight: 0,
    delivery_coordinates: "",
  });

  const mapRef = useRef(null);
  const markerRef = useRef(null);

  useEffect(() => {
    if (mapRef.current) {
      // Initialize the Leaflet map
      const map = L.map(mapRef.current).setView([19.076, 72.877], 12); // Default location: Mumbai

      // Add OpenStreetMap tile layer
      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution:
          '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
      }).addTo(map);

      // Add click event listener to the map
      map.on("click", (e) => {
        const lat = e.latlng.lat;
        const lng = e.latlng.lng;
        setOrderData((prev) => ({
          ...prev,
          delivery_coordinates: `${lat},${lng}`,
        }));

        // Remove previous marker if exists
        if (markerRef.current) {
          map.removeLayer(markerRef.current);
        }

        // Place new marker
        markerRef.current = L.marker([lat, lng]).addTo(map);
      });
    }
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Convert coordinate string back to an object to match Backend Pydantic Schema
    const [lat, lng] = orderData.delivery_coordinates.split(",");
    const payload = {
      ...orderData,
      delivery_coordinates: {
        lat: parseFloat(lat),
        lng: parseFloat(lng)
      }
    };
    
    console.log("Submitting Order:", payload);

    try {
      const response = await axios.post(API_BASE + "/api/orders/", payload);
      console.log("Order Created:", response.data);
      alert("Order successfully created!");
    } catch (error) {
      console.error("Error creating order:", error);
      alert("Failed to create order.");
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-8 bg-[#1a1f2e]/80 backdrop-blur-xl border border-indigo-900/50 text-gray-200 rounded-2xl shadow-[0_0_40px_rgba(0,0,0,0.5)] mt-10">
      <div className="mb-6 flex items-center gap-3">
        <div className="p-2 bg-indigo-500/20 rounded-lg text-indigo-400">
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"></path><polyline points="3.27 6.96 12 12.01 20.73 6.96"></polyline><line x1="12" y1="22.08" x2="12" y2="12"></line></svg>
        </div>
        <div>
          <h2 className="text-2xl font-bold text-white tracking-tight">Dispatch New Order</h2>
          <p className="text-sm text-gray-400">Enter payload details to assign to the fleet.</p>
        </div>
      </div>
      
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Order Name */}
          <div className="col-span-1 md:col-span-2">
            <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-2">Order Name</label>
            <input
              type="text"
              value={orderData.name}
              onChange={(e) => setOrderData({ ...orderData, name: e.target.value })}
              className="block w-full px-4 py-3 bg-[#0b0f19] border border-gray-700/50 rounded-xl text-white placeholder-gray-500 focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 transition-all outline-none"
              placeholder="e.g. Medical Supplies, Tech Hardware"
              required
            />
          </div>

          {/* Priority */}
          <div>
            <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-2">Priority Level</label>
            <select
              value={orderData.priority}
              onChange={(e) => setOrderData({ ...orderData, priority: Number(e.target.value) })}
              className="block w-full px-4 py-3 bg-[#0b0f19] border border-gray-700/50 rounded-xl text-white focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 transition-all outline-none appearance-none"
              required
            >
              <option value={1}>High Priority (Tier 1)</option>
              <option value={2}>Moderate Priority (Tier 2)</option>
              <option value={3}>Low Priority (Tier 3)</option>
            </select>
          </div>

          {/* Weight */}
          <div>
            <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-2">Payload Weight (Kg)</label>
            <input
              type="number"
              value={orderData.weight}
              onChange={(e) => setOrderData({ ...orderData, weight: Math.max(0.01, parseFloat(e.target.value)) })}
              step="any"
              className="block w-full px-4 py-3 bg-[#0b0f19] border border-gray-700/50 rounded-xl text-white focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 transition-all outline-none"
              placeholder="0.00"
              required
            />
          </div>
        </div>

        {/* Google Map for Pinning Location */}
        <div>
          <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-2">Target Coordinates (Click Map)</label>
          <div
            ref={mapRef}
            className="w-full rounded-xl overflow-hidden border border-gray-700/50 shadow-inner"
            style={{ height: '250px', position: 'relative' }}
          ></div>
        </div>

        {/* Display Selected Coordinates */}
        <div>
          <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-2">Telemetry Data</label>
          <input
            type="text"
            value={orderData.delivery_coordinates || "Awaiting target lock..."}
            readOnly
            className="block w-full px-4 py-3 bg-gray-900/50 border border-gray-700/30 rounded-xl text-emerald-400 font-mono text-sm shadow-inner"
          />
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-bold py-3 px-4 rounded-xl transition-all shadow-[0_0_20px_rgba(79,70,229,0.4)] hover:shadow-[0_0_30px_rgba(79,70,229,0.6)] transform hover:-translate-y-0.5 active:translate-y-0"
        >
          DISPATCH ORDER
        </button>
      </form>
    </div>
  );
};

export default OrderInputForm;
