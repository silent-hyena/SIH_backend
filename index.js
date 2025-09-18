import express from "express";
import dotenv from "dotenv";
import cors from "cors";
// import paymentRoute from "./router/makepayment.js"
import sql from "./db.js";
dotenv.config()
const app= express()
app.use(express.json());
app.use(express.urlencoded({ extended: true }));


const allowedOrigins = [
  "http://localhost:5173",        // local dev
  // "https://collegeerp442.vercel.app"  // deployed frontend
];

app.use(cors({
  origin: allowedOrigins,
  methods: ["GET", "POST", "PUT", "DELETE"],
  credentials: true
}));

app.post("/formsubmit", async (req, res)=>{
  console.log(req.body);
  try {
    const {
      applicationNumber,
      name,
      fatherName,
      motherName,
      dob,
      gender,
      category,
      pwd,
      allIndiaRank,
      categoryRank,
      preference1,
      preference2,
      preference3,
      preference4,
      preference5,
      state,
      email,
      mobileNumber,
    } = req.body;

    const result = await sql
      `INSERT INTO admissions (
        application_number,
        candidate_name,
        fathers_name,
        mothers_name,
        date_of_birth,
        gender,
        category,
        pwd,
        all_india_rank,
        category_rank,
        preference_1,
        preference_2,
        preference_3,
        preference_4,
        preference_5,
        domicile_state,
        email,
        mobile_number
      ) VALUES (
        ${applicationNumber}, ${name}, ${fatherName}, ${motherName}, ${dob}, ${gender}, ${category}, ${pwd === "Yes"},
        ${allIndiaRank}, ${categoryRank}, ${preference1}, ${preference2}, ${preference3}, ${preference4}, ${preference5}, ${state}, ${email}, ${mobileNumber}
      ) RETURNING *`
      // [
      //   applicationNumber,
      //   name,
      //   fatherName,
      //   motherName,
      //   dob,
      //   gender,
      //   category,
      //   pwd === "Yes", 
      //   allIndiaRank,
      //   categoryRank,
      //   preference1,
      //   preference2,
      //   preference3,
      //   preference4,
      //   preference5,
      //   state,
      //   email,
      //   mobileNumber,
      // ]

    res.status(201).json({ message: "Form submitted successfully!", data: result.rows[0] });
  } catch (err) {
    console.error(err.message);
    if (err.code === "23505") {
      // Unique constraint violation (email/application_number)
      res.status(400).json({ message: "Duplicate entry. Email or Application Number already exists." });
    } else {
      res.status(500).json({ message: "Server error. Please try again later." });
    }
  }
});

// app.use("/makepayment",paymentRoute)

// app.post("/formsubmit",(req,res)=>{
//     console.log(req.body)
//     res.send({message: "form submitted"})
// })

app.get("/",(req,res)=>{
    res.send("<h1>Welcome to the server</h1>")
})
app.listen(process.env.PORT,()=>{
    console.log("server running")
})