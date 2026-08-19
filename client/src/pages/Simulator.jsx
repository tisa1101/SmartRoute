import React, { useState } from "react";
import axios from "axios";

const Simulator = () => {
    const [params, setParams] = useState({
        num_vehicles: 3,
        vehicle_capacity: 50,
        num_deliveries: 120,
        traffic_level: "Moderate",
        weather_condition: "Clear",
        priority_orders: 5,
        max_delivery_time: 120
    });
    
    const [result, setResult] = useState(null);

    const runSimulation = async () => {
        try {
            const res = await axios.post("http://localhost:8000/api/simulation/what-if", params);
            setResult(res.data);
        } catch (error) {
            console.error("Simulation failed", error);
        }
    };

    return (
        <div className="p-6 text-white bg-slate-900 min-h-screen">
            <h1 className="text-3xl font-bold mb-6">What-If Simulator</h1>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-slate-800 p-6 rounded-lg shadow">
                    <h2 className="text-xl font-bold mb-4">Scenario Parameters</h2>
                    {Object.keys(params).map(key => (
                        <div key={key} className="mb-4">
                            <label className="block text-sm font-medium text-slate-400 capitalize mb-1">
                                {key.replace(/_/g, " ")}
                            </label>
                            {typeof params[key] === "string" ? (
                                <select 
                                    className="w-full bg-slate-700 p-2 rounded text-white"
                                    value={params[key]}
                                    onChange={e => setParams({...params, [key]: e.target.value})}
                                >
                                    {key === "traffic_level" && ["No Traffic", "Light", "Moderate", "Heavy"].map(o => <option key={o}>{o}</option>)}
                                    {key === "weather_condition" && ["Clear", "Rain", "Snow"].map(o => <option key={o}>{o}</option>)}
                                </select>
                            ) : (
                                <input 
                                    type="number" 
                                    className="w-full bg-slate-700 p-2 rounded text-white"
                                    value={params[key]}
                                    onChange={e => setParams({...params, [key]: Number(e.target.value)})}
                                />
                            )}
                        </div>
                    ))}
                    <button 
                        onClick={runSimulation}
                        className="w-full bg-blue-600 hover:bg-blue-700 py-3 rounded font-bold transition mt-4"
                    >
                        Simulate Optimization
                    </button>
                </div>
                
                {result && (
                    <div className="bg-slate-800 p-6 rounded-lg shadow">
                        <h2 className="text-xl font-bold mb-4">Simulation Results</h2>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="bg-slate-700 p-4 rounded text-center">
                                <div className="text-3xl font-bold text-green-400">{result.results.optimization_score}/100</div>
                                <div className="text-sm text-slate-400">Optimization Score</div>
                            </div>
                            <div className="bg-slate-700 p-4 rounded text-center">
                                <div className="text-3xl font-bold text-blue-400">{result.results.total_distance_km}</div>
                                <div className="text-sm text-slate-400">Total Distance (km)</div>
                            </div>
                            <div className="bg-slate-700 p-4 rounded text-center">
                                <div className="text-3xl font-bold text-yellow-400">{result.results.total_eta_minutes}</div>
                                <div className="text-sm text-slate-400">Total ETA (min)</div>
                            </div>
                            <div className="bg-slate-700 p-4 rounded text-center">
                                <div className="text-3xl font-bold text-purple-400">{result.results.delivery_success_rate}%</div>
                                <div className="text-sm text-slate-400">Success Rate</div>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Simulator;
