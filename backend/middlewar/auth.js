import jwt from "jsonwebtoken";

const authUser = async (req, res, next) => {
  try {
    // Get token from headers
    const { token } = req.headers;

    if (!token) {
      return res.json({ success: false, message: "Not Authorized. Login again." });
    }

    // Decode the token (Make sure JWT_SECRET is defined in your .env file)
    const token_decode = jwt.verify(token, process.env.JWT_SECRET);
    
    // req.body can be undefined on GET requests (no body), so initialize it
    if (!req.body) req.body = {};

    // Attach the decoded id so controllers can read it
    req.body.userid = token_decode.id;

    next();
  } catch (error) {
    console.error(error);
    res.json({ success: false, message: "Invalid token. Please login again." });
  }
};

export default authUser;