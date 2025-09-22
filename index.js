import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import cookieParser from "cookie-parser";
import sql from "./db.js";


import paymentRoute from "./router/makepayment.js"
import EmailRoute from "./router/sendEmail.js"
import staffRoute from "./router/staff.js"
import studentRoute from "./router/student.js"
import admissionRoute from "./router/admission.js"


dotenv.config()
const app = express()
app.set('trust proxy', 1);




app.use(cookieParser())


const allowedOrigins = [
  "http://localhost:5173",
  "https://collegeerp442.vercel.app"
];

app.use(cors({
  origin: allowedOrigins,
  credentials: true,
  optionsSuccessStatus: 200
}));





app.use(express.json())
app.use(express.urlencoded({ extended: true }));


app.use("/makepayment", paymentRoute)
app.use("/emailservice", EmailRoute)
app.use("/staff", staffRoute)
app.use("/student", studentRoute)
app.use("/admission", admissionRoute)


app.get("/tables", async (req, res) => {
  try {
    const columns = await sql`
     SELECT 
    table_schema,
    table_name,
    json_agg(column_name ORDER BY ordinal_position) AS columns
FROM information_schema.columns
WHERE table_schema = 'public'
GROUP BY table_schema, table_name
ORDER BY table_schema, table_name;

    `;
    res.json(columns);
  } catch (err) {
    console.error(err);
    res.status(500).send("Error fetching columns");
  }
})




app.get("/", (req, res) => {
  res.send("<h1>Welcome to the server</h1>")
})
app.listen(process.env.PORT, () => {
  console.log("server running")
})