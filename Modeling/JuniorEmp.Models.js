const mongoose = require("mongoose");


const JuniorEmpSchema = mongoose.Schema({
    id:{
        type:String,
        required :true,
    },
    Firstname:{
        type:String,
        required :true,
    },
    Lastname:{
        type:String,
        required :true,
    },
    Email:{
        type:String,
        required :true,
    },
    Address:{
        type:String,
        required :true,
    },
    Contactnumber:{
        type:String,
        required :true,
    },
    CreatedOn:{
        type: Date,
        default:  Date.now(),

    },
    UpdatedOn:{
        type: Date,
        default:  Date.now(),
        
    }
})

module.exports=mongoose.model("JuniorEmp",JuniorEmpSchema);