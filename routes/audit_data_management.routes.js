var express = require('express');
var router = express.Router();
var bodyParser = require('body-parser');
router.use(bodyParser.urlencoded({ extended: false }));
router.use(bodyParser.json());
var preventive_data_managementModel = require('./../models/preventive_data_managementModel');
var audit_data_managementModel = require('./../models/audit_data_managementModel');
var service_temp_dataModel = require('./../models/service_temp_dataModel');


var oracledb = require('oracledb');
var audit_data_managementModel = require('./../models/audit_data_managementModel');



const dates = require('date-and-time');
const now1  =  new Date();
const value1 = dates.format(now1,'YYYY-MM-DDTHH:mm:ss');




router.post('/create',async function(req, res) {

const dates = require('date-and-time');
const now1  =  new Date();
const value1 = dates.format(now1,'YYYY-MM-DDTHH:mm:ss');

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
       let datas = {
            JOB_END_TIME : ""+value1,
            JOB_STATUS : "Job Submitted"
       }
        audit_data_managementModel.findByIdAndUpdate(job_details_two._id, datas, {new: true}, function (err, UpdatedDetails) {
            if (err) return res.json({Status:"Failed",Message:"Internal Server Error", Data : {},Code:500});
        });
        });
}
catch(e){
      res.json({Status:"Failed",Message:"Internal Server Error", Data : {},Code:500});
}
});





router.post('/service_audit_job_status_count',async function (req, res) {
        var bd_paused_count  =  await audit_data_managementModel.count({OM_OSA_MOBILE: req.body.user_mobile_no,JOB_STATUS:{$in : ["Job Resume", "Job Paused"]}});
        let a  = {
            paused_count :  bd_paused_count
        }
       res.json({Status:"Success",Message:"Job status count", Data : a ,Code:200});
});



router.post('/branch_head/service_audit_job_status_count',async function (req, res) {
        var bd_paused_count  =  await audit_data_managementModel.count({OM_OSA_BRCODE : req.body.br_code,JOB_STATUS:{$in : ["Job Resume", "Job Paused"]}});
        let a  = {
            paused_count :  bd_paused_count
        }
       res.json({Status:"Success",Message:"Job status count", Data : a ,Code:200});
});




router.post('/pause_job_list',async function (req, res) {
var job_details  =  await audit_data_managementModel.find({OM_OSA_MOBILE: req.body.user_mobile_no,JOB_STATUS:{$in : ["Job Resume", "Job Paused"]}});
let a = [];
job_details.forEach(element => {
     var dat = new Date(element.LAST_UPDATED_TIME);
     dat.setDate(dat.getDate() + 1); 
     var dates = new Date(dat).toISOString();
   a.push(
   {
    OM_OSA_COMPNO : element.OM_OSA_COMPNO,
    job_id : element.OM_OSA_JOBNO,
    name : element.OM_OSA_CUSNAME,
    date : dates.substring(0, 10),
   }
    )
}); 
   res.json({Status:"Success",Message:"Pause job list", Data : a ,Code:200});

});



router.post('/branch_head/pause_job_list',async function (req, res) {
var job_details  =  await audit_data_managementModel.find({OM_OSA_BRCODE : req.body.br_code,JOB_STATUS:{$in : ["Job Resume", "Job Paused"]}});
let a = [];
job_details.forEach(element => {
     var dat = new Date(element.LAST_UPDATED_TIME);
     dat.setDate(dat.getDate() + 1); 
     var dates = new Date(dat).toISOString();
   a.push(
   {
    OM_OSA_COMPNO : element.OM_OSA_COMPNO,
    job_id : element.OM_OSA_JOBNO,
    name : element.OM_OSA_CUSNAME,
    date : dates.substring(0, 10),
   }
    )
}); 
   res.json({Status:"Success",Message:"Pause job list", Data : a ,Code:200});

});


// ******************************************************************************************************************************************************************************
// SERVICE SITE AUDIT DETAILS DATE WISE FILTER - ADMIN PANEL
// ******************************************************************************************************************************************************************************

router.post('/audit_date_wise_filter',async function (req, res) {
var job_details  =  await audit_data_managementModel.find({JOB_STATUS:{$in : ["Job Started", "Job Stopped","Not Started","Job Paused"]}});
let a = [];
  // console.log(req.body);
job_details.forEach(element => {
  var check = new Date(element.OM_OSA_AUDDATE);
  var from = new Date(req.body.from_date);
  var to = new Date(req.body.to_date);
  console.log(check,from,to);
  if(check > from && check < to){
  a.push({
            job_id : element.OM_OSA_JOBNO,
            customer_name : element.OM_OSA_CUSNAME,
            pm_date : element.OM_OSA_AUDDATE,
            SMU_SCH_BRCODE :element.OM_OSA_BRCODE,
            SMU_SCH_MECHCELL :element.OM_OSA_MOBILE,
            status : "Active",
            JOB_STATUS: element.JOB_STATUS,
            SMU_SCH_COMPNO: element.OM_OSA_COMPNO,
            SMU_SCH_SERTYPE : "",
            _id : element._id,
            delete_status : false
  });
}
});
res.json({Status:"Success",Message:"New Job List", Data : a ,Code:200});
});





