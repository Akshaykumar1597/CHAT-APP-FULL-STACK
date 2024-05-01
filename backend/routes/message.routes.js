import express from "express";
import { getMessages, sendMessage } from "../controllers/message.controllers.js";
import protectRoute from "../middlewares/protectRoute.js";

const router = express.Router();

// DEFINING ROUTES WITH PROTECTION MIDDLEWARE 
router.get("/:id",protectRoute, getMessages); 
router.post("/send/:id",protectRoute, sendMessage);  //this protectRoute is a middleware where it provides user info ligon status 

export default router;
