var mongoose = require('mongoose');

const Schema = mongoose.Schema; 

var breakdown_data_managementSchema = new mongoose.Schema({  


  SMU_SCH_COMPNO  : String,
  SMU_SCH_SERTYPE  : String,
  bd_details:  String,
  breakdown_service : String,
  customer_acknowledgemnet : String,
  customer_name : String,
  customer_number : String,
  date_of_submission : String,
  feedback_details : String,
  feedback_remark_text : String,
  job_id : String,
  mr_1 : String,
  mr_2 : String,
  mr_3 : String,
  mr_4 : String,
  mr_5 : String,
  mr_6 : String,
  mr_7 : String,
  mr_8 : String,
  mr_9 : String,
  mr_10 : String,
  tech_signature : String,
  eng_singature : String,
  user_mobile_no : String,


});
mongoose.model('breakdown_data_management', breakdown_data_managementSchema);

module.exports = mongoose.model('breakdown_data_management');
