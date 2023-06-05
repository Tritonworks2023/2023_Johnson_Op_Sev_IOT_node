var express = require('express');
var router = express.Router();
var bodyParser = require('body-parser');
router.use(bodyParser.urlencoded({ extended: false }));
router.use(bodyParser.json());
var ActivityModel = require('./../models/ActivityModel');
var new_group_listModel = require('./../models/new_group_listModel');
var oracledb = require('oracledb');
var pdfgeneratorHelper = require('./pdfhelper')
var nodemailer = require('nodemailer');
var user_management = require('./../models/user_managementModel');
var request = require("request");
var breakdown_managementModel = require('./../models/breakdown_managementModel');
var breakdown_mr_data_managementModel = require('./../models/breakdown_mr_data_managementModel');
var preventive_data_managementModel = require('./../models/preventive_data_managementModel');


var service_temp_dataModel = require('./../models/service_temp_dataModel');
var oracledb = require('oracledb');
var request = require("request");
const dates = require('date-and-time');
const now1  =  new Date();
const value1 = dates.format(now1,'YYYY-MM-DDTHH:mm:ss');
var error_log_oracelModel = require('./../models/error_log_oracelModel');



router.get('/deletes', function (req, res) {
      ActivityModel.remove({}, function (err, user) {
          if (err) return res.status(500).send("There was a problem deleting the user.");
             res.json({Status:"Success",Message:"ActivityModel Deleted", Data : {} ,Code:200});     
      });
});


router.post('/fetch_data_from_oracle_mr_breakdown',async function(req, res) {
const dates = require('date-and-time');
const now1  =  new Date();
const value1 = dates.format(now1,'YYYY-MM-DDTHH:mm:ss');
 oracledb.getConnection({
      user: "JLSMART",
      password: "JLSMART",
      connectString: "(DESCRIPTION =(ADDRESS = (PROTOCOL = TCP)(HOST = 192.168.1.112)(PORT = 1521))(CONNECT_DATA =(SID = jlpl)))"
},async function(err, connection) {
if (err) {
    // console.error(err.message);
    return;
}
connection.execute(
            "SELECT * FROM JLS_SERCALL_HDR_MR WHERE  JLS_SCHM_ENGR_PHONE =:JLS_SCHM_ENGR_PHONE AND JLS_SCHM_DWNFLAG = 'N'",
            { 
              JLS_SCHM_ENGR_PHONE: ""+req.body.user_mobile_no
            },
        {autoCommit: true},
        async function (err, result) {
    if (err) { console.error(err.message);
          doRelease(connection);
          return;
     }
      doRelease(connection);
      function doRelease(connection) {
       connection.release(function(err) {
         if (err) {
          console.error(err.message);
        }
      }
   );
}
var ary = [];
for(let a = 0 ; a < result.rows.length; a++){
var temp_data = result.rows[a];
var results = {}
for (var i = 0; i < result.metaData.length; ++i){
results[result.metaData[i].name] = temp_data[i];
}
  var user_detail  =  await breakdown_mr_data_managementModel.findOne({JLS_SCHM_COMPNO:results.JLS_SCHM_COMPNO,JLS_SCHM_JOBNO:results.JLS_SCHM_JOBNO,JLS_SCHM_SERTYPE:results.JLS_SCHM_SERTYPE});
  if(user_detail == null){
  try{
        await breakdown_mr_data_managementModel.create({
  JLS_SCHM_COMPNO :  results.JLS_SCHM_COMPNO,
  JLS_SCHM_JOBNO :  results.JLS_SCHM_JOBNO,
  JLS_SCHM_SERTYPE : results.JLS_SCHM_SERTYPE,
  JLS_SCHM_PREP_DATE : results.JLS_SCHM_PREP_DATE,
  JLS_SCHM_VAN_ID :  results.JLS_SCHM_VAN_ID,
  JLS_SCHM_STATUS :results.JLS_SCHM_COMPNO,
  JLS_SCHM_ORCL_STATUS : results.JLS_SCHM_ORCL_STATUS,
  JLS_SCHM_ENGR_PHONE :  results.JLS_SCHM_ENGR_PHONE,
  JLS_SCHM_ENGR_FLAG :  results.JLS_SCHM_ENGR_FLAG,
  JLS_SCHM_ERRDESC :  results.JLS_SCHM_ERRDESC,
  JLS_SCHM_AGENT_NAME :  results.JLS_SCHM_AGENT_NAME,
  JLS_SCHM_CUSTOMER_NAME :  results.JLS_SCHM_CUSTOMER_NAME,
  JLS_SCHM_DWNFLAG :  results.JLS_SCHM_DWNFLAG,
  JOB_STATUS : 'Not Started',
  JOB_VIEW_STATUS : 'Not Viewed',
  LAST_UPDATED_TIME : ""+value1,
  JOB_START_TIME : "",
  JOB_END_TIME : "",
  SMU_SCH_COMPDT : ""+value1,
  JOB_LOCATION : "",
  JOB_START_LAT : "",
  JOB_START_LONG : "",  
        }, 
        function (err, user) {
        // res.json({Status:"Success",Message:"Added successfully", Data : user ,Code:200}); 
        });
}
catch(e){
      res.json({Status:"Failed",Message:"Internal Server Error", Data : {},Code:500});
}
}
if(a == result.rows.length - 1){
oracledb.getConnection({
      user: "JLSMART",
      password: "JLSMART",
      connectString: "(DESCRIPTION =(ADDRESS = (PROTOCOL = TCP)(HOST = 192.168.1.112)(PORT = 1521))(CONNECT_DATA =(SID = jlpl)))"
}, function(err, connection) {
if (err) {
    // console.error(err.message);
    return;
}
connection.execute(
            "UPDATE JLS_SERCALL_HDR_MR SET JLS_SCHM_DWNFLAG = 'Y' WHERE  JLS_SCHM_ENGR_PHONE =:SMU_SCH_MECHCELL AND NVL(JLS_SCHM_DWNFLAG,'N') = 'N'",
            {
                SMU_SCH_MECHCELL : req.body.user_mobile_no,
            },
        {autoCommit: true},
        function (err, result_one) {
    if (err) { console.error(err.message);
          doRelease(connection);
          return;
     } 
     doRelease(connection);
     function doRelease(connection) {
       connection.release(function(err) {
         if (err) {
          console.error(err.message);
        }
      }
   );
}
     res.json({Status:"Success",Message:"Added successfully", Data : {} ,Code:200});     
    });
});
}
 }
});  
});  
});



router.post('/fetch_data_from_oracle_mr_breakdown_pull',async function(req, res) {
const dates = require('date-and-time');
const now1  =  new Date();
const value1 = dates.format(now1,'YYYY-MM-DDTHH:mm:ss');

 oracledb.getConnection({
      user: "JLSMART",
      password: "JLSMART",
      connectString: "(DESCRIPTION =(ADDRESS = (PROTOCOL = TCP)(HOST = 192.168.1.112)(PORT = 1521))(CONNECT_DATA =(SID = jlpl)))"
},async function(err, connection) {
if (err) {
    // console.error(err.message);
    return;
}
connection.execute(
            "SELECT * FROM JLS_SERCALL_HDR_MR WHERE JLS_SCHM_DWNFLAG = 'N'",
            {},
        {autoCommit: true},
        async function (err, result) {
    if (err) { console.error(err.message);
          doRelease(connection);
          return;
     }
var ary = [];
for(let a = 0 ; a < result.rows.length; a++){
var temp_data = result.rows[a];
var results = {}
for (var i = 0; i < result.metaData.length; ++i){
results[result.metaData[i].name] = temp_data[i];
}
  var user_detail  =  await breakdown_mr_data_managementModel.findOne({JLS_SCHM_COMPNO:results.JLS_SCHM_COMPNO,JLS_SCHM_JOBNO:results.JLS_SCHM_JOBNO,JLS_SCHM_SERTYPE:results.JLS_SCHM_SERTYPE});
  if(user_detail == null){
  try{

        await breakdown_mr_data_managementModel.create({
  JLS_SCHM_COMPNO :  results.JLS_SCHM_COMPNO,
  JLS_SCHM_JOBNO :  results.JLS_SCHM_JOBNO,
  JLS_SCHM_SERTYPE : results.JLS_SCHM_SERTYPE,
  JLS_SCHM_PREP_DATE : results.JLS_SCHM_PREP_DATE,
  JLS_SCHM_VAN_ID :  results.JLS_SCHM_VAN_ID,
  JLS_SCHM_STATUS :results.JLS_SCHM_COMPNO,
  JLS_SCHM_ORCL_STATUS : results.JLS_SCHM_ORCL_STATUS,
  JLS_SCHM_ENGR_PHONE :  results.JLS_SCHM_ENGR_PHONE,
  JLS_SCHM_ENGR_FLAG :  results.JLS_SCHM_ENGR_FLAG,
  JLS_SCHM_ERRDESC :  results.JLS_SCHM_ERRDESC,
  JLS_SCHM_AGENT_NAME :  results.JLS_SCHM_AGENT_NAME,
  JLS_SCHM_CUSTOMER_NAME :  results.JLS_SCHM_CUSTOMER_NAME,
  JLS_SCHM_DWNFLAG :  results.JLS_SCHM_DWNFLAG,
  JOB_STATUS : 'Not Started',
  JOB_VIEW_STATUS : 'Not Viewed',
  LAST_UPDATED_TIME : ""+value1,
  JOB_START_TIME : "",
  JOB_END_TIME : "",
  SMU_SCH_COMPDT : ""+value1,
        }, 
        function (err, user) {
        // res.json({Status:"Success",Message:"Added successfully", Data : user ,Code:200}); 
        });
}
catch(e){
      res.json({Status:"Failed",Message:"Internal Server Error", Data : {},Code:500});
}
}
if(a == result.rows.length - 1){
oracledb.getConnection({
      user: "JLSMART",
      password: "JLSMART",
      connectString: "(DESCRIPTION =(ADDRESS = (PROTOCOL = TCP)(HOST = 192.168.1.112)(PORT = 1521))(CONNECT_DATA =(SID = jlpl)))"
}, function(err, connection) {
if (err) {
    // console.error(err.message);
    return;
}
connection.execute(
            "UPDATE JLS_SERCALL_HDR_MR SET JLS_SCHM_DWNFLAG = 'Y' WHERE  JLS_SCHM_SERTYPE = 'B' AND NVL(JLS_SCHM_DWNFLAG,'N') = 'N'",
            {
            },
        {autoCommit: true},
        function (err, result_one) {
    if (err) { console.error(err.message);
          doRelease(connection);
          return;
     }
     res.json({Status:"Success",Message:"Added successfully", Data : {} ,Code:200});     
    });
});
}
 }
});  
});  
});




router.get('/check_value', function (req, res) {
       breakdown_mr_data_managementModel.find({},async function (err, Functiondetails) {
          for(let a = 0 ; a < Functiondetails.length;a++){
           var job_details  =  await breakdown_managementModel.findOne({SMU_SCH_COMPNO:Functiondetails[a].JLS_SCHM_COMPNO});
           if(job_details == null){
           }
           if(a == Functiondetails.length - 1){
                res.json({Status:"Success",Message:"breakdown mr List", Data : {} ,Code:200});
           }
          }
       });
});



router.post('/fetch_job_details_by_job_no',async function (req, res) {
   var job_details  =  await breakdown_managementModel.find({SMU_SCH_JOBNO:req.body.job_id});
   res.json({Status:"Success",Message:"Breakdown Preventive Job Details", Data : job_details ,Code:200});
});


