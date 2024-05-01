import jwt from "jsonwebtoken";

const generateTokenAndSetCookie = (userId, res) =>{
    // HERE JWT.SIGN WILL CREATE A TOKEN I.E. JWT TOKEN HERE IT WILL TAKE PAYLOAD AND SCRREATORPRIVATEKEY AND HERE PAYLOAD IS USERID AND SCERT KEY IS PROCESS.ENV.JWT_SECRET
    const token = jwt.sign({userId}, process.env.JWT_SECRET,{
        expiresIn:'15d'
    })

    // HERE WE ARE SAVING TOKEN IN THE JWT KEY AND ALSO PROVIDING SOME OPTIONS
    res.cookie("jwt",token,{
        maxAge: 15*24*60*60*1000,
        httpOnly:true, //prevents XSS attacks cross site scripting attacks
        sameSite:"strict", // CSRF attacks cross site forgery attacks
        secure: process.env.NODE_ENV !== "development"
    })
}

export default generateTokenAndSetCookie;