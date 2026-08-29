import React, { useState } from "react";
import Navbar from '../components/Navbar';
import Sidebar from '../components/Sidebar';
import GoogleMapComponent from '../components/GoogleMapComponent';
import DashboardMetrics from '../components/DashboardMetrics';
import LiveActivity from '../components/LiveActivity';
import FleetStatus from '../components/FleetStatus';

const HomePage = () => {
  const warehouseLocation = { lat: 19.116458, lng: 72.902696 };
  const deliveryLocation = { lat: 19.180458, lng: 72.849696 };
  const [routeData, setRouteData] = useState(null);

  return (
    <div className="bg-[#050811] min-h-screen text-gray-200">
      <Navbar />
      <div className="flex pt-16">
        <Sidebar setRouteData={setRouteData} />
        
        <main className="flex-1 transition-all duration-400 ease-in-out p-6 max-w-[1600px] mx-auto">
          {/* Dashboard Header */}
          <div className="mb-8 mt-2 flex justify-between items-end">
            <div>
              <h1 className="text-3xl font-extrabold tracking-tight text-white mb-1">Fleet Command Center</h1>
              <p className="text-sm text-gray-400 flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                Real-time visibility across your entire delivery network
              </p>
            </div>
            <div className="text-right text-gray-400 text-sm font-medium">
              {new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}
            </div>
          </div>

          <DashboardMetrics routeData={routeData} />
          
          {/* Map & Side Panels Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-6">
            
            {/* The Map Component (Takes up 2 columns on large screens) */}
            <div className="lg:col-span-2 rounded-2xl overflow-hidden shadow-[0_0_40px_rgba(0,0,0,0.5)] border border-gray-700/50 relative h-[600px]">
              <GoogleMapComponent origin={warehouseLocation} destination={deliveryLocation} routeData={routeData} />
            </div>

            {/* Side Panels (Takes up 1 column on large screens) */}
            <div className="flex flex-col gap-6 h-[600px]">
              <div className="flex-1 min-h-[300px]">
                <LiveActivity />
              </div>
              <div className="flex-1 min-h-[250px]">
                <FleetStatus />
              </div>
            </div>

          </div>
        </main>
      </div>
    </div>
  );
};

export default HomePage;
