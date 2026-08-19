import React, { useState, useEffect } from "react";
import axios from "axios";

const AlgorithmLab = () => {
    const [results, setResults] = useState([]);

    useEffect(() => {
        axios.get("http://localhost:8000/api/routes/compare")
            .then(res => setResults(res.data))
            .catch(err => console.error(err));
    }, []);

    return (
        <div className="p-6 text-white bg-slate-900 min-h-screen">
            <h1 className="text-3xl font-bold mb-6">Algorithm Lab</h1>
            <div className="overflow-x-auto bg-slate-800 rounded-lg shadow">
                <table className="w-full text-left">
                    <thead className="bg-slate-700">
                        <tr>
                            <th className="p-4 border-b border-slate-600">Algorithm</th>
                            <th className="p-4 border-b border-slate-600">Distance (km)</th>
                            <th className="p-4 border-b border-slate-600">Time (ms)</th>
                            <th className="p-4 border-b border-slate-600">Nodes Explored</th>
                        </tr>
                    </thead>
                    <tbody>
                        {results.map((r, i) => (
                            <tr key={i} className="hover:bg-slate-700 transition">
                                <td className="p-4 border-b border-slate-600 font-medium">{r.algorithm}</td>
                                <td className="p-4 border-b border-slate-600 text-blue-400">{r.distance}</td>
                                <td className="p-4 border-b border-slate-600 text-green-400">{r.time_ms}</td>
                                <td className="p-4 border-b border-slate-600 text-purple-400">{r.nodes}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
            <div className="mt-8 bg-slate-800 p-6 rounded-lg">
                <h2 className="text-xl font-bold mb-4">Algorithm Visualization</h2>
                <div className="h-64 bg-slate-700 flex items-center justify-center text-slate-400 rounded">
                    Map visualization will render here (Canvas/SVG).
                </div>
            </div>
        </div>
    );
};

export default AlgorithmLab;
