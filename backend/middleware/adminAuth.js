import jwt from "jsonwebtoken";

const adminAuth = (req, res, next) => {
  try {
    console.log("Authorization Header:", req.headers.authorization || "Not provided");

    const authHeader = req.headers.authorization;

    // Check if Authorization header exists
    if (!authHeader) {
      console.error("Authorization header missing.");
      return res.status(403).json({
        success: false,
        message: "Authorization header missing",
      });
    }

    // Check if Authorization header follows the Bearer format
    if (!authHeader.startsWith("Bearer ")) {
      console.error("Invalid Authorization header format.");
      return res.status(403).json({
        success: false,
        message: "Invalid token format",
      });
    }

    // Extract the token
    const token = authHeader.split(" ")[1];
    console.log("Extracted Token:", token);

    // Verify the token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log("Decoded Token:", decoded);

    // Check if the role is authorized
    if (!["admin", "vendor"].includes(decoded.role)) {
      console.error("Access denied: insufficient role.");
      return res.status(403).json({
        success: false,
        message: "Access denied: insufficient role",
      });
    }

    // Attach user details to the request object
    req.user = decoded;
    next();
  } catch (error) {
    console.error("Token validation error:", error.message);

    // Check for token expiration specifically
    if (error.name === "TokenExpiredError") {
      return res.status(403).json({
        success: false,
        message: "Token has expired",
      });
    }

    return res.status(403).json({
      success: false,
      message: "Invalid token",
    });
  }
};

export default adminAuth;
