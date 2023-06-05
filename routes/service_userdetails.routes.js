var express = require('express');
var router = express.Router();
var bodyParser = require('body-parser');
router.use(bodyParser.urlencoded({ extended: false }));
router.use(bodyParser.json());

var oracledb = require('oracledb');
var request = require("request");
var service_submitted_valueModel = require('./../models/service_submitted_valueModel');

var service_user_management = require('./../models/service_userdetailsModel');
var breakdown_managementModel = require('./../models/breakdown_managementModel');
var service_employee_activity_allocationModel = require('./../models/service_employee_activity_allocationModel');
var breakdown_mr_data_managementModel = require('./../models/breakdown_mr_data_managementModel');
var lr_service_managementModel = require('./../models/lr_service_managementModel');
var part_reply_service_managementModel = require('./../models/part_reply_service_managementModel');
var audit_data_managementModel = require('./../models/audit_data_managementModel');
var material_requestModel = require('./../models/material_requestModel');

var notificationModel = require('./../models/notificationModel');
var location_tracking_job_wiseModel = require('./../models/location_tracking_job_wiseModel');
var error_log_oracelModel = require('./../models/error_log_oracelModel');

var add_failur_report_tempModel = require('./../models/add_failur_report_tempModel');
var add_repair_work_request_tempModel = require('./../models/add_repair_work_request_tempModel');





// ******************************************************************************************************************************************************************************
// SERVICE USER CREATION - ADMIN PANEL
// ******************************************************************************************************************************************************************************

router.post('/create', async function(req, res) {
  var user_detail  =  await service_user_management.findOne({user_mobile_no: req.body.user_mobile_no});
  if(user_detail == null){
  try{
        await service_user_management.create({  
  user_mobile_no: req.body.user_mobile_no || "",
  user_id :  req.body.user_id || "",
  user_password : req.body.user_password || "",
  user_per_mob : req.body.user_per_mob || "",
  user_name : req.body.user_name || "",
  user_email : req.body.user_email || "",
  user_introduced_by : req.body.user_introduced_by || "",
  user_location : req.body.user_location || "",
  user_mob_model : req.body.user_mob_model || "",
  user_mob_os : req.body.user_mob_os || "",
  user_mob_make : req.body.user_mob_make || "",
  device_no : req.body.device_no || "",
  organisation_name : req.body.organisation_name || "",
  status : req.body.status || "",
  mobile_issue_date : req.body.mobile_issue_date || "",
  Documents : req.body.Documents || "",
  emp_type : req.body.emp_type,
  device_id : "",
  delete_status : false,
  last_login_time : new Date().toLocaleString('en-US', {
timeZone: 'Asia/Calcutta'
}),
  last_logout_time: new Date().toLocaleString('en-US', {
timeZone: 'Asia/Calcutta'
}),
  user_token : "",
  user_type : "Logout",
        }, 
        function (err, user) {
        res.json({Status:"Success",Message:"Added successfully", Data : user ,Code:200}); 
        });
}
catch(e){
      res.json({Status:"Failed",Message:"Internal Server Error", Data : {},Code:500});
}
}else {
    res.json({Status:"Failed",Message:"Mobile Number Already Exist", Data : {} ,Code:201}); 
}
});


// router.get('/deletes', function (req, res) {
//       service_user_management.remove({}, function (err, user) {
//           if (err) return res.status(500).send("There was a problem deleting the user.");
//              res.json({Status:"Success",Message:"User management Deleted", Data : {} ,Code:200});     
//       });
// });

// router.get('/deletes_local', function (req, res) {
//       service_submitted_valueModel.remove({}, function (err, user) {
//           if (err) return res.status(500).send("There was a problem deleting the user.");
//              res.json({Status:"Success",Message:"User management Deleted", Data : {} ,Code:200});     
//       });
// });


// router.post('/getlist_local', function (req, res) {
//         service_submitted_valueModel.find({}, function (err, StateList) {
//           res.json({Status:"Success",Message:"User management List", Data : StateList ,Code:200});
//         });
// });


// router.post('/getlist_id', function (req, res) {
//         service_user_management.find({user_id:req.body.user_id}, function (err, StateList) {
//           res.json({Status:"Success",Message:"User management List", Data : StateList ,Code:200});
//         });
// });




router.post('/info', function (req, res) {
        service_user_management.findOne({user_mobile_no:req.body.user_mobile_no}, function (err, StateList) {
          res.json({Status:"Success",Message:"User Management Details", Data : StateList ,Code:200});
        });
});




// ******************************************************************************************************************************************************************************
// SERVICE - CHANGE PASSWORD PROCESS
// ******************************************************************************************************************************************************************************

router.post('/change_password', function (req, res) {
         service_user_management.findByIdAndUpdate(req.body._id, req.body, {new: true}, function (err, UpdatedDetails) {
            if (err)return res.json({Status:"Failed",Message:"Internal Server Error", Data:err,Code:500});
             res.json({Status:"Success",Message:"User management Updated", Data : UpdatedDetails ,Code:200});
        });
});



// ******************************************************************************************************************************************************************************
// SERVICE LOGOUT REASON
// ******************************************************************************************************************************************************************************

router.get('/logout_reason', function (req, res) {
         var StateList = [
             {
                logout_reason:"LEAVE - FN"
             },
             {
                logout_reason:"LEAVE - AN"
             },
             {
                logout_reason:"LEAVE - FULL DAY"
             },
             {
                logout_reason:"DAY OUT"
             },
             {
                logout_reason:"PERMISSION"
             },
             {
                logout_reason:"OFFICE / TRAINING"
             },
             {
                logout_reason:"STANDBY"
             },
             {
                logout_reason:"RW SUPPORT"
             }
         ];
        res.json({Status:"Success",Message:"LOGOUT REASON", Data : StateList ,Code:200});
});



// ******************************************************************************************************************************************************************************
// SERVICE - FETCHING ISO NUMBER - ADMIN PANEL
// ******************************************************************************************************************************************************************************

