import express from "express";
import sql from "../db.js";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

async function verifyLogin(req, res, next) {
    try {
        const token = req.cookies.jwt;
        if (!token) {
            return res.status(401).json({ alert: "Not authenticated. Please login." });
        }

        const userPayload = jwt.verify(token, process.env.JWT_SECRET);

        const response = await sql`
            SELECT * FROM staff
            WHERE uid = ${userPayload.id}
        `;

        if (!response.length) {
            return res.status(401).json({ alert: "Cannot verify your identity. Try to login again." });
        }

        req.user = response[0]; // attach user to request
        next();
    } catch (err) {
        res.status(401).json({ alert: "Invalid or expired token. Please login again." });
    }
}

export default verifyLogin;
