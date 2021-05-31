const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const canditateSchema = new mongoose.Schema({
  email: {
    type: String,
    unique: true,
    required: true
  },
  name:{
    type:String,
    required:true
  },
  address:{type:String},
  test:{
    type: [{
      type: Schema.Types.ObjectId,
      ref: 'Test'
    }]
  },
  totalscore: {type:Number, default: 0}
}, { timestamps : true});

module.exports = mongoose.model('Candidate', canditateSchema);