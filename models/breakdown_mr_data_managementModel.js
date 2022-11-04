var mongoose = require('mongoose');

const Schema = mongoose.Schema; 

var breakdown_mr_data_managementSchema = new mongoose.Schema({  


  JLS_SCHM_COMPNO :  String,
  JLS_SCHM_JOBNO :  String,
  JLS_SCHM_SERTYPE : String,
  JLS_SCHM_PREP_DATE : String,
  JLS_SCHM_VAN_ID :  String,
  JLS_SCHM_STATUS : String,
  JLS_SCHM_ORCL_STATUS :  String,
  JLS_SCHM_ENGR_PHONE :  String,
  JLS_SCHM_ENGR_FLAG :  String,
  JLS_SCHM_ERRDESC :  String,
  JLS_SCHM_AGENT_NAME :  String,
  JLS_SCHM_CUSTOMER_NAME :  String,
  JLS_SCHM_DWNFLAG :  String,
  JOB_STATUS : String, 
  JOB_VIEW_STATUS : String, 
  LAST_UPDATED_TIME : String, 
  JOB_START_TIME : String,
  JOB_END_TIME : String, 
  SMU_SCH_COMPDT : String, 

});


mongoose.model('breakdown_mr_data_management', breakdown_mr_data_managementSchema);
module.exports = mongoose.model('breakdown_mr_data_management');
