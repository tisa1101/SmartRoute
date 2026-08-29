import API_BASE from '../api';
import { useEffect, useState } from "react";

const DashboardMetrics = ({ routeData }) => {
  const [stats, setStats] = useState({
    total_orders: 0,
    pending_orders: 0,
    total_vehicles: 0,
    vehicles_with_in_process_orders: 0,
  });

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await fetch(API_BASE + "/api/analytics/dashboard-stats");
        const data = await response.json();
        setStats(data);
      } catch (error) {
        console.error("Error fetching dashboard stats:", error);
      }
    };
    fetchStats();
  }, []);

  // Assuming fuel price 103rs and a delivery vehicle can travel 17.2km with 1L fuel
  const cost_perKM = 103 / 17.2;
  const costEfficiency = routeData ? (routeData.route_distance * cost_perKM).toFixed(2) : "N/A";

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 p-4 mb-2">
      {/* Total Orders Card */}
      <div className="p-5 bg-[#1a1f2e]/80 backdrop-blur-md rounded-xl shadow-[0_4px_20px_rgba(0,0,0,0.3)] border border-gray-700/50 text-center relative overflow-hidden group">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
        <h2 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-2">Total Orders</h2>
        <p className="text-white text-3xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-cyan-300">{stats.total_orders}</p>
      </div>

      {/* Pending Orders Card */}
      <div className="p-5 bg-[#1a1f2e]/80 backdrop-blur-md rounded-xl shadow-[0_4px_20px_rgba(0,0,0,0.3)] border border-gray-700/50 text-center relative overflow-hidden group">
        <div className="absolute inset-0 bg-gradient-to-r from-red-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
        <h2 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-2">Pending</h2>
        <p className="text-white text-3xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-red-400 to-orange-400">{stats.pending_orders}</p>
      </div>

      {/* Total Vehicles Card */}
      <div className="p-5 bg-[#1a1f2e]/80 backdrop-blur-md rounded-xl shadow-[0_4px_20px_rgba(0,0,0,0.3)] border border-gray-700/50 text-center relative overflow-hidden group">
        <div className="absolute inset-0 bg-gradient-to-r from-purple-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
        <h2 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-2">Total Fleet</h2>
        <p className="text-white text-3xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-indigo-400">{stats.total_vehicles}</p>
      </div>

      {/* Active Vehicles Card */}
      <div className="p-5 bg-[#1a1f2e]/80 backdrop-blur-md rounded-xl shadow-[0_4px_20px_rgba(0,0,0,0.3)] border border-gray-700/50 text-center relative overflow-hidden group">
        <div className="absolute inset-0 bg-gradient-to-r from-green-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
        <h2 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-2">Active Fleet</h2>
        <p className="text-white text-3xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-green-400 to-emerald-300">{stats.vehicles_with_in_process_orders}</p>
      </div>

      {/* Route Distance Card */}
      <div className="p-5 bg-[#1a1f2e]/80 backdrop-blur-md rounded-xl shadow-[0_4px_20px_rgba(0,0,0,0.3)] border border-gray-700/50 text-center relative overflow-hidden group">
        <div className="absolute inset-0 bg-gradient-to-r from-amber-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
        <h2 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-2">Distance</h2>
        <p className="text-white text-3xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-amber-400 to-yellow-300">
          {routeData?.route_distance ?? "--"} <span className="text-sm font-normal text-gray-400">km</span>
        </p>
      </div>

      {/* Cost Efficiency Card */}
      <div className="p-5 bg-[#1a1f2e]/80 backdrop-blur-md rounded-xl shadow-[0_4px_20px_rgba(0,0,0,0.3)] border border-gray-700/50 text-center relative overflow-hidden group">
        <div className="absolute inset-0 bg-gradient-to-r from-pink-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
        <h2 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-2">Cost (Est)</h2>
        <p className="text-white text-3xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-pink-400 to-rose-400">
          ₹{costEfficiency}
        </p>
      </div>
    </div>
  );
};

export default DashboardMetrics;
