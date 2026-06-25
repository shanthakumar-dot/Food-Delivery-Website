import React, { useContext, useState } from "react";
import "./orderPage.css";
import { useLocation, useNavigate } from "react-router-dom";
import { StoreContext } from "../../context/storecontext";
import axios from "axios"; 

const OrderPage = () => {
  const { state } = useLocation();
  const navigate = useNavigate();
  const { url, food_list, token } = useContext(StoreContext);
  const { cartItems, subtotal, deliveryFee, total } = state || {};

  const [form, setForm] = useState({
    name: "",
    phone: "",
    address: "",
    payment: "cod",
  });
  const [placed, setPlaced] = useState(false);

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handlePlaceOrder = async () => {
    if (!form.name || !form.phone || !form.address) {
      alert("Please fill in all fields");
      return; 
    }

    const orderItems = [];
    food_list.forEach((item) => {
      if (cartItems && cartItems[item._id] > 0) {
        orderItems.push({
          itemid: item._id,
          name: item.name,
          price: item.price,
          quantity: cartItems[item._id],
        });
      }
    });

    const orderData = {
      name: form.name,
      phone: form.phone,
      address: form.address,
      items: orderItems,
      subtotal: Number(subtotal),
      deliveryFee: Number(deliveryFee),
      total: Number(total),
      paymentMethod: form.payment,
      // Note: Your authMiddleware automatically appends 'userid' or 'userId' 
      // from the token header directly on the backend server.
    };

    try {
      const response = await axios.post(
        url + "/api/order/place",
        orderData,
        { headers: { token } } 
      );

      if (response.data.success) {
        alert(response.data.message);
        setPlaced(true); 
      } else {
        alert(response.data.message);
      }
    } catch (error) {
      console.error("Axios Error Details:", error.response?.data);
      alert(error.response?.data?.message || "An error occurred while connecting to the server.");
    }
  };

  if (placed) {
    return (
      <div className="order-success">
        <div className="success-box">
          <div className="success-icon">✓</div>
          <h2>Order Placed!</h2>
          <p>
            Thank you, <strong>{form.name}</strong>! Your food is being
            prepared.
          </p>
          <p className="success-addr">Delivering to: {form.address}</p>
          <p className="success-total">
            Total Paid: <strong>${total?.toFixed(2)}</strong>
          </p>
          <button onClick={() => navigate("/myorders")}>View My Orders</button>
        </div>
      </div>
    );
  }

  return (
    <div className="order-page">
      <h2>Place Order</h2>

      <div className="order-layout">
        {/* Left — Delivery form */}
        <div className="order-form-box">
          <h3>Delivery Details</h3>
          <input
            name="name"
            placeholder="Full Name"
            value={form.name}
            onChange={handleChange}
          />
          <input
            name="phone"
            placeholder="Phone Number"
            value={form.phone}
            onChange={handleChange}
          />
          <textarea
            name="address"
            placeholder="Delivery Address"
            rows={3}
            value={form.address}
            onChange={handleChange}
          />

          <h3 style={{ marginTop: "20px" }}>Payment Method</h3>
          <div className="payment-options">
            <label className={form.payment === "cod" ? "active" : ""}>
              <input
                type="radio"
                name="payment"
                value="cod"
                checked={form.payment === "cod"}
                onChange={handleChange}
              />
              Cash on Delivery
            </label>
            <label className={form.payment === "online" ? "active" : ""}>
              <input
                type="radio"
                name="payment"
                value="online"
                checked={form.payment === "online"}
                onChange={handleChange}
              />
              Online Payment
            </label>
          </div>
        </div>

        {/* Right — Order summary */}
        <div className="order-summary-box">
          <h3>Order Summary</h3>

          <div className="order-items-list">
            {food_list
              .filter((item) => cartItems && cartItems[item._id] > 0)
              .map((item) => (
                <div className="order-item-row" key={item._id}>
                  <img src={url + "/images/" + item.image} alt={item.name} />
                  <div className="order-item-info">
                    <p className="order-item-name">{item.name}</p>
                    <p className="order-item-qty">Qty: {cartItems[item._id]}</p>
                  </div>
                  <p className="order-item-price">
                    ${(item.price * cartItems[item._id]).toFixed(2)}
                  </p>
                </div>
              ))}
          </div>

          <hr />
          <div className="order-totals">
            <div className="total-row">
              <span>Subtotal</span>
              <span>${subtotal?.toFixed(2)}</span>
            </div>
            <div className="total-row">
              <span>Delivery</span>
              <span>${deliveryFee?.toFixed(2)}</span>
            </div>
            <div className="total-row grand">
              <span>Total</span>
              <span>${total?.toFixed(2)}</span>
            </div>
          </div>

          <button className="place-order-btn" onClick={handlePlaceOrder}>
            Place Order →
          </button>
        </div>
      </div>
    </div>
  );
};

export default OrderPage;