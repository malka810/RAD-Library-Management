import express ,{Request,Response} from "express"
import dotenv from "dotenv"
import {connectDB} from "./db/mongo";
import rootRouter from "./routes";

import cors from "cors"
import cookieParser from "cookie-parser";
import { errorHandler } from "./middleware/ErrorHandler";

dotenv.config() //read dotenv file

//create express app
const app = express()

//handle CORS

const corsOptions = {
    origin: process.env.CLIENT_ORIGIN,
    credentials: true,
    methods:"GET,POST,PUT,PATCH,DELETE,OPTIONS",
    allowedHeader:["Content-Type","Authorization"],
}

app.use(cors(corsOptions))
app.use(cookieParser())
app.use(express.json())


//set port
const  PORT = process.env.PORT


app.use("/api",rootRouter) //set to use rootRouter in express app
app.use(errorHandler)


app.get("/" ,(req: Request,res:Response) =>{
    res.send("Hello World!")
})

connectDB().then(()=>{
    app.listen(PORT, () => {
        console.log(`Server is running on http://localhost:${PORT}`);
    })
})