router.post('/update_mr',async function (req, res) {
    const dates = require('date-and-time');
const now1  =  new Date();
const value1 = dates.format(now1,'YYYY-MM-DDTHH:mm:ss');


  var job_details_two  =  await audit_data_managementModel.findOne({SMU_SCH_MECHCELL: req.body.user_mobile_no,SMU_SCH_JOBNO:req.body.jobId});
        let datas = {
            JOB_END_TIME : ""+value1,
            JOB_STATUS : "Job Submitted"
       }
        audit_data_managementModel.findByIdAndUpdate(job_details_two._id, datas, {new: true}, function (err, UpdatedDetails) {
            if (err) return res.json({Status:"Failed",Message:"Internal Server Error", Data : {},Code:500});
        });
});






router.post('/service_audit_new_job_list',async function (req, res) {
var job_details  =  await audit_data_managementModel.find({OM_OSA_MOBILE: req.body.user_mobile_no});
let a = [];
job_details.forEach(element => {
     if(element.JOB_STATUS == "Job Started" || element.JOB_STATUS == "Job Stopped" || element.JOB_STATUS == "Not Started" || element.JOB_STATUS == "Job Paused" ){

     var dat = new Date(element.OM_OSA_AUDDATE);
     dat.setDate(dat.getDate() + 1); 
     var dates = new Date(dat).toISOString();

  a.push(
   {
    OM_OSA_COMPNO : element.OM_OSA_COMPNO,
    job_id : element.OM_OSA_JOBNO,
    name : element.OM_OSA_CUSNAME,
    date : dates.substring(0, 10),
   }
    )
     }
});
res.json({Status:"Success",Message:"New Job List", Data : a ,Code:200});

});




router.post('/branch_head/service_audit_new_job_list',async function (req, res) {
var job_details  =  await audit_data_managementModel.find({OM_OSA_BRCODE : req.body.br_code});
let a = [];
job_details.forEach(element => {
     if(element.JOB_STATUS == "Job Started" || element.JOB_STATUS == "Job Stopped" || element.JOB_STATUS == "Not Started" || element.JOB_STATUS == "Job Paused" ){

     var dat = new Date(element.OM_OSA_AUDDATE);
     dat.setDate(dat.getDate() + 1); 
     var dates = new Date(dat).toISOString();

  a.push(
   {
    OM_OSA_COMPNO : element.OM_OSA_COMPNO,
    job_id : element.OM_OSA_JOBNO,
    name : element.OM_OSA_CUSNAME,
    date : dates.substring(0, 10),
   }
    )
     }
});
res.json({Status:"Success",Message:"New Job List", Data : a ,Code:200});

});



