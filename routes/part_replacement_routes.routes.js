var express = require('express');
var router = express.Router();
var bodyParser = require('body-parser');
router.use(bodyParser.urlencoded({ extended: false }));
router.use(bodyParser.json());
var preventive_data_managementModel = require('./../models/preventive_data_managementModel');
var breakdown_managementModel = require('./../models/breakdown_managementModel');


var oracledb = require('oracledb');
var part_reply_service_managementModel = require('./../models/part_reply_service_managementModel');

var part_reply_data_submitModel = require('./../models/part_reply_data_submitModel');



var oracledb = require('oracledb');
var request = require("request");




router.post('/create',async function(req, res) {

const dates = require('date-and-time');
const now1  =  new Date();
const value1 = dates.format(now1,'YYYY-MM-DDTHH:mm:ss');


var job_details_two  =  await breakdown_managementModel.findOne({SMU_SCH_MECHCELL: req.body.user_mobile_no,SMU_SCH_JOBNO:req.body.job_id});
  try{
  await preventive_data_managementModel.create({
  action_req_customer:  req.body.action_req_customer,
  customer_name : req.body.customer_name,
  customer_number : req.body.customer_number,
  customer_signature : req.body.customer_signature,
  field_value : req.body.field_value,
  job_id : req.body.job_id,
  job_status_type : req.body.job_status_type,
  mr_1 : req.body.mr_1,
  mr_2 : req.body.mr_2,
  mr_3 : req.body.mr_3,
  mr_4 : req.body.mr_4,
  mr_5 : req.body.mr_5,
  mr_6 : req.body.mr_6,
  mr_7 : req.body.mr_7,
  mr_8 : req.body.mr_8,
  mr_9 : req.body.mr_9,
  mr_10 :req.body.mr_10,
  mr_status : req.body.mr_status,
  pm_status : req.body.pm_status,
  preventive_check : req.body.preventive_check,
  tech_signature : req.body.tech_signature,
  user_mobile_no : req.body.user_mobile_no
        },async function (err, user) {
       let datas = {
            JOB_END_TIME : ""+value1,
            JOB_STATUS : "Job Submitted"
       }
        breakdown_managementModel.findByIdAndUpdate(job_details_two._id, datas, {new: true}, function (err, UpdatedDetails) {
            if (err) return res.json({Status:"Failed",Message:"Internal Server Error", Data : {},Code:500});
        });
        });
}
catch(e){
      res.json({Status:"Failed",Message:"Internal Server Error", Data : {},Code:500});
}
});





router.post('/service_prtrpmt_job_status_count',async function (req, res) {
var bd_paused_count  =  await part_reply_service_managementModel.count({SMU_ACK_MOBILENO: req.body.user_mobile_no,'JOB_STATUS': {$nin : ["Job Started", "Job Stopped" , "Not Started", "Job Submitted", "Job Deleted"]}});
        let a  = {
            paused_count : bd_paused_count
        }
       res.json({Status:"Success",Message:"Job status count", Data : a ,Code:200});
});






router.post('/branch_head/service_prtrpmt_job_status_count',async function (req, res) {
var bd_paused_count  =  await part_reply_service_managementModel.count({SMU_ACK_BRCODE: req.body.br_code,'JOB_STATUS': {$nin : ["Job Started", "Job Stopped" , "Not Started", "Job Submitted", "Job Deleted"]}});
        let a  = {
            paused_count : bd_paused_count
        }
       res.json({Status:"Success",Message:"Job status count", Data : a ,Code:200});
});







