var mongoose = require('mongoose');
var timestamps = require('mongoose-timestamp');
const Schema = mongoose.Schema; 

var service_tab_submit_data_brSchema = new mongoose.Schema({  

   
  user_mobile_number : String,
  upload_status : String,
  submitted_date_sys : Date,
  serv_type : String,
  job_id : String,
  comp_id : String,
  data : Array,


  
});
mongoose.model('service_tab_submit_data_br', service_tab_submit_data_brSchema);
service_tab_submit_data_brSchema.plugin(timestamps);
module.exports = mongoose.model('service_tab_submit_data_br');
