var mongoose = require('mongoose');
const Schema = mongoose.Schema; 
var service_activitySchema = new mongoose.Schema({  
  service_name :  String,
  service_code :  String,
  date_of_create : String,
  service_status : String,
  service_type : String,
});


mongoose.model('service_activity', service_activitySchema);
module.exports = mongoose.model('service_activity');
