const mongoose = require("mongoose")
require("dotenv").config();

exports.connectToDB = () => {
    const uri = process.env.DB_URL// Explicitly use IPv4 address
    const dbName = 'testinggg';
    mongoose.connect(`${uri}/${dbName}`)
    .then(() => {
        console.log("Database connection successfull")
    })
    .catch((e) => {
        console.log("Error occurred while connecting to DB")
        console.error(e);
        process.exit(1);
    })
} 