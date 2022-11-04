var mongoose = require('mongoose');
const Schema = mongoose.Schema; 
var service_managementSchema = new mongoose.Schema({  

  service_name :  String,
  service_created_at : String,
  service_update_at : String,
  service_created_by : String,
  service_updated_by : String,


});
mongoose.model('service_management', service_managementSchema);
module.exports = mongoose.model('service_management');