import React, { useEffect, useState } from 'react';
import API_BASE from '../api';
import { motion } from 'framer-motion';
import { Navigation2, Clock, Wrench, AlertOctagon } from 'lucide-react';

const FleetStatus = () => {
  const [stats, setStats] = useState({ active: 0, idle: 0, maintenance: 0, total: 0 });

  useEffect(() => {
    const fetchStatus = async () => {
      try {
        const response = await fetch(API_BASE + "/api/analytics/dashboard-stats");
        if (response.ok) {
          const data = await response.json();
          const total = data.total_vehicles || 0;
          const active = data.vehicles_with_in_process_orders || 0;
          setStats({
            active: active,
            idle: Math.max(0, total - active),
            maintenance: 0,
            total: total
          });
        }
      } catch (error) {
        console.error("Error fetching fleet stats:", error);
      }
    };
    fetchStatus();
    
    // Poll every 10 seconds for live updates
    const interval = setInterval(fetchStatus, 10000);
    return () => clearInterval(interval);
  }, []);

  const calculateWidth = (val, total) => total === 0 ? 0 : (val / total) * 100;

  return (
    <div className="bg-[#1a1f2e]/80 backdrop-blur-md rounded-2xl p-5 shadow-[0_4px_20px_rgba(0,0,0,0.3)] border border-gray-700/50 h-full flex flex-col">
      <h2 className="text-lg font-bold text-white tracking-wide mb-6">Fleet Readiness</h2>
      
      <div className="flex-1 flex flex-col justify-center space-y-6">
        
        {/* Active Progress */}
        <div className="space-y-2">
          <div className="flex justify-between items-center text-sm">
            <span className="flex items-center gap-2 text-gray-300 font-medium">
              <Navigation2 size={16} className="text-emerald-400" /> In Transit
            </span>
            <span className="text-white font-bold">{stats.active}</span>
          </div>
          <div className="w-full bg-gray-800 rounded-full h-2 overflow-hidden">
            <motion.div 
              initial={{ width: 0 }}
              animate={{ width: `${calculateWidth(stats.active, stats.total)}%` }}
              transition={{ duration: 1, ease: "easeOut" }}
              className="bg-gradient-to-r from-emerald-500 to-green-400 h-2 rounded-full"
            />
          </div>
        </div>

        {/* Idle Progress */}
        <div className="space-y-2">
          <div className="flex justify-between items-center text-sm">
            <span className="flex items-center gap-2 text-gray-300 font-medium">
              <Clock size={16} className="text-amber-400" /> Idle / Available
            </span>
            <span className="text-white font-bold">{stats.idle}</span>
          </div>
          <div className="w-full bg-gray-800 rounded-full h-2 overflow-hidden">
            <motion.div 
              initial={{ width: 0 }}
              animate={{ width: `${calculateWidth(stats.idle, stats.total)}%` }}
              transition={{ duration: 1, ease: "easeOut", delay: 0.2 }}
              className="bg-gradient-to-r from-amber-500 to-yellow-400 h-2 rounded-full"
            />
          </div>
        </div>

        {/* Maintenance Progress */}
        <div className="space-y-2">
          <div className="flex justify-between items-center text-sm">
            <span className="flex items-center gap-2 text-gray-300 font-medium">
              <Wrench size={16} className="text-red-400" /> Maintenance
            </span>
            <span className="text-white font-bold">{stats.maintenance}</span>
          </div>
          <div className="w-full bg-gray-800 rounded-full h-2 overflow-hidden">
            <motion.div 
              initial={{ width: 0 }}
              animate={{ width: `${calculateWidth(stats.maintenance, stats.total)}%` }}
              transition={{ duration: 1, ease: "easeOut", delay: 0.4 }}
              className="bg-gradient-to-r from-red-500 to-rose-400 h-2 rounded-full"
            />
          </div>
        </div>

      </div>
    </div>
  );
};

export default FleetStatus;
