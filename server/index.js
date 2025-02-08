// index.js (or wherever your main app logic is)
const express = require("express");
const app = express();
require("dotenv").config();
const client = require("./config/redis"); // Importing the Redis client from the config/redisClient.js file

const routes = require("./routes/routes");
const cookieParser = require("cookie-parser");
const database = require("./config/database");
const cors = require("cors");

const PORT = process.env.PORT || 4000;

// connect to db
database.connectToDB();

app.use(express.json({ limit: '50mb' })); // Adjust limit as needed
app.use(cookieParser());

app.use(
  cors({
    credentials: true,
    maxAge: 14400,
  })
);

app.get("/", (req, res) => {
  res.json({
    success: true,
    message: "Your server is up and running...",
  });
});

app.use("/api/v1/", routes);

// activate server
app.listen(PORT, () => {
  console.log(`App is running on port ${PORT}`);
});
