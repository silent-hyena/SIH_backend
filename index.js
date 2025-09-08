import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import paymentRoute from "./router/makepayment.js"
dotenv.config()
const app= express()


const allowedOrigins = [
  "http://localhost:5173",        // local dev
  "https://collegeerp442.vercel.app"  // deployed frontend
];

app.use(cors({
  origin: allowedOrigins,
  methods: ["GET", "POST", "PUT", "DELETE"],
  credentials: true
}));




app.use(express.json())


app.use("/makepayment",paymentRoute)

app.post("/formsubmit",(req,res)=>{
    console.log(req.body)
    res.send({message: "form submitted"})
})

app.get("/",(req,res)=>{
    res.send("<h1>Welcome to the server</h1>")
})
app.listen(process.env.PORT,()=>{
    console.log("server running")
})