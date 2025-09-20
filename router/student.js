import express from "express";
import sql from "../db.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config()

const router = express.Router()



router.post("/portallogin", async (req, res) => {

    const { email = "", password = "" } = req.body;



    try {
        const response = await sql`
      SELECT uid, college_email, password_hash
      FROM student
      WHERE college_email = ${email}
    `;

        if (!response.length) {
            return res.json({ alert: "email id is incorrect." });
        }

        const user = response[0];
        const match = await bcrypt.compare(password, user.password_hash);

        if (!match) {
            return res.json({ alert: "password is incorrect. please try again." });
        }

        // issue JWT token
        const token = jwt.sign(
            { id: user.uid, username: email },
            process.env.JWT_SECRET,
            { expiresIn: "1h" }
        );

        res.cookie("jwt", token, {
            httpOnly: true,
            secure: true,
            maxAge: 1000 * 60 * 60,
            sameSite: "none"
        });


        res.json({ status: "success" });
    } catch (err) {
        res.status(500).json({ alert: err.message });
    }
});

export default router;