router.post('/delete_job',async function (req, res) {
     breakdown_managementModel.findByIdAndRemove(req.body._id, function (err, user) {
          if (err) return res.json({Status:"Failed",Message:"Internal Server Error", Data : {},Code:500});
          res.json({Status:"Success",Message:"Job Deleted successfully", Data : {} ,Code:200});
      });
});


router.get('/deletes', function (req, res) {
      ActivityModel.remove({}, function (err, user) {
          if (err) return res.status(500).send("There was a problem deleting the user.");
             res.json({Status:"Success",Message:"ActivityModel Deleted", Data : {} ,Code:200});     
      });
});







router.get('/breakdown_mr_getlist', function (req, res) {
        breakdown_mr_data_managementModel.find({}, function (err, Functiondetails) {
          res.json({Status:"Success",Message:"breakdown mr List", Data : Functiondetails ,Code:200});
        });
});





router.get('/breakdown_mr_deletes', function (req, res) {
      breakdown_mr_data_managementModel.remove({}, function (err, user) {
          if (err) return res.status(500).send("There was a problem deleting the user.");
             res.json({Status:"Success",Message:"breakdown mr Deleted", Data : {} ,Code:200});     
      });
});





router.post('/check_pod_status',async function (req, res) {
console.log(req.body);
var job_details  =  await breakdown_managementModel.findOne({SMU_SCH_JOBNO:req.body.job_id,SMU_SCH_SERTYPE : 'P'});
 var status = '';
if(job_details.SMU_SCH_DOORTYPE == 'DOOR POWER'){
 status = 'POD'
}else if(job_details.SMU_SCH_DOORTYPE == 'DOOR MANUAL'){
 status = 'MOD'
}else if(job_details.SMU_SCH_DOORTYPE == 'DOOR SEMI POD'){
 status = 'SEMPOD'
}else if(job_details.SMU_SCH_DOORTYPE == null){
 status = 'ESC / TRV'
}else {
 status = 'ESC / TRV'
}
let a  = {
    status:status
}
res.json({Status:"Success",Message:"POD Details", Data : a ,Code:200});
});









router.post('/pause_job_list',async function (req, res) {


var job_details  =  await breakdown_mr_data_managementModel.find({JLS_SCHM_ENGR_PHONE: req.body.user_mobile_no,JOB_STATUS:'Job Paused',JLS_SCHM_SERTYPE:'P'});

let a = [];
job_details.forEach(element => {
if(element.JOB_STATUS == "Job Resume" || element.JOB_STATUS == "Job Paused" || element.JOB_STATUS == "Job Stopped"){

const date = require('date-and-time');
const now1  =  new Date(element.LAST_UPDATED_TIME);
const value1 = date.format(now1,'DD-MM-YYYY HH:mm:ss');


  a.push({
            job_id : element.JLS_SCHM_JOBNO,
            paused_time :  value1,
            paused_at : 'Preventive',
            SMU_SCH_COMPNO: element.JLS_SCHM_COMPNO,
            SMU_SCH_SERTYPE : element.JLS_SCHM_SERTYPE
        });
}
}); 

   res.json({Status:"Success",Message:"Pause job list", Data : a ,Code:200});
});



router.post('/branch_head/pause_job_list',async function (req, res) {


var job_details  =  await breakdown_mr_data_managementModel.find({JLS_SCHM_BRCODE: req.body.br_code,JOB_STATUS:'Job Paused',JLS_SCHM_SERTYPE:'P'});

let a = [];
job_details.forEach(element => {
if(element.JOB_STATUS == "Job Resume" || element.JOB_STATUS == "Job Paused" || element.JOB_STATUS == "Job Stopped"){

const date = require('date-and-time');
const now1  =  new Date(element.LAST_UPDATED_TIME);
const value1 = date.format(now1,'DD-MM-YYYY HH:mm:ss');


  a.push({
            job_id : element.JLS_SCHM_JOBNO,
            paused_time :  value1,
            paused_at : 'Preventive',
            SMU_SCH_COMPNO: element.JLS_SCHM_COMPNO,
            SMU_SCH_SERTYPE : element.JLS_SCHM_SERTYPE
        });
}
}); 

   res.json({Status:"Success",Message:"Pause job list", Data : a ,Code:200});
});







router.post('/pause_job_list_pm',async function (req, res) {

var job_details  =  await breakdown_managementModel.find({SMU_SCH_MECHCELL: req.body.user_mobile_no,SMU_SCH_SERTYPE : 'P'});

let a = [];
job_details.forEach(element => {
if(element.JOB_STATUS == "Job Resume" || element.JOB_STATUS == "Job Paused" || element.JOB_STATUS == "Job Stopped" ){ 
const date = require('date-and-time');
const now1  =  new Date(element.LAST_UPDATED_TIME);
const value1 = date.format(now1,'DD-MM-YYYY HH:mm:ss');
  a.push({
            job_id : element.SMU_SCH_JOBNO,
            paused_time :  value1,
            paused_at : 'Preventive',
            SMU_SCH_COMPNO: element.SMU_SCH_COMPNO,
            SMU_SCH_SERTYPE : element.SMU_SCH_SERTYPE
        });
}
}); 

   res.json({Status:"Success",Message:"Pause job list", Data : a ,Code:200});
});





router.post('/branch_head/pause_job_list_pm',async function (req, res) {

var job_details  =  await breakdown_managementModel.find({SMU_SCH_BRCODE: req.body.br_code,SMU_SCH_SERTYPE : 'P'});

let a = [];
job_details.forEach(element => {
if(element.JOB_STATUS == "Job Resume" || element.JOB_STATUS == "Job Paused" || element.JOB_STATUS == "Job Stopped" ){ 
const date = require('date-and-time');
const now1  =  new Date(element.LAST_UPDATED_TIME);
const value1 = date.format(now1,'DD-MM-YYYY HH:mm:ss');
  a.push({
            job_id : element.SMU_SCH_JOBNO,
            paused_time :  value1,
            paused_at : 'Preventive',
            SMU_SCH_COMPNO: element.SMU_SCH_COMPNO,
            SMU_SCH_SERTYPE : element.SMU_SCH_SERTYPE
        });
}
}); 

   res.json({Status:"Success",Message:"Pause job list", Data : a ,Code:200});
});









router.post('/service_mr_job_status_count',async function (req, res) {
        var bd_paused_count  =  await breakdown_mr_data_managementModel.count({JLS_SCHM_ENGR_PHONE: req.body.user_mobile_no,JOB_STATUS:'Job Paused',JLS_SCHM_SERTYPE : 'P'});

        let a  = {
            paused_count : bd_paused_count
        }
       res.json({Status:"Success",Message:"Job status count", Data : a ,Code:200});
});



router.post('/branch_head/service_mr_job_status_count',async function (req, res) {
        var bd_paused_count  =  await breakdown_mr_data_managementModel.count({JLS_SCHM_BRCODE: req.body.br_code,JOB_STATUS:'Job Paused',JLS_SCHM_SERTYPE : 'P'});

        let a  = {
            paused_count : bd_paused_count
        }
       res.json({Status:"Success",Message:"Job status count", Data : a ,Code:200});
});




router.post('/service_mr_new_job_list',async function (req, res) {
var job_details  =  await breakdown_mr_data_managementModel.find({JLS_SCHM_ENGR_PHONE: req.body.user_mobile_no,JLS_SCHM_SERTYPE : 'P'});
let a = [];
job_details.forEach(element => {
if(element.JOB_STATUS == "Job Started" || element.JOB_STATUS == "Job Stopped" || element.JOB_STATUS == "Not Started" || element.JOB_STATUS == "Job Resume" ){
        

         var date = new Date(element.SMU_SCH_COMPDT);
         date.setDate(date.getDate() + 1);
         var dates = new Date(date).toISOString();

         

        // var dates = new Date(element.SMU_SCH_COMPDT).toISOString();
  a.push({
            job_id : element.JLS_SCHM_JOBNO,
            customer_name : element.JLS_SCHM_CUSTOMER_NAME,
            pm_date : dates.substring(0, 10),
            status : "Active",
            SMU_SCH_COMPNO: element.JLS_SCHM_COMPNO,
            SMU_SCH_SERTYPE : element.JLS_SCHM_SERTYPE,
  })
}
});
res.json({Status:"Success",Message:"New Job List", Data : a ,Code:200});
});




router.post('/branch_head/service_mr_new_job_list',async function (req, res) {
var job_details  =  await breakdown_mr_data_managementModel.find({JLS_SCHM_BRCODE: req.body.br_code,JLS_SCHM_SERTYPE : 'P'});
let a = [];
job_details.forEach(element => {
if(element.JOB_STATUS == "Job Started" || element.JOB_STATUS == "Job Stopped" || element.JOB_STATUS == "Not Started" || element.JOB_STATUS == "Job Resume" ){
        

         var date = new Date(element.SMU_SCH_COMPDT);
         date.setDate(date.getDate() + 1);
         var dates = new Date(date).toISOString();

         

        // var dates = new Date(element.SMU_SCH_COMPDT).toISOString();
  a.push({
            job_id : element.JLS_SCHM_JOBNO,
            customer_name : element.JLS_SCHM_CUSTOMER_NAME,
            pm_date : dates.substring(0, 10),
            status : "Active",
            SMU_SCH_COMPNO: element.JLS_SCHM_COMPNO,
            SMU_SCH_SERTYPE : element.JLS_SCHM_SERTYPE,
  })
}
});
res.json({Status:"Success",Message:"New Job List", Data : a ,Code:200});
});



router.post('/service_mr_customer_details',async function (req, res) {
    var job_details  =  await breakdown_managementModel.findOne({SMU_SCH_COMPNO:req.body.SMU_SCH_COMPNO});
      if(job_details !== null){
            let a  = {
                customer_name: job_details.SMU_SCH_CUSNAME,
                job_id : job_details.SMU_SCH_JOBNO,
                address1 : job_details.SMU_SCH_CUSADD1,
                address2 : job_details.SMU_SCH_CUSADD2,
                address3 : job_details.SMU_SCH_CUSADD3,
                pin: job_details.SMU_SCH_CUSPIN,
                contract_type : job_details.SMU_SCH_AMCTYPE,
                contract_status : job_details.SMU_SCH_JOBCURSTATUS,
                bd_number : job_details.SMU_SCH_COMPNO,
                bd_date : job_details.SMU_SCH_COMPDT.substring(0, 10),
                breakdown_type : job_details.SMU_SCH_BRKDOWNTYPE,
            }
           res.json({Status:"Success",Message:"Customer Details", Data : a ,Code:200});
      }else {
    
    oracledb.getConnection({
          user: "JLSMART",
          password: "JLSMART",
          connectString: "(DESCRIPTION =(ADDRESS = (PROTOCOL = TCP)(HOST = 192.168.1.112)(PORT = 1521))(CONNECT_DATA =(SID = jlpl)))"
    }, function(err, connection) {
    if (err) {
        return;
    }
    connection.execute(
                "select * from JLS_SERCALL_HDR_UPLOAD where SMU_SCH_COMPNO=:type",
                // "select * from FEEDBACK_DETAILS",
                {type:req.body.SMU_SCH_COMPNO},
            {autoCommit: true},
            function (err, result) {
        if (err) { console.error(err.message);
              doRelease(connection);
              return;
         }
    var ary = [];
    for(let a = 0 ; a < result.rows.length; a++){
    var temp_data = result.rows[a];
    var results = {}
    for (var i = 0; i < result.metaData.length; ++i){
    results[result.metaData[i].name] = temp_data[i];
    }
    }
    job_details = results;
    console.log("**********ERROR PREVENTIVE SERIVE DATA MANAGEMENT COMP NO",req.body.SMU_SCH_COMPNO);
    console.log("**********ERROR PREVENTIVE SERIVE DATA MANAGEMENT",job_details);
    if(job_details == undefined){
        res.json({Status:"Failed",Message:"No Record Found", Data : {} ,Code:404});
    } else {
        var dates = new Date(job_details.SMU_SCH_COMPDT).toISOString();
        let a  = {
                customer_name: job_details.SMU_SCH_CUSNAME,
                job_id : job_details.SMU_SCH_JOBNO,
                address1 : job_details.SMU_SCH_CUSADD1,
                address2 : job_details.SMU_SCH_CUSADD2,
                address3 : job_details.SMU_SCH_CUSADD3,
                pin: job_details.SMU_SCH_CUSPIN,
                contract_type : job_details.SMU_SCH_AMCTYPE,
                contract_status : job_details.SMU_SCH_JOBCURSTATUS,
                bd_number : job_details.SMU_SCH_COMPNO,
                bd_date : dates.substring(0, 10),
                breakdown_type : job_details.SMU_SCH_BRKDOWNTYPE,
            }
           res.json({Status:"Success",Message:"Customer Details", Data : a ,Code:200});
    }



    });
    });
    
      }
});
    









