const roleCheck = (requiredRole) => (req, res, next) => {
  console.log("Role Check Middleware: req.user:", req.user);
  if (!req.user || req.user.role !== requiredRole) {
    return res.status(403).json({
      success: false,
      message: "Access Denied. You do not have permission to perform this action.",
    });
  }
  next();
};


export default roleCheck;
