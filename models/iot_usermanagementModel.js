var mongoose = require('mongoose');
const Schema = mongoose.Schema; 
var iot_user_managementSchema = new mongoose.Schema({  
  
  name :  String,
  emp_no : String,
  agent_code : String,
  branch_code : Array,
  password : String,
  email_id : String,
  phone_number : String,
  last_login_date :  String,
  active_status : String,


});
mongoose.model('iot_user_management', iot_user_managementSchema);

module.exports = mongoose.model('iot_user_management');