router.post('/fetch_data_from_oracle_part_replacement',async function (req, res) {
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
    "SELECT DISTINCT SMU_ACK_BRID, SMU_ACK_MRSEQNO, SMU_ACK_ISSEQNO, SMU_ACK_COMPNO, SMU_ACK_JOBNO, SMU_ACK_REQNO, SMU_ACK_SERTYPE, SMU_ACK_ECODE,  SMU_ACK_DCNO, SMU_ACK_DCDT, SMU_ACK_ENGRNAME, SMU_ACK_ADDRESS1, SMU_ACK_ADDRESS2, SMU_ACK_ADDRESS3, SMU_ACK_ADDRESS4, SMU_ACK_APINCODE, SMU_ACK_MOBILENO, SMU_ACK_STATUS FROM JLS_ACK_UPLOAD WHERE  SMU_ACK_MOBILENO=:SMU_SCH_MECHCELL and NVL(SMU_ACK_STATUS,'N')<> 'Y'",
            // "SELECT * FROM JLS_ACK_UPLOAD WHERE SMU_ACK_MOBILENO=:SMU_SCH_MECHCELL AND NVL(SMU_ACK_STATUS,'N') = 'N'",
            { 
              SMU_SCH_MECHCELL:+req.body.user_mobile_no
            },
        {autoCommit: true},async function (err, result) {
    if (err) { console.error(err.message);
          doRelease(connection);
          return;
     }
var ary = [];
if(result.rows.length == 0){
 res.json({Status:"Success",Message:"User Details", Data : {} ,Code:200});
}else{
for(let a = 0 ; a < result.rows.length; a++){
var temp_data = result.rows[a];
var results = {}
for (var i = 0; i < result.metaData.length; ++i){
results[result.metaData[i].name] = temp_data[i];
}

  var datass  =  await part_reply_service_managementModel.findOne({SMU_ACK_COMPNO:results.SMU_ACK_COMPNO,SMU_ACK_JOBNO:results.SMU_ACK_JOBNO});
   if(datass == null){

const dates = require('date-and-time');
const now1  =  new Date();
const value1 = dates.format(now1,'YYYY-MM-DDTHH:mm:ss');


  try{
  await part_reply_service_managementModel.create({
  SMU_ACK_BRID:  results.SMU_ACK_BRID,
  SMU_ACK_MRSEQNO:  results.SMU_ACK_MRSEQNO,
  SMU_ACK_ISSEQNO:  results.SMU_ACK_ISSEQNO,
  SMU_ACK_COMPNO:  results.SMU_ACK_COMPNO,
  SMU_ACK_JOBNO:  results.SMU_ACK_JOBNO,
  SMU_ACK_REQNO: results.SMU_ACK_REQNO,
  SMU_ACK_SERTYPE: results.SMU_ACK_SERTYPE,
  SMU_ACK_ECODE:  results.SMU_ACK_ECODE,
  SMU_ACK_MRMATLID :  "",
  SMU_ACK_ISSMATLID :  "",
  SMU_ACK_PARTNAME :  "",
  SMU_ACK_DCNO :  results.SMU_ACK_DCNO,
  SMU_ACK_DCDT :  results.SMU_ACK_DCDT,
  SMU_ACK_ENGRNAME :  results.SMU_ACK_ENGRNAME,
  SMU_ACK_ADDRESS1 :  results.SMU_ACK_ADDRESS1,
  SMU_ACK_ADDRESS2 :  results.SMU_ACK_ADDRESS2,
  SMU_ACK_ADDRESS3 :  results.SMU_ACK_ADDRESS3,
  SMU_ACK_ADDRESS4 :  results.SMU_ACK_ADDRESS4,
  SMU_ACK_APINCODE :  results.SMU_ACK_APINCODE,
  SMU_ACK_MOBILENO :  results.SMU_ACK_MOBILENO,
  SMU_ACK_STATUS :  results.SMU_ACK_STATUS,
  SMU_ACK_VANID :  results.SMU_ACK_VANID,
  SMU_ACK_ISSQTY :  results.SMU_ACK_ISSQTY,
  SMU_ACK_ERRDESC :  results.SMU_ACK_ERRDESC,
  JOB_STATUS : 'Not Started',
  JOB_VIEW_STATUS : 'Not Viewed',
  LAST_UPDATED_TIME : ""+value1,
  JOB_START_TIME :  ""+value1,
  JOB_END_TIME :  ""+value1,
JOB_LOCATION : "",
JOB_START_LAT : "",
JOB_START_LONG : "",

        },async function (err, user) {
        });
}
catch(e){
    }  // res.json({Status:"Failed",Message:"Internal Server Error", Data : {},Code:500});
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
            "UPDATE JLS_ACK_UPLOAD set SMU_ACK_STATUS='Y' WHERE SMU_ACK_MOBILENO=:SMU_SEN_MOBILENO and NVL(SMU_ACK_STATUS,'N')<> 'Y'",
            {
                SMU_SEN_MOBILENO:req.body.user_mobile_no
            },
        {autoCommit: true},
        function (err, result_one) {
    if (err) { console.error(err.message);
          // doRelease(connection);
          return;
     }
    });
});
     res.json({Status:"Success",Message:"LR Added", Data : {},Code:200});
 }
}
}
});
});
});


// ******************************************************************************************************************************************************************************
// SERVICE PART REPLACEMENT JOB DETAILS BY DATE WISE - ADMIN PANEL
// ******************************************************************************************************************************************************************************


router.post('/pr_date_wise_filter',async function (req, res) {
var job_details  =  await part_reply_service_managementModel.find({JOB_STATUS:{$in : ["Job Started", "Job Stopped","Not Started","Job Paused"]}});
let a = [];
  // console.log(req.body);
job_details.forEach(element => {
  var check = new Date(element.SMU_ACK_DCDT);
  var from = new Date(req.body.from_date);
  var to = new Date(req.body.to_date);
  if(check > from && check < to){
  a.push({
            job_id : element.SMU_ACK_JOBNO,
            customer_name : element.SMU_ACK_ENGRNAME,
            pm_date : element.SMU_ACK_DCDT,
            SMU_SCH_BRCODE :element.SMU_ACK_BRID,
            SMU_SCH_MECHCELL :element.SMU_ACK_MOBILENO,
            status : "Active",
            JOB_STATUS: element.JOB_STATUS,
            SMU_SCH_COMPNO: element.SMU_ACK_COMPNO,
            SMU_SCH_SERTYPE : element.SMU_ACK_SERTYPE,
            _id : element._id,
            delete_status : false
  });
}
});
res.json({Status:"Success",Message:"New Job List", Data : a ,Code:200});
});





