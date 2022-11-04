var mongoose = require('mongoose');

const Schema = mongoose.Schema; 

var temp_data_storeSchema = new mongoose.Schema({  
  job_id:  String,
  group_id : String,
  user_id : String,
  datas : Array,
});
mongoose.model('temp_data_store', temp_data_storeSchema);

module.exports = mongoose.model('temp_data_store');