router.post('/service_mr_eng_mrlist', function (req, res) {    
req.body.job_id = req.body.job_id;
 let final_data = [
          {
            title : 'Mr1',
            value : '-'
          },
          {
            title : 'Mr2',
            value : ''
          },{
            title : 'Mr3',
            value : ''
          },{
            title : 'Mr4',
            value : ''
          },{
            title : 'Mr5',
            value : ''
          },{
            title : 'Mr6',
            value : ''
          },{
            title : 'Mr7',
            value : ''
          },{
            title : 'Mr8',
            value : ''
          },{
            title : 'Mr9',
            value : ''
          },{
            title : 'Mr10',
            value : ''
          }
       ];
oracledb.getConnection({
      user: "JLSMART",
      password: "JLSMART",
      connectString: "(DESCRIPTION =(ADDRESS = (PROTOCOL = TCP)(HOST = 192.168.1.112)(PORT = 1521))(CONNECT_DATA =(SID = jlpl)))"
}, function(err, connection) {
if (err) {
    // console.error(err.message);
    return;
}
    connection.execute(
            "select * from JLS_SERCALL_DTL_MR where JLS_SCDM_JOBNO =:job_id and JLS_SCDM_SERTYPE = 'P' and JLS_SCDM_COMPNO=:JLS_SCDM_COMPNO",
            {
              job_id : req.body.job_id,
              JLS_SCDM_COMPNO : req.body.SMU_SCH_COMPNO
            },
        {autoCommit: true},
     async   function (err, result) {
    if (err) { console.error(err.message);
          doRelease(connection);
          return;
     }    
if(result.rows.length == 0) {
res.json({Status:"Success",Message:"Service Report", Data : final_data ,Code:200});
} 
else {
var ary = [];
for(let a = 0 ; a < result.rows.length; a++){
var temp_data = result.rows[a];
var results = {}
for (var i = 0; i < result.metaData.length; ++i){
results[result.metaData[i].name] = temp_data[i];
}
 // ary.push(results);
 
   if(results.JLS_SCDM_SLNO == '1'){
    final_data[0].value = results.JLS_SCDM_DESC
   }
   if(results.JLS_SCDM_SLNO == '2'){
    final_data[1].value = results.JLS_SCDM_DESC
   }
   if(results.JLS_SCDM_SLNO == '3'){
    final_data[2].value = results.JLS_SCDM_DESC
   }
   if(results.JLS_SCDM_SLNO == 4){
    final_data[3].value = results.JLS_SCDM_DESC
   }
   if(results.JLS_SCDM_SLNO == 5){
    final_data[4].value = results.JLS_SCDM_DESC
   }
   if(results.JLS_SCDM_SLNO == 6){
    final_data[5].value = results.JLS_SCDM_DESC
   }
   if(results.JLS_SCDM_SLNO == 7){
    final_data[6].value = results.JLS_SCDM_DESC
   }
   if(results.JLS_SCDM_SLNO == 8){
    final_data[7].value = results.JLS_SCDM_DESC
   }
   if(results.JLS_SCDM_SLNO == 9){
    final_data[8].value = results.JLS_SCDM_DESC
   }
   if(results.JLS_SCDM_SLNO == 10){
    final_data[9].value = results.JLS_SCDM_DESC
   }
  if(a == result.rows.length - 1){
  if(final_data[0].value == 'undefined' && final_data[1].value == 'undefined'){
  var job_details_two  =  await preventive_data_managementModel.findOne({SMU_SCH_COMPNO:req.body.SMU_SCH_COMPNO});
   res.json({Status:"Success",Message:"Service Report", Data : final_data ,Code:200});
  }else {
    res.json({Status:"Success",Message:"Service Report", Data : final_data ,Code:200});
  }
}
}
}
    });
});

});







router.post('/preventive_checklist',async function (req, res) {
       let a = [
           {
            check_list_value : 'Machine Room Checklist and Cleaning'
           },
           {
            check_list_value : 'Controller Check and Cleaning'
           },
           {
            check_list_value : 'Machine check'
           },
           {
            check_list_value : 'Governor check'
           },
           {
            check_list_value : 'Door Operation check'
           },
           {
            check_list_value : 'Saftey Check E.Alarm or E.Light or ARD'
           }
        ]
       res.json({Status:"Success",Message:"Preventive Checklist", Data : a ,Code:200});
});




router.post('/check_list_value',async function (req, res) {
 if(req.body.job_status_type == 'ESC/TRV'){
     const withoutFirstAndLast = req.body.job_date.slice(1, -1).replace(/ /g,'').toUpperCase();
    var string = withoutFirstAndLast.split(",");
    var text_value = '';
    string.forEach(element => {
    var tmp_data = ""+"ESC"+element[0]+element[1]+element[2];
    if(tmp_data == "ESCYEA"){
        text_value = text_value+",'ESC"+element[0]+element[1]+"R'";
    }else {
     text_value = text_value+",'ESC"+element[0]+element[1]+element[2]+"'";
    }

    }
    );
 }else{
    const withoutFirstAndLast = req.body.job_date.slice(1, -1).replace(/ /g,'').toUpperCase();
    var string = withoutFirstAndLast.split(",");
    var text_value = '';
    string.forEach(element => {
    text_value = text_value+",'"+element[0]+element[1]+element[2]+"'";
    }
    );
 }
    
var datas = await service_temp_dataModel.findOne({user_mobile_no: req.body.user_mobile_no,jobId:req.body.job_id,key_value :req.body.SMU_SCH_COMPNO+"cheeck"});
// res.json({Status:"Success",Message:"Functiondetails Updated", Data : datas.data_store[0] ,Code:200});
var save_datas = [];
if(datas !== null){
   save_datas = datas.data_store[0].field_value_data;
}



oracledb.getConnection({
      user: "JLSMART",
      password: "JLSMART",
      connectString: "(DESCRIPTION =(ADDRESS = (PROTOCOL = TCP)(HOST = 192.168.1.112)(PORT = 1521))(CONNECT_DATA =(SID = jlpl)))"
}, function(err, connection) {
if (err) {
    console.error(err.message);
    return;
}
 if(req.body.job_status_type == 'SEMPOD'){
      req.body.job_status_type = 'SPOD';
 }


 connection.execute(
            "select * from JLS_PM_CHECKLIST WHERE DOOR_TYPE in ('"+req.body.job_status_type +"'"+ text_value+") ORDER BY SLNO",
            {},
        {autoCommit: true},
        function (err, result) {
    if (err) { console.error(err.message);
          doRelease(connection);
          return;
     }
doRelease(connection);
var ary = [];
for(let a = 0 ; a < result.rows.length ; a++){
var temp_data = result.rows[a];
var results = {}
for (var i = 0; i < result.metaData.length; ++i){
results[result.metaData[i].name] = temp_data[i];
}
 ary.push(results);   
 if(a == result.rows.length - 1){
var final_data = [];
ary.forEach((element,index) => {
    // if(index < 20){
   if(element.VAL_TYPE == 'DROPDOWN1'){
    final_data.push(
       {
            "drop_down": [
                "OK",
                "NOT OK",
                "NA"
            ],
            "lift_list": [],
            "_id": "6217162253815c4fd78f3046",
            "cat_id": ""+element.PAR_CODE,
            "group_id": ""+element.ACTIVITY_CODE,
            "sub_group_id": "",
            "field_name": ""+element.GROUP_NAME,
            "field_type": "Dropdown",
            "field_value":  "",
            "field_length": "",
            "field_comments": ""+element.ACTIVITY_NAME +" - ( "+""+element.DOOR_TYPE+" )",
            "field_update_reason": "",
            "date_of_create": "2/24/2022, 10:52:41 AM",
            "date_of_update": "2/24/2022, 10:52:41 AM",
            "created_by": "Admin",
            "updated_by": "Admin",
            "__v": 0,
            "delete_status": false
       }
    )
   }
   else  if(element.VAL_TYPE == 'DROPDOWN2'){
    final_data.push(
      {
            "drop_down": [
                "NORMAL",
                "ABNORMAL",
                "NA"
            ],
            "lift_list": [],
            "_id": "6217162253815c4fd78f3046",
             "cat_id": ""+element.PAR_CODE,
            "group_id": ""+element.ACTIVITY_CODE,
            "sub_group_id": "",
            "field_name": ""+element.GROUP_NAME,
            "field_type": "Dropdown",
            "field_value": "",
            "field_length": "",
            "field_comments": ""+element.ACTIVITY_NAME +" - "+""+element.DOOR_TYPE,
            "field_update_reason": "",
            "date_of_create": "2/24/2022, 10:52:41 AM",
            "date_of_update": "2/24/2022, 10:52:41 AM",
            "created_by": "Admin",
            "updated_by": "Admin",
            "__v": 0,
            "delete_status": false
       }
    )
   }
   else if(element.VAL_TYPE == 'TEXT'){
    final_data.push(
    {
            "drop_down": [
                "1",
                "2"
            ],
            "lift_list": [],
            "_id": "6217162253815c4fd78f3046",
            "cat_id": ""+element.PAR_CODE,
            "group_id": ""+element.ACTIVITY_CODE,
            "sub_group_id": "",
            "field_name": ""+element.GROUP_NAME,
            "field_type": "String",
            "field_value": "",
            "field_length": "",
            "field_comments":""+element.ACTIVITY_NAME +" - "+""+element.DOOR_TYPE,
            "field_update_reason": "",
            "date_of_create": "2/24/2022, 10:52:41 AM",
            "date_of_update": "2/24/2022, 10:52:41 AM",
            "created_by": "Admin",
            "updated_by": "Admin",
            "__v": 0,
            "delete_status": false
       }
    )
   }
// }
});

if(save_datas.length == 0) {
res.json({Status:"Success",Message:"check list value",Data:final_data,Code:200});
} else {   
   for(let c = 0 ; c < final_data.length;c++){
        for(let d = 0; d < save_datas.length; d++){
                if(final_data[c].field_comments == save_datas[d].field_comments){
                  final_data[c].field_value = save_datas[d].field_value;
                }
        }
    if(c == final_data.length - 1){
        res.json({Status:"Success",Message:"check list value",Data:final_data,Code:200});
    }
   }
}
     }
} 
   });
function doRelease(connection) {
       connection.release(function(err) {
         if (err) {
          console.error(err.message);
        }
      }
   );
}
});
});




