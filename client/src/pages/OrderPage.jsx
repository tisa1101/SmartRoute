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
    <>
    <Navbar />
    <div>
      <OrderInputForm onSubmit={handleOrderSubmit} />
    </div>
    </>
    
  );
};

export default OrderPage;
