// import jwt from 'jsonwebtoken'

// const authUser = async (req, res, next) => {

//     const { token } = req.headers;

//     if (!token) {
//         return res.json({ success: false, message: 'Not Authorized Login Again' })
//     }

//     try {

//         const token_decode = jwt.verify(token, process.env.JWT_SECRET)
//         req.body.userId = token_decode.id
//         req.body.role = token_decode.role; 
        
//         next()

//     } catch (error) {
//         console.log(error)
//         res.json({ success: false, message: error.message })
//     }

// }

// export default authUser
import jwt from 'jsonwebtoken';

const authUser = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    // Check if the Authorization header exists
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({
        success: false,
        message: 'Not Authorized. Please login again.',
      });
    }

    // Extract the token from the Authorization header
    const token = authHeader.split(' ')[1];

    // Verify the token
    const tokenDecode = jwt.verify(token, process.env.JWT_SECRET);

    // Attach user information to the request object
    req.user = {
      id: tokenDecode.id,
      role: tokenDecode.role,
      vendorId: tokenDecode.vendorId, // Ensure vendorId is part of the token payload
    };
    console.log("ROLE IS",tokenDecode.user.role)
    console.log("Vendor Id IS",tokenDecode.user.vendorId)


    next();
  } catch (error) {
    console.error('Authentication error:', error.message);
    res.status(401).json({
      success: false,
      message: 'Invalid or expired token. Please login again.',
    });
  }
};

export default authUser;