router.post('/check_list_value_temp',async function (req, res) {
 if(req.body.job_status_type == 'ESC/TRV'){
     const withoutFirstAndLast = req.body.job_date.slice(1, -1).replace(/ /g,'').toUpperCase();
    var string = withoutFirstAndLast.split(",");
    var text_value = '';
    string.forEach(element => {    
    var tmp_data = ""+"ESC"+element[0]+element[1]+element[2];
    if(tmp_data == "ESCYEA"){
        text_value = text_value+",'ESC"+element[0]+element[1]+"R'";
    }else {
     text_value = text_value+",'ESC"+element[0]+element[1]+element[2]+"'";
    }

    }
    );
 } else{
    const withoutFirstAndLast = req.body.job_date.slice(1, -1).replace(/ /g,'').toUpperCase();
    var string = withoutFirstAndLast.split(",");
    var text_value = '';
    string.forEach(element => {
    text_value = text_value+",'"+element[0]+element[1]+element[2]+"'";
    }
    );
 }


var datas = await service_temp_dataModel.findOne({user_mobile_no: req.body.user_mobile_no,jobId:req.body.job_id,key_value :req.body.SMU_SCH_COMPNO});
var save_datas = [];
if(datas !== null){
   save_datas = datas.data_store[0].field_value_data;

}



oracledb.getConnection({
      user: "JLSMART",
      password: "JLSMART",
      connectString: "(DESCRIPTION =(ADDRESS = (PROTOCOL = TCP)(HOST = 192.168.1.112)(PORT = 1521))(CONNECT_DATA =(SID = jlpl)))"
}, function(err, connection) {
if (err) {
    // console.error(err.message);
    return;
}
 
 if(req.body.job_status_type == 'SEMPOD'){
      req.body.job_status_type = 'SPOD';
 }

// "SELECT * from SSM_SERCALL_HDR_UPLOAD where SMU_SCH_MECHCELL = '7358780824'  and SMU_SCH_DWNFLAG IS NULL",
connection.execute(
            "select * from JLS_PM_CHECKLIST WHERE DOOR_TYPE in ('"+req.body.job_status_type +"'"+ text_value+") ORDER BY SLNO",
            {},
        {autoCommit: true},
        function (err, result) {
    if (err) { console.error(err.message);
          doRelease(connection);
          return;
     }
doRelease(connection);
var ary = [];
for(let a = 0 ; a < result.rows.length ; a++){
var temp_data = result.rows[a];
var results = {}
for (var i = 0; i < result.metaData.length; ++i){
results[result.metaData[i].name] = temp_data[i];
}
 ary.push(results);   
 if(a == result.rows.length - 1){
var final_data = [];
ary.forEach((element,index) => {
    // if(index < 20){
   if(element.VAL_TYPE == 'DROPDOWN1'){
    final_data.push(
       {
            "drop_down": [
                "OK",
                "NOT OK",
                "N/A"
            ],
            "lift_list": [],
            "_id": "6217162253815c4fd78f3046",
            "cat_id": ""+element.PAR_CODE,
            "group_id": ""+element.ACTIVITY_CODE,
            "sub_group_id": "",
            "field_name": ""+element.GROUP_NAME,
            "field_type": "Dropdown",
            "field_value":  "",
            "field_length": "",
            "field_comments": ""+element.ACTIVITY_NAME +" - ( "+""+element.DOOR_TYPE+" )",
            "field_update_reason": "",
            "date_of_create": "2/24/2022, 10:52:41 AM",
            "date_of_update": "2/24/2022, 10:52:41 AM",
            "created_by": "Admin",
            "updated_by": "Admin",
            "__v": 0,
            "delete_status": false
       }
    )
   }
   else  if(element.VAL_TYPE == 'DROPDOWN2'){
    final_data.push(
      {
            "drop_down": [
                "NORMAL",
                "ABNORMAL",
                "N/A"
            ],
            "lift_list": [],
            "_id": "6217162253815c4fd78f3046",
             "cat_id": ""+element.PAR_CODE,
            "group_id": ""+element.ACTIVITY_CODE,
            "sub_group_id": "",
            "field_name": ""+element.GROUP_NAME,
            "field_type": "Dropdown",
            "field_value": "",
            "field_length": "",
            "field_comments": ""+element.ACTIVITY_NAME +" - "+""+element.DOOR_TYPE,
            "field_update_reason": "",
            "date_of_create": "2/24/2022, 10:52:41 AM",
            "date_of_update": "2/24/2022, 10:52:41 AM",
            "created_by": "Admin",
            "updated_by": "Admin",
            "__v": 0,
            "delete_status": false
       }
    )
   }
   else if(element.VAL_TYPE == 'TEXT'){
    final_data.push(
    {
            "drop_down": [
                "1",
                "2"
            ],
            "lift_list": [],
            "_id": "6217162253815c4fd78f3046",
            "cat_id": ""+element.PAR_CODE,
            "group_id": ""+element.ACTIVITY_CODE,
            "sub_group_id": "",
            "field_name": ""+element.GROUP_NAME,
            "field_type": "String",
            "field_value": "",
            "field_length": "",
            "field_comments":""+element.ACTIVITY_NAME +" - "+""+element.DOOR_TYPE,
            "field_update_reason": "",
            "date_of_create": "2/24/2022, 10:52:41 AM",
            "date_of_update": "2/24/2022, 10:52:41 AM",
            "created_by": "Admin",
            "updated_by": "Admin",
            "__v": 0,
            "delete_status": false
       }
    )
   }
// }
});
if(save_datas.length == 0) {
res.json({Status:"Success",Message:"check list value",Data:final_data,Code:200});
} else {   
   for(let c = 0 ; c < final_data.length;c++){
        for(let d = 0; d < save_datas.length; d++){
                if(final_data[c].field_comments == save_datas[d].field_comments){
                  final_data[c].field_value = save_datas[d].field_value;
                }
        }
    if(c == final_data.length - 1){
        res.json({Status:"Success",Message:"check list value",Data:final_data,Code:200});
    }
   }
}





     }
} 
   });
function doRelease(connection) {
       connection.release(function(err) {
         if (err) {
          console.error(err.message);
        }
      }
   );
}
});
});







router.post('/customer_details',async function (req, res) {
    console.log("Error 1159 SMU_SCH_COMPDT null",req.body);
    var job_details  =  await breakdown_managementModel.findOne({SMU_SCH_COMPNO:req.body.SMU_SCH_COMPNO});
        var date = new Date(job_details.SMU_SCH_COMPDT);
        date.setDate(date.getDate() + 1);
        var dates = new Date(date).toISOString();
        let a  = {
            customer_name: job_details.SMU_SCH_CUSNAME,
            job_id : job_details.SMU_SCH_JOBNO,
            address1 : job_details.SMU_SCH_CUSADD1,
            address2 : job_details.SMU_SCH_CUSADD2,
            address3 : job_details.SMU_SCH_CUSADD3,
            pin: job_details.SMU_SCH_CUSPIN,
            contract_type : job_details.SMU_SCH_AMCTYPE,
            contract_status : job_details.SMU_SCH_JOBCURSTATUS || "ACTIVE",
            bd_number : job_details.SMU_SCH_COMPNO,
            bd_date : dates.substring(0, 10),
            breakdown_type : job_details.SMU_SCH_BRKDOWNTYPE,
        }
    res.json({Status:"Success",Message:"Customer Details", Data : a ,Code:200});
});





router.post('/new_job_list',async function (req, res) {
var job_details  =  await breakdown_managementModel.find({SMU_SCH_MECHCELL: req.body.user_mobile_no,SMU_SCH_SERTYPE : 'P'});
let a = [];
job_details.forEach(element => {
if(element.JOB_STATUS == "Job Started" || element.JOB_STATUS == "Job Stopped" || element.JOB_STATUS == "Not Started" || element.JOB_STATUS == "Job Resume" ){
         var date = new Date(element.SMU_SCH_COMPDT);
         date.setDate(date.getDate() + 1);
         var dates = new Date(date).toISOString();
  a.push({
            job_id : element.SMU_SCH_JOBNO,
            customer_name : element.SMU_SCH_CUSNAME,
            pm_date : dates.substring(0, 10),
            status : "Active",
            SMU_SCH_COMPNO: element.SMU_SCH_COMPNO,
            SMU_SCH_SERTYPE : element.SMU_SCH_SERTYPE,
  });
  }
});
res.json({Status:"Success",Message:"New Job List", Data : a ,Code:200});
});




router.post('/branch_head/new_job_list',async function (req, res) {
var job_details  =  await breakdown_managementModel.find({SMU_SCH_BRCODE: req.body.br_code,SMU_SCH_SERTYPE : 'P'});
let a = [];
job_details.forEach(element => {
if(element.JOB_STATUS == "Job Started" || element.JOB_STATUS == "Job Stopped" || element.JOB_STATUS == "Not Started" || element.JOB_STATUS == "Job Resume" ){
         var date = new Date(element.SMU_SCH_COMPDT);
         date.setDate(date.getDate() + 1);
         var dates = new Date(date).toISOString();
  a.push({
            job_id : element.SMU_SCH_JOBNO,
            customer_name : element.SMU_SCH_CUSNAME,
            pm_date : dates.substring(0, 10),
            status : "Active",
            SMU_SCH_COMPNO: element.SMU_SCH_COMPNO,
            SMU_SCH_SERTYPE : element.SMU_SCH_SERTYPE,
  });
  }
});
res.json({Status:"Success",Message:"New Job List", Data : a ,Code:200});
});




router.post('/job_status_count',async function (req, res) {
       var bd_paused_count  =  await breakdown_managementModel.count({SMU_SCH_MECHCELL: req.body.user_mobile_no,'JOB_STATUS': {$nin : ["Job Started", "Job Stopped" , "Not Started", "Job Submitted", "Job Deleted"]},SMU_SCH_SERTYPE : 'P'});
        let a  = {
            paused_count : bd_paused_count
        }
       res.json({Status:"Success",Message:"Job status count", Data : a ,Code:200});
});



router.post('/branch_head/job_status_count',async function (req, res) {
       var bd_paused_count  =  await breakdown_managementModel.count({SMU_SCH_BRCODE: req.body.br_code,'JOB_STATUS': {$nin : ["Job Started", "Job Stopped" , "Not Started", "Job Submitted", "Job Deleted"]},SMU_SCH_SERTYPE : 'P'});
        let a  = {
            paused_count : bd_paused_count
        }
       res.json({Status:"Success",Message:"Job status count", Data : a ,Code:200});
});





router.post('/edit', function (req, res) {
        ActivityModel.findByIdAndUpdate(req.body._id, req.body, {new: true}, function (err, UpdatedDetails) {
            if (err) return res.json({Status:"Failed",Message:"Internal Server Error", Data : {},Code:500});
             res.json({Status:"Success",Message:"Functiondetails Updated", Data : UpdatedDetails ,Code:200});
        });
});
// // DELETES A USER FROM THE DATABASE
router.post('/delete', function (req, res) {
      ActivityModel.findByIdAndRemove(req.body._id, function (err, user) {
          if (err) return res.json({Status:"Failed",Message:"Internal Server Error", Data : {},Code:500});
          res.json({Status:"Success",Message:"SubFunction Deleted successfully", Data : {} ,Code:200});
      });
});





router.post('/service_mr_eng_mrlist_submit', function (req, res) {
    console.log("************************ OLD service_mr_eng_mrlist_submit ",req.body);
});
























////////////////////////////PM Submit Data////////////////////////////

