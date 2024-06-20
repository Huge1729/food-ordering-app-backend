import express, {Request , Response} from "express";
import cors from "cors";
import "dotenv/config";
import mongoose from "mongoose";
import myUserRoute from "./routes/MyUserRoute";
import myrestaurantRoute from "./routes/MyRestaurantRoute"
import restaurantRoute from "./routes/RestaurantRoute";
import { v2 as cloudinary} from "cloudinary";

// Check the connection of database
mongoose.connect(process.env.MONGODB_CONNECTION_STRING as string)
.then(()=> console.log("Connected to DataBase"));

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});


const app = express();   // create express server 
app.use(express.json()); // like middleware that convert automatically the body into json 
app.use(cors());

// define end point to check Deployment
app.get("/health" , async (req: Request , res:Response)=>{
    res.send({message : "Health OK!!"});
});

// /api/my/user
app.use("/api/my/user", myUserRoute);
app.use("/api/my/restaurant", myrestaurantRoute);
app.use("/api/restaurant", restaurantRoute);


app.listen(7000, () => {
    console.log("Server started on port: 7000");
});

