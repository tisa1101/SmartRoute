import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Truck, CheckCircle2, AlertTriangle, Route } from 'lucide-react';

const mockActivities = [
  { id: 1, type: 'info', icon: Route, title: 'Route Optimized', desc: 'Algorithm updated sequence for Vehicle 02.', time: 'Just now', color: 'text-blue-400' },
  { id: 2, type: 'success', icon: CheckCircle2, title: 'Order #1024 Delivered', desc: 'Driver confirmed drop-off at Andheri.', time: '5m ago', color: 'text-emerald-400' },
  { id: 3, type: 'warning', icon: AlertTriangle, title: 'Traffic Delay', desc: 'Heavy traffic detected on JVLR for Vehicle 01.', time: '12m ago', color: 'text-amber-400' },
  { id: 4, type: 'info', icon: Truck, title: 'Vehicle 03 Dispatched', desc: 'Departed warehouse with 4 packages.', time: '20m ago', color: 'text-indigo-400' }
];

const LiveActivity = () => {
  const [activities, setActivities] = useState([]);

  useEffect(() => {
    // Simulate real-time streaming of activities
    let delay = 0;
    const timeouts = mockActivities.map((act) => {
      delay += 500;
      return setTimeout(() => {
        setActivities(prev => [act, ...prev].slice(0, 5));
      }, delay);
    });

    return () => timeouts.forEach(clearTimeout);
  }, []);

  return (
    <div className="bg-[#1a1f2e]/80 backdrop-blur-md rounded-2xl p-5 shadow-[0_4px_20px_rgba(0,0,0,0.3)] border border-gray-700/50 h-full flex flex-col">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-bold text-white tracking-wide">Live Activity Feed</h2>
        <span className="relative flex h-3 w-3">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75"></span>
          <span className="relative inline-flex rounded-full h-3 w-3 bg-indigo-500"></span>
        </span>
      </div>
      
      <div className="flex-1 overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-indigo-600">
        <ul className="space-y-4">
          <AnimatePresence>
            {activities.map((activity) => {
              const Icon = activity.icon;
              return (
                <motion.li
                  key={activity.id}
                  initial={{ opacity: 0, y: -20, height: 0 }}
                  animate={{ opacity: 1, y: 0, height: 'auto' }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ duration: 0.3 }}
                  className="flex gap-4 p-3 bg-gray-800/40 rounded-xl border border-gray-700/30 hover:bg-gray-800/60 transition-colors"
                >
                  <div className={`mt-1 ${activity.color}`}>
                    <Icon size={18} />
                  </div>
                  <div className="flex-1">
                    <h4 className="text-sm font-semibold text-gray-200">{activity.title}</h4>
                    <p className="text-xs text-gray-400 mt-0.5">{activity.desc}</p>
                  </div>
                  <span className="text-[10px] text-gray-500 font-medium whitespace-nowrap">{activity.time}</span>
                </motion.li>
              );
            })}
          </AnimatePresence>
          {activities.length === 0 && (
            <div className="text-center text-sm text-gray-500 py-6">Connecting to telemetry stream...</div>
          )}
        </ul>
      </div>
    </div>
  );
};

export default LiveActivity;
