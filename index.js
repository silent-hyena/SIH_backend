import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import cookieParser from "cookie-parser";
// import sql from "./db.js";


import paymentRoute from "./router/makepayment.js"
import EmailRoute from "./router/sendEmail.js"
import staffRoute from "./router/staff.js"
import studentRoute from "./router/student.js"
import admissionRoute from "./router/admission.js"


dotenv.config()
const app= express()




app.use(cookieParser())


const allowedOrigins = [
  "http://localhost:5173",        
  "https://collegeerp442.vercel.app"  
];

app.use(cors({
  origin: allowedOrigins,
  credentials: true, 
}));





app.use(express.json())
app.use(express.urlencoded({ extended: true }));


app.use("/makepayment",paymentRoute)
app.use("/emailservice",EmailRoute)
app.use("/staff",staffRoute)
app.use("/student",studentRoute)
app.use("/admission",admissionRoute)






app.get("/",(req,res)=>{
    res.send("<h1>Welcome to the server</h1>")
})
app.listen(process.env.PORT,()=>{
    console.log("server running")
})