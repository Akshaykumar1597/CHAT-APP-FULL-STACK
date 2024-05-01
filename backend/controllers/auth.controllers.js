import bcrypt from "bcryptjs";
import User from "../models/user.model.js";
import generateTokenAndSetCookie from "../utils/generateToken.js";

// SIGNUP METHODS
export const signUp = async (req, res) => {
  try {

    // GET ALL PARAMETERS FROM REQ BODY
    const { fullName, username, password, confirmPassword, gender } = req.body;

    // PASSWORD AND CONFIRM MATCH VALIDATION 
    if (password !== confirmPassword) {
      return res.status(400).json({ error: "Passwords does not match" });
    }

    //HERE USERS USERNAME IS CHECKING WITH REGISTERED USERS WITH USERNAME
    const user = await User.findOne({ username });

    if (user) {
      return res.status(400).json({ error: "Username already exists" });
    }

    //HASH PASSWROD HERE
    const salt = await bcrypt.genSalt(10);
    const hashPassword = await bcrypt.hash(password, salt);

    // DEFAULT PROFILE PIC AVATARS
    const boyProfilePic = `https://avatar.iran.liara.run/public/boy?username=${username}`;
    const girlProfilePic = `https://avatar.iran.liara.run/public/girl?username=${username}`;

    // CREATING NEW IF ALL CASES ARE PASSED WITH PASSWORD HASHED
    const newUser = new User({
      fullName,
      username,
      password: hashPassword,
      gender,
      profilePic: gender === "male" ? boyProfilePic : girlProfilePic,
    });

    // HERE WITH NEW USER WE GENERATING JWT TOKEN AND SETTING COOKIE WITH USDERID AND RES
    if (newUser) {
      //Generate JWT here
      generateTokenAndSetCookie(newUser._id, res);
      await newUser.save();

      res.status(201).json({
        _id: newUser._id,
        fullName: newUser.fullName,
        username: newUser.username,
        profilePic: newUser.profilePic,
      });
    } else {
      res.status(400).json({ error: "Invalid user data" });
    }
  } catch (error) {
    console.log("Error in signup controller", error.message);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

// LOGIN METHODS
export const login = async (req, res) => {
  try {

    // STORING DATA FROM REQ BODY
    const { username, password } = req.body;

    // MATCHING USERNAME AND PASSWORD WITH BCRYPT
    const user = await User.findOne({ username });
    const isPasswordCorrect = await bcrypt.compare(
      password,
      user?.password || ""
    );
    if (!user || !isPasswordCorrect) {
      return res.status(400).json({ error: "Invalid username or password" });
    }

    // IF USER IS AUTHENTICATED THEN GENERATING TOKEN WITH SECRATE KEY AND SETTING COOKIE
    generateTokenAndSetCookie(user._id, res);

    // SEND DATA TO USER
    res.status(201).json({
      _id: user._id,
      fullName: user.fullName,
      username: user.username,
      profilePic: user.profilePic,
    });
  } catch (error) {
    console.log("Error in login controller", error.message);
    res.status(500).json({ error: "Internal Server Error" });
  }
  // console.log("login user");
};

// LOGOUT METHODS
export const logout = (req, res) => {
  try {
    res.cookie("jwt", "", { maxAge: 0 });
    res.status(200).json({ message: "Logged out succcessfully" });
  } catch (error) {
    console.log("Error in logout controller", error.message);
    res.status(500).json({ error: "Internal Server Error" });
  }
};