router.post('/fetch_data_from_oracle_part_replacement_pull',async function (req, res) {
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
    "SELECT DISTINCT SMU_ACK_BRID, SMU_ACK_MRSEQNO, SMU_ACK_ISSEQNO, SMU_ACK_COMPNO, SMU_ACK_JOBNO, SMU_ACK_REQNO, SMU_ACK_SERTYPE, SMU_ACK_ECODE,  SMU_ACK_DCNO, SMU_ACK_DCDT, SMU_ACK_ENGRNAME, SMU_ACK_ADDRESS1, SMU_ACK_ADDRESS2, SMU_ACK_ADDRESS3, SMU_ACK_ADDRESS4, SMU_ACK_APINCODE, SMU_ACK_MOBILENO, SMU_ACK_STATUS FROM JLS_ACK_UPLOAD",
            // "SELECT * FROM JLS_ACK_UPLOAD WHERE SMU_ACK_MOBILENO=:SMU_SCH_MECHCELL AND NVL(SMU_ACK_STATUS,'N') = 'N'",
            {},
        {autoCommit: true},async function (err, result) {
    if (err) { console.error(err.message);
          doRelease(connection);
          return;
     }
var ary = [];
if(result.rows.length == 0){
 res.json({Status:"Success",Message:"User Details", Data : {} ,Code:200});
}else{
for(let a = 0 ; a < result.rows.length; a++){
var temp_data = result.rows[a];
var results = {}
for (var i = 0; i < result.metaData.length; ++i){
results[result.metaData[i].name] = temp_data[i];
}
  var datass  =  await part_reply_service_managementModel.findOne({SMU_ACK_COMPNO:results.SMU_ACK_COMPNO,SMU_ACK_JOBNO:results.SMU_ACK_JOBNO});
   if(datass == null){
const dates = require('date-and-time');
const now1  =  new Date();
const value1 = dates.format(now1,'YYYY-MM-DDTHH:mm:ss');


  try{
  await part_reply_service_managementModel.create({
  SMU_ACK_BRID:  results.SMU_ACK_BRID,
  SMU_ACK_MRSEQNO:  results.SMU_ACK_MRSEQNO,
  SMU_ACK_ISSEQNO:  results.SMU_ACK_ISSEQNO,
  SMU_ACK_COMPNO:  results.SMU_ACK_COMPNO,
  SMU_ACK_JOBNO:  results.SMU_ACK_JOBNO,
  SMU_ACK_REQNO: results.SMU_ACK_REQNO,
  SMU_ACK_SERTYPE: results.SMU_ACK_SERTYPE,
  SMU_ACK_ECODE:  results.SMU_ACK_ECODE,
  SMU_ACK_MRMATLID :  "",
  SMU_ACK_ISSMATLID :  "",
  SMU_ACK_PARTNAME :  "",
  SMU_ACK_DCNO :  results.SMU_ACK_DCNO,
  SMU_ACK_DCDT :  results.SMU_ACK_DCDT,
  SMU_ACK_ENGRNAME :  results.SMU_ACK_ENGRNAME,
  SMU_ACK_ADDRESS1 :  results.SMU_ACK_ADDRESS1,
  SMU_ACK_ADDRESS2 :  results.SMU_ACK_ADDRESS2,
  SMU_ACK_ADDRESS3 :  results.SMU_ACK_ADDRESS3,
  SMU_ACK_ADDRESS4 :  results.SMU_ACK_ADDRESS4,
  SMU_ACK_APINCODE :  results.SMU_ACK_APINCODE,
  SMU_ACK_MOBILENO :  results.SMU_ACK_MOBILENO,
  SMU_ACK_STATUS :  results.SMU_ACK_STATUS,
  SMU_ACK_VANID :  results.SMU_ACK_VANID,
  SMU_ACK_ISSQTY :  results.SMU_ACK_ISSQTY,
  SMU_ACK_ERRDESC :  results.SMU_ACK_ERRDESC,
  JOB_STATUS : 'Not Started',
  JOB_VIEW_STATUS : 'Not Viewed',
  LAST_UPDATED_TIME : ""+value1,
  JOB_START_TIME :  ""+value1,
  JOB_END_TIME :  ""+value1,
  JOB_LOCATION : "",
JOB_START_LAT : "",
JOB_START_LONG : "",
        },async function (err, user) {
        });
}
catch(e){
    }  // res.json({Status:"Failed",Message:"Internal Server Error", Data : {},Code:500});
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
            "UPDATE JLS_ACK_UPLOAD set SMU_ACK_STATUS='Y' WHERE NVL(SMU_ACK_STATUS,'N')='N'",
            {
            },
        {autoCommit: true},
        function (err, result_one) {
    if (err) { console.error(err.message);
          // doRelease(connection);
          return;
     }
    });
});
     res.json({Status:"Success",Message:"LR Added", Data : {},Code:200});
 }
}
}
});
});
});


// ******************************************************************************************************************************************************************************
// SERVICE PART REPLACEMENT JOB DETAILS MATERIAL LIST - ADMIN PANEL
// ******************************************************************************************************************************************************************************

router.post('/service_prtrpmt_marterial_list', function (req, res) {
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
            "SELECT * FROM JLS_ACK_UPLOAD WHERE SMU_ACK_COMPNO=:SMU_ACK_COMPNO",
            {
                SMU_ACK_COMPNO : req.body.SMU_ACK_COMPNO
            },
        {autoCommit: true},async function (err, result) {
    if (err) { console.error(err.message);
          doRelease(connection);
          return;
     }
var ary = [];
if(result.rows.length == 0){
 res.json({Status:"Success",Message:"User Details", Data : {} ,Code:200});
}else {
for(let a = 0 ; a < result.rows.length; a++){
var temp_data = result.rows[a];
var results = {}
for (var i = 0; i < result.metaData.length; ++i){
results[result.metaData[i].name] = temp_data[i];
}
ary.push({
            part_name: results.SMU_ACK_PARTNAME,
            part_quantity :results.SMU_ACK_ISSQTY,
            mr_id : results.SMU_ACK_MRMATLID,
            mrseq_no : results.SMU_ACK_MRSEQNO
});
if(a == result.rows.length - 1){
     res.json({Status:"Success",Message:"Material Details", Data : ary ,Code:200});
}
}
}
});
}); 
});



