const mongoose=require("mongoose")
mongoose.connect("mongodb+srv://jerseyloveu:jerseyloveu@cluster0.ptauw.mongodb.net/KpopReact")
.then(()=>{
    console.log("mongodb connected"); 
})
.catch(()=>{
    console.log("failed");
})

const newSchema = new mongoose.Schema({
    username:{
        type:String,
        required:true
    },
    password:{
        type:String,
        required:true
    }
})

const collection = mongoose.model("admins", newSchema)
module.exports=collection