router.post('/service_lr_customer_details',async function (req, res) {

    // SMU_SCQH_QUOTENO : req.body.SMU_SCQH_QUOTENO
var job_details  =  await audit_data_managementModel.findOne({SMU_SCQH_JOBNO: req.body.job_id,SMU_SEN_MOBILENO: req.body.user_mobile_no});


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






router.post('/audit_check_list_value',async function (req, res) {





var datas = await service_temp_dataModel.findOne({user_mobile_no: req.body.user_mobile_no,jobId:req.body.jobId,key_value:""+req.body.OM_OSA_COMPNO+"-cheeck"});

var save_datas = [];


if(datas !== null) {
   save_datas = datas.data_store[0].fieldValueData;
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
 
connection.execute(
            "SELECT * from JLS_AUDIT_CHECKLIST where door_type=:door_type ORDER BY SLNO",
            {
                door_type : req.body.service_type
            },
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




if(save_datas.length == 0) {
res.json({Status:"Success",Message:"check list value",Data:final_data,Code:200});
} else {   
   for(let c = 0 ; c < final_data.length;c++){
        for(let d = 0; d < save_datas.length; d++){
                if(final_data[c].field_comments == save_datas[d].fieldComments){
                  final_data[c].field_value = save_datas[d].fieldValue;
                  final_data[c].field_remarks = save_datas[d].fieldRemarks;
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












// router.post('/lr_submit_data',async function (req, res) {  

// var path = require('path');       
// var fs = require('fs');
// var job_details  =  await audit_data_managementModel.findOne({SMU_SCQH_JOBNO: req.body.jobId,SMU_SEN_MOBILENO: req.body.userId});
// var mystrone = (""+req.body.customerAcknowledgement).slice(49);
// mystrone = "/home/smart/johnson_application/public/uploads"+mystrone;
// var mystrtwo = (""+req.body.techSignature).slice(49);
// mystrtwo = "/home/smart/johnson_application/public/uploads"+mystrtwo;
// var sourceone = fs.readFileSync(mystrone);
// var sourcetwo = fs.readFileSync(mystrtwo);
// var start_time = timeformat(job_details.JOB_START_TIME);
// var end_time = timeformat(job_details.JOB_END_TIME);


// function timeformat(value) {
// const d_t = new Date(value);
// let year = d_t.getFullYear();
// let month = ("0" + (d_t.getMonth() + 1)).slice(-2);
// let day = ("0" + d_t.getDate()).slice(-2);
// let hour = d_t.getHours();
// let minute = d_t.getMinutes();
// let seconds = d_t.getSeconds();
// var time_datas = day + "-" + month + "-" + year + " " + hour + ":" + minute + ":" + seconds;
//   return time_datas;
// }



// oracledb.getConnection({
//       user: "JLSMART",
//       password: "JLSMART",
//       connectString: "(DESCRIPTION =(ADDRESS = (PROTOCOL = TCP)(HOST = 192.168.1.112)(PORT = 1521))(CONNECT_DATA =(SID = jlpl)))"
// }, function(err, connection) {
// if (err) {
//     console.error(err.message);
//     return;
// }
//  let da =
//      {
//          "JLS_SCQH_COMPNO": "",
//           "JLS_SCQH_JOBNO": ""+job_details.SMU_SCQH_JOBNO,
//            "JLS_SCQH_LRNO": ""+job_details.SMU_SCQH_LRNO,
//             "JLS_VANID":""+job_details.SMU_VANID,
//              "JLS_CUST_SIGNATURE":sourceone,
//               "JLS_MECH_SIGNATURE":sourcetwo,
//                "JLS_JOBSTARTTIME": start_time,
//                 "JLS_JOBENDTIME": end_time,
//                  "JLS_JOBSTATUS": "Y",
//                  "JLS_EMPID":"E14658",
//                  "JLS_AGID":1947,

//      }

//       connection.execute(
//             "INSERT INTO JLS_QUOTELR_DNLOAD VALUES (:JLS_SCQH_COMPNO, :JLS_SCQH_JOBNO, :JLS_SCQH_LRNO, :JLS_VANID, :JLS_CUST_SIGNATURE, :JLS_MECH_SIGNATURE, TO_DATE(:JLS_JOBSTARTTIME, 'dd-mm-yyyy hh24:mi:ss'), TO_DATE(:JLS_JOBENDTIME, 'dd-mm-yyyy hh24:mi:ss'), :JLS_JOBSTATUS, :JLS_EMPID, :JLS_AGID)",
//               da, // Bind values
//               { autoCommit: true}, 
//         function (err, result) {
//     if (err) { 
//         console.error(err.message);
//           doRelease(connection);
//         res.json({Status:"Success",Message:"All data submit successfully", Data : {} ,Code:200});
//           return;
//      }

//      res.json({Status:"Success",Message:"All data submit successfully", Data : {} ,Code:200});
//      function doRelease(connection) {
//        connection.release(function(err) {
//          if (err) {
//           console.error(err.message);
//         }
//       }
//    );
// }
//    });
//    });
// });





// ******************************************************************************************************************************************************************************
// SERVICE SITE AUDIT FETCH SINGLE JOB DETAIL - ADMIN PANEL
// ******************************************************************************************************************************************************************************

router.post('/fetch_job_id', function (req, res) {
        preventive_data_managementModel.findOne({job_id:req.body.job_id}, function (err, StateList) {
          res.json({Status:"Success",Message:"Break Down Data Detail", Data : StateList ,Code:200});
        });
});






router.post('/lr_job_details_in_text',async function (req, res) {
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
            "SELECT * FROM JLS_SITEAUDIT_HDR WHERE OM_OSA_MOBILE =:OM_OSA_MOBILE AND NVL(OM_OSA_STATUS,'N')<> 'Y' ",
            { 
              OM_OSA_MOBILE:+req.body.user_mobile_no
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

  var datass  =  await audit_data_managementModel.findOne({OM_OSA_COMPNO:results.OM_OSA_COMPNO});
   if(datass == null){
    const dates = require('date-and-time');
    const now1  =  new Date();
    const value1 = dates.format(now1,'YYYY-MM-DDTHH:mm:ss');


  try{

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
            "UPDATE JLS_SITEAUDIT_HDR set OM_OSA_STATUS='Y' WHERE OM_OSA_MOBILE=:OM_OSA_MOBILE and NVL(OM_OSA_STATUS,'N')<> 'Y'",
            {
                OM_OSA_MOBILE:req.body.user_mobile_no
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




// ******************************************************************************************************************************************************************************
// SERVICE SITE AUDIT DETAILS STATUS UPDATE - ADMIN PANEL
// ******************************************************************************************************************************************************************************

router.post('/audit_oracel_data_update',async function (req, res) {
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
              "UPDATE JLS_SITEAUDIT_HDR set OM_OSA_STATUS='N' WHERE OM_OSA_COMPNO=:OM_OSA_COMPNO",
              {
                  OM_OSA_COMPNO : req.body.OM_OSA_COMPNO,
              },
          {autoCommit: true},
          function (err, result_one) {
      if (err) { console.error(err.message);
            doRelease(connection);
            return;
       }
       doRelease(connection); 
       res.json({Status:"Success",Message:"breakdown oracel data Updated", Data : {} ,Code:200});
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

if(result.rows.length == 0){
 res.json({Status:"Success",Message:"User Details", Data : {} ,Code:200});
}else{
for(let a = 0 ; a < result.rows.length; a++){
var temp_data = result.rows[a];
var results = {}
for (var i = 0; i < result.metaData.length; ++i){
results[result.metaData[i].name] = temp_data[i];
}

  var datass  =  await audit_data_managementModel.findOne({OM_OSA_COMPNO:results.OM_OSA_COMPNO});
   if(datass == null){
  try{


    const dates = require('date-and-time');
    const now1  =  new Date();
    const value1 = dates.format(now1,'YYYY-MM-DDTHH:mm:ss');



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
            "UPDATE JLS_SITEAUDIT_HDR set OM_OSA_STATUS='Y' WHERE NVL(OM_OSA_STATUS,'N')='N'",
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



router.get('/audit_oracle_data_deletes', function (req, res) {
      audit_data_managementModel.remove({}, function (err, user) {
          if (err) return res.status(500).send("There was a problem deleting the user.");
             res.json({Status:"Success",Message:"audit_oracle_data_deletes Deleted", Data : {} ,Code:200});     
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

























































// router.post('/submit',async function (req, res) {

// console.log("Audit value request",req.body);


// var service_submitted_valueModel = require('./../models/service_submitted_valueModel');
//           let a = {
//           "user_id" : req.body.userMobileNo,
//           "job_id" : req.body.omOsaCompno,
//           "type" : "Audit Service",
//           "date" : new Date(),
//           "datas" : [req.body],
//           }   
// var submitted = await service_submitted_valueModel.create(a);



 

//        const dates = require('date-and-time');
//        const now1  =  new Date();
//        const value1 = dates.format(now1,'YYYY-MM-DDTHH:mm:ss');


//        var job_details  =  await audit_data_managementModel.findOne({OM_OSA_COMPNO: req.body.omOsaCompno});

//        let datas = {
//             JOB_END_TIME : ""+value1,
//             JOB_STATUS : "Job Submitted"
//        }
//         audit_data_managementModel.findByIdAndUpdate(job_details._id, datas, {new: true}, function (err, UpdatedDetails) {
//             if (err) return res.json({Status:"Failed",Message:"Internal Server Error", Data : {},Code:500});
//         });
//   // res.json({Status:"Success",Message:"data submit successfully", Data : {} ,Code:200});  

//        insert_mr_list(job_details,req);
//        insert_mr_hrd(job_details,req);
//        for(let c = 0; c < req.body.mrData.length ; c++){
//          mrvalue(c+1,""+req.body.mrData[c].partno,""+req.body.mrData[c].req,job_details);
//        }
// // job_details.JOB_START_TIME = new Date(job_details.JOB_START_TIME);
// // job_details.JOB_END_TIME =  new Date(job_details.JOB_END_TIME);
// var start_date = job_details.JOB_START_TIME.slice(0, 10);
// var start_time = job_details.JOB_START_TIME.slice(11, 19);
// const myArray1 = start_date.split("-");
// var month_list = ["", "Jan", "Feb", "Mar", "Apr", "May", "Jun" ,"Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
// start_date = ""+myArray1[2]+"-"+month_list[+myArray1[1]]+"-"+myArray1[0]
// var end_date = job_details.JOB_END_TIME.slice(0, 10);
// var end_time = job_details.JOB_END_TIME.slice(11, 19);
// const myArray2 = end_date.split("-");
// var month_list = ["", "Jan", "Feb", "Mar", "Apr", "May", "Jun" ,"Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
// end_date = ""+myArray2[2]+"-"+month_list[+myArray2[1]]+"-"+myArray2[0]





//  function insert_mr_hrd(job_detail,req){


//  oracledb.getConnection({
//       user: "JLSMART",
//       password: "JLSMART",
//       connectString: "(DESCRIPTION =(ADDRESS = (PROTOCOL = TCP)(HOST = 192.168.1.112)(PORT = 1521))(CONNECT_DATA =(SID = jlpl)))"
// }, function(err, connection) {
// if (err) {
//     console.error(err.message);
//     return;
// }
//  let das =
//     {

//         JLS_SCHM_COMPNO :  ""+job_details.OM_OSA_COMPNO,
//         JLS_SCHM_JOBNO : ""+job_details.OM_OSA_JOBNO,
//         JLS_SCHM_SERTYPE : "A",
//         JLS_SCHM_PREP_DATE : "",//sysdate
//         JLS_SCHM_VAN_ID : ""+req.body.userMobileNo,
//         JLS_SCHM_STATUS : "NS",
//         JLS_SCHM_ORCL_STATUS : "Y",
//         JLS_SCHM_ENGR_PHONE :  ""+req.body.userMobileNo,
//         JLS_SCHM_ENGR_FLAG : "N",
//         JLS_SCHM_ERRDESC : "",
//         JLS_SCHM_AGENT_NAME : "",
//         JLS_SCHM_CUSTOMER_NAME : "",
//         JLS_SCHM_DWNFLAG : "Y"
//     }

//       connection.execute(
//             "INSERT INTO JLS_SERCALL_HDR_MR VALUES (:JLS_SCHM_COMPNO, :JLS_SCHM_JOBNO, :JLS_SCHM_SERTYPE, :JLS_SCHM_PREP_DATE, :JLS_SCHM_VAN_ID, :JLS_SCHM_STATUS, :JLS_SCHM_ORCL_STATUS, :JLS_SCHM_ENGR_PHONE, :JLS_SCHM_ENGR_FLAG, :JLS_SCHM_ERRDESC, :JLS_SCHM_AGENT_NAME, :JLS_SCHM_CUSTOMER_NAME, :JLS_SCHM_DWNFLAG)",
//               das, // Bind values
//               { autoCommit: true}, 
//         function (err, result) {
//     if (err) { console.error(err.message);
//           doRelease(connection);
//           return;
//      }
//     doRelease(connection);
//     function doRelease(connection) {
//        connection.release(function(err) {
//          if (err) {
//           console.error(err.message);
//         }
//       }
//    );
// }
//    });
//    });



//  }



//        // ***********************************************************************
// function insert_mr_list(job_detail,req) {
// var count = 0;
// recall(count,job_details);
// function recall(count,job_details) {
//  if(count < req.body.fieldValueData.length){
//   var element = req.body.fieldValueData[count];
// oracledb.getConnection({
//       user: "JLSMART",
//       password: "JLSMART",
//       connectString: "(DESCRIPTION =(ADDRESS = (PROTOCOL = TCP)(HOST = 192.168.1.112)(PORT = 1521))(CONNECT_DATA =(SID = jlpl)))"
// }, function(err, connection) {
// if (err) {
//     console.error(err.message);
//     return;
// }
//  let da =
//      {
//          "JLS_SCHF_COMPNO": ""+job_details.OM_OSA_COMPNO,
//           "JLS_SCHF_JOBNO": ""+job_details.OM_OSA_JOBNO,
//            "JLS_SCHF_SERTYPE": "A",
//             "JLS_SCHF_CHKLISTTYPE": "A",
//              "JLS_SCHF_PARCODE": ""+element.fieldCatId,
//               "JLS_SCHF_ACTCODE": ""+element.fieldGroupId,
//                "JLS_SCHF_FDBK_RMRKS": ""+element.fieldValue,
//                 "JLS_SCHF_PMRMRKS": ""+element.fieldRemarks,
//                  "JLS_SCHF_ORCL_STATUS": "Y",
//      }

//       connection.execute(
//             "INSERT INTO JLS_SERCALLHDR_FEEDBK VALUES (:JLS_SCHF_COMPNO, :JLS_SCHF_JOBNO, :JLS_SCHF_SERTYPE, :JLS_SCHF_CHKLISTTYPE, :JLS_SCHF_PARCODE, :JLS_SCHF_ACTCODE, :JLS_SCHF_FDBK_RMRKS, :JLS_SCHF_PMRMRKS, :JLS_SCHF_ORCL_STATUS)",
//               da, // Bind values
//               { autoCommit: true}, 
//         function (err, result) {
//     if (err) { console.error(err.message);
//           return;
//      }
//   count = count + 1;
//   recall(count,job_details);
//    });
// if(count < req.body.fieldValueData.length - 1){
//       doRelease(connection);
//     function doRelease(connection) {
//        connection.release(function(err) {
//          if (err) {
//           console.error(err.message);
//         }
//       }
//    );
// }
// }
//    });
// }
// }
//        }
//      // ***********************************************************************

//  function mrvalue(key,partno,req,job_details){

//    ////// FIVE Stage Completed ///////
// oracledb.getConnection({
//       user: "JLSMART",
//       password: "JLSMART",
//       connectString: "(DESCRIPTION =(ADDRESS = (PROTOCOL = TCP)(HOST = 192.168.1.112)(PORT = 1521))(CONNECT_DATA =(SID = jlpl)))"
// }, function(err, connection) {
// if (err) {
//     console.error(err.message);
//     return;
// }
//  let dass =
//      {
//             "JLS_SCCM_COMPNO": ""+job_details.OM_OSA_COMPNO,
//             "JLS_SCCM_JOBNO": ""+job_details.OM_OSA_JOBNO,
//             "JLS_SCCM_SERTYPE" : "A",
//             "JLS_SCCM_SEQNO": key,
//             "JLS_SCCM_MATLID": ""+partno,
//             "JLS_SCCM_QTY": req,
//             "JLS_SCCM_MRSEQNO" : ""
//     }
//       connection.execute(
//         "INSERT INTO JLS_SERCALL_CHILD_MR VALUES (:JLS_SCCM_COMPNO, :JLS_SCCM_JOBNO, :JLS_SCCM_SERTYPE, :JLS_SCCM_SEQNO, :JLS_SCCM_MATLID, :JLS_SCCM_QTY,:JLS_SCCM_MRSEQNO)",
//               dass, // Bind values
//               { autoCommit: true}, 
//         function (err, result) {
//     if (err) { console.error(err.message);
//           doRelease(connection);
//           return;
//      }
//                doRelease(connection);
//                function doRelease(connection) {
//        connection.release(function(err) {
//          if (err) {
//           console.error(err.message);
//         }
//       }
//    );
// }
//    });
//    });
//    }
//    // ***********************************************************************
// function doRelease(connection) {
//        connection.release(function(err) {
//          if (err) {
//           console.error(err.message);
//         }
//       }
//    );
// }




//  oracledb.getConnection({
//       user: "JLSMART",
//       password: "JLSMART",
//       connectString: "(DESCRIPTION =(ADDRESS = (PROTOCOL = TCP)(HOST = 192.168.1.112)(PORT = 1521))(CONNECT_DATA =(SID = jlpl)))"
// }, function(err, connection) {
// if (err) {
//     console.error(err.message);
//     return;
// }
//  let dass =
//      {
//             "JLS_SCH_COMPNO": ""+job_details.OM_OSA_COMPNO,
//             "JLS_SCH_JOBNO": ""+job_details.OM_OSA_JOBNO,
//             "JLS_SCH_SERTYPE" : "A",
//             "JLS_SCH_JOBSTARTTIME": ""+start_date+" "+start_time,
//             "JLS_SCH_JOBENDTIME": ""+end_date+" "+end_time,
//             "JLS_SCH_COMPSTATUS": "-",
//             "JLS_SCH_TYP_BRKDWN": "-",
//             "JLS_SCH_ACTION": "",
//             "JLS_SCH_REMARKS": "",
//             "JLS_SCH_MRTAG" : "M",

//     }
//       connection.execute(
//         "INSERT INTO JLS_SERCALL_HDR_DNLOAD VALUES (:JLS_SCH_COMPNO, :JLS_SCH_JOBNO, :JLS_SCH_SERTYPE, to_date(:JLS_SCH_JOBSTARTTIME, 'DD/MM/YYYY HH24:MI:SS'), to_date(:JLS_SCH_JOBENDTIME, 'DD/MM/YYYY HH24:MI:SS'), :JLS_SCH_COMPSTATUS, :JLS_SCH_TYP_BRKDWN, :JLS_SCH_ACTION, :JLS_SCH_REMARKS, :JLS_SCH_MRTAG)",
//               dass, // Bind values
//               { autoCommit: true}, 
//         function (err, result) {
//     if (err) { console.error(err.message);
//           doRelease(connection);
//           return;
//      }
//   // res.json({Status:"Success",Message:"data submit successfully", Data : {} ,Code:200});  
//   doRelease(connection);
//   function doRelease(connection) {
//        connection.release(function(err) {
//          if (err) {
//           console.error(err.message);
//         }
//       }
//    );
// }
//  });
// });

//   res.json({Status:"Success",Message:"data submit successfully", Data : {} ,Code:200});  
// });






router.post('/fetch_mr_list',async function (req, res) {
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
    doRelease(connection);
var ary = [];
for(let a = 0 ; a < result.rows.length ; a++){
var temp_data = result.rows[a];
var results = {}
for (var i = 0; i < result.metaData.length; ++i){
results[result.metaData[i].name] = temp_data[i];
}

second_call_back(results.SERTYPE);
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
function second_call_back(value){

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








// ******************************************************************************************************************************************************************************
// SERVICE SITE AUDIT DETAILS REPORT GRAPH - ADMIN PANEL
// ******************************************************************************************************************************************************************************
router.post('/report/part_detail_graph',async function (req, res) {
   

   console.log("Audit Report ************* ",req.body);

  if(req.body.user_type == 'Admin'){
       var bd_b_total_count  =  await audit_data_managementModel.find({'JOB_STATUS': {$in : ["Not Started" , "Job Started","Job Submitted","Job Paused"]}});
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
} else {

    let a = [];
    req.body.access_location.forEach(function(element) {
    a.push(element.branch_code);
    });
    var bd_b_total_count  =  await audit_data_managementModel.find({'OM_OSA_BRCODE':{$in:a},'JOB_STATUS': {$in : ["Not Started" , "Job Started","Job Submitted","Job Paused"]}});
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
// SERVICE SITE AUDIT DETAILS REPORT LIST - ADMIN PANEL
// ******************************************************************************************************************************************************************************
router.post('/report/part_detail_list',async function (req, res) {
       console.log("*********",req.body);   



  if(req.body.user_type == 'Admin'){

       if(req.body.status == 'Not Started'){
       var bd_b_total_count  =  await audit_data_managementModel.find({'JOB_STATUS': {$in : ["Not Started"]}});
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
       var bd_b_total_count  =  await audit_data_managementModel.find({'JOB_STATUS': {$in : ["Job Started"]}});
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
       var bd_b_total_count  =  await audit_data_managementModel.find({'JOB_STATUS': {$in : ["Job Submitted"]}});
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
       var bd_b_total_count  =  await audit_data_managementModel.find({'JOB_STATUS': {$in : ["Job Paused"]}});
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
       var bd_b_total_count  =  await audit_data_managementModel.find({'JOB_STATUS': {$in : ["Not Started","Job Started","Job Submitted","Job Paused"]}});
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

  } else {

let loc = [];
    req.body.access_location.forEach(function(element) {
    loc.push(element.branch_code);
    });

  if(req.body.status == 'Not Started'){
       var bd_b_total_count  =  await audit_data_managementModel.find({'OM_OSA_BRCODE':{$in:loc},'JOB_STATUS': {$in : ["Not Started"]}});
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
       var bd_b_total_count  =  await audit_data_managementModel.find({'OM_OSA_BRCODE':{$in:loc},'JOB_STATUS': {$in : ["Job Started"]}});
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
       var bd_b_total_count  =  await audit_data_managementModel.find({'OM_OSA_BRCODE':{$in:loc},'JOB_STATUS': {$in : ["Job Submitted"]}});
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
       var bd_b_total_count  =  await audit_data_managementModel.find({'OM_OSA_BRCODE':{$in:loc},'JOB_STATUS': {$in : ["Job Paused"]}});
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
       var bd_b_total_count  =  await audit_data_managementModel.find({'OM_OSA_BRCODE':{$in:loc},'JOB_STATUS': {$in : ["Not Started","Job Started","Job Submitted","Job Paused"]}});
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
 

});







// ******************************************************************************************************************************************************************************
// SERVICE SITE AUDIT DETAILS EDIT  - ADMIN PANEL
// ******************************************************************************************************************************************************************************
router.post('/edit', function (req, res) {
        audit_data_managementModel.findByIdAndUpdate(req.body._id, req.body, {new: true}, function (err, UpdatedDetails) {
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




router.post('/fetch_job_id_and_oracel',async function (req, res) {
var audit_data_managementModels  =  await audit_data_managementModel.findOne({"OM_OSA_JOBNO" : ""+req.body.job_id});
console.log(audit_data_managementModels);
res.json({Status:"Success",Message:"Data submit", Data : audit_data_managementModels ,Code:200});
});


// ******************************************************************************************************************************************************************************
// SERVICE SITE AUDIT DETAILS FETCH DETAILS FORM SUBMITTED - ADMIN PANEL
// ******************************************************************************************************************************************************************************
router.post('/mr_details_oracel',async function (req, res) {
var service_submitted_valueModel = require('./../models/service_submitted_valueModel');    
var service_submitted_valueModel  =  await service_submitted_valueModel.findOne({"job_id" : ""+req.body.job_id}).sort({_id:-1});
console.log(service_submitted_valueModel);

const arr = service_submitted_valueModel.datas[0].mrData;
const ids = arr.map(o => o.partno)
const filtered = arr.filter(({partno}, index) => !ids.includes(partno, index + 1))
service_submitted_valueModel.datas[0].mrData = filtered;


res.json({Status:"Success",Message:"Data submit", Data : service_submitted_valueModel ,Code:200});
});


///////////////////////////////AUDIT SUBMIT DATA//////////////////////////////


router.post('/submit_test_2',async function (req, res) {
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
console.log("Audit",results);
if(a == result.rows.length - 1){
if(+ary[0].USER_LIMIT <  10){
check_and_delete_one(req);
} else {
console.log("************************** Session Availablity " + ary[0].USER_LIMIT);
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


async function check_and_delete_one(req) {



const arr = req.body.mrData;
const ids = arr.map(o => o.partno)
const filtered = arr.filter(({partno}, index) => !ids.includes(partno, index + 1))
req.body.mrData = filtered;



const dates = require('date-and-time');
const now1  =  new Date();
const value1 = dates.format(now1,'YYYY-MM-DDTHH:mm:ss');
var job_details  =  await audit_data_managementModel.findOne({OM_OSA_COMPNO: req.body.omOsaCompno});
let datas = {
JOB_END_TIME : ""+value1,
JOB_STATUS : "Job Submitted"
}
console.log()
audit_data_managementModel.findByIdAndUpdate(job_details._id, datas, {new: true}, function (err, UpdatedDetails) {
if (err) return res.json({Status:"Failed",Message:"Internal Server Error", Data : {},Code:500});
});
var service_submitted_valueModel = require('./../models/service_submitted_valueModel');
let a = {
"user_id" : req.body.userMobileNo,
"job_id" : ""+job_details.OM_OSA_JOBNO,
"type" : "Audit Service",
"date" : new Date(),
"datas" : [req.body],
}   
var submitted = await service_submitted_valueModel.create(a);
var start_date = job_details.JOB_START_TIME.slice(0, 10);
var start_time = job_details.JOB_START_TIME.slice(11, 19);
const myArray1 = start_date.split("-");
var month_list = ["", "Jan", "Feb", "Mar", "Apr", "May", "Jun" ,"Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
start_date = ""+myArray1[2]+"-"+month_list[+myArray1[1]]+"-"+myArray1[0]
var end_date = job_details.JOB_END_TIME.slice(0, 10);
var end_time = job_details.JOB_END_TIME.slice(11, 19);
const myArray2 = end_date.split("-");
var month_list = ["", "Jan", "Feb", "Mar", "Apr", "May", "Jun" ,"Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
end_date = ""+myArray2[2]+"-"+month_list[+myArray2[1]]+"-"+myArray2[0];
insert_check_list(job_details,req,start_date,start_time,end_date,end_time);
}



// INSERT CHEK LIST ///////
function insert_check_list(job_details,req,start_date,start_time,end_date,end_time){
console.log("***************** INSERT CHECK LIST ***************");
var count = 0;
recall(count,job_details);
function recall(count,job_details) {
if(count < req.body.fieldValueData.length){
var element = req.body.fieldValueData[count];
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
connection.execute(
"INSERT INTO JLS_SERCALLHDR_FEEDBK VALUES (:JLS_SCHF_COMPNO, :JLS_SCHF_JOBNO, :JLS_SCHF_SERTYPE, :JLS_SCHF_CHKLISTTYPE, :JLS_SCHF_PARCODE, :JLS_SCHF_ACTCODE, :JLS_SCHF_FDBK_RMRKS, :JLS_SCHF_PMRMRKS, :JLS_SCHF_ORCL_STATUS)",
da, // Bind values
{ autoCommit: true}, 
function (err, result) {
if (err) { console.error(err.message);
return;
}
doRelease(connection);
count = count + 1;
recall(count,job_details,start_date,start_time,end_date,end_time);
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
}else {
if(req.body.mrData.length !== 0){
insert_mr_hrd(job_details,req,start_date,start_time,end_date,end_time);
} else {
insert_work_time(job_details,req,start_date,start_time,end_date,end_time);
}
}
}
}



function insert_mr_hrd(job_details,req,start_date,start_time,end_date,end_time){
console.log("***************** MR HEADER INSERT ***************");
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
JLS_SCHM_DWNFLAG : "Y",
JLS_SCHM_BRCODE : ""+job_details.OM_OSA_BRCODE,
JLS_SCHM_INSERTBY : "TAB_MOBILE"





}
connection.execute(
"INSERT INTO JLS_SERCALL_HDR_MR VALUES (:JLS_SCHM_COMPNO, :JLS_SCHM_JOBNO, :JLS_SCHM_SERTYPE, :JLS_SCHM_PREP_DATE, :JLS_SCHM_VAN_ID, :JLS_SCHM_STATUS, :JLS_SCHM_ORCL_STATUS, :JLS_SCHM_ENGR_PHONE, :JLS_SCHM_ENGR_FLAG, :JLS_SCHM_ERRDESC, :JLS_SCHM_AGENT_NAME, :JLS_SCHM_CUSTOMER_NAME, :JLS_SCHM_DWNFLAG, :JLS_SCHM_BRCODE, :JLS_SCHM_INSERTBY)",
das, // Bind values
{ autoCommit: true}, 
function (err, result) {
if (err) { console.error(err.message);
doRelease(connection);
return;
}
doRelease(connection);
insert_mr_list(job_details,req,start_date,start_time,end_date,end_time);
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



function insert_mr_list(job_details,req,start_date,start_time,end_date,end_time){
console.log("***************** INSERT MR CHILD LIST ***************");
for(let c = 0; c < req.body.mrData.length ; c++){
mrvalue(c+1,""+req.body.mrData[c].partno,""+req.body.mrData[c].req,job_details);
if(c == req.body.mrData.length - 1){
insert_work_time(job_details,req,start_date,start_time,end_date,end_time);
}
}
function mrvalue(key,partno,req,job_details){
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
connection.execute(
"INSERT INTO JLS_SERCALL_CHILD_MR VALUES (:JLS_SCCM_COMPNO, :JLS_SCCM_JOBNO, :JLS_SCCM_SERTYPE, :JLS_SCCM_SEQNO, :JLS_SCCM_MATLID, :JLS_SCCM_QTY,:JLS_SCCM_MRSEQNO)",
dass, // Bind values
{ autoCommit: true}, 
function (err, result) {
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
});
});
}
}  

function insert_work_time(job_details,req,start_date,start_time,end_date,end_time) {
console.log("***************** WORK TIME ***************");
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
connection.execute(
"INSERT INTO JLS_SERCALL_HDR_DNLOAD VALUES (:JLS_SCH_COMPNO, :JLS_SCH_JOBNO, :JLS_SCH_SERTYPE, to_date(:JLS_SCH_JOBSTARTTIME, 'DD/MM/YYYY HH24:MI:SS'), to_date(:JLS_SCH_JOBENDTIME, 'DD/MM/YYYY HH24:MI:SS'), :JLS_SCH_COMPSTATUS, :JLS_SCH_TYP_BRKDWN, :JLS_SCH_ACTION, :JLS_SCH_REMARKS, :JLS_SCH_MRTAG)",
dass, // Bind values
{ autoCommit: true}, 
function (err, result) {
if (err) { console.error(err.message);
doRelease(connection);
return;
} 
doRelease(connection);
res.json({Status:"Success",Message:"data submit successfully", Data : {} ,Code:200});
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

});    
///////////////////////////////AUDIT SUBMIT DATA//////////////////////////////




////////////////////////AUDIT UPDATE JOB STATUS////////////////////


router.post('/audit_job_work_status_update',async function (req, res) {

const dates = require('date-and-time');
const now1  =  new Date();
const value1 = dates.format(now1,'YYYY-MM-DDTHH:mm:ss');
var job_details  =  await audit_data_managementModel.findOne({OM_OSA_COMPNO: req.body.OM_OSA_COMPNO});   
if(req.body.Status == 'Job Started'){
let da = {
JOB_STATUS : req.body.Status,
JOB_VIEW_STATUS : "Viewed",
JOB_START_TIME : ""+value1,
JOB_END_TIME : ""+value1
}
audit_data_managementModel.findByIdAndUpdate(job_details._id, da, {new: true}, function (err, UpdatedDetails) {
if (err) return res.json({Status:"Failed",Message:"Internal Server Error", Data : {},Code:500});
res.json({Status:"Success",Message:"Update successfully", Data : {} ,Code:200});
}); 
} 
else if(req.body.Status == 'Job Stopped'){
let da = {
JOB_STATUS : req.body.Status,
JOB_END_TIME : ""+value1
}
audit_data_managementModel.findByIdAndUpdate(job_details._id, da, {new: true}, function (err, UpdatedDetails) {
if (err) return res.json({Status:"Failed",Message:"Internal Server Error", Data : {},Code:500});
res.json({Status:"Success",Message:"Update successfully", Data : {} ,Code:200});
}); 
}
else if(req.body.Status == 'Job Paused'){
let da = {
JOB_STATUS : req.body.Status,
JOB_END_TIME : ""+value1
}
audit_data_managementModel.findByIdAndUpdate(job_details._id, da, {new: true}, function (err, UpdatedDetails) {
if (err) return res.json({Status:"Failed",Message:"Internal Server Error", Data : {},Code:500});
res.json({Status:"Success",Message:"Update successfully", Data : {} ,Code:200});
}); 
}

var location_tracking_job_wiseModel = require('./../models/location_tracking_job_wiseModel');
let a = {
"job_no" : job_details.OM_OSA_JOBNO,
"complaint_no" : req.body.OM_OSA_COMPNO,
"user_mobile_no" : job_details.OM_OSA_MOBILE,
"location_text" : req.body.JOB_LOCATION,
"loc_lat" : req.body.JOB_START_LAT,
"loc_long" : req.body.JOB_START_LONG,
"date" : new Date(),
"km" : "Audit",
"remarks" : req.body.Status,
}   
var submitted = await location_tracking_job_wiseModel.create(a);    

});

////////////////////////AUDIT UPDATE JOB STATUS////////////////////




//////////////////////AUDIT CHECK STATUS/////////////////////////

router.post('/service_audit_check_work_status',async function (req, res) {
   var job_details  =  await audit_data_managementModel.findOne({OM_OSA_COMPNO: req.body.OM_OSA_COMPNO});
   res.json({Status:"Success", Message:job_details.JOB_STATUS, time:job_details.JOB_START_TIME,  Data : {} ,Code:200});
});

//////////////////////AUDIT CHECK STATUS/////////////////////////



module.exports = router;
