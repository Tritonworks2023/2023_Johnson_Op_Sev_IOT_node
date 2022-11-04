var mongoose = require('mongoose');

const Schema = mongoose.Schema; 

var iot_branch_codeSchema = new mongoose.Schema({  

  branch_code:  String,
  branch_name : String,
  branch_lat : String,
  branch_long : String,
  created_by : String,
  created_at : String,
  updated_at: String
});
mongoose.model('iot_branch_code', iot_branch_codeSchema);

module.exports = mongoose.model('iot_branch_code');