router.post('/submit_data_test_2',async function (req, res) {  

// console.log(req.body);


if(req.body.SMU_SCH_COMPNO == null || req.body.SMU_SCH_COMPNO == '' || req.body.SMU_SCH_COMPNO == undefined){
      res.json({Status:"Failed",Message:"complaint no not set properly", Data : {} ,Code:404}); 
      console.log("0000000000000000000000000000000 Error");
}
else if(req.body.SMU_SCH_SERTYPE == null || req.body.SMU_SCH_SERTYPE == '' || req.body.SMU_SCH_SERTYPE == undefined){
      res.json({Status:"Failed",Message:"Service Type not set properly", Data : {} ,Code:404}); 
      console.log("0000000000000000000000000000000 Error");
}
else if(req.body.action_req_customer == null || req.body.action_req_customer == '' || req.body.action_req_customer == undefined){
      res.json({Status:"Failed",Message:"action req customer not set properly", Data : {} ,Code:404}); 
      console.log("0000000000000000000000000000000 Error");
}
else if(req.body.customer_name == null || req.body.customer_name == '' || req.body.customer_name == undefined){
      res.json({Status:"Failed",Message:"customer name not set properly", Data : {} ,Code:404}); 
      console.log("0000000000000000000000000000000 Error");
}
else if(req.body.customer_number == null || req.body.customer_number == '' || req.body.customer_number == undefined){
      res.json({Status:"Failed",Message:"customer number not set properly", Data : {} ,Code:404}); 
      console.log("0000000000000000000000000000000 Error");
}
else if(req.body.customer_signature == null || req.body.customer_signature == '' || req.body.customer_signature == undefined){
      res.json({Status:"Failed",Message:"customer signature not set properly", Data : {} ,Code:404}); 
      console.log("0000000000000000000000000000000 Error");
}
else if(req.body.job_id == null || req.body.job_id == '' || req.body.job_id == undefined){
      res.json({Status:"Failed",Message:"job no not set properly", Data : {} ,Code:404}); 
      console.log("0000000000000000000000000000000 Error");
}
else if(req.body.job_status_type == null || req.body.job_status_type == '' || req.body.job_status_type == undefined){
      res.json({Status:"Failed",Message:"job status type not set properly", Data : {} ,Code:404}); 
      console.log("0000000000000000000000000000000 Error");
}
else if(req.body.pm_status == null || req.body.pm_status == '' || req.body.pm_status == undefined){
      res.json({Status:"Failed",Message:"pm status not set properly", Data : {} ,Code:404}); 
      console.log("0000000000000000000000000000000 Error");
}
else if(req.body.preventive_check == null || req.body.preventive_check == '' || req.body.preventive_check == undefined){
      res.json({Status:"Failed",Message:"preventive check not set properly", Data : {} ,Code:404}); 
      console.log("0000000000000000000000000000000 Error");
}
else if(req.body.tech_signature == null || req.body.tech_signature == '' || req.body.tech_signature == undefined){
      res.json({Status:"Failed",Message:"tech signature not set properly", Data : {} ,Code:404}); 
      console.log("0000000000000000000000000000000 Error");
}
else if(req.body.user_mobile_no == null || req.body.user_mobile_no == '' || req.body.user_mobile_no == undefined){
      res.json({Status:"Failed",Message:"user mobile no not set properly", Data : {} ,Code:404}); 
      console.log("0000000000000000000000000000000 Error");
}
else if(req.body.mr_status == "yes"){
if(req.body.mr_1 == null || req.body.mr_1 == '' || req.body.mr_1 == undefined){
      res.json({Status:"Failed",Message:"mr 1 not set properly", Data : {} ,Code:404}); 
      console.log("0000000000000000000000000000000 Error");
} else {
    start_inserting(req);
}
} else {
    start_inserting(req);
}



async function start_inserting(req) {



var service_tab_submit_data_br_Model = require('./../models/service_tab_submit_data_br_Model');

var datas  =  await service_tab_submit_data_br_Model.findOne({job_id: req.body.job_id, comp_id:req.body.SMU_SCH_COMPNO, "serv_type" : "PREVENTIVE_CHANGE" });

if(datas == null){

console.log("******************* PREVENTIVE TEMP DATA STORE");

let a = {
"user_mobile_number" : req.body.user_mobile_no,
"upload_status" : "N",
"submitted_date_sys" :  new Date(),
"serv_type" : "PREVENTIVE_CHANGE",
"job_id" : req.body.job_id,
"comp_id" : req.body.SMU_SCH_COMPNO,
"data": [req.body],

}   
var submitted_one = await service_tab_submit_data_br_Model.create(a);

if(req.body.mr_1 == undefined){
res.json({Status:"Failed",Message:"Mr value not set properly, Re-enter the value again", Data : {} ,Code:404}); 
} else if(req.body.mr_2 == undefined){
res.json({Status:"Failed",Message:"Mr value not set properly, Re-enter the value again", Data : {} ,Code:404}); 
}
else {


const dates = require('date-and-time');
const now1  =  new Date();
const value1 = dates.format(now1,'YYYY-MM-DDTHH:mm:ss');
var job_details_two  =  await breakdown_managementModel.findOne({SMU_SCH_MECHCELL: req.body.user_mobile_no,SMU_SCH_COMPNO:req.body.SMU_SCH_COMPNO});
let datas = {
            JOB_END_TIME : ""+value1,
            JOB_STATUS : "Job Submitted",
            SMU_SCH_CHKLIST : ""+req.body.mr_status.toUpperCase(),
       }
        breakdown_managementModel.findByIdAndUpdate(job_details_two._id, datas, {new: true}, function (err, UpdatedDetails) {
            if (err) return res.json({Status:"Failed",Message:"Internal Server Error", Data : {},Code:500});
            res.json({Status:"Success",Message:"Preventive data submit successfully", Data : {} ,Code:200}); 

});
}


} else {
   
const dates = require('date-and-time');
const now1  =  new Date();
const value1 = dates.format(now1,'YYYY-MM-DDTHH:mm:ss');
var job_details_two  =  await breakdown_managementModel.findOne({SMU_SCH_MECHCELL: req.body.user_mobile_no,SMU_SCH_COMPNO:req.body.SMU_SCH_COMPNO});
let datas = {
            JOB_END_TIME : ""+value1,
            JOB_STATUS : "Job Submitted",
            SMU_SCH_CHKLIST : ""+req.body.mr_status.toUpperCase(),
       }
        breakdown_managementModel.findByIdAndUpdate(job_details_two._id, datas, {new: true}, function (err, UpdatedDetails) {
            if (err) return res.json({Status:"Failed",Message:"Internal Server Error", Data : {},Code:500});
            res.json({Status:"Success",Message:"Already Preventive data submit successfully", Data : {} ,Code:200}); 

});

}


}


});

////////////////////////////PM Submit Data////////////////////////////



////////////////////////////PM Submit Data Resubmit////////////////////////////


