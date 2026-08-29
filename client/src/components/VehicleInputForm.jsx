import API_BASE from '../api';
import React, { useState } from "react";
import axios from "axios";

const VehicleInputForm = () => {
  const [vehicleData, setVehicleData] = useState({
    capacity: 0,
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log("Submitting Vehicle:", vehicleData);

    try {
      const response = await axios.post(API_BASE + "/api/vehicles/", vehicleData);
      console.log("Vehicle Added:", response.data);
      alert("Vehicle successfully added!");
    } catch (error) {
      console.error("Error adding vehicle:", error);
      alert("Failed to add vehicle.");
    }
  };

  return (
    <div className="max-w-xl mx-auto p-8 bg-[#1a1f2e]/80 backdrop-blur-xl border border-indigo-900/50 text-gray-200 rounded-2xl shadow-[0_0_40px_rgba(0,0,0,0.5)] mt-10">
      <div className="mb-6 flex items-center gap-3">
        <div className="p-2 bg-emerald-500/20 rounded-lg text-emerald-400">
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="1" y="3" width="15" height="13"></rect><polygon points="16 8 20 8 23 11 23 16 16 16 16 8"></polygon><circle cx="5.5" cy="18.5" r="2.5"></circle><circle cx="18.5" cy="18.5" r="2.5"></circle></svg>
        </div>
        <div>
          <h2 className="text-2xl font-bold text-white tracking-tight">Register New Vehicle</h2>
          <p className="text-sm text-gray-400">Add a new transport unit to the active fleet.</p>
        </div>
      </div>
      
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Vehicle Capacity */}
        <div>
          <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-2">Maximum Payload Capacity (Kg)</label>
          <input
            type="number"
            value={vehicleData.capacity}
            onChange={(e) => setVehicleData({ ...vehicleData, capacity: Number(e.target.value) })}
            className="block w-full px-4 py-3 bg-[#0b0f19] border border-gray-700/50 rounded-xl text-white focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500 transition-all outline-none"
            placeholder="0"
            required
          />
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          className="w-full bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold py-3 px-4 rounded-xl transition-all shadow-[0_0_20px_rgba(16,185,129,0.4)] hover:shadow-[0_0_30px_rgba(16,185,129,0.6)] transform hover:-translate-y-0.5 active:translate-y-0 mt-4"
        >
          INITIALIZE VEHICLE
        </button>
      </form>
    </div>
  );
};

export default VehicleInputForm;
