var express = require('express');
var router = express.Router();
var bodyParser = require('body-parser');
router.use(bodyParser.urlencoded({ extended: false }));
router.use(bodyParser.json());
var preventive_data_managementModel = require('./../models/preventive_data_managementModel');
var breakdown_managementModel = require('./../models/breakdown_managementModel');



var oracledb = require('oracledb');
var lr_service_managementModel = require('./../models/lr_service_managementModel');
var oracledb = require('oracledb');
var request = require("request");






router.post('/create',async function(req, res) {
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
          // console.log(user);
       let datas = {
            JOB_END_TIME : ""+new Date(),
            JOB_STATUS : "Job Submitted"
       }
        breakdown_managementModel.findByIdAndUpdate(job_details_two._id, datas, {new: true}, function (err, UpdatedDetails) {
            if (err) return res.json({Status:"Failed",Message:"Internal Server Error", Data : {},Code:500});
        });
        });
}
catch(e){
              console.log(e);
      res.json({Status:"Failed",Message:"Internal Server Error", Data : {},Code:500});
}
});





router.post('/service_lr_job_status_count',async function (req, res) {
        var bd_paused_count  =  await lr_service_managementModel.count({SMU_SEN_MOBILENO: req.body.user_mobile_no,JOB_STATUS:'Job Paused'});
        let a  = {
            paused_count :  bd_paused_count
        }
       res.json({Status:"Success",Message:"Job status count", Data : a ,Code:200});
});




router.post('/pause_job_list',async function (req, res) {
var job_details  =  await lr_service_managementModel.find({SMU_SEN_MOBILENO: req.body.user_mobile_no,JOB_STATUS:'Job Paused'});
let a = [];
job_details.forEach(element => {
  a.push({
            job_id : element.SMU_SCQH_JOBNO,
            SMU_SCQH_QUOTENO : element.SMU_SCQH_QUOTENO,
            paused_time : '23-10-2022 11:00 AM',
            paused_at : 'Breakdown Serivce'
        })
}); 
   res.json({Status:"Success",Message:"Pause job list", Data : a ,Code:200});
});



router.post('/update_mr',async function (req, res) {
  var job_details_two  =  await breakdown_managementModel.findOne({SMU_SCH_MECHCELL: req.body.user_mobile_no,SMU_SCH_JOBNO:req.body.jobId});
        let datas = {
            JOB_END_TIME : ""+new Date(),
            JOB_STATUS : "Job Submitted"
       }
        breakdown_managementModel.findByIdAndUpdate(job_details_two._id, datas, {new: true}, function (err, UpdatedDetails) {
            if (err) return res.json({Status:"Failed",Message:"Internal Server Error", Data : {},Code:500});
        });
});



