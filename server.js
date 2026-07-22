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

    // Tugma na sa HTML: 'fullname' at 'email'
    const fullName = data.fullname || data.fullName || 'N/A';
    const emailAddress = data.email || 'N/A';

    let emailContent = `NEW FEEDBACK RECEIVED:\n\n`;
    emailContent += `Full Name: ${fullName}\n`;
    emailContent += `Email Address: ${emailAddress}\n\n`;
    emailContent += `----------------------------------------\n\n`;

    // Tugma na sa mga keys (v1-v4, s1-s5, f1-f5, o1-o5) na nasa HTML mo
    const categories = {
        "Venue": [
            { key: "v1", label: "1. The venue was clean and well maintained" },
            { key: "v2", label: "2. The event layout allowed guests to move and socialize comfortably" },
            { key: "v3", label: "3. The dining area was spacious and well-organized" },
            { key: "v4", label: "4. The overall aesthetic of the venue was visually appealling" }
        ],
        "Service": [
            { key: "s1", label: "1. The staff are warm and welcoming" },
            { key: "s2", label: "2. The staff were courteous and respectful throughout the event" },
            { key: "s3", label: "3. My food and drinks were served within a reasonable amount of time" },
            { key: "s4", label: "4. The staff were attentive to my needs during the event" },
            { key: "s5", label: "5. The staff handled my requests and/or concerns professionally" }
        ],
        "Food": [
            { key: "f1", label: "1. My food was served fresh and at the appropriate temperature" },
            { key: "f2", label: "2. The taste and flavor of the food met my expectations" },
            { key: "f3", label: "3. The food was presented attractively and was appetizing" },
            { key: "f4", label: "4. The menu offered a good variety of food and beverage options" },
            { key: "f5", label: "5. The quality of the food was worth its price" }
        ],
        "Overall Experience": [
            { key: "o1", label: "1. I am satisfied with my overall dining experience at The 10AM Lounge" },
            { key: "o2", label: "2. The Hain Manila team exceeded my expectations" },
            { key: "o3", label: "3. I received good value for the money I spent" },
            { key: "o4", label: "4. My overall experience was pleasant from arrival to departure" },
            { key: "o5", label: "5. I would recommend The 10AM Lounge to my friends, family, and/or colleagues" }
        ]
    };

    for (const [categoryName, questions] of Object.entries(categories)) {
        emailContent += `*${categoryName}*\n`;
        questions.forEach((q) => {
            const ratingValue = data[q.key] || 'No rating';
            emailContent += `${q.label}\nRating: ${ratingValue}\n\n`;
        });
        emailContent += `----------------------------------------\n\n`;
    }

    // Idagdag din natin ang Comments at Enjoy sa email kung may laman
    if (data.enjoy) {
        emailContent += `What did you enjoy most:\n${data.enjoy}\n\n`;
    }
    if (data.comments) {
        emailContent += `Comments/Suggestions:\n${data.comments}\n\n`;
    }

    const mailOptions = {
        from: process.env.EMAIL_USER || 'evaristojharmon1@gmail.com',
        to: 'betinamarielle.mendoza@benilde.edu.ph',
        subject: 'New Feedback: The 10 AM Lounge',
        replyTo: emailAddress,
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
