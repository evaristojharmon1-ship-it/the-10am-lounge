const express = require('express');
const nodemailer = require('nodemailer');
const cors = require('cors');

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());

// Configure Nodemailer with your email credentials
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_USER || 'evaristojharmon1@gmail.com',
        pass: process.env.EMAIL_PASS || 'qbnwdtxpunbyfgrn'
    }
});

app.post('/submit-feedback', (req, res) => {
    const data = req.body;

    // Mapping ng mga short codes patungo sa aktwal na mga tanong
    const questionLabels = {
        fullname: "Full Name",
        email: "Email Address", // <--- Idinagdag natin ito rito
        
        // Venue (V1 - V4)
        v1: "Venue: The venue was clean and well maintained",
        v2: "Venue: The event layout allowed guests to move and socialize comfortably",
        v3: "Venue: The dining area was spacious and well-organized",
        v4: "Venue: The overall aesthetic of the venue was visually appealing",

        // Service (S1 - S5)
        s1: "Service: The staff are warm and welcoming",
        s2: "Service: The staff were courteous and respectful throughout the event",
        s3: "Service: My food and drinks were served within a reasonable amount of time",
        s4: "Service: The staff were attentive to my needs during the event",
        s5: "Service: The staff handled my requests and/or concerns professionally",

        // Food (F1 - F5)
        f1: "Food: My food was served fresh and at the appropriate temperature",
        f2: "Food: The taste and flavor of the food met my expectations",
        f3: "Food: The food was presented attractively and was appetizing",
        f4: "Food: The menu offered a good variety of food and beverage options",
        f5: "Food: The quality of the food was worth its price",

        // Overall dining experience (O1 - O5)
        o1: "Overall: I am satisfied with my overall dining experience at The 10AM Lounge",
        o2: "Overall: The Hain Manila team exceeded my expectations",
        o3: "Overall: I received good value for the money I spent",
        o4: "Overall: My overall experience was pleasant from arrival to departure",
        o5: "Overall: I would recommend The 10AM Lounge to my friends, family, and/or colleagues",

        // Text inputs
        enjoy: "What did you enjoy the most?",
        comments: "Comments / Suggestions"
    };

    let emailContent = "NEW FEEDBACK RECEIVED:\n\n";
    
    for (let key in data) {
        let label = questionLabels[key] || key.toUpperCase();
        emailContent += `${label}: ${data[key]}\n`;
    }

    const mailOptions = {
        from: process.env.EMAIL_USER || 'evaristojharmon1@gmail.com',
        to: 'betinamarielle.mendoza@benilde.edu.ph',
        subject: 'New Feedback: The 10 AM Lounge',
        replyTo: data.email, // <--- Kapag ni-click ni Betina ang Reply, direkta sa sumagot mapupunta
        text: emailContent
    };

    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            console.log("Error details:", error);
            return res.status(500).send("Error sending email.");
        }
        console.log("Email sent successfully: " + info.response);
        res.send("Feedback sent successfully!");
    });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});