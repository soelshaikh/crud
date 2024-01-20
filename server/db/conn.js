const mongoos = require("mongoose")

const DB = "mongodb+srv://soelshaikht:WRoeiD2cyIIzBSEf@cluster0.yevtpig.mongodb.net/crud?retryWrites=true&w=majority";

// mongoos.set('strictQuery',true);
mongoos.connect(DB,{

}).then(()=>console.log("Database Connected "))
.catch((err)=>{
    console.log(err);
})

