import API_BASE from '../api';
import React from "react";
import OrderInputForm from "../components/OrderInputForm";
import Navbar from '../components/Navbar';

const OrderPage = () => {
  const handleOrderSubmit = (orderData) => {
    fetch(API_BASE + "/api/orders/", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(orderData),
    })
      .then((res) => res.json())
      .then((data) => console.log("Order Created:", data))
      .catch((err) => console.error("Error:", err));
  };

  return (
    <div className="bg-[#050811] min-h-screen text-gray-200">
      <Navbar />
      <main className="pt-24 pb-12 px-6">
        <OrderInputForm onSubmit={handleOrderSubmit} />
      </main>
    </div>
  );
};

export default OrderPage;