router.post('/lr_job_work_status_update',async function (req, res) {
 console.log(req.body);
        var statuss = 0;
        var job_details  =  await lr_service_managementModel.findOne({SMU_SEN_MOBILENO: req.body.user_mobile_no,SMU_SCQH_JOBNO:req.body.job_id});
         console.log(job_details);
        if(req.body.Status == 'Job Started'){
            let da = {
            JOB_STATUS : req.body.Status,
            JOB_VIEW_STATUS : "Viewed",
            JOB_START_TIME : ""+new Date(),
            JOB_END_TIME : ""+new Date()
        }
                statuss = 1;
         lr_service_managementModel.findByIdAndUpdate(job_details._id, da, {new: true}, function (err, UpdatedDetails) {
            if (err) return res.json({Status:"Failed",Message:"Internal Server Error", Data : {},Code:500});
            res.json({Status:"Success",Message:"Update successfully", Data : {} ,Code:200});
         }); 
        }else if(req.body.Status == 'Job Stopped'){
            let da = {
            JOB_STATUS : req.body.Status,
            JOB_END_TIME : ""+new Date()
        }
                statuss = 4;
         lr_service_managementModel.findByIdAndUpdate(job_details._id, da, {new: true}, function (err, UpdatedDetails) {
            if (err) return res.json({Status:"Failed",Message:"Internal Server Error", Data : {},Code:500});
            res.json({Status:"Success",Message:"Update successfully", Data : {} ,Code:200});
         }); 
        }else if(req.body.Status == 'Job Paused'){
            let da = {
            JOB_STATUS : req.body.Status,
            JOB_END_TIME : ""+new Date()
        }
                statuss = 2;
         lr_service_managementModel.findByIdAndUpdate(job_details._id, da, {new: true}, function (err, UpdatedDetails) {
            if (err) return res.json({Status:"Failed",Message:"Internal Server Error", Data : {},Code:500});
            res.json({Status:"Success",Message:"Update successfully", Data : {} ,Code:200});
         }); 
        }else if(req.body.Status == 'Job Resume'){
            let da = {
            JOB_STATUS : req.body.Status,
            JOB_END_TIME : ""+new Date()
        }
                statuss = 3;
         lr_service_managementModel.findByIdAndUpdate(job_details._id, da, {new: true}, function (err, UpdatedDetails) {
            if (err) return res.json({Status:"Failed",Message:"Internal Server Error", Data : {},Code:500});
            res.json({Status:"Success",Message:"Update successfully", Data : {} ,Code:200});
         }); 
        }    
    



let cc = {
    user_mobile_no : req.body.user_mobile_no,
    job_no : req.body.job_id,
    complaint_no : job_details.SMU_SCQH_QUOTENO,
    status : statuss,
    service_name : "LR"
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





     // res.json({Status:"Success",Message:"Update successfully", Data : {} ,Code:200});             
});








router.post('/service_lr_new_job_list',async function (req, res) {
var job_details  =  await lr_service_managementModel.find({SMU_SEN_MOBILENO: req.body.user_mobile_no,"JOB_STATUS": "Not Started"});
let a = [];
job_details.forEach(element => {
  a.push({
            job_id : element.SMU_SCQH_JOBNO,
            SMU_SCQH_QUOTENO : element.SMU_SCQH_QUOTENO

  })
});
res.json({Status:"Success",Message:"New Job List", Data : a ,Code:200});
});




router.post('/service_lr_customer_details',async function (req, res) {
    console.log(req.body);
    // SMU_SCQH_QUOTENO : req.body.SMU_SCQH_QUOTENO
var job_details  =  await lr_service_managementModel.findOne({SMU_SCQH_QUOTENO : req.body.SMU_SCQH_QUOTENO});
 console.log(job_details);
    var dates = new Date(job_details.SMU_SCQH_LRDT).toISOString();
        let a  = {
            lr_no: job_details.SMU_SCQH_LRNO,
            lr_date : dates.substring(0, 10),
            quote_no : job_details.SMU_SCQH_QUOTENO,
            customer_name : job_details.SMU_SED_NAME,
            address1:job_details.SMU_SED_ADDRESS1,
            address2:job_details.SMU_SED_ADDRESS2,
            address3:job_details.SMU_SED_ADDRESS3,
            address4:job_details.SMU_SED_ADDRESS4,
            pin: job_details.SMU_SED_PINCODE,
            mobile_no: job_details.SMU_SEN_MOBILENO,
            service_type : job_details.SMU_SED_SERTYPE,
            mechanic_name : job_details.SMU_SCAH_MECHANIC,
        }
       res.json({Status:"Success",Message:"Customer Details", Data : a ,Code:200});
});


router.post('/service_mr_check_work_status',async function (req, res) {
// var job_details  =  await breakdown_managementModel.findOne({SMU_SEN_MOBILENO: req.body.user_mobile_no,SMU_SCH_JOBNO:req.body.job_id});
       res.json({Status:"Success",Message:'Not Started', Data : {} ,Code:200});
});












router.post('/lr_submit_data',async function (req, res) {  
console.log(req.body);
var path = require('path');       
var fs = require('fs');
var job_details  =  await lr_service_managementModel.findOne({SMU_SCQH_JOBNO: req.body.jobId,SMU_SEN_MOBILENO: req.body.userId});
var mystrone = (""+req.body.customerAcknowledgement).slice(49);
mystrone = "/home/smart/johnson_application/public/uploads"+mystrone;
var mystrtwo = (""+req.body.techSignature).slice(49);
mystrtwo = "/home/smart/johnson_application/public/uploads"+mystrtwo;
var sourceone = fs.readFileSync(mystrone);
var sourcetwo = fs.readFileSync(mystrtwo);
var start_time = timeformat(job_details.JOB_START_TIME);
var end_time = timeformat(job_details.JOB_END_TIME);
console.log(sourceone);
console.log(sourcetwo);
console.log(job_details);
console.log(timeformat(job_details.JOB_START_TIME));
console.log(timeformat(job_details.JOB_END_TIME));

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
         "JLS_SCQH_COMPNO": "",
          "JLS_SCQH_JOBNO": ""+job_details.SMU_SCQH_JOBNO,
           "JLS_SCQH_LRNO": ""+job_details.SMU_SCQH_LRNO,
            "JLS_VANID":""+job_details.SMU_VANID,
             "JLS_CUST_SIGNATURE":sourceone,
              "JLS_MECH_SIGNATURE":sourcetwo,
               "JLS_JOBSTARTTIME": start_time,
                "JLS_JOBENDTIME": end_time,
                 "JLS_JOBSTATUS": "Y",
                 "JLS_EMPID":"E14658",
                 "JLS_AGID":1947,

     }
     console.log(da);
      connection.execute(
            "INSERT INTO JLS_QUOTELR_DNLOAD VALUES (:JLS_SCQH_COMPNO, :JLS_SCQH_JOBNO, :JLS_SCQH_LRNO, :JLS_VANID, :JLS_CUST_SIGNATURE, :JLS_MECH_SIGNATURE, TO_DATE(:JLS_JOBSTARTTIME, 'dd-mm-yyyy hh24:mi:ss'), TO_DATE(:JLS_JOBENDTIME, 'dd-mm-yyyy hh24:mi:ss'), :JLS_JOBSTATUS, :JLS_EMPID, :JLS_AGID)",
              da, // Bind values
              { autoCommit: true}, 
        function (err, result) {
    if (err) { 
        console.error(err.message);
          doRelease(connection);
        res.json({Status:"Success",Message:"All data submit successfully", Data : {} ,Code:200});
          return;
     }
     console.log("Inserted 1",result)
      let datas = {
            JOB_END_TIME : ""+new Date(),
            JOB_STATUS : "Job Submitted"
       }
        lr_service_managementModel.findByIdAndUpdate(job_details._id, datas, {new: true}, function (err, UpdatedDetails) {
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





router.post('/fetch_job_id', function (req, res) {
        preventive_data_managementModel.findOne({job_id:req.body.job_id}, function (err, StateList) {
          res.json({Status:"Success",Message:"Break Down Data Detail", Data : StateList ,Code:200});
        });
});






router.post('/lr_job_details_in_text',async function (req, res) {
    console.log(req.body);
var job_details  =  await lr_service_managementModel.findOne({SMU_SCQH_JOBNO: req.body.job_id});
        let a  = {
                        text_value : "the work is completed in a satfisfactory manner and we hereby reqeust to accept the same for job ID = "+ job_details.SMU_SCQH_JOBNO +" . Customer Name : "+ job_details.SMU_SED_NAME +" and QUOTNO : "+ job_details.SMU_SCQH_QUOTENO+".",
                 }       
       res.json({Status:"Success",Message:"Job Detail Text", Data : a ,Code:200});
});





router.post('/fetch_data_from_oracle_lr_service',async function (req, res) {
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
            "SELECT * FROM JLS_QUOTELR_UPLOAD WHERE SMU_SEN_MOBILENO=:SMU_SCH_MECHCELL and SMU_SCQH_STATUS <> 'Y'",
            { 
              SMU_SCH_MECHCELL:+req.body.user_mobile_no
            },
        {autoCommit: true},async function (err, result) {
    if (err) { console.error(err.message);
          doRelease(connection);
          return;
     }
var ary = [];
console.log(result.rows.length);
if(result.rows.length == 0){
 res.json({Status:"Success",Message:"User Details", Data : {} ,Code:200});
}else{
for(let a = 0 ; a < result.rows.length; a++){
var temp_data = result.rows[a];
var results = {}
for (var i = 0; i < result.metaData.length; ++i){
results[result.metaData[i].name] = temp_data[i];
}
  var datass  =  await lr_service_managementModel.findOne({SMU_SCQH_QUOTENO:results.SMU_SCQH_QUOTENO});
   if(datass == null){
  try{
        console.log('LR INSERT');
  await lr_service_managementModel.create({
  SMU_SCQH_BRCODE:  results.SMU_SCQH_BRCODE,
  SMU_SCQH_QUOTENO :results.SMU_SCQH_QUOTENO,
  SMU_SCQH_QUOTEDT : results.SMU_SCQH_QUOTEDT,
  SMU_SCQH_CSCHPNO : results.SMU_SCQH_CSCHPNO,
  SMU_SCQH_JOBNO : results.SMU_SCQH_JOBNO,
  SMU_SCQH_LRNO : results.SMU_SCQH_LRNO,
  SMU_SCQH_LRDT : results.SMU_SCQH_LRDT,
  SMU_SCAH_SMNO : results.SMU_SCAH_SMNO,
  SMU_SCQH_STATUS : results.SMU_SCQH_STATUS,
  SMU_SCAH_ROUTECODE : results.SMU_SCAH_ROUTECODE,
  SMU_SCAH_MECHANIC : results.SMU_SCAH_MECHANIC,
  SMU_SED_NAME : results.SMU_SED_NAME,
  SMU_SED_ADDRESS1 : results.SMU_SED_ADDRESS1,
  SMU_SED_ADDRESS2 : results.SMU_SED_ADDRESS2,
  SMU_SED_ADDRESS3 : results.SMU_SED_ADDRESS3,
  SMU_SED_ADDRESS4 : results.SMU_SED_ADDRESS4,
  SMU_SED_PINCODE : results.SMU_SED_PINCODE,
  SMU_SEN_MOBILENO : results.SMU_SEN_MOBILENO,
  SMU_SED_SERTYPE :  results.SMU_SED_SERTYPE,
  SMU_SCH_JOBSTARTTIME :  results.SMU_SCH_JOBSTARTTIME,
  SMU_SCH_JOBENDIME :  results.SMU_SCH_JOBENDIME,
  SMU_VANID :  results.SMU_VANID,
  SMU_SCQH_ERRDESC : results.SMU_SCQH_ERRDESC,
  JOB_STATUS : 'Not Started',
  JOB_VIEW_STATUS : 'Not Viewed',
  LAST_UPDATED_TIME : ""+new Date(),
  JOB_START_TIME :  ""+new Date(),
  JOB_END_TIME :  ""+new Date()
        },async function (err, user) {
          // console.log(user);
        });
}
catch(e){
    console.log(e);
    }  // res.json({Status:"Failed",Message:"Internal Server Error", Data : {},Code:500});
}
 // console.log(results);
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
console.log(req.body.user_mobile_no);
connection.execute(
            "UPDATE JLS_QUOTELR_UPLOAD set SMU_SCQH_STATUS='Y' WHERE SMU_SEN_MOBILENO=:SMU_SEN_MOBILENO and SMU_SCQH_STATUS <> 'Y'",
            {
                SMU_SEN_MOBILENO:req.body.user_mobile_no
            },
        {autoCommit: true},
        function (err, result_one) {
    if (err) { console.error(err.message);
          // doRelease(connection);
          return;
     }
     console.log(result_one);
    });
});
     res.json({Status:"Success",Message:"LR Added", Data : {},Code:200});
 }
}
}
});
});
});