router.post('/update_mr',async function (req, res) {
    const dates = require('date-and-time');
const now1  =  new Date();
const value1 = dates.format(now1,'YYYY-MM-DDTHH:mm:ss');

  var job_details_two  =  await breakdown_managementModel.findOne({SMU_SCH_MECHCELL: req.body.user_mobile_no,SMU_SCH_JOBNO:req.body.jobId});
        let datas = {
            JOB_END_TIME : ""+value1,
            JOB_STATUS : "Job Submitted"
       }
        breakdown_managementModel.findByIdAndUpdate(job_details_two._id, datas, {new: true}, function (err, UpdatedDetails) {
            if (err) return res.json({Status:"Failed",Message:"Internal Server Error", Data : {},Code:500});
        });
});







router.post('/service_prtrpmt_new_job_list',async function (req, res) {
var job_details  =  await part_reply_service_managementModel.find({SMU_ACK_MOBILENO: req.body.user_mobile_no});
let a = [];
job_details.forEach(element => {
if(element.JOB_STATUS == "Job Started" || element.JOB_STATUS == "Job Stopped" || element.JOB_STATUS == "Not Started" ){
  a.push({
            job_id : element.SMU_ACK_JOBNO,
            SMU_ACK_COMPNO : element.SMU_ACK_COMPNO

  });
}
});
res.json({Status:"Success",Message:"New Job List", Data : a ,Code:200});
});



router.post('/branch_head/service_prtrpmt_new_job_list',async function (req, res) {
var job_details  =  await part_reply_service_managementModel.find({SMU_ACK_BRCODE: req.body.br_code});
let a = [];
job_details.forEach(element => {
if(element.JOB_STATUS == "Job Started" || element.JOB_STATUS == "Job Stopped" || element.JOB_STATUS == "Not Started" ){
  a.push({
            job_id : element.SMU_ACK_JOBNO,
            SMU_ACK_COMPNO : element.SMU_ACK_COMPNO

  });
}
});
res.json({Status:"Success",Message:"New Job List", Data : a ,Code:200});
});





router.post('/service_prtrpmt_customer_details',async function (req, res) {
var job_details  =  await part_reply_service_managementModel.findOne({SMU_ACK_COMPNO: req.body.SMU_ACK_COMPNO});
    var dates = new Date(job_details.SMU_ACK_DCDT).toISOString();
        let a  = {
            mr_no : job_details.SMU_ACK_MRSEQNO,
            ack_date : dates.substring(0, 10),
            customer_name : job_details.SMU_ACK_ENGRNAME,
            address1: job_details.SMU_ACK_ADDRESS1,
            address2:job_details.SMU_ACK_ADDRESS2,
            address3:job_details.SMU_ACK_ADDRESS3,
            address4:job_details.SMU_ACK_ADDRESS4,
            pin: job_details.SMU_ACK_APINCODE,
            mobile_no: job_details.SMU_ACK_MOBILENO,
            service_type : job_details.SMU_ACK_SERTYPE,
            mechanic_name : "",
        }
       res.json({Status:"Success",Message:"Customer Details", Data : a ,Code:200});
});









router.post('/pause_job_list',async function (req, res) {
var job_details  =  await part_reply_service_managementModel.find({SMU_ACK_MOBILENO: req.body.user_mobile_no,'JOB_STATUS': {$nin : ["Job Started", "Job Stopped" , "Not Started", "Job Submitted", "Job Deleted"]}});
let a = [];
job_details.forEach(element => {
  a.push({
            job_id : element.SMU_ACK_JOBNO,
            SMU_ACK_COMPNO  : element.SMU_ACK_COMPNO,
            paused_time : '23-10-2022 11:00 AM',
            paused_at : 'Breakdown Serivce'
        })
}); 
   res.json({Status:"Success",Message:"Pause job list", Data : a ,Code:200});
});




router.post('/branch_head/pause_job_list',async function (req, res) {
var job_details  =  await part_reply_service_managementModel.find({SMU_ACK_BRCODE: req.body.br_code,'JOB_STATUS': {$nin : ["Job Started", "Job Stopped" , "Not Started", "Job Submitted", "Job Deleted"]}});
let a = [];
job_details.forEach(element => {
  a.push({
            job_id : element.SMU_ACK_JOBNO,
            SMU_ACK_COMPNO  : element.SMU_ACK_COMPNO,
            paused_time : '23-10-2022 11:00 AM',
            paused_at : 'Breakdown Serivce'
        })
}); 
   res.json({Status:"Success",Message:"Pause job list", Data : a ,Code:200});
});








// ******************************************************************************************************************************************************************************
// SERVICE PART REPLACEMENT SUBMMITTED DATA
// ******************************************************************************************************************************************************************************

router.post('/fetch_sumbmitted_data', function (req, res) {
        part_reply_data_submitModel.findOne({SMU_ACK_COMPNO: req.body.key_value}, function (err, StateList) {
          res.json({Status:"Success",Message:"Part Submitted Data", Data : StateList ,Code:200});
        });
});


router.post('/fetch_sumbmitted_data_all', function (req, res) {
        part_reply_data_submitModel.find({}, function (err, StateList) {
          res.json({Status:"Success",Message:"Part Submitted Data List", Data : StateList ,Code:200});
        });
});


