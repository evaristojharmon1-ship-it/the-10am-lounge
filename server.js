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

    // Ayusin natin ang pag-grupo at pag-format ng email ayon sa gusto ng client
    let emailContent = `NEW FEEDBACK RECEIVED:\n\n`;
    emailContent += `Full Name: ${data.fullName || 'N/A'}\n`;
    emailContent += `Email Address: ${data.email || 'N/A'}\n\n`;
    emailContent += `----------------------------------------\n\n`;

    // I-define ang mga kategorya at ang kanilang mga tanong/keys sa form
    // Palitan mo ang mga pangalan ng key sa ibaba kung ano ang ginamit mo sa HTML name attributes mo
    const categories = {
        "Venue": [
            { key: "venue1", label: "1. The venue was clean and well maintained." },
            { key: "venue2", label: "2. The event layout allowed guests to move and socialize comfortably." },
            { key: "venue3", label: "3. The dining area was spacious and well-organized." },
            { key: "venue4", label: "4. The overall aesthetic of the venue was visually appealing." }
        ],
        "Service": [
            { key: "service1", label: "1. The staff are warm and welcoming." },
            { key: "service2", label: "2. The staff were courteous and respectful throughout the event." },
            { key: "service3", label: "3. My food and drinks were served within a reasonable amount of time." },
            { key: "service4", label: "4. The staff were attentive to my needs during the event." },
            { key: "service5", label: "5. The staff handled my requests and/or concerns professionally." }
        ],
        "Food": [
            { key: "food1", label: "1. My food was served fresh and at the appropriate temperature." },
            { key: "food2", label: "2. The taste and flavor of the food met my expectations." },
            { key: "food3", label: "3. The food was presented attractively and was appetizing." },
            { key: "food4", label: "4. The menu offered a good variety of food and beverage options." },
            { key: "food5", label: "5. The quality of the food was worth its price." }
        ],
        "Overall Experience": [
            { key: "overall1", label: "1. I am satisfied with my overall dining experience at The 10AM Lounge." },
            { key: "overall2", label: "2. The Hain Manila team exceeded my expectations." },
            { key: "overall3", label: "3. I received good value for the money I spent." },
            { key: "overall4", label: "4. My overall experience was pleasant from start to finish." }
        ]
    };

    // Loop para mabuo ang malinis na pormat bawat category
    for (const [categoryName, questions] of Object.entries(categories)) {
        emailContent += `*${categoryName}*\n`;
        questions.forEach((q) => {
            const ratingValue = data[q.key] || 'No rating';
            emailContent += `${q.label}\nRating: ${ratingValue}\n\n`;
        });
        emailContent += `----------------------------------------\n\n`;
    }

    const mailOptions = {
        from: process.env.EMAIL_USER || 'evaristojharmon1@gmail.com',
        to: 'betinamarielle.mendoza@benilde.edu.ph',
        subject: 'New Feedback: The 10 AM Lounge',
        replyTo: data.email,
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
