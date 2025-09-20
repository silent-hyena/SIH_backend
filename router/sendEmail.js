
import express from "express"
import sgMail from "@sendgrid/mail"
import dotenv from "dotenv";

import verifyLogin from "../middleware/authenticate.js";

dotenv.config();
const router = express.Router()
sgMail.setApiKey(process.env.SENDGRID_KEY)



router.post("/sendmail",verifyLogin, async (req, res) => {
    
    
    
    const { emailSub = null, emailBody = null,  recipients= []} = req.body || null;
    
    try {

        const msg = {
            to:  recipients || ['ayushpanwar3134@gmail.com'], 
            from: {
                name: "SMS",
                email: 'ayushpanwar00007@gmail.com'
            },
            
            subject: emailSub || 'Sending with SendGrid is Fun',
            text: emailBody || 'and easy to do anywhere, even with Node.js',
            html: emailBody
                ? `<strong>${emailBody}</strong>`
                : '<strong>and easy to do anywhere, even with Node.js</strong>'

        }

        const response = await sgMail.send(msg)
        console.log(response);
        res.send({message: "Email sent."})
    }
    catch (e) {
        console.log(e.message)
        res.send({alert: e.message});
    }
})

export default router
