import mongoose from "mongoose";

const orderschema = new mongoose.Schema({
  userid: {
    type: String,
    required: true,
  },
  name: { type: String, required: true },
  phone: { type: String, required: true },
  address: { type: String, required: true },

  items: [
    {
      itemid: { type: String, required: true },
      name: { type: String, required: true },
      price: { type: Number, required: true },
      quantity: { type: Number, required: true },
    },
  ],

  subtotal: { type: Number, required: true },
  deliveryFee: { type: Number, required: true },
  total: { type: Number, required: true },

  paymentMethod: { type: String, enum: ["cod", "online"], default: "cod" },
  paymentStatus: { type: Boolean, default: false },
  status: { type: String, default: "preparing" },
  date: { type: Date, default: Date.now },
});

const ordermodel =
  mongoose.models.order || mongoose.model("order", orderschema);
export default ordermodel;
