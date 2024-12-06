const mongoose = require('mongoose');

const quizSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        required: true,
    },
    instructions: {
        type: String,
        required: false,
    },
    timer: {
        type: Number, // in minutes
        required: true,
    },
    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    maxAttempts: {
        type: Number,
        default: 1,
    },
    attemptedUsers: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
       
    }],
}, { timestamps: true });

const Quiz = mongoose.model('Quiz', quizSchema);

module.exports = Quiz;
