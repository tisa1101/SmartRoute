import { ChevronsLeft, ChevronsRight, Truck, Activity, ShieldAlert, Settings, Map, BarChart2 } from "lucide-react";
import API_BASE from '../api';
import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";

const Sidebar = ({ setRouteData }) => {
  const [isOpen, setIsOpen] = useState(true);
  const [vehicles, setVehicles] = useState([]);
  const [activeVehicle, setActiveVehicle] = useState(null);
  const [activeFleetIds, setActiveFleetIds] = useState(new Set());

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch vehicles
        const vRes = await fetch(API_BASE + "/api/vehicles/");
        if (vRes.ok) {
          const vData = await vRes.json();
          setVehicles(vData);
        }
        // Fetch orders to determine which vehicles are active
        const oRes = await fetch(API_BASE + "/api/orders/");
        if (oRes.ok) {
          const oData = await oRes.json();
          const activeIds = new Set(
            oData.filter(o => o.status === 'in-process' && o.vehicle_id).map(o => o.vehicle_id)
          );
          setActiveFleetIds(activeIds);
        }
      } catch (error) {
        console.error("Error fetching sidebar data:", error);
      }
    };
    
    fetchData();
    const interval = setInterval(fetchData, 10000);
    return () => clearInterval(interval);
  }, []);

  const fetchVehicleRoute = async (vehicleId) => {
    setActiveVehicle(vehicleId);
    try {
      const response = await fetch(`${API_BASE}/api/routes/vehicle/${vehicleId}`);
      if (!response.ok) throw new Error("Failed to fetch vehicle route");
      const route = await response.json();
      setRouteData(route);
    } catch (error) {
      setRouteData(null);
    }
  };

  return (
    <>
        <motion.div
          initial={{ width: 260 }}
          animate={{ width: isOpen ? 260 : 0 }}
          transition={{ duration: 0.4, ease: "easeInOut" }}
          className="h-[calc(100vh-64px)] bg-[#0b0f19]/95 backdrop-blur-xl text-white sticky top-16 left-0 z-40 border-r border-indigo-900/30 overflow-y-auto shadow-2xl overflow-x-hidden scrollbar-thin scrollbar-thumb-indigo-600"
        >
          <AnimatePresence>
            {isOpen && (
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
                className="w-[260px] flex flex-col p-4 h-full"
              >
                <div className="mb-6 px-2">
                  <h3 className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-4">Live Fleet</h3>
                  <ul className="space-y-2">
                    {vehicles.map((vehicle) => (
                      <li key={vehicle.id}>
                        <button
                          onClick={() => fetchVehicleRoute(vehicle.id)}
                          className={`group relative flex items-center p-3 rounded-xl w-full text-left transition-all duration-300 ${
                            activeVehicle === vehicle.id
                              ? "bg-gradient-to-r from-indigo-600/30 to-purple-600/30 text-indigo-300 border border-indigo-500/50 shadow-[0_0_15px_rgba(79,70,229,0.2)]"
                              : "hover:bg-gray-800/60 text-gray-400 hover:text-white border border-transparent"
                          }`}
                        >
                          <div className={`p-2 rounded-lg mr-3 transition-colors ${
                            activeVehicle === vehicle.id ? "bg-indigo-500/20 text-indigo-400" : "bg-gray-800 group-hover:bg-gray-700"
                          }`}>
                            <Truck size={18} />
                          </div>
                          <div className="flex flex-col">
                            <span className="font-semibold text-sm">Vehicle 0{vehicle.id}</span>
                            <span className="text-xs opacity-60 flex items-center gap-1">
                              {activeFleetIds.has(vehicle.id) ? (
                                <>
                                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span> Active
                                </>
                              ) : (
                                <>
                                  <span className="w-1.5 h-1.5 rounded-full bg-amber-400"></span> Idle
                                </>
                              )}
                            </span>
                          </div>
                          
                          {activeVehicle === vehicle.id && (
                            <motion.div 
                              layoutId="activeIndicator"
                              className="absolute left-0 w-1 h-8 bg-indigo-500 rounded-r-md"
                            />
                          )}
                        </button>
                      </li>
                    ))}
                    {vehicles.length === 0 && (
                      <div className="text-sm text-gray-500 p-3 text-center border border-dashed border-gray-700 rounded-xl">
                        No vehicles detected.
                      </div>
                    )}
                  </ul>
                </div>
                
                <div className="mt-auto px-2 pb-4">
                  {/* Footer space preserved */}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>

        <button
          onClick={() => setIsOpen(!isOpen)}
          className={`fixed top-[76px] z-50 bg-[#0b0f19] border border-indigo-900/50 text-indigo-400 p-1.5 rounded-r-xl shadow-[0_0_15px_rgba(0,0,0,0.5)] transition-all duration-400 hover:text-indigo-300 hover:bg-gray-800 ${
            isOpen ? "left-[260px]" : "left-0"
          }`}
        >
          {isOpen ? <ChevronsLeft size={20} /> : <ChevronsRight size={20} />}
        </button>
    </>
  );
};

export default Sidebar;
