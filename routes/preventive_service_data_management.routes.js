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

var service_temp_dataModel = require('./../models/service_temp_dataModel');

var oracledb = require('oracledb');
var request = require("request");




router.get('/deletes', function (req, res) {
      ActivityModel.remove({}, function (err, user) {
          if (err) return res.status(500).send("There was a problem deleting the user.");
             res.json({Status:"Success",Message:"ActivityModel Deleted", Data : {} ,Code:200});     
      });
});





router.post('/fetch_data_from_oracle_mr_breakdown',async function(req, res) {
 console.log("***************",req.body);
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
            console.log('PR INSERT');
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
  LAST_UPDATED_TIME : ""+new Date(),
  JOB_START_TIME : "",
  JOB_END_TIME : "",
  SMU_SCH_COMPDT : ""+new Date(),
        }, 
        function (err, user) {
        // res.json({Status:"Success",Message:"Added successfully", Data : user ,Code:200}); 
        });
}
catch(e){
       console.log(e);
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
            "UPDATE JLS_SERCALL_HDR_MR SET JLS_SCHM_DWNFLAG = 'Y' WHERE  JLS_SCHM_ENGR_PHONE =:SMU_SCH_MECHCELL AND JLS_SCHM_SERTYPE = 'B' AND NVL(JLS_SCHM_DWNFLAG,'N') = 'N'",
            {
                SMU_SCH_MECHCELL : req.body.user_mobile_no,
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



router.post('/fetch_data_from_oracle_mr_breakdown_pull',async function(req, res) {
 console.log("***************",req.body);
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
            console.log('PR INSERT');
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
  LAST_UPDATED_TIME : ""+new Date(),
  JOB_START_TIME : "",
  JOB_END_TIME : "",
  SMU_SCH_COMPDT : ""+new Date(),
        }, 
        function (err, user) {
        // res.json({Status:"Success",Message:"Added successfully", Data : user ,Code:200}); 
        });
}
catch(e){
       console.log(e);
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
var job_details  =  await breakdown_managementModel.findOne({SMU_SCH_MECHCELL: req.body.user_mobile_no,SMU_SCH_JOBNO:req.body.job_id,SMU_SCH_SERTYPE : 'P'});
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
router.post('/check_work_status',async function (req, res) {
console.log("*****Request******",req.body);
var job_details  =  await breakdown_managementModel.findOne({SMU_SCH_MECHCELL: req.body.user_mobile_no,SMU_SCH_JOBNO:req.body.job_id,SMU_SCH_SERTYPE : req.body.SMU_SCH_SERTYPE,SMU_SCH_COMPNO:req.body.SMU_SCH_COMPNO});
        console.log(job_details.JOB_STATUS);
       res.json({Status:"Success",Message:job_details.JOB_STATUS, Data : {} ,Code:200});
});



router.post('/job_work_status_update',async function (req, res) {
    console.log(req.body);
           var statuss = 0;
 var job_details  =  await breakdown_managementModel.findOne({SMU_SCH_MECHCELL: req.body.user_mobile_no,SMU_SCH_JOBNO:req.body.job_id,SMU_SCH_COMPNO:req.body.SMU_SCH_COMPNO});
        if(req.body.Status == 'Job Started'){
            let da = {
            JOB_STATUS : req.body.Status,
            JOB_VIEW_STATUS : "Viewed",
            JOB_START_TIME : ""+new Date(),
            JOB_END_TIME : ""+new Date()
        }
                 statuss = 1;
         breakdown_managementModel.findByIdAndUpdate(job_details._id, da, {new: true}, function (err, UpdatedDetails) {
            if (err) return res.json({Status:"Failed",Message:"Internal Server Error", Data : {},Code:500});
            res.json({Status:"Success",Message:"Update successfully", Data : {} ,Code:200});
         }); 
        }else if(req.body.Status == 'Job Stopped'){
            let da = {
            JOB_STATUS : req.body.Status,
            JOB_END_TIME : ""+new Date()
        }
                 statuss = 4;
         breakdown_managementModel.findByIdAndUpdate(job_details._id, da, {new: true}, function (err, UpdatedDetails) {
            if (err) return res.json({Status:"Failed",Message:"Internal Server Error", Data : {},Code:500});
            res.json({Status:"Success",Message:"Update successfully", Data : {} ,Code:200});
         }); 
        }else if(req.body.Status == 'Job Paused'){
            let da = {
            JOB_STATUS : req.body.Status,
            JOB_END_TIME : ""+new Date()
        }
                 statuss = 2;
         breakdown_managementModel.findByIdAndUpdate(job_details._id, da, {new: true}, function (err, UpdatedDetails) {
            if (err) return res.json({Status:"Failed",Message:"Internal Server Error", Data : {},Code:500});
            res.json({Status:"Success",Message:"Update successfully", Data : {} ,Code:200});
         }); 
        } else if(req.body.Status == 'Job Resume'){
            let da = {
            JOB_STATUS : req.body.Status,
            JOB_END_TIME : ""+new Date()
        }
                 statuss = 3;
         breakdown_managementModel.findByIdAndUpdate(job_details._id, da, {new: true}, function (err, UpdatedDetails) {
            if (err) return res.json({Status:"Failed",Message:"Internal Server Error", Data : {},Code:500});
            res.json({Status:"Success",Message:"Update successfully", Data : {} ,Code:200});
         }); 
        }    

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
        // res.json({Status:"Success",Message:"Logout successfully", Data : {} ,Code:200});
    }
);



       // res.json({Status:"Success",Message:"Update successfully", Data : {} ,Code:200});
});





