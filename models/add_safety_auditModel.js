var mongoose = require('mongoose');
const Schema = mongoose.Schema; 
var timestamps = require('mongoose-timestamp');
var add_safety_auditSchema = new mongoose.Schema({  


  

  job_id :  String,
  SA01:  String,
  SA02:  String,
  SA03:  String,
  SA04:  String,
  SA05:  String,
  SA06:  String,
  SA07:  String,
  SA08:  String,
  SA09:  String,
  SA10:  String,
  SA11:  String,
  SA12:  String,
  SA13:  String,
  SA14:  String,
  SA15:  String,
  SA16:  String,
  SA17:  String,
  SA18:  String,
  SA19:  String,
  SA20:  String,
  SA21:  String,
  SA22:  String,
  SA23:  String,
  SA24:  String,
  SA25:  String,
  SA26:  String,
  SA27:  String,
  SA28:  String,
  SA29:  String,
  SA30:  String,
  SA31:  String,
  SA32:  String,
  SA33:  String,
  SA34:  String,
  SA35:  String,
  SA36:  String,
  SA37:  String,
  SA38:  String,
  SA39:  String,
  SA40:  String,
  remarks:  String,
  Total_marks:  String,
  submitted_by_num:  String,
  submitted_by_name:  String,
  submitted_by_emp_code:  String,
  submitted_by_on:  String,
  observation_a:  String,
  observation_b:  String,
  observation_c:  String,
  observation_d:  String,
  general_comment:  String,
  engineer_name:  String,
  conducted_on:  String,
  engineer_signature:  String,
  delete_status : Boolean

  
});
mongoose.model('add_safety_audit',add_safety_auditSchema);
add_safety_auditSchema.plugin(timestamps);
module.exports = mongoose.model('add_safety_audit');