router.post('/fetch_data_from_oracle_lr_service_pull',async function (req, res) {
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
            "SELECT * FROM JLS_QUOTELR_UPLOAD",
            { 
             
            },
        {autoCommit: true},async function (err, result) {
    if (err) { console.error(err.message);
          doRelease(connection);
          return;
     }
var ary = [];
console.log(result.rows.length);
if(result.rows.length == 0){
 res.json({Status:"Success",Message:"User Details", Data : {} ,Code:200});
}else{
for(let a = 0 ; a < result.rows.length; a++){
var temp_data = result.rows[a];
var results = {}
for (var i = 0; i < result.metaData.length; ++i){
results[result.metaData[i].name] = temp_data[i];
}
  var datass  =  await lr_service_managementModel.findOne({SMU_SCQH_QUOTENO:results.SMU_SCQH_QUOTENO});
   if(datass == null){
  try{
        console.log('LR INSERT');
  await lr_service_managementModel.create({
  SMU_SCQH_BRCODE:  results.SMU_SCQH_BRCODE,
  SMU_SCQH_QUOTENO :results.SMU_SCQH_QUOTENO,
  SMU_SCQH_QUOTEDT : results.SMU_SCQH_QUOTEDT,
  SMU_SCQH_CSCHPNO : results.SMU_SCQH_CSCHPNO,
  SMU_SCQH_JOBNO : results.SMU_SCQH_JOBNO,
  SMU_SCQH_LRNO : results.SMU_SCQH_LRNO,
  SMU_SCQH_LRDT : results.SMU_SCQH_LRDT,
  SMU_SCAH_SMNO : results.SMU_SCAH_SMNO,
  SMU_SCQH_STATUS : results.SMU_SCQH_STATUS,
  SMU_SCAH_ROUTECODE : results.SMU_SCAH_ROUTECODE,
  SMU_SCAH_MECHANIC : results.SMU_SCAH_MECHANIC,
  SMU_SED_NAME : results.SMU_SED_NAME,
  SMU_SED_ADDRESS1 : results.SMU_SED_ADDRESS1,
  SMU_SED_ADDRESS2 : results.SMU_SED_ADDRESS2,
  SMU_SED_ADDRESS3 : results.SMU_SED_ADDRESS3,
  SMU_SED_ADDRESS4 : results.SMU_SED_ADDRESS4,
  SMU_SED_PINCODE : results.SMU_SED_PINCODE,
  SMU_SEN_MOBILENO : results.SMU_SEN_MOBILENO,
  SMU_SED_SERTYPE :  results.SMU_SED_SERTYPE,
  SMU_SCH_JOBSTARTTIME :  results.SMU_SCH_JOBSTARTTIME,
  SMU_SCH_JOBENDIME :  results.SMU_SCH_JOBENDIME,
  SMU_VANID :  results.SMU_VANID,
  SMU_SCQH_ERRDESC : results.SMU_SCQH_ERRDESC,
  JOB_STATUS : 'Not Started',
  JOB_VIEW_STATUS : 'Not Viewed',
  LAST_UPDATED_TIME : ""+new Date(),
  JOB_START_TIME :  ""+new Date(),
  JOB_END_TIME :  ""+new Date()
        },async function (err, user) {
          // console.log(user);
        });
}
catch(e){
    console.log(e);
    }  // res.json({Status:"Failed",Message:"Internal Server Error", Data : {},Code:500});
}
 // console.log(results);
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
console.log(req.body.user_mobile_no);
connection.execute(
            "UPDATE JLS_QUOTELR_UPLOAD set SMU_SCQH_STATUS='Y' WHERE and NVL(SMU_SCQH_STATUS,'N')='N'",
            {
                
            },
        {autoCommit: true},
        function (err, result_one) {
    if (err) { console.error(err.message);
          // doRelease(connection);
          return;
     }
     console.log(result_one);
    });
});
     res.json({Status:"Success",Message:"LR Added", Data : {},Code:200});
 }
}
}
});
});
});







