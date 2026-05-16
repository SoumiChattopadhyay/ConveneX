const mongoose = require('mongoose');

mongoose.connect("mongodb://localhost:27017/convenex")
.then(()=>{
    console.log("Database connection establised.")
})
.catch((err)=>{
    console.log(err);
});