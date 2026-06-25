import ordermodel from "../models/orderModel.js";
import usermodel from "../models/usermodel.js";

const placeorder = async (req, res) => {
  try {
    const {
      name,
      phone,
      address,
      items,
      subtotal,
      deliveryFee,
      total,
      paymentMethod,
    } = req.body;
    const userid = req.body.userid; // injected by authMiddleware from JWT token

    if (!name || !phone || !address || !items || items.length === 0) {
      return res.status(400).json({
        success: false,
        message:
          "Missing required details. Please check form fields and cart items.",
      });
    }

    const orderStatus = paymentMethod === "cod" ? "preparing" : "pending";

    const neworder = new ordermodel({
      userid,
      name,
      phone,
      address,
      items, // Array containing objects with itemId, name, price, quantity
      subtotal,
      deliveryFee,
      total,
      paymentMethod,
      status: orderStatus,
      paymentStatus: paymentMethod === "online" ? false : false, // Will remain false until an online payment webhook verifies success
    });

    await neworder.save();

    if (userid) {
      await usermodel.findByIdAndUpdate(userid, { cartdata: {} });
    }

    if (paymentMethod === "cod") {
      return res.json({
        success: true,
        message: "Order placed successfully via Cash on Delivery!",
        orderId: neworder._id,
      });
    } else if (paymentMethod === "online") {
      return res.json({
        success: true,
        message: "Order created. Initializing online payment process...",
        orderId: neworder._id,
      });
    }
  } catch (error) {
    console.error("Order Controller Error:", error.message); // ← change this
    return res.json({
      success: false,
      message: error.message, // ← send real error to frontend temporarily
    });
  }
};

export { placeorder };
