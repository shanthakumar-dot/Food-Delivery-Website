import ordermodel from '../models/orderModel.js'; 
import usermodel from '../models/usermodel.js';

// Place User Order
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
            paymentMethod 
        } = req.body;
        const userid = req.body.userid; // injected by authMiddleware from JWT token

        // 1. Validate that all required fields are present
        if (!name || !phone || !address || !items || items.length === 0) {
            return res.status(400).json({ 
                success: false, 
                message: "Missing required details. Please check form fields and cart items." 
            });
        }

        // 2. Determine initial status based on payment method:
        //    COD orders go straight to "preparing"; online orders stay "pending"
        //    until payment is confirmed.
        const orderStatus = paymentMethod === 'cod' ? 'preparing' : 'pending';

        // 3. Map items array and create the order instance
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
            paymentStatus: paymentMethod === 'online' ? false : false // Will remain false until an online payment webhook verifies success
        });

        // 3. Save the order to MongoDB
        await neworder.save();
   

        if (userid) {
            await usermodel.findByIdAndUpdate(userid, { cartdata: {} });
        }
         

        // 4. Handle response based on payment selection
        if (paymentMethod === 'cod') {
            return res.json({ 
                success: true, 
                message: "Order placed successfully via Cash on Delivery!", 
                orderId: neworder._id 
            });
        } else if (paymentMethod === 'online') {
            // Integration Point: You can hook up Stripe or Razorpay API calls here
            return res.json({ 
                success: true, 
                message: "Order created. Initializing online payment process...", 
                orderId: neworder._id 
            });
        }

    } 
     catch (error) {
    console.error("Order Controller Error:", error.message); // ← change this
    return res.json({ 
        success: false, 
        message: error.message  // ← send real error to frontend temporarily
    });
}
};

export { placeorder };