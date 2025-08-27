import express from "express"
import dotenv from "dotenv"
import cors from "cors"
import cookieParser from "cookie-parser"
import http from "http"
import AuthRouter from './routes/Auth.js'
import ProductRouter from './routes/Product.js'
import CartRouter from './routes/Cart.js'
import { Server } from "socket.io"

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
app.use(express.urlencoded({ extended: true }));

const httpServer = http.createServer(app);

app.use("/api/v1/auth", AuthRouter);
app.use("/api/v1/products", ProductRouter);
app.use("/api/v1/cart", CartRouter);
app.get("/",(req,res)=>{
    res.send("Hello World");
})

const io = new Server(httpServer, {
    cors: {
        origin: "http://localhost:5173",
        credentials: true
    }
});

// used to store online users
const userSocketMap = {}; // {userId: socketId}


io.on("connection", (socket) => {
  console.log("A user connected", socket.id);

  const userId = socket.handshake.query.userId;
  console.log('userid' , userId);
  if (userId) userSocketMap[userId] = socket.id;

  // io.emit() is used to send events to all the connected clients
  io.emit("getOnlineUsers", Object.keys(userSocketMap));

  socket.on("disconnect", () => {
    console.log("A user disconnected", socket.id);
    delete userSocketMap[userId];
    io.emit("getOnlineUsers", Object.keys(userSocketMap));
  });
});

export{httpServer}