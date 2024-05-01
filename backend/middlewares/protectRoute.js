import jwt from "jsonwebtoken";
import User from "../models/user.model.js";


// THIS ACTS AS AUTHORIZATION LIKE INTERCEPTOR AS IN ANGULAR | get cookies and to get cookies enable cookie parser
const protectRoute = async (req, res, next) => {
  try {
    // STORE TOKEN FROIM THE REQ JWT COOKIE
    const token = req.cookies.jwt; // HERE IN ORDER TO READ COOKIE WE NEED TO ENABLE COOKIEPARSER IN SERVER.JS FILE
    if (!token) {
      return res.status(401).json({ error: "Unathorized - No Token Provided" });
    }

    //  HERE WE ARE VERIFYING TOKEN SO IN VERIFY METHOD WE NEED TO PUT TOKEN AND SECRET KEY I.E. PROCESS.ENV.JWT_SECRET KEY
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    if (!decoded) {
      return res.status(401).json({ error: "Unathorized - Invalid Token" });
    }

    //  check for User USING userId BZE WHILE SIGNING JWT WE PASSED USERID AND HENCE WE AE VERIFYING BOTH USER ARE SAME OR DIFFERENT AND ALSO WE ARE SAVING USER DATA IN USER VERIABLE AND HENCE USING SELECT METHOD WE ARE REMOVING -PASSWORD
    const user = await User.findById(decoded.userId).select("-password");
    if (!user) {
      return res.status(404).json({ error: "User Not Found" });

    }

    req.user = user;
    next();
  } catch (error) {
    console.log("Error in protectRoute middleware", error.message);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

export default protectRoute;
