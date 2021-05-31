const mongoose = require("mongoose");
const testSchema = new mongoose.Schema({
  name:{type:String, enum: ['first_round', 'second_round' , 'third_round']  },
  score:{type:Number},
}, { timestamps : true});

module.exports = mongoose.model('Test', testSchema);