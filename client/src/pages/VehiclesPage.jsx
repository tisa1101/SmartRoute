import API_BASE from '../api';
import React from "react";
import VehicleInputForm from "../components/VehicleInputForm";
import Navbar from "../components/Navbar";

const VehiclePage = () => {
  const handleVehicleSubmit = (vehicleData) => {
    fetch(API_BASE + "/api/vehicles/", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(vehicleData),
    })
      .then((res) => res.json())
      .then((data) => console.log("Vehicle Added:", data))
      .catch((err) => console.error("Error:", err));
  };

  return (
    <>
      <Navbar />
      <div>
        <VehicleInputForm onSubmit={handleVehicleSubmit} />
      </div>
    </>
  );
};

export default VehiclePage;
