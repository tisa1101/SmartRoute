import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Truck, CheckCircle2, AlertTriangle, Route } from 'lucide-react';
import toast from 'react-hot-toast';

import API_BASE from '../api';

const LiveActivity = () => {
  const [activities, setActivities] = useState([]);
  const highestSeenRef = useRef(0);

  useEffect(() => {
    const fetchActivities = async () => {
      try {
        const response = await fetch(API_BASE + "/api/orders/");
        if (response.ok) {
          const orders = await response.json();
          // Sort by id descending (assuming higher id is newer)
          orders.sort((a, b) => b.id - a.id);
          
          if (orders.length > 0) {
            const currentHighest = orders[0].id;
            
            // If this is not the initial load and we have new orders
            if (highestSeenRef.current !== 0 && currentHighest > highestSeenRef.current) {
              const newOrdersCount = currentHighest - highestSeenRef.current;
              toast.success(`Incoming Dispatch: ${newOrdersCount} new order(s) logged in the system.`, {
                icon: '🛰️',
                duration: 4000
              });
            }
            highestSeenRef.current = Math.max(highestSeenRef.current, currentHighest);
          }
          
          // Map to activities
          const recentActivities = orders.slice(0, 10).map(order => {
            if (order.status === 'in-process') {
              return { id: `order-${order.id}`, type: 'success', icon: Truck, title: `Order #${order.id} Assigned`, desc: `Assigned to Vehicle 0${order.vehicle_id}`, time: 'Recent', color: 'text-emerald-400' };
            } else if (order.status === 'pending') {
              return { id: `order-${order.id}`, type: 'warning', icon: AlertTriangle, title: `Order #${order.id} Pending`, desc: 'Awaiting routing optimization.', time: 'Recent', color: 'text-amber-400' };
            } else if (order.status === 'delivered') {
              return { id: `order-${order.id}`, type: 'info', icon: CheckCircle2, title: `Order #${order.id} Delivered`, desc: 'Drop-off confirmed.', time: 'Recent', color: 'text-blue-400' };
            }
            return { id: `order-${order.id}`, type: 'info', icon: Route, title: `Order #${order.id} Status: ${order.status}`, desc: 'System log updated.', time: 'Recent', color: 'text-gray-400' };
          });
          
          setActivities(recentActivities);
        }
      } catch (error) {
        console.error("Error fetching live activities:", error);
      }
    };
    
    fetchActivities();
    const interval = setInterval(fetchActivities, 5000);
    return () => clearInterval(interval);
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