router.post('/fetch_iso_number', function (req, res) {   
oracledb.getConnection({
      user: "SMARTSM",
      password: "SMARTSM",
      connectString: "(DESCRIPTION =(ADDRESS = (PROTOCOL = TCP)(HOST = 192.168.1.112)(PORT = 1521))(CONNECT_DATA =(SID = jlpl)))"
}, function(err, connection) {
if (err) {
    return;
}
connection.execute(
            "SELECT * FROM JLS_SERCALL_ISO_DOCREF where ISO_DRH_MODULE =:ISO_DRH_MODULE AND ISO_DRH_LETYPE =:ISO_DRH_LETYPE",
            {
                ISO_DRH_MODULE :req.body.ISO_DRH_MODULE,
                ISO_DRH_LETYPE :req.body.ISO_DRH_LETYPE
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
res.json({Status:"Success",Message:"Updated", Data : ary,Code:200}); 
    doRelease(connection);    
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
// SERVICE FETCHING BREAKDOWN DETAILS - ADMIN PANEL
// ******************************************************************************************************************************************************************************

router.post('/fetch_breakdown_job_detail',async function (req, res) {   
   var job_details  =  await breakdown_managementModel.findOne({SMU_SCH_JOBNO : req.body.job_id,SMU_SCH_COMPNO:req.body.key_value});
   res.json({Status:"Success",Message:"Job Detail", Data : job_details,Code:200}); 
});



// ******************************************************************************************************************************************************************************
// SERVICE FETCHING BRANCH ADDRESS - ADMIN PANEL
// ******************************************************************************************************************************************************************************

router.post('/fetch_branch_address', function (req, res) {   
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
            "SELECT DBSOM_GET_JOBADDRESS(:ln,'OI') INSADR, DBSOM_GET_JLSMARTADDR(:ln,'C') CUSADD, DBSOM_GET_JOBADDRESS(:ln,'OB') BRANCNAME, DBSOM_GET_JLSMARTADDR(:ln,'C') BRADD FROM DUAL",
            {ln:req.body.job_id},
        {autoCommit: true},
        function (err, result) {
    if (err) { console.error(err.message);
          doRelease(connection);
          return;
     }
      doRelease(connection);
var ary = [];
for(let a = 0 ; a < result.rows.length; a++){
var temp_data = result.rows[a];
var results = {}
for (var i = 0; i < result.metaData.length; ++i){
results[result.metaData[i].name] = temp_data[i];
}
ary.push(results);   
if(a == result.rows.length - 1){
res.json({Status:"Success",Message:"Updated", Data : ary,Code:200});     
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
// SERVICE FETCH AREA OF BREAKDOWN
// ******************************************************************************************************************************************************************************
router.post('/fetch_area_breakdown', function (req, res) {   
var str = ""+req.body.feedback_details.substring(1).replace(/ /g,'');
    str =  str.slice(0, -1);

    var final_text = '';
    var  myArray = str.split(",");
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
            "select * from COM_ACTIVITY_MST where CAM_ATY_STATUS = 'A' and and CAM_ATY_TYPE = 'FDBKGP'",
            {},
        {autoCommit: true},
        function (err, result) {
    if (err) { console.error(err.message);
          doRelease(connection);
          return;
     }
      doRelease(connection);    
var ary = [];
for(let a = 0 ; a < result.rows.length; a++){
var temp_data = result.rows[a];
var results = {}
for (var i = 0; i < result.metaData.length; ++i){
results[result.metaData[i].name] = temp_data[i];
}
ary.push(results);   
if(a == result.rows.length - 1){
res.json({Status:"Success",Message:"Updated", Data : ary,Code:200}); 
   
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



// router.post('/pull_job_from',async function (req, res) {
// request.post(
//     'http://smart.johnsonliftsltd.com:3000/api/preventive_service_data_management/fetch_data_from_oracle_mr_breakdown_pull',
//     { json: req.body},
//     function (error, response, body) {
//         if (!error && response.statusCode == 200) {
//         }
//     }
// );


// request.post(
//     'http://smart.johnsonliftsltd.com:3000/api/lr_service_data_management/fetch_data_from_oracle_lr_service_pull',
//     { json: req.body},
//     function (error, response, body) {
//         if (!error && response.statusCode == 200) {
//         }
//     }
// );



// request.post(
//     'http://smart.johnsonliftsltd.com:3000/api/audit_data_management/fetch_data_from_oracle_audit_service_pull',
//     { json: req.body},
//     function (error, response, body) {
//         if (!error && response.statusCode == 200) {
//         }
//     }
// );


// request.post(
//     'http://smart.johnsonliftsltd.com:3000/api/part_replacement/fetch_data_from_oracle_part_replacement_pull',
//     { json: req.body},
//     function (error, response, body) {
//         if (!error && response.statusCode == 200) {
//         }
//     }
// );



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
//             "SELECT * from JLS_SERCALL_HDR_UPLOAD where SMU_SCH_SERTYPE in ('P','B') and SMU_SCH_DWNFLAG <> 'Y'",
//             { 
              
//             },
//         {autoCommit: true},
//         function (err, result) {
//     if (err) { console.error(err.message);
//           doRelease(connection);
//           return;
//      }
//       doRelease(connection);

// var ary = [];
// if(result.rows.length == 0){
//  res.json({Status:"Success",Message:"User Details", Data : StateList ,Code:200});
// }else{
// for(let a = 0 ; a < result.rows.length; a++){
// var temp_data = result.rows[a];
// var results = {}
// for (var i = 0; i < result.metaData.length; ++i){
// results[result.metaData[i].name] = temp_data[i];
// }

// request.post(
//     'http://smart.johnsonliftsltd.com:3000/api/breakdown_management/create',
//     { json: results},
//     function (error, response, body) {
//         if (!error && response.statusCode == 200) {
//         }
//     }
// );



//  // ary.push(results.length);
//  if(a == result.rows.length - 1){
//     // res.json({Status:"Success",Message:"Updated", Data : ary,Code:200}); 
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
//             "UPDATE JLS_SERCALL_HDR_UPLOAD set SMU_SCH_DWNFLAG='Y', SMU_SCH_DWNFLAGDATE=:SMU_SCH_DWNFLAGDATE WHERE SMU_SCH_SERTYPE in ('P','B') and SMU_SCH_DWNFLAG <> 'Y' ",
//             {
//                 SMU_SCH_DWNFLAGDATE : new Date()
//             },
//         {autoCommit: true},
//         function (err, result_one) {
//     if (err) { console.error(err.message);
//           doRelease(connection);
//           return;
//      }
//       doRelease(connection);
//     });
// });
   
//  }
// }
// }
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
// res.json({Status:"Success",Message:"Data all Jobs Pulled", Data : {} ,Code:200});


// });






// ******************************************************************************************************************************************************************************
// SERVICE USER LOGIN MOBILE
// ******************************************************************************************************************************************************************************
router.post('/mobile/login_page', function (req, res) { 
     service_user_management.findOne({user_mobile_no:req.body.user_mobile_no,user_password:req.body.user_password}, function (err, StateList) {
            if(StateList == null){
              res.json({Status:"Failed",Message:"Account not found", Data : {} ,Code:404});
              
            }
            else if(req.body.device_id == '979af22c0002b1ab' || req.body.device_id == '165a26b677196dc4' || req.body.device_id == '754dcabd5ea6ebbf' || req.body.device_id == '48b002d3987d7d23' || 
                    req.body.device_id == '44aef2e244c0c682' || req.body.device_id == '7bcb3c78e09bddab' || req.body.device_id == 'a6cdfd9621489a50' || req.body.device_id == 'd744698027fc8323' 
                    || req.body.device_id == '4e6f2495dd457f6d' || req.body.device_id == '2a347492c2e5719b' || req.body.device_id == 'd5ff6d62e21f9bdc'  || req.body.device_id == '66dbf33011cd0bc2' 
                    || req.body.device_id == '4e86a0a3d880367b' || req.body.device_id == '0ce6836a3434d03f' ){
            recall(req);
             
            }
            else if(StateList.device_id == ''){
            let as = {
                 device_id : req.body.device_id,
               }
            service_user_management.findByIdAndUpdate(StateList._id, as, {new: true}, function (err, UpdatedDetails) {
            if (err)return res.json({Status:"Failed",Message:"Internal Server Error", Data:err,Code:500}); 
            });
         
            recall(req);
            }
            else if(StateList.device_id !== req.body.device_id){
                
              res.json({Status:"Failed",Message:"Device Id Mismatching", Data : {} ,Code:404});
            }
            else if(StateList.device_id == req.body.device_id){

                
              recall(req);
            }

function recall(req) {

res.json({Status:"Success",Message:"User Details", Data : StateList ,Code:200});

// request.post(
//     'http://smart.johnsonliftsltd.com:3000/api/preventive_service_data_management/fetch_data_from_oracle_mr_breakdown',
//     { json: req.body},
//     function (error, response, body) {
//         if (!error && response.statusCode == 200) {
//         }
//     }
// );


// request.post(
//     'http://smart.johnsonliftsltd.com:3000/api/lr_service_data_management/fetch_data_from_oracle_lr_service',
//     { json: req.body},
//     function (error, response, body) {
//         if (!error && response.statusCode == 200) {
//         }
//     }
// );



// request.post(
//     'http://smart.johnsonliftsltd.com:3000/api/audit_data_management/fetch_data_from_oracle_audit_service',
//     { json: req.body},
//     function (error, response, body) {
//         if (!error && response.statusCode == 200) {
//         }
//     }
// );


// request.post(
//     'http://smart.johnsonliftsltd.com:3000/api/part_replacement/fetch_data_from_oracle_part_replacement',
//     { json: req.body},
//     function (error, response, body) {
//         if (!error && response.statusCode == 200) {
//         }
//     }
// );






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
//             "SELECT * from JLS_SERCALL_HDR_UPLOAD where SMU_SCH_SERTYPE in ('P','B') and  NVL(SMU_SCH_DWNFLAG,'N') <> 'Y' and SMU_SCH_MECHCELL=:SMU_SCH_MECHCELL",
//             { 
//               SMU_SCH_MECHCELL:req.body.user_mobile_no
//             },
//         {autoCommit: true},
//         function (err, result) {
//     if (err) { console.error(err.message);
//           doRelease(connection);
//           return;
//      }
//       doRelease(connection);
// var ary = [];
// console.log("--------------------------------------- ",result.rows.length);
// if(result.rows.length == 0){
//  res.json({Status:"Success",Message:"User Details", Data : StateList ,Code:200});
// }else{
// for(let a = 0 ; a < result.rows.length; a++){
// var temp_data = result.rows[a];
// var results = {}
// for (var i = 0; i < result.metaData.length; ++i){
// results[result.metaData[i].name] = temp_data[i];
// }
// request.post(
//     'http://smart.johnsonliftsltd.com:3000/api/breakdown_management/create',
//     { json: results},
//     function (error, response, body) {
//         if (!error && response.statusCode == 200) {
//         }
//     }
// );
//  if(a == result.rows.length - 1){
//     res.json({Status:"Success",Message:"User Details", Data : StateList ,Code:200});
//  }
// }
// }
//    });
// function doRelease(connection) {
//        connection.release(function(err) {
//          if (err) {
//           console.error(err.message);
//         }
//       }
//    );
// }
//     }); 


            }          
        });
});


// router.get('/reload_data2',async function (req, res) {
//         var ref_code_details  =  await breakdown_managementModel.find({}).sort({index:1});
//         for(let a  = 0; a < ref_code_details.length ; a ++){
//          let d = {
//             "JOB_STATUS": "Not Started",
//             "JOB_VIEW_STATUS": "Not Viewed",
//             "LAST_UPDATED_TIME": "Wed Sep 21 2022 13:58:06 GMT+0530 (India Standard Time)",
//             "JOB_START_TIME": "",
//             "JOB_END_TIME": "",
//          }
//          breakdown_managementModel.findByIdAndUpdate(ref_code_details[a]._id, d, {new: true}, function (err, UpdatedDetails) {
//             if (err) return res.json({Status:"Failed",Message:"Internal Server Error", Data : {},Code:500});
//         });
//          if(a == ref_code_details.length - 1){
//             res.json({Status:"Success",Message:"group_detailModel Updated", Data : {} ,Code:200});
//          }
//         }
// });





// ******************************************************************************************************************************************************************************
// SERVICE SERACH EMPLOYEE DETAILS IN ORACLE - ADMIN PANEL
// ******************************************************************************************************************************************************************************

router.post('/search_service_employee', function (req, res) {
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
            "SELECT * FROM JLS_EMPLOYEESIM_DTL WHERE EMPID=:EMPID",
            { 
              EMPID:req.body.EMPID
            },
        {autoCommit: true},
        function (err, result) {
    if (err) { console.error(err.message);
          doRelease(connection);
          return;
     }
     doRelease(connection);
var ary = [];
if(result.rows.length == 0){
 res.json({Status:"Success",Message:"No Record Found", Data : {} ,Code:404});
}else{
for(let a = 0 ; a < result.rows.length; a++){
var temp_data = result.rows[a];
var results = {}
for (var i = 0; i < result.metaData.length; ++i){
results[result.metaData[i].name] = temp_data[i];
}
    res.json({Status:"Success",Message:"User Details", Data : results ,Code:200}); 
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
// SERVICE MOBILE MAIN MENU COUNT
// ******************************************************************************************************************************************************************************

router.post('/mainmenu_counts',async function (req, res) {
var notification_detail  =  await notificationModel.count({user_mobile_no :req.body.user_mobile_no,"read_status":"Not Readed"});
var bd_total_count  =  await service_employee_activity_allocationModel.count({employee_no:req.body.user_mobile_no});
        let a  = {
            services_count : bd_total_count || 0,
            view_status : 0,
            notificaion_count : notification_detail || 0,
        }
       res.json({Status:"Success",Message:"Main Menu Counts", Data : a ,Code:200});
});



// ******************************************************************************************************************************************************************************
// SERVICE BREAKDOWN JOB PAUSED COUNT
// ******************************************************************************************************************************************************************************
router.post('/job_status_count',async function (req, res) {
 var bd_paused_count  =  await breakdown_managementModel.count({SMU_SCH_MECHCELL: req.body.user_mobile_no,JOB_STATUS:{$in : ["Job Resume", "Job Paused"]},SMU_SCH_SERTYPE : 'B'});
        let a  = {
            paused_count : bd_paused_count
        }
       res.json({Status:"Success",Message:"Job status count", Data : a ,Code:200});
});



// ******************************************************************************************************************************************************************************
// BRANCH HEAD SERVICE BREAKDOWN JOB PAUSED COUNT
// ******************************************************************************************************************************************************************************
router.post('/branch_head/job_status_count',async function (req, res) {
 var bd_paused_count  =  await breakdown_managementModel.count({SMU_SCH_BRCODE: req.body.br_code,JOB_STATUS:{$in : ["Job Resume", "Job Paused"]},SMU_SCH_SERTYPE : 'B'});
        let a  = {
            paused_count : bd_paused_count
        }
       res.json({Status:"Success",Message:"Job status count", Data : a ,Code:200});
});




// ******************************************************************************************************************************************************************************
// SERVICE BREAKDOWN JOB LIST
// ******************************************************************************************************************************************************************************
router.post('/new_job_list',async function (req, res) {
var job_details  =  await breakdown_managementModel.find({SMU_SCH_MECHCELL: req.body.user_mobile_no,SMU_SCH_SERTYPE : 'B'});
let a = [];
job_details.forEach(element => {
   if(element.JOB_STATUS == "Job Started" || element.JOB_STATUS == "Job Stopped" || element.JOB_STATUS == "Not Started" ){
  a.push({
            job_id : element.SMU_SCH_JOBNO,
            customer_name : element.SMU_SCH_CUSNAME,
            pm_date :element.SMU_SCH_COMPDT.substring(0, 10),
            status : "Active",
            SMU_SCH_COMPNO: element.SMU_SCH_COMPNO,
            SMU_SCH_SERTYPE : element.SMU_SCH_SERTYPE,
  });
   }
});
res.json({Status:"Success",Message:"New Job List", Data : a ,Code:200});
});




// ******************************************************************************************************************************************************************************
// BRANCE HEAD SERVICE BREAKDOWN JOB LIST
// ******************************************************************************************************************************************************************************
router.post('/branch_head/new_job_list',async function (req, res) {
// console.log(req.body);
var job_details  =  await breakdown_managementModel.find({SMU_SCH_BRCODE: req.body.br_code,SMU_SCH_SERTYPE : 'B'});
let a = [];
job_details.forEach(element => {
   if(element.JOB_STATUS == "Job Started" || element.JOB_STATUS == "Job Stopped" || element.JOB_STATUS == "Not Started" ){
  a.push({
            job_id : element.SMU_SCH_JOBNO,
            customer_name : element.SMU_SCH_CUSNAME,
            pm_date :element.SMU_SCH_COMPDT.substring(0, 10),
            status : "Active",
            SMU_SCH_COMPNO: element.SMU_SCH_COMPNO,
            SMU_SCH_SERTYPE : element.SMU_SCH_SERTYPE,
  });
   }
});
res.json({Status:"Success",Message:"New Job List", Data : a ,Code:200});
});



// ******************************************************************************************************************************************************************************
// SERVICE BREAKDOWN PAUSED JOB LIST
// ******************************************************************************************************************************************************************************
router.post('/pause_job_list',async function (req, res) {
var job_details  =  await breakdown_managementModel.find({SMU_SCH_MECHCELL: req.body.user_mobile_no,JOB_STATUS:{$in : ["Job Resume", "Job Paused"]},SMU_SCH_SERTYPE:'B'});
let a = [];
job_details.forEach(element => {
  a.push({
            job_id : element.SMU_SCH_JOBNO,
            paused_time : element.JOB_END_TIME,
            paused_at : 'Breakdown Serivce',
            SMU_SCH_COMPNO: element.SMU_SCH_COMPNO,
            SMU_SCH_SERTYPE : element.SMU_SCH_SERTYPE,
        })
}); 
   res.json({Status:"Success",Message:"Pause job list", Data : a ,Code:200});
});



// ******************************************************************************************************************************************************************************
// BRANCE HEAD SERVICE BREAKDOWN PAUSED JOB LIST
// ******************************************************************************************************************************************************************************
router.post('/branch_head/pause_job_list',async function (req, res) {
var job_details  =  await breakdown_managementModel.find({SMU_SCH_BRCODE: req.body.br_code,JOB_STATUS:{$in : ["Job Resume", "Job Paused"]},SMU_SCH_SERTYPE:'B'});
let a = [];
job_details.forEach(element => {
  a.push({
            job_id : element.SMU_SCH_JOBNO,
            paused_time : element.JOB_END_TIME,
            paused_at : 'Breakdown Serivce',
            SMU_SCH_COMPNO: element.SMU_SCH_COMPNO,
            SMU_SCH_SERTYPE : element.SMU_SCH_SERTYPE,
        })
}); 
   res.json({Status:"Success",Message:"Pause job list", Data : a ,Code:200});
});



// ******************************************************************************************************************************************************************************
// SERVICE BREAKDOWN FETCH CUSTOMER DETAILS
// ******************************************************************************************************************************************************************************
router.post('/customer_details',async function (req, res) {
var job_details  =  await breakdown_managementModel.findOne({SMU_SCH_JOBNO:req.body.job_id,SMU_SCH_SERTYPE:req.body.SMU_SCH_SERTYPE,SMU_SCH_COMPNO:req.body.SMU_SCH_COMPNO});
        let a  = {
            customer_name: job_details.SMU_SCH_CUSNAME,
            job_id : job_details.SMU_SCH_JOBNO,
            address1 : job_details.SMU_SCH_CUSADD1,
            address2 : job_details.SMU_SCH_CUSADD2,
            address3 : job_details.SMU_SCH_CUSADD3,
            pin: job_details.SMU_SCH_CUSPIN,
            contract_type : job_details.SMU_SCH_AMCTYPE || "",
            contract_status : job_details.SMU_SCH_JOBCURSTATUS || "Active",
            bd_number : job_details.SMU_SCH_COMPNO,
            bd_date : job_details.SMU_SCH_COMPDT.substring(0, 10),
            breakdown_type : job_details.SMU_SCH_BRKDOWNTYPE,
        }
       res.json({Status:"Success",Message:"Customer Details", Data : a ,Code:200});
});







// ******************************************************************************************************************************************************************************
// SERVICE BREAKDOWN DROPDOWN LIST
// ******************************************************************************************************************************************************************************
router.post('/bd_details_list', function (req, res) {

  if(req.body.job_id[0] == 'L'){
        var bd_details_list = [
         {
            "title":"LIFT NOT WORKING"
         },
         {
            "title":"LIFT WORKING WITH PROBLEM"
         },
         {
            "title":"REPEATED BREAKDOWN"
         }
    ]
       res.json({Status:"Success",Message:"BD Details List", Data : bd_details_list ,Code:200});
   }else {
     var bd_details_list = [
         {
            "title":"ESCALATOR NOT WORKING"
         },
         {
            "title":"ESCALATOR WORKING WITH PROBLEM"
         },
         {
            "title":"REPEATED BREAKDOWN"
         }
    ]
       res.json({Status:"Success",Message:"BD Details List", Data : bd_details_list ,Code:200});
   }
});




// router.get('/bd_details_list', function (req, res) {
//     var bd_details_list = [
//          {
//             "title":"LIFT NOT WORKING"
//          },
//          {
//             "title":"LIFT WORKING WITH PROBLEM"
//          },
//          {
//             "title":"REPEATED BREAKDOWN"
//          }
//     ]
//        res.json({Status:"Success",Message:"BD Details List", Data : bd_details_list ,Code:200});
// });



// ******************************************************************************************************************************************************************************
// SERVICE BREAKDOWN FETCH FEEDBACK GROUP LIST
// ******************************************************************************************************************************************************************************
router.post('/feedback_group_list', function (req, res) {   
oracledb.getConnection({
      user: "JLSMART",
      password: "JLSMART",
      connectString: "(DESCRIPTION =(ADDRESS = (PROTOCOL = TCP)(HOST = 192.168.1.112)(PORT = 1521))(CONNECT_DATA =(SID = jlpl)))"
}, function(err, connection) {
if (err) {
    // console.error(err.message);
    return;
}

// "SELECT * from SSM_SERCALL_HDR_UPLOAD where SMU_SCH_MECHCELL = '7358780824'  and SMU_SCH_DWNFLAG IS NULL",
connection.execute(
            "select * from COM_ACTIVITY_MST where CAM_ATY_STATUS = 'A' and CAM_ATY_TYPE = 'FDBKGP' and CAM_ATY_ATTRIBUTE in (:type,'B')",
           {type :req.body.job_id[0] },
        {autoCommit: true},
        function (err, result) {
    if (err) { console.error(err.message);
          doRelease(connection);
          return;
     }
      doRelease(connection);
var ary = [];
for(let a = 0 ; a < result.rows.length; a++){
var temp_data = result.rows[a];
var results = {}
for (var i = 0; i < result.metaData.length; ++i){
results[result.metaData[i].name] = temp_data[i];
}
ary.push(results);   
if(a == result.rows.length - 1){
let datasss = [];
ary.forEach(element => {
  datasss.push({
            "codes" : element.CAM_ATY_CODE,
            "title": element.CAM_ATY_DESC
         })
});
    res.json({Status:"Success",Message:"Feedback group list", Data : datasss ,Code:200});
    // res.json({Status:"Success",Message:"Updated", Data : ary,Code:200});    
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
// SERVICE FETCH FEEDBACK DETAILS LIST
// ******************************************************************************************************************************************************************************
router.post('/feedback_details_list', function (req, res) {
      var str = ""+req.body.code_list.substring(1).replace(/ /g,'');
      str =  str.slice(0, -1);
      var final_text = '';
     var  myArray = str.split(",");
    myArray.forEach(element => {
    final_text  = final_text + "'"+element+"', ";
     });
    final_text =  final_text.slice(0, -2);     
    oracledb.getConnection({
      user: "JLSMART",
      password: "JLSMART",
      connectString: "(DESCRIPTION =(ADDRESS = (PROTOCOL = TCP)(HOST = 192.168.1.112)(PORT = 1521))(CONNECT_DATA =(SID = jlpl)))"
}, function(err, connection) {
if (err) {
    // console.error(err.message);
    return;
}
// console.log("Req*********","select * from COM_ACTIVITY_MST where CAM_ATY_STATUS = 'A' and CAM_ATY_PCODE in ("+final_text+")");
    connection.execute(
            "select * from COM_ACTIVITY_MST where CAM_ATY_STATUS = 'A' and CAM_ATY_PCODE in ("+final_text+")",
            {},
        {autoCommit: true},
        function (err, result) {
    if (err) { console.error(err.message);
          doRelease(connection);
          return;
     }
     doRelease(connection);

var ary = [];
for(let a = 0 ; a < result.rows.length; a++){
var temp_data = result.rows[a];
var results = {}
for (var i = 0; i < result.metaData.length; ++i){
results[result.metaData[i].name] = temp_data[i];
}
 ary.push(results);   
 if(a == result.rows.length - 1){
    var datasss = [];
ary.forEach(element => {
  datasss.push({
            "feedback_group_code" : element.CAM_ATY_PCODE,
            "feedback_group_title" : '',
            "codes" : element.CAM_ATY_CODE,
            "title": element.CAM_ATY_DESC,
         })
});
res.json({Status:"Success",Message:"Updated", Data : datasss,Code:200}); 
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
// SERVICE SECOND MAIN MENU SERIVCE LIST AND COUNT
// ******************************************************************************************************************************************************************************
router.post('/service_list',async function (req, res) {
   var service_list_alloc  =  await service_employee_activity_allocationModel.find({employee_no:req.body.user_mobile_no});
   var service_user_managementss = await service_user_management.find({user_mobile_no:req.body.user_mobile_no});
     var count = 0;
     var a = [];
     if(service_list_alloc.length == 0){
        res.json({Status:"Success",Message:"Service List", Data : [] ,Code:200});
     } else {
          recall(service_list_alloc[count].activity_name);
     }
   async function recall(argument) {
   if(argument == 'Breakdown Serivce'){
   var bd_total_count  =  await breakdown_managementModel.find({'JOB_STATUS': {$in : ["Not Started", "Job Started"]},SMU_SCH_MECHCELL: req.body.user_mobile_no,SMU_SCH_SERTYPE : 'B'}).count();
   var bd_upload_count  =  await breakdown_managementModel.count({SMU_SCH_MECHCELL: req.body.user_mobile_no,JOB_STATUS:'Job Submitted',SMU_SCH_SERTYPE : 'B'});
   var bd_pending_count  =  await breakdown_managementModel.count({SMU_SCH_MECHCELL: req.body.user_mobile_no,JOB_STATUS:'Job Started',SMU_SCH_SERTYPE : 'B'});
   var bd_paused_count  =  await breakdown_managementModel.count({SMU_SCH_MECHCELL: req.body.user_mobile_no,'JOB_STATUS': {$nin : ["Job Started", "Job Stopped" , "Not Started", "Job Submitted", "Job Deleted"]},SMU_SCH_SERTYPE : 'B'});
   a.push({
                service_name : 'Breakdown Service',
                last_used_time : '',
                uploaded_count : bd_upload_count,
                pending_count : bd_pending_count,
                failur_count : 0,
                paused_count : bd_paused_count,
                job_count : bd_total_count,
                index : 1
    });
    }
   else if(argument == 'Preventive Maintenance'){
   var bd_total_count  =  await breakdown_managementModel.find({'JOB_STATUS': {$in : ["Not Started", "Job Started"]},SMU_SCH_MECHCELL: req.body.user_mobile_no,SMU_SCH_SERTYPE : 'P'}).count();
   var bd_upload_count  =  await breakdown_managementModel.count({SMU_SCH_MECHCELL: req.body.user_mobile_no,JOB_STATUS:'Job Submitted',SMU_SCH_SERTYPE : 'P'});
   var bd_pending_count  =  await breakdown_managementModel.count({SMU_SCH_MECHCELL: req.body.user_mobile_no,JOB_STATUS:'Job Started',SMU_SCH_SERTYPE : 'P'});
   var bd_paused_count  =  await breakdown_managementModel.count({SMU_SCH_MECHCELL: req.body.user_mobile_no,'JOB_STATUS': {$nin : ["Job Started", "Job Stopped" , "Not Started", "Job Submitted" , "Job Deleted"]},SMU_SCH_SERTYPE : 'P'});
   a.push({
                service_name : argument,
                last_used_time : '',
                uploaded_count : bd_upload_count,
                pending_count : bd_pending_count,
                failur_count : 0,
                paused_count : bd_paused_count,
                job_count : bd_total_count,
                 index : 2
    });
    }

     else if(argument == 'Breakdown MR Approval'){
   var bd_total_count  =  await breakdown_mr_data_managementModel.find({'JOB_STATUS': {$in : ["Not Started", "Job Started"]},JLS_SCHM_ENGR_PHONE: req.body.user_mobile_no,JLS_SCHM_SERTYPE : 'B'}).count();
   var bd_upload_count  =  await breakdown_mr_data_managementModel.count({JLS_SCHM_ENGR_PHONE: req.body.user_mobile_no,JOB_STATUS:'Job Submitted',JLS_SCHM_SERTYPE : 'B'});
   var bd_pending_count  =  await breakdown_mr_data_managementModel.count({JLS_SCHM_ENGR_PHONE: req.body.user_mobile_no,JOB_STATUS:'Job Started',JLS_SCHM_SERTYPE : 'B'});
   var bd_paused_count  =  await breakdown_mr_data_managementModel.count({JLS_SCHM_ENGR_PHONE: req.body.user_mobile_no,'JOB_STATUS': {$nin : ["Job Started", "Job Stopped" , "Not Started", "Job Submitted", "Job Deleted"]},JLS_SCHM_SERTYPE : 'B'});
   a.push({
                service_name : argument,
                last_used_time : '',
                uploaded_count : bd_upload_count,
                pending_count : bd_pending_count,
                failur_count : 0,
                paused_count : bd_paused_count,
                job_count : bd_total_count,
                 index : 5
    });
    }

    else if(argument == 'Preventive MR Approval'){
   var bd_total_count  =  await breakdown_mr_data_managementModel.find({'JOB_STATUS': {$in : ["Not Started", "Job Started"]},JLS_SCHM_ENGR_PHONE: req.body.user_mobile_no,JLS_SCHM_SERTYPE:'P'}).count();
   var bd_upload_count  =  await breakdown_mr_data_managementModel.count({JLS_SCHM_ENGR_PHONE: req.body.user_mobile_no,JOB_STATUS:'Job Submitted',JLS_SCHM_SERTYPE : 'P'});
   var bd_pending_count  =  await breakdown_mr_data_managementModel.count({JLS_SCHM_ENGR_PHONE: req.body.user_mobile_no,JOB_STATUS:'Job Started',JLS_SCHM_SERTYPE : 'P'});
   var bd_paused_count  =  await breakdown_mr_data_managementModel.count({JLS_SCHM_ENGR_PHONE: req.body.user_mobile_no,'JOB_STATUS': {$nin : ["Job Started", "Job Stopped" , "Not Started", "Job Submitted", "Job Deleted"]},JLS_SCHM_SERTYPE : 'P'});
   a.push({
                service_name : argument,
                last_used_time : '',
                uploaded_count : bd_upload_count,
                pending_count : bd_pending_count,
                failur_count : 0,
                paused_count : bd_paused_count,
                job_count : bd_total_count,
                 index : 6
    });
    }


     else if(argument == 'LR SERVICE'){
   var bd_total_count  =  await lr_service_managementModel.find({'JOB_STATUS': {$in : ["Not Started", "Job Started"]},SMU_SEN_MOBILENO: req.body.user_mobile_no}).count();
   var bd_upload_count  =  await lr_service_managementModel.count({SMU_SEN_MOBILENO: req.body.user_mobile_no,JOB_STATUS:'Job Submitted'});
   var bd_pending_count  =  await lr_service_managementModel.count({SMU_SEN_MOBILENO: req.body.user_mobile_no,JOB_STATUS:'Job Started'});
   var bd_paused_count  =  await lr_service_managementModel.count({SMU_SEN_MOBILENO: req.body.user_mobile_no,'JOB_STATUS': {$nin : ["Job Started", "Job Stopped" , "Not Started", "Job Submitted", "Job Deleted"]}});
   a.push({
                service_name : argument,
                last_used_time : '',
                uploaded_count : bd_upload_count,
                pending_count : bd_pending_count,
                failur_count : 0,
                paused_count : bd_paused_count,
                job_count : bd_total_count,
                 index : 3
    });
    }



     else if(argument == 'Parts Replacement ACK'){
   var bd_total_count  =  await part_reply_service_managementModel.find({'JOB_STATUS': {$in : ["Not Started", "Job Started"]},SMU_ACK_MOBILENO: req.body.user_mobile_no}).count();
   var bd_upload_count  =  await part_reply_service_managementModel.count({SMU_ACK_MOBILENO: req.body.user_mobile_no,JOB_STATUS:'Job Submitted'});
   var bd_pending_count  =  await part_reply_service_managementModel.count({SMU_ACK_MOBILENO: req.body.user_mobile_no,JOB_STATUS:'Job Started'});
   var bd_paused_count  =  await part_reply_service_managementModel.count({SMU_ACK_MOBILENO: req.body.user_mobile_no,'JOB_STATUS': {$nin : ["Job Started", "Job Stopped" , "Not Started", "Job Submitted", "Job Deleted"]}});
   a.push({
                service_name : argument,
                last_used_time : '',
                uploaded_count : bd_upload_count,
                pending_count : bd_pending_count,
                failur_count : 0,
                paused_count : bd_paused_count,
                job_count : bd_total_count,
                 index : 4
    });
    }



else if(argument == 'Site Audit'){
   var bd_total_count  =  await audit_data_managementModel.find({'JOB_STATUS': {$in : ["Not Started", "Job Started"]},OM_OSA_MOBILE: req.body.user_mobile_no}).count();
   var bd_upload_count  =  await audit_data_managementModel.count({OM_OSA_MOBILE: req.body.user_mobile_no,JOB_STATUS:'Job Submitted'});
   var bd_pending_count  =  await audit_data_managementModel.count({OM_OSA_MOBILE: req.body.user_mobile_no,JOB_STATUS:'Job Started'});
   var bd_paused_count  =  await audit_data_managementModel.count({OM_OSA_MOBILE: req.body.user_mobile_no,'JOB_STATUS': {$nin : ["Job Started", "Job Stopped" , "Not Started", "Job Submitted", "Job Deleted"]}});
   a.push({
                service_name : argument,
                last_used_time : '',
                uploaded_count : bd_upload_count,
                pending_count : bd_pending_count,
                failur_count : 0,
                paused_count : bd_paused_count,
                job_count : bd_total_count,
                 index : 7
    });
    }


    else if(argument == 'ESCALATOR SURVEY FORM'){
   a.push({
                service_name : argument,
                last_used_time : '',
                uploaded_count : 0,
                pending_count : 0,
                failur_count : 0,
                paused_count : 0,
                job_count : 0,
                 index : 8
    });
    }


    else if(argument == 'ELEVATOR SURVEY FORM'){
   a.push({
                service_name : argument,
                last_used_time : '',
                uploaded_count : 0,
                pending_count : 0,
                failur_count : 0,
                paused_count : 0,
                job_count : 0,
                 index : 9
    });
    }

    else if(argument == 'SERVICE VISIBILITY'){
   a.push({
                service_name : argument,
                last_used_time : '',
                uploaded_count : 0,
                pending_count : 0,
                failur_count : 0,
                paused_count : 0,
                job_count : 0,
                 index : 10
    });
    }

     else if(argument == 'FAILURE REPORT REQUEST'){


   var bd_total_count  =  await add_failur_report_tempModel.find({'mech_code': service_user_managementss[0].user_id, app_status : 'SUBMITTED'}).count();
   var bd_pending_count  =  await add_failur_report_tempModel.find({'mech_code': service_user_managementss[0].user_id, app_status : 'PENDING'}).count();


   a.push({
                service_name : argument,
                last_used_time : '',
                uploaded_count : bd_total_count,
                pending_count : 0,
                failur_count : 0,
                paused_count : bd_pending_count,
                job_count : 0,
                 index : 11
    });
    }

    else if(argument == 'FAILURE REPORT APPROVAL'){

   var uploaded_count  =  await add_failur_report_tempModel.find({'eng_code': service_user_managementss[0].user_id, app_status : 'SUBMITTED'}).count();
   var job_count  =  await add_failur_report_tempModel.find({'eng_code': service_user_managementss[0].user_id, app_status : 'PENDING'}).count();
     
   a.push({
                service_name : argument,
                last_used_time : '',
                uploaded_count : uploaded_count,
                pending_count : 0,
                failur_count : 0,
                paused_count : 0,
                job_count : job_count,
                 index : 12
    });

    }

     else if(argument == 'ROPE MAINTENANCE'){
   a.push({
                service_name : argument,
                last_used_time : '',
                uploaded_count : 0,
                pending_count : 0,
                failur_count : 0,
                paused_count : 0,
                job_count : 0,
                 index : 13
    });
    }


    else if(argument == 'SAFETY AUDIT'){
   a.push({
                service_name : argument,
                last_used_time : '',
                uploaded_count : 0,
                pending_count : 0,
                failur_count : 0,
                paused_count : 0,
                job_count : 0,
                 index : 14
    });
    }

    else if(argument == 'SITE REPAIR WORK REQUEST'){



   var uploaded_count  =  await add_repair_work_request_tempModel.find({'submitted_by_emp_code': service_user_managementss[0].user_id, status : 'SUBMITTED'}).count();
   var bd_pending_count  =  await add_repair_work_request_tempModel.find({'submitted_by_emp_code': service_user_managementss[0].user_id, status : 'PENDING'}).count();


   a.push({
                service_name : argument,
                last_used_time : '',
                uploaded_count : uploaded_count,
                pending_count : 0,
                failur_count : 0,
                paused_count : bd_pending_count,
                job_count : 0,
                 index : 15
    });
    }


    else if(argument == 'SITE REPAIR WORK APPROVAL'){
   a.push({
                service_name : argument,
                last_used_time : '',
                uploaded_count : 0,
                pending_count : 0,
                failur_count : 0,
                paused_count : 0,
                job_count : 0,
                 index : 16
    });
    }

    else if(argument == 'REPAIR WORK JOB DETAILS'){
   a.push({
                service_name : argument,
                last_used_time : '',
                uploaded_count : 0,
                pending_count : 0,
                failur_count : 0,
                paused_count : 0,
                job_count : 0,
                 index : 17
    });
    }

    else if(argument == 'REPAIR WORK ORDER CREATION & COMPLETION'){
   a.push({
                service_name : argument,
                last_used_time : '',
                uploaded_count : 0,
                pending_count : 0,
                failur_count : 0,
                paused_count : 0,
                job_count : 0,
                 index : 18
    });
    }

    else if(argument == 'Material Request_Mobile Van'){

   var bd_total_count  =  await material_requestModel.find({'JOB_STATUS': {$in : ["Not Started", "Job Started"]},SMU_VANID: req.body.user_mobile_no}).count();
   var bd_upload_count  =  await material_requestModel.count({SMU_VANID: req.body.user_mobile_no,JOB_STATUS:'Job Submitted'});
   var bd_pending_count  =  await material_requestModel.count({SMU_VANID: req.body.user_mobile_no,JOB_STATUS:'Job Started'});
   var bd_paused_count  =  await material_requestModel.count({SMU_VANID: req.body.user_mobile_no,'JOB_STATUS': {$nin : ["Job Started", "Job Stopped" , "Not Started", "Job Submitted", "Job Deleted"]}});

   a.push({
                service_name : argument,
                last_used_time : '',
                uploaded_count : bd_upload_count,
                pending_count : bd_pending_count,
                failur_count : 0,
                paused_count : bd_paused_count,
                job_count : bd_total_count,
                 index : 19
    });
    }

    if(service_list_alloc.length - 1 == count){
        numArray = a.sort(function (a, b) {  return a.index - b.index;  });

     res.json({Status:"Success",Message:"Service List", Data : numArray ,Code:200});
    } else {
          count = count + 1;
          recall(service_list_alloc[count].activity_name);
    }
    }   
});







// ******************************************************************************************************************************************************************************
// BRANCH HEAD SERVICE SECOND MAIN MENU SERIVCE LIST AND COUNT
// ******************************************************************************************************************************************************************************
router.post('/branch_head/service_list',async function (req, res) {
   var service_list_alloc  =  await service_employee_activity_allocationModel.find({employee_no:req.body.user_mobile_no});
   var service_user_managementss = await service_user_management.find({user_mobile_no:req.body.user_mobile_no});
     var count = 0;
     var a = [];
     if(service_list_alloc.length == 0){
        res.json({Status:"Success",Message:"Service List", Data : [] ,Code:200});
     } else {
          recall(service_list_alloc[count].activity_name);
     }
   async function recall(argument) {
   if(argument == 'Breakdown Serivce'){
   var bd_total_count  =  await breakdown_managementModel.find({'JOB_STATUS': {$in : ["Not Started", "Job Started"]},SMU_SCH_BRCODE: req.body.br_code,SMU_SCH_SERTYPE : 'B'}).count();
   var bd_upload_count  =  await breakdown_managementModel.count({SMU_SCH_BRCODE: req.body.br_code,JOB_STATUS:'Job Submitted',SMU_SCH_SERTYPE : 'B'});
   var bd_pending_count  =  await breakdown_managementModel.count({SMU_SCH_BRCODE: req.body.br_code,JOB_STATUS:'Job Started',SMU_SCH_SERTYPE : 'B'});
   var bd_paused_count  =  await breakdown_managementModel.count({SMU_SCH_BRCODE: req.body.br_code,'JOB_STATUS': {$nin : ["Job Started", "Job Stopped" , "Not Started", "Job Submitted", "Job Deleted"]},SMU_SCH_SERTYPE : 'B'});
   a.push({
                service_name : 'Breakdown Service',
                last_used_time : '',
                uploaded_count : bd_upload_count,
                pending_count : bd_pending_count,
                failur_count : 0,
                paused_count : bd_paused_count,
                job_count : bd_total_count,
                index : 1
    });
    }
   else if(argument == 'Preventive Maintenance'){
   var bd_total_count  =  await breakdown_managementModel.find({'JOB_STATUS': {$in : ["Not Started", "Job Started"]},SMU_SCH_BRCODE: req.body.br_code,SMU_SCH_SERTYPE : 'P'}).count();
   var bd_upload_count  =  await breakdown_managementModel.count({SMU_SCH_BRCODE: req.body.br_code,JOB_STATUS:'Job Submitted',SMU_SCH_SERTYPE : 'P'});
   var bd_pending_count  =  await breakdown_managementModel.count({SMU_SCH_BRCODE: req.body.br_code,JOB_STATUS:'Job Started',SMU_SCH_SERTYPE : 'P'});
   var bd_paused_count  =  await breakdown_managementModel.count({SMU_SCH_BRCODE: req.body.br_code,'JOB_STATUS': {$nin : ["Job Started", "Job Stopped" , "Not Started", "Job Submitted" , "Job Deleted"]},SMU_SCH_SERTYPE : 'P'});
   a.push({
                service_name : argument,
                last_used_time : '',
                uploaded_count : bd_upload_count,
                pending_count : bd_pending_count,
                failur_count : 0,
                paused_count : bd_paused_count,
                job_count : bd_total_count,
                 index : 2
    });
    }

     else if(argument == 'Breakdown MR Approval'){
   var bd_total_count  =  await breakdown_mr_data_managementModel.find({'JOB_STATUS': {$in : ["Not Started", "Job Started"]},JLS_SCHM_BRCODE: req.body.br_code,JLS_SCHM_SERTYPE : 'B'}).count();
   var bd_upload_count  =  await breakdown_mr_data_managementModel.count({JLS_SCHM_BRCODE: req.body.br_code,JOB_STATUS:'Job Submitted',JLS_SCHM_SERTYPE : 'B'});
   var bd_pending_count  =  await breakdown_mr_data_managementModel.count({JLS_SCHM_BRCODE: req.body.br_code,JOB_STATUS:'Job Started',JLS_SCHM_SERTYPE : 'B'});
   var bd_paused_count  =  await breakdown_mr_data_managementModel.count({JLS_SCHM_BRCODE: req.body.br_code,'JOB_STATUS': {$nin : ["Job Started", "Job Stopped" , "Not Started", "Job Submitted", "Job Deleted"]},JLS_SCHM_SERTYPE : 'B'});
   a.push({
                service_name : argument,
                last_used_time : '',
                uploaded_count : bd_upload_count,
                pending_count : bd_pending_count,
                failur_count : 0,
                paused_count : bd_paused_count,
                job_count : bd_total_count,
                 index : 5
    });
    }

    else if(argument == 'Preventive MR Approval'){
   var bd_total_count  =  await breakdown_mr_data_managementModel.find({'JOB_STATUS': {$in : ["Not Started", "Job Started"]},JLS_SCHM_BRCODE: req.body.br_code,JLS_SCHM_SERTYPE:'P'}).count();
   var bd_upload_count  =  await breakdown_mr_data_managementModel.count({JLS_SCHM_BRCODE: req.body.br_code,JOB_STATUS:'Job Submitted',JLS_SCHM_SERTYPE : 'P'});
   var bd_pending_count  =  await breakdown_mr_data_managementModel.count({JLS_SCHM_BRCODE: req.body.br_code,JOB_STATUS:'Job Started',JLS_SCHM_SERTYPE : 'P'});
   var bd_paused_count  =  await breakdown_mr_data_managementModel.count({JLS_SCHM_BRCODE: req.body.br_code,'JOB_STATUS': {$nin : ["Job Started", "Job Stopped" , "Not Started", "Job Submitted", "Job Deleted"]},JLS_SCHM_SERTYPE : 'P'});
   a.push({
                service_name : argument,
                last_used_time : '',
                uploaded_count : bd_upload_count,
                pending_count : bd_pending_count,
                failur_count : 0,
                paused_count : bd_paused_count,
                job_count : bd_total_count,
                 index : 6
    });
    }


     else if(argument == 'LR SERVICE'){
   var bd_total_count  =  await lr_service_managementModel.find({'JOB_STATUS': {$in : ["Not Started", "Job Started"]},SMU_SCQH_BRCODE: req.body.br_code}).count();
   var bd_upload_count  =  await lr_service_managementModel.count({SMU_SCQH_BRCODE: req.body.br_code,JOB_STATUS:'Job Submitted'});
   var bd_pending_count  =  await lr_service_managementModel.count({SMU_SCQH_BRCODE: req.body.br_code,JOB_STATUS:'Job Started'});
   var bd_paused_count  =  await lr_service_managementModel.count({SMU_SCQH_BRCODE: req.body.br_code,'JOB_STATUS': {$nin : ["Job Started", "Job Stopped" , "Not Started", "Job Submitted", "Job Deleted"]}});
   a.push({
                service_name : argument,
                last_used_time : '',
                uploaded_count : bd_upload_count,
                pending_count : bd_pending_count,
                failur_count : 0,
                paused_count : bd_paused_count,
                job_count : bd_total_count,
                 index : 3
    });
    }



     else if(argument == 'Parts Replacement ACK'){
   var bd_total_count  =  await part_reply_service_managementModel.find({'JOB_STATUS': {$in : ["Not Started", "Job Started"]},SMU_ACK_BRCODE: req.body.br_code}).count();
   var bd_upload_count  =  await part_reply_service_managementModel.count({SMU_ACK_BRCODE: req.body.br_code,JOB_STATUS:'Job Submitted'});
   var bd_pending_count  =  await part_reply_service_managementModel.count({SMU_ACK_BRCODE: req.body.br_code,JOB_STATUS:'Job Started'});
   var bd_paused_count  =  await part_reply_service_managementModel.count({SMU_ACK_BRCODE: req.body.br_code,'JOB_STATUS': {$nin : ["Job Started", "Job Stopped" , "Not Started", "Job Submitted", "Job Deleted"]}});
   a.push({
                service_name : argument,
                last_used_time : '',
                uploaded_count : bd_upload_count,
                pending_count : bd_pending_count,
                failur_count : 0,
                paused_count : bd_paused_count,
                job_count : bd_total_count,
                 index : 4
    });
    }



else if(argument == 'Site Audit'){
   var bd_total_count  =  await audit_data_managementModel.find({'JOB_STATUS': {$in : ["Not Started", "Job Started"]},OM_OSA_BRCODE: req.body.br_code}).count();
   var bd_upload_count  =  await audit_data_managementModel.count({OM_OSA_BRCODE: req.body.br_code,JOB_STATUS:'Job Submitted'});
   var bd_pending_count  =  await audit_data_managementModel.count({OM_OSA_BRCODE: req.body.br_code,JOB_STATUS:'Job Started'});
   var bd_paused_count  =  await audit_data_managementModel.count({OM_OSA_BRCODE: req.body.br_code,'JOB_STATUS': {$nin : ["Job Started", "Job Stopped" , "Not Started", "Job Submitted", "Job Deleted"]}});
   a.push({
                service_name : argument,
                last_used_time : '',
                uploaded_count : bd_upload_count,
                pending_count : bd_pending_count,
                failur_count : 0,
                paused_count : bd_paused_count,
                job_count : bd_total_count,
                 index : 7
    });
    }


    else if(argument == 'ESCALATOR SURVEY FORM'){
   a.push({
                service_name : argument,
                last_used_time : '',
                uploaded_count : 0,
                pending_count : 0,
                failur_count : 0,
                paused_count : 0,
                job_count : 0,
                 index : 8
    });
    }


    else if(argument == 'ELEVATOR SURVEY FORM'){
   a.push({
                service_name : argument,
                last_used_time : '',
                uploaded_count : 0,
                pending_count : 0,
                failur_count : 0,
                paused_count : 0,
                job_count : 0,
                 index : 9
    });
    }

    else if(argument == 'SERVICE VISIBILITY'){
   a.push({
                service_name : argument,
                last_used_time : '',
                uploaded_count : 0,
                pending_count : 0,
                failur_count : 0,
                paused_count : 0,
                job_count : 0,
                 index : 10
    });
    }

     else if(argument == 'FAILURE REPORT REQUEST'){


   var bd_total_count  =  await add_failur_report_tempModel.find({'mech_code': service_user_managementss[0].user_id, app_status : 'SUBMITTED'}).count();
   var bd_pending_count  =  await add_failur_report_tempModel.find({'mech_code': service_user_managementss[0].user_id, app_status : 'PENDING'}).count();


   a.push({
                service_name : argument,
                last_used_time : '',
                uploaded_count : bd_total_count,
                pending_count : 0,
                failur_count : 0,
                paused_count : bd_pending_count,
                job_count : 0,
                 index : 11
    });
    }

    else if(argument == 'FAILURE REPORT APPROVAL'){

   var uploaded_count  =  await add_failur_report_tempModel.find({'eng_code': service_user_managementss[0].user_id, app_status : 'SUBMITTED'}).count();
   var job_count  =  await add_failur_report_tempModel.find({'eng_code': service_user_managementss[0].user_id, app_status : 'PENDING'}).count();
     
   a.push({
                service_name : argument,
                last_used_time : '',
                uploaded_count : uploaded_count,
                pending_count : 0,
                failur_count : 0,
                paused_count : 0,
                job_count : job_count,
                 index : 12
    });

    }

     else if(argument == 'ROPE MAINTENANCE'){
   a.push({
                service_name : argument,
                last_used_time : '',
                uploaded_count : 0,
                pending_count : 0,
                failur_count : 0,
                paused_count : 0,
                job_count : 0,
                 index : 13
    });
    }


    else if(argument == 'SAFETY AUDIT'){
   a.push({
                service_name : argument,
                last_used_time : '',
                uploaded_count : 0,
                pending_count : 0,
                failur_count : 0,
                paused_count : 0,
                job_count : 0,
                 index : 14
    });
    }

    else if(argument == 'SITE REPAIR WORK REQUEST'){



   var uploaded_count  =  await add_repair_work_request_tempModel.find({'submitted_by_emp_code': service_user_managementss[0].user_id, status : 'SUBMITTED'}).count();
   var bd_pending_count  =  await add_repair_work_request_tempModel.find({'submitted_by_emp_code': service_user_managementss[0].user_id, status : 'PENDING'}).count();


   a.push({
                service_name : argument,
                last_used_time : '',
                uploaded_count : uploaded_count,
                pending_count : 0,
                failur_count : 0,
                paused_count : bd_pending_count,
                job_count : 0,
                 index : 15
    });
    }


    else if(argument == 'SITE REPAIR WORK APPROVAL'){
   a.push({
                service_name : argument,
                last_used_time : '',
                uploaded_count : 0,
                pending_count : 0,
                failur_count : 0,
                paused_count : 0,
                job_count : 0,
                 index : 16
    });
    }

    else if(argument == 'REPAIR WORK JOB DETAILS'){
   a.push({
                service_name : argument,
                last_used_time : '',
                uploaded_count : 0,
                pending_count : 0,
                failur_count : 0,
                paused_count : 0,
                job_count : 0,
                 index : 17
    });
    }

    else if(argument == 'REPAIR WORK ORDER CREATION & COMPLETION'){
   a.push({
                service_name : argument,
                last_used_time : '',
                uploaded_count : 0,
                pending_count : 0,
                failur_count : 0,
                paused_count : 0,
                job_count : 0,
                 index : 18
    });
    }

    else if(argument == 'Material Request_Mobile Van'){

   var bd_total_count  =  await material_requestModel.find({'JOB_STATUS': {$in : ["Not Started", "Job Started"]},SMU_SCQH_BRCODE: req.body.br_code}).count();
   var bd_upload_count  =  await material_requestModel.count({SMU_SCQH_BRCODE: req.body.br_code,JOB_STATUS:'Job Submitted'});
   var bd_pending_count  =  await material_requestModel.count({SMU_SCQH_BRCODE: req.body.br_code,JOB_STATUS:'Job Started'});
   var bd_paused_count  =  await material_requestModel.count({SMU_SCQH_BRCODE: req.body.br_code,'JOB_STATUS': {$nin : ["Job Started", "Job Stopped" , "Not Started", "Job Submitted", "Job Deleted"]}});

   a.push({
                service_name : argument,
                last_used_time : '',
                uploaded_count : 0,
                pending_count : 0,
                failur_count : 0,
                paused_count : 0,
                job_count : 0,
                 index : 19
    });
    }

    if(service_list_alloc.length - 1 == count){
        numArray = a.sort(function (a, b) {  return a.index - b.index;  });

     res.json({Status:"Success",Message:"Service List", Data : numArray ,Code:200});
    } else {
          count = count + 1;
          recall(service_list_alloc[count].activity_name);
    }
    }   
});



// ******************************************************************************************************************************************************************************
// SERVICE VIEW STATUS - ADMIN PANEL
// ******************************************************************************************************************************************************************************
router.post('/fetch_view_status',async function (req, res) {
    if(req.body.date == undefined || req.body.date == null){
       req.body.date = new Date(); 
    }
  var service_list_alloc  =  await service_employee_activity_allocationModel.find({employee_no:req.body.user_mobile_no});
  var pending_data = [];
  var completed_data = [];
  var count = 0;
  var pending_count = 0;
  var completed_count = 0;
  if(service_list_alloc.length == 0){
        res.json({Status:"Success",Message:"Service List", Data : [] ,Code:200});
     } else {
          recall(service_list_alloc[count].activity_name);
     }
 async function recall(argument) {
 if(argument == 'Breakdown Serivce'){
    let pending_vars = {
      service_name : argument,
      count : 0,
      data : []
     }
    let complete_vars = {
      service_name : argument,
      count : 0,
      data : []
     }

   var bd_total_count  =  await breakdown_managementModel.find({'JOB_STATUS': {$nin : ["Job Submitted", "Job Paused"]},SMU_SCH_MECHCELL: req.body.user_mobile_no,SMU_SCH_SERTYPE : 'B'});
   var bd_upload_count  =  await breakdown_managementModel.find({SMU_SCH_MECHCELL: req.body.user_mobile_no,JOB_STATUS:'Job Submitted',SMU_SCH_SERTYPE : 'B'});


    bd_total_count.forEach(element => {

    if(element.JOB_START_TIME !== ""){
    if(new Date(element.JOB_START_TIME).toISOString().slice(0, 10) == new Date(req.body.date).toISOString().slice(0, 10)){
    pending_vars.count = pending_vars.count + 1;
    pending_count = pending_count + 1;
    pending_vars.data.push({
        job_id : element.SMU_SCH_JOBNO,
        start_time : element.JOB_START_TIME,
        end_time : element.JOB_END_TIME
    });
    }
    }
    });
    pending_data.push(pending_vars);

    bd_upload_count.forEach(element => {

        if(element.JOB_END_TIME !== ""){
    if(new Date(element.JOB_END_TIME).toISOString().slice(0, 10) == new Date(req.body.date).toISOString().slice(0, 10)){
    complete_vars.count = complete_vars.count + 1;
    completed_count = completed_count + 1;
    complete_vars.data.push({
        job_id : element.SMU_SCH_JOBNO,
        start_time : element.JOB_START_TIME,
        end_time : element.JOB_END_TIME
    });
    }
    }
    });
    completed_data.push(complete_vars);
 }else  if(argument == 'Preventive Maintenance'){
    let pending_vars = {
      service_name : argument,
      count : 0,
      data : []
     }
    let complete_vars = {
      service_name : argument,
      count : 0,
      data : []
     }

   var bd_total_count  =  await breakdown_managementModel.find({'JOB_STATUS': {$nin : ["Job Submitted", "Job Paused"]},SMU_SCH_MECHCELL: req.body.user_mobile_no,SMU_SCH_SERTYPE : 'P'});
   var bd_upload_count  =  await breakdown_managementModel.find({SMU_SCH_MECHCELL: req.body.user_mobile_no,JOB_STATUS:'Job Submitted',SMU_SCH_SERTYPE : 'P'});


    bd_total_count.forEach(element => {

    if(element.JOB_START_TIME !== ""){
    if(new Date(element.JOB_END_TIME).toISOString().slice(0, 10) == new Date(req.body.date).toISOString().slice(0, 10)){
    pending_vars.count = pending_vars.count + 1;
    pending_count = pending_count + 1;
    pending_vars.data.push({
        job_id : element.SMU_SCH_JOBNO,
        start_time : element.JOB_START_TIME,
        end_time : element.JOB_END_TIME
    });
    }
    }
    });
    pending_data.push(pending_vars);

    bd_upload_count.forEach(element => {

    if(element.JOB_END_TIME !== ""){
    if(new Date(element.JOB_END_TIME).toISOString().slice(0, 10) == new Date(req.body.date).toISOString().slice(0, 10)){
    complete_vars.count = complete_vars.count + 1;
    completed_count = completed_count + 1;
     complete_vars.data.push({
        job_id : element.SMU_SCH_JOBNO,
        start_time : element.JOB_START_TIME,
        end_time : element.JOB_END_TIME
    });
    }
    }
    });
     completed_data.push(complete_vars);

 
 }else  if(argument == 'Breakdown MR Approval'){
    let pending_vars = {
      service_name : argument,
      count : 0,
      data : []
     }
    let complete_vars = {
      service_name : argument,
      count : 0,
      data : []
     }
    var bd_total_count  =  await breakdown_mr_data_managementModel.find({'JOB_STATUS': {$nin : ["Job Submitted", "Job Paused"]},JLS_SCHM_ENGR_PHONE: req.body.user_mobile_no,JLS_SCHM_SERTYPE : 'B'});
    var bd_upload_count  =  await breakdown_mr_data_managementModel.find({JLS_SCHM_ENGR_PHONE: req.body.user_mobile_no,JOB_STATUS:'Job Submitted',JLS_SCHM_SERTYPE : 'B'});


    bd_total_count.forEach(element => {

    if(element.JOB_START_TIME !== ""){
    if(new Date(element.JOB_START_TIME).toISOString().slice(0, 10) == new Date(req.body.date).toISOString().slice(0, 10)){
    pending_vars.count = pending_vars.count + 1;
    pending_count = pending_count + 1;
    pending_vars.data.push({
        job_id : element.JLS_SCHM_JOBNO,
        start_time : element.JOB_START_TIME,
        end_time : element.JOB_END_TIME
    });
    }
    }
    });
    pending_data.push(pending_vars);

    bd_upload_count.forEach(element => {

    if(element.JOB_END_TIME !== ""){
    if(new Date(element.JOB_END_TIME).toISOString().slice(0, 10) == new Date(req.body.date).toISOString().slice(0, 10)){
    complete_vars.count = complete_vars.count + 1;
    completed_count = completed_count + 1;
    complete_vars.data.push({
        job_id : element.JLS_SCHM_JOBNO,
        start_time : element.JOB_START_TIME,
        end_time : element.JOB_END_TIME
    });
    }
    }
    });
    completed_data.push(complete_vars);
 }else  if(argument == 'Preventive MR Approval'){
    let pending_vars = {
      service_name : argument,
      count : 0,
      data : []
     }
    let complete_vars = {
      service_name : argument,
      count : 0,
      data : []
     }

   var bd_total_count  =  await breakdown_mr_data_managementModel.find({'JOB_STATUS': {$nin : ["Job Submitted", "Job Paused"]},JLS_SCHM_ENGR_PHONE: req.body.user_mobile_no,JLS_SCHM_SERTYPE:'P'});
   var bd_upload_count  =  await breakdown_mr_data_managementModel.find({JLS_SCHM_ENGR_PHONE: req.body.user_mobile_no,JOB_STATUS:'Job Submitted',JLS_SCHM_SERTYPE : 'P'});

    bd_total_count.forEach(element => {


    if(element.JOB_START_TIME !== ""){
    if(new Date(element.JOB_START_TIME).toISOString().slice(0, 10) == new Date(req.body.date).toISOString().slice(0, 10)){
    pending_vars.count = pending_vars.count + 1;
    pending_count = pending_count + 1;
    pending_vars.data.push({
        job_id : element.JLS_SCHM_JOBNO,
        start_time : element.JOB_START_TIME,
        end_time : element.JOB_END_TIME
    });
    }
    }
    });
    pending_data.push(pending_vars);

    bd_upload_count.forEach(element => {

    if(element.JOB_END_TIME !== ""){
    if(new Date(element.JOB_END_TIME).toISOString().slice(0, 10) == new Date(req.body.date).toISOString().slice(0, 10)){
    complete_vars.count = complete_vars.count + 1;
    completed_count = completed_count + 1;
    complete_vars.data.push({
        job_id : element.JLS_SCHM_JOBNO,
        start_time : element.JOB_START_TIME,
        end_time : element.JOB_END_TIME
    });
    }
    }
    });
    completed_data.push(complete_vars);
 }else if(argument == 'LR SERVICE'){
    let pending_vars = {
      service_name : argument,
      count : 0,
      data : []
     }
    let complete_vars = {
      service_name : argument,
      count : 0,
      data : []
     }

     

   var bd_total_count  =  await lr_service_managementModel.find({'JOB_STATUS': {$nin : ["Job Submitted", "Job Paused"]},SMU_SEN_MOBILENO: req.body.user_mobile_no});
   var bd_upload_count  =  await lr_service_managementModel.find({SMU_SEN_MOBILENO: req.body.user_mobile_no,JOB_STATUS:'Job Submitted'});


    bd_total_count.forEach(element => {

        if(element.JOB_START_TIME !== ""){
    if(new Date(element.JOB_START_TIME).toISOString().slice(0, 10) == new Date(req.body.date).toISOString().slice(0, 10)){
    pending_vars.count = pending_vars.count + 1;
    pending_count = pending_count + 1;
    pending_vars.data.push({
        job_id : element.SMU_SCQH_JOBNO,
        start_time : element.JOB_START_TIME,
        end_time : element.JOB_END_TIME
    });
    }
    }
    });
    pending_data.push(pending_vars);

    bd_upload_count.forEach(element => {


    if(element.JOB_END_TIME !== ""){
    if(new Date(element.JOB_END_TIME).toISOString().slice(0, 10) == new Date(req.body.date).toISOString().slice(0, 10)){
    complete_vars.count = complete_vars.count + 1;
    completed_count = completed_count + 1;
    complete_vars.data.push({
        job_id : element.SMU_SCQH_JOBNO,
        start_time : element.JOB_START_TIME,
        end_time : element.JOB_END_TIME
    });
    }
    }
    });
    completed_data.push(complete_vars);
 }else if(argument == 'Parts Replacement ACK'){
    let pending_vars = {
      service_name : argument,
      count : 0,
      data : []
     }
    let complete_vars = {
      service_name : argument,
      count : 0,
      data : []
     }


   var bd_total_count  =  await part_reply_service_managementModel.find({'JOB_STATUS': {$nin : ["Job Submitted", "Job Paused"]},SMU_ACK_MOBILENO: req.body.user_mobile_no});
   var bd_upload_count  =  await part_reply_service_managementModel.find({SMU_ACK_MOBILENO: req.body.user_mobile_no,JOB_STATUS:'Job Submitted'});


    bd_total_count.forEach(element => {

    if(element.JOB_START_TIME !== ""){
    if(new Date(element.JOB_START_TIME).toISOString().slice(0, 10) == new Date(req.body.date).toISOString().slice(0, 10)){
    pending_vars.count = pending_vars.count + 1;
    pending_count = pending_count + 1;
    pending_vars.data.push({
        job_id : element.SMU_ACK_JOBNO,
        start_time : element.JOB_START_TIME,
        end_time : element.JOB_END_TIME
    });
    }
    }
    });
    pending_data.push(pending_vars);

    bd_upload_count.forEach(element => {

    if(element.JOB_END_TIME !== ""){
    if(new Date(element.JOB_END_TIME).toISOString().slice(0, 10) == new Date(req.body.date).toISOString().slice(0, 10)){
    complete_vars.count = complete_vars.count + 1;
    completed_count = completed_count + 1;
    complete_vars.data.push({
        job_id : element.SMU_ACK_JOBNO,
        start_time : element.JOB_START_TIME,
        end_time : element.JOB_END_TIME
    });
    }
    }
    });
    completed_data.push(complete_vars);
 }else if(argument == 'Site Audit'){
    let pending_vars = {
      service_name : argument,
      count : 0,
      data : []
     }
    let complete_vars = {
      service_name : argument,
      count : 0,
      data : []
     }

   var bd_total_count  =  await audit_data_managementModel.find({'JOB_STATUS': {$nin : ["Job Submitted", "Job Paused"]},OM_OSA_MOBILE: req.body.user_mobile_no});
   var bd_upload_count  =  await audit_data_managementModel.find({OM_OSA_MOBILE: req.body.user_mobile_no,JOB_STATUS:'Job Submitted'});

    bd_total_count.forEach(element => {

        if(element.JOB_START_TIME !== ""){
    if(new Date(element.JOB_START_TIME).toISOString().slice(0, 10) == new Date(req.body.date).toISOString().slice(0, 10)){
    pending_vars.count = pending_vars.count + 1;
    pending_count = pending_count + 1;
    pending_vars.data.push({
        job_id : element.OM_OSA_JOBNO,
        start_time : element.JOB_START_TIME,
        end_time : element.JOB_END_TIME
    });
    }
    }
    });
    pending_data.push(pending_vars);

    bd_upload_count.forEach(element => {

    if(element.JOB_END_TIME !== ""){
    if(new Date(element.JOB_END_TIME).toISOString().slice(0, 10) == new Date(req.body.date).toISOString().slice(0, 10)){
    complete_vars.count = complete_vars.count + 1;
    completed_count = completed_count + 1;
    complete_vars.data.push({
        job_id : element.OM_OSA_JOBNO,
        start_time : element.JOB_START_TIME,
        end_time : element.JOB_END_TIME
    });
    }
     }
    });
    completed_data.push(complete_vars);
 }


  if(service_list_alloc.length - 1 == count){
     let datas = {
     pending_total : pending_count,
     pending_data : pending_data,
     completed_total : completed_count,
     completed_data : completed_data
    }
   res.json({Status:"Success",Message:"View Status", Data : datas ,Code:200});

    } else {
          count = count + 1;
          recall(service_list_alloc[count].activity_name);
  }
}




});













// ******************************************************************************************************************************************************************************
// SERVICE BREAKDOWN ACKNOWLEDGEMENT TEXT
// ******************************************************************************************************************************************************************************
router.post('/job_details_in_text',async function (req, res) {
    var job_details =  await breakdown_managementModel.findOne({SMU_SCH_COMPNO:req.body.SMU_SCH_COMPNO});
        let a  = {
                        text_value : "The work is completed in a satfisfactory manner and we hereby reqeust to accept the same for job ID : "+ job_details.SMU_SCH_JOBNO +" . Customer Name : "+  job_details.SMU_SCH_CUSNAME +" and BDNO : "+ job_details.SMU_SCH_COMPNO+".",
                 }       
       res.json({Status:"Success",Message:"Job Detail Text", Data : a ,Code:200});
});





// router.post('/view_status', function (req, res) {

//         let a  = [
//                {

//                 status_title : "Pending Job",
//                 count : 1,
//                 service_list : [
//                     {
//                         service_name : 'Breakdown Serivce',
//                         count : 0
//                     },
//                     {
//                         service_name : 'LR SERVICE',
//                         count : 0
//                     },
//                     {
//                         service_name : 'Preventive Maintenance',
//                         count : 0
//                     },
//                     {
//                         service_name : 'Parts Replacement ACK',
//                         count : 0
//                     }
//                 ] 
//                },
//                {
//                 status_title : "Completed Job",
//                 count : 1,
//                 service_list : [
//                     {
//                         service_name : 'Breakdown Serivce',
//                         count : 0
//                     },
//                     {
//                         service_name : 'LR SERVICE',
//                         count : 0
//                     },
//                     {
//                         service_name : 'Preventive Maintenance',
//                         count : 0
//                     },
//                     {
//                         service_name : 'Parts Replacement ACK',
//                         count : 0
//                     }
//                 ] 
//                },
//                {
//                 status_title : "Error Job",
//                 count : 1,
//                 service_list : [
//                     {
//                         service_name : 'Breakdown Serivce',
//                         count : 0
//                     },
//                     {
//                         service_name : 'LR SERVICE',
//                         count : 0
//                     },
//                     {
//                         service_name : 'Preventive Maintenance',
//                         count : 0
//                     },
//                     {
//                         service_name : 'Parts Replacement ACK',
//                         count : 0
//                     }
//                 ] 
//                }

//         ]        
//        res.json({Status:"Success",Message:"Service List", Data : a ,Code:200});
// });



// router.post('/fetch_service_repport', function (req, res) {
//       let result =  {
//            created : 20,
//            mobile_status : 1000,
//            completed :300,
//            paused : 1670,
//            not_attend : 200,
//        }
//        res.json({Status:"Success",Message:"Service Report", Data : result ,Code:200});
// });






// router.post('/eng_mrlist', function (req, res) {
//        let result = [
//           {
//             title : 'Mr1',
//             value : 'coil'
//           },
//           {
//             title : 'Mr2',
//             value : 'coli11'
//           },{
//             title : 'Mr3',
//             value : ''
//           },{
//             title : 'Mr4',
//             value : ''
//           },{
//             title : 'Mr5',
//             value : 'colio'
//           },{
//             title : 'Mr6',
//             value : ''
//           },{
//             title : 'Mr7',
//             value : ''
//           },{
//             title : 'Mr8',
//             value : ''
//           },{
//             title : 'Mr9',
//             value : ''
//           },{
//             title : 'Mr10',
//             value : ''
//           }
//        ];
//        res.json({Status:"Success",Message:"Service Report", Data : result ,Code:200});
// });



// router.post('/eng_mrlist_submit', function (req, res) {

//        res.json({Status:"Success",Message:"Data submitted successfully", Data : {} ,Code:200});
// });






// router.post('/attendnace_report', function (req, res) {
//       if(req.body.date_type == "week"){
//       let result =  [
//            {
//             title: "MON",
//             count : 200
//            },
//             {
//             title: "TUE",
//             count : 3000
//            },
//             {
//             title: "WEB",
//             count : 100
//            },
//             {
//             title: "THUS",
//             count : 40
//            },
//             {
//             title: "FRI",
//             count : 6000
//            },
//             {
//             title: "SAT",
//             count : 200
//            },
//             {
//             title: "SUN",
//             count : 100
//            }
//        ]
//        res.json({Status:"Success",Message:"Attendnace report", Data : result ,Code:200});
//    }
//    else if(req.body.date_type == "year"){
//       let result =  [
//            {
//             title: "JAN",
//             count : 200
//            },
//             {
//             title: "FEB",
//             count : 3000
//            },
//             {
//             title: "MAR",
//             count : 100
//            },
//             {
//             title: "APR",
//             count : 40
//            },
//             {
//             title: "MAY",
//             count : 6000
//            },
//             {
//             title: "JUN",
//             count : 200
//            },
//             {
//             title: "JUL",
//             count : 100
//            },
//             {
//             title: "AUG",
//             count : 100
//            },
//             {
//             title: "SEP",
//             count : 100
//            },
//             {
//             title: "OCT",
//             count : 100
//            },
//             {
//             title: "NOV",
//             count : 100
//            },
//             {
//             title: "DEC",
//             count : 100
//            }
//        ]
//        res.json({Status:"Success",Message:"Attendnace report", Data : result ,Code:200});
//    }
//    else if(req.body.date_type == "month"){
//       let result =  [
//            {
//             title: "1",
//             count : 200
//            },
//             {
//             title: "2",
//             count : 3000
//            },
//             {
//             title: "3",
//             count : 100
//            },
//             {
//             title: "4",
//             count : 40
//            },
//             {
//             title: "5",
//             count : 6000
//            },
//             {
//             title: "6",
//             count : 200
//            },
//             {
//             title: "7",
//             count : 100
//            },
//             {
//             title: "8",
//             count : 100
//            },
//             {
//             title: "9",
//             count : 100
//            },
//             {
//             title: "10",
//             count : 100
//            },
//             {
//             title: "11",
//             count : 100
//            },
//             {
//             title: "12",
//             count : 100
//            }
//        ]
//        res.json({Status:"Success",Message:"Attendnace report", Data : result ,Code:200});
//    }
// });



// ******************************************************************************************************************************************************************************
// SERVICE SCHEDULE AUTO LOGOUT PROCESS
// ******************************************************************************************************************************************************************************

router.get('/fetch_login_details',async function (req, res) {
        var user_detail  =  await service_user_management.find({"user_type": "Log In"});
        var index = 0;
        recall(index,user_detail);
        function recall(index,user_detail){
            if(index < user_detail.length) {
                let requests = {
                user_mobile_no : user_detail[index].user_mobile_no,
                att_reason : 'AUTO LOGOUT'
                }
                request.post(
                'http://smart.johnsonliftsltd.com:3000/api/service_userdetails/update_logout_time',
                { json: requests},
                function (error, response, body) {
                if (!error && response.statusCode == 200) {
                }
                index = index + 1;
                recall(index,user_detail);
                }
                );
            } else {
             res.json({Status:"Success",Message:"Auto Logout successfully", Data : {} ,Code:200});  
            }
        }       
});




// ******************************************************************************************************************************************************************************
// SERVICE CLEAR OVER ALL DEVICE ID
// ******************************************************************************************************************************************************************************
router.get('/clear_device_id',async function (req, res) {
        var user_detail  =  await service_user_management.find({});
        for(let a = 0 ; a < user_detail.length ; a++){
               let as = {
                 device_id : "",
               }
            service_user_management.findByIdAndUpdate(user_detail[a]._id, as, {new: true}, function (err, UpdatedDetails) {
            if (err)return res.json({Status:"Failed",Message:"Internal Server Error", Data:err,Code:500}); 
            });
           if(a == user_detail.length - 1){
            res.json({Status:"Success",Message:"Device id Cleard successfully", Data : {} ,Code:200});
           }
        }
});



// ******************************************************************************************************************************************************************************
// SERVICE CLEAR SINGLE DEVICE ID WITH MOBILE NO - ADMIN PANEL
// ******************************************************************************************************************************************************************************
router.post('/clear_device_id_user_mobile_no',async function (req, res) {
           var user_detail  =  await service_user_management.findOne({user_mobile_no: req.body.user_mobile_no});
              
               let as = {
                 device_id : "",
               }
            service_user_management.findByIdAndUpdate(user_detail._id, as, {new: true}, function (err, UpdatedDetails) {
            if (err)return res.json({Status:"Failed",Message:"Internal Server Error", Data:err,Code:500}); 
         
            res.json({Status:"Success",Message:"Device id Cleard successfully", Data : {} ,Code:200});
            });
});



// ******************************************************************************************************************************************************************************
// SERVICE LOGOUT TIME UPDATE 
// ******************************************************************************************************************************************************************************
router.post('/update_logout_time',async function (req, res) {
        var user_detail  =  await service_user_management.findOne({user_mobile_no: req.body.user_mobile_no});
        let a = {
        
        "logout_lat" : req.body.logout_lat || 0.0,
        "logout_long" : req.body.logout_long || 0.0,
        "logout_address" : req.body.logout_address || 'Unknow',    

            last_logout_time : new Date().toLocaleString('en-US', {timeZone: 'Asia/Calcutta'}),
            user_type : "Log Out"
           }
        service_user_management.findByIdAndUpdate(user_detail._id, a, {new: true}, function (err, UpdatedDetails) {
            if (err)return res.json({Status:"Failed",Message:"Internal Server Error", Data:err,Code:500});    
request.post(
    'http://smart.johnsonliftsltd.com:3000/api/service_userdetails/update_att_orcal',
    { json: req.body},
    function (error, response, body) {
        if (!error && response.statusCode == 200) {
        }
        res.json({Status:"Success",Message:"Logout successfully", Data : {} ,Code:200});
    }
);
        });
});


// ******************************************************************************************************************************************************************************
// SERVICE UPDATE PAUSE RESUME TIME
// ******************************************************************************************************************************************************************************
router.post('/update_pause_resume_time',async function (req, res) {
        var user_detail  =  await service_user_management.findOne({user_mobile_no: req.body.user_mobile_no});
oracledb.getConnection({
      user: "JLSMART",
      password: "JLSMART",
      connectString: "(DESCRIPTION =(ADDRESS = (PROTOCOL = TCP)(HOST = 192.168.1.112)(PORT = 1521))(CONNECT_DATA =(SID = jlpl)))"
}, function(err, connection) {
if (err) {
    console.error(err.message);
    return;
}
const date = require('date-and-time');
const now1  =  new Date();
const value1 = date.format(now1,'DD-MM-YYYY HH:mm:ss')
 let da =
     {
            "SERVICE_NAME":req.body.service_name,
            "JOB_NO":req.body.job_no,
            "COMPLAINT_NO":req.body.complaint_no,
            "AGENT_NAME": user_detail.user_name,
            "EMP_ID": user_detail.user_id,
            "ACTIVITY_TIME":value1,
            "ACTION":req.body.status,
            "AGENT_ID":"1",
    }
      connection.execute(
            "INSERT INTO PAUSE_RESUME_TIME (SERVICE_NAME, JOB_NO, COMPLAINT_NO, AGENT_NAME, EMP_ID, ACTIVITY_TIME, ACTION, AGENT_ID, ACTION_LOCATION, JOB_LOCATION) VALUES (:SERVICE_NAME, :JOB_NO, :COMPLAINT_NO, :AGENT_NAME, :EMP_ID, to_date(:ACTIVITY_TIME, 'DD/MM/YYYY HH24:MI:SS'),:ACTION,:AGENT_ID,'','' )",
              da, // Bind values
              { autoCommit: true}, 
        function (err, result) {
    if (err) { console.error(err.message);
          doRelease(connection);
          return;
     }     
     doRelease(connection);
     res.json({Status:"Success",Message:"Request Send Successfully", Data : {},Code:200});
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
// SERVICE FETCH ACTIVE USER DETAILS - ADMIN PANEL
// ******************************************************************************************************************************************************************************
router.get('/getlist', function (req, res) {
        service_user_management.find({status:"Active"}, function (err, Functiondetails) {
          res.json({Status:"Success",Message:"User management", Data : Functiondetails ,Code:200});
        });
});



// ******************************************************************************************************************************************************************************
// SERVICE FETCH DE-ACTIVE USER DETAILS - ADMIN PANEL
// ******************************************************************************************************************************************************************************
router.get('/getlist/deactive', function (req, res) {
        service_user_management.find({ 'status': {$in : ["InActive", "Delete", "Suspend"]}}, function (err, Functiondetails) {
          res.json({Status:"Success",Message:"User management", Data : Functiondetails ,Code:200});
        });
});


// ******************************************************************************************************************************************************************************
// SERVICE FETCH USER LOCATION - ADMIN PANEL
// ******************************************************************************************************************************************************************************
router.post('/getlist_by_usertype', function (req, res) {
   let a = [];
   req.body.access_location.forEach(function(element) {
   a.push(element.branch_code);
   });
   service_user_management.find({user_location:{$in:a}}, function (err, Functiondetails) {
   res.json({Status:"Success",Message:"User management", Data : Functiondetails ,Code:200});
   var mobile_number = [];
   });
});


// ******************************************************************************************************************************************************************************
// SERVICE UPDATE ORACLE TIME AND LOCATION
// ******************************************************************************************************************************************************************************
router.post('/update_att_orcal',async function (req, res) {
var user_detail  =  await service_user_management.findOne({user_mobile_no: req.body.user_mobile_no});
    var date1 = new Date(user_detail.last_login_time);
    var date2 =  new Date(user_detail.last_logout_time);
    var diff = date2.getTime() - date1.getTime();
    var msec = diff;
    var hh = `0${Math.floor(msec / 1000 / 60 / 60)}`;
    msec -= hh * 1000 * 60 * 60;
    var mm = `0${Math.floor(msec / 1000 / 60)}`;
    msec -= mm * 1000 * 60;
    var ss = `0${Math.floor(msec / 1000)}`;
    msec -= ss * 1000;

// var time_diff = "+000000000 "+hh.slice(-2) + ":" + mm.slice(-2) + ":" + ss.slice(-2)+".000000000";
var time_diff = ""+hh.slice(-2) + ":" + mm.slice(-2) + ":" + ss.slice(-2)+"";
oracledb.getConnection({
      user: "JLSMART",
      password: "JLSMART",
      connectString: "(DESCRIPTION =(ADDRESS = (PROTOCOL = TCP)(HOST = 192.168.1.112)(PORT = 1521))(CONNECT_DATA =(SID = jlpl)))"
}, function(err, connection) {
if (err) {
    console.error(err.message);
    return;
}
 

const date = require('date-and-time');
const now1  =  new Date(user_detail.last_login_time);
const value1 = date.format(now1,'DD-MM-YYYY HH:mm:ss');
const now2  =  new Date(user_detail.last_logout_time);
const value2 = date.format(now2,'DD-MM-YYYY HH:mm:ss');
 let da =
       {
            "AGENTID": "1",
            "AGENTNAME":""+user_detail.user_name,
            "INTIME": value1,
            "OUTTIME": value2,
            "LOGOUTREASON": ""+req.body.att_reason || "",
            "TIME_DIFFERENCE": ""+time_diff  || "",
            "EMPLOYEE_ID":""+user_detail.user_id,
            "LOCATION":""+user_detail.user_location,
            "LOGIN_LOCATION":""+user_detail.login_address,
            "LOGOUT_LOCATION":""+user_detail.logout_address,

        }
      connection.execute(
            "INSERT INTO AGENTATTENDANCE(AGENTID, AGENTNAME, INTIME, OUTTIME, LOGOUTREASON, TIME_DIFFERENCE, LOCATION, EMPLOYEE_ID, LOGIN_LOCATION, AGENT_START_JOB_LOCATION, CORRECT_START_JOB_LOCATION, START_JOBID, LOGOUT_LOCATION, AGENT_STOP_JOB_LOCATION, CORRECT_STOP_JOB_LOCATION, STOP_JOBID ) VALUES (:AGENTID, :AGENTNAME, to_date(:INTIME, 'DD/MM/YYYY HH24:MI:SS'), to_date(:OUTTIME, 'DD/MM/YYYY HH24:MI:SS'), :LOGOUTREASON,:TIME_DIFFERENCE,:LOCATION,:EMPLOYEE_ID,:LOGIN_LOCATION, '','','',:LOGOUT_LOCATION,'','','')",
              da, // Bind values
              { autoCommit: true}, 
        function (err, result) {
    if (err) { console.error(err.message);
          doRelease(connection);
          return;
     }
     doRelease(connection);
     res.json({Status:"Success",Message:"Request Send Successfully", Data : {},Code:200});
   
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
// SERVICE PENDING JOB STATUS UPDATE IN ORACLE
// ******************************************************************************************************************************************************************************
router.post('/pending_job_pause',async function (req, res) { 
var dates = require('date-and-time');
var now1  =  new Date();
var value1 = dates.format(now1,'YYYY-MM-DDTHH:mm:ss');
  // res.json({Status:"Success",Message:"Submitted Successfully", Data : {} ,Code:200});
   var service_name  = '--';
   if(req.body.service_type == "BreakDown Service"){
   var job_details  =  await breakdown_managementModel.findOne({SMU_SCH_COMPNO:req.body.comp_no,SMU_SCH_SERTYPE:'B'});
   let da = {
            JOB_STATUS : "Job Paused",
             LAST_UPDATED_TIME : ""+value1,
            JOB_END_TIME : ""+value1
        }
         breakdown_managementModel.findByIdAndUpdate(job_details._id, da, {new: true}, function (err, UpdatedDetails) {
            if (err) return res.json({Status:"Failed",Message:"Internal Server Error", Data : {},Code:500});
            res.json({Status:"Success",Message:"Update successfully", Data : {} ,Code:200});
         }); 
   service_name = 'BD';
   }
   if(req.body.service_type == "Preventive Maintenance"){
   var job_details  =  await breakdown_managementModel.findOne({SMU_SCH_COMPNO:req.body.comp_no,SMU_SCH_SERTYPE:'P'});
     

         let da = {
            JOB_STATUS : "Job Paused",
             LAST_UPDATED_TIME :""+value1,
            JOB_END_TIME : ""+value1
        }
         breakdown_managementModel.findByIdAndUpdate(job_details._id, da, {new: true}, function (err, UpdatedDetails) {
            if (err) return res.json({Status:"Failed",Message:"Internal Server Error", Data : {},Code:500});
            res.json({Status:"Success",Message:"Update successfully", Data : {} ,Code:200});
         }); 


   service_name = 'PM';
   }
   if(req.body.service_type == "BreakDown MR"){
   var job_details  =  await breakdown_mr_data_managementModel.findOne({JLS_SCHM_SERTYPE:'B',JLS_SCHM_COMPNO:req.body.comp_no});

        let da = {
            JOB_STATUS : "Job Paused",
             LAST_UPDATED_TIME : ""+value1,
            JOB_END_TIME : ""+value1
        }
         breakdown_mr_data_managementModel.findByIdAndUpdate(job_details._id, da, {new: true}, function (err, UpdatedDetails) {
            if (err) return res.json({Status:"Failed",Message:"Internal Server Error", Data : {},Code:500});
            res.json({Status:"Success",Message:"Update successfully", Data : {} ,Code:200});
         }); 

   service_name = 'BDMR';
   }
   if(req.body.service_type == "Preventive MR"){
   var job_details  =  await breakdown_mr_data_managementModel.findOne({JLS_SCHM_SERTYPE:'P',JLS_SCHM_COMPNO:req.body.comp_no});
        let da = {
            JOB_STATUS : "Job Paused",
            LAST_UPDATED_TIME :""+value1,
            JOB_END_TIME : ""+value1
        }
         breakdown_mr_data_managementModel.findByIdAndUpdate(job_details._id, da, {new: true}, function (err, UpdatedDetails) {
            if (err) return res.json({Status:"Failed",Message:"Internal Server Error", Data : {},Code:500});
            res.json({Status:"Success",Message:"Update successfully", Data : {} ,Code:200});
         }); 

   service_name = 'PMMR';
   }
   if(req.body.service_type == "LR Service"){
  var job_details  =  await lr_service_managementModel.findOne({SMU_SCQH_QUOTENO: req.body.comp_no});
          let da = {
            JOB_STATUS : "Job Paused",
             LAST_UPDATED_TIME : ""+value1,
            JOB_END_TIME : ""+value1
        }
         lr_service_managementModel.findByIdAndUpdate(job_details._id, da, {new: true}, function (err, UpdatedDetails) {
            if (err) return res.json({Status:"Failed",Message:"Internal Server Error", Data : {},Code:500});
            res.json({Status:"Success",Message:"Update successfully", Data : {} ,Code:200});
         }); 


   service_name = 'LR';
   }
   if(req.body.service_type == "Site Audit"){
   var job_details  =  await audit_data_managementModel.findOne({OM_OSA_COMPNO: req.body.comp_no}); 
       let da = {
            JOB_STATUS : "Job Paused",
             LAST_UPDATED_TIME : ""+value1,
            JOB_END_TIME : ""+value1
        }
         audit_data_managementModel.findByIdAndUpdate(job_details._id, da, {new: true}, function (err, UpdatedDetails) {
            if (err) return res.json({Status:"Failed",Message:"Internal Server Error", Data : {},Code:500});
            res.json({Status:"Success",Message:"Update successfully", Data : {} ,Code:200});
         }); 

   service_name = 'SA';
   }
   if(req.body.service_type == "Part Master"){
   var job_details  =  await part_reply_service_managementModel.findOne({SMU_ACK_COMPNO: req.body.comp_no});
        let da = {
            JOB_STATUS : "Job Paused",
            LAST_UPDATED_TIME :""+value1,
            JOB_END_TIME : ""+value1
        }
         part_reply_service_managementModel.findByIdAndUpdate(job_details._id, da, {new: true}, function (err, UpdatedDetails) {
            if (err) return res.json({Status:"Failed",Message:"Internal Server Error", Data : {},Code:500});
            res.json({Status:"Success",Message:"Update successfully", Data : {} ,Code:200});
         }); 
    service_name = 'PRT';
   }


let cc = {
    user_mobile_no : req.body.user_mobile_no,
    job_no : req.body.job_no,
    complaint_no : req.body.comp_no,
    status : 2,
    service_name : service_name
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


// ******************************************************************************************************************************************************************************
// SERVICE CHECK OUTSTANDING PENDING JOB
// ******************************************************************************************************************************************************************************
router.post('/check_outstanding_job',async function (req, res) { 
    // console.log("Pause Job Check", req.body);
   var bd_b_total_count  =  await breakdown_managementModel.findOne({'JOB_STATUS': {$in : ["Job Started", "Job Resume"]},SMU_SCH_MECHCELL: req.body.user_mobile_no,SMU_SCH_SERTYPE : 'B'});
   var bd_p_total_count  =  await breakdown_managementModel.findOne({'JOB_STATUS': {$in : ["Job Started", "Job Resume"]},SMU_SCH_MECHCELL: req.body.user_mobile_no,SMU_SCH_SERTYPE : 'P'});
   var bd_b_mr_total_count  =  await breakdown_mr_data_managementModel.findOne({'JOB_STATUS': {$in : ["Job Started", "Job Resume"]},JLS_SCHM_ENGR_PHONE: req.body.user_mobile_no,JLS_SCHM_SERTYPE : 'B'});
   var bd_p_mr_total_count  =  await breakdown_mr_data_managementModel.findOne({'JOB_STATUS': {$in : ["Job Started", "Job Resume"]},JLS_SCHM_ENGR_PHONE: req.body.user_mobile_no,JLS_SCHM_SERTYPE:'P'});
   var lr_total_count  =  await lr_service_managementModel.findOne({'JOB_STATUS': {$in : ["Job Started", "Job Resume"]},SMU_SEN_MOBILENO: req.body.user_mobile_no});
   var pr_total_count  =  await part_reply_service_managementModel.findOne({'JOB_STATUS': {$in : ["Job Started", "Job Resume"]},SMU_ACK_MOBILENO: req.body.user_mobile_no});
   var ad_total_count  =  await audit_data_managementModel.findOne({'JOB_STATUS': {$in : ["Job Started", "Job Resume"]},OM_OSA_MOBILE: req.body.user_mobile_no});
    if(bd_p_total_count !== null) {
         let data = {
           job_no : bd_p_total_count.SMU_SCH_JOBNO,
           start_time : bd_p_total_count.JOB_START_TIME,
           service_type : "Preventive Maintenance",
           comp_no : bd_p_total_count.SMU_SCH_COMPNO
       }
       if(data.job_no == req.body.job_id){
       res.json({Status:"Success",Message:"No Pending Job", Data : {} ,Code:200});
       } else {
       res.json({Status:"Success",Message:"Pending Job", Data : data ,Code:200});
       }

    }else if(bd_b_mr_total_count !== null) {
         let data = {
           job_no : bd_b_mr_total_count.JLS_SCHM_JOBNO,
           start_time :  bd_b_mr_total_count.JOB_START_TIME,
           service_type : "BreakDown MR",
           comp_no : bd_b_mr_total_count.JLS_SCHM_COMPNO
       }

       if(data.job_no == req.body.job_id){
       res.json({Status:"Success",Message:"No Pending Job", Data : {} ,Code:200});
       } else {
       res.json({Status:"Success",Message:"Pending Job", Data : data ,Code:200});
       }

    }else if(bd_p_mr_total_count !== null) {
         let data = {
           job_no : bd_p_mr_total_count.JLS_SCHM_JOBNO,
           start_time :  bd_p_mr_total_count.JOB_START_TIME,
           service_type : "Preventive MR",
           comp_no : bd_p_mr_total_count.JLS_SCHM_COMPNO
       }

       if(data.job_no == req.body.job_id){
       res.json({Status:"Success",Message:"No Pending Job", Data : {} ,Code:200});
       } else {
       res.json({Status:"Success",Message:"Pending Job", Data : data ,Code:200});
       }

    }else if(lr_total_count !== null) {
         let data = {
           job_no : lr_total_count.SMU_SCQH_JOBNO,
           start_time : lr_total_count.JOB_START_TIME,
           service_type : "LR Service",
           comp_no : lr_total_count.SMU_SCQH_QUOTENO
       }

       if(data.job_no == req.body.job_id){
       res.json({Status:"Success",Message:"No Pending Job", Data : {} ,Code:200});
       } else {
       res.json({Status:"Success",Message:"Pending Job", Data : data ,Code:200});
       }

    }else if(ad_total_count !== null) {
         let data = {
           job_no : ad_total_count.OM_OSA_JOBNO,
           start_time : ad_total_count.JOB_START_TIME,
           service_type : "Site Audit",
           comp_no : ad_total_count.OM_OSA_COMPNO
       }

      if(data.job_no == req.body.job_id){
       res.json({Status:"Success",Message:"No Pending Job", Data : {} ,Code:200});
       } else {
       res.json({Status:"Success",Message:"Pending Job", Data : data ,Code:200});
       }

    }else if(pr_total_count !== null) {
     let data = {
           job_no : pr_total_count.SMU_ACK_JOBNO,
           start_time : pr_total_count.JOB_START_TIME,
           service_type : "Part Master",
           comp_no : pr_total_count.SMU_ACK_COMPNO
       }
       
       if(data.job_no == req.body.job_id){
       res.json({Status:"Success",Message:"No Pending Job", Data : {} ,Code:200});
       } else {
       res.json({Status:"Success",Message:"Pending Job", Data : data ,Code:200});
       }
       

    }else {
         res.json({Status:"Success",Message:"No Pending Job", Data : {} ,Code:200});
    }
});



// router.get('/autopull_option',async function (req, res) {
//   var user_detail  =  await service_user_management.find({user_type:"Log In"});
//     var index = 0;
//     recall(index);
//     function recall(index){
//            if(index < user_detail.length){
// let data = {
//    user_mobile_no : user_detail[index].user_per_mob,
//    user_password : user_detail[index].user_password
// }

// request.post(
//     'http://smart.johnsonliftsltd.com:3000/api/service_userdetails/login_page_auto',
//     { json: data},
//     function (error, response, body) {
//         if (!error && response.statusCode == 200) {
//            index = index + 1;
//            recall(index);
//         }
//     }
// );
//            }else {
//              res.json({Status:"Success",Message:"No Pending Job", Data : {} ,Code:200});
//            }
//     }
// });



// router.get('/auto_send_notification',async function (req, res) {
// const dates = require('date-and-time');
// const now1  =  new Date();
// const value1 = dates.format(now1,'YYYY-MM-DDTHH:mm:ss');
// const value2 = dates.format(now1,'YYYY-MM-DD');
//    // var bd_b_total_count  =  await breakdown_managementModel.find({'JOB_STATUS': {$in : ["Not Started"]}});
//    var bd_b_mr_total_count  =  await breakdown_mr_data_managementModel.find({'JOB_STATUS': {$in : ["Not Started"]}});
//    // var lr_total_count  = []  await lr_service_managementModel.find({'JOB_STATUS': {$in : ["Not Started"]}});
//    // var pr_total_count  =  [] await part_reply_service_managementModel.find({'JOB_STATUS': {$in : ["Not Started"]}});
//    // var ad_total_count  =  [] await audit_data_managementModel.find({'JOB_STATUS': {$in : ["Not Started"]}});
//    var lr_total_count  = [];
//    var pr_total_count  =  [];
//    var ad_total_count  =  [];

//   //  if(bd_b_total_count.length !== 0){

//   //    let index = 0;
//   //    recall(index)
//   //    function recall(index){
//   //     if(index < bd_b_total_count.length){
//   //      var type = '';
//   //      if(bd_b_total_count[index].SMU_SCH_SERTYPE == 'B'){
//   //       type = 'Breakdown';
//   //      }else {
//   //        type = 'Preventive Maintenance';
//   //      }
//   // let datas = {
//   // notification_title : "New Job Alert" || "",
//   // notification_desc : ""+type+" - " + bd_b_total_count[index].SMU_SCH_JOBNO || "",
//   // user_mobile_no : bd_b_total_count[index].SMU_SCH_MECHCELL || "",
//   // date_and_time :value1 || "",
//   // read_status : 'Not Readed' || "",
//   // date_value : value2|| "",
//   // }
//   // var d1 = new Date(bd_b_total_count[index].SMU_SCH_COMPDT);
//   // var d2 = new Date();
//   // if(d1 == d2) {
//   // request.post(
//   //   'http://smart.johnsonliftsltd.com:3000/api/notification/create',
//   //   { json: datas},
//   //   function (error, response, body) {
//   //       if (!error && response.statusCode == 200) {
//   //          index = index + 1;
//   //          recall(index);
//   //       }
//   //   }
//   //  );
//   //    }
//   //     }
//   //    }
//   //  }  
//    if(bd_b_mr_total_count.length !== 0){
//          let index = 0;
//          recall(index)
//          function recall(index){
//           if(index < bd_b_mr_total_count.length){
//            var type = '';
//            if(bd_b_mr_total_count[index].JLS_SCHM_SERTYPE == 'B'){
//             type = 'BD MR';
//            }else {
//              type = 'PM MR';
//            }
//       let datas = {
//       notification_title : "New Job Alert" || "",
//       notification_desc : ""+type+" - " + bd_b_mr_total_count[index].JLS_SCHM_JOBNO || "",
//       user_mobile_no : bd_b_mr_total_count[index].JLS_SCHM_ENGR_PHONE || "",
//       date_and_time :value1 || "",
//       read_status : 'Not Readed' || "",
//       date_value : value2|| "",
//       }
//       request.post(
//         'http://smart.johnsonliftsltd.com:3000/api/notification/create',
//         { json: datas},
//         function (error, response, body) {
//             if (!error && response.statusCode == 200) {
//                index = index + 1;
//                recall(index);
//             }
//         }
//     );
//           }
//          }
//    } 
//    // if(lr_total_count.length !== 0){

//    //    let index = 0;
//    //       recall(index)
//    //       function recall(index){
//    //        if(index < lr_total_count.length){
//    //    let datas = {
//    //    notification_title : "New Job Alert" || "",
//    //    notification_desc : "LR Service - " + lr_total_count[index].SMU_SCQH_JOBNO || "",
//    //    user_mobile_no : lr_total_count[index].SMU_SEN_MOBILENO || "",
//    //    date_and_time :value1 || "",
//    //    read_status : 'Not Readed' || "",
//    //    date_value : value2|| "",
//    //    }
//    //    request.post(
//    //      'http://smart.johnsonliftsltd.com:3000/api/notification/create',
//    //      { json: datas},
//    //      function (error, response, body) {
//    //          if (!error && response.statusCode == 200) {
//    //             index = index + 1;
//    //             recall(index);
//    //          }
//    //      }
//    //  );
//    //        }
//    //       }
//    // } 
//    // if(pr_total_count.length !== 0){
//    //      let index = 0;
//    //       recall(index)
//    //       function recall(index){
//    //        if(index < pr_total_count.length){
//    //    let datas = {
//    //    notification_title : "New Job Alert" || "",
//    //    notification_desc : "Part Replacement - " + pr_total_count[index].SMU_ACK_JOBNO || "",
//    //    user_mobile_no : pr_total_count[index].SMU_ACK_MOBILENO || "",
//    //    date_and_time :value1 || "",
//    //    read_status : 'Not Readed' || "",
//    //    date_value : value2|| "",
//    //    }
//    //    request.post(
//    //      'http://smart.johnsonliftsltd.com:3000/api/notification/create',
//    //      { json: datas},
//    //      function (error, response, body) {
//    //          if (!error && response.statusCode == 200) {
//    //             index = index + 1;
//    //             recall(index);
//    //          }
//    //      }
//    //  );
//    //        }
//    //       }
//    // }
//    // if(ad_total_count.length !== 0){
//    //      let index = 0;
//    //       recall(index)
//    //       function recall(index){
//    //        if(index < pr_total_count.length){
//    //    let datas = {
//    //    notification_title : "New Job Alert" || "",
//    //    notification_desc : "Site Audit - " + pr_total_count[index].OM_OSA_JOBNO || "",
//    //    user_mobile_no : pr_total_count[index].OM_OSA_MOBILE || "",
//    //    date_and_time :value1 || "",
//    //    read_status : 'Not Readed' || "",
//    //    date_value : value2|| "",
//    //    }
//    //    request.post(
//    //      'http://smart.johnsonliftsltd.com:3000/api/notification/create',
//    //      { json: datas},
//    //      function (error, response, body) {
//    //          if (!error && response.statusCode == 200) {
//    //             index = index + 1;
//    //             recall(index);
//    //          }
//    //      }
//    //  );
//    //        }
//    //       }
//    // } 
   

// });




// router.post('/login_page_auto', function (req, res) {
//      service_user_management.findOne({user_mobile_no:req.body.user_mobile_no,user_password:req.body.user_password}, function (err, StateList) {
//             if(StateList == null){
//               res.json({Status:"Failed",Message:"Account not found", Data : {} ,Code:404});
//             }else{

// request.post(
//     'http://smart.johnsonliftsltd.com:3000/api/preventive_service_data_management/fetch_data_from_oracle_mr_breakdown',
//     { json: req.body},
//     function (error, response, body) {
//         if (!error && response.statusCode == 200) {
//         }
//     }
// );


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
//             "SELECT * from JLS_SERCALL_HDR_UPLOAD where SMU_SCH_SERTYPE in ('P','B') and NVL(SMU_SCH_DWNFLAG,'N') <> 'Y' and SMU_SCH_MECHCELL=:SMU_SCH_MECHCELL",
//             { 
//               SMU_SCH_MECHCELL:req.body.user_mobile_no
//             },
//         {autoCommit: true},
//         function (err, result) {
//     if (err) { console.error(err.message);
//           doRelease(connection);
//           return;
//      }
//      doRelease(connection);
// var ary = [];
// function doRelease(connection) {
//        connection.release(function(err) {
//          if (err) {
//           console.error(err.message);
//         }
//       }
//    );
// }
// if(result.rows.length == 0){
//  res.json({Status:"Success",Message:"User Details", Data : StateList ,Code:200});
// }else{
// for(let a = 0 ; a < result.rows.length; a++){
// var temp_data = result.rows[a];
// var results = {}
// for (var i = 0; i < result.metaData.length; ++i){
// results[result.metaData[i].name] = temp_data[i];
// }
// request.post(
//     'http://smart.johnsonliftsltd.com:3000/api/breakdown_management/create',
//     { json: results},
//     function (error, response, body) {
//         if (!error && response.statusCode == 200) {
//         }
//     }
// );
//  // ary.push(results.length);
//  if(a == result.rows.length - 1){
//     // res.json({Status:"Success",Message:"Updated", Data : ary,Code:200}); 
//     res.json({Status:"Success",Message:"User Details", Data : StateList ,Code:200});
//  }
// }
// }
//    });
// function doRelease(connection) {
//        connection.release(function(err) {
//          if (err) {
//           console.error(err.message);
//         }
//       }
//    );
// }
//     });  
//             }          
//         });
// });






// ******************************************************************************************************************************************************************************
// SERVICE UPDATE FB TOKEN
// ******************************************************************************************************************************************************************************
router.post('/mobile/update/fb_token', function (req, res) {
        service_user_management.findByIdAndUpdate(req.body._id, req.body, {new: true}, function (err, UpdatedDetails) {
            if (err)return res.json({Status:"Failed",Message:"Internal Server Error", Data:err,Code:500});
             res.json({Status:"Success",Message:"FCM Token Updated", Data : {} ,Code:200});
        });
});


// ******************************************************************************************************************************************************************************
// SERVICE LISTING REPAIRWORK ENG LIST
// ******************************************************************************************************************************************************************************
router.post('/list_repair_work_eng_brcode',async function (req, res) {
  var user_detail  =  await service_user_management.find({emp_type : "Repair Engineer",user_location : req.body.brcode});
  res.json({Status:"Success",Message:"Repair Work Eng List", Data : user_detail ,Code:200});
});

// ******************************************************************************************************************************************************************************
// SERVICE LISTING REPAIRWORK MECH LIST
// ******************************************************************************************************************************************************************************
router.post('/list_repair_work_mech_brcode',async function (req, res) {
  var user_detail  =  await service_user_management.find({emp_type : "Repair Mechanic",user_location : req.body.brcode});
  res.json({Status:"Success",Message:"Repair Work Mech List", Data : user_detail ,Code:200});
});




// ******************************************************************************************************************************************************************************
// SERVICE DELETING PREVIOUS MONTH JOBS
// ******************************************************************************************************************************************************************************
router.post('/br_pm_fetch_job_details_passed_date',async function (req, res) {
const dates = require('date-and-time');
const now1  =  new Date();
const value1 = dates.format(now1,'YYYY-MM-DDTHH:mm:ss');

        var user_detail  =  await breakdown_managementModel.find({'JOB_STATUS': {$nin : ["Job Submitted", "Job Paused"]}});
        var count = 0;
        for(let a  = 0; a < user_detail.length ; a++){
           var job_date = new Date(user_detail[a].SMU_SCH_COMPDT);
           var current_date = new Date(req.body.date);
           if(job_date < current_date){
           breakdown_managementModel.findByIdAndRemove(user_detail[a]._id, function (err, user) {
           if (err) return res.json({Status:"Failed",Message:"Internal Server Error", Data : {},Code:500});
           });
             count = count + 1;
           }
           if(a == user_detail.length - 1){
            res.json({Status:user_detail.length,Message:"Total Job Counts", Data : count ,Code:200});
           }
        }
});


router.post('/mr_br_pm_fetch_job_details_passed_date',async function (req, res) {
const dates = require('date-and-time');
const now1  =  new Date();
const value1 = dates.format(now1,'YYYY-MM-DDTHH:mm:ss');

        var user_detail  =  await breakdown_mr_data_managementModel.find({'JOB_STATUS': {$nin : ["Job Submitted", "Job Paused"]}});
        var count = 0;
        for(let a  = 0; a < user_detail.length ; a++){
           var job_date = new Date(user_detail[a].JLS_SCHM_PREP_DATE);
           var current_date = new Date(req.body.date);
           if(job_date < current_date){
          
           breakdown_mr_data_managementModel.findByIdAndRemove(user_detail[a]._id, function (err, user) {
           if (err) return res.json({Status:"Failed",Message:"Internal Server Error", Data : {},Code:500});
           // res.json({Status:"Success",Message:"User management Deleted successfully", Data : {} ,Code:200});
           });

             count = count + 1;
           }
           if(a == user_detail.length - 1){
            res.json({Status:user_detail.length,Message:"Total Job Counts", Data : count ,Code:200});
           }
        }
});
       


router.post('/lr_fetch_job_details_passed_date',async function (req, res) {
const dates = require('date-and-time');
const now1  =  new Date();
const value1 = dates.format(now1,'YYYY-MM-DDTHH:mm:ss');


        var user_detail  =  await lr_service_managementModel.find({'JOB_STATUS': {$nin : ["Job Submitted", "Job Paused"]}});
        var count = 0;
        for(let a  = 0; a < user_detail.length ; a++){
           var job_date = new Date(user_detail[a].SMU_SCQH_LRDT);
           var current_date = new Date(req.body.date);
           if(job_date < current_date){

           lr_service_managementModel.findByIdAndRemove(user_detail[a]._id, function (err, user) {
           if (err) return res.json({Status:"Failed",Message:"Internal Server Error", Data : {},Code:500});
           // res.json({Status:"Success",Message:"User management Deleted successfully", Data : {} ,Code:200});
           });

             count = count + 1;
           }
           if(a == user_detail.length - 1){
            res.json({Status:user_detail.length,Message:"Total Job Counts", Data : count ,Code:200});
           }
        }
});



router.post('/pr_fetch_job_details_passed_date',async function (req, res) {
const dates = require('date-and-time');
const now1  =  new Date();
const value1 = dates.format(now1,'YYYY-MM-DDTHH:mm:ss');

        var user_detail  =  await part_reply_service_managementModel.find({'JOB_STATUS': {$nin : ["Job Submitted", "Job Paused"]}});
        var count = 0;
        for(let a  = 0; a < user_detail.length ; a++){
           var job_date = new Date(user_detail[a].SMU_ACK_DCDT);
           var current_date = new Date(req.body.date);
           if(job_date < current_date){

           part_reply_service_managementModel.findByIdAndRemove(user_detail[a]._id, function (err, user) {
           if (err) return res.json({Status:"Failed",Message:"Internal Server Error", Data : {},Code:500});
           // res.json({Status:"Success",Message:"User management Deleted successfully", Data : {} ,Code:200});
           });
             count = count + 1;

           }
           if(a == user_detail.length - 1){
            res.json({Status:user_detail.length,Message:"Total Job Counts", Data : count ,Code:200});
           }
        }
         res.json({Status:user_detail.length,Message:"Total Job Counts", Data : user_detail ,Code:200});
});



router.post('/audit_fetch_job_details_passed_date',async function (req, res) {
const dates = require('date-and-time');
const now1  =  new Date();
const value1 = dates.format(now1,'YYYY-MM-DDTHH:mm:ss');
        var user_detail  =  await audit_data_managementModel.find({'JOB_STATUS': {$nin : ["Job Submitted", "Job Paused"]}});
        var count = 0;
        for(let a  = 0; a < user_detail.length ; a++){
           var job_date = new Date(user_detail[a].OM_OSA_AUDDATE);
           var current_date = new Date(req.body.date);
           if(job_date < current_date){
           audit_data_managementModel.findByIdAndRemove(user_detail[a]._id, function (err, user) {
           if (err) return res.json({Status:"Failed",Message:"Internal Server Error", Data : {},Code:500});
           // res.json({Status:"Success",Message:"User management Deleted successfully", Data : {} ,Code:200});
           });
             count = count + 1;
           }
           if(a == user_detail.length - 1){
            res.json({Status:user_detail.length,Message:"Total Job Counts", Data : count ,Code:200});
           }
        }
});



router.get('/view_service_count',async function (req, res) {
   var bd_total_count  =  await breakdown_managementModel.find({SMU_SCH_SERTYPE : 'B'}).count();
   var pm_total_count  =  await breakdown_managementModel.find({SMU_SCH_SERTYPE : 'P'}).count();
   var mr_bd_total_count  =  await breakdown_mr_data_managementModel.find({JLS_SCHM_SERTYPE : 'B'}).count();
   var mr_pm_total_count  =  await breakdown_mr_data_managementModel.find({JLS_SCHM_SERTYPE:'P'}).count();
   var lr_total_count  =  await lr_service_managementModel.find({}).count();
   var pr_total_count  =  await part_reply_service_managementModel.find({}).count();
   var ad_total_count  =  await audit_data_managementModel.find({}).count();
   var mr_total_count  =  await material_requestModel.find({}).count();

   
   let data = {
    bd_total_count : bd_total_count,
    pm_total_count : pm_total_count,
    mr_bd_total_count : mr_bd_total_count,
    mr_pm_total_count : mr_pm_total_count,
    lr_total_count : lr_total_count,
    pr_total_count : pr_total_count,
    ad_total_count : ad_total_count,
    mr_total_count : mr_total_count
   }

    res.json({Status:"Success",Message:"view_service_count",Data:data,Code:200});
});


router.post('/view_single_workstatus',async function (req, res) {
 
    var date = new Date(), 
    y = date.getFullYear(), 
    m = date.getMonth();
    var firstDay = new Date(y, m, 1);
    var lastDay = new Date(y, m + 1, 0);
     


    console.log(firstDay);
    console.log(lastDay);
   // Breakdown_count_details
   var bd_total_count_data  =  await breakdown_managementModel.find({SMU_SCH_MECHCELL: req.body.user_mobile_no,SMU_SCH_SERTYPE : 'P'});

   var bd_total_count  =  await breakdown_managementModel.find({SMU_SCH_MECHCELL: req.body.user_mobile_no,SMU_SCH_SERTYPE : 'B' }).count();
   var bd_upload_count  =  await breakdown_managementModel.count({SMU_SCH_MECHCELL: req.body.user_mobile_no,JOB_STATUS:'Job Submitted',SMU_SCH_SERTYPE : 'B'  });
   var bd_pending_count  =  await breakdown_managementModel.count({SMU_SCH_MECHCELL: req.body.user_mobile_no,'JOB_STATUS': {$in : ["Not Started", "Job Started"]},SMU_SCH_SERTYPE : 'B'  });
   var bd_paused_count  =  await breakdown_managementModel.count({SMU_SCH_MECHCELL: req.body.user_mobile_no,'JOB_STATUS': {$nin : ["Job Started", "Job Stopped" , "Not Started", "Job Submitted", "Job Deleted"]},SMU_SCH_SERTYPE : 'B'});

   // Preventive_count_details
   var pm_total_count  =  await breakdown_managementModel.find({SMU_SCH_MECHCELL: req.body.user_mobile_no,SMU_SCH_SERTYPE : 'P' }).count();
   var pm_upload_count  =  await breakdown_managementModel.count({SMU_SCH_MECHCELL: req.body.user_mobile_no,JOB_STATUS:'Job Submitted',SMU_SCH_SERTYPE : 'P' });
   var pm_pending_count  =  await breakdown_managementModel.count({SMU_SCH_MECHCELL: req.body.user_mobile_no,'JOB_STATUS': {$in : ["Not Started", "Job Started"]},SMU_SCH_SERTYPE : 'P' });
   var pm_paused_count  =  await breakdown_managementModel.count({SMU_SCH_MECHCELL: req.body.user_mobile_no,'JOB_STATUS': {$nin : ["Job Started", "Job Stopped" , "Not Started", "Job Submitted" , "Job Deleted"]},SMU_SCH_SERTYPE : 'P' });

   // Lr_count_details
   var lr_total_count  =  await lr_service_managementModel.find({SMU_SEN_MOBILENO: req.body.user_mobile_no }).count();
   var lr_upload_count  =  await lr_service_managementModel.count({SMU_SEN_MOBILENO: req.body.user_mobile_no,JOB_STATUS:'Job Submitted' });
   var lr_pending_count  =  await lr_service_managementModel.count({SMU_SEN_MOBILENO: req.body.user_mobile_no,'JOB_STATUS': {$in : ["Not Started", "Job Started"]} });
   var lr_paused_count  =  await lr_service_managementModel.count({SMU_SEN_MOBILENO: req.body.user_mobile_no,'JOB_STATUS': {$nin : ["Job Started", "Job Stopped" , "Not Started", "Job Submitted", "Job Deleted"]} });

   // Pr_count_details
   var pr_total_count  =  await part_reply_service_managementModel.find({SMU_ACK_MOBILENO: req.body.user_mobile_no }).count();
   var pr_upload_count  =  await part_reply_service_managementModel.count({SMU_ACK_MOBILENO: req.body.user_mobile_no,JOB_STATUS:'Job Submitted' });
   var pr_pending_count  =  await part_reply_service_managementModel.count({SMU_ACK_MOBILENO: req.body.user_mobile_no,'JOB_STATUS': {$in : ["Not Started", "Job Started"]} });
   var pr_paused_count  =  await part_reply_service_managementModel.count({SMU_ACK_MOBILENO: req.body.user_mobile_no,'JOB_STATUS': {$nin : ["Job Started", "Job Stopped" , "Not Started", "Job Submitted", "Job Deleted"]} });

 let final_data = {

                "bd_sched_job_count": bd_total_count,
                "bd_compl_job_count": bd_upload_count,
                "bd_pend_job_count": bd_pending_count,
                "bd_pause_job_count": bd_paused_count,

                "pm_sched_job_count": pm_total_count,
                "pm_compl_job_count": pm_upload_count,
                "pm_pend_job_count": pm_pending_count,
                "pm_pause_job_count": pm_paused_count,

                "lr_sched_job_count": lr_total_count,
                "lr_compl_job_count": lr_upload_count,
                "lr_pend_job_count": lr_pending_count,
                "lr_pause_job_count": lr_paused_count,

                "pr_sched_job_count": pr_total_count,
                "pr_compl_job_count": pr_upload_count,
                "pr_pend_job_count": pr_pending_count,
                "pr_pause_job_count": pr_paused_count,

                "bd_total_count_data" : bd_total_count_data

            }
 res.json({Status:"Success",Message:"view single workstatus",Data:final_data,Code:200});
});








// ******************************************************************************************************************************************************************************
// SERVICE CREATE A NEW EMP RECORD IN ORACLE - ADMIN PANEL
// ******************************************************************************************************************************************************************************
router.post('/oracel_create_emp',async function (req, res) {
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
            "OM_SM_BRCODE": ""+req.body.user_location,
            "OM_SM_LOC": ""+req.body.user_location,
            "OM_SM_EMPID": ""+req.body.user_id,
            "OM_SM_EMPNAME": ""+req.body.user_name,
            "OM_SM_MOBILE": ""+req.body.user_mobile_no,
            "OM_SM_AGENTID": 1,
            "OM_SM_STATUS": 0,
            "OM_SM_IMEI": ""+req.body.device_no
        }
      connection.execute(
            "INSERT INTO OM_SMARTATTN_MST(OM_SM_BRCODE, OM_SM_LOC, OM_SM_EMPID, OM_SM_EMPNAME, OM_SM_MOBILE, OM_SM_AGENTID, OM_SM_STATUS, OM_SM_STATUSASON, OM_SM_IMEI) VALUES (:OM_SM_BRCODE,:OM_SM_LOC,:OM_SM_EMPID,:OM_SM_EMPNAME,:OM_SM_MOBILE,:OM_SM_AGENTID,:OM_SM_STATUS,SYSDATE,:OM_SM_IMEI)",
              da, // Bind values
              { autoCommit: true}, 
        function (err, result) {
    if (err) { console.error(err.message);
          doRelease(connection);
          return;
     }
     doRelease(connection);
     res.json({Status:"Success",Message:"Request Send Successfully", Data : {},Code:200});

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
// SERVICE UPDATE EMP DETAILS IN ORACLE - ADMIN PANEL
// ******************************************************************************************************************************************************************************
router.post('/oracel_update_emp',async function (req, res) {
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
            "OM_SM_LOC": ""+req.body.user_location,
            "OM_SM_EMPID": ""+req.body.user_id,
            "OM_SM_EMPNAME": ""+req.body.user_name,
            "OM_SM_MOBILE": ""+req.body.user_mobile_no,
            "OM_SM_STATUS":""+req.body.stauts,
            "OM_SM_IMEI": ""+req.body.device_no
        }
      connection.execute(
                 "UPDATE OM_SMARTATTN_MST set  OM_SM_LOC=:OM_SM_LOC,  OM_SM_EMPNAME=:OM_SM_EMPNAME, OM_SM_MOBILE=:OM_SM_MOBILE, OM_SM_STATUS=:OM_SM_STATUS, OM_SM_STATUSASON=SYSDATE, OM_SM_IMEI=:OM_SM_IMEI WHERE  OM_SM_EMPID=:OM_SM_EMPID",
              da, // Bind values
              { autoCommit: true}, 
        function (err, result) {
    if (err) { console.error(err.message);
          doRelease(connection);
          return;
     }
     doRelease(connection);
     res.json({Status:"Success",Message:"Request Send Successfully", Data : {},Code:200});
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
// SERVICE USER DETAILS EDIT - ADMIN PANEL
// ******************************************************************************************************************************************************************************
router.post('/edit', function (req, res) {
        service_user_management.findByIdAndUpdate(req.body._id, req.body, {new: true}, function (err, UpdatedDetails) {
            if (err)return res.json({Status:"Failed",Message:"Internal Server Error", Data:err,Code:500});
             res.json({Status:"Success",Message:"User management Updated", Data : UpdatedDetails ,Code:200});
        });
});



// ******************************************************************************************************************************************************************************
// SERVICE CHECK DUPLICATE JOB DETAILS AND REMOVE
// ******************************************************************************************************************************************************************************
router.get('/check_duplicate_job_pm_br',async function (req, res) {
var job_details_two  =  await breakdown_managementModel.find({}).skip(50000);

var index = 0; 
recall(index,job_details_two);
async function recall(index,job_details_two){ 
     if(index < job_details_two.length){
        breakdown_managementModel.find({SMU_SCH_COMPNO:job_details_two[index].SMU_SCH_COMPNO},async function (err, StateList) {
         if(StateList > 1){
          breakdown_managementModel.findByIdAndRemove(job_details_two[index]._id, function (err, user) {
          if (err) return res.json({Status:"Failed",Message:"Internal Server Error", Data : {},Code:500});
          });
         }
         index = index + 1;

         recall(index,job_details_two);
        }).count();       
      if(index == job_details_two.length - 1){
        res.json({Status:"Success",Message:"User management Updated", Data : {} ,Code:200});
      }
    }
}
});





// ******************************************************************************************************************************************************************************
// SERVICE CHECK DUPLICATE JOB DETAILS AND REMOVE FETCH BY JOB No
// ******************************************************************************************************************************************************************************
router.post('/check_duplicate_job_pm_br_with_job_no',async function (req, res) {
var job_details_two  =  await breakdown_managementModel.find({SMU_SCH_JOBNO:req.body.job_id});
var index = 0; 
recall(index,job_details_two);
async function recall(index,job_details_two){ 
     if(index < job_details_two.length){
        breakdown_managementModel.find({SMU_SCH_COMPNO:job_details_two[index].SMU_SCH_COMPNO},async function (err, StateList) {
         if(StateList > 1){
          breakdown_managementModel.findByIdAndRemove(job_details_two[index]._id, function (err, user) {
          if (err) return res.json({Status:"Failed",Message:"Internal Server Error", Data : {},Code:500});
          });
         }
         index = index + 1;

         recall(index,job_details_two);
        }).count();       
      if(index == job_details_two.length - 1){
        res.json({Status:"Success",Message:"User management Updated", Data : {} ,Code:200});
      }
    }
}
});






// ******************************************************************************************************************************************************************************
// SERVICE BREAKDOWN SUBMIT BY SCHEDULE 
// ******************************************************************************************************************************************************************************
router.get('/breakdown_data_submit_test_2_resubmit',async function (req, res) {
var service_tab_submit_data_br_Model = require('./../models/service_tab_submit_data_br_Model');
var submitted_data  =  await service_tab_submit_data_br_Model.findOne({"upload_status" : "N", "serv_type" : "BREAKDOWN"});
if(submitted_data == null){
} else {
req.body = submitted_data.data[0];
console.log("******************* BREAKDOWN AUTO SUBMITTED INSERTING");
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
call_value();

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


async function call_value(){

console.log("******************* Request In (BreakDown)");

var service_submitted_valueModel = require('./../models/service_submitted_valueModel');
let a = {
"user_id" : req.body.user_mobile_no,
"job_id" : req.body.job_id,
"type" : "BreakDown Service",
"date" : new Date(),
"datas" : [req.body],
}   
var submitted = await service_submitted_valueModel.create(a);
const dates = require('date-and-time');
const now1  =  new Date();
const value1 = dates.format(now1,'YYYY-MM-DDTHH:mm:ss');
request.post(
'http://smart.johnsonliftsltd.com:3000/api/breakdown_data_management/create',
{ json: req.body},
function (error, response, body) {
if (!error && response.statusCode == 200) {
}
}
);
var job_details_two  =  await breakdown_managementModel.findOne({SMU_SCH_MECHCELL: req.body.user_mobile_no,SMU_SCH_JOBNO:req.body.job_id,SMU_SCH_SERTYPE:req.body.SMU_SCH_SERTYPE,SMU_SCH_COMPNO:req.body.SMU_SCH_COMPNO});
var job_details = job_details_two;
if(job_details_two.JOB_START_TIME == ''){
job_details_two.JOB_START_TIME = value1; 
}
else {
let now1  =  new Date(job_details_two.JOB_START_TIME);
let value1 = dates.format(now1,'YYYY-MM-DDTHH:mm:ss');
job_details_two.JOB_START_TIME = value1; 
}
if(job_details_two.JOB_END_TIME == '') {
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
end_date = ""+myArray2[2]+"-"+month_list[+myArray2[1]]+"-"+myArray2[0];
var str = ""+req.body.feedback_details.substring(1);
str =  str.slice(0, -1);
var final_text = '';
var  myArray = str.split(",");
oracledb.getConnection({
user: "JLSMART",
password: "JLSMART",
connectString: "(DESCRIPTION =(ADDRESS = (PROTOCOL = TCP)(HOST = 192.168.1.112)(PORT = 1521))(CONNECT_DATA =(SID = jlpl)))"
}, function(err, connection) {
if (err) {
return;
}
connection.execute(
"select * from COM_ACTIVITY_MST where CAM_ATY_STATUS = 'A' and CAM_ATY_ATTRIBUTE in (:type,'B')",
// "select * from FEEDBACK_DETAILS",
{type:req.body.job_id[0]},
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
for(let a = 0 ; a < result.rows.length; a++){
var temp_data = result.rows[a];
var results = {}
for (var i = 0; i < result.metaData.length; ++i){
results[result.metaData[i].name] = temp_data[i];
}
ary.push(results);
if(a == result.rows.length - 1){
insert_feedback(ary,job_details,req,myArray);
} 
} 
});  
}); 



////////Stage 2///////////////
function insert_feedback(ary,job_details,req,myArray){

console.log("******************* INSERT FEEDBACK");


for(let c = 0 ; c < ary.length ; c++){
for(let d = 0 ; d < myArray.length ; d++){
if(ary[c].CAM_ATY_DESC == myArray[d]){
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
"JLS_SCHF_COMPNO": ""+req.body.SMU_SCH_COMPNO,
"JLS_SCHF_JOBNO": ""+job_details.SMU_SCH_JOBNO,
"JLS_SCHF_SERTYPE": "B",
"JLS_SCHF_CHKLISTTYPE": "B",
"JLS_SCHF_PARCODE": ""+ary[c].CAM_ATY_PCODE,
"JLS_SCHF_ACTCODE": ""+ary[c].CAM_ATY_CODE,
"JLS_SCHF_FDBK_RMRKS": ""+req.body.feedback_remark_text,
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

let a = {
"job_no" : req.body.job_id || '',
"service_type" : "Service "+""+req.body.SMU_SCH_COMPNO,
"activity" : "BreakDown",
"follow_detail":"JLS_SERCALLHDR_FEEDBK",
"url":"/breakdown_data_submit_test_2",
"date_time" : new Date(),
"error_detail": [err.toString()],
"data" : [{req:req.body,req_2:da}],
"user_no" : req.body.user_mobile_no || ''
}   
var submitted = await error_log_oracelModel.create(a);
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
}
}
if(c == ary.length - 1){

console.log("******************* Feedback List inserted");

////Mr check status/////
if(""+req.body.mr_status.toUpperCase().substring(0, 1) == 'Y'){
console.log("******************* MR RISED *****************");
risi_mr_eng(job_details,req);
} else {
console.log("******************* MR NOT RISED *****************");    
update_work_time_mr_tag(job_details,req)
}
}
}
}



//////// Stage 3 - (1) ///////////////
function risi_mr_eng(job_details,req){

console.log("******************* MR ENG INSERT");

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
JLS_SCHM_COMPNO :  ""+req.body.SMU_SCH_COMPNO,
JLS_SCHM_JOBNO : ""+job_details.SMU_SCH_JOBNO,
JLS_SCHM_SERTYPE : "B",
JLS_SCHM_PREP_DATE : "",//sysdate
JLS_SCHM_VAN_ID : ""+job_details.SMU_SCH_VANID,
JLS_SCHM_STATUS : "NS",
JLS_SCHM_ORCL_STATUS : "Y",
JLS_SCHM_ENGR_PHONE : ""+job_details.SMU_SCH_SUPCELLNO,
JLS_SCHM_ENGR_FLAG : "N",
JLS_SCHM_ERRDESC : "",
JLS_SCHM_AGENT_NAME : ""+job_details.SMU_SCH_CUSNAME,
JLS_SCHM_CUSTOMER_NAME : ""+job_details.SMU_SCH_CUSNAME,
JLS_SCHM_DWNFLAG : "N",
JLS_SCHM_BRCODE : ""+job_details.SMU_SCH_BRCODE,
JLS_SCHM_INSERTBY : "TAB_MOBILE"



}
connection.execute(
"INSERT INTO JLS_SERCALL_HDR_MR VALUES (:JLS_SCHM_COMPNO, :JLS_SCHM_JOBNO, :JLS_SCHM_SERTYPE, :JLS_SCHM_PREP_DATE, :JLS_SCHM_VAN_ID, :JLS_SCHM_STATUS, :JLS_SCHM_ORCL_STATUS, :JLS_SCHM_ENGR_PHONE, :JLS_SCHM_ENGR_FLAG, :JLS_SCHM_ERRDESC, :JLS_SCHM_AGENT_NAME, :JLS_SCHM_CUSTOMER_NAME, :JLS_SCHM_DWNFLAG, :JLS_SCHM_BRCODE, :JLS_SCHM_INSERTBY )",
das, // Bind values
{ autoCommit: true}, 
async  function (err, result) {
if (err) { console.error(err.message);

let a = {
"job_no" : req.body.job_id || '',
"service_type" : "Service "+""+req.body.SMU_SCH_COMPNO,
"activity" : "BreakDown",
"follow_detail":"JLS_SERCALL_HDR_MR",
"url":"/breakdown_data_submit_test_2",
"date_time" : new Date(),
"error_detail": [err.toString()],
"data" : [{req:req.body,req_2:das}],
"user_no" : req.body.user_mobile_no || ''
}   
var submitted = await error_log_oracelModel.create(a);
doRelease(connection);
return;
}
doRelease(connection);
insert_mr_details(job_details,req);
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


//////// Stage 4  ///////////////
function insert_mr_details(job_details,req){  

console.log("******************* MR DETAILS INSERT");


if(req.body.mr_1 !== "" ){
mrvalue(1,req.body.mr_1);
}
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
update_work_time_mr_tag(job_details,req);
function mrvalue(key,value){
value = ""+value;
if(value == ''){
}else if(value == 'undefined'){
}else{
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
"JLS_SCDM_SERTYPE" : "B",
"JLS_SCDM_SLNO": key,
"JLS_SCDM_DESC": ""+value,
"JLS_SCDM_MR_QTY": 1,
}
connection.execute(
"INSERT INTO JLS_SERCALL_DTL_MR VALUES (:JLS_SCDM_COMPNO, :JLS_SCDM_JOBNO, :JLS_SCDM_SERTYPE, :JLS_SCDM_SLNO, :JLS_SCDM_DESC, :JLS_SCDM_MR_QTY)",
dass, // Bind values
{ autoCommit: true}, 
async  function (err, result) {
if (err) { console.error(err.message);
let a = {
"job_no" : req.body.job_id || '',
"service_type" : "Service "+""+job_details.SMU_SCH_COMPNO,
"activity" : "BreakDown",
"follow_detail":"JLS_SERCALL_DTL_MR",
"url":"/breakdown_data_submit_test_2",
"date_time" : new Date(),
"error_detail": [err.toString()],
"data" : [{req:req.body,req_2:dass}],
"user_no" : req.body.user_mobile_no || ''
}   
var submitted = await error_log_oracelModel.create(a);
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
}


//////// Stage 5  ///////////////
function update_work_time_mr_tag(job_details,req){

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
"JLS_SCH_COMPNO": ""+req.body.SMU_SCH_COMPNO,
"JLS_SCH_JOBNO": ""+job_details.SMU_SCH_JOBNO,
"JLS_SCH_SERTYPE" : "B",
"JLS_SCH_JOBSTARTTIME": ""+start_date+" "+start_time,
"JLS_SCH_JOBENDTIME": ""+end_date+" "+end_time,
"JLS_SCH_COMPSTATUS": ""+req.body.breakdown_service,
"JLS_SCH_TYP_BRKDWN": ""+req.body.bd_details,
"JLS_SCH_FEEDBACK" : ""+req.body.feedback_remark_text,
"JLS_SCH_REMARKS": ""+req.body.feedback_remark_text,
"JLS_SCH_MRTAG" : ""+req.body.mr_status.toUpperCase().substring(0, 1),

}
connection.execute(
"INSERT INTO JLS_SERCALL_HDR_DNLOAD VALUES (:JLS_SCH_COMPNO, :JLS_SCH_JOBNO, :JLS_SCH_SERTYPE, to_date(:JLS_SCH_JOBSTARTTIME, 'DD/MM/YYYY HH24:MI:SS'), to_date(:JLS_SCH_JOBENDTIME, 'DD/MM/YYYY HH24:MI:SS'), :JLS_SCH_COMPSTATUS, :JLS_SCH_TYP_BRKDWN, :JLS_SCH_FEEDBACK, :JLS_SCH_REMARKS, :JLS_SCH_MRTAG)",
dass, // Bind values
{ autoCommit: true}, 
async    function (err, result) {
if (err) { console.error(err.message);

let a = {
"job_no" : req.body.job_id || '',
"service_type" : "Service "+""+req.body.SMU_SCH_COMPNO,
"activity" : "BreakDown",
"follow_detail":"JLS_SERCALL_HDR_DNLOAD",
"url":"/breakdown_data_submit_test_2",
"date_time" : new Date(),
"error_detail": [err.toString()],
"data" : [{req:req.body,req_2:dass}],
"user_no" : req.body.user_mobile_no || ''
}   
var submitted = await error_log_oracelModel.create(a);
doRelease(connection);
return;
}
doRelease(connection);
res.json({Status:"Success",Message:"breakdown data submit successfully", Data : {} ,Code:200});
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
}
});



// ******************************************************************************************************************************************************************************
// SERVICE SUBMIT DATA STORE IN MONGO
// ******************************************************************************************************************************************************************************
router.post('/breakdown_data_submit_test_2',async function (req, res) {
if(req.body.SMU_SCH_COMPNO == null || req.body.SMU_SCH_COMPNO == '' || req.body.SMU_SCH_COMPNO == undefined){
      res.json({Status:"Failed",Message:"complaint no not set properly", Data : {} ,Code:404}); 
      console.log("******************** Error *******************");
}
else if(req.body.SMU_SCH_SERTYPE == null || req.body.SMU_SCH_SERTYPE == '' || req.body.SMU_SCH_SERTYPE == undefined){
      res.json({Status:"Failed",Message:"Service Type not set properly", Data : {} ,Code:404}); 
      console.log("******************** Error *******************");
}
else if(req.body.bd_details == null || req.body.bd_details == '' || req.body.bd_details == undefined){
      res.json({Status:"Failed",Message:"bd details not set properly", Data : {} ,Code:404}); 
      console.log("******************** Error *******************");
}
else if(req.body.breakdown_service == null || req.body.breakdown_service == '' || req.body.breakdown_service == undefined){
      res.json({Status:"Failed",Message:"breakdown service not set properly", Data : {} ,Code:404}); 
      console.log("******************** Error *******************");
}
else if(req.body.customer_acknowledgemnet == null || req.body.customer_acknowledgemnet == '' || req.body.customer_acknowledgemnet == undefined){
      res.json({Status:"Failed",Message:"customer acknowledgemnet not set properly", Data : {} ,Code:404});
      console.log("******************** Error *******************"); 
}
else if(req.body.customer_name == null || req.body.customer_name == '' || req.body.customer_name == undefined){
      res.json({Status:"Failed",Message:"customer name not set properly", Data : {} ,Code:404}); 
      console.log("******************** Error *******************");
}
else if(req.body.customer_number == null || req.body.customer_number == '' || req.body.customer_number == undefined){
      res.json({Status:"Failed",Message:"customer number not set properly", Data : {} ,Code:404}); 
      console.log("******************** Error *******************");
}
else if(req.body.feedback_details == null || req.body.feedback_details == '' || req.body.feedback_details == undefined){
      res.json({Status:"Failed",Message:"feedback details not set properly", Data : {} ,Code:404}); 
      console.log("******************** Error *******************");
}
else if(req.body.feedback_remark_text == null || req.body.feedback_remark_text == '' || req.body.feedback_remark_text == undefined){
      res.json({Status:"Failed",Message:"feedback remark text not set properly", Data : {} ,Code:404}); 
      console.log("******************** Error *******************");
}
else if(req.body.mr_status == null || req.body.mr_status == '' || req.body.mr_status == undefined){
      res.json({Status:"Failed",Message:"mr status not set properly", Data : {} ,Code:404}); 
      console.log("******************** Error *******************");
}
else if(req.body.mr_status == "yes"){
if(req.body.mr_1 == null || req.body.mr_1 == '' || req.body.mr_1 == undefined){
      res.json({Status:"Failed",Message:"mr 1 not set properly", Data : {} ,Code:404}); 
      console.log("******************** Error *******************");
} else {
    start_inserting(req);
}
} else {
    start_inserting(req);
}


async function start_inserting(req) {
 
var service_tab_submit_data_br_Model = require('./../models/service_tab_submit_data_br_Model');
console.log("******************* BREAKDOWN TEMP DATA STORE");
    const dates = require('date-and-time');
    const now1  =  new Date();
    const value1 = dates.format(now1,'YYYY-MM-DDTHH:mm:ss');

var datas  =  await service_tab_submit_data_br_Model.findOne({job_id: req.body.job_id, comp_id:req.body.SMU_SCH_COMPNO, "serv_type" : "BREAKDOWN"});


if(datas == null){
var job_details_two  =  await breakdown_managementModel.findOne({SMU_SCH_MECHCELL: req.body.user_mobile_no,SMU_SCH_JOBNO:req.body.job_id,SMU_SCH_COMPNO:req.body.SMU_SCH_COMPNO});

if(job_details_two == undefined){
    console.log({SMU_SCH_MECHCELL: req.body.user_mobile_no,SMU_SCH_JOBNO:req.body.job_id,SMU_SCH_COMPNO:req.body.SMU_SCH_COMPNO});
}
console.log(job_details_two,req.body);
if(job_details_two == undefined){
    console.log("Error 4085",req.body)
}

let a = {
"user_mobile_number" : req.body.user_mobile_no,
"upload_status" : "N",
"submitted_date_sys" :  new Date(),
"serv_type" : "BREAKDOWN",
"job_id" : req.body.job_id,
"comp_id" : req.body.SMU_SCH_COMPNO,
"data": [req.body],

}   
var submitted_one = await service_tab_submit_data_br_Model.create(a);

  let datas = {
            JOB_END_TIME : ""+value1,
            JOB_STATUS : "Job Submitted",
            SMU_SCH_CHKLIST : ""+req.body.mr_status.toUpperCase(),
            }
        breakdown_managementModel.findByIdAndUpdate(job_details_two._id, datas, {new: true}, function (err, UpdatedDetails) {
        if (err) return res.json({Status:"Failed",Message:"Internal Server Error", Data : {},Code:500});
        res.json({Status:"Success",Message:"breakdown data submit successfully", Data : {} ,Code:200}); 
   });




} else {
   // res.json({Status:"Failed",Message:"Already Data submitted. Contact Admin", Data : {} ,Code:404}); 
   console.log(job_details_two);

   let datas = {
            JOB_END_TIME : ""+value1,
            JOB_STATUS : "Job Submitted",
            SMU_SCH_CHKLIST : ""+req.body.mr_status.toUpperCase(),
            }
        breakdown_managementModel.findByIdAndUpdate(job_details_two._id, datas, {new: true}, function (err, UpdatedDetails) {
        if (err) return res.json({Status:"Failed",Message:"Internal Server Error", Data : {},Code:500});
        res.json({Status:"Success",Message:"Already breakdown data submit successfully", Data : {} ,Code:200}); 
   });
}


}


});   



// ******************************************************************************************************************************************************************************
// SERVICE BR UPDATE STATUS 
// ******************************************************************************************************************************************************************************
router.post('/job_work_status_update',async function (req, res) {
const dates = require('date-and-time');
const now1  =  new Date();
const value1 = dates.format(now1,'YYYY-MM-DDTHH:mm:ss');
var statuss = 0;
var job_details  =  await breakdown_managementModel.findOne({SMU_SCH_MECHCELL: req.body.user_mobile_no,SMU_SCH_JOBNO:req.body.job_id,SMU_SCH_COMPNO:req.body.SMU_SCH_COMPNO,SMU_SCH_SERTYPE:req.body.SMU_SCH_SERTYPE});
if(req.body.Status == 'Job Started'){
let da = {
JOB_STATUS : req.body.Status,
JOB_VIEW_STATUS : "Viewed",
JOB_START_TIME : ""+value1,
JOB_END_TIME : ""+value1,
}
statuss = 1;
breakdown_managementModel.findByIdAndUpdate(job_details._id, da, {new: true}, function (err, UpdatedDetails) {
if (err) return res.json({Status:"Failed",Message:"Internal Server Error", Data : {},Code:500});
res.json({Status:"Success",Message:"Update successfully", Data : {} ,Code:200});
}); 

var location_tracking_job_wiseModel = require('./../models/location_tracking_job_wiseModel');
var find_location = await location_tracking_job_wiseModel.findOne({"job_no" : req.body.job_id,
"complaint_no" : req.body.SMU_SCH_COMPNO,"loc_lat" : req.body.JOB_START_LAT,
"loc_long" : req.body.JOB_START_LONG,"remarks" : "Start Job"});
// console.log(find_location);
if(find_location == null){
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
}
 
}
else if(req.body.Status == 'Job Stopped'){
let da = {
JOB_STATUS : req.body.Status,
JOB_END_TIME : ""+value1,

}
statuss = 4;
breakdown_managementModel.findByIdAndUpdate(job_details._id, da, {new: true}, function (err, UpdatedDetails) {
if (err) return res.json({Status:"Failed",Message:"Internal Server Error", Data : {},Code:500});
res.json({Status:"Success",Message:"Update successfully", Data : {} ,Code:200});
}); 


var location_tracking_job_wiseModel = require('./../models/location_tracking_job_wiseModel');
var find_location = await location_tracking_job_wiseModel.findOne({"job_no" : req.body.job_id,
"complaint_no" : req.body.SMU_SCH_COMPNO,"loc_lat" : req.body.JOB_START_LAT,
"loc_long" : req.body.JOB_START_LONG,"remarks" : "Job Stopped"});
// console.log(find_location);
if(find_location == null){
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
}

}else if(req.body.Status == 'Job Paused'){
let da = {
JOB_STATUS : req.body.Status,
LAST_UPDATED_TIME : ""+value1,
}
statuss = 2;
breakdown_managementModel.findByIdAndUpdate(job_details._id, da, {new: true}, function (err, UpdatedDetails) {
if (err) return res.json({Status:"Failed",Message:"Internal Server Error", Data : {},Code:500});
res.json({Status:"Success",Message:"Update successfully", Data : {} ,Code:200});
}); 


var location_tracking_job_wiseModel = require('./../models/location_tracking_job_wiseModel');
var find_location = await location_tracking_job_wiseModel.findOne({"job_no" : req.body.job_id,
"complaint_no" : req.body.SMU_SCH_COMPNO,"loc_lat" : req.body.JOB_START_LAT,
"loc_long" : req.body.JOB_START_LONG,"remarks" : "Job Paused"});
// console.log(find_location);
if(find_location == null){
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

}  

else if(req.body.Status == 'Job Resume'){
let da = {
JOB_STATUS : req.body.Status,
LAST_UPDATED_TIME : ""+value1,

}
statuss = 3;
breakdown_managementModel.findByIdAndUpdate(job_details._id, da, {new: true}, function (err, UpdatedDetails) {
if (err) return res.json({Status:"Failed",Message:"Internal Server Error", Data : {},Code:500});
res.json({Status:"Success",Message:"Update successfully", Data : {} ,Code:200});
}); 

var location_tracking_job_wiseModel = require('./../models/location_tracking_job_wiseModel');
var find_location = await location_tracking_job_wiseModel.findOne({"job_no" : req.body.job_id,
"complaint_no" : req.body.SMU_SCH_COMPNO,"loc_lat" : req.body.JOB_START_LAT,
"loc_long" : req.body.JOB_START_LONG,"remarks" : "Start Resume"});
// console.log(find_location);
if(find_location == null){
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

////////////////////////BR UPDATE JOB STATUS////////////////////




//////////////////////BR CHECK STATUS/////////////////////////
// ******************************************************************************************************************************************************************************
// SERVICE BR CHECK CURRENT STATUS
// ******************************************************************************************************************************************************************************
router.post('/check_work_status',async function (req, res) {
var job_details  =  await breakdown_managementModel.findOne({SMU_SCH_MECHCELL: req.body.user_mobile_no,SMU_SCH_JOBNO:req.body.job_id,SMU_SCH_COMPNO:req.body.SMU_SCH_COMPNO,SMU_SCH_SERTYPE:req.body.SMU_SCH_SERTYPE});
res.json({Status:"Success", Message:job_details.JOB_STATUS, time:job_details.JOB_START_TIME,  Data : {} ,Code:200});
});

//////////////////////BR CHECK STATUS/////////////////////////





module.exports = router;
