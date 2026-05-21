const mongoose = require("mongoose");

const formSchema = new mongoose.Schema({
  eventId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Event",
  },

  fields: [
    {
      fieldId: String,

      label: String,

      type: {
        type:String,
        enum:['Text','Textarea','Email','Number','Select']
      },
      required:Boolean,
      options: [String],//if field type is select
    },
  ],
});

module.exports = mongoose.model("Form", formSchema);