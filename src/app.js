import express from "express";
import { config  } from "dotenv"; 
import bodyParser from "body-parser";
import userRoutes from "./routes/user.routes.js";
import mongoose from "mongoose";

config()

const app = express()
app.use(bodyParser.json())

mongoose.connect(process.env.MONGO_URL, {dbName: process.env.MONGO_DB_NAME})

app.use('/users', userRoutes)

const port = process.env.PORT || 3000

app.listen(port, () =>{
    console.log("todo listo")
})