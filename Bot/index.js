const express = require("express");
const axios = require("axios");
require("dotenv").config();

const app = express();
const PORT = 3001; // Your intermediate server port

// Telegram Bot Configuration
const botToken = process.env.BOTTOKEN;
const groupChatId = process.env.CHATID; // Negative number for group

// Middleware to parse JSON
app.use(express.json());

// Route to trigger Telegram notification
app.post("/notify-quiz", async (req, res) => {
    const { quizTitle, quizLink , messageText} = req.body; // Expecting quizTitle and quizLink in request body
    console.log(req.body)
    if (!quizTitle || !quizLink) {
        return res.status(400).send("quizTitle and quizLink are required!");
    }

    try {
        const url = `https://api.telegram.org/bot${botToken}/sendMessage`;

        const payload = {
            chat_id: groupChatId,
            text: messageText,
            parse_mode: "Markdown",
            reply_markup: {
                inline_keyboard: [
                    [
                        {
                            text: "📝 Start Quiz",
                            url: quizLink, // Redirects to the quiz platform
                        },
                    ],
                ],
            },
        };

        // Send the notification
        await axios.post(url, payload);
        res.status(200).send("Quiz notification sent successfully!");
    } catch (error) {
        console.error("Error sending notification:", error.response?.data || error.message);
        res.status(500).send("Failed to send quiz notification.");
    }
});

app.listen(PORT, () => {
    console.log(`Notification server running on port ${PORT}`);
});
