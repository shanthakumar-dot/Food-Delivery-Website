import usermodel from "../models/usermodel.js";

const addtocart = async (req, res) => {
  try {
    const { userid, itemId } = req.body; // Changed to itemID

    if (!itemId) {
      return res.json({ success: false, message: "Missing itemID" });
    }

    let userdata = await usermodel.findById(userid);
    if (!userdata) {
      return res.json({ success: false, message: "User not found" });
    }

    if (!userdata.cartdata) {
      userdata.cartdata = {};
    }

    if (!userdata.cartdata[itemId]) {
      userdata.cartdata[itemId] = 1;
    } else {
      userdata.cartdata[itemId] += 1;
    }

    userdata.markModified("cartdata");
    await userdata.save();

    res.json({ success: true, message: "Added to cart" });
  } catch (error) {
    console.error(error);
    res.json({ success: false, message: "Failed to add" });
  }
};

const removecart = async (req, res) => {
  try {
    const { userid, itemId } = req.body; // Changed to itemID
    const userdata = await usermodel.findById(userid);

    if (!userdata) {
      return res.json({ success: false, message: "User not found" });
    }

    if (userdata.cartdata && userdata.cartdata[itemId]) {
      userdata.cartdata[itemId] -= 1;

      if (userdata.cartdata[itemId] === 0) {
        delete userdata.cartdata[itemId];
      }

      userdata.markModified("cartdata");
      await userdata.save();

      return res.json({ success: true, message: "Cart item decreased" });
    } else {
      return res.json({ success: false, message: "Item not found in cart" });
    }
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: "Failed to remove item" });
  }
};

const getcart = async (req, res) => {
  try {
    const { userid } = req.body;
    const userdata = await usermodel.findById(userid);

    if (!userdata) {
      return res.json({ success: false, message: "User not found" });
    }

    const cartdata = userdata.cartdata || {};
    res.json({ success: true, cartdata });
  } catch (error) {
    console.error(error);
    res.json({ success: false, message: "Error fetching cart" });
  }
};

export { addtocart, removecart, getcart };
