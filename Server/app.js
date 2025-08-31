import express from "express"
import dotenv from "dotenv"
import cors from "cors"
import cookieParser from "cookie-parser"
import http from "http"
import AuthRouter from './routes/Auth.js'
import ProductRouter from './routes/Product.js'
import CartRouter from './routes/Cart.js'
import { Server } from "socket.io"
import OtpRouter from "./routes/Otp.js"
import AddressRouter from "./routes/Address.js"
import OrderRouter from "./routes/Order.js"
import WishlistRouter from "./routes/Wishlist.js"

dotenv.config({
    path : "./.env"
})

const app = express()
app.use(cors({
    origin : ["http://localhost:5173" , "https://ecommerceclient-kbsc.onrender.com"],
    credentials : true,
    methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
}))

app.use(cookieParser())
app.use(express.json())
app.use(express.urlencoded({ extended: true }));

const httpServer = http.createServer(app);

const io = new Server(httpServer, {
    cors: {
        origin: ["http://localhost:5173" , "https://ecommerceclient-kbsc.onrender.com"],
        credentials: true
    }
});

// attach io to req
app.use((req, res, next) => {
  req.io = io;
  next();
});

app.use("/api/v1/auth", AuthRouter);
app.use("/api/v1/products", ProductRouter);
app.use("/api/v1/cart", CartRouter);
app.use("/api/v1/otp", OtpRouter);
app.use("/api/v1/address", AddressRouter);
app.use("/api/v1/orders", OrderRouter);
app.use("/api/v1/wishlist", WishlistRouter);

app.get("/",(req,res)=>{
    res.send("Hello World");
})



// used to store online users
const userSocketMap = {}; // {userId: socketId}


io.on("connection", (socket) => {
  console.log("A user connected", socket.id);

  const userId = socket.handshake.query.userId;
  if (userId) userSocketMap[userId] = socket.id;

  io.emit("getOnlineUsers", Object.keys(userSocketMap));

  // Handle chat messages
  socket.on("sendMessage", ({ senderId, receiverId, message }) => {
    const receiverSocketId = userSocketMap[receiverId];
    if (receiverSocketId) {
      io.to(receiverSocketId).emit("receiveMessage", { senderId, message });
    }
  });

  socket.on("disconnect", () => {
    console.log("A user disconnected", socket.id);
    delete userSocketMap[userId];
    io.emit("getOnlineUsers", Object.keys(userSocketMap));
  });
});


export{httpServer}