router.post('/pause_job_list',async function (req, res) {
console.log(req.body);
var job_details  =  await breakdown_mr_data_managementModel.find({JLS_SCHM_ENGR_PHONE: req.body.user_mobile_no,JOB_STATUS:'Job Paused',JLS_SCHM_SERTYPE:'P'});
console.log(job_details);
let a = [];
job_details.forEach(element => {
  a.push({
            job_id : element.JLS_SCHM_JOBNO,
            paused_time :  element.JOB_END_TIME,
            paused_at : 'Preventive MR',
            SMU_SCH_COMPNO: element.JLS_SCHM_COMPNO,
            SMU_SCH_SERTYPE : element.JLS_SCHM_SERTYPE
        })
}); 
console.log(a);
   res.json({Status:"Success",Message:"Pause job list", Data : a ,Code:200});
});



router.post('/pause_job_list_pm',async function (req, res) {
console.log(req.body);
var job_details  =  await breakdown_managementModel.find({SMU_SCH_MECHCELL: req.body.user_mobile_no,JOB_STATUS:'Job Paused',SMU_SCH_SERTYPE : 'P'});
console.log(job_details);
let a = [];
job_details.forEach(element => {
  a.push({
            job_id : element.SMU_SCH_JOBNO,
            paused_time :  element.JOB_END_TIME,
            paused_at : 'Preventive MR',
            SMU_SCH_COMPNO: element.SMU_SCH_COMPNO,
            SMU_SCH_SERTYPE : element.SMU_SCH_SERTYPE
        })
}); 
console.log(a);
   res.json({Status:"Success",Message:"Pause job list", Data : a ,Code:200});
});










