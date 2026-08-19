import React from "react";

const Analytics = () => {
    return (
        <div className="p-6 text-white bg-slate-900 min-h-screen">
            <h1 className="text-3xl font-bold mb-6">Performance Analytics</h1>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <div className="bg-slate-800 p-6 rounded-lg shadow border border-slate-700">
                    <h3 className="text-slate-400 mb-2">Total Deliveries</h3>
                    <div className="text-4xl font-bold">1,248</div>
                    <div className="text-green-400 text-sm mt-2">↑ 12% from last week</div>
                </div>
                <div className="bg-slate-800 p-6 rounded-lg shadow border border-slate-700">
                    <h3 className="text-slate-400 mb-2">Average Delivery Time</h3>
                    <div className="text-4xl font-bold">42 min</div>
                    <div className="text-green-400 text-sm mt-2">↓ 5 min from last week</div>
                </div>
                <div className="bg-slate-800 p-6 rounded-lg shadow border border-slate-700">
                    <h3 className="text-slate-400 mb-2">On-Time Percentage</h3>
                    <div className="text-4xl font-bold">94.2%</div>
                    <div className="text-green-400 text-sm mt-2">↑ 2.1% from last week</div>
                </div>
                <div className="bg-slate-800 p-6 rounded-lg shadow border border-slate-700">
                    <h3 className="text-slate-400 mb-2">ETA Prediction Accuracy</h3>
                    <div className="text-4xl font-bold">89%</div>
                    <div className="text-slate-400 text-sm mt-2">Random Forest Model</div>
                </div>
                <div className="bg-slate-800 p-6 rounded-lg shadow border border-slate-700">
                    <h3 className="text-slate-400 mb-2">Total Cost Saved</h3>
                    <div className="text-4xl font-bold text-green-400">₹ 42,500</div>
                    <div className="text-slate-400 text-sm mt-2">Estimated fuel savings</div>
                </div>
            </div>
            
            <div className="bg-slate-800 p-6 rounded-lg shadow">
                <h2 className="text-xl font-bold mb-4">Delivery Volume Trends</h2>
                <div className="h-64 bg-slate-700 flex items-center justify-center text-slate-400 rounded">
                    Line chart visualization will render here (e.g., using Recharts or Chart.js)
                </div>
            </div>
        </div>
    );
};

export default Analytics;