router.get('/submit_data_test_2_resubmit',async function (req, res) {


var service_tab_submit_data_br_Model = require('./../models/service_tab_submit_data_br_Model');
var submitted_data  =  await service_tab_submit_data_br_Model.findOne({"upload_status" : "N", "serv_type" : "PREVENTIVE_CHANGE"});
if(submitted_data == null){
} else {
req.body = submitted_data.data[0];

console.log("******************* PREVENTIVE AUTO SUBMITTED INSERTING");




//////check_session_availablity///////
oracledb.getConnection({
user: "JLSMART",
password: "JLSMART",
connectString: "(DESCRIPTION =(ADDRESS = (PROTOCOL = TCP)(HOST = 192.168.1.112)(PORT = 1521))(CONNECT_DATA =(SID = jlpl)))"
}, function(err, connection) {
if (err) {
// console.error(err.message);
return;
}
connection.execute(
"SELECT  GET_TABCOUNT USER_LIMIT FROM DUAL",
{},
{autoCommit: true},
function (err, result) {
if (err) { console.error(err.message);
doRelease(connection);
return;
}
doRelease(connection);
var ary = [];
for(let a = 0 ; a < result.rows.length ; a++){
var temp_data = result.rows[a];
var results = {}
for (var i = 0; i < result.metaData.length; ++i){
results[result.metaData[i].name] = temp_data[i];
}
ary.push(results);

if(a == result.rows.length - 1){
if(+ary[0].USER_LIMIT <  10){
check_and_delete_one(req);

service_tab_submit_data_br_Model.findByIdAndUpdate(submitted_data._id, {"upload_status" : "Y"}, {new: true}, function (err, UpdatedDetails) {
            if (err)return res.json({Status:"Failed",Message:"Internal Server Error", Data:err,Code:500});
             // res.json({Status:"Success",Message:"User management Updated", Data : {} ,Code:200});
});

} else {

res.json({Status:"Failed",Message:"Server Busy Try after 10 Sec", Data : {} ,Code:404}); 

}
}
} 
});
function doRelease(connection) {
connection.release(function(err) {
if (err) {
console.error(err.message);
}
}
);
}
});
//////check_session_availablity///////

  


async function check_and_delete_one(req){
// Delete Flow 
// Delete JLS_SERCALL_HDR_DNLOAD (Temp Solutions);
oracledb.getConnection({
user: "JLSMART",
password: "JLSMART",
connectString: "(DESCRIPTION =(ADDRESS = (PROTOCOL = TCP)(HOST = 192.168.1.112)(PORT = 1521))(CONNECT_DATA =(SID = jlpl)))"
}, function(err, connection) {
if (err) {
// console.error(err.message);
return;
}
connection.execute(
"Delete FROM JLS_SERCALL_HDR_DNLOAD WHERE JLS_SCH_COMPNO=:JLS_SCH_COMPNO",
{JLS_SCH_COMPNO : req.body.SMU_SCH_COMPNO},
{autoCommit: true},
function (err, result) {
if (err) { console.error(err.message);
doRelease(connection);
return;
}

console.log("******************* DELETED JLS_SERCALL_HDR_DNLOAD");


doRelease(connection);
check_and_delete_two(req);
});
function doRelease(connection) {
connection.release(function(err) {
if (err) {
console.error(err.message);
}
}
);
}
});
}


function check_and_delete_two(req){
oracledb.getConnection({
user: "JLSMART",
password: "JLSMART",
connectString: "(DESCRIPTION =(ADDRESS = (PROTOCOL = TCP)(HOST = 192.168.1.112)(PORT = 1521))(CONNECT_DATA =(SID = jlpl)))"
}, function(err, connection) {
if (err) {
// console.error(err.message);
return;
}
connection.execute(
"Delete FROM JLS_SERCALL_HDR_MR WHERE JLS_SCHM_COMPNO=:JLS_SCH_COMPNO",
{JLS_SCH_COMPNO : req.body.SMU_SCH_COMPNO},
{autoCommit: true},
function (err, result) {
if (err) { console.error(err.message);
doRelease(connection);
return;
}

console.log("******************* DELETED JLS_SERCALL_HDR_MR");


doRelease(connection);
insert_process(req);
});
function doRelease(connection) {
connection.release(function(err) {
if (err) {
console.error(err.message);
}
}
);
}
});
}


async function insert_process(req) {
const dates = require('date-and-time');
const now1  =  new Date();
const value1 = dates.format(now1,'YYYY-MM-DDTHH:mm:ss');
//submit value store to check//////
var service_submitted_valueModel = require('./../models/service_submitted_valueModel');
let a = {
"user_id" : req.body.user_mobile_no,
"job_id" : req.body.job_id,
"type" : "Preventive Maintance",
"date" : new Date(),
"datas" : [req.body],
};   
var submitted = await service_submitted_valueModel.create(a);
//preventive store vlaue to DB//////
request.post(
'http://smart.johnsonliftsltd.com:3000/api/preventive_data_management/create',
{ json: req.body},
function (error, response, body) {
if (!error && response.statusCode == 200) {
}
}
);
var job_details_two  =  await breakdown_managementModel.findOne({"SMU_SCH_COMPNO": req.body.SMU_SCH_COMPNO});
if(job_details_two.JOB_START_TIME == '' || job_details_two.JOB_START_TIME == undefined || job_details_two.JOB_START_TIME == null){
job_details_two.JOB_START_TIME = value1; 
}
else {
let now1  =  new Date(job_details_two.JOB_START_TIME);
let value1 = dates.format(now1,'YYYY-MM-DDTHH:mm:ss');
job_details_two.JOB_START_TIME = value1; 
}
if(job_details_two.JOB_END_TIME == '' || job_details_two.JOB_START_TIME == undefined || job_details_two.JOB_START_TIME == null) {
job_details_two.JOB_END_TIME = value1; 
}
else {
let now1  =  new Date(job_details_two.JOB_END_TIME);
let value1 = dates.format(now1,'YYYY-MM-DDTHH:mm:ss');
job_details_two.JOB_END_TIME = value1; 
}
var start_date = job_details_two.JOB_START_TIME.slice(0, 10);
var start_time = job_details_two.JOB_START_TIME.slice(11, 19);
const myArray1 = start_date.split("-");
var month_list = ["", "Jan", "Feb", "Mar", "Apr", "May", "Jun" ,"Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
start_date = ""+myArray1[2]+"-"+month_list[+myArray1[1]]+"-"+myArray1[0]
var end_date = job_details_two.JOB_END_TIME.slice(0, 10);
var end_time = job_details_two.JOB_END_TIME.slice(11, 19);
const myArray2 = end_date.split("-");
var month_list = ["", "Jan", "Feb", "Mar", "Apr", "May", "Jun" ,"Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
end_date = ""+myArray2[2]+"-"+month_list[+myArray2[1]]+"-"+myArray2[0]
var str = ""+req.body.preventive_check || "";
var job_details = job_details_two;  


console.log("******************* Feedback Insert");


var count = 0;
recall(req,count,job_details,start_date,start_time,end_date,end_time,str);
function recall(req,count,job_details,start_date,start_time,end_date,end_time,str){
// console.log(""+job_details.SMU_SCH_COMPNO,count,req.body.field_value_data.length);
if(count < req.body.field_value_data.length){
var element = req.body.field_value_data[count];
oracledb.getConnection({
user: "JLSMART",
password: "JLSMART",
connectString: "(DESCRIPTION =(ADDRESS = (PROTOCOL = TCP)(HOST = 192.168.1.112)(PORT = 1521))(CONNECT_DATA =(SID = jlpl)))"
}, function(err, connection) {
if (err) {
console.error(err.message);
return;
}
let da =
{
"JLS_SCHF_COMPNO": ""+job_details.SMU_SCH_COMPNO,
"JLS_SCHF_JOBNO": ""+job_details.SMU_SCH_JOBNO,
"JLS_SCHF_SERTYPE": "P",
"JLS_SCHF_CHKLISTTYPE": ""+req.body.job_status_type,
"JLS_SCHF_PARCODE": ""+element.field_cat_id,
"JLS_SCHF_ACTCODE": ""+element.field_group_id,
"JLS_SCHF_FDBK_RMRKS": ""+element.field_value,
"JLS_SCHF_PMRMRKS": "-",
"JLS_SCHF_ORCL_STATUS": "Y",
}
connection.execute(
"INSERT INTO JLS_SERCALLHDR_FEEDBK VALUES (:JLS_SCHF_COMPNO, :JLS_SCHF_JOBNO, :JLS_SCHF_SERTYPE, :JLS_SCHF_CHKLISTTYPE, :JLS_SCHF_PARCODE, :JLS_SCHF_ACTCODE, :JLS_SCHF_FDBK_RMRKS, :JLS_SCHF_PMRMRKS, :JLS_SCHF_ORCL_STATUS)",
da, // Bind values
{ autoCommit: true}, 
async   function (err, result) {
if (err) { 

console.error(err.message);
doRelease(connection);
let a = {
"job_no" : req.body.job_id || '',
"service_type" : "Service "+""+job_details.SMU_SCH_COMPNO,
"activity" : "Preventive Maintance",
"follow_detail":"JLS_SERCALLHDR_FEEDBK",
"url":"/submit_data_test_2",
"date_time" : new Date(),
"error_detail": [err.toString()],
"data" : [{req:req.body,req_2:da}],
"user_no" : req.body.user_mobile_no || ''
}   
var submitted = await error_log_oracelModel.create(a);
return;
}
doRelease(connection);
count = count + 1;
recall(req,count,job_details,start_date,start_time,end_date,end_time,str);
});
function doRelease(connection) {
connection.release(function(err) {
if (err) {
console.error(err.message);
}
}
);
}
});
}
else {

console.log("******************* Feedback List inserted");




if(""+req.body.mr_status.toUpperCase().substring(0, 1) !== 'N'){
console.log("******************* MR RISED");
mr_insert(job_details,req,start_date,start_time,end_date,end_time,str);
} else {
console.log("******************* MR NOT RISED");

work_time_status(job_details,req,start_date,start_time,end_date,end_time,str);

}
}
}
}






function mr_insert(job_details,req,start_date,start_time,end_date,end_time,str){

console.log("******************* MR ENG INSERT");

if(""+req.body.mr_status.toUpperCase().substring(0, 1) !== 'N'){
oracledb.getConnection({
user: "JLSMART",
password: "JLSMART",
connectString: "(DESCRIPTION =(ADDRESS = (PROTOCOL = TCP)(HOST = 192.168.1.112)(PORT = 1521))(CONNECT_DATA =(SID = jlpl)))"
}, function(err, connection) {
if (err) {
console.error(err.message);
return;
}
let das =
{
JLS_SCHM_COMPNO :  ""+job_details.SMU_SCH_COMPNO,
JLS_SCHM_JOBNO : ""+job_details.SMU_SCH_JOBNO,
JLS_SCHM_SERTYPE : "P",
JLS_SCHM_PREP_DATE : "",//sysdate
JLS_SCHM_VAN_ID : ""+job_details.SMU_SCH_VANID,
JLS_SCHM_STATUS : "NS",
JLS_SCHM_ORCL_STATUS : "N",
JLS_SCHM_ENGR_PHONE : ""+job_details.SMU_SCH_SUPCELLNO,
JLS_SCHM_ENGR_FLAG : "N",
JLS_SCHM_ERRDESC : "",
JLS_SCHM_AGENT_NAME : ""+job_details.SMU_SCH_CUSNAME,
JLS_SCHM_CUSTOMER_NAME : ""+job_details.SMU_SCH_CUSNAME,
JLS_SCHM_DWNFLAG : "N",
JLS_SCHM_BRCODE : ""+job_details.SMU_SCH_BRCODE,
JLS_SCHM_INSERTBY : "TAB_MOBILE"
}
connection.execute("INSERT INTO JLS_SERCALL_HDR_MR VALUES (:JLS_SCHM_COMPNO, :JLS_SCHM_JOBNO, :JLS_SCHM_SERTYPE, :JLS_SCHM_PREP_DATE, :JLS_SCHM_VAN_ID, :JLS_SCHM_STATUS, :JLS_SCHM_ORCL_STATUS, :JLS_SCHM_ENGR_PHONE, :JLS_SCHM_ENGR_FLAG, :JLS_SCHM_ERRDESC, :JLS_SCHM_AGENT_NAME, :JLS_SCHM_CUSTOMER_NAME, :JLS_SCHM_DWNFLAG, :JLS_SCHM_BRCODE, :JLS_SCHM_INSERTBY)",
das, // Bind values
{ autoCommit: true}, 
async   function (err, result) {
if (err) { console.error(err.message);
doRelease(connection);
let a = {
"job_no" : req.body.job_id || '',
"service_type" : "Service "+""+job_details.SMU_SCH_COMPNO,
"activity" : "Preventive Maintance",
"follow_detail":"JLS_SERCALL_HDR_MR",
"url":"/submit_data_test_2",
"date_time" : new Date(),
"error_detail": [err.toString()],
"data" : [{req:req.body,req_2:das}],
"user_no" : req.body.user_mobile_no || ''
}   
var submitted = await error_log_oracelModel.create(a);
return;
}
doRelease(connection);
insert_mr_details(job_details,req,start_date,start_time,end_date,end_time,str);
function doRelease(connection) {
connection.release(function(err) {
if (err) {
console.error(err.message);
}
}
);
}
});
});
}
}



function insert_mr_details(job_details,req,start_date,start_time,end_date,end_time,str){

console.log("******************* MR DETAILS INSERT");


if(req.body.mr_1 !== "" ){
mrvalue(1,req.body.mr_1);
}
if(req.body.mr_2 !== "" ){
mrvalue(2,req.body.mr_2);
}
if(req.body.mr_3 !== "" ){
mrvalue(3,req.body.mr_3);
}
if(req.body.mr_4 !== "" ){
mrvalue(4,req.body.mr_4);
}
if(req.body.mr_5 !== "" ){
mrvalue(5,req.body.mr_5);
}
if(req.body.mr_6 !== "" ){
mrvalue(6,req.body.mr_6);
}
if(req.body.mr_7 !== "" ){
mrvalue(7,req.body.mr_7);
}
if(req.body.mr_8 !== "" ){
mrvalue(8,req.body.mr_8);
}
if(req.body.mr_9 !== "" ){
mrvalue(9,req.body.mr_9);
}if(req.body.mr_10 !== "" ){
mrvalue(10,req.body.mr_10);
}
work_time_status(job_details,req,start_date,start_time,end_date,end_time,str);
function mrvalue(key,value){
////// FIVE Stage Completed ///////
oracledb.getConnection({
user: "JLSMART",
password: "JLSMART",
connectString: "(DESCRIPTION =(ADDRESS = (PROTOCOL = TCP)(HOST = 192.168.1.112)(PORT = 1521))(CONNECT_DATA =(SID = jlpl)))"
}, function(err, connection) {
if (err) {
console.error(err.message);
return;
}
let dass =
{
"JLS_SCDM_COMPNO": ""+job_details.SMU_SCH_COMPNO,
"JLS_SCDM_JOBNO": ""+job_details.SMU_SCH_JOBNO,
"JLS_SCDM_SERTYPE" : "P",
"JLS_SCDM_SLNO": key,
"JLS_SCDM_DESC": ""+value,
"JLS_SCDM_MR_QTY": 1,
}
connection.execute(
"INSERT INTO JLS_SERCALL_DTL_MR VALUES (:JLS_SCDM_COMPNO, :JLS_SCDM_JOBNO, :JLS_SCDM_SERTYPE, :JLS_SCDM_SLNO, :JLS_SCDM_DESC, :JLS_SCDM_MR_QTY)",
dass, // Bind values
{ autoCommit: true}, 
async   function (err, result) {
if (err) { console.error(err.message);
doRelease(connection);
let a = {
"job_no" : req.body.job_id || '',
"service_type" : "Service "+""+job_details.SMU_SCH_COMPNO,
"activity" : "Preventive Maintance",
"follow_detail":"JLS_SERCALL_DTL_MR",
"url":"/submit_data_test_2",
"date_time" : new Date(),
"error_detail": [err.toString()],
"data" : [{req:req.body,req_2:dass}],
"user_no" : req.body.user_mobile_no || ''
}   
var submitted = await error_log_oracelModel.create(a);
return;
}
doRelease(connection);
function doRelease(connection) {
connection.release(function(err) {
if (err) {
console.error(err.message);
}
}
);
}
});
});
}
}



function work_time_status(job_details,req,start_date,start_time,end_date,end_time,str) {

console.log("******************* WORK TIME INSERT");

oracledb.getConnection({
user: "JLSMART",
password: "JLSMART",
connectString: "(DESCRIPTION =(ADDRESS = (PROTOCOL = TCP)(HOST = 192.168.1.112)(PORT = 1521))(CONNECT_DATA =(SID = jlpl)))"
}, function(err, connection) {
if (err) {
console.error(err.message);
return;
}
let dass =
{
"JLS_SCH_COMPNO": ""+job_details.SMU_SCH_COMPNO,
"JLS_SCH_JOBNO": ""+job_details.SMU_SCH_JOBNO,
"JLS_SCH_SERTYPE" : "P",
"JLS_SCH_JOBSTARTTIME": ""+start_date+" "+start_time,
"JLS_SCH_JOBENDTIME": ""+end_date+" "+end_time,
"JLS_SCH_COMPSTATUS": ""+req.body.pm_status,
"JLS_SCH_TYP_BRKDWN": ""+req.body.mr_status,
"JLS_SCH_FEEDBACK": ""+req.body.action_req_customer,
"JLS_SCH_REMARKS": ""+str,
"JLS_SCH_MRTAG" : ""+req.body.mr_status.toUpperCase().substring(0, 1),
}

connection.execute(
"INSERT INTO JLS_SERCALL_HDR_DNLOAD VALUES (:JLS_SCH_COMPNO, :JLS_SCH_JOBNO, :JLS_SCH_SERTYPE, to_date(:JLS_SCH_JOBSTARTTIME, 'DD/MM/YYYY HH24:MI:SS'), to_date(:JLS_SCH_JOBENDTIME, 'DD/MM/YYYY HH24:MI:SS'), :JLS_SCH_COMPSTATUS, :JLS_SCH_TYP_BRKDWN, :JLS_SCH_FEEDBACK , :JLS_SCH_REMARKS, :JLS_SCH_MRTAG)",
dass, // Bind values
{ autoCommit: true}, 
async   function (err, result) {
if (err) { console.error(err.message);
doRelease(connection);
let a = {
"job_no" : req.body.job_id || '',
"service_type" : "Service "+""+job_details.SMU_SCH_COMPNO,
"activity" : "Preventive Maintance",
"follow_detail":"JLS_SERCALL_HDR_DNLOAD 2",
"url":"/submit_data_test_2",
"date_time" : new Date(),
"error_detail": [err.toString()],
"data" : [{req:req.body,req_2:dass}],
"user_no" : req.body.user_mobile_no || ''
}   
var submitted = await error_log_oracelModel.create(a);
return;
}
doRelease(connection);
update_oracle_stauts(job_details,req,start_date,start_time,end_date,end_time,str);
function doRelease(connection) {
connection.release(function(err) {
if (err) {
console.error(err.message);
}
}
);
}
});
});
}    




function update_oracle_stauts(job_details,req,start_date,start_time,end_date,end_time,str){

console.log("******************* ORACLE DETAIL INSERT");

oracledb.getConnection({
user: "JLSMART",
password: "JLSMART",
connectString: "(DESCRIPTION =(ADDRESS = (PROTOCOL = TCP)(HOST = 192.168.1.112)(PORT = 1521))(CONNECT_DATA =(SID = jlpl)))"
}, function(err, connection) {
if (err) {
console.error(err.message);
return;
}
let das =
{
JLS_SCHM_COMPNO :  ""+job_details.SMU_SCH_COMPNO,
}
connection.execute("UPDATE JLS_SERCALL_HDR_MR SET JLS_SCHM_ORCL_STATUS = 'Y' WHERE JLS_SCHM_COMPNO=:JLS_SCHM_COMPNO",
das, // Bind values
{ autoCommit: true}, 
async    function (err, result) {
if (err) { console.error(err.message);
doRelease(connection);
let a = {
"job_no" : req.body.job_id || '',
"service_type" : "Service "+""+job_details.SMU_SCH_COMPNO,
"activity" : "Preventive Maintance",
"follow_detail":"JLS_SERCALL_HDR_MR",
"url":"/submit_data_test_2",
"date_time" : new Date(),
"error_detail": [err.toString()],
"data" : [{req:req.body,req_2:{JLS_SCHM_COMPNO :  ""+job_details.SMU_SCH_COMPNO,}}],
"user_no" : req.body.user_mobile_no || ''
}   
var submitted = await error_log_oracelModel.create(a);
return;
}
doRelease(connection);
function doRelease(connection) {
connection.release(function(err) {
if (err) {
console.error(err.message);
}
}
);
}
});
});
res.json({Status:"Success",Message:"Preventive data submit successfully", Data : {} ,Code:200}); 
} 

}
});



////////////////////////////PM Submit Data Resubmit////////////////////////////





////////////////////////////PM MR Submit Data////////////////////////////

router.post('/service_mr_eng_mrlist_submit_test_2',async function (req, res) {

var service_tab_submit_data_br_Model = require('./../models/service_tab_submit_data_br_Model');
var datas  =  await service_tab_submit_data_br_Model.findOne({job_id: req.body.jobId, comp_id:req.body.SMU_SCH_COMPNO, "serv_type" : "PREVENTIVE_MR" });
var job_details  =  await breakdown_mr_data_managementModel.findOne({JLS_SCHM_COMPNO:req.body.SMU_SCH_COMPNO});

if(datas == null){

let a = {
"user_mobile_number" : req.body.user_mobile_no,
"upload_status" : "N",
"submitted_date_sys" :  new Date(),
"serv_type" : "PREVENTIVE_MR",
"job_id" : req.body.jobId,
"comp_id" : req.body.SMU_SCH_COMPNO,
"data": [req.body],
}   

var submitted_one = await service_tab_submit_data_br_Model.create(a);
let request_value = {
JLS_SCH_COMPNO : ""+job_details.JLS_SCHM_COMPNO,
JLS_SCCM_JOBNO : ""+job_details.JLS_SCHM_JOBNO,
}

request.post(
'http://smart.johnsonliftsltd.com:3000/api/breakdown_data_management/update_oracle_status',
{ json: request_value},
function (error, response, body) {
if (!error && response.statusCode == 200) {
    res.json({Status:"Success",Message:"MR SUBMITTED SUCCESSFULLY", Data : {} ,Code:200});  
}
}
);
 
} else {

let request_value = {
JLS_SCH_COMPNO : ""+job_details.JLS_SCHM_COMPNO,
JLS_SCCM_JOBNO : ""+job_details.JLS_SCHM_JOBNO,
}

request.post(
'http://smart.johnsonliftsltd.com:3000/api/breakdown_data_management/update_oracle_status',
{ json: request_value},
function (error, response, body) {
if (!error && response.statusCode == 200) {
    res.json({Status:"Success",Message:"ALREADY MR SUBMITTED SUCCESSFULLY", Data : {} ,Code:200});  
}
}
);
}
});

////////////////////////////PM MR Submit Data////////////////////////////


////////////////////////////MR PM Submit Data Resubmit////////////////////////////


router.get('/service_mr_eng_mrlist_submit_test_2_resubmit',async function (req, res) {
var service_tab_submit_data_br_Model = require('./../models/service_tab_submit_data_br_Model');
var submitted_data  =  await service_tab_submit_data_br_Model.findOne({"upload_status" : "N", "serv_type" : "PREVENTIVE_MR"});
if(submitted_data == null){
} else {
req.body = submitted_data.data[0];
service_tab_submit_data_br_Model.findByIdAndUpdate(submitted_data._id, {"upload_status" : "Y"}, {new: true}, function (err, UpdatedDetails) {
            if (err)return res.json({Status:"Failed",Message:"Internal Server Error", Data:err,Code:500});
             // res.json({Status:"Success",Message:"User management Updated", Data : {} ,Code:200});
});

console.log("******************* MR PREVENTIVE AUTO SUBMITTED INSERTING ");


//////check_session_availablity///////
oracledb.getConnection({
user: "JLSMART",
password: "JLSMART",
connectString: "(DESCRIPTION =(ADDRESS = (PROTOCOL = TCP)(HOST = 192.168.1.112)(PORT = 1521))(CONNECT_DATA =(SID = jlpl)))"
},async function(err, connection) {
if (err) {
// console.error(err.message);
return;
}
connection.execute(
"SELECT  GET_TABCOUNT USER_LIMIT FROM DUAL",
{},
{autoCommit: true},
async function (err, result) {
if (err) { console.error(err.message);
doRelease(connection);
return;
}
doRelease(connection);
var ary = [];
for(let a = 0 ; a < result.rows.length ; a++){
var temp_data = result.rows[a];
var results = {}
for (var i = 0; i < result.metaData.length; ++i){
results[result.metaData[i].name] = temp_data[i];
}
ary.push(results);

if(a == result.rows.length - 1){
if(+ary[0].USER_LIMIT <  10){
//////flow End///////    
var service_submitted_valueModel = require('./../models/service_submitted_valueModel');
let a = {
"user_id" : req.body.user_mobile_no,
"job_id" : req.body.jobId,
"type" : "Preventive MR Approval",
"date" : new Date(),
"datas" : [req.body],
}   
var submitted = await service_submitted_valueModel.create(a);  
const arr = req.body.mr_data;
const ids = arr.map(o => o.partno)
const filtered = arr.filter(({partno}, index) => !ids.includes(partno, index + 1))
req.body.mr_data = filtered;
const dates = require('date-and-time');
const now1  =  new Date();
const value1 = dates.format(now1,'YYYY-MM-DDTHH:mm:ss');
var job_details  =  await breakdown_mr_data_managementModel.findOne({JLS_SCHM_COMPNO:req.body.SMU_SCH_COMPNO});
let datas = {
JOB_END_TIME : ""+value1,
JOB_STATUS : "Job Submitted"
}
breakdown_mr_data_managementModel.findByIdAndUpdate(job_details._id, datas, {new: true}, function (err, UpdatedDetails) {
if (err) return res.json({Status:"Failed",Message:"Internal Server Error", Data : {},Code:500});
});
var job_details  =  await breakdown_managementModel.findOne({SMU_SCH_COMPNO:req.body.SMU_SCH_COMPNO});
recall(0,req,job_details);
console.log("*******************  MR ITEM INSERTING");
function recall(index,req,job_details){
if(index < req.body.mr_data.length){
oracledb.getConnection({
user: "JLSMART",
password: "JLSMART",
connectString: "(DESCRIPTION =(ADDRESS = (PROTOCOL = TCP)(HOST = 192.168.1.112)(PORT = 1521))(CONNECT_DATA =(SID = jlpl)))"
}, function(err, connection) {
if (err) {
console.error(err.message);
return;
}
let dass =
{
"JLS_SCCM_COMPNO": ""+job_details.SMU_SCH_COMPNO,
"JLS_SCCM_JOBNO": ""+job_details.SMU_SCH_JOBNO,
"JLS_SCCM_SERTYPE" : "P",
"JLS_SCCM_SEQNO": index+1,
"JLS_SCCM_MATLID": ""+req.body.mr_data[index].partno,
"JLS_SCCM_QTY": ""+req.body.mr_data[index].req,
"JLS_SCCM_MRSEQNO" : ""
}
connection.execute(
"INSERT INTO JLS_SERCALL_CHILD_MR VALUES (:JLS_SCCM_COMPNO, :JLS_SCCM_JOBNO, :JLS_SCCM_SERTYPE, :JLS_SCCM_SEQNO, :JLS_SCCM_MATLID, :JLS_SCCM_QTY, :JLS_SCCM_MRSEQNO)",
dass, // Bind values
{ autoCommit: true}, 
async    function (err, result) {
if (err) { console.error(err.message);
let a = {
"job_no" : ""+job_details.SMU_SCH_JOBNO || '',
"service_type" : "Service",
"activity" : "Preventive Maintance",
"follow_detail":"JLS_SERCALL_CHILD_MR",
"url":"/service_mr_eng_mrlist_submit_test2",
"date_time" : new Date(),
"error_detail": [err.toString()],
"data" : [{req:req.body,req_2:dass}],
"user_no" : ""
}   
var submitted = await error_log_oracelModel.create(a);
doRelease(connection);
return;
}
doRelease(connection);
index = index + 1;
recall(index,req,job_details);
});
function doRelease(connection) {
connection.release(function(err) {
if (err) {
console.error(err.message);
}
}
);
}
});
} else {
update_mr_tag(req,job_details);
}
}




function update_mr_tag(req,job_details){
console.log(' ******** MR TAG UPDATED ****************');
oracledb.getConnection({
user: "JLSMART",
password: "JLSMART",
connectString: "(DESCRIPTION =(ADDRESS = (PROTOCOL = TCP)(HOST = 192.168.1.112)(PORT = 1521))(CONNECT_DATA =(SID = jlpl)))"
}, function(err, connection) {
if (err) {
// console.error(err.message);
return;
}
connection.execute(
"UPDATE JLS_SERCALL_HDR_DNLOAD set JLS_SCH_MRTAG='M' WHERE JLS_SCH_COMPNO=:JLS_SCH_COMPNO",
{
JLS_SCH_COMPNO : ""+job_details.SMU_SCH_COMPNO
},
{autoCommit: true},
async   function (err, result_one) {
if (err) { console.error(err.message);
let a = {
"job_no" : ""+job_details.SMU_SCH_JOBNO || '',
"service_type" : "Service",
"activity" : "Preventive Maintance UPDATE",
"follow_detail":"JLS_SERCALL_HDR_DNLOAD",
"url":"/service_mr_eng_mrlist_submit_test2",
"date_time" : new Date(),
"error_detail": [err.toString()],
"data" : [req.body],
"user_no" : ""
}   
var submitted = await error_log_oracelModel.create(a);
doRelease(connection);
return;
}
doRelease(connection);
job_work_status_update(req,job_details);
function doRelease(connection) {
connection.release(function(err) {
if (err) {
console.error(err.message);
}
}
);
}
});
});
}


function job_work_status_update(req,job_details){
console.log(' ******** Job Update Value ****************');
res.json({Status:"Success",Message:"MR SUBMITTED SUCCESSFULLY", Data : {} ,Code:200});  
}

} 
else {

res.json({Status:"Failed",Message:"Server Busy Try after 10 Sec", Data : {} ,Code:404}); 
}

}
} 
});
function doRelease(connection) {
connection.release(function(err) {
if (err) {
console.error(err.message);
}
}
);
}
});
//////check_session_availablity///////  

}
});

////////////////////////////MR PM Submit Data Resubmit////////////////////////////





////////////////////////PM UPDATE JOB STATUS////////////////////

router.post('/job_work_status_update',async function (req, res) {

console.log("******************* WWWWWWWWWWWW ***********",req.body);


const dates = require('date-and-time');
const now1  =  new Date();
const value1 = dates.format(now1,'YYYY-MM-DDTHH:mm:ss');
var statuss = 0;
var job_details  =  await breakdown_managementModel.findOne({SMU_SCH_JOBNO:req.body.job_id,SMU_SCH_COMPNO:req.body.SMU_SCH_COMPNO});



if(req.body.Status == 'Job Started'){
let da = {
JOB_STATUS : req.body.Status,
JOB_VIEW_STATUS : "Viewed",
JOB_START_TIME : ""+value1,
JOB_END_TIME : ""+value1,
LAST_UPDATED_TIME : ""+value1,
}
statuss = 1;
breakdown_managementModel.findByIdAndUpdate(job_details._id, da, {new: true}, function (err, UpdatedDetails) {
if (err) return res.json({Status:"Failed",Message:"Internal Server Error", Data : {},Code:500});
res.json({Status:"Success",Message:"Update successfully", time:UpdatedDetails.JOB_START_TIME,  Data : {} ,Code:200});
}); 
}
else if(req.body.Status == 'Job Stopped'){
let da = {
JOB_STATUS : req.body.Status,
JOB_END_TIME : ""+value1,
LAST_UPDATED_TIME : ""+value1,
}
statuss = 4;
breakdown_managementModel.findByIdAndUpdate(job_details._id, da, {new: true}, function (err, UpdatedDetails) {



if (err) return res.json({Status:"Failed",Message:"Internal Server Error", Data : {},Code:500});
res.json({Status:"Success",Message:"Update successfully",time:UpdatedDetails.JOB_START_TIME, Data : {} ,Code:200});
}); 
}
else if(req.body.Status == 'Job Paused'){
let da = {
JOB_STATUS : req.body.Status,
LAST_UPDATED_TIME : ""+value1,
JOB_END_TIME : ""+value1,
}
statuss = 2;
breakdown_managementModel.findByIdAndUpdate(job_details._id, da, {new: true}, function (err, UpdatedDetails) {
if (err) return res.json({Status:"Failed",Message:"Internal Server Error", Data : {},Code:500});
res.json({Status:"Success",Message:"Update successfully",time:UpdatedDetails.JOB_START_TIME, Data : {} ,Code:200});
}); 
}
else if(req.body.Status == 'Job Resume'){
let da = {
JOB_STATUS : req.body.Status,
LAST_UPDATED_TIME : ""+value1,
JOB_END_TIME : ""+value1,
}
statuss = 3;
breakdown_managementModel.findByIdAndUpdate(job_details._id, da, {new: true}, function (err, UpdatedDetails) {
if (err) return res.json({Status:"Failed",Message:"Internal Server Error", Data : {},Code:500});
res.json({Status:"Success",Message:"Update successfully", time:UpdatedDetails.JOB_START_TIME,Data : {} ,Code:200});
}); 
}   

var location_tracking_job_wiseModel = require('./../models/location_tracking_job_wiseModel');
let a = {
"job_no" : req.body.job_id,
"complaint_no" : req.body.SMU_SCH_COMPNO,
"user_mobile_no" : req.body.user_mobile_no,
"location_text" : req.body.JOB_LOCATION,
"loc_lat" : req.body.JOB_START_LAT,
"loc_long" : req.body.JOB_START_LONG,
"date" : new Date(),
"km" : "Preventive Maintance",
"remarks" : req.body.Status,
}   
var submitted = await location_tracking_job_wiseModel.create(a); 


let cc = {
user_mobile_no : req.body.user_mobile_no,
job_no : req.body.job_id,
complaint_no : req.body.SMU_SCH_COMPNO,
status : statuss,
service_name : "PM"
}
request.post(
'http://smart.johnsonliftsltd.com:3000/api/service_userdetails/update_pause_resume_time',
{ json: cc},
function (error, response, body) {
if (!error && response.statusCode == 200) {
}
}
);
});

////////////////////////PM UPDATE JOB STATUS////////////////////


////////////////////////PM MR UPDATE JOB STATUS////////////////////


router.post('/mr_job_work_status_update',async function (req, res) {         
const dates = require('date-and-time');
const now1  =  new Date();
const value1 = dates.format(now1,'YYYY-MM-DDTHH:mm:ss');
var statuss = 0;
var job_details  =  await breakdown_mr_data_managementModel.findOne({JLS_SCHM_JOBNO:req.body.job_id,JLS_SCHM_SERTYPE:req.body.SMU_SCH_SERTYPE,JLS_SCHM_COMPNO:req.body.SMU_SCH_COMPNO});
if(req.body.Status == 'Job Started'){
let da = {
JOB_STATUS : req.body.Status,
JOB_VIEW_STATUS : "Viewed",
JOB_START_TIME : ""+value1,
JOB_END_TIME : ""+value1
}
statuss = 1;
breakdown_mr_data_managementModel.findByIdAndUpdate(job_details._id, da, {new: true}, function (err, UpdatedDetails) {
if (err) return res.json({Status:"Failed",Message:"Internal Server Error", Data : {},Code:500});
res.json({Status:"Success",Message:"Update successfully", Data : {} ,Code:200});
}); 
}else if(req.body.Status == 'Job Stopped'){
let da = {
JOB_STATUS : req.body.Status,
JOB_END_TIME : ""+value1,
LAST_UPDATED_TIME : ""+value1,
}
statuss = 4;
breakdown_mr_data_managementModel.findByIdAndUpdate(job_details._id, da, {new: true}, function (err, UpdatedDetails) {
if (err) return res.json({Status:"Failed",Message:"Internal Server Error", Data : {},Code:500});
res.json({Status:"Success",Message:"Update successfully", Data : {} ,Code:200});
}); 
}else if(req.body.Status == 'Job Paused'){
let da = {
JOB_STATUS : req.body.Status,
LAST_UPDATED_TIME : ""+value1, 
}
statuss = 4;
breakdown_mr_data_managementModel.findByIdAndUpdate(job_details._id, da, {new: true}, function (err, UpdatedDetails) {
if (err) return res.json({Status:"Failed",Message:"Internal Server Error", Data : {},Code:500});
res.json({Status:"Success",Message:"Update successfully", Data : {} ,Code:200});
}); 
}   
else if(req.body.Status == 'Job Resume'){
let da = {
JOB_STATUS : req.body.Status,
LAST_UPDATED_TIME : ""+value1,
}
statuss = 3;
breakdown_mr_data_managementModel.findByIdAndUpdate(job_details._id, da, {new: true}, function (err, UpdatedDetails) {
if (err) return res.json({Status:"Failed",Message:"Internal Server Error", Data : {},Code:500});
res.json({Status:"Success",Message:"Update successfully", Data : {} ,Code:200});
}); 
}   

///////////update pause resume time//////////////

let cc = {
user_mobile_no : req.body.user_mobile_no,
job_no : req.body.job_id,
complaint_no : req.body.SMU_SCH_COMPNO,
status : statuss,
service_name : "PR"
}
request.post(
'http://smart.johnsonliftsltd.com:3000/api/service_userdetails/update_pause_resume_time',
{ json: cc},
function (error, response, body) {
if (!error && response.statusCode == 200) {
}
}
);
});




////////////////////////PM MR UPDATE JOB STATUS////////////////////


//////////////////////PM CHECK STATUS/////////////////////////


router.post('/check_work_status',async function (req, res) {
var job_details  =  await breakdown_managementModel.findOne({SMU_SCH_JOBNO:req.body.job_id,SMU_SCH_SERTYPE : req.body.SMU_SCH_SERTYPE,SMU_SCH_COMPNO:req.body.SMU_SCH_COMPNO});
res.json({Status:"Success", Message:job_details.JOB_STATUS, time:job_details.JOB_START_TIME,  Data : {} ,Code:200});
});


//////////////////////PM CHECK STATUS/////////////////////////


//////////////////////PM MR CHECK STATUS/////////////////////////

router.post('/service_mr_check_work_status',async function (req, res) {

var job_details  =  await breakdown_mr_data_managementModel.findOne({JLS_SCHM_COMPNO: req.body.SMU_SCH_COMPNO});
    res.json({Status:"Success", Message:job_details.JOB_STATUS, time:job_details.JOB_START_TIME,  Data : {} ,Code:200});
});

//////////////////////PM MR CHECK STATUS/////////////////////////



module.exports = router;
