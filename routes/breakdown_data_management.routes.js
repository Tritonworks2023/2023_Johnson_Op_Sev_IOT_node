var express = require('express');
var router = express.Router();
var bodyParser = require('body-parser');
router.use(bodyParser.urlencoded({ extended: false }));
router.use(bodyParser.json());
var breakdown_data_managementModel = require('./../models/breakdown_data_managementModel');
var breakdown_managementModel = require('./../models/breakdown_managementModel');

var breakdown_mr_data_managementModel = require('./../models/breakdown_mr_data_managementModel');
var error_log_oracelModel = require('./../models/error_log_oracelModel');

var oracledb = require('oracledb');
var request = require("request");



router.post('/create',async function(req, res) {
const dates = require('date-and-time');
const now1  =  new Date();
const value1 = dates.format(now1,'YYYY-MM-DDTHH:mm:ss');
var job_details_two  =  await breakdown_managementModel.findOne({SMU_SCH_MECHCELL: req.body.user_mobile_no,SMU_SCH_JOBNO:req.body.job_id,SMU_SCH_COMPNO:req.body.SMU_SCH_COMPNO});
  try{
        await breakdown_data_managementModel.create({
  SMU_SCH_COMPNO  : req.body.SMU_SCH_COMPNO,
  SMU_SCH_SERTYPE  : req.body.SMU_SCH_SERTYPE,
  bd_details:  req.body.bd_details,
  breakdown_service : req.body.breakdown_service,
  customer_acknowledgemnet : req.body.customer_acknowledgemnet,
  customer_name : req.body.customer_name,
  customer_number : req.body.customer_number,
  date_of_submission : req.body.date_of_submission,
  feedback_details : req.body.feedback_details,
  feedback_remark_text : req.body.feedback_remark_text,
  job_id : req.body.job_id,
  mr_1 : req.body.mr_1,
  mr_2 : req.body.mr_2,
  mr_3 : req.body.mr_3,
  mr_4 : req.body.mr_4,
  mr_5 : req.body.mr_5,
  mr_6 : req.body.mr_6,
  mr_7 : req.body.mr_7,
  mr_8 : req.body.mr_8,
  mr_9 : req.body.mr_9,
  mr_10 : req.body.mr_10,
  tech_signature : req.body.tech_signature,
  user_mobile_no : req.body.user_mobile_no,
  eng_singature : ''
        },async function (err, user) {

       let datas = {
            JOB_END_TIME : ""+value1,
            JOB_STATUS : "Job Submitted",
            SMU_SCH_CHKLIST : ""+req.body.mr_status.toUpperCase(),
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




// ******************************************************************************************************************************************************************************
// SERVICE FETCH MR DETAILS DATE WISE - ADMIN PANEL
// ******************************************************************************************************************************************************************************
router.post('/mr_bd_date_wise_filter',async function (req, res) {
var job_details  =  await breakdown_mr_data_managementModel.find({JLS_SCHM_SERTYPE:'B',JOB_STATUS:{$in : ["Job Started", "Job Stopped","Not Started","Job Paused"]}});
let a = [];
  // console.log(req.body);
job_details.forEach(element => {
  var check = new Date(element.JLS_SCHM_PREP_DATE);
  var from = new Date(req.body.from_date);
  var to = new Date(req.body.to_date);
  if(check > from && check < to){
  a.push({
            job_id : element.JLS_SCHM_JOBNO,
            customer_name : element.JLS_SCHM_CUSTOMER_NAME,
            pm_date : element.JLS_SCHM_PREP_DATE.substring(0, 10),
            SMU_SCH_BRCODE : '',
            SMU_SCH_MECHCELL :element.JLS_SCHM_ENGR_PHONE,
            status : "Active",
            JOB_STATUS: element.JOB_STATUS,
            SMU_SCH_COMPNO: element.JLS_SCHM_COMPNO,
            SMU_SCH_SERTYPE : element.JLS_SCHM_SERTYPE,
            _id : element._id,
            delete_status : false

  }); 
}
});
res.json({Status:"Success",Message:"New Job List", Data : a ,Code:200});
});



// ******************************************************************************************************************************************************************************
// SERVICE MR PM DATE WISE FILTER
// ******************************************************************************************************************************************************************************

router.post('/mr_pm_date_wise_filter',async function (req, res) {
var job_details  =  await breakdown_mr_data_managementModel.find({JLS_SCHM_SERTYPE:'P',JOB_STATUS:{$in : ["Job Started", "Job Stopped","Not Started","Job Paused"]}});
let a = [];
  // console.log(req.body);
job_details.forEach(element => {
  var check = new Date(element.JLS_SCHM_PREP_DATE);
  var from = new Date(req.body.from_date);
  var to = new Date(req.body.to_date);
  if(check > from && check < to){
  a.push({
            job_id : element.JLS_SCHM_JOBNO,
            customer_name : element.JLS_SCHM_CUSTOMER_NAME,
            pm_date : element.JLS_SCHM_PREP_DATE.substring(0, 10),
            SMU_SCH_BRCODE : '',
            SMU_SCH_MECHCELL :element.JLS_SCHM_ENGR_PHONE,
            status : "Active",
            JOB_STATUS: element.JOB_STATUS,
            SMU_SCH_COMPNO: element.JLS_SCHM_COMPNO,
            SMU_SCH_SERTYPE : element.JLS_SCHM_SERTYPE,
            _id : element._id,
            delete_status : false
  }); 
}
});
res.json({Status:"Success",Message:"New Job List", Data : a ,Code:200});
});

router.post('/pause_job_list',async function (req, res) {
var job_details  =  await breakdown_mr_data_managementModel.find({JLS_SCHM_ENGR_PHONE: req.body.user_mobile_no,JOB_STATUS:'Job Paused',JLS_SCHM_SERTYPE:'B'});
let a = [];
job_details.forEach(element => {
  a.push({
            job_id : element.JLS_SCHM_JOBNO,
            paused_time : '23-10-2022 11:00 AM',
            paused_at : 'Breakdown Serivce',
            SMU_SCH_COMPNO: element.JLS_SCHM_COMPNO,
            SMU_SCH_SERTYPE : element.JLS_SCHM_SERTYPE
        })
}); 

   res.json({Status:"Success",Message:"Pause job list", Data : a ,Code:200});
});




router.post('/branch_head/pause_job_list',async function (req, res) {
var job_details  =  await breakdown_mr_data_managementModel.find({JLS_SCHM_BRCODE: req.body.br_code,JOB_STATUS:'Job Paused',JLS_SCHM_SERTYPE:'B'});
let a = [];
job_details.forEach(element => {
  a.push({
            job_id : element.JLS_SCHM_JOBNO,
            paused_time : '23-10-2022 11:00 AM',
            paused_at : 'Breakdown Serivce',
            SMU_SCH_COMPNO: element.JLS_SCHM_COMPNO,
            SMU_SCH_SERTYPE : element.JLS_SCHM_SERTYPE
        })
}); 

   res.json({Status:"Success",Message:"Pause job list", Data : a ,Code:200});
});






router.post('/service_mr_job_status_count',async function (req, res) {
      var bd_paused_count  =  await breakdown_mr_data_managementModel.count({JLS_SCHM_ENGR_PHONE: req.body.user_mobile_no,JOB_STATUS:'Job Paused',JLS_SCHM_SERTYPE : 'B'});
        let a  = {
            paused_count : bd_paused_count
        }
       res.json({Status:"Success",Message:"Job status count", Data : a ,Code:200});
});




router.post('/branch_head/service_mr_job_status_count',async function (req, res) {
      var bd_paused_count  =  await breakdown_mr_data_managementModel.count({JLS_SCHM_BRCODE: req.body.br_code,JOB_STATUS:'Job Paused',JLS_SCHM_SERTYPE : 'B'});
        let a  = {
            paused_count : bd_paused_count
        }
       res.json({Status:"Success",Message:"Job status count", Data : a ,Code:200});
});






router.post('/service_mr_new_job_list',async function (req, res) {
var job_details  =  await breakdown_mr_data_managementModel.find({JLS_SCHM_ENGR_PHONE: req.body.user_mobile_no,JLS_SCHM_SERTYPE:'B'});
let a = [];
job_details.forEach(element => {
var dates = new Date(element.SMU_SCH_COMPDT).toISOString();

if(element.JOB_STATUS == "Job Started" || element.JOB_STATUS == "Job Stopped" || element.JOB_STATUS == "Not Started" ){
  a.push({
            job_id : element.JLS_SCHM_JOBNO,
            customer_name : element.JLS_SCHM_CUSTOMER_NAME,
            pm_date : dates.substring(0, 10),
            status : "Active",
            SMU_SCH_COMPNO: element.JLS_SCHM_COMPNO,
            SMU_SCH_SERTYPE : element.JLS_SCHM_SERTYPE,
            JOB_STATUS : element.JOB_STATUS
  });
}
});
res.json({Status:"Success",Message:"New Job List", Data : a ,Code:200});
});



router.post('/branch_head/service_mr_new_job_list',async function (req, res) {
var job_details  =  await breakdown_mr_data_managementModel.find({JLS_SCHM_BRCODE: req.body.br_code,JLS_SCHM_SERTYPE:'B'});
let a = [];
job_details.forEach(element => {
var dates = new Date(element.SMU_SCH_COMPDT).toISOString();

if(element.JOB_STATUS == "Job Started" || element.JOB_STATUS == "Job Stopped" || element.JOB_STATUS == "Not Started" ){
  a.push({
            job_id : element.JLS_SCHM_JOBNO,
            customer_name : element.JLS_SCHM_CUSTOMER_NAME,
            pm_date : dates.substring(0, 10),
            status : "Active",
            SMU_SCH_COMPNO: element.JLS_SCHM_COMPNO,
            SMU_SCH_SERTYPE : element.JLS_SCHM_SERTYPE,
            JOB_STATUS : element.JOB_STATUS
  });
}
});
res.json({Status:"Success",Message:"New Job List", Data : a ,Code:200});
});



router.post('/job_work_status_update',async function (req, res) {



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
            JOB_END_TIME : ""+value1
        }
                 statuss = 1;
         breakdown_managementModel.findByIdAndUpdate(job_details._id, da, {new: true}, function (err, UpdatedDetails) {
            if (err) return res.json({Status:"Failed",Message:"Internal Server Error", Data : {},Code:500});
            res.json({Status:"Success",Message:"Update successfully", Data : {} ,Code:200});
         }); 
          var location_tracking_job_wiseModel = require('./../models/location_tracking_job_wiseModel');
          let a = {
          "job_no" : req.body.job_id,
          "complaint_no" : req.body.SMU_SCH_COMPNO,
          "user_mobile_no" : req.body.user_mobile_no,
          "location_text" : req.body.JOB_LOCATION,
          "loc_lat" : req.body.JOB_START_LAT,
          "loc_long" : req.body.JOB_START_LONG,
          "date" : new Date(),
          "km" : "Breakdown Serivce",
          "remarks" : "Start Job",
          }   
          var submitted = await location_tracking_job_wiseModel.create(a);

        }else if(req.body.Status == 'Job Stopped'){
            let da = {
            JOB_STATUS : req.body.Status,
            JOB_END_TIME : ""+value1,
            LAST_UPDATED_TIME : ""+value1,
        }
                 statuss = 4;
         breakdown_managementModel.findByIdAndUpdate(job_details._id, da, {new: true}, function (err, UpdatedDetails) {
            if (err) return res.json({Status:"Failed",Message:"Internal Server Error", Data : {},Code:500});
            res.json({Status:"Success",Message:"Update successfully", Data : {} ,Code:200});
         }); 
          var location_tracking_job_wiseModel = require('./../models/location_tracking_job_wiseModel');
          let a = {
          "job_no" : req.body.job_id,
          "complaint_no" : req.body.SMU_SCH_COMPNO,
          "user_mobile_no" : req.body.user_mobile_no,
          "location_text" : req.body.JOB_LOCATION,
          "loc_lat" : req.body.JOB_START_LAT,
          "loc_long" : req.body.JOB_START_LONG,
          "date" : new Date(),
          "km" : "Breakdown Serivce",
          "remarks" : "Job Stopped",
          }   
          var submitted = await location_tracking_job_wiseModel.create(a);
        }else if(req.body.Status == 'Job Paused'){
            let da = {
            JOB_STATUS : req.body.Status,
            JOB_END_TIME : ""+value1,
            LAST_UPDATED_TIME : ""+value1,
        }
               statuss = 2;
         breakdown_managementModel.findByIdAndUpdate(job_details._id, da, {new: true}, function (err, UpdatedDetails) {
            if (err) return res.json({Status:"Failed",Message:"Internal Server Error", Data : {},Code:500});
            res.json({Status:"Success",Message:"Update successfully", Data : {} ,Code:200});
         }); 
          var location_tracking_job_wiseModel = require('./../models/location_tracking_job_wiseModel');
          let a = {
          "job_no" : req.body.job_id,
          "complaint_no" : req.body.SMU_SCH_COMPNO,
          "user_mobile_no" : req.body.user_mobile_no,
          "location_text" : req.body.JOB_LOCATION,
          "loc_lat" : req.body.JOB_START_LAT,
          "loc_long" : req.body.JOB_START_LONG,
          "date" : new Date(),
          "km" : "Breakdown Serivce",
          "remarks" : "Job Paused",
          }   
          var submitted = await location_tracking_job_wiseModel.create(a);
        }    

let cc = {
    user_mobile_no : req.body.user_mobile_no,
    job_no : req.body.job_id,
    complaint_no : req.body.SMU_SCH_COMPNO,
    status : statuss,
    service_name : "BD"
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
            "select * from JLS_SERCALL_HDR_UPLOAD where SMU_SCH_COMPNO = :type",
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
if(job_details.SMU_SCH_COMPDT == undefined){
    console.log("breakdown_data_management_409 smu_sch_compdt",req.body);
}
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
            "select * from JLS_SERCALL_DTL_MR where JLS_SCDM_JOBNO =:job_id and JLS_SCDM_SERTYPE = 'B' and JLS_SCDM_COMPNO=:SMU_SCH_COMPNO",
            {
              job_id : req.body.job_id,
              SMU_SCH_COMPNO : req.body.SMU_SCH_COMPNO
            },
        {autoCommit: true},
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
   if(results.JLS_SCDM_SLNO == 1){
    final_data[0].value = results.JLS_SCDM_DESC
   }
   if(results.JLS_SCDM_SLNO == 2){
    final_data[1].value = results.JLS_SCDM_DESC
   }
   if(results.JLS_SCDM_SLNO == 3){
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
}
    });
});
});


// ******************************************************************************************************************************************************************************
// SERVICE UPDATE BREAKDOWN DETAILS STATUS  - ADMIN PANEL
// ******************************************************************************************************************************************************************************
router.post('/breakdown_oracel_data_update',async function (req, res) {
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
              "UPDATE JLS_SERCALL_HDR_UPLOAD set SMU_SCH_DWNFLAG='N', SMU_SCH_DWNFLAGDATE=:SMU_SCH_DWNFLAGDATE WHERE SMU_SCH_COMPNO=:SMU_SCH_COMPNO",
              {
                  SMU_SCH_DWNFLAGDATE : new Date(),
                  SMU_SCH_COMPNO : req.body.SMU_SCH_COMPNO,
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


// ******************************************************************************************************************************************************************************
// SERVICE FETCH BREAKDOWN DETAILS BY MOBILE NUMBER IN ORACLE TABLE - ADMIN PANEL
// ******************************************************************************************************************************************************************************

router.post('/breakdown_oracel_data',async function (req, res) {
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
             `SELECT * From JLS_SERCALL_HDR_UPLOAD WHERE SMU_SCH_SERTYPE='B' and SMU_SCH_MECHCELL=:SMU_SCH_MECHCELL`,
             {SMU_SCH_MECHCELL:req.body.user_mobile_no},
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
  res.json({Status:"Success",Message:"breakdown oracel data", Data : ary ,Code:200});
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

}); 


// ******************************************************************************************************************************************************************************
// SERVICE FETCH PREVENTIVE DETAILS FORM ORACLE BY MOBILE NO - ADMIN PANEL
// ******************************************************************************************************************************************************************************

router.post('/preventive_oracel_data',async function (req, res) {
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
             `SELECT * From JLS_SERCALL_HDR_UPLOAD WHERE SMU_SCH_SERTYPE='P' and SMU_SCH_MECHCELL=:SMU_SCH_MECHCELL`,
             {SMU_SCH_MECHCELL:req.body.user_mobile_no},
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

  res.json({Status:"Success",Message:"Preventive oracel data", Data : ary ,Code:200});
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
}); 




// ******************************************************************************************************************************************************************************
// SERVICE FETCH LR DETAILS FORM ORACLE BY MOBILE NO - ADMIN PANEL
// ******************************************************************************************************************************************************************************
router.post('/lr_oracel_data',async function (req, res) {
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
             `SELECT * From JLS_QUOTELR_UPLOAD  WHERE  SMU_SEN_MOBILENO=:SMU_SEN_MOBILENO`,
             {SMU_SEN_MOBILENO:req.body.user_mobile_no},
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

  res.json({Status:"Success",Message:"Preventive oracel data", Data : ary ,Code:200});
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
}); 


// ******************************************************************************************************************************************************************************
// SERVICE FETCH PART REPLACEMENT DETAILS FORM ORACLE BY MOBILE NO - ADMIN PANEL
// ******************************************************************************************************************************************************************************
router.post('/pr_oracel_data',async function (req, res) {
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
             `SELECT DISTINCT SMU_ACK_BRID, SMU_ACK_MRSEQNO, SMU_ACK_ISSEQNO, SMU_ACK_COMPNO, SMU_ACK_JOBNO, SMU_ACK_REQNO, SMU_ACK_SERTYPE, SMU_ACK_ECODE,  SMU_ACK_DCNO, SMU_ACK_DCDT, SMU_ACK_ENGRNAME, SMU_ACK_ADDRESS1, SMU_ACK_ADDRESS2, SMU_ACK_ADDRESS3, SMU_ACK_ADDRESS4, SMU_ACK_APINCODE, SMU_ACK_MOBILENO, SMU_ACK_STATUS FROM JLS_ACK_UPLOAD WHERE SMU_ACK_MOBILENO=:SMU_ACK_MOBILENO`,
             {SMU_ACK_MOBILENO:req.body.user_mobile_no},
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

  res.json({Status:"Success",Message:"Preventive oracel data", Data : ary ,Code:200});
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
}); 


// ******************************************************************************************************************************************************************************
// SERVICE FETCH AUDIT DETAILS BY MOBILE NUMBER - ADMIN PANEL
// ******************************************************************************************************************************************************************************
router.post('/audit_oracel_data',async function (req, res) {
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
             `SELECT * FROM JLS_SITEAUDIT_HDR WHERE OM_OSA_MOBILE =:OM_OSA_MOBILE`,
             {OM_OSA_MOBILE:req.body.user_mobile_no},
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

  res.json({Status:"Success",Message:"Preventive oracel data", Data : ary ,Code:200});
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
}); 


// ******************************************************************************************************************************************************************************
// SERVICE FETCH MR BREAKDOWN DETAILS FORM ORACLE BY MOBILE NO - ADMIN PANEL
// ******************************************************************************************************************************************************************************
router.post('/mr_bd_oracel_data',async function (req, res) {
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
             `SELECT * FROM JLS_SERCALL_HDR_MR WHERE  JLS_SCHM_ENGR_PHONE =:JLS_SCHM_ENGR_PHONE and JLS_SCHM_SERTYPE='B'`,
             {JLS_SCHM_ENGR_PHONE:req.body.user_mobile_no},
        {autoCommit: true},
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
var ary = [];
for(let a = 0 ; a < result.rows.length ; a++){
var temp_data = result.rows[a];
var results = {}
for (var i = 0; i < result.metaData.length; ++i){
results[result.metaData[i].name] = temp_data[i];
}
 ary.push(results);   
 if(a == result.rows.length - 1){  

  res.json({Status:"Success",Message:"Preventive oracel data", Data : ary ,Code:200});
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
// SERVICE MR PM ORACEL DATA FETCH - ADMIN PANEL
// ******************************************************************************************************************************************************************************
router.post('/mr_pm_oracel_data',async function (req, res) {
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
             `SELECT * FROM JLS_SERCALL_HDR_MR WHERE  JLS_SCHM_ENGR_PHONE =:JLS_SCHM_ENGR_PHONE and JLS_SCHM_SERTYPE='P'`,
             {JLS_SCHM_ENGR_PHONE:req.body.user_mobile_no},
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

  res.json({Status:"Success",Message:"Preventive oracel data", Data : ary ,Code:200});
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

















// router.post('/service_mr_eng_mrlist_submit',async function (req, res) {

// var service_submitted_valueModel = require('./../models/service_submitted_valueModel');
//           let a = {
//           "user_id" : req.body.user_mobile_no || '',
//           "job_id" : req.body.SMU_SCH_COMPNO,
//           "type" : "BreakDown Service MR Approval",
//           "date" : new Date(),
//           "datas" : [req.body],
//           }   
// var submitted = await service_submitted_valueModel.create(a);


//     const dates = require('date-and-time');
//     const now1  =  new Date();
//     const value1 = dates.format(now1,'YYYY-MM-DDTHH:mm:ss');


// const arr = req.body.mr_data;
// const ids = arr.map(o => o.partno)
// const filtered = arr.filter(({partno}, index) => !ids.includes(partno, index + 1))
// req.body.mr_data = filtered;



//    var job_details  =  await breakdown_mr_data_managementModel.findOne({JLS_SCHM_COMPNO:req.body.SMU_SCH_COMPNO});
//      let datas = {
//             JOB_END_TIME : ""+value1,
//             JOB_STATUS : "Job Submitted"
//        }
//         breakdown_mr_data_managementModel.findByIdAndUpdate(job_details._id, datas, {new: true}, function (err, UpdatedDetails) {
//             if (err) return res.json({Status:"Failed",Message:"Internal Server Error", Data : {},Code:500});
//      });

        



// oracledb.getConnection({
//       user: "JLSMART",
//       password: "JLSMART",
//       connectString: "(DESCRIPTION =(ADDRESS = (PROTOCOL = TCP)(HOST = 192.168.1.112)(PORT = 1521))(CONNECT_DATA =(SID = jlpl)))"
// }, function(err, connection) {
// if (err) {
//     return;
// }
// connection.execute(
//             "SELECT * from JLS_SERCALL_HDR_UPLOAD where SMU_SCH_SERTYPE = 'B' and SMU_SCH_COMPNO=:SMU_SCH_COMPNO",
//             {
//                 SMU_SCH_COMPNO : req.body.SMU_SCH_COMPNO
//              },
//         {autoCommit: true},
//         function (err, result) {
//     if (err) { console.error(err.message);
//           doRelease(connection);
//           return;
//      }

// var ary = [];
// for(let a = 0 ; a < result.rows.length; a++){
// var temp_data = result.rows[a];
// var results = {}
// for (var i = 0; i < result.metaData.length; ++i){
// results[result.metaData[i].name] = temp_data[i];
// }
// ary.push(results);   
// if(a == result.rows.length - 1){
// var job_details = ary[0]; 


//  recall(0);
//  function recall(index){
//    if(index < req.body.mr_data.length){

//       oracledb.getConnection({
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
//             "JLS_SCCM_COMPNO": ""+job_details.SMU_SCH_COMPNO,
//             "JLS_SCCM_JOBNO": ""+job_details.SMU_SCH_JOBNO,
//             "JLS_SCCM_SERTYPE" : "B",
//             "JLS_SCCM_SEQNO": index+1,
//             "JLS_SCCM_MATLID": ""+req.body.mr_data[index].partno,
//             "JLS_SCCM_QTY": ""+req.body.mr_data[index].req,
//             "JLS_SCCM_MRSEQNO" : ""
//     }
//       connection.execute(
//         "INSERT INTO JLS_SERCALL_CHILD_MR VALUES (:JLS_SCCM_COMPNO, :JLS_SCCM_JOBNO, :JLS_SCCM_SERTYPE, :JLS_SCCM_SEQNO, :JLS_SCCM_MATLID, :JLS_SCCM_QTY, :JLS_SCCM_MRSEQNO)",
//               dass, // Bind values
//               { autoCommit: true}, 
//         function (err, result) {
//     if (err) { console.error(err.message);
//           doRelease(connection);
//           return;
//      }
//        index = index + 1;

//        recall(index);
//    });
//    });
     
//      if(index == req.body.mr_data.length - 1){
//           doRelease(connection);  
//             function doRelease(connection) {
//        connection.release(function(err) {
//          if (err) {
//           console.error(err.message);
//         }
//       }
//       );
//     }
//      }


//        } else {

// oracledb.getConnection({
//       user: "JLSMART",
//       password: "JLSMART",
//       connectString: "(DESCRIPTION =(ADDRESS = (PROTOCOL = TCP)(HOST = 192.168.1.112)(PORT = 1521))(CONNECT_DATA =(SID = jlpl)))"
// }, function(err, connection) {
// if (err) {
//     // console.error(err.message);
//     return;
// }
// connection.execute(
//             "UPDATE JLS_SERCALL_HDR_DNLOAD set JLS_SCH_MRTAG='M' WHERE JLS_SCH_COMPNO=:JLS_SCH_COMPNO",
//             {
//                 JLS_SCH_COMPNO : ""+job_details.SMU_SCH_COMPNO
//             },
//         {autoCommit: true},
//         function (err, result_one) {
//     if (err) { console.error(err.message);
//           doRelease(connection);
//           return;
//      }
//       doRelease(connection);
//       function doRelease(connection) {
//        connection.release(function(err) {
//          if (err) {
//           console.error(err.message);
//         }
//       }
//       );
//     }

// let request_value = {
//      JLS_SCH_COMPNO : ""+job_details.SMU_SCH_COMPNO,
//      JLS_SCCM_JOBNO : ""+job_details.SMU_SCH_JOBNO,
// }
// request.post(
//     'http://smart.johnsonliftsltd.com:3000/api/breakdown_data_management/update_oracle_status',
//     { json: request_value},
//     function (error, response, body) {
//         if (!error && response.statusCode == 200) {
//         }
//     }
// );




//      res.json({Status:"Success",Message:"breakdown data submit successfully", Data : {} ,Code:200});  
//     });
// });

//     }
//    }
// }
// }
// });
// });
//    function doRelease(connection) {
//        connection.release(function(err) {
//          if (err) {
//           console.error(err.message);
//         }
//       }
//       );
//     }
// });










router.post('/update_oracle_status',async function (req, res) {



const dates = require('date-and-time');
const now1  =  new Date();
const value1 = dates.format(now1,'YYYY-MM-DDTHH:mm:ss');
var job_details  =  await breakdown_mr_data_managementModel.findOne({JLS_SCHM_COMPNO: req.body.JLS_SCH_COMPNO,JLS_SCHM_JOBNO: req.body.JLS_SCCM_JOBNO});
let datas = {
JOB_END_TIME : ""+value1,
JOB_STATUS : "Job Submitted"
}
breakdown_mr_data_managementModel.findByIdAndUpdate(job_details._id, datas, {new: true}, function (err, UpdatedDetails) {
if (err) return res.json({Status:"Failed",Message:"Internal Server Error", Data : {},Code:500});
res.json({Status:"Success",Message:"fetch_mr_list", Data : {} ,Code:200});
});
});










router.post('/fetch_mr_list',async function (req, res) {
var jobdetails  =  await breakdown_managementModel.findOne({SMU_SCH_COMPNO:req.body.SMU_SCH_COMPNO});
if(jobdetails == null){
   res.json({Status:"Failed",Message:"No Data Found", Data : [] ,Code:404});
}else {

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
             {SMU_SCH_SERTYPE : jobdetails.SMU_SCH_AMCTYPE},
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



router.get('/deletes', function (req, res) {
      breakdown_data_managementModel.remove({}, function (err, user) {
          if (err) return res.status(500).send("There was a problem deleting the user.");
             res.json({Status:"Success",Message:"breakdown_data_managementModel Deleted", Data : {} ,Code:200});     
      });
});


router.get('/mr_deletes', function (req, res) {
      breakdown_mr_data_managementModel.remove({}, function (err, user) {
          if (err) return res.status(500).send("There was a problem deleting the user.");
             res.json({Status:"Success",Message:"breakdown_data_managementModel Deleted", Data : {} ,Code:200});     
      });
});



// ******************************************************************************************************************************************************************************
// SERVICE FETCH BREAKDOWN DETAILS BY JOB & COMP  - ADMIN PANEL
// ******************************************************************************************************************************************************************************
router.post('/fetch_job_id', function (req, res) {
        breakdown_data_managementModel.findOne({job_id:req.body.job_id,SMU_SCH_COMPNO : req.body.key_value}, function (err, StateList) {
          res.json({Status:"Success",Message:"Break Down Data Detail", Data : StateList ,Code:200});
        });
});



// ******************************************************************************************************************************************************************************
// SERVICE FETCH BREAKDOWN DETAILS BY JOB & COMP  - ADMIN PANEL
// ******************************************************************************************************************************************************************************
router.post('/fetch_job_id_and_oracel', function (req, res) {
        breakdown_data_managementModel.findOne({job_id:req.body.job_id, SMU_SCH_COMPNO:req.body.key_value}, function (err, StateList) {
          res.json({Status:"Success",Message:"Break Down Data Detail", Data : StateList ,Code:200});
        });
});



router.post('/fetch_job_br_pr_data', function (req, res) {
        breakdown_managementModel.find({SMU_SCH_JOBNO:req.body.job_id}, function (err, Functiondetails) {
          res.json({Status:"Success",Message:"Functiondetails", Data : Functiondetails ,Code:200});
        });
});


router.post('/fetch_job_br_pr_mr_data', function (req, res) {
        breakdown_mr_data_managementModel.find({JLS_SCHM_JOBNO:req.body.job_id}, function (err, Functiondetails) {
          res.json({Status:"Success",Message:"Functiondetails", Data : Functiondetails ,Code:200});
        });
});





router.get('/fetch_data_change_time', function (req, res) {
        breakdown_managementModel.find({}, function (err, Functiondetails) {
          for(let a = 0 ; a < Functiondetails.length; a++){
            var date = new Date(Functiondetails[a].SMU_SCH_COMPDT);
            date.setDate(date.getDate() + 1);
            // console.log(date);
             breakdown_managementModel.findByIdAndUpdate(Functiondetails[a]._id, {current_and_last_update_time : date}, {new: true}, function (err, UpdatedDetails) {
             if (err) return res.json({Status:"Failed",Message:"Internal Server Error", Data : {},Code:500});
             console.log(a);
             // res.json({Status:"Success",Message:"Functiondetails Updated", Data : UpdatedDetails ,Code:200});
             });

             if(a == Functiondetails.length - 1){
                 res.json({Status:"Success",Message:"Functiondetails", Data : {} ,Code:200});
             }
          }
         // res.json({Status:"Success",Message:"Functiondetails", Data : Functiondetails ,Code:200});
        }).skip(150000).limit(50000).sort({ _id: -1});
});


router.get('/fetch_data_change_time_count', function (req, res) {
        breakdown_managementModel.find({}, function (err, Functiondetails) {
            res.json({Status:"Success",Message:"Functiondetails", Data :  Functiondetails ,Code:200});
        }).count();
});



// ******************************************************************************************************************************************************************************
// SERVICE FETCH BREAKDOWN DETAILS ALL  - ADMIN PANEL
// ******************************************************************************************************************************************************************************
router.get('/getlist', function (req, res) {
        breakdown_data_managementModel.find({}, function (err, Functiondetails) {
          res.json({Status:"Success",Message:"Functiondetails", Data : Functiondetails ,Code:200});
        });
});



router.get('/mr_getlist', function (req, res) {
        breakdown_mr_data_managementModel.find({}, function (err, Functiondetails) {
          res.json({Status:"Success",Message:"Functiondetails", Data : Functiondetails ,Code:200});
        });
});



// router.get('/remove_submited_job',async function (req, res) {
//    breakdown_data_managementModel.find({}, function (err, Functiondetails) {

//           var index = 0;
//           recall(index);
//           var count = 0;
//          async function recall(index) {
//              if(index < Functiondetails.length){

//               var job_details  =  await breakdown_managementModel.findOne({SMU_SCH_JOBNO:Functiondetails[index].job_id,SMU_SCH_COMPNO:Functiondetails[index].SMU_SCH_COMPNO,"JOB_STATUS": "Not Started"});
//               if(job_details == null){
//               index = index + 1;
//               recall(index);
//               }else{
//               breakdown_managementModel.findByIdAndRemove(job_details._id, function (err, user) {
//               if (err) return res.json({Status:"Failed",Message:"Internal Server Error", Data : {},Code:500});

//               index = index + 1;
//               recall(index);
//               });
//               }
//              }else {
//                 res.json({Status:"Success",Message:"Functiondetails",Data : {},Code:200});
//              }
//           }
//     });
//     });









// router.post('/repush_job_from_oracle', function (req, res) {
// oracledb.getConnection({
//       user: "JLSMART",
//       password: "JLSMART",
//       connectString: "(DESCRIPTION =(ADDRESS = (PROTOCOL = TCP)(HOST = 192.168.1.112)(PORT = 1521))(CONNECT_DATA =(SID = jlpl)))"
// }, function(err, connection) {
// if (err) {
//     console.error(err.message);
//     return;
// }
// connection.execute(
//             "UPDATE JLS_SERCALL_HDR_UPLOAD set SMU_SCH_DWNFLAG='N' WHERE SMU_SCH_MECHCELL=:SMU_SCH_MECHCELL and SMU_SCH_SERTYPE=:SMU_SCH_SERTYPE and SMU_SCH_JOBNO=:SMU_SCH_JOBNO",
//             {
//                 SMU_SCH_MECHCELL : req.body.user_mobile_no,
//                 SMU_SCH_JOBNO : req.body.job_id, 
//                 SMU_SCH_SERTYPE : req.body.type
//             },
//         {autoCommit: true},
//         function (err, result_one) {

//     if (err) { console.error(err.message);
//           doRelease(connection);
//           return;
//      }
//       res.json({Status:"Success",Message:"Updated", Data : {} ,Code:200});
//     });
// function doRelease(connection) {
//        connection.release(function(err) {
//          if (err) {
//           console.error(err.message);
//         }
//       }
//    );
// }
// });
// });




router.post('/skip_job_detail',async function (req, res) {
    oracledb.getConnection({
      user: "JLSMART",
      password: "JLSMART",
      connectString: "(DESCRIPTION =(ADDRESS = (PROTOCOL = TCP)(HOST = 192.168.1.112)(PORT = 1521))(CONNECT_DATA =(SID = jlpl)))"
},async function(err, connection) {
if (err) {
    console.error(err.message);
    return;
}
 let dass =
     {
            "JLS_SCH_COMPNO": ""+req.body.key_no,
            "JLS_SCH_JOBNO": ""+req.body.job_id,
            "JLS_SCH_SERTYPE" : "P",
            "JLS_SCH_COMPSTATUS": "SKIPPED",
            "JLS_SCH_TYP_BRKDWN": "",
            "JLS_SCH_FEEDBACK" : ""+req.body.remarks,
            "JLS_SCH_REMARKS": ""+req.body.remarks,
            "JLS_SCH_MRTAG" : "N",

    }
      connection.execute(
        "INSERT INTO JLS_SERCALL_HDR_DNLOAD VALUES (:JLS_SCH_COMPNO, :JLS_SCH_JOBNO, :JLS_SCH_SERTYPE, SYSDATE, SYSDATE, :JLS_SCH_COMPSTATUS, :JLS_SCH_TYP_BRKDWN, :JLS_SCH_FEEDBACK, :JLS_SCH_REMARKS, :JLS_SCH_MRTAG)",
              dass, // Bind values
              { autoCommit: true},async function (err, result) {
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
     res.json({Status:"Success",Message:"Updated", Data : {} ,Code:200});
     var job_details_two  =  await breakdown_managementModel.findOne({SMU_SCH_COMPNO:req.body.key_no});       
const dates = require('date-and-time');
const now1  =  new Date();
const value1 = dates.format(now1,'YYYY-MM-DDTHH:mm:ss');
       let datas = {
            LAST_UPDATED_TIME : ""+value1,
            JOB_START_TIME : ""+value1,
            JOB_END_TIME : ""+value1,
            JOB_STATUS : "Job Submitted"
       }
        breakdown_managementModel.findByIdAndUpdate(job_details_two._id, datas, {new: true}, function (err, UpdatedDetails) {
            if (err) return res.json({Status:"Failed",Message:"Internal Server Error", Data : {},Code:500});
        });
     });

});
});







// router.post('/delete_sercall_hdr_dnload', function (req, res) {
//  oracledb.getConnection({
//       user: "JLSMART",
//       password: "JLSMART",
//       connectString: "(DESCRIPTION =(ADDRESS = (PROTOCOL = TCP)(HOST = 192.168.1.112)(PORT = 1521))(CONNECT_DATA =(SID = jlpl)))"
// }, function(err, connection) {
// if (err) {
//     // console.error(err.message);
//     return;
// }
// connection.execute(
//             "Delete FROM JLS_SERCALL_HDR_DNLOAD WHERE JLS_SCH_JOBNO = :JOBNO",
//             {JOBNO : req.body.job_id},
//         {autoCommit: true},
//         function (err, result) {
//     if (err) { console.error(err.message);
//           doRelease(connection);
//           return;
//      }
//      doRelease(connection);
//      // step3();
//       res.json({Status:"Success",Message:"JLS_SERCALL_HDR_DNLOAD DELETED", Data : {} ,Code:200});
//    });
// function doRelease(connection) {
//        connection.release(function(err) {
//          if (err) {
//           console.error(err.message);
//         }
//       }
//    );
// }
// });
// });



// ******************************************************************************************************************************************************************************
// SERVICE MR DETAILS UPDATE - ADMIN PANEL
// ******************************************************************************************************************************************************************************
router.post('/mr_getlist_update', function (req, res) {
        breakdown_mr_data_managementModel.findByIdAndUpdate(req.body._id, req.body, {new: true}, function (err, UpdatedDetails) {
            if (err) return res.json({Status:"Failed",Message:"Internal Server Error", Data : {},Code:500});
             res.json({Status:"Success",Message:"Functiondetails Updated", Data : UpdatedDetails ,Code:200});
        });
});



// ******************************************************************************************************************************************************************************
// SERVICE FETCH CHILD MR FOR ORACLE - ADMIN PANEL
// ******************************************************************************************************************************************************************************
router.post('/mr_details_oracel', function (req, res) {
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
                    `SELECT * FROM JLS_SERCALL_CHILD_MR WHERE JLS_SCCM_COMPNO=:JLS_SCCM_COMPNO and JLS_SCCM_JOBNO=:JLS_SCCM_JOBNO`,
                    { JLS_SCCM_COMPNO : req.body.key_value,
                      JLS_SCCM_JOBNO : req.body.job_id
                    },
               {autoCommit: true},
               function (err, result) {
           if (err) { console.error(err.message);
                 doRelease(connection);
                 return;
            }

       if(result.rows.length == 0){
          res.json({Status:"Success",Message:"fetch_mr_list", Data : [] ,Code:200});
       }else {
         var ary = [];
       for(let a = 0 ; a < result.rows.length ; a++){
       var temp_data = result.rows[a];
       var results = {}
       for (var i = 0; i < result.metaData.length; ++i){
       results[result.metaData[i].name] = temp_data[i];
       }

        ary.push(results);   
        if(a == result.rows.length - 1){  
         res.json({Status:"Success",Message:"fetch_mr_list", Data : ary ,Code:200});
            }
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
});





router.post('/edit', function (req, res) {
        breakdown_data_managementModel.findByIdAndUpdate(req.body._id, req.body, {new: true}, function (err, UpdatedDetails) {
            if (err) return res.json({Status:"Failed",Message:"Internal Server Error", Data : {},Code:500});
             console.log(err);
             res.json({Status:"Success",Message:"Updated", Data : UpdatedDetails ,Code:200});
        });
});


// // DELETES A USER FROM THE DATABASE
router.post('/delete', function (req, res) {
      breakdown_data_managementModel.findByIdAndRemove(req.body.Activity_id, function (err, user) {
          if (err) return res.json({Status:"Failed",Message:"Internal Server Error", Data : {},Code:500});
          res.json({Status:"Success",Message:"SubFunction Deleted successfully", Data : {} ,Code:200});
      });
});





// router.post('/service_mr_eng_mrlist_submit_test_2',async function (req, res) {



//   });




///////////////////////////////BR MR SUBMIT DATA//////////////////////////////////////////


router.post('/service_mr_eng_mrlist_submit_test_2',async function (req, res) {

// let a = {
// "user_mobile_number" : req.body.user_mobile_no,
// "upload_status" : "N",
// "submitted_date_sys" :  new Date(),
// "serv_type" : "PREVENTIVE_MR",
// "job_id" : req.body.jobId,
// "comp_id" : req.body.SMU_SCH_COMPNO,
// "data": [req.body],

// }   
// var submitted_one = await service_tab_submit_data_br_Model.create(a);

console.log(' ******** Break Down MR Request In ****************');
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
async  function (err, result) {
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
console.log("Breakdown MR",results);
if(a == result.rows.length - 1){
if(+ary[0].USER_LIMIT <  10){         
var service_submitted_valueModel = require('./../models/service_submitted_valueModel');
let a = {
"user_id" : req.body.user_mobile_no || '',
"job_id" : req.body.SMU_SCH_COMPNO,
"type" : "BreakDown Service MR Approval",
"date" : new Date(),
"datas" : [req.body],
}   
var submitted = await service_submitted_valueModel.create(a);
const dates = require('date-and-time');
const now1  =  new Date();
const value1 = dates.format(now1,'YYYY-MM-DDTHH:mm:ss');
const arr = req.body.mr_data;
const ids = arr.map(o => o.partno)
const filtered = arr.filter(({partno}, index) => !ids.includes(partno, index + 1))
req.body.mr_data = filtered;
var job_detailss  =  await breakdown_mr_data_managementModel.findOne({JLS_SCHM_COMPNO:req.body.SMU_SCH_COMPNO});
let datas = {
JOB_END_TIME : ""+value1,
JOB_STATUS : "Job Submitted"
}
breakdown_mr_data_managementModel.findByIdAndUpdate(job_detailss._id, datas, {new: true}, function (err, UpdatedDetails) {
if (err) return res.json({Status:"Failed",Message:"Internal Server Error", Data : {},Code:500});
});


console.log( "*******SMU_SCH_COMPNO*****",req.body.SMU_SCH_COMPNO);

var job_details  =  await breakdown_managementModel.findOne({SMU_SCH_COMPNO:req.body.SMU_SCH_COMPNO});

console.log( "*******job_details*****",job_details);



recall(0,req,job_details);
console.log(' ******** MR ITEM INSERTING ****************');


function recall(index,req,job_details){
if(index < req.body.mr_data.length){
oracledb.getConnection({
user: "JLSMART",
password: "JLSMART",
connectString: "(DESCRIPTION =(ADDRESS = (PROTOCOL = TCP)(HOST = 192.168.1.112)(PORT = 1521))(CONNECT_DATA =(SID = jlpl)))"
},async function(err, connection) {
if (err) {
console.error(err.message);
return;
}
let dass =
{
"JLS_SCCM_COMPNO": ""+job_details.SMU_SCH_COMPNO,
"JLS_SCCM_JOBNO": ""+job_details.SMU_SCH_JOBNO,
"JLS_SCCM_SERTYPE" : "B",
"JLS_SCCM_SEQNO": index+1,
"JLS_SCCM_MATLID": ""+req.body.mr_data[index].partno,
"JLS_SCCM_QTY": ""+req.body.mr_data[index].req,
"JLS_SCCM_MRSEQNO" : ""
}
connection.execute(
"INSERT INTO JLS_SERCALL_CHILD_MR VALUES (:JLS_SCCM_COMPNO, :JLS_SCCM_JOBNO, :JLS_SCCM_SERTYPE, :JLS_SCCM_SEQNO, :JLS_SCCM_MATLID, :JLS_SCCM_QTY, :JLS_SCCM_MRSEQNO)",
dass, // Bind values
{ autoCommit: true}, 
async function (err, result) {
if (err) { console.error(err.message);
let a = {
"job_no" : ""+job_details.SMU_SCH_JOBNO || '',
"service_type" : "SERVICE",
"activity" : "BreakDown MR",
"follow_detail":"JLS_SERCALL_CHILD_MR",
"url":"/service_mr_eng_mrlist_submit_test_2",
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
console.log(result);
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
async function (err, result_one) {
if (err) { console.error(err.message);
let a = {
"job_no" : ""+job_details.SMU_SCH_JOBNO || '',
"service_type" : "SERVICE",
"activity" : "BreakDown MR UPDATE",
"follow_detail":"JLS_SERCALL_HDR_DNLOAD",
"url":"/service_mr_eng_mrlist_submit_test_2",
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
let request_value = {
JLS_SCH_COMPNO : ""+job_details.SMU_SCH_COMPNO,
JLS_SCCM_JOBNO : ""+job_details.SMU_SCH_JOBNO,
}
request.post(
'http://smart.johnsonliftsltd.com:3000/api/breakdown_data_management/update_oracle_status',
{ json: request_value},
function (error, response, body) {
if (!error && response.statusCode == 200) {
}
}
);
res.json({Status:"Success",Message:"MR SUBMITTED SUCCESSFULLY", Data : {} ,Code:200});  
}


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
});

///////////////////////////////BR MR SUBMIT DATA//////////////////////////////////////////


////////////////////////BR MR UPDATE JOB STATUS////////////////////

router.post('/mr_job_work_status_update',async function (req, res) {         
const dates = require('date-and-time');
const now1  =  new Date();
const value1 = dates.format(now1,'YYYY-MM-DDTHH:mm:ss');
var job_details  =  await breakdown_mr_data_managementModel.findOne({JLS_SCHM_ENGR_PHONE: req.body.user_mobile_no,JLS_SCHM_JOBNO:req.body.job_id,JLS_SCHM_SERTYPE:req.body.SMU_SCH_SERTYPE,JLS_SCHM_COMPNO:req.body.SMU_SCH_COMPNO});
var statuss = 0;
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

var location_tracking_job_wiseModel = require('./../models/location_tracking_job_wiseModel');
let a = {
"job_no" : req.body.job_id,
"complaint_no" : req.body.SMU_SCH_COMPNO,
"user_mobile_no" : req.body.user_mobile_no,
"location_text" : req.body.JOB_LOCATION,
"loc_lat" : req.body.JOB_START_LAT,
"loc_long" : req.body.JOB_START_LONG,
"date" : new Date(),
"km" : "Breakdown MR Approval",
"remarks" : "Start Job",
}   
var submitted = await location_tracking_job_wiseModel.create(a);
}
else if(req.body.Status == 'Job Stopped'){
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

var location_tracking_job_wiseModel = require('./../models/location_tracking_job_wiseModel');
let a = {
"job_no" : req.body.job_id,
"complaint_no" : req.body.SMU_SCH_COMPNO,
"user_mobile_no" : req.body.user_mobile_no,
"location_text" : req.body.JOB_LOCATION,
"loc_lat" : req.body.JOB_START_LAT,
"loc_long" : req.body.JOB_START_LONG,
"date" : new Date(),
"km" : "Breakdown MR Approval",
"remarks" : "Job Stopped",
}   
var submitted = await location_tracking_job_wiseModel.create(a);
} 
else if(req.body.Status == 'Job Paused'){
let da = {
JOB_STATUS : req.body.Status,
JOB_END_TIME : ""+value1,
LAST_UPDATED_TIME : ""+value1,
}
statuss = 2;
breakdown_mr_data_managementModel.findByIdAndUpdate(job_details._id, da, {new: true}, function (err, UpdatedDetails) {
if (err) return res.json({Status:"Failed",Message:"Internal Server Error", Data : {},Code:500});
res.json({Status:"Success",Message:"Update successfully", Data : {} ,Code:200});
}); 

var location_tracking_job_wiseModel = require('./../models/location_tracking_job_wiseModel');
let a = {
"job_no" : req.body.job_id,
"complaint_no" : req.body.SMU_SCH_COMPNO,
"user_mobile_no" : req.body.user_mobile_no,
"location_text" : req.body.JOB_LOCATION,
"loc_lat" : req.body.JOB_START_LAT,
"loc_long" : req.body.JOB_START_LONG,
"date" : new Date(),
"km" : "Breakdown MR Approval",
"remarks" : "Job Paused",
}   
var submitted = await location_tracking_job_wiseModel.create(a);
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


var location_tracking_job_wiseModel = require('./../models/location_tracking_job_wiseModel');
let a = {
"job_no" : req.body.job_id,
"complaint_no" : req.body.SMU_SCH_COMPNO,
"user_mobile_no" : req.body.user_mobile_no,
"location_text" : req.body.JOB_LOCATION,
"loc_lat" : req.body.JOB_START_LAT,
"loc_long" : req.body.JOB_START_LONG,
"date" : new Date(),
"km" : "Breakdown Serivce",
"remarks" : "Start Resume",
}   
var submitted = await location_tracking_job_wiseModel.create(a);
} 


///////////update pause resume time//////////////

let cc = {
user_mobile_no : req.body.user_mobile_no,
job_no : req.body.job_id,
complaint_no : req.body.SMU_SCH_COMPNO,
status : statuss,
service_name : "BD"
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


////////////////////////BR MR UPDATE JOB STATUS////////////////////




//////////////////////BR MR CHECK STATUS/////////////////////////


router.post('/service_mr_check_work_status',async function (req, res) {

// var job_detailss  =  await breakdown_mr_data_managementModel.find({JLS_SCHM_COMPNO:req.body.SMU_SCH_COMPNO});
// if(job_detailss.length == 2){
//     console.log("***********Total length*********",job_detailss);
//       breakdown_mr_data_managementModel.findByIdAndRemove(job_detailss[1]._id, function (err, user) {
//           if (err) return res.json({Status:"Failed",Message:"Internal Server Error", Data : {},Code:500});
//           res.json({Status:"Success",Message:"SubFunction Deleted successfully", Data : {} ,Code:200});
//       });
// }

var job_details  =  await breakdown_mr_data_managementModel.findOne({JLS_SCHM_COMPNO:req.body.SMU_SCH_COMPNO});
res.json({Status:"Success",Message:job_details.JOB_STATUS, time:job_details.JOB_START_TIME, Data : {} ,Code:200});
});


//////////////////////BR MR CHECK STATUS/////////////////////////





module.exports = router;
