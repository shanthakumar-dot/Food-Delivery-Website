import React, { useContext, useEffect, useState } from "react";
import "./orders.css";
import { StoreContext } from "../../context/storecontext";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const STATUS_FILTERS = ["all", "pending", "preparing", "delivered", "cancelled"];

const Orders = () => {
  const { url, token } = useContext(StoreContext);
  const navigate = useNavigate();

  const [orders, setOrders] = useState([]);
  const [activeFilter, setActiveFilter] = useState("all");
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState("");

  // Fetch orders
  useEffect(() => {
    if (!token) return;
    axios
      .post(`${url}/api/userorder/order`, {}, { headers: { token } })
      .then((res) => {
        if (res.data.success) setOrders(res.data.orders);
      })
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  }, [token, url]);

  const showToast = (msg) => {
    setToast(msg);
    setTimeout(() => setToast(""), 2000);
  };

  // Adjust Quantity
  const changeQty = (orderId, itemId, delta) => {
    setOrders((prev) =>
      prev.map((order) => {
        if (order._id !== orderId) return order;
        return {
          ...order,
          items: order.items.map((item) =>
            item.itemid === itemId
              ? { ...item, quantity: Math.max(1, item.quantity + delta) }
              : item
          ),
        };
      })
    );
  };

  // Remove Item
  const removeItem = (orderId, itemId) => {
    setOrders((prev) =>
      prev
        .map((order) => {
          if (order._id !== orderId) return order;
          return { ...order, items: order.items.filter((i) => i.itemid !== itemId) };
        })
        .filter((order) => order.items.length > 0)
    );
    showToast("Item removed");
  };

  // Cancel Order
  const cancelOrder = async (orderId) => {
    try {
      const res = await axios.post(`${url}/api/userorder/cancel`, { orderId }, { headers: { token } });
      if (res.data.success) {
        setOrders((prev) =>
          prev.map((o) => (o._id === orderId ? { ...o, status: "cancelled" } : o))
        );
        showToast("Order cancelled");
      }
    } catch {
      showToast("Error cancelling order");
    }
  };

  // Filter and Math Helpers
  const filteredOrders = activeFilter === "all" 
    ? orders 
    : orders.filter((o) => o.status === activeFilter);

  const getSubtotal = (order) => order.items.reduce((s, i) => s + i.price * i.quantity, 0);

  if (!token) return <div className="orders-empty"><p>Please sign in to view orders</p></div>;
  if (loading) return <div className="orders-empty"><p>Loading orders...</p></div>;

  return (
    <div className="orders-page">
      <h2>My Orders</h2>

      {/* Filter tabs */}
      <div className="orders-tabs">
        {STATUS_FILTERS.map((filter) => (
          <button
            key={filter}
            className={`orders-tab ${activeFilter === filter ? "active" : ""}`}
            onClick={() => setActiveFilter(filter)}
          >
            {filter} ({orders.filter((o) => filter === "all" || o.status === filter).length})
          </button>
        ))}
      </div>

      {/* Orders List */}
      {filteredOrders.length === 0 ? (
        <div className="orders-empty"><p>No orders found</p></div>
      ) : (
        <div className="orders-list">
          {filteredOrders.map((order) => {
            const subtotal = getSubtotal(order);
            const total = subtotal + (order.deliveryFee || 0);
            const isPending = order.status === "pending";

            return (
              <div className="order-card" key={order._id}>
                <div className="order-card-header">
                  <span>ID: #{order._id.slice(-6).toUpperCase()}</span>
                  <span className={`status-badge ${order.status}`}>{order.status}</span>
                  <p>{order.address}</p>
                </div>

                <div className="order-items">
                  {order.items.map((item) => (
                    <div className="order-item-row" key={item.itemid}>
                      <div className="item-img" style={{ display:'flex', alignItems:'center', justifyContent:'center', background:'#f0f0f0', fontSize:'20px' }}>🍽️</div>
                      <div className="item-details">
                        <p>{item.name}</p>
                        <span>${item.price.toFixed(2)}</span>
                      </div>

                      {isPending ? (
                        <div className="qty-control">
                          <button onClick={() => changeQty(order._id, item.itemid, -1)} disabled={item.quantity <= 1}>-</button>
                          <span>{item.quantity}</span>
                          <button onClick={() => changeQty(order._id, item.itemid, 1)}>+</button>
                          <button onClick={() => removeItem(order._id, item.itemid)} className="remove-btn">✕</button>
                        </div>
                      ) : (
                        <span>Qty: {item.quantity}</span>
                      )}
                    </div>
                  ))}
                </div>

                <div className="order-card-footer">
                  <div className="totals">
                    <p>Subtotal: ${subtotal.toFixed(2)}</p>
                    <p>Total: ${total.toFixed(2)}</p>
                  </div>
                  <div className="actions">
                    {(isPending || order.status === "preparing") && (
                      <button onClick={() => cancelOrder(order._id)} className="btn-cancel">Cancel</button>
                    )}
                    <button onClick={() => navigate("/myorders")}>Refresh</button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {toast && <div className="orders-toast">{toast}</div>}
    </div>
  );
};

export default Orders;