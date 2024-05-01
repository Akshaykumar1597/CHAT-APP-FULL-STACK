import express from "express";
import { login, logout, signUp } from "../controllers/auth.controllers.js";

const router = express.Router();

// HERE THE ROUTES ARE TAKEN INTO THERE RESPECTIVE CONTROLLERS METHODS/FUNCTIONS
router.post("/signup", signUp);
router.post("/login", login);
router.post("/logout", logout);


export default router;