router.get('/remove_submitted_data', function (req, res) {
      part_reply_data_submitModel.remove({}, function (err, user) {
          if (err) return res.status(500).send("There was a problem deleting the user.");
             res.json({Status:"Success",Message:"remove_submitted_data Deleted", Data : {} ,Code:200});     
      });
});



// ******************************************************************************************************************************************************************************
// SERVICE PART REPLACEMENT JOB DETAILS BY COMP NO - ADMIN PANEL
// ******************************************************************************************************************************************************************************

router.post('/fetch_job_id', function (req, res) {
        part_reply_service_managementModel.findOne({SMU_ACK_COMPNO:req.body.key_value}, function (err, StateList) {
          res.json({Status:"Success",Message:"Part Form Data", Data : StateList ,Code:200});
        });
});










router.post('/prtrpmt_job_details_in_text',async function (req, res) {
    var job_details =  await part_reply_service_managementModel.findOne({SMU_ACK_COMPNO:req.body.SMU_ACK_COMPNO});
        let a  = {
                        text_value : "the work is completed in a satfisfactory manner and we hereby reqeust to accept the same for job ID = "+job_details.SMU_ACK_JOBNO+" . Customer Name : "+job_details.SMU_ACK_ENGRNAME +" and COMPNO : "+ job_details.SMU_ACK_COMPNO+".",
                 }       
       res.json({Status:"Success",Message:"Job Detail Text", Data : a ,Code:200});
});




router.get('/getlist_service_data', function (req, res) {
        part_reply_service_managementModel.find({}, function (err, Functiondetails) {
          res.json({Status:"Success",Message:"Functiondetails", Data : Functiondetails ,Code:200});
        }).sort({ _id: -1}).limit(10);;
});




router.get('/part_reply_oracle_data_deletes', function (req, res) {
        part_reply_service_managementModel.remove({}, function (err, user) {
          if (err) return res.status(500).send("There was a problem deleting the user.");
             res.json({Status:"Success",Message:"part_reply_oracle_data_deletes Deleted", Data : {} ,Code:200});     
      });
});






router.get('/deletes', function (req, res) {
      preventive_data_managementModel.remove({}, function (err, user) {
          if (err) return res.status(500).send("There was a problem deleting the user.");
             res.json({Status:"Success",Message:"preventive_data_managementModel Deleted", Data : {} ,Code:200});     
      });
});


// router.post('/fetch_job_id', function (req, res) {
//         preventive_data_managementModel.findOne({job_id:req.body.job_id}, function (err, StateList) {
//           res.json({Status:"Success",Message:"Break Down Data Detail", Data : StateList ,Code:200});
//         });
// });



// ******************************************************************************************************************************************************************************
// SERVICE PART REPLACEMENT COMPLETED JOB LIST - ADMIN PANEL
// ******************************************************************************************************************************************************************************

router.get('/getlist_completed_prt_rep', function (req, res) {
        part_reply_service_managementModel.find({JOB_STATUS : 'Job Submitted'}, function (err, Functiondetails) {
          res.json({Status:"Success",Message:"Functiondetails", Data : Functiondetails ,Code:200});
        });
});


// ******************************************************************************************************************************************************************************
// SERVICE PART REPLACEMENT COMPLETED BRANCHWISE - ADMIN PANEL
// ******************************************************************************************************************************************************************************

router.post('/getlist_completed_prt_rep_location', function (req, res) {
      let a = [];
   req.body.access_location.forEach(function(element) {
   a.push(element.branch_code);
   });
        part_reply_service_managementModel.find({JOB_STATUS : 'Job Submitted',SMU_SCQH_BRCODE:{$in:a}}, function (err, Functiondetails) {
          res.json({Status:"Success",Message:"Functiondetails", Data : Functiondetails ,Code:200});
        });
});



// ******************************************************************************************************************************************************************************
// SERVICE PART REPLACEMENT JOB DETAILS FOR GRAPH - ADMIN PANEL
// ******************************************************************************************************************************************************************************

router.post('/report/part_detail_graph',async function (req, res) {
       var bd_b_total_count  =  await part_reply_service_managementModel.find({'JOB_STATUS': {$in : ["Not Started" , "Job Started","Job Submitted","Job Paused"]}});
       var b = {
          Not_Started : 0,
          Job_Started : 0,
          Job_Submitted : 0,
          Job_Paused : 0,
          total_coutn : 0
        };
        if(bd_b_total_count.length == 0){
            res.json({Status:"Success",Message:"Functiondetails", Data : b ,Code:200});
        }else{
        for(let a = 0 ; a < bd_b_total_count.length ; a++){
             if(bd_b_total_count[a].JOB_STATUS == "Not Started"){
                    var from  = new Date(req.body.start_date);
                    var to = new Date(req.body.end_date);
                    var check =  new Date(bd_b_total_count[a].LAST_UPDATED_TIME);
                    if(check > from && check < to) {
                      b.Not_Started = b.Not_Started + 1;
                    }  
             }
             else if(bd_b_total_count[a].JOB_STATUS == "Job Started"){
                    var from  = new Date(req.body.start_date);
                    var to = new Date(req.body.end_date);
                    var check =  new Date(bd_b_total_count[a].JOB_START_TIME);
                    if(check > from && check < to) {
                      b.Job_Started = b.Job_Started + 1;
                    }  
             }
             else if(bd_b_total_count[a].JOB_STATUS == "Job Submitted"){
                    var from  = new Date(req.body.start_date);
                    var to = new Date(req.body.end_date);
                    var check =  new Date(bd_b_total_count[a].JOB_END_TIME);
                    if(check > from && check < to) {
                      b.Job_Submitted = b.Job_Submitted + 1;
                    }  
             }
             else if(bd_b_total_count[a].JOB_STATUS == "Job Paused"){
                    var from  = new Date(req.body.start_date);
                    var to = new Date(req.body.end_date);
                    var check =  new Date(bd_b_total_count[a].LAST_UPDATED_TIME);
                    if(check > from && check < to) {
                      b.Job_Paused = b.Job_Paused + 1;
                    }  
             }
        if(a ==  bd_b_total_count.length - 1){
           b.total_coutn = b.Not_Started + b.Job_Started + b.Job_Submitted + b.Job_Paused ;
           res.json({Status:"Success",Message:"Functiondetails", Data : b ,Code:200});
        }
        }
    }
});