router.get('/lr_oracle_data_deletes', function (req, res) {
      lr_service_managementModel.remove({}, function (err, user) {
          if (err) return res.status(500).send("There was a problem deleting the user.");
             res.json({Status:"Success",Message:"lr_oracle_data_deletes Deleted", Data : {} ,Code:200});     
      });
});




router.post('/fetch_job_id', function (req, res) {
        preventive_data_managementModel.findOne({job_id:req.body.job_id}, function (err, StateList) {
          res.json({Status:"Success",Message:"Break Down Data Detail", Data : StateList ,Code:200});
        });
});



router.get('/getlist_service_data', function (req, res) {
        lr_service_managementModel.find({}, function (err, Functiondetails) {
          res.json({Status:"Success",Message:"Functiondetails", Data : Functiondetails ,Code:200});
        });
});



router.get('/getlist_data', function (req, res) {
        lr_service_managementModel.find({}, function (err, Functiondetails) {
          res.json({Status:"Success",Message:"Functiondetails", Data : Functiondetails ,Code:200});
        });
});




router.post('/edit', function (req, res) {
        preventive_data_managementModel.findByIdAndUpdate(req.body.Activity_id, req.body, {new: true}, function (err, UpdatedDetails) {
            if (err) return res.json({Status:"Failed",Message:"Internal Server Error", Data : {},Code:500});
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
module.exports = router;