router.post('/submit_data',async function (req, res) {
console.log("**********8876567876567************");
console.log(req.body);
request.post(
    'http://smart.johnsonliftsltd.com:3000/api/preventive_data_management/create',
    { json: req.body},
    function (error, response, body) {
        if (!error && response.statusCode == 200) {
        }
    }
);
var job_details_two  =  await breakdown_managementModel.findOne({SMU_SCH_MECHCELL: req.body.user_mobile_no,SMU_SCH_JOBNO:req.body.job_id});
// console.log(job_details_two);
job_details_two.JOB_START_TIME = new Date();
job_details_two.JOB_END_TIME =  new Date();
var start_date = new Date(job_details_two.JOB_START_TIME).toISOString().slice(0, 10);
var start_time = new Date(job_details_two.JOB_START_TIME).toISOString().slice(11, 19);
const myArray1 = start_date.split("-");
var month_list = ["", "Jan", "Feb", "Mar", "Apr", "May", "Jun" ,"Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
start_date = ""+myArray1[2]+"-"+month_list[+myArray1[1]]+"-"+myArray1[0]
var end_date = new Date(job_details_two.JOB_END_TIME).toISOString().slice(0, 10);
var end_time = new Date(job_details_two.JOB_END_TIME).toISOString().slice(11, 19);
const myArray2 = end_date.split("-");
var month_list = ["", "Jan", "Feb", "Mar", "Apr", "May", "Jun" ,"Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
end_date = ""+myArray2[2]+"-"+month_list[+myArray2[1]]+"-"+myArray2[0]
var str = ""+req.body.preventive_check
oracledb.getConnection({
      user: "JLSMART",
      password: "JLSMART",
      connectString: "(DESCRIPTION =(ADDRESS = (PROTOCOL = TCP)(HOST = 192.168.1.112)(PORT = 1521))(CONNECT_DATA =(SID = jlpl)))"
}, function(err, connection) {
if (err) {
    return;
}
connection.execute(
            "SELECT * from JLS_SERCALL_HDR_UPLOAD where SMU_SCH_SERTYPE='P' and SMU_SCH_JOBNO=:SMU_SCH_JOBNO and SMU_SCH_MECHCELL=:SMU_SCH_MECHCELL  and SMU_SCH_COMPNO=:SMU_SCH_COMPNO",
            {
                SMU_SCH_JOBNO :req.body.job_id,
                SMU_SCH_MECHCELL : req.body.user_mobile_no,
                SMU_SCH_COMPNO : req.body.SMU_SCH_COMPNO
             },
        {autoCommit: true},
        function (err, result) {
    if (err) { console.error(err.message);
          doRelease(connection);
          return;
     }
     console.log("Stage 1");
var ary = [];
for(let a = 0 ; a < result.rows.length; a++){
var temp_data = result.rows[a];
var results = {}
for (var i = 0; i < result.metaData.length; ++i){
results[result.metaData[i].name] = temp_data[i];
}
ary.push(results);   
if(a == result.rows.length - 1){
var job_details = ary[0];  

   
   if(""+req.body.mr_status.toUpperCase().substring(0, 1) !== 'N'){
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
}
 


////////////////JLS_SERCALLHDR_FEEDBK////////////////////

req.body.field_value_data.forEach(element => {
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
          console.log("Stage 2");
      connection.execute(
            "INSERT INTO JLS_SERCALLHDR_FEEDBK VALUES (:JLS_SCHF_COMPNO, :JLS_SCHF_JOBNO, :JLS_SCHF_SERTYPE, :JLS_SCHF_CHKLISTTYPE, :JLS_SCHF_PARCODE, :JLS_SCHF_ACTCODE, :JLS_SCHF_FDBK_RMRKS, :JLS_SCHF_PMRMRKS, :JLS_SCHF_ORCL_STATUS)",
              da, // Bind values
              { autoCommit: true}, 
        function (err, result) {
    if (err) { console.error(err.message);
          doRelease(connection);
          return;
     }
   });
   });
});


//////////JLS_SERCALL_HDR_MR/////////////////

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
        JLS_SCHM_ORCL_STATUS : "Y",
        JLS_SCHM_ENGR_PHONE : ""+job_details.SMU_SCH_SUPCELLNO,
        JLS_SCHM_ENGR_FLAG : "N",
        JLS_SCHM_ERRDESC : "",
        JLS_SCHM_AGENT_NAME : ""+job_details.SMU_SCH_CUSNAME,
        JLS_SCHM_CUSTOMER_NAME : ""+job_details.SMU_SCH_CUSNAME,
        JLS_SCHM_DWNFLAG : "N"
    }
         console.log("Stage 3");
      connection.execute("INSERT INTO JLS_SERCALL_HDR_MR VALUES (:JLS_SCHM_COMPNO, :JLS_SCHM_JOBNO, :JLS_SCHM_SERTYPE, :JLS_SCHM_PREP_DATE, :JLS_SCHM_VAN_ID, :JLS_SCHM_STATUS, :JLS_SCHM_ORCL_STATUS, :JLS_SCHM_ENGR_PHONE, :JLS_SCHM_ENGR_FLAG, :JLS_SCHM_ERRDESC, :JLS_SCHM_AGENT_NAME, :JLS_SCHM_CUSTOMER_NAME, :JLS_SCHM_DWNFLAG)",
              das, // Bind values
              { autoCommit: true}, 
        function (err, result) {
    if (err) { console.error(err.message);
          doRelease(connection);
          return;
     }
 });
});
}



////////////JLS_SERCALL_HDR_DNLOAD////////////


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
            "JLS_SCH_ACTION": "",
            "JLS_SCH_REMARKS": ""+str,
            "JLS_SCH_MRTAG" : ""+req.body.mr_status.toUpperCase().substring(0, 1),

    }
    console.log(dass);
         console.log("Stage 4");
      connection.execute(
        "INSERT INTO JLS_SERCALL_HDR_DNLOAD VALUES (:JLS_SCH_COMPNO, :JLS_SCH_JOBNO, :JLS_SCH_SERTYPE, to_date(:JLS_SCH_JOBSTARTTIME, 'DD/MM/YYYY HH24:MI:SS'), to_date(:JLS_SCH_JOBENDTIME, 'DD/MM/YYYY HH24:MI:SS'), :JLS_SCH_COMPSTATUS, :JLS_SCH_TYP_BRKDWN, :JLS_SCH_ACTION, :JLS_SCH_REMARKS, :JLS_SCH_MRTAG)",
              dass, // Bind values
              { autoCommit: true}, 
        function (err, result) {
    if (err) { console.error(err.message);
          doRelease(connection);
          return;
     }
    console.log("Inserted 3",result);
    });
});


///////////////////JLS_SERCALL_DTL_MR//////////////////

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
         console.log("Stage 5");
      connection.execute(
        "INSERT INTO JLS_SERCALL_DTL_MR VALUES (:JLS_SCDM_COMPNO, :JLS_SCDM_JOBNO, :JLS_SCDM_SERTYPE, :JLS_SCDM_SLNO, :JLS_SCDM_DESC, :JLS_SCDM_MR_QTY)",
              dass, // Bind values
              { autoCommit: true}, 
        function (err, result) {
    if (err) { console.error(err.message);
          doRelease(connection);
          return;
     }
     console.log("Inserted 4",result);
   });
   });
   }

 res.json({Status:"Success",Message:"Preventive data submit successfully", Data : {} ,Code:200});  


}
function doRelease(connection) {
       connection.release(function(err) {
         if (err) {
          console.error(err.message);
        }
      }
   );
}

} 
});
});
});



