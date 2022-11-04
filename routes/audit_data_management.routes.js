var express = require('express');
var router = express.Router();
var bodyParser = require('body-parser');
router.use(bodyParser.urlencoded({ extended: false }));
router.use(bodyParser.json());
var preventive_data_managementModel = require('./../models/preventive_data_managementModel');
var audit_data_managementModel = require('./../models/audit_data_managementModel');



var oracledb = require('oracledb');
var audit_data_managementModel = require('./../models/audit_data_managementModel');







router.post('/create',async function(req, res) {
var job_details_two  =  await audit_data_managementModel.findOne({SMU_SCH_MECHCELL: req.body.user_mobile_no,SMU_SCH_JOBNO:req.body.job_id});
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
        audit_data_managementModel.findByIdAndUpdate(job_details_two._id, datas, {new: true}, function (err, UpdatedDetails) {
            if (err) return res.json({Status:"Failed",Message:"Internal Server Error", Data : {},Code:500});
        });
        });
}
catch(e){
              console.log(e);
      res.json({Status:"Failed",Message:"Internal Server Error", Data : {},Code:500});
}
});





router.post('/service_audit_job_status_count',async function (req, res) {
        var bd_paused_count  =  await audit_data_managementModel.count({OM_OSA_MOBILE: req.body.user_mobile_no,JOB_STATUS:'Job Paused'});
        let a  = {
            paused_count :  bd_paused_count
        }
       res.json({Status:"Success",Message:"Job status count", Data : a ,Code:200});
});




router.post('/update_mr',async function (req, res) {
  var job_details_two  =  await audit_data_managementModel.findOne({SMU_SCH_MECHCELL: req.body.user_mobile_no,SMU_SCH_JOBNO:req.body.jobId});
        let datas = {
            JOB_END_TIME : ""+new Date(),
            JOB_STATUS : "Job Submitted"
       }
        audit_data_managementModel.findByIdAndUpdate(job_details_two._id, datas, {new: true}, function (err, UpdatedDetails) {
            if (err) return res.json({Status:"Failed",Message:"Internal Server Error", Data : {},Code:500});
        });
});



router.post('/audit_job_work_status_update',async function (req, res) {
 console.log(req.body);


            res.json({Status:"Success",Message:"Update successfully", Data : {} ,Code:200});


        // var job_details  =  await audit_data_managementModel.findOne({SMU_SEN_MOBILENO: req.body.user_mobile_no,SMU_SCQH_JOBNO:req.body.job_id});
        //  console.log(job_details);
        // if(req.body.Status == 'Job Started'){
        //     let da = {
        //     JOB_STATUS : req.body.Status,
        //     JOB_VIEW_STATUS : "Viewed",
        //     JOB_START_TIME : ""+new Date(),
        //     JOB_END_TIME : ""+new Date()
        // }
        //  audit_data_managementModel.findByIdAndUpdate(job_details._id, da, {new: true}, function (err, UpdatedDetails) {
        //     if (err) return res.json({Status:"Failed",Message:"Internal Server Error", Data : {},Code:500});
        //     res.json({Status:"Success",Message:"Update successfully", Data : {} ,Code:200});
        //  }); 
        // }else if(req.body.Status == 'Job Stopped'){
        //     let da = {
        //     JOB_STATUS : req.body.Status,
        //     JOB_END_TIME : ""+new Date()
        // }
        //  audit_data_managementModel.findByIdAndUpdate(job_details._id, da, {new: true}, function (err, UpdatedDetails) {
        //     if (err) return res.json({Status:"Failed",Message:"Internal Server Error", Data : {},Code:500});
        //     res.json({Status:"Success",Message:"Update successfully", Data : {} ,Code:200});
        //  }); 
        // }else if(req.body.Status == 'Job Paused'){
        //     let da = {
        //     JOB_STATUS : req.body.Status,
        //     JOB_END_TIME : ""+new Date()
        // }
        //  audit_data_managementModel.findByIdAndUpdate(job_details._id, da, {new: true}, function (err, UpdatedDetails) {
        //     if (err) return res.json({Status:"Failed",Message:"Internal Server Error", Data : {},Code:500});
        //     res.json({Status:"Success",Message:"Update successfully", Data : {} ,Code:200});
        //  }); 
        // }    




     // res.json({Status:"Success",Message:"Update successfully", Data : {} ,Code:200});             
});








