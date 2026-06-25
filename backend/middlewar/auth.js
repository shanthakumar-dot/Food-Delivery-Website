import jwt from "jsonwebtoken";

const authUser = async (req, res, next) => {
  try {
    const { token } = req.headers;

    if (!token) {
      return res.json({
        success: false,
        message: "Not Authorized. Login again.",
      });
    }

    const token_decode = jwt.verify(token, process.env.JWT_SECRET);

    if (!req.body) req.body = {};

    req.body.userid = token_decode.id;

    next();
  } catch (error) {
    console.error(error);
    res.json({ success: false, message: "Invalid token. Please login again." });
  }
};

export default authUser;