router.post('/mr_job_work_status_update',async function (req, res) {         
         console.log(req.body);
                 var statuss = 0;
        var job_details  =  await breakdown_mr_data_managementModel.findOne({JLS_SCHM_ENGR_PHONE: req.body.user_mobile_no,JLS_SCHM_JOBNO:req.body.job_id,JLS_SCHM_SERTYPE:req.body.SMU_SCH_SERTYPE,JLS_SCHM_COMPNO:req.body.SMU_SCH_COMPNO});
         console.log(job_details);
        if(req.body.Status == 'Job Started'){
            let da = {
            JOB_STATUS : req.body.Status,
            JOB_VIEW_STATUS : "Viewed",
            JOB_START_TIME : ""+new Date(),
            JOB_END_TIME : ""+new Date()
        }
        statuss = 1;
         breakdown_mr_data_managementModel.findByIdAndUpdate(job_details._id, da, {new: true}, function (err, UpdatedDetails) {
            if (err) return res.json({Status:"Failed",Message:"Internal Server Error", Data : {},Code:500});
            res.json({Status:"Success",Message:"Update successfully", Data : {} ,Code:200});
         }); 
        }else if(req.body.Status == 'Job Stopped'){
            let da = {
            JOB_STATUS : req.body.Status,
            JOB_END_TIME : ""+new Date()
        }
        statuss = 4;
         breakdown_mr_data_managementModel.findByIdAndUpdate(job_details._id, da, {new: true}, function (err, UpdatedDetails) {
            if (err) return res.json({Status:"Failed",Message:"Internal Server Error", Data : {},Code:500});
            res.json({Status:"Success",Message:"Update successfully", Data : {} ,Code:200});
         }); 
        }else if(req.body.Status == 'Job Paused'){
            let da = {
            JOB_STATUS : req.body.Status,
            JOB_END_TIME : ""+new Date()
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
            JOB_END_TIME : ""+new Date()
        }
        statuss = 3;
         breakdown_mr_data_managementModel.findByIdAndUpdate(job_details._id, da, {new: true}, function (err, UpdatedDetails) {
            if (err) return res.json({Status:"Failed",Message:"Internal Server Error", Data : {},Code:500});
            res.json({Status:"Success",Message:"Update successfully", Data : {} ,Code:200});
         }); 
        }   



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
        // res.json({Status:"Success",Message:"Logout successfully", Data : {} ,Code:200});
    }
);



});









