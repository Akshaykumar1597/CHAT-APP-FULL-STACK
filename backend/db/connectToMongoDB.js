import mongoose from "mongoose";

// const uri = "mongodb+srv://9590121315akki:qwerty@123@cluster0.whaef4q.mongodb.net/?retryWrites=true&w=majority";


const connectToMongoDB = async ()=>{
    try {
        await mongoose.connect(process.env.MONGO_DB_URI);
        console.log("Connected to mongoDB");
    } catch (error) {
        console.log("Error connecting to MongoDB", error.mesage)
    }
}




export default connectToMongoDB;



