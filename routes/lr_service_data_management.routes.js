var express = require('express');
var router = express.Router();
var bodyParser = require('body-parser');
router.use(bodyParser.urlencoded({ extended: false }));
router.use(bodyParser.json());
var preventive_data_managementModel = require('./../models/preventive_data_managementModel');
var breakdown_managementModel = require('./../models/breakdown_managementModel');



var oracledb = require('oracledb');
var lr_service_managementModel = require('./../models/lr_service_managementModel');
var lr_service_submitted_dataModel = require('./../models/lr_service_submitted_dataModel');
var service_user_management = require('./../models/service_userdetailsModel');


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





router.post('/service_lr_job_status_count',async function (req, res) {
        var bd_paused_count  =  await lr_service_managementModel.count({SMU_SEN_MOBILENO: req.body.user_mobile_no,'JOB_STATUS': {$nin : ["Job Started", "Job Stopped" , "Not Started", "Job Submitted"]}});
        let a  = {
            paused_count :  bd_paused_count
        }
       res.json({Status:"Success",Message:"Job status count", Data : a ,Code:200});
});



router.post('/branch_head/service_lr_job_status_count',async function (req, res) {
        var bd_paused_count  =  await lr_service_managementModel.count({SMU_SCQH_BRCODE: req.body.br_code,'JOB_STATUS': {$nin : ["Job Started", "Job Stopped" , "Not Started", "Job Submitted"]}});
        let a  = {
            paused_count :  bd_paused_count
        }
       res.json({Status:"Success",Message:"Job status count", Data : a ,Code:200});
});


router.post('/pause_job_list',async function (req, res) {
var job_details  =  await lr_service_managementModel.find({SMU_SEN_MOBILENO: req.body.user_mobile_no,'JOB_STATUS': {$nin : ["Job Started", "Job Stopped" , "Not Started", "Job Submitted"]}});
let a = [];
job_details.forEach(element => {
  a.push({
            job_id : element.SMU_SCQH_JOBNO,
            SMU_SCQH_QUOTENO : element.SMU_SCQH_QUOTENO,
            paused_time : '23-10-2022 11:00 AM',
            paused_at : 'Lr Completed'
        })
}); 
   res.json({Status:"Success",Message:"Pause job list", Data : a ,Code:200});
});



