const mongoose = require("mongoose")


const eligiblitylist = new mongoose.Schema({
    listname:{
        type:String,
        required:true,
    },
    users:[{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        
    }],
     createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
},{timestamps:true});

const Eligiblitylist= mongoose.model('eligiblitylist',eligiblitylist)

module.exports= Eligiblitylist;