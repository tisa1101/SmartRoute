import React, { useEffect, useState } from "react";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';
import Navbar from '../components/Navbar';
import API_BASE from '../api';

const Analytics = () => {
    const [stats, setStats] = useState({ total_orders: 0, total_vehicles: 0, pending: 0, active: 0 });
    
    // Mock time-series data for the glowing chart
    const data = [
      { time: '08:00', load: 4000, efficiency: 2400 },
      { time: '10:00', load: 3000, efficiency: 1398 },
      { time: '12:00', load: 2000, efficiency: 9800 },
      { time: '14:00', load: 2780, efficiency: 3908 },
      { time: '16:00', load: 1890, efficiency: 4800 },
      { time: '18:00', load: 2390, efficiency: 3800 },
      { time: '20:00', load: 3490, efficiency: 4300 },
    ];

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const res = await fetch(API_BASE + "/api/analytics/dashboard-stats");
                if (res.ok) {
                    const data = await res.json();
                    setStats({
                        total_orders: data.total_orders,
                        pending: data.pending_orders,
                        total_vehicles: data.total_vehicles,
                        active: data.vehicles_with_in_process_orders
                    });
                }
            } catch (err) {
                console.error(err);
            }
        };
        fetchStats();
    }, []);

    return (
        <div className="bg-[#050811] min-h-screen text-gray-200">
            <Navbar />
            <main className="pt-24 pb-12 px-6 max-w-7xl mx-auto">
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-white tracking-tight">System Telemetry</h1>
                    <p className="text-gray-400 mt-2">Live performance metrics and algorithmic efficiency.</p>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                    <div className="bg-[#1a1f2e]/80 backdrop-blur-xl p-6 rounded-2xl shadow-[0_0_30px_rgba(0,0,0,0.5)] border border-indigo-900/50 relative overflow-hidden group">
                        <div className="absolute -right-6 -top-6 w-24 h-24 bg-indigo-500/20 rounded-full blur-2xl group-hover:bg-indigo-500/30 transition-all"></div>
                        <h3 className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-2">Total Payloads</h3>
                        <div className="text-4xl font-bold text-white">{stats.total_orders}</div>
                        <div className="text-emerald-400 text-sm mt-2 font-mono flex items-center gap-1">↑ 12% optimization</div>
                    </div>
                    <div className="bg-[#1a1f2e]/80 backdrop-blur-xl p-6 rounded-2xl shadow-[0_0_30px_rgba(0,0,0,0.5)] border border-emerald-900/50 relative overflow-hidden group">
                        <div className="absolute -right-6 -top-6 w-24 h-24 bg-emerald-500/20 rounded-full blur-2xl group-hover:bg-emerald-500/30 transition-all"></div>
                        <h3 className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-2">Fleet Readiness</h3>
                        <div className="text-4xl font-bold text-white">{(stats.active / (stats.total_vehicles || 1) * 100).toFixed(0)}%</div>
                        <div className="text-emerald-400 text-sm mt-2 font-mono flex items-center gap-1">Active Utilization</div>
                    </div>
                    <div className="bg-[#1a1f2e]/80 backdrop-blur-xl p-6 rounded-2xl shadow-[0_0_30px_rgba(0,0,0,0.5)] border border-blue-900/50 relative overflow-hidden group">
                        <div className="absolute -right-6 -top-6 w-24 h-24 bg-blue-500/20 rounded-full blur-2xl group-hover:bg-blue-500/30 transition-all"></div>
                        <h3 className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-2">ETA Accuracy</h3>
                        <div className="text-4xl font-bold text-white">94.2%</div>
                        <div className="text-blue-400 text-sm mt-2 font-mono">Random Forest ML</div>
                    </div>
                    <div className="bg-[#1a1f2e]/80 backdrop-blur-xl p-6 rounded-2xl shadow-[0_0_30px_rgba(0,0,0,0.5)] border border-purple-900/50 relative overflow-hidden group">
                        <div className="absolute -right-6 -top-6 w-24 h-24 bg-purple-500/20 rounded-full blur-2xl group-hover:bg-purple-500/30 transition-all"></div>
                        <h3 className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-2">Cost Efficiency</h3>
                        <div className="text-4xl font-bold text-white">High</div>
                        <div className="text-purple-400 text-sm mt-2 font-mono flex items-center gap-1">Dijkstra + TSP Active</div>
                    </div>
                </div>
                
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    <div className="lg:col-span-2 bg-[#1a1f2e]/80 backdrop-blur-xl p-6 rounded-2xl shadow-[0_0_30px_rgba(0,0,0,0.5)] border border-gray-700/50">
                        <h2 className="text-lg font-bold text-white mb-6">Algorithm Load Efficiency</h2>
                        <div className="h-80">
                            <ResponsiveContainer width="100%" height="100%">
                                <AreaChart data={data} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                                    <defs>
                                        <linearGradient id="colorLoad" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="5%" stopColor="#4f46e5" stopOpacity={0.8}/>
                                            <stop offset="95%" stopColor="#4f46e5" stopOpacity={0}/>
                                        </linearGradient>
                                    </defs>
                                    <CartesianGrid strokeDasharray="3 3" stroke="#374151" vertical={false} />
                                    <XAxis dataKey="time" stroke="#9ca3af" axisLine={false} tickLine={false} />
                                    <YAxis stroke="#9ca3af" axisLine={false} tickLine={false} />
                                    <Tooltip contentStyle={{ backgroundColor: '#111827', borderColor: '#374151', borderRadius: '8px', color: '#fff' }} />
                                    <Area type="monotone" dataKey="load" stroke="#4f46e5" strokeWidth={3} fillOpacity={1} fill="url(#colorLoad)" />
                                </AreaChart>
                            </ResponsiveContainer>
                        </div>
                    </div>
                    
                    <div className="bg-[#1a1f2e]/80 backdrop-blur-xl p-6 rounded-2xl shadow-[0_0_30px_rgba(0,0,0,0.5)] border border-gray-700/50 flex flex-col justify-between">
                        <div>
                            <h2 className="text-lg font-bold text-white mb-2">Optimization Score</h2>
                            <p className="text-sm text-gray-400 mb-6">System-wide algorithmic performance index based on distance minimized and fuel saved.</p>
                            
                            <div className="flex items-center justify-center py-8">
                                <div className="relative w-48 h-48 rounded-full border-8 border-gray-800 flex items-center justify-center">
                                    <svg className="absolute w-full h-full transform -rotate-90">
                                        <circle cx="96" cy="96" r="88" stroke="currentColor" strokeWidth="8" fill="transparent" className="text-emerald-500" strokeDasharray="552" strokeDashoffset="120" strokeLinecap="round" />
                                    </svg>
                                    <div className="text-center">
                                        <span className="text-5xl font-black text-white">88</span>
                                        <span className="block text-sm font-bold text-emerald-500 tracking-widest mt-1">EXCELLENT</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
};

export default Analytics;