router.post('/branch_head/pause_job_list',async function (req, res) {
var job_details  =  await lr_service_managementModel.find({SMU_SCQH_BRCODE: req.body.br_code,'JOB_STATUS': {$nin : ["Job Started", "Job Stopped" , "Not Started", "Job Submitted"]}});
let a = [];
job_details.forEach(element => {
  a.push({
            job_id : element.SMU_SCQH_JOBNO,
            SMU_SCQH_QUOTENO : element.SMU_SCQH_QUOTENO,
            paused_time : '23-10-2022 11:00 AM',
            paused_at : 'Lr Completed'
        })
}); 
   res.json({Status:"Success",Message:"Pause job list", Data : a ,Code:200});
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










router.post('/service_lr_new_job_list',async function (req, res) {
var job_details  =  await lr_service_managementModel.find({SMU_SEN_MOBILENO: req.body.user_mobile_no});
let a = [];
job_details.forEach(element => {
         if(element.JOB_STATUS == "Job Started" || element.JOB_STATUS == "Job Stopped" || element.JOB_STATUS == "Not Started" ){
  a.push({
            job_id : element.SMU_SCQH_JOBNO,
            SMU_SCQH_QUOTENO : element.SMU_SCQH_QUOTENO

  });
    }
});
res.json({Status:"Success",Message:"New Job List", Data : a ,Code:200});
});




router.post('/branch_head/service_lr_new_job_list',async function (req, res) {
var job_details  =  await lr_service_managementModel.find({SMU_SCQH_BRCODE: req.body.br_code});
let a = [];
job_details.forEach(element => {
         if(element.JOB_STATUS == "Job Started" || element.JOB_STATUS == "Job Stopped" || element.JOB_STATUS == "Not Started" ){
  a.push({
            job_id : element.SMU_SCQH_JOBNO,
            SMU_SCQH_QUOTENO : element.SMU_SCQH_QUOTENO

  });
    }
});
res.json({Status:"Success",Message:"New Job List", Data : a ,Code:200});
});







router.post('/service_lr_customer_details',async function (req, res) {

    // SMU_SCQH_QUOTENO : req.body.SMU_SCQH_QUOTENO
var job_details  =  await lr_service_managementModel.findOne({SMU_SCQH_QUOTENO : req.body.SMU_SCQH_QUOTENO});

   
     var date = new Date(job_details.SMU_SCQH_LRDT);
     date.setDate(date.getDate() + 1);
     var dates = new Date(date).toISOString();
    
    // console.log(date);
    // var dates = new Date(job_details.SMU_SCQH_LRDT).toISOString();



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


















router.post('/fetch_sumbmitted_data', function (req, res) {
        lr_service_submitted_dataModel.find({}, function (err, StateList) {
          res.json({Status:"Success",Message:"Break Down Data Detail", Data : StateList ,Code:200});
        });
});




router.get('/remove_submitted_data', function (req, res) {
      lr_service_submitted_dataModel.remove({}, function (err, user) {
          if (err) return res.status(500).send("There was a problem deleting the user.");
             res.json({Status:"Success",Message:"remove_submitted_data Deleted", Data : {} ,Code:200});     
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
            "SELECT * FROM JLS_QUOTELR_UPLOAD WHERE SMU_SEN_MOBILENO=:SMU_SCH_MECHCELL and NVL(SMU_SCQH_STATUS,'N')<> 'Y'",
            { 
              SMU_SCH_MECHCELL:+req.body.user_mobile_no
            },
        {autoCommit: true},async function (err, result) {
    if (err) { console.error(err.message);
          doRelease(connection);
          return;
     }
doRelease(connection);
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
  var datass  =  await lr_service_managementModel.findOne({SMU_SCQH_QUOTENO:results.SMU_SCQH_QUOTENO});
   if(datass == null){
    const dates = require('date-and-time');
const now1  =  new Date();
const value1 = dates.format(now1,'YYYY-MM-DDTHH:mm:ss');
  try{
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
    return;
}
connection.execute(
            "UPDATE JLS_QUOTELR_UPLOAD set SMU_SCQH_STATUS='Y' WHERE SMU_SEN_MOBILENO=:SMU_SEN_MOBILENO and NVL(SMU_SCQH_STATUS,'N')<> 'Y'",
            {
                SMU_SEN_MOBILENO:req.body.user_mobile_no
            },
        {autoCommit: true},
        function (err, result_one) {
    if (err) { console.error(err.message);
          doRelease(connection);
          return;
     }
      doRelease(connection);
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
     res.json({Status:"Success",Message:"LR Added", Data : {},Code:200});
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
     doRelease(connection);
var ary = [];
console.log("999999999999999999999999999999999",result.rows.length);
if(result.rows.length == 0){
 res.json({Status:"Success",Message:"User Details", Data : {} ,Code:200});
}else{
for(let a = 0 ; a < result.rows.length; a++){
var temp_data = result.rows[a];
var results = {}
for (var i = 0; i < result.metaData.length; ++i){
results[result.metaData[i].name] = temp_data[i];
}
ary.push(results)



  var datass  =  await lr_service_managementModel.findOne({SMU_SCQH_QUOTENO:results.SMU_SCQH_QUOTENO});
  if(datass == null){
  try{
const dates = require('date-and-time');
const now1  =  new Date();
const value1 = dates.format(now1,'YYYY-MM-DDTHH:mm:ss');
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
  LAST_UPDATED_TIME : ""+value1,
  JOB_START_TIME :  ""+value1,
  JOB_END_TIME :  ""+value1,
  JOB_LOCATION : "",
JOB_START_LAT : "",
JOB_START_LONG : "",
        },async function (err, user) {
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
            "UPDATE JLS_QUOTELR_UPLOAD set SMU_SCQH_STATUS='Y' WHERE SMU_SCQH_QUOTENO=:SMU_SCQH_QUOTENO",
            {
               SMU_SCQH_QUOTENO : user.SMU_SCQH_QUOTENO 
            },
        {autoCommit: true},
        function (err, result_one) {
    if (err) { console.error(err.message);
          doRelease(connection);
          return;
     }
     console.log(result_one);
    doRelease(connection);
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
}
catch(e){
    res.json({Status:"Failed",Message:"Internal Server Error", Data : {},Code:500});
    }  
}
 if(a == result.rows.length - 1){
     res.json({Status:"Success",Message:"LR Added", Data : {},Code:200});
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







router.get('/lr_oracle_data_deletes', function (req, res) {
      lr_service_managementModel.remove({}, function (err, user) {
          if (err) return res.status(500).send("There was a problem deleting the user.");
             res.json({Status:"Success",Message:"lr_oracle_data_deletes Deleted", Data : {} ,Code:200});     
      });
});


// ******************************************************************************************************************************************************************************
// SERVICE LR SERVICE FETCH DETAIL BY JOB ID - ADMIN PANEL
// ******************************************************************************************************************************************************************************

router.post('/fetch_job_id', function (req, res) {
        lr_service_managementModel.findOne({SMU_SCQH_QUOTENO:req.body.key_value,SMU_SCQH_JOBNO:req.body.job_id}, function (err, StateList) {
          res.json({Status:"Success",Message:"Lr Form Data", Data : StateList ,Code:200});
        });
});


// ******************************************************************************************************************************************************************************
// SERVICE FETCH JOB DETAIL BY QUOTETION NUMBER - ADMIN PANEL
// ******************************************************************************************************************************************************************************

router.post('/fetch_job_submit_data', function (req, res) {
        lr_service_submitted_dataModel.findOne({SMU_SCQH_QUOTENO:req.body.key_value}, function (err, StateList) {
          res.json({Status:"Success",Message:"Lr Form Data", Data : StateList ,Code:200});
        });
});



// router.post('/fetch_job_id', function (req, res) {
//         preventive_data_managementModel.findOne({job_id:req.body.job_id}, function (err, StateList) {
//           res.json({Status:"Success",Message:"Break Down Data Detail", Data : StateList ,Code:200});
//         });


// });

router.get('/getlist_service_data', function (req, res) {
        lr_service_managementModel.find({}, function (err, Functiondetails) {
          res.json({Status:"Success",Message:"Functiondetails", Data : Functiondetails ,Code:200});
        }).sort({ _id: -1}).limit(10);
});



router.get('/getlist_data', function (req, res) {
        lr_service_managementModel.find({}, function (err, Functiondetails) {
          res.json({Status:"Success",Message:"Functiondetails", Data : Functiondetails ,Code:200});
        });
});



// ******************************************************************************************************************************************************************************
// SERVICE LR SUBMITTED JOBS - ADMIN PANEL
// ******************************************************************************************************************************************************************************

router.get('/getlist_completed_lr', function (req, res) {
        lr_service_managementModel.find({JOB_STATUS : 'Job Submitted'}, function (err, Functiondetails) {
          res.json({Status:"Success",Message:"Functiondetails", Data : Functiondetails ,Code:200});
        });
});





// ******************************************************************************************************************************************************************************
// SERVICE LR GET DETAILS GRAPH - ADMIN PANEL
// ******************************************************************************************************************************************************************************


router.post('/report/lr_detail_graph',async function (req, res) {


  if(req.body.user_type == 'Admin'){

       var bd_b_total_count  =  await lr_service_managementModel.find({'JOB_STATUS': {$in : ["Not Started" , "Job Started","Job Submitted","Job Paused"]}});
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

  }
  else {
    let a = [];
    req.body.access_location.forEach(function(element) {
    a.push(element.branch_code);
    });


    var bd_b_total_count  =  await lr_service_managementModel.find({ 'SMU_SCQH_BRCODE':{$in:a}, 'JOB_STATUS': {$in : ["Not Started" , "Job Started","Job Submitted","Job Paused"]}});
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




  }


});



// ******************************************************************************************************************************************************************************
// SERVICE LR DETAILS LIST - ADMIN PANEL
// ******************************************************************************************************************************************************************************


router.post('/report/lr_detail_list',async function (req, res) {
  
   console.log("*********",req.body);     


  if(req.body.user_type == 'Admin'){




       if(req.body.status == 'Not Started'){
       var bd_b_total_count  =  await lr_service_managementModel.find({'JOB_STATUS': {$in : ["Not Started"]}});
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
       var bd_b_total_count  =  await lr_service_managementModel.find({'JOB_STATUS': {$in : ["Job Started"]}});
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
       var bd_b_total_count  =  await lr_service_managementModel.find({'JOB_STATUS': {$in : ["Job Submitted"]}});
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
       var bd_b_total_count  =  await lr_service_managementModel.find({'JOB_STATUS': {$in : ["Job Paused"]}});
       var final_data = []; 
       if(bd_b_total_count.length == 0){
        res.json({Status:"Success",Message:"Job Paused List", Data : [],Code:200}); 
       } 
       else {
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
       var bd_b_total_count  =  await lr_service_managementModel.find({'JOB_STATUS': {$in : ["Not Started","Job Started","Job Submitted","Job Paused"]}});
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

   }

   else {

    let loc = [];
    req.body.access_location.forEach(function(element) {
    loc.push(element.branch_code);
    });


      if(req.body.status == 'Not Started'){
       var bd_b_total_count  =  await lr_service_managementModel.find({'SMU_SCQH_BRCODE':{$in:loc},'JOB_STATUS': {$in : ["Not Started"]}});
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
       var bd_b_total_count  =  await lr_service_managementModel.find({'SMU_SCQH_BRCODE':{$in:loc},'JOB_STATUS': {$in : ["Job Started"]}});
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
       var bd_b_total_count  =  await lr_service_managementModel.find({'SMU_SCQH_BRCODE':{$in:loc},'JOB_STATUS': {$in : ["Job Submitted"]}});
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
       var bd_b_total_count  =  await lr_service_managementModel.find({'SMU_SCQH_BRCODE':{$in:loc},'JOB_STATUS': {$in : ["Job Paused"]}});
       var final_data = []; 
       if(bd_b_total_count.length == 0){
        res.json({Status:"Success",Message:"Job Paused List", Data : [],Code:200}); 
       } 
       else {
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

   }
});




// ******************************************************************************************************************************************************************************
// SERVICE LR COMPLETED BRANCH WISE - ADMIN PANEL
// ******************************************************************************************************************************************************************************

router.post('/getlist_completed_lr_location', function (req, res) {
  let a = [];
   req.body.access_location.forEach(function(element) {
   a.push(element.branch_code);
   });
        lr_service_managementModel.find({JOB_STATUS : 'Job Submitted',SMU_SCQH_BRCODE:{$in:a}}, function (err, Functiondetails) {
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










///////////////////////////LR Submit/////////////////////////////////



router.post('/lr_submit_data',async function (req, res) { 


    
var service_submitted_valueModel = require('./../models/service_submitted_valueModel');
let a = {
"user_id" : req.body.userId || '',
"job_id" : req.body.jobId,
"type" : "LR Service",
"date" : new Date(),
"datas" : [req.body],
}   
var submitted = await service_submitted_valueModel.create(a);
const dates = require('date-and-time');
const now1  =  new Date();
const value1 = dates.format(now1,'YYYY-MM-DDTHH:mm:ss');
var user_detail  =  await service_user_management.findOne({user_mobile_no: req.body.userId});
var job_details  =  await lr_service_managementModel.findOne({SMU_SCQH_JOBNO: req.body.jobId,SMU_SEN_MOBILENO: req.body.userId});
if(job_details == null){
res.json({Status:"Failed",Message:"Job Unable to find, Contact Admin", Data : {} ,Code:404});
} else {
try{
await lr_service_submitted_dataModel.create({
SMU_SCQH_QUOTENO: req.body.SMU_SCQH_QUOTENO,
customerAcknowledgement : req.body.customerAcknowledgement,
customerName : req.body.customerName,
customerNo : req.body.customerNo,
jobId : req.body.jobId,
remarks : req.body.remarks,
serviceType : req.body.serviceType,
techSignature : req.body.techSignature,
userId : req.body.userId,
},async function (err, user) {
let datas = {
JOB_END_TIME : ""+value1,
JOB_STATUS : "Job Submitted"
}
lr_service_managementModel.findByIdAndUpdate(job_details._id, datas, {new: true}, function (err, UpdatedDetails) {
if (err) return res.json({Status:"Failed",Message:"Internal Server Error", Data : {},Code:500});
});
});
}
catch(e){
res.json({Status:"Failed",Message:"Internal Server Error", Data : {},Code:500});
}
var path = require('path');       
var fs = require('fs');
if(job_details.JOB_START_TIME == ''){
job_details.JOB_START_TIME = value1; 
}
else {
let now1  =  new Date(job_details.JOB_START_TIME);
let value1 = dates.format(now1,'YYYY-MM-DDTHH:mm:ss');
job_details.JOB_START_TIME = value1; 
}
if(job_details.JOB_END_TIME == '') {
job_details.JOB_END_TIME = value1; 
}
else {
let now1  =  new Date(job_details.JOB_END_TIME);
let value1 = dates.format(now1,'YYYY-MM-DDTHH:mm:ss');
job_details.JOB_END_TIME = value1; 
}
console.log("techSignature",""+req.body.techSignature);
if(""+req.body.techSignature == ""){
req.body.techSignature = req.body.customerAcknowledgement;
}
var mystrone = (""+req.body.customerAcknowledgement).slice(49);
mystrone = "/home/smart/johnson_application/public/uploads"+mystrone;
var mystrtwo = (""+req.body.techSignature).slice(49);
mystrtwo = "/home/smart/johnson_application/public/uploads"+mystrtwo;
console.log("Image Path 2",mystrtwo);
console.log("Image Path 1",mystrone);
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
"JLS_SCQH_COMPNO": "",
"JLS_SCQH_JOBNO": ""+job_details.SMU_SCQH_JOBNO,
"JLS_SCQH_LRNO": ""+job_details.SMU_SCQH_LRNO,
"JLS_VANID":""+job_details.SMU_VANID,
"JLS_CUST_SIGNATURE":sourceone,
"JLS_MECH_SIGNATURE":sourcetwo,
"JLS_JOBSTARTTIME": start_time,
"JLS_JOBENDTIME": end_time,
"JLS_JOBSTATUS": "Y",
"JLS_EMPID": ""+user_detail.user_id || "E14658",
"JLS_AGID":1947,
}
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
doRelease(connection);
let datas = {
JOB_END_TIME : ""+value1,
JOB_STATUS : "Job Submitted"
}
lr_service_managementModel.findByIdAndUpdate(job_details._id, datas, {new: true}, function (err, UpdatedDetails) {
});
res.json({Status:"Success",Message:"All data submit successfully", Data : {} ,Code:200});
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


});

///////////////////////////LR Submit/////////////////////////////////


///////////////////////////LR UPDATE JOB STATUS/////////////////////////////////


router.post('/lr_job_work_status_update',async function (req, res) {
const dates = require('date-and-time');
const now1  =  new Date();
const value1 = dates.format(now1,'YYYY-MM-DDTHH:mm:ss');
var statuss = 0;
var job_details  =  await lr_service_managementModel.findOne({SMU_SCQH_QUOTENO: req.body.SMU_SCQH_QUOTENO});
if(req.body.Status == 'Job Started'){
let da = {
JOB_STATUS : req.body.Status,
JOB_VIEW_STATUS : "Viewed",
JOB_START_TIME : ""+value1,
JOB_END_TIME : ""+value1
}
statuss = 1;
lr_service_managementModel.findByIdAndUpdate(job_details._id, da, {new: true}, function (err, UpdatedDetails) {
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
lr_service_managementModel.findByIdAndUpdate(job_details._id, da, {new: true}, function (err, UpdatedDetails) {
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
lr_service_managementModel.findByIdAndUpdate(job_details._id, da, {new: true}, function (err, UpdatedDetails) {
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
lr_service_managementModel.findByIdAndUpdate(job_details._id, da, {new: true}, function (err, UpdatedDetails) {
if (err) return res.json({Status:"Failed",Message:"Internal Server Error", Data : {},Code:500});
res.json({Status:"Success",Message:"Update successfully", Data : {} ,Code:200});
}); 
}  


var location_tracking_job_wiseModel = require('./../models/location_tracking_job_wiseModel');
let a = {
"job_no" : job_details.OM_OSA_JOBNO,
"complaint_no" : req.body.SMU_SCQH_QUOTENO,
"user_mobile_no" : job_details.OM_OSA_MOBILE,
"location_text" : req.body.JOB_LOCATION,
"loc_lat" : req.body.JOB_START_LAT,
"loc_long" : req.body.JOB_START_LONG,
"date" : new Date(),
"km" : "LR service",
"remarks" : req.body.Status,
}   
var submitted = await location_tracking_job_wiseModel.create(a);  


///////////update pause resume time//////////////

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
}
);    
});

///////////////////////////LR UPDATE JOB STATUS/////////////////////////////////



//////////////////////LR CHECK STATUS/////////////////////////

router.post('/service_mr_check_work_status',async function (req, res) {
      var job_details  =  await lr_service_managementModel.findOne({SMU_SCQH_QUOTENO : req.body.SMU_SCQH_QUOTENO});
       res.json({Status:"Success",Message:job_details.JOB_STATUS,time:job_details.JOB_START_TIME,Data :{"start_time":job_details.JOB_START_TIME
       } ,Code:200});
});

//////////////////////LR CHECK STATUS/////////////////////////

module.exports = router;
