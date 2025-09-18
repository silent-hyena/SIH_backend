// routes/formsubmit.js
import express from "express";
import sql from "../db.js"; 

const router = express.Router();

router.post("/", async (req, res) => {
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

    const result = await pool.query(
      `INSERT INTO addmissions (
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
        $1, $2, $3, $4, $5, $6, $7, $8,
        $9, $10, $11, $12, $13, $14, $15, $16, $17, $18
      ) RETURNING *`,
      [
        applicationNumber,
        name,
        fatherName,
        motherName,
        dob,
        gender,
        category,
        pwd === "Yes", 
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
      ]
    );

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

export default router;