// ******************************************************************************************************************************************************************************
// SERVICE PART REPLACEMENT JOB DETAILS FOR LIST REPORT - ADMIN PANEL
// ******************************************************************************************************************************************************************************

router.post('/report/part_detail_list',async function (req, res) {

       console.log("*********",req.body);     


       if(req.body.status == 'Not Started'){
       var bd_b_total_count  =  await part_reply_service_managementModel.find({'JOB_STATUS': {$in : ["Not Started"]}});
       var final_data = []; 
       if(bd_b_total_count.length == 0){
        res.json({Status:"Success",Message:"Not Started List", Data : [],Code:200}); 
       }else {
       for(let a = 0 ; a < bd_b_total_count.length ; a++){
                    var from  = new Date(req.body.start_date);
                    var to = new Date(req.body.end_date);
                    var check =  new Date(bd_b_total_count[a].LAST_UPDATED_TIME);
                    if(check > from && check < to) {
                        final_data.push(bd_b_total_count[a]);
                    }  
        if(a == bd_b_total_count.length - 1){
           res.json({Status:"Success",Message:"Not Started List", Data : final_data,Code:200}); 
        }
       }
       }
       }else if(req.body.status == 'Job Started'){
       var bd_b_total_count  =  await part_reply_service_managementModel.find({'JOB_STATUS': {$in : ["Job Started"]}});
       var final_data = []; 
       if(bd_b_total_count.length == 0){
        res.json({Status:"Success",Message:"Job Started List", Data : [],Code:200}); 
       }else {
       for(let a = 0 ; a < bd_b_total_count.length ; a++){
                    var from  = new Date(req.body.start_date);
                    var to = new Date(req.body.end_date);
                    var check =  new Date(bd_b_total_count[a].JOB_START_TIME);
                    if(check > from && check < to) {
                        final_data.push(bd_b_total_count[a]);
                    }  
        if(a == bd_b_total_count.length - 1){
           res.json({Status:"Success",Message:"Job Started List", Data : final_data,Code:200}); 
        }
       }
       }
       }else if(req.body.status == 'Job Submitted'){
       var bd_b_total_count  =  await part_reply_service_managementModel.find({'JOB_STATUS': {$in : ["Job Submitted"]}});
       var final_data = []; 
       if(bd_b_total_count.length == 0){
        res.json({Status:"Success",Message:"Job Submitted List", Data : [],Code:200}); 
       }else {
       for(let a = 0 ; a < bd_b_total_count.length ; a++){
                    var from  = new Date(req.body.start_date);
                    var to = new Date(req.body.end_date);
                    var check =  new Date(bd_b_total_count[a].JOB_END_TIME);
                    if(check > from && check < to) {
                        final_data.push(bd_b_total_count[a]);
                    }  
        if(a == bd_b_total_count.length - 1){
           res.json({Status:"Success",Message:"Job Submitted List", Data : final_data,Code:200}); 
        }
       }
       }
       }else if(req.body.status == 'Job Paused'){
       var bd_b_total_count  =  await part_reply_service_managementModel.find({'JOB_STATUS': {$in : ["Job Paused"]}});
       var final_data = []; 
       if(bd_b_total_count.length == 0){
        res.json({Status:"Success",Message:"Job Paused List", Data : [],Code:200}); 
       }else {
       for(let a = 0 ; a < bd_b_total_count.length ; a++){
                    var from  = new Date(req.body.start_date);
                    var to = new Date(req.body.end_date);
                    var check =  new Date(bd_b_total_count[a].LAST_UPDATED_TIME);
                    if(check > from && check < to) {
                        final_data.push(bd_b_total_count[a]);
                    }  
        if(a == bd_b_total_count.length - 1){
           res.json({Status:"Success",Message:"Job Paused List", Data : final_data,Code:200}); 
        }
       }
        }
       }
       else if(req.body.status == 'Total Job'){
       var bd_b_total_count  =  await part_reply_service_managementModel.find({'JOB_STATUS': {$in : ["Not Started","Job Started","Job Submitted","Job Paused"]}});
       var final_data = []; 
       if(bd_b_total_count.length == 0){
        res.json({Status:"Success",Message:"Job Paused List", Data : [],Code:200}); 
       }else {
       for(let a = 0 ; a < bd_b_total_count.length ; a++){
                    var from  = new Date(req.body.start_date);
                    var to = new Date(req.body.end_date);
                    var check =  new Date(bd_b_total_count[a].LAST_UPDATED_TIME);
                    if(check > from && check < to) {
                        final_data.push(bd_b_total_count[a]);
                    }  
        if(a == bd_b_total_count.length - 1){
           res.json({Status:"Success",Message:"Job Paused List", Data : final_data,Code:200}); 
        }
       }
        }
       }
});



