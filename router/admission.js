import express, { response } from "express";
import sql from "../db.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

const router = express.Router();

router.post("/formsubmit", async (req, res)=>{
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
      )`

    res.status(201).json({ message: "Form submitted successfully!", data: result[0] });
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

router.post("/checkstatus",async(req,res)=>{
    try{
        const {applicationNumber= ""} = req.body;

        const response = await sql`SELECT * FROM admissions
                                WHERE  application_number =${applicationNumber}`
        if (!response.length) {
            return res.json({ alert: "No record found for the given application number." });
        }
        res.json({message:"success",formdata: response[0]})
    }
    catch(err){
        res.json({aler: "sorry cant find any record."});
    }
})

export default router;
