import express from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import connectToMongoDB from "./db/connectToMongoDB.js";

import authRoutes from "./routes/auth.routes.js";
import messageRoutes from "./routes/message.routes.js";
import userRoutes from "./routes/user.routes.js";

const app = express();
dotenv.config();

const PORT = process.env.PORT || 5000;

app.get("/", (req, res)=>{
    //root eoute http://localhost:5000/
    res.send("hello world. You are welcome");
});

app.use(express.json()); // to parse the incoming requests with json payloads
app.use(cookieParser()); // to parse the incoming requests with cookies payloads AS WE NEED TO MAINTAIN SESSIONS RECORDS

//DEFINE ROUTES WITH MIDDLEWARES
app.use("/api/auth", authRoutes); //USER SIGN, LOGIN, LOGOUT
app.use("/api/messages", messageRoutes); //SEND AND RECIEVE MESSAGES
app.use("/api/users", userRoutes); //GET ALL USERS INFO

// LISTEN APPLICATON AT SERVER
app.listen(PORT, ()=> {
    connectToMongoDB();
    console.log(`Server running on port ${PORT}`);
});




// app.get("/api/auth/signup", (req,res)=>{
//     res.send("signup route");
// });

// app.get("/api/auth/login", (req,res)=>{
//     console.log("login route");
// });

// app.get("/api/auth/logout", (req,res)=>{
//     console.log("logout route");
// });