router.get('/getlist', function (req, res) {
        part_reply_service_managementModel.find({}, function (err, Functiondetails) {
          res.json({Status:"Success",Message:"Functiondetails", Data : Functiondetails ,Code:200});
        });
});



// ******************************************************************************************************************************************************************************
// SERVICE PART REPLACEMENT DETAILS EDIT - ADMIN PANEL
// ******************************************************************************************************************************************************************************

router.post('/edit', function (req, res) {
        part_reply_service_managementModel.findByIdAndUpdate(req.body._id, req.body, {new: true}, function (err, UpdatedDetails) {
            if (err) return res.json({Status:"Failed",Message:"Internal Server Error", Data : {},Code:500});
            console.log(UpdatedDetails);
             res.json({Status:"Success",Message:"Functiondetails Updated", Data : UpdatedDetails ,Code:200});
        });
});




// // DELETES A USER FROM THE DATABASE
router.post('/delete', function (req, res) {
      preventive_data_managementModel.findByIdAndRemove(req.body.Activity_id, function (err, user) {
          if (err) return res.json({Status:"Failed",Message:"Internal Server Error", Data : {},Code:500});
          res.json({Status:"Success",Message:"SubFunction Deleted successfully", Data : {} ,Code:200});
      });
});


















///////////////////////////////PART REPLACEMENT SUBMIT DATA////////////////////////////////

