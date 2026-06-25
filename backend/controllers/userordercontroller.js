import orderModel from "../models/orderModel.js"; // Adjust based on your actual model path
import userModel from "../models/userModel.js";

// ── Place Order (With Conditional Initial Status) ───────────────────────────
// POST: /api/order/place
const placeOrder = async (req, res) => {
  try {
    // 1. Remove 'status' from req.body destructuring so frontend can't accidentally force it
    const { userid, items, amount, address, paymentMethod } = req.body;

    if (!userid) {
      return res.json({ success: false, message: "User identity unauthenticated" });
    }

    // 2. Explicitly determine the exact status string BEFORE creating the document
    const finalStatus = (paymentMethod && paymentMethod.toLowerCase() === "cod") ? "preparing" : "pending";

    const newOrder = new orderModel({
      userid,
      items,
      amount,
      address,
      paymentMethod,
      status: finalStatus, // Set it directly here cleanly
      payment: false
    });

    await newOrder.save();

    return res.json({ 
      success: true, 
      message: paymentMethod === "cod" ? "Order placed! Food is being prepared." : "Order initiated. Awaiting payment.",
      orderId: newOrder._id
    });

  } catch (error) {
    console.error("Error placing order:", error);
    return res.json({ success: false, message: "Failed to place order" });
  }
};
// ── Fetch User Orders ────────────────────────────────────────────────────────
// GET: /api/order/userorders
const userOrders = async (req, res) => {
  try {
    const { userid } = req.body; 

    if (!userid) {
      return res.json({ success: false, message: "User identity unauthenticated" });
    }

    console.log("🔍 Searching orders for userid:", userid, "| type:", typeof userid);
    const orders = await orderModel.find({ userid }).sort({ createdAt: -1 });
    console.log("✅ Orders found for user:", orders.length);
    
    return res.json({ success: true, orders });
  } catch (error) {
    console.error("Error fetching user orders:", error);
    return res.json({ success: false, message: "Failed to retrieve orders" });
  }
};

// ── Cancel Order ─────────────────────────────────────────────────────────────
// POST: /api/order/cancel
const cancelOrder = async (req, res) => {
  try {
    const { orderId, userid } = req.body;

    const order = await orderModel.findById(orderId);

    if (!order) {
      return res.json({ success: false, message: "Order not found" });
    }

    if (order.userid.toString() !== userid) {
      return res.json({ success: false, message: "Unauthorized action" });
    }

    // Guard: Allow cancellation only if the order is still 'pending' or 'preparing'
    if (order.status !== "pending" && order.status !== "preparing") {
      return res.json({ 
        success: false, 
        message: `Cannot cancel an order that is already ${order.status}` 
      });
    }

    order.status = "cancelled";
    await order.save();

    return res.json({ success: true, message: "Order cancelled successfully" });
  } catch (error) {
    console.error("Error cancelling order:", error);
    return res.json({ success: false, message: "Server error during cancellation" });
  }
};

export { placeOrder, userOrders, cancelOrder };