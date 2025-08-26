import express from "express"
import dotenv from "dotenv"
import cors from "cors"
import cookieParser from "cookie-parser"
import http from "http"
import AuthRouter from './routes/Auth.js'
import ProductRouter from './routes/Product.js'

dotenv.config({
    path : "./.env"
})

const app = express()
app.use(cors({
    origin : "http://localhost:5173",
    credentials : true,
    methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
}))

app.use(cookieParser())
app.use(express.json())

const httpServer = http.createServer(app);

app.use("/api/v1/auth", AuthRouter);
app.use("/api/v1/products", ProductRouter);

app.get("/",(req,res)=>{
    res.send("Hello World");
})

export{httpServer}