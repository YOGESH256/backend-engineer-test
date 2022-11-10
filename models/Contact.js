const mongoose = require("mongoose");
const Schema = require("mongoose").Schema;

const ContactSchema = new mongoose.Schema(
  {


    username : {
    type: String,
    require:true,
    min: 3,
    max:20,
    unique: true
  },

  contactNo :{
    type: String,
    require:true,
    validate: {
           validator: function(val) {
               return val.toString().length === 10
           },
           message: val => `${val.value} has to be 9 digits`
       },
    unique: true

  },

  },
  { timestamps: true }
);






const Contact = mongoose.model("Contact", ContactSchema);
ContactSchema.index( {'$**': 'text'} );

module.exports =  Contact