router.post('/service_mr_job_status_count',async function (req, res) {
        var bd_paused_count  =  await breakdown_mr_data_managementModel.count({JLS_SCHM_ENGR_PHONE: req.body.user_mobile_no,JOB_STATUS:'Job Paused',JLS_SCHM_SERTYPE : 'P'});
        console.log(req.body);
        let a  = {
            paused_count : bd_paused_count
        }
       res.json({Status:"Success",Message:"Job status count", Data : a ,Code:200});
});



router.post('/service_mr_new_job_list',async function (req, res) {
var job_details  =  await breakdown_mr_data_managementModel.find({JLS_SCHM_ENGR_PHONE: req.body.user_mobile_no,JLS_SCHM_SERTYPE : 'P'});
let a = [];
job_details.forEach(element => {

if(element.JOB_STATUS == "Job Started" || element.JOB_STATUS == "Job Stopped" || element.JOB_STATUS == "Not Started" ){
        var dates = new Date(element.SMU_SCH_COMPDT).toISOString();
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




// router.post('/service_mr_customer_details',async function (req, res) {
//     console.log(req.body);
// var job_details  =  await breakdown_managementModel.findOne({SMU_SCH_COMPNO: req.body.SMU_SCH_COMPNO});
//         let a  = {
//             customer_name: job_details.SMU_SCH_CUSNAME,
//             job_id : job_details.SMU_SCH_JOBNO,
//             address1 : job_details.SMU_SCH_CUSADD1,
//             address2 : job_details.SMU_SCH_CUSADD2,
//             address3 : job_details.SMU_SCH_CUSADD3,
//             pin: job_details.SMU_SCH_CUSPIN,
//             contract_type : job_details.SMU_SCH_AMCTYPE,
//             contract_status : job_details.SMU_SCH_JOBCURSTATUS,
//             bd_number : job_details.SMU_SCH_COMPNO,
//             bd_date : job_details.SMU_SCH_COMPDT,
//             breakdown_type : job_details.SMU_SCH_BRKDOWNTYPE,
//         }
//        res.json({Status:"Success",Message:"Customer Details", Data : a ,Code:200});
// });


router.post('/service_mr_customer_details',async function (req, res) {
    console.log(req.body);
    var job_details  =  await breakdown_managementModel.findOne({SMU_SCH_COMPNO:req.body.SMU_SCH_COMPNO});
            console.log(job_details);
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
                "select * from JLS_SERCALL_HDR_UPLOAD where SMU_SCH_COMPNO = :type",
                // "select * from FEEDBACK_DETAILS",
                {type:req.body.SMU_SCH_COMPNO},
            {autoCommit: true},
            function (err, result) {
        if (err) { console.error(err.message);
              doRelease(connection);
              return;
         }
    // console.log(result.rows.length);
    var ary = [];
    for(let a = 0 ; a < result.rows.length; a++){
    var temp_data = result.rows[a];
    var results = {}
    for (var i = 0; i < result.metaData.length; ++i){
    results[result.metaData[i].name] = temp_data[i];
    }
    }
    console.log('*******',results);  
    job_details = results;
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
    });
    });
    
      }
});
    




router.post('/service_mr_check_work_status',async function (req, res) {
    console.log(req.body);
var job_details  =  await breakdown_mr_data_managementModel.findOne({JLS_SCHM_COMPNO: req.body.SMU_SCH_COMPNO});
       res.json({Status:"Success",Message:job_details.JOB_STATUS, Data : {} ,Code:200});
});





router.post('/service_mr_eng_mrlist', function (req, res) {
console.log('****************Job Id***********',req.body);  
req.body.job_id = req.body.job_id;
 let final_data = [
          {
            title : 'Mr1',
            value : ''
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
            "select * from JLS_SERCALL_DTL_MR where JLS_SCDM_JOBNO =:job_id and JLS_SCDM_SERTYPE = 'P'",
            {
              job_id : req.body.job_id
            },
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
  res.json({Status:"Success",Message:"Service Report", Data : final_data ,Code:200});
}
}
    });
});

});



