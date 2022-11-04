var mongoose = require('mongoose');
const Schema = mongoose.Schema; 
var activedetail_managementSchema = new mongoose.Schema({  
  activedetail_name :  String,
  activedetail_created_at : String,
  activedetail_update_at : String,
  activedetail_created_by : String,
  activedetail_updated_by : String,
});
mongoose.model('activedetail_management', activedetail_managementSchema);
module.exports = mongoose.model('activedetail_management');