router.post('/service_audit_new_job_list',async function (req, res) {
var job_details  =  await audit_data_managementModel.find({OM_OSA_MOBILE: req.body.user_mobile_no,JOB_STATUS:'Not Started'});
let a = [];
job_details.forEach(element => {
     console.log(element.OM_OSA_AUDDATE);
     var dat = new Date(element.OM_OSA_AUDDATE);
     dat.setDate(dat.getDate() + 1); 
     var dates = new Date(dat).toISOString();
     console.log(dates);
  a.push(
   {
    OM_OSA_COMPNO : element.OM_OSA_COMPNO,
    job_id : element.OM_OSA_JOBNO,
    name : element.OM_OSA_CUSNAME,
    date : dates.substring(0, 10),
   }

    )
});
res.json({Status:"Success",Message:"New Job List", Data : a ,Code:200});

});




router.post('/service_lr_customer_details',async function (req, res) {
    console.log(req.body);
    // SMU_SCQH_QUOTENO : req.body.SMU_SCQH_QUOTENO
var job_details  =  await audit_data_managementModel.findOne({SMU_SCQH_JOBNO: req.body.job_id,SMU_SEN_MOBILENO: req.body.user_mobile_no});
 console.log(job_details);

        let a  = {
            lr_no: job_details.SMU_SCQH_LRNO,
            lr_date : job_details.SMU_SCQH_LRDT,
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


router.post('/service_audit_check_work_status',async function (req, res) {
       res.json({Status:"Success",Message:"Not Started", Data : {} ,Code:200});
});





router.post('/audit_check_list_value',async function (req, res) {
    console.log("********",req.body);
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
            "SELECT * from JLS_AUDIT_CHECKLIST where door_type=:door_type",
            {
                door_type : req.body.service_type
            },
        {autoCommit: true},
        function (err, result) {
    if (err) { console.error(err.message);
          doRelease(connection);
          return;
     }
     console.log(result);
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
            "field_remarks":  "NO RM",
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
            "field_remarks":  "NO RM",
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
            "field_remarks":  "NO RM",
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
  res.json({Status:"Success",Message:"check list value",Data:final_data,Code:200});
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







router.post('/service_audit_check_work_status',async function (req, res) {
       res.json({Status:"Success",Message:"Not Started", Data : {} ,Code:200});
});






router.post('/lr_submit_data',async function (req, res) {  
console.log(req.body);
var path = require('path');       
var fs = require('fs');
var job_details  =  await audit_data_managementModel.findOne({SMU_SCQH_JOBNO: req.body.jobId,SMU_SEN_MOBILENO: req.body.userId});
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
var job_details  =  await audit_data_managementModel.findOne({SMU_SCQH_JOBNO: req.body.job_id});
        let a  = {
                        text_value : "the work is completed in a satfisfactory manner and we hereby reqeust to accept the same for job ID = "+ job_details.SMU_SCQH_JOBNO +" . Customer Name : "+ job_details.SMU_SED_NAME +" and QUOTNO : "+ job_details.SMU_SCQH_QUOTENO+".",
                 }       
       res.json({Status:"Success",Message:"Job Detail Text", Data : a ,Code:200});
});





router.post('/fetch_data_from_oracle_audit_service',async function (req, res) {
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
            "SELECT * FROM JLS_SITEAUDIT_HDR WHERE OM_OSA_MOBILE =:OM_OSA_MOBILE AND OM_OSA_STATUS <> 'Y'",
            { 
              OM_OSA_MOBILE:+req.body.user_mobile_no
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
console.log(results);
  var datass  =  await audit_data_managementModel.findOne({OM_OSA_COMPNO:results.OM_OSA_COMPNO});
   if(datass == null){
  try{
    console.log('AUDIT INSERT');
  await audit_data_managementModel.create({
OM_OSA_SEQNO:  results.OM_OSA_SEQNO,
OM_OSA_AUDDATE:  results.OM_OSA_AUDDATE,
OM_OSA_BRCODE:  results.OM_OSA_BRCODE,
OM_OSA_JOBNO:  results.OM_OSA_JOBNO,
OM_OSA_CUSNAME:  results.OM_OSA_CUSNAME,
OM_OSA_COMPNO:  results.OM_OSA_COMPNO,
OM_OSA_MECHCODE:  results.OM_OSA_MECHCODE,
OM_OSA_ENGRCODE:  results.OM_OSA_ENGRCODE,
OM_OSA_MOBILE:  results.OM_OSA_MOBILE,
OM_OSA_MATLREQD:  results.OM_OSA_MATLREQD,
OM_OSA_MATLREMARK:  results.OM_OSA_MATLREMARK,
OM_OSA_STATUS:  results.OM_OSA_STATUS,
OM_OSA_PREPBY:  results.OM_OSA_PREPBY,
OM_OSA_PREPDT:  results.OM_OSA_PREPDT,
OM_OSA_MODBY:  results.OM_OSA_MODBY,
OM_OSA_MODDT:  results.OM_OSA_MODDT,
OM_OSA_APPBY:  results.OM_OSA_APPBY,
OM_OSA_APPDT:  results.OM_OSA_APPDT,
OM_OSA_ERRDESC:  results.OM_OSA_ERRDESC,

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
            "UPDATE JLS_SITEAUDIT_HDR set OM_OSA_STATUS='Y' WHERE OM_OSA_MOBILE=:OM_OSA_MOBILE and OM_OSA_STATUS <> 'Y'",
            {
                OM_OSA_MOBILE:req.body.user_mobile_no
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







router.post('/fetch_data_from_oracle_audit_service_pull',async function (req, res) {
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
            "SELECT * FROM JLS_SITEAUDIT_HDR WHERE OM_OSA_STATUS = 'N'",
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
console.log(results);
  var datass  =  await audit_data_managementModel.findOne({OM_OSA_COMPNO:results.OM_OSA_COMPNO});
   if(datass == null){
  try{
    console.log('AUDIT INSERT');
  await audit_data_managementModel.create({
OM_OSA_SEQNO:  results.OM_OSA_SEQNO,
OM_OSA_AUDDATE:  results.OM_OSA_AUDDATE,
OM_OSA_BRCODE:  results.OM_OSA_BRCODE,
OM_OSA_JOBNO:  results.OM_OSA_JOBNO,
OM_OSA_CUSNAME:  results.OM_OSA_CUSNAME,
OM_OSA_COMPNO:  results.OM_OSA_COMPNO,
OM_OSA_MECHCODE:  results.OM_OSA_MECHCODE,
OM_OSA_ENGRCODE:  results.OM_OSA_ENGRCODE,
OM_OSA_MOBILE:  results.OM_OSA_MOBILE,
OM_OSA_MATLREQD:  results.OM_OSA_MATLREQD,
OM_OSA_MATLREMARK:  results.OM_OSA_MATLREMARK,
OM_OSA_STATUS:  results.OM_OSA_STATUS,
OM_OSA_PREPBY:  results.OM_OSA_PREPBY,
OM_OSA_PREPDT:  results.OM_OSA_PREPDT,
OM_OSA_MODBY:  results.OM_OSA_MODBY,
OM_OSA_MODDT:  results.OM_OSA_MODDT,
OM_OSA_APPBY:  results.OM_OSA_APPBY,
OM_OSA_APPDT:  results.OM_OSA_APPDT,
OM_OSA_ERRDESC:  results.OM_OSA_ERRDESC,

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
            "UPDATE JLS_SITEAUDIT_HDR set OM_OSA_STATUS='Y' WHERE NVL(OM_OSA_STATUS,'N')='N'",
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



router.get('/audit_oracle_data_deletes', function (req, res) {
      audit_data_managementModel.remove({}, function (err, user) {
          if (err) return res.status(500).send("There was a problem deleting the user.");
             res.json({Status:"Success",Message:"lr_oracle_data_deletes Deleted", Data : {} ,Code:200});     
      });
});




router.post('/fetch_job_id', function (req, res) {
        audit_data_managementModel.findOne({job_id:req.body.job_id}, function (err, StateList) {
          res.json({Status:"Success",Message:"Break Down Data Detail", Data : StateList ,Code:200});
        });
});



router.get('/getlist_service_data', function (req, res) {
        audit_data_managementModel.find({}, function (err, Functiondetails) {
          res.json({Status:"Success",Message:"Functiondetails", Data : Functiondetails ,Code:200});
        });
});



router.get('/getlist_data', function (req, res) {
        audit_data_managementModel.find({}, function (err, Functiondetails) {
          res.json({Status:"Success",Message:"Functiondetails", Data : Functiondetails ,Code:200});
        });
});


router.post('/submit',async function (req, res) {
       console.log(req.body);
       var job_details  =  await audit_data_managementModel.findOne({OM_OSA_COMPNO: req.body.omOsaCompno});
       // console.log(job_details);
       insert_mr_list(job_details,req);
       insert_mr_hrd(job_details,req);
       for(let c = 0; c < req.body.mrData.length ; c++){
         mrvalue(c+1,""+req.body.mrData[c].partno,""+req.body.mrData[c].req,job_details);
       }
job_details.JOB_START_TIME = new Date();
job_details.JOB_END_TIME =  new Date();
var start_date = new Date(job_details.JOB_START_TIME).toISOString().slice(0, 10);
var start_time = new Date(job_details.JOB_START_TIME).toISOString().slice(11, 19);
const myArray1 = start_date.split("-");
var month_list = ["", "Jan", "Feb", "Mar", "Apr", "May", "Jun" ,"Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
start_date = ""+myArray1[2]+"-"+month_list[+myArray1[1]]+"-"+myArray1[0]
var end_date = new Date(job_details.JOB_END_TIME).toISOString().slice(0, 10);
var end_time = new Date(job_details.JOB_END_TIME).toISOString().slice(11, 19);
const myArray2 = end_date.split("-");
var month_list = ["", "Jan", "Feb", "Mar", "Apr", "May", "Jun" ,"Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
end_date = ""+myArray2[2]+"-"+month_list[+myArray2[1]]+"-"+myArray2[0]


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
            "JLS_SCH_COMPNO": ""+job_details.OM_OSA_COMPNO,
            "JLS_SCH_JOBNO": ""+job_details.OM_OSA_JOBNO,
            "JLS_SCH_SERTYPE" : "A",
            "JLS_SCH_JOBSTARTTIME": ""+start_date+" "+start_time,
            "JLS_SCH_JOBENDTIME": ""+end_date+" "+end_time,
            "JLS_SCH_COMPSTATUS": "-",
            "JLS_SCH_TYP_BRKDWN": "-",
            "JLS_SCH_ACTION": "",
            "JLS_SCH_REMARKS": "",
            "JLS_SCH_MRTAG" : "M",

    }
    console.log("Stage 1");
    // console.log(dass);
    res.json({Status:"Success",Message:"Audit Form Submitted", Data : {} ,Code:200});  
      connection.execute(
        "INSERT INTO JLS_SERCALL_HDR_DNLOAD VALUES (:JLS_SCH_COMPNO, :JLS_SCH_JOBNO, :JLS_SCH_SERTYPE, to_date(:JLS_SCH_JOBSTARTTIME, 'DD/MM/YYYY HH24:MI:SS'), to_date(:JLS_SCH_JOBENDTIME, 'DD/MM/YYYY HH24:MI:SS'), :JLS_SCH_COMPSTATUS, :JLS_SCH_TYP_BRKDWN, :JLS_SCH_ACTION, :JLS_SCH_REMARKS, :JLS_SCH_MRTAG)",
              dass, // Bind values
              { autoCommit: true}, 
        function (err, result) {
    if (err) { console.error(err.message);
          doRelease(connection);
          return;
     }
  // res.json({Status:"Success",Message:"breakdown data submit successfully", Data : {} ,Code:200});  
  doRelease(connection);
 });
});



 function insert_mr_hrd(job_detail,req){


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

        JLS_SCHM_COMPNO :  ""+job_details.OM_OSA_COMPNO,
        JLS_SCHM_JOBNO : ""+job_details.OM_OSA_JOBNO,
        JLS_SCHM_SERTYPE : "A",
        JLS_SCHM_PREP_DATE : "",//sysdate
        JLS_SCHM_VAN_ID : ""+req.body.userMobileNo,
        JLS_SCHM_STATUS : "NS",
        JLS_SCHM_ORCL_STATUS : "Y",
        JLS_SCHM_ENGR_PHONE :  ""+req.body.userMobileNo,
        JLS_SCHM_ENGR_FLAG : "N",
        JLS_SCHM_ERRDESC : "",
        JLS_SCHM_AGENT_NAME : "",
        JLS_SCHM_CUSTOMER_NAME : "",
        JLS_SCHM_DWNFLAG : "Y"
    }
    console.log(das);
      connection.execute(
            "INSERT INTO JLS_SERCALL_HDR_MR VALUES (:JLS_SCHM_COMPNO, :JLS_SCHM_JOBNO, :JLS_SCHM_SERTYPE, :JLS_SCHM_PREP_DATE, :JLS_SCHM_VAN_ID, :JLS_SCHM_STATUS, :JLS_SCHM_ORCL_STATUS, :JLS_SCHM_ENGR_PHONE, :JLS_SCHM_ENGR_FLAG, :JLS_SCHM_ERRDESC, :JLS_SCHM_AGENT_NAME, :JLS_SCHM_CUSTOMER_NAME, :JLS_SCHM_DWNFLAG)",
              das, // Bind values
              { autoCommit: true}, 
        function (err, result) {
    if (err) { console.error(err.message);
          doRelease(connection);
          return;
     }
     console.log("Inserted 2",result);
   });
   });



 }



       // ***********************************************************************
       function insert_mr_list(job_detail,req) {
req.body.fieldValueData.forEach(element => {
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
         "JLS_SCHF_COMPNO": ""+job_details.OM_OSA_COMPNO,
          "JLS_SCHF_JOBNO": ""+job_details.OM_OSA_JOBNO,
           "JLS_SCHF_SERTYPE": "A",
            "JLS_SCHF_CHKLISTTYPE": "A",
             "JLS_SCHF_PARCODE": ""+element.fieldCatId,
              "JLS_SCHF_ACTCODE": ""+element.fieldGroupId,
               "JLS_SCHF_FDBK_RMRKS": ""+element.fieldValue,
                "JLS_SCHF_PMRMRKS": ""+element.fieldRemarks,
                 "JLS_SCHF_ORCL_STATUS": "Y",
     }
          console.log("Stage 2");
              // console.log(da);
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
       }
     // ***********************************************************************

 function mrvalue(key,partno,req,job_details){
    console.log(job_details)
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
            "JLS_SCCM_COMPNO": ""+job_details.OM_OSA_COMPNO,
            "JLS_SCCM_JOBNO": ""+job_details.OM_OSA_JOBNO,
            "JLS_SCCM_SERTYPE" : "A",
            "JLS_SCCM_SEQNO": key,
            "JLS_SCCM_MATLID": ""+partno,
            "JLS_SCCM_QTY": req,
            "JLS_SCCM_MRSEQNO" : ""
    }
    console.log("Stage 3");
    // console.log(dass);
      connection.execute(
        "INSERT INTO JLS_SERCALL_CHILD_MR VALUES (:JLS_SCCM_COMPNO, :JLS_SCCM_JOBNO, :JLS_SCCM_SERTYPE, :JLS_SCCM_SEQNO, :JLS_SCCM_MATLID, :JLS_SCCM_QTY,:JLS_SCCM_MRSEQNO)",
              dass, // Bind values
              { autoCommit: true}, 
        function (err, result) {
            console.log(result);
    if (err) { console.error(err.message);
          doRelease(connection);
          return;
     }
   });
   });
   }

   // ***********************************************************************



function doRelease(connection) {
       connection.release(function(err) {
         if (err) {
          console.error(err.message);
        }
      }
   );
}


});






router.post('/fetch_mr_list',async function (req, res) {
console.log(req.body);






// var jobdetails  =  await audit_data_managementModel.findOne({SMU_SCH_JOBNO:req.body.job_id});


oracledb.getConnection({
      user: "JLSMART",
      password: "JLSMART",
      connectString: "(DESCRIPTION =(ADDRESS = (PROTOCOL = TCP)(HOST = 192.168.1.112)(PORT = 1521))(CONNECT_DATA =(SID = jlpl)))"
}, function(err, connection) {
if (err) {
    console.error(err.message);
    return;
}
     connection.execute(
             `SELECT SERTYPE FROM JLS_GET_SERTYPE WHERE JOBNO=:JOBNO`,
             {JOBNO : req.body.job_id},
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
console.log(results);
second_call_back(results.SERTYPE);
}
});
});
function second_call_back(value){
  console.log(value)
oracledb.getConnection({
      user: "JLSMART",
      password: "JLSMART",
      connectString: "(DESCRIPTION =(ADDRESS = (PROTOCOL = TCP)(HOST = 192.168.1.112)(PORT = 1521))(CONNECT_DATA =(SID = jlpl)))"
}, function(err, connection) {
if (err) {
    console.error(err.message);
    return;
}
     connection.execute(
             `SELECT PARTNAME, COMPART, PARTNO FROM JLS_SERVMATL_VIEW WHERE SERTYPE=:SMU_SCH_SERTYPE`,
             {SMU_SCH_SERTYPE : value},
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
 ary.push(
    {
            "partname":results.PARTNAME,
            "partno": results.PARTNO,
            "partcompart": results.COMPART,
    });   
 if(a == result.rows.length - 1){  
  res.json({Status:"Success",Message:"fetch_mr_list", Data : ary ,Code:200});
     }
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
} 
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
