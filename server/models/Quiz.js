const mongoose = require('mongoose');

const quizSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        required:false,
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
    lists:[{
        type:[mongoose.Schema.Types.ObjectId],
        ref:'Eligiblitylist'
    }],
    attemptCounts: {
        type: Map,
        of: Number, // Map where key is userID and value is attempt count
        default: {}
    },
    year: {
        type: [Number], // An array of numbers
        default: []     // Default should be an empty array
    },
    endtime :{
      type: Date,
        
    },
    department: {
        type: Array,
        
        default: []
    }
}, { timestamps: true });

const Quiz = mongoose.model('Quiz', quizSchema);

module.exports = Quiz;