router.post('/prtrpmt_submit_data',async function (req, res) {  
var service_submitted_valueModel = require('./../models/service_submitted_valueModel');
          let a = {
          "user_id" : req.body.user_mobile_no,
          "job_id" : req.body.jobId,
          "type" : "Part Replacement",
          "date" : new Date(),
          "datas" : [req.body],
          }   
var submitted = await service_submitted_valueModel.create(a);
const dates = require('date-and-time');
const now1  =  new Date();
const value1 = dates.format(now1,'YYYY-MM-DDTHH:mm:ss');
var job_details  =  await part_reply_service_managementModel.findOne({SMU_ACK_COMPNO: req.body.SMU_ACK_COMPNO});
  try{
  await part_reply_data_submitModel.create({
  SMU_ACK_COMPNO: req.body.SMU_ACK_COMPNO,
  customerAcknowledgement : req.body.customerAcknowledgement,
  jobId : req.body.jobId,
  serviceType : req.body.serviceType,
  techSignature : req.body.techSignature,
  userId : req.body.userId,
        },async function (err, user) {
       let datas = {
            JOB_END_TIME : ""+value1,
            JOB_STATUS : "Job Submitted"
       }
        part_reply_service_managementModel.findByIdAndUpdate(job_details._id, datas, {new: true}, function (err, UpdatedDetails) {
            if (err) return res.json({Status:"Failed",Message:"Internal Server Error", Data : {},Code:500});
        });
        });
}
catch(e){
      res.json({Status:"Failed",Message:"Internal Server Error", Data : {},Code:500});
}
var path = require('path');       
var fs = require('fs');
var mystrone = (""+req.body.customerAcknowledgement).slice(49);
mystrone = "/home/smart/johnson_application/public/uploads"+mystrone;
var mystrtwo = (""+req.body.techSignature).slice(49);
mystrtwo = "/home/smart/johnson_application/public/uploads"+mystrtwo;
var sourceone = fs.readFileSync(mystrone);
var sourcetwo = fs.readFileSync(mystrtwo);
var start_time = timeformat(job_details.JOB_START_TIME);
var end_time = timeformat(job_details.JOB_END_TIME);
function timeformat(value) {
const d_t = new Date(value);
let year = d_t.getFullYear();
let month = ("0" + (d_t.getMonth() + 1)).slice(-2);
let day = ("0" + d_t.getDate()).slice(-2);
let hour = d_t.getHours();
let minute = d_t.getMinutes();
let seconds = d_t.getSeconds();
var time_datas = day + "-" + month + "-" + year + " " + hour + ":" + minute + ":" + seconds;
  return time_datas;
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
 let da =
     {
  JLS_ACK_JOBNO      : ""+job_details.SMU_ACK_JOBNO,
  JLS_ACK_MRNO       : ""+job_details.SMU_ACK_REQNO,
  JLS_JOBSTART_TIME  : start_time,
  JLS_JOBEND_TIME   :  end_time,
  JLS_PART_NAME     : ""+job_details.SMU_ACK_PARTNAME,
  JLS_CUST_SIG      : sourcetwo,
  JLS_TECH_SIG      : sourceone,
  JLS_ACK_MRSEQNO    : ""+job_details.SMU_ACK_MRSEQNO,
  JLS_ACK_ISSEQNO   : ""+job_details.SMU_ACK_ISSEQNO,
  JLS_ACK_COMPNO     : ""+job_details.SMU_ACK_COMPNO,
  JLS_ACK_DCNO      : "",
  JLS_ACK_EMPID      : ""+job_details.SMU_ACK_ECODE,
  JLS_ACK_AGID       : 1639,
     }
      connection.execute(
            "INSERT INTO JLS_ACK_DNLOAD VALUES (:JLS_ACK_JOBNO, :JLS_ACK_MRNO, TO_DATE(:JLS_JOBSTART_TIME, 'dd-mm-yyyy hh24:mi:ss'), TO_DATE(:JLS_JOBEND_TIME, 'dd-mm-yyyy hh24:mi:ss'), :JLS_PART_NAME, :JLS_CUST_SIG, :JLS_TECH_SIG, :JLS_ACK_MRSEQNO, :JLS_ACK_ISSEQNO, :JLS_ACK_COMPNO, :JLS_ACK_DCNO, :JLS_ACK_EMPID, :JLS_ACK_AGID)",
              da, // Bind values
              { autoCommit: true}, 
        function (err, result) {
    if (err) { 
        console.error(err.message);
          doRelease(connection);
        res.json({Status:"Success",Message:"All data submit successfully", Data : {} ,Code:200});
          return;
     }
      let datas = {
            JOB_END_TIME : ""+value1,
            JOB_STATUS : "Job Submitted"
       }
        part_reply_service_managementModel.findByIdAndUpdate(job_details._id, datas, {new: true}, function (err, UpdatedDetails) {
            // if (err) return res.json({Status:"Failed",Message:"Internal Server Error", Data : {},Code:500});
        });
     res.json({Status:"Success",Message:"All data submit successfully", Data : {} ,Code:200});
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
});


///////////////////////////////PART REPLACEMENT SUBMIT DATA////////////////////////////////



////////////////////////PART REPLACE UPDATE JOB STATUS////////////////////


router.post('/prtrpmt_job_work_status_update',async function (req, res) {

const dates = require('date-and-time');
const now1  =  new Date();
const value1 = dates.format(now1,'YYYY-MM-DDTHH:mm:ss');
var statuss = 0;
var job_details  =  await part_reply_service_managementModel.findOne({SMU_ACK_COMPNO: req.body.SMU_ACK_COMPNO});
if(req.body.Status == 'Job Started'){
let da = {
JOB_STATUS : req.body.Status,
JOB_VIEW_STATUS : "Viewed",
JOB_START_TIME : ""+value1,
JOB_END_TIME : ""+value1
}
statuss = 1;
part_reply_service_managementModel.findByIdAndUpdate(job_details._id, da, {new: true}, function (err, UpdatedDetails) {
if (err) return res.json({Status:"Failed",Message:"Internal Server Error", Data : {},Code:500});
res.json({Status:"Success",Message:"Update successfully", Data : {} ,Code:200});
}); 
}
else if(req.body.Status == 'Job Stopped'){
let da = {
JOB_STATUS : req.body.Status,
JOB_END_TIME : ""+value1
}
statuss = 4;
part_reply_service_managementModel.findByIdAndUpdate(job_details._id, da, {new: true}, function (err, UpdatedDetails) {
if (err) return res.json({Status:"Failed",Message:"Internal Server Error", Data : {},Code:500});
res.json({Status:"Success",Message:"Update successfully", Data : {} ,Code:200});
}); 
}
else if(req.body.Status == 'Job Paused'){
let da = {
JOB_STATUS : req.body.Status,
JOB_END_TIME : ""+value1
}
statuss = 2;
part_reply_service_managementModel.findByIdAndUpdate(job_details._id, da, {new: true}, function (err, UpdatedDetails) {
if (err) return res.json({Status:"Failed",Message:"Internal Server Error", Data : {},Code:500});
res.json({Status:"Success",Message:"Update successfully", Data : {} ,Code:200});
}); 
}
else if(req.body.Status == 'Job Resume'){
let da = {
JOB_STATUS : req.body.Status,
JOB_END_TIME : ""+value1
}
statuss = 3;
part_reply_service_managementModel.findByIdAndUpdate(job_details._id, da, {new: true}, function (err, UpdatedDetails) {
if (err) return res.json({Status:"Failed",Message:"Internal Server Error", Data : {},Code:500});
res.json({Status:"Success",Message:"Update successfully", Data : {} ,Code:200});
}); 
}    

var location_tracking_job_wiseModel = require('./../models/location_tracking_job_wiseModel');
let a = {
"job_no" : job_details.SMU_ACK_JOBNO,
"complaint_no" : req.body.SMU_ACK_COMPNO,
"user_mobile_no" : job_details.SMU_ACK_MOBILENO,
"location_text" : req.body.JOB_LOCATION,
"loc_lat" : req.body.JOB_START_LAT,
"loc_long" : req.body.JOB_START_LONG,
"date" : new Date(),
"km" : "Part service",
"remarks" : ""+req.body.Status,
}   
var submitted = await location_tracking_job_wiseModel.create(a);


///////////update pause resume time//////////////

let cc = {
user_mobile_no : req.body.user_mobile_no,
job_no : req.body.job_id,
complaint_no : req.body.SMU_ACK_COMPNO,
status : statuss,
service_name : "PR"
}
request.post(
'http://smart.johnsonliftsltd.com:3000/api/service_userdetails/update_pause_resume_time',
{ json: cc},
function (error, response, body) {
if (!error && response.statusCode == 200) {
}
// res.json({Status:"Success",Message:"Logout successfully", Data : {} ,Code:200});
}
);



});



////////////////////////PART REPLACE UPDATE JOB STATUS////////////////////



//////////////////////PART REPLACEMENT CHECK STATUS/////////////////////////

router.post('/service_mr_check_work_status',async function (req, res) {
var job_details  =  await part_reply_service_managementModel.findOne({SMU_ACK_COMPNO: req.body.SMU_ACK_COMPNO});
 res.json({Status:"Success", Message:job_details.JOB_STATUS, time:job_details.JOB_START_TIME,  Data : {} ,Code:200});
});

//////////////////////PART REPLACEMENT CHECK STATUS/////////////////////////




module.exports = router;
