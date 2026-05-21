const mongoose = require("mongoose");

const registrationSchema = new mongoose.Schema({

   user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
   },

   event: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Event",
      required: true
   },

   answers: [
      {
         fieldName: String,
         value: mongoose.Schema.Types.Mixed//This subfield(value) can store ANY type of data.
      }
   ],

   status: {
      type: String,
      enum: ["registered", "attended", "cancelled"],
      default: "registered"
   }

}, { timestamps: true });

registrationSchema.index(//creates combined index 1 of user and event and prevents same user to register for same event twice(unique:true)
    {user:1,event:1},
    {unique:true}
);

module.exports = new mongoose.model('Registration',registrationSchema);