router.post('/service_mr_eng_mrlist_submit',async function (req, res) {
    console.log("**************9999999**********",req.body);
 
   
  
    var job_details  =  await breakdown_mr_data_managementModel.findOne({JLS_SCHM_COMPNO:req.body.SMU_SCH_COMPNO});
     let datas = {
            JOB_END_TIME : ""+new Date(),
            JOB_STATUS : "Job Submitted"
       }
        breakdown_mr_data_managementModel.findByIdAndUpdate(job_details._id, datas, {new: true}, function (err, UpdatedDetails) {
            if (err) return res.json({Status:"Failed",Message:"Internal Server Error", Data : {},Code:500});
     });


oracledb.getConnection({
      user: "JLSMART",
      password: "JLSMART",
      connectString: "(DESCRIPTION =(ADDRESS = (PROTOCOL = TCP)(HOST = 192.168.1.112)(PORT = 1521))(CONNECT_DATA =(SID = jlpl)))"
}, function(err, connection) {
if (err) {
    return;
}
connection.execute(
            "SELECT * from JLS_SERCALL_HDR_UPLOAD where SMU_SCH_SERTYPE = 'P'  and  SMU_SCH_JOBNO=:SMU_SCH_JOBNO and SMU_SCH_SUPCELLNO=:SMU_SCH_MECHCELL and SMU_SCH_COMPNO=:SMU_SCH_COMPNO",
            {
                SMU_SCH_JOBNO :req.body.jobId,
                SMU_SCH_MECHCELL : req.body.user_mobile_no,
                SMU_SCH_COMPNO: req.body.SMU_SCH_COMPNO

             },
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
ary.push(results);   
if(a == result.rows.length - 1){
var job_details = ary[0]; 

      recall(0);

      function recall(index){
        console.log("data in");
        if(index < req.body.mr_data.length){

         console.log(index+1,""+req.body.mr_data[index].value,""+req.body.mr_data[index].partno,""+req.body.mr_data[index].req,index);
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
        function (err, result) {
    if (err) { console.error(err.message);
          doRelease(connection);
          return;
     }
       index = index + 1;
       console.log(index);
       console.log(result);
       
       recall(index);

   });
   });
   
       } else {


oracledb.getConnection({
      user: "JLSMART",
      password: "JLSMART",
      connectString: "(DESCRIPTION =(ADDRESS = (PROTOCOL = TCP)(HOST = 192.168.1.112)(PORT = 1521))(CONNECT_DATA =(SID = jlpl)))"
}, function(err, connection) {
if (err) {
    // console.error(err.message);
    return;
}
console.log(""+job_details.SMU_SCH_COMPNO);
connection.execute(
            "UPDATE JLS_SERCALL_HDR_DNLOAD set JLS_SCH_MRTAG='M' WHERE JLS_SCH_COMPNO=:JLS_SCH_COMPNO",
            {
                JLS_SCH_COMPNO : ""+job_details.SMU_SCH_COMPNO
            },
        {autoCommit: true},
        function (err, result_one) {
    if (err) { console.error(err.message);
          doRelease(connection);
          return;
     }

     
      res.json({Status:"Success",Message:"breakdown data submit successfully", Data : {} ,Code:200}); 
      console.log("********",result_one);
    });
});
       }
      }  
  doRelease(connection);

}
}
});
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




router.post('/local_service_mr_eng_mrlist_submit',async function (req, res) {
    console.log(req.body);
    res.json({Status:"Success",Message:"breakdown data submit successfully", Data : {} ,Code:200});  
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


var datas = await service_temp_dataModel.findOne({user_mobile_no: req.body.user_mobile_no,jobId:req.body.job_id,key_value :req.body.SMU_SCH_COMPNO+"cheeck"});
// res.json({Status:"Success",Message:"Functiondetails Updated", Data : datas.data_store[0] ,Code:200});
var save_datas = [];
if(datas !== null){
   save_datas = datas.data_store[0].field_value_data;
   console.log(datas.data_store[0].field_value_data);
}


    console.log("**************",req.body);
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
            "select * from JLS_PM_CHECKLIST WHERE DOOR_TYPE in ('"+req.body.job_status_type+"','JAN') ORDER BY SLNO",
            {},
        {autoCommit: true},
        function (err, result) {
    if (err) { console.error(err.message);
          doRelease(connection);
          return;
     }
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
    console.log(element);
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
                "ABNORMAL"
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
    console.log('Text');
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



  // res.json({Status:"Success",Message:"check list value",Data:final_data,Code:200});
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

var datas = await service_temp_dataModel.findOne({user_mobile_no: req.body.user_mobile_no,jobId:req.body.job_id,key_value :req.body.SMU_SCH_COMPNO});
console.log(datas.data_store[0].field_value_data);
// res.json({Status:"Success",Message:"Functiondetails Updated", Data : datas.data_store[0] ,Code:200});
// var save_datas = datas.data_store[0].field_value_data;


var save_datas = [];
if(datas !== null){
   save_datas = datas.data_store[0].field_value_data;
   console.log(datas.data_store[0].field_value_data);
}


console.log("**************",req.body);
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
            "select * from JLS_PM_CHECKLIST WHERE DOOR_TYPE in ('"+req.body.job_status_type+"','JAN') ORDER BY SLNO",
            {},
        {autoCommit: true},
        function (err, result) {
    if (err) { console.error(err.message);
          doRelease(connection);
          return;
     }
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
    console.log(element);
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
                "ABNORMAL"
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
    console.log('Text');
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
console.log(datas);
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
    console.log(req.body);
    var job_details  =  await breakdown_managementModel.findOne({SMU_SCH_MECHCELL: req.body.user_mobile_no,SMU_SCH_JOBNO:req.body.job_id,SMU_SCH_SERTYPE : 'P',SMU_SCH_COMPNO:req.body.SMU_SCH_COMPNO});
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
});





router.post('/new_job_list',async function (req, res) {
var job_details  =  await breakdown_managementModel.find({SMU_SCH_MECHCELL: req.body.user_mobile_no,SMU_SCH_SERTYPE : 'P'});
let a = [];
job_details.forEach(element => {
    if(element.JOB_STATUS !== 'Job Submitted'){
         var dates = new Date(element.SMU_SCH_COMPDT).toISOString();
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
       var bd_paused_count  =  await breakdown_managementModel.count({SMU_SCH_MECHCELL: req.body.user_mobile_no,JOB_STATUS:'Job Paused',SMU_SCH_SERTYPE : 'P'});
              console.log(bd_paused_count);
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
module.exports = router;
