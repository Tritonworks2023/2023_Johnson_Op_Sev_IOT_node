var express = require('express');
var router = express.Router();
var bodyParser = require('body-parser');
router.use(bodyParser.urlencoded({ extended: false }));
router.use(bodyParser.json());
var user_management = require('./../models/user_managementModel');
var oracledb = require('oracledb');
var request = require("request");



var breakdown_managementModel = require('./../models/breakdown_managementModel');
var breakdown_mr_data_managementModel = require('./../models/breakdown_mr_data_managementModel');
var lr_service_managementModel = require('./../models/lr_service_managementModel');
var part_reply_service_managementModel = require('./../models/part_reply_service_managementModel');
var audit_data_managementModel = require('./../models/audit_data_managementModel');
var material_requestModel = require('./../models/material_requestModel');


var notificationModel = require('./../models/notificationModel');



var dates = require('date-and-time');
const now1  =  new Date();
const value1 = dates.format(now1,'YYYY-MM-DDTHH:mm:ss');
const value2 = dates.format(now1,'YYYY-MM-DD');


// router.get('/breakdown_preventive/create',async function(req, res) {
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
//             "SELECT * from JLS_SERCALL_HDR_UPLOAD where SMU_SCH_SERTYPE in ('P','B') and  NVL(SMU_SCH_DWNFLAG,'N') <> 'Y'",
//             { },
//         {autoCommit: true},
//      async  function (err, result) {
//     if (err) { console.error(err.message);
//           doRelease(connection);
//           return;
//      }
//       doRelease(connection);
// var ary = [];
// console.log("BD PR --------------------------------------- ",result.rows.length);
// if(result.rows.length == 0){
//  res.json({Status:"Success",Message:"User Details", Data : {} ,Code:200});
// } else {
// for(let a = 0 ; a < result.rows.length; a++){
// var temp_data = result.rows[a];
// var results = {}
// for (var i = 0; i < result.metaData.length; ++i){
// results[result.metaData[i].name] = temp_data[i];
// }
// ary.push(results);   
// if(a == result.rows.length - 1){
// var value = ary[0];
// var user_detail  =  await breakdown_managementModel.findOne({SMU_SCH_COMPNO : value.SMU_SCH_COMPNO});
// console.log(user_detail);
// if(user_detail == null){
//   try{
//         await breakdown_managementModel.create({
// SMU_SCH_COMPNO : value.SMU_SCH_COMPNO,
// SMU_SCH_COMPDT : value.SMU_SCH_COMPDT,
// SMU_SCH_JOBNO : value.SMU_SCH_JOBNO,
// SMU_SCH_BRCODE : value.SMU_SCH_BRCODE,
// SMU_SCH_REPORTBY : value.SMU_SCH_REPORTBY,
// SMU_SCH_REPORTCELL : value.SMU_SCH_REPORTCELL,
// SMU_SCH_BRKDOWNTYPE : value.SMU_SCH_BRKDOWNTYPE,
// SMU_SCH_BRKDOWNDESC : value.SMU_SCH_BRKDOWNDESC,
// SMU_SCH_ROUTECODE : value.SMU_SCH_ROUTECODE,
// SMU_SCH_MECHANIC : value.SMU_SCH_MECHANIC,
// SMU_SCH_DEPUTEDDT : value.SMU_SCH_DEPUTEDDT,
// SMU_SCH_CRTDT  : value.SMU_SCH_CRTDT,
// SMU_SCH_STATUS : value.SMU_SCH_STATUS,
// SMU_SCH_EMPCODE : value.SMU_SCH_EMPCODE,
// SMU_SCH_SERTYPE : value.SMU_SCH_SERTYPE,
// SMU_SCH_CONTNO : value.SMU_SCH_CONTNO, 
// SMU_SCH_DWNFLAG : value.SMU_SCH_DWNFLAG,
// SMU_SCH_CANCFLAG : value.SMU_SCH_CANCFLAG,
// SMU_SCH_DWNFLAGDATE : value.SMU_SCH_DWNFLAGDATE,
// SMU_SCH_CUSCODE : value.SMU_SCH_CUSCODE,
// SMU_SCH_CUSNAME : value.SMU_SCH_CUSNAME, 
// SMU_SCH_CUSADD1  : value.SMU_SCH_CUSADD1,
// SMU_SCH_CUSADD2  : value.SMU_SCH_CUSADD2,
// SMU_SCH_CUSADD3 : value.SMU_SCH_CUSADD3,
// SMU_SCH_CUSADD4  : value.SMU_SCH_CUSADD4,
// SMU_SCH_CUSPIN : value.SMU_SCH_CUSPIN,
// SMU_SCH_MECHCELL : value.SMU_SCH_MECHCELL,
// SMU_SCH_AMCTYPE  : value.SMU_SCH_AMCTYPE,
// SMU_SCH_AMCTODT : value.SMU_SCH_AMCTODT,
// SMU_SCH_VANID  : value.SMU_SCH_VANID,
// SSM_SCH_APPTO : value.SSM_SCH_APPTO,
// SMU_SCH_SUPCELLNO : value.SMU_SCH_SUPCELLNO,
// SMU_SCH_JOBCURSTATUS : value.SMU_SCH_JOBCURSTATUS,
// SMU_SCH_MODDT : value.SMU_SCH_MODDT,
// SMU_SCH_ERRDESC : value.SMU_SCH_ERRDESC,
// SMU_SCH_DOORTYPE : value.SMU_SCH_DOORTYPE,
// SMU_SCH_CHKLIST : "NO",
// JOB_STATUS : 'Not Started',
// JOB_VIEW_STATUS : 'Not Viewed',
// LAST_UPDATED_TIME : ""+new Date(),
// JOB_START_TIME : "",
// JOB_END_TIME : "",
// JOB_LOCATION : "",
// JOB_START_LAT : "",
// JOB_START_LONG : "",
//         }, 
//         function (err, user) {
// console.log("Mongo Db Insert",user.SMU_SCH_COMPNO);

// // Notification Send Process //

// var type = '';
// if(user.SMU_SCH_SERTYPE == 'B'){
//         type = 'Breakdown Service';
//        } else {
//          type = 'Preventive Maintenance';
//        }
//  let datas = {
//   notification_title : "New Job Alert" || "",
//   notification_desc : ""+type+" - " +user.SMU_SCH_JOBNO || "",
//   user_mobile_no : user.SMU_SCH_MECHCELL || "",
//   date_and_time :value1 || "",
//   read_status : 'Not Readed' || "",
//   date_value : value2|| "",
//   }
//    request.post(
//     'http://smart.johnsonliftsltd.com:3000/api/notification/create',
//     { json: datas},
//     function (error, response, body) {
//         if (!error && response.statusCode == 200) {
//         }
//     }
//    );
// // Notification Send Process //

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
//             "UPDATE JLS_SERCALL_HDR_UPLOAD set SMU_SCH_DWNFLAG='Y', SMU_SCH_DWNFLAGDATE=:SMU_SCH_DWNFLAGDATE WHERE SMU_SCH_COMPNO=:SMU_SCH_COMPNO",
//             {
//                 SMU_SCH_DWNFLAGDATE : new Date(),
//                 SMU_SCH_COMPNO : user.SMU_SCH_COMPNO,
//             },
//         {autoCommit: true},
//         function (err, result_one) {
//     if (err) { console.error(err.message);
//           doRelease(connection);
//           return;
//      }
//      console.log("Oracle Update",result_one);
//      console.log("New Data",result_one);
//      doRelease(connection); 
//      res.json({Status:"Success",Message:"Added successfully", Data : {} ,Code:200}); 
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
// }
// catch(e){
//       res.json({Status:"Failed",Message:"Internal Server Error", Data : {},Code:500});
// }
// } else {


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
//             "UPDATE JLS_SERCALL_HDR_UPLOAD set SMU_SCH_DWNFLAG='Y', SMU_SCH_DWNFLAGDATE=:SMU_SCH_DWNFLAGDATE WHERE SMU_SCH_COMPNO=:SMU_SCH_COMPNO",
//             {
//                 SMU_SCH_DWNFLAGDATE : new Date(),
//                 SMU_SCH_COMPNO : value.SMU_SCH_COMPNO,
//             },
//         {autoCommit: true},
//         function (err, result_one) {
//     if (err) { console.error(err.message);
//           doRelease(connection);
//           return;
//      }
//      console.log("Oracle Update",result_one);
//      console.log("Old Data",result_one);
//      doRelease(connection); 
//      res.json({Status:"Success",Message:"Updated", Data : {},Code:200}); 
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
// }
// }
// }
// }
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
// });





router.get('/breakdown_preventive_mr/create',async function(req, res) {
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
console.log("MR --------------------------------------- ",result.rows.length);
for(let a = 0 ; a < result.rows.length; a++){
var temp_data = result.rows[a];
var results = {}
for (var i = 0; i < result.metaData.length; ++i){
results[result.metaData[i].name] = temp_data[i];
}
ary.push(results);   
if(a == result.rows.length - 1){

  var value = ary[0];
  var user_detail  =  await breakdown_mr_data_managementModel.findOne({JLS_SCHM_COMPNO:value.JLS_SCHM_COMPNO});
  if(user_detail == null){
  try{
        await breakdown_mr_data_managementModel.create({
  JLS_SCHM_COMPNO :  value.JLS_SCHM_COMPNO,
  JLS_SCHM_JOBNO :  value.JLS_SCHM_JOBNO,
  JLS_SCHM_BRCODE : value.JLS_SCHM_BRCODE,
  JLS_SCHM_INSERTBY : value.JLS_SCHM_INSERTBY,
  JLS_SCHM_SERTYPE : value.JLS_SCHM_SERTYPE,
  JLS_SCHM_PREP_DATE : value.JLS_SCHM_PREP_DATE,
  JLS_SCHM_VAN_ID :  value.JLS_SCHM_VAN_ID,
  JLS_SCHM_STATUS : 'Y',
  JLS_SCHM_ORCL_STATUS : value.JLS_SCHM_ORCL_STATUS,
  JLS_SCHM_ENGR_PHONE :  value.JLS_SCHM_ENGR_PHONE,
  JLS_SCHM_ENGR_FLAG :  value.JLS_SCHM_ENGR_FLAG,
  JLS_SCHM_ERRDESC :  value.JLS_SCHM_ERRDESC,
  JLS_SCHM_AGENT_NAME :  value.JLS_SCHM_AGENT_NAME,
  JLS_SCHM_CUSTOMER_NAME :  value.JLS_SCHM_CUSTOMER_NAME,
  JLS_SCHM_DWNFLAG :  value.JLS_SCHM_DWNFLAG,
  JOB_STATUS : 'Not Started',
  JOB_VIEW_STATUS : 'Not Viewed',
  LAST_UPDATED_TIME : ""+value1,
  JOB_START_TIME : "",
  JOB_END_TIME : "",
  SMU_SCH_COMPDT : ""+value1,
  JOB_LOCATION : "",
  JOB_START_LAT : "",
  JOB_START_LONG : "", 
  current_and_last_update_time : new Date(), 
        }, 
        function (err, user) {
// Notification Send Process //
var type = '';
if(user.JLS_SCHM_SERTYPE == 'B'){
        type = 'MR Breakdown Service';
       } else {
         type = 'MR Preventive Maintenance';
       }
 let datas = {
  notification_title : "New Job Alert" || "",
  notification_desc : ""+type+" - " +user.JLS_SCHM_JOBNO || "",
  user_mobile_no : user.JLS_SCHM_ENGR_PHONE || "",
  date_and_time :value1 || "",
  read_status : 'Not Readed' || "",
  date_value : value2|| "",
  }

   request.post(
    'http://smart.johnsonliftsltd.com:3000/api/notification/create',
    { json: datas},
    function (error, response, body) {
        if (!error && response.statusCode == 200) {
        }
    }
   );
// Notification Send Process //


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
            "UPDATE JLS_SERCALL_HDR_MR SET JLS_SCHM_DWNFLAG = 'Y' WHERE JLS_SCHM_COMPNO =:JLS_SCHM_COMPNO",
            {
                JLS_SCHM_COMPNO : user.JLS_SCHM_COMPNO,
            },
        {autoCommit: true},
        function (err, result_one) {
    if (err) { console.error(err.message);
          doRelease(connection);
          return;
     } 
     // console.log(result_one);
     res.json({Status:"Success",Message:"Insert successfully", Data : {} ,Code:200});
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

        });
}
catch(e){
      res.json({Status:"Failed",Message:"Internal Server Error", Data : {},Code:500});
}
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
connection.execute(
            "UPDATE JLS_SERCALL_HDR_MR SET JLS_SCHM_DWNFLAG = 'Y' WHERE JLS_SCHM_COMPNO =:JLS_SCHM_COMPNO",
            {
                JLS_SCHM_COMPNO : value.JLS_SCHM_COMPNO,
            },
        {autoCommit: true},
        function (err, result_one) {
    if (err) { console.error(err.message);
          doRelease(connection);
          return;
     } 
     // console.log(result_one);
     res.json({Status:"Success",Message:"Updated successfully", Data : {} ,Code:200});
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
});  
});  
});





router.get('/lr_record/create',async function(req, res) {

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
            "SELECT * FROM JLS_QUOTELR_UPLOAD WHERE NVL(SMU_SCQH_STATUS,'N')<> 'Y'",
            { },
        {autoCommit: true},async function (err, result) {
    if (err) { console.error(err.message);
          doRelease(connection);
          return;
     }
doRelease(connection);
var ary = [];
console.log("LR Service --------------------------------------- ",result.rows.length);
if(result.rows.length == 0){
 res.json({Status:"Success",Message:"User Details", Data : {} ,Code:200});
}else{
for(let a = 0 ; a < result.rows.length; a++){
var temp_data = result.rows[a];
var results = {}
for (var i = 0; i < result.metaData.length; ++i){
results[result.metaData[i].name] = temp_data[i];
}
ary.push(results);  
 if(a == result.rows.length - 1){
 
 var value = ary[0];

 var datass  =  await lr_service_managementModel.findOne({SMU_SCQH_QUOTENO:value.SMU_SCQH_QUOTENO});

  
 if(datass == null){
  try{
  await lr_service_managementModel.create({
  SMU_SCQH_BRCODE:  value.SMU_SCQH_BRCODE,
  SMU_SCQH_QUOTENO :value.SMU_SCQH_QUOTENO,
  SMU_SCQH_QUOTEDT : value.SMU_SCQH_QUOTEDT,
  SMU_SCQH_CSCHPNO : value.SMU_SCQH_CSCHPNO,
  SMU_SCQH_JOBNO : value.SMU_SCQH_JOBNO,
  SMU_SCQH_LRNO : value.SMU_SCQH_LRNO,
  SMU_SCQH_LRDT : value.SMU_SCQH_LRDT,
  SMU_SCAH_SMNO : value.SMU_SCAH_SMNO,
  SMU_SCQH_STATUS : value.SMU_SCQH_STATUS,
  SMU_SCAH_ROUTECODE : value.SMU_SCAH_ROUTECODE,
  SMU_SCAH_MECHANIC : value.SMU_SCAH_MECHANIC,
  SMU_SED_NAME : value.SMU_SED_NAME,
  SMU_SED_ADDRESS1 : value.SMU_SED_ADDRESS1,
  SMU_SED_ADDRESS2 : value.SMU_SED_ADDRESS2,
  SMU_SED_ADDRESS3 : value.SMU_SED_ADDRESS3,
  SMU_SED_ADDRESS4 : value.SMU_SED_ADDRESS4,
  SMU_SED_PINCODE : value.SMU_SED_PINCODE,
  SMU_SEN_MOBILENO : value.SMU_SEN_MOBILENO,
  SMU_SED_SERTYPE :  value.SMU_SED_SERTYPE,
  SMU_SCH_JOBSTARTTIME :  value.SMU_SCH_JOBSTARTTIME,
  SMU_SCH_JOBENDIME :  value.SMU_SCH_JOBENDIME,
  SMU_VANID :  value.SMU_VANID,
  SMU_SCQH_ERRDESC : value.SMU_SCQH_ERRDESC,
  JOB_STATUS : 'Not Started',
  JOB_VIEW_STATUS : 'Not Viewed',
  LAST_UPDATED_TIME : ""+value1,
  JOB_START_TIME :  ""+value1,
  JOB_END_TIME :  ""+value1,
  JOB_LOCATION : "",
  JOB_START_LAT : "",
  JOB_START_LONG : "",
  current_and_last_update_time : new Date(), 
        },async function (err, user) {



// Notification Send Process //
var dates = require('date-and-time');
var type = 'LR';
 let datas = {
  notification_title : "New Job Alert" || "",
  notification_desc : ""+type+" - " +user.SMU_SCQH_JOBNO || "",
  user_mobile_no : user.SMU_SEN_MOBILENO || "",
  date_and_time :value1 || "",
  read_status : 'Not Readed' || "",
  date_value : value2|| "",
  }

   request.post(
    'http://smart.johnsonliftsltd.com:3000/api/notification/create',
    { json: datas},
    function (error, response, body) {
        if (!error && response.statusCode == 200) {
        }
    }
   );
// Notification Send Process //


oracledb.getConnection({
      user: "JLSMART",
      password: "JLSMART",
      connectString: "(DESCRIPTION =(ADDRESS = (PROTOCOL = TCP)(HOST = 192.168.1.112)(PORT = 1521))(CONNECT_DATA =(SID = jlpl)))"
}, function(err, connection) {
if (err) {
    return;
}
connection.execute(
            "UPDATE JLS_QUOTELR_UPLOAD set SMU_SCQH_STATUS='Y' WHERE SMU_SCQH_QUOTENO=:SMU_SCQH_QUOTENO",
            {
                SMU_SCQH_QUOTENO:user.SMU_SCQH_QUOTENO
            },
        {autoCommit: true},
        function (err, result_one) {
    if (err) { console.error(err.message);
          doRelease(connection);
          return;
     }
      // console.log(result_one);
      doRelease(connection);
      res.json({Status:"Success",Message:"Insert successfully", Data : {} ,Code:200});
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
}   else {


	    oracledb.getConnection({
      user: "JLSMART",
      password: "JLSMART",
      connectString: "(DESCRIPTION =(ADDRESS = (PROTOCOL = TCP)(HOST = 192.168.1.112)(PORT = 1521))(CONNECT_DATA =(SID = jlpl)))"
}, function(err, connection) {
if (err) {
    return;
}
connection.execute(
            "UPDATE JLS_QUOTELR_UPLOAD set SMU_SCQH_STATUS='Y' WHERE SMU_SCQH_QUOTENO=:SMU_SCQH_QUOTENO",
            {
                SMU_SCQH_QUOTENO:value.SMU_SCQH_QUOTENO
            },
        {autoCommit: true},
        function (err, result_one) {
    if (err) { console.error(err.message);
          doRelease(connection);
          return;
     }
      // console.log(result_one);
      res.json({Status:"Success",Message:"Updated successfully", Data : {} ,Code:200});
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






router.get('/audit/create',async function (req, res) {

// OM_OSA_MOBILE =:OM_OSA_MOBILE AND

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
            "SELECT * FROM JLS_SITEAUDIT_HDR WHERE  OM_OSA_STATUS in ('N','S')",
            {},
        {autoCommit: true},async function (err, result) {
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
console.log("Audit Service --------------------------------------- ",result.rows.length);
if(result.rows.length == 0){
 res.json({Status:"Success",Message:"User Details", Data : {} ,Code:200});
}else{
for(let a = 0 ; a < result.rows.length; a++){
var temp_data = result.rows[a];
var results = {}
for (var i = 0; i < result.metaData.length; ++i){
results[result.metaData[i].name] = temp_data[i];
}
ary.push(results);  
 if(a == result.rows.length - 1){
    
   var value = ary[0];


  var datass  =  await audit_data_managementModel.findOne({OM_OSA_COMPNO:value.OM_OSA_COMPNO});


   if(datass == null){
  try{
  await audit_data_managementModel.create({
OM_OSA_SEQNO:  value.OM_OSA_SEQNO,
OM_OSA_AUDDATE:  value.OM_OSA_AUDDATE,
OM_OSA_BRCODE:  value.OM_OSA_BRCODE,
OM_OSA_JOBNO:  value.OM_OSA_JOBNO,
OM_OSA_CUSNAME:  value.OM_OSA_CUSNAME,
OM_OSA_COMPNO:  value.OM_OSA_COMPNO,
OM_OSA_MECHCODE:  value.OM_OSA_MECHCODE,
OM_OSA_ENGRCODE:  value.OM_OSA_ENGRCODE,
OM_OSA_MOBILE:  value.OM_OSA_MOBILE,
OM_OSA_MATLREQD:  value.OM_OSA_MATLREQD,
OM_OSA_MATLREMARK:  value.OM_OSA_MATLREMARK,
OM_OSA_STATUS:  value.OM_OSA_STATUS,
OM_OSA_PREPBY:  value.OM_OSA_PREPBY,
OM_OSA_PREPDT:  value.OM_OSA_PREPDT,
OM_OSA_MODBY:  value.OM_OSA_MODBY,
OM_OSA_MODDT:  value.OM_OSA_MODDT,
OM_OSA_APPBY:  value.OM_OSA_APPBY,
OM_OSA_APPDT:  value.OM_OSA_APPDT,
OM_OSA_ERRDESC:  value.OM_OSA_ERRDESC,
JOB_STATUS : 'Not Started',
JOB_VIEW_STATUS : 'Not Viewed',
LAST_UPDATED_TIME : ""+value1,
JOB_START_TIME :  ""+value1,
JOB_END_TIME :  ""+value1,
JOB_LOCATION : "",
JOB_START_LAT : "",
JOB_START_LONG : "",
current_and_last_update_time : new Date(), 
        },async function (err, user) {



// Notification Send Process //
var type = 'Audit';
 let datas = {
  notification_title : "New Job Alert" || "",
  notification_desc : ""+type+" - " +user.OM_OSA_JOBNO || "",
  user_mobile_no : user.OM_OSA_MOBILE || "",
  date_and_time :value1 || "",
  read_status : 'Not Readed' || "",
  date_value : value2|| "",
  }



   request.post(
    'http://smart.johnsonliftsltd.com:3000/api/notification/create',
    { json: datas},
    function (error, response, body) {
        if (!error && response.statusCode == 200) {
        }
    }
   );
// Notification Send Process //


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
            "UPDATE JLS_SITEAUDIT_HDR set OM_OSA_STATUS='Y' WHERE OM_OSA_COMPNO=:OM_OSA_COMPNO",
            {
                OM_OSA_COMPNO:user.OM_OSA_COMPNO
            },
        {autoCommit: true},
        function (err, result_one) {
    if (err) { console.error(err.message);
          doRelease(connection);
          return;
     }
     // console.log(result_one);
      doRelease(connection);
      res.json({Status:"Success",Message:"Audit Inserted successfully", Data : {},Code:200});

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

else {


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
            "UPDATE JLS_SITEAUDIT_HDR set OM_OSA_STATUS='Y' WHERE OM_OSA_COMPNO=:OM_OSA_COMPNO",
            {
                OM_OSA_COMPNO:value.OM_OSA_COMPNO
            },
        {autoCommit: true},
        function (err, result_one) {
    if (err) { console.error(err.message);
          doRelease(connection);
          return;
     }
      // console.log(result_one);
      doRelease(connection);
      res.json({Status:"Success",Message:"Audit Updated successfully", Data : {},Code:200});

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
}
}
});
});
});








router.get('/part_replacement/create',async function (req, res) {

// SMU_ACK_MOBILENO=:SMU_SCH_MECHCELL and

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
    "SELECT DISTINCT SMU_ACK_BRID, SMU_ACK_MRSEQNO, SMU_ACK_ISSEQNO, SMU_ACK_COMPNO, SMU_ACK_JOBNO, SMU_ACK_REQNO, SMU_ACK_SERTYPE, SMU_ACK_ECODE,  SMU_ACK_DCNO, SMU_ACK_DCDT, SMU_ACK_ENGRNAME, SMU_ACK_ADDRESS1, SMU_ACK_ADDRESS2, SMU_ACK_ADDRESS3, SMU_ACK_ADDRESS4, SMU_ACK_APINCODE, SMU_ACK_MOBILENO, SMU_ACK_STATUS FROM JLS_ACK_UPLOAD WHERE NVL(SMU_ACK_STATUS,'N')<> 'Y'",
            {},
        {autoCommit: true},async function (err, result) {
    if (err) { console.error(err.message);
          doRelease(connection);
          return;
     }
var ary = [];
console.log("Part Replace  Service --------------------------------------- ",result.rows.length);
if(result.rows.length == 0){
 res.json({Status:"Success",Message:"User Details", Data : {} ,Code:200});
}else{
for(let a = 0 ; a < result.rows.length; a++){
var temp_data = result.rows[a];
var results = {}
for (var i = 0; i < result.metaData.length; ++i){
results[result.metaData[i].name] = temp_data[i];
}
ary.push(results);  
 if(a == result.rows.length - 1){
  var value = ary[0];
  var datass  =  await part_reply_service_managementModel.findOne({SMU_ACK_COMPNO:value.SMU_ACK_COMPNO});
if(datass == null){
  try{
  await part_reply_service_managementModel.create({
  SMU_ACK_BRID:  value.SMU_ACK_BRID,
  SMU_ACK_MRSEQNO:  value.SMU_ACK_MRSEQNO,
  SMU_ACK_ISSEQNO:  value.SMU_ACK_ISSEQNO,
  SMU_ACK_COMPNO:  value.SMU_ACK_COMPNO,
  SMU_ACK_JOBNO:  value.SMU_ACK_JOBNO,
  SMU_ACK_REQNO: value.SMU_ACK_REQNO,
  SMU_ACK_SERTYPE: value.SMU_ACK_SERTYPE,
  SMU_ACK_ECODE:  value.SMU_ACK_ECODE,
  SMU_ACK_MRMATLID :  "",
  SMU_ACK_ISSMATLID :  "",
  SMU_ACK_PARTNAME :  "",
  SMU_ACK_DCNO :  value.SMU_ACK_DCNO,
  SMU_ACK_DCDT :  value.SMU_ACK_DCDT,
  SMU_ACK_ENGRNAME :  value.SMU_ACK_ENGRNAME,
  SMU_ACK_ADDRESS1 :  value.SMU_ACK_ADDRESS1,
  SMU_ACK_ADDRESS2 :  value.SMU_ACK_ADDRESS2,
  SMU_ACK_ADDRESS3 :  value.SMU_ACK_ADDRESS3,
  SMU_ACK_ADDRESS4 :  value.SMU_ACK_ADDRESS4,
  SMU_ACK_APINCODE :  value.SMU_ACK_APINCODE,
  SMU_ACK_MOBILENO :  value.SMU_ACK_MOBILENO,
  SMU_ACK_STATUS :  value.SMU_ACK_STATUS,
  SMU_ACK_VANID :  value.SMU_ACK_VANID,
  SMU_ACK_ISSQTY :  value.SMU_ACK_ISSQTY,
  SMU_ACK_ERRDESC :  value.SMU_ACK_ERRDESC,
  SMU_ACK_BRCODE : value.SMU_ACK_BRCODE,
  JOB_STATUS : 'Not Started',
  JOB_VIEW_STATUS : 'Not Viewed',
  LAST_UPDATED_TIME : ""+value1,
  JOB_START_TIME :  ""+value1,
  JOB_END_TIME :  ""+value1,
JOB_LOCATION : "",
JOB_START_LAT : "",
JOB_START_LONG : "",
  current_and_last_update_time : new Date(), 

        },async function (err, user) {
   // Notification Send Process //
var dates = require('date-and-time');
var type = 'Part Replacement';
 let datas = {
  notification_title : "New Job Alert" || "",
  notification_desc : ""+type+" - " +user.SMU_ACK_JOBNO || "",
  user_mobile_no : user.SMU_ACK_MOBILENO || "",
  date_and_time :value1 || "",
  read_status : 'Not Readed' || "",
  date_value : value2|| "",
  }
   request.post(
    'http://smart.johnsonliftsltd.com:3000/api/notification/create',
    { json: datas},
    function (error, response, body) {
        if (!error && response.statusCode == 200) {
        }
    }
   );
// Notification Send Process //
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
            "UPDATE JLS_ACK_UPLOAD set SMU_ACK_STATUS='Y' WHERE SMU_ACK_COMPNO=:SMU_ACK_COMPNO",
            {
                SMU_ACK_COMPNO:user.SMU_ACK_COMPNO
            },
        {autoCommit: true},
        function (err, result_one) {
    if (err) { console.error(err.message);
          doRelease(connection);
          return;
     }
     // console.log(result_one)
     doRelease(connection);
     res.json({Status:"Failed",Message:"Part Replacement Inserted successfully", Data : {},Code:500});
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
else {
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
            "UPDATE JLS_ACK_UPLOAD set SMU_ACK_STATUS='Y' WHERE SMU_ACK_COMPNO=:SMU_ACK_COMPNO",
            {
                SMU_ACK_COMPNO:value.SMU_ACK_COMPNO
            },
        {autoCommit: true},
        function (err, result_one) {
    if (err) { console.error(err.message);
          doRelease(connection);
          return;
     }
     // console.log(result_one)
     doRelease(connection);
     res.json({Status:"Failed",Message:"Part Replacement Updated successfully", Data : {},Code:500});
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
}
}
});
});
});












router.get('/breakdown_preventive/create_final_insert',async function(req, res) {
// console.log("Request In");
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
            "SELECT * from JLS_SERCALL_HDR_UPLOAD where SMU_SCH_SERTYPE in ('P','B') and  NVL(SMU_SCH_DWNFLAG,'N') <> 'Y' and trunc(mod(mod(sysdate - SMU_SCH_CRTDT,1)*24,1)*60 ) > 10",
            { },
        {autoCommit: true},
     async  function (err, result) {
    if (err) { console.error(err.message);
              // console.log("Request In 3");
          doRelease(connection);
          return;
     }
      doRelease(connection);
      // console.log("Request In 2");
var ary = [];
console.log("BD PR --------------------------------------- ",result.rows.length);
if(result.rows.length == 0){
 res.json({Status:"Success",Message:"User Details", Data : {} ,Code:200});
} else {
for(let a = 0 ; a < result.rows.length; a++){
var temp_data = result.rows[a];
var results = {}
for (var i = 0; i < result.metaData.length; ++i){
results[result.metaData[i].name] = temp_data[i];
}
ary.push(results);   
if(a == result.rows.length - 1){

var index = 0;
recall(index,ary);
async function recall(index,ary){
 var count = 0;

 if(40 < ary.length){
   count = 40;
 } else {
   count = ary.length;
 }




  if(index < count){
// console.log(index);
var value = ary[index];
var user_detail  =  await breakdown_managementModel.findOne({SMU_SCH_COMPNO : value.SMU_SCH_COMPNO});

// console.log(user_detail);

if(user_detail == null){
  try{
        await breakdown_managementModel.create({
SMU_SCH_COMPNO : value.SMU_SCH_COMPNO,
SMU_SCH_COMPDT : value.SMU_SCH_COMPDT,
SMU_SCH_JOBNO : value.SMU_SCH_JOBNO,
SMU_SCH_BRCODE : value.SMU_SCH_BRCODE,
SMU_SCH_REPORTBY : value.SMU_SCH_REPORTBY,
SMU_SCH_REPORTCELL : value.SMU_SCH_REPORTCELL,
SMU_SCH_BRKDOWNTYPE : value.SMU_SCH_BRKDOWNTYPE,
SMU_SCH_BRKDOWNDESC : value.SMU_SCH_BRKDOWNDESC,
SMU_SCH_ROUTECODE : value.SMU_SCH_ROUTECODE,
SMU_SCH_MECHANIC : value.SMU_SCH_MECHANIC,
SMU_SCH_DEPUTEDDT : value.SMU_SCH_DEPUTEDDT,
SMU_SCH_CRTDT  : value.SMU_SCH_CRTDT,
SMU_SCH_STATUS : value.SMU_SCH_STATUS,
SMU_SCH_EMPCODE : value.SMU_SCH_EMPCODE,
SMU_SCH_SERTYPE : value.SMU_SCH_SERTYPE,
SMU_SCH_CONTNO : value.SMU_SCH_CONTNO, 
SMU_SCH_DWNFLAG : value.SMU_SCH_DWNFLAG,
SMU_SCH_CANCFLAG : value.SMU_SCH_CANCFLAG,
SMU_SCH_DWNFLAGDATE : value.SMU_SCH_DWNFLAGDATE,
SMU_SCH_CUSCODE : value.SMU_SCH_CUSCODE,
SMU_SCH_CUSNAME : value.SMU_SCH_CUSNAME, 
SMU_SCH_CUSADD1  : value.SMU_SCH_CUSADD1,
SMU_SCH_CUSADD2  : value.SMU_SCH_CUSADD2,
SMU_SCH_CUSADD3 : value.SMU_SCH_CUSADD3,
SMU_SCH_CUSADD4  : value.SMU_SCH_CUSADD4,
SMU_SCH_CUSPIN : value.SMU_SCH_CUSPIN,
SMU_SCH_MECHCELL : value.SMU_SCH_MECHCELL,
SMU_SCH_AMCTYPE  : value.SMU_SCH_AMCTYPE,
SMU_SCH_AMCTODT : value.SMU_SCH_AMCTODT,
SMU_SCH_VANID  : value.SMU_SCH_VANID,
SSM_SCH_APPTO : value.SSM_SCH_APPTO,
SMU_SCH_SUPCELLNO : value.SMU_SCH_SUPCELLNO,
SMU_SCH_JOBCURSTATUS : value.SMU_SCH_JOBCURSTATUS,
SMU_SCH_MODDT : value.SMU_SCH_MODDT,
SMU_SCH_ERRDESC : value.SMU_SCH_ERRDESC,
SMU_SCH_DOORTYPE : value.SMU_SCH_DOORTYPE,
SMU_SCH_CHKLIST : "NO",
JOB_STATUS : 'Not Started',
JOB_VIEW_STATUS : 'Not Viewed',
LAST_UPDATED_TIME : ""+new Date(),
JOB_START_TIME : "",
JOB_END_TIME : "",
JOB_LOCATION : "",
JOB_START_LAT : "",
JOB_START_LONG : "",
  current_and_last_update_time : new Date(), 
        }, 
        function (err, user) {
// console.log("Mongo Db Insert",user.SMU_SCH_COMPNO);

// Notification Send Process //
var dates = require('date-and-time');
var type = '';
if(user.SMU_SCH_SERTYPE == 'B'){
        type = 'Breakdown Service';
       } else {
         type = 'Preventive Maintenance';
       }
 let datas = {
  notification_title : "New Job Alert" || "",
  notification_desc : ""+type+" - " +user.SMU_SCH_JOBNO || "",
  user_mobile_no : user.SMU_SCH_MECHCELL || "",
  date_and_time :value1 || "",
  read_status : 'Not Readed' || "",
  date_value : value2|| "",
  }
   request.post(
    'http://smart.johnsonliftsltd.com:3000/api/notification/create',
    { json: datas},
    function (error, response, body) {
        if (!error && response.statusCode == 200) {
        }
    }
   );
// Notification Send Process //

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
            "UPDATE JLS_SERCALL_HDR_UPLOAD set SMU_SCH_DWNFLAG='Y', SMU_SCH_DWNFLAGDATE=:SMU_SCH_DWNFLAGDATE WHERE SMU_SCH_COMPNO=:SMU_SCH_COMPNO",
            {
                SMU_SCH_DWNFLAGDATE : new Date(),
                SMU_SCH_COMPNO : user.SMU_SCH_COMPNO,
            },
        {autoCommit: true},
        function (err, result_one) {
    if (err) { console.error(err.message);
          doRelease(connection);
          return;
     }
     // console.log("Oracle Insert",result_one);

     doRelease(connection); 
     // res.json({Status:"Success",Message:"Added successfully", Data : {} ,Code:200}); 
     index = index + 1;
     recall(index,ary);
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
} else {

console.log("Complaint No : " + user_detail.SMU_SCH_COMPNO + " STATUS : " + user_detail.JOB_STATUS);

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
            "UPDATE JLS_SERCALL_HDR_UPLOAD set SMU_SCH_DWNFLAG='Y', SMU_SCH_DWNFLAGDATE=:SMU_SCH_DWNFLAGDATE WHERE SMU_SCH_COMPNO=:SMU_SCH_COMPNO",
            {
                SMU_SCH_DWNFLAGDATE : new Date(),
                SMU_SCH_COMPNO : value.SMU_SCH_COMPNO,
            },
        {autoCommit: true},
        function (err, result_one) {
    if (err) { console.error(err.message);
          doRelease(connection);
          return;
     }
     // console.log("Oracle Update",result_one);
     doRelease(connection); 
     index = index + 1;
     recall(index,ary);
     // res.json({Status:"Success",Message:"Updated", Data : {},Code:200}); 
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
} else {
res.json({Status:"Success",Message:"Updated", Data : {},Code:200}); 
}

}
}
}
}
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










router.get('/part_replacement/final_insert',async function (req, res) {

// SMU_ACK_MOBILENO=:SMU_SCH_MECHCELL and

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
    "SELECT DISTINCT SMU_ACK_BRID, SMU_ACK_MRSEQNO, SMU_ACK_ISSEQNO, SMU_ACK_COMPNO, SMU_ACK_JOBNO, SMU_ACK_REQNO, SMU_ACK_SERTYPE, SMU_ACK_ECODE,  SMU_ACK_DCNO, SMU_ACK_DCDT, SMU_ACK_ENGRNAME, SMU_ACK_ADDRESS1, SMU_ACK_ADDRESS2, SMU_ACK_ADDRESS3, SMU_ACK_ADDRESS4, SMU_ACK_APINCODE, SMU_ACK_MOBILENO, SMU_ACK_STATUS FROM JLS_ACK_UPLOAD WHERE NVL(SMU_ACK_STATUS,'N')<> 'Y'",
            {},
        {autoCommit: true},async function (err, result) {
    if (err) { console.error(err.message);
          doRelease(connection);
          return;
     }
var ary = [];
console.log("Part Replace  Service --------------------------------------- ",result.rows.length);
if(result.rows.length == 0){
 res.json({Status:"Success",Message:"User Details", Data : {} ,Code:200});
}else{
for(let a = 0 ; a < result.rows.length; a++){
var temp_data = result.rows[a];
var results = {}
for (var i = 0; i < result.metaData.length; ++i){
results[result.metaData[i].name] = temp_data[i];
}
ary.push(results);  
 if(a == result.rows.length - 1){
 var index = 0;
 recall(index,ary);
 async function recall(index,ary) {
  // console.log(index);
  var value = ary[index];
  var datass  =  await part_reply_service_managementModel.findOne({SMU_ACK_COMPNO:value.SMU_ACK_COMPNO});
if(datass == null){
  try{
  await part_reply_service_managementModel.create({
  SMU_ACK_BRID:  value.SMU_ACK_BRID,
  SMU_ACK_MRSEQNO:  value.SMU_ACK_MRSEQNO,
  SMU_ACK_ISSEQNO:  value.SMU_ACK_ISSEQNO,
  SMU_ACK_COMPNO:  value.SMU_ACK_COMPNO,
  SMU_ACK_JOBNO:  value.SMU_ACK_JOBNO,
  SMU_ACK_REQNO: value.SMU_ACK_REQNO,
  SMU_ACK_SERTYPE: value.SMU_ACK_SERTYPE,
  SMU_ACK_ECODE:  value.SMU_ACK_ECODE,
  SMU_ACK_MRMATLID :  "",
  SMU_ACK_ISSMATLID :  "",
  SMU_ACK_PARTNAME :  "",
  SMU_ACK_DCNO :  value.SMU_ACK_DCNO,
  SMU_ACK_DCDT :  value.SMU_ACK_DCDT,
  SMU_ACK_ENGRNAME :  value.SMU_ACK_ENGRNAME,
  SMU_ACK_ADDRESS1 :  value.SMU_ACK_ADDRESS1,
  SMU_ACK_ADDRESS2 :  value.SMU_ACK_ADDRESS2,
  SMU_ACK_ADDRESS3 :  value.SMU_ACK_ADDRESS3,
  SMU_ACK_ADDRESS4 :  value.SMU_ACK_ADDRESS4,
  SMU_ACK_APINCODE :  value.SMU_ACK_APINCODE,
  SMU_ACK_MOBILENO :  value.SMU_ACK_MOBILENO,
  SMU_ACK_STATUS :  value.SMU_ACK_STATUS,
  SMU_ACK_VANID :  value.SMU_ACK_VANID,
  SMU_ACK_ISSQTY :  value.SMU_ACK_ISSQTY,
  SMU_ACK_ERRDESC :  value.SMU_ACK_ERRDESC,
  SMU_ACK_BRCODE : value.SMU_ACK_BRCODE,
  JOB_STATUS : 'Not Started',
  JOB_VIEW_STATUS : 'Not Viewed',
  LAST_UPDATED_TIME : ""+value1,
  JOB_START_TIME :  ""+value1,
  JOB_END_TIME :  ""+value1,
JOB_LOCATION : "",
JOB_START_LAT : "",
JOB_START_LONG : "",
  current_and_last_update_time : new Date(), 

        },async function (err, user) {
   // Notification Send Process //
var type = 'Part Replacement';
 let datas = {
  notification_title : "New Job Alert" || "",
  notification_desc : ""+type+" - " +user.SMU_ACK_JOBNO || "",
  user_mobile_no : user.SMU_ACK_MOBILENO || "",
  date_and_time :value1 || "",
  read_status : 'Not Readed' || "",
  date_value : value2|| "",
  }
   request.post(
    'http://smart.johnsonliftsltd.com:3000/api/notification/create',
    { json: datas},
    function (error, response, body) {
        if (!error && response.statusCode == 200) {
        }
    }
   );
// Notification Send Process //
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
            "UPDATE JLS_ACK_UPLOAD set SMU_ACK_STATUS='Y' WHERE SMU_ACK_COMPNO=:SMU_ACK_COMPNO",
            {
                SMU_ACK_COMPNO:user.SMU_ACK_COMPNO
            },
        {autoCommit: true},
        function (err, result_one) {
    if (err) { console.error(err.message);
          doRelease(connection);
          return;
     }
     // console.log(result_one)
     doRelease(connection);
      index = index + 1;
      recall(index,ary);
      // console.log("Insert Part Replacement",result_one);
     // res.json({Status:"Failed",Message:"Part Replacement Inserted successfully", Data : {},Code:500});
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
else {
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
            "UPDATE JLS_ACK_UPLOAD set SMU_ACK_STATUS='Y' WHERE SMU_ACK_COMPNO=:SMU_ACK_COMPNO",
            {
                SMU_ACK_COMPNO:value.SMU_ACK_COMPNO
            },
        {autoCommit: true},
        function (err, result_one) {
    if (err) { console.error(err.message);
          doRelease(connection);
          return;
     }
     // console.log(result_one)

     doRelease(connection);
     index = index + 1;
     // console.log("Update Part Replacement",result_one);
     recall(index,ary);
     // res.json({Status:"Failed",Message:"Part Replacement Updated successfully", Data : {},Code:500});
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


}
}
}
});
});
});




router.get('/material_reqeust/create',async function(req, res) {
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
            "SELECT * FROM JLS_MATREQ_UPLOAD WHERE SMU_DWNFLAG = 'N'",
            {},
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
console.log("Material Reqeust --------------------------------------- ",result.rows.length);
for(let a = 0 ; a < result.rows.length; a++){
var temp_data = result.rows[a];
var results = {}
for (var i = 0; i < result.metaData.length; ++i){
results[result.metaData[i].name] = temp_data[i];
}
ary.push(results);   
if(a == result.rows.length - 1){
  var value = ary[0];
  var user_detail  =  await material_requestModel.findOne({SMU_MRSEQNO:value.SMU_MRSEQNO});
  if(user_detail == null){
  try{
        await material_requestModel.create({
"SMU_MRSEQNO": ""+value.SMU_MRSEQNO,
"SMU_MRSLNO": ""+value.SMU_MRSLNO,
"SMU_VANID": ""+value.SMU_VANID,
"SMU_JOBNO": ""+value.SMU_JOBNO,
"SMU_CUSCODE": ""+value.SMU_CUSCODE,
"SMU_CUSTNAME": ""+value.SMU_CUSTNAME,
"SMU_ADDRESS1": ""+value.SMU_ADDRESS1,
"SMU_ADDRESS2": ""+value.SMU_ADDRESS2,
"SMU_ADDRESS3": ""+value.SMU_ADDRESS3,
"SMU_ADDRESS4": ""+value.SMU_ADDRESS4,
"SMU_CUSTPIN": ""+value.SMU_CUSTPIN,
"SMU_MATLID": ""+value.SMU_MATLID,
"SMU_MATLNAME": ""+value.SMU_MATLNAME,
"SMU_QTY": ""+value.SMU_QTY,
"SMU_TECHNAME": ""+value.SMU_TECHNAME,
"SMU_TECHMOBNO": ""+value.SMU_TECHMOBNO,
"SMU_DWNFLAG": ""+value.SMU_DWNFLAG,
"SMU_CANCFLAG": ""+value.SMU_CANCFLAG,
"SMU_ROUTE": ""+value.SMU_ROUTE,
"SMU_MRDT": ""+value.SMU_MRDT,
"SMU_DWNFLAGDATE": ""+value.SMU_DWNFLAGDATE,
"SMU_ERRDESC": ""+value.SMU_ERRDESC,
"JOB_STATUS" : 'Not Started',
"JOB_VIEW_STATUS" : 'Not Viewed',
"LAST_UPDATED_TIME" : ""+value1,
"JOB_START_TIME" : "",
"JOB_END_TIME" : "",
"SMU_SCH_COMPDT" : ""+value1,
"JOB_LOCATION" : "",
"JOB_START_LAT" : "",
"JOB_START_LONG" : "",
  current_and_last_update_time : new Date(),   
        }, 
        function (err, user) {
// Notification Send Process //

 let datas = {
  notification_title : "New Job Alert" || "",
  notification_desc : "MR "+value.SMU_MRSEQNO+" - " +value.SMU_JOBNO || "",
  user_mobile_no : value.SMU_TECHMOBNO || "",
  date_and_time :value1 || "",
  read_status : 'Not Readed' || "",
  date_value : value2|| "",
  }

   request.post(
    'http://smart.johnsonliftsltd.com:3000/api/notification/create',
    { json: datas},
    function (error, response, body) {
        if (!error && response.statusCode == 200) {
        }
    }
   );
// Notification Send Process //


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
            "UPDATE JLS_MATREQ_UPLOAD SET SMU_DWNFLAG = 'Y' WHERE SMU_MRSEQNO =:SMU_MRSEQNO",
            {
                SMU_MRSEQNO : value.SMU_MRSEQNO,
            },
        {autoCommit: true},
        function (err, result_one) {
    if (err) { console.error(err.message);
          doRelease(connection);
          return;
     } 
     // console.log(result_one);
     res.json({Status:"Success",Message:"Insert successfully", Data : {} ,Code:200});
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

        });
}
catch(e){
      res.json({Status:"Failed",Message:"Internal Server Error", Data : {},Code:500});
}
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
connection.execute(
             "UPDATE JLS_MATREQ_UPLOAD SET SMU_DWNFLAG = 'Y' WHERE SMU_MRSEQNO =:SMU_MRSEQNO",
            {
                 SMU_MRSEQNO : value.SMU_MRSEQNO
            },
        {autoCommit: true},
        function (err, result_one) {
    if (err) { console.error(err.message);
          doRelease(connection);
          return;
     } 
     // console.log(result_one);
     res.json({Status:"Success",Message:"Updated successfully", Data : {} ,Code:200});
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
});  
});  
});












router.get('/job_count_detail',async function(req, res) {
var response = [];

breakdown_service();


function breakdown_service(){
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
            "SELECT * from JLS_SERCALL_HDR_UPLOAD where SMU_SCH_SERTYPE in ('B') and  NVL(SMU_SCH_DWNFLAG,'N') <> 'Y' and trunc(mod(mod(sysdate - SMU_SCH_CRTDT,1)*24,1)*60 ) > 10",
            {},
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
console.log("MR --------------------------------------- ",result.rows.length);
response.push({
  name : "BREAK DOWN",
  count : result.rows.length
});

 preventive_service();

});
});
}




function preventive_service(){
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
            "SELECT * from JLS_SERCALL_HDR_UPLOAD where SMU_SCH_SERTYPE in ('P') and  NVL(SMU_SCH_DWNFLAG,'N') <> 'Y' and trunc(mod(mod(sysdate - SMU_SCH_CRTDT,1)*24,1)*60 ) > 10",
            {},
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
console.log("MR --------------------------------------- ",result.rows.length);
response.push({
  name : "PREVENTIVE",
  count : result.rows.length
});

 lr_service();

});
});
}




function lr_service(){
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
            "SELECT * FROM JLS_QUOTELR_UPLOAD WHERE NVL(SMU_SCQH_STATUS,'N')<> 'Y'",
            {},
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
console.log("MR --------------------------------------- ",result.rows.length);
response.push({
  name : "LR SERVICE",
  count : result.rows.length
});

 part_ack_service();

});
});
}



function part_ack_service(){
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
    "SELECT DISTINCT SMU_ACK_BRID, SMU_ACK_MRSEQNO, SMU_ACK_ISSEQNO, SMU_ACK_COMPNO, SMU_ACK_JOBNO, SMU_ACK_REQNO, SMU_ACK_SERTYPE, SMU_ACK_ECODE,  SMU_ACK_DCNO, SMU_ACK_DCDT, SMU_ACK_ENGRNAME, SMU_ACK_ADDRESS1, SMU_ACK_ADDRESS2, SMU_ACK_ADDRESS3, SMU_ACK_ADDRESS4, SMU_ACK_APINCODE, SMU_ACK_MOBILENO, SMU_ACK_STATUS FROM JLS_ACK_UPLOAD WHERE NVL(SMU_ACK_STATUS,'N')<> 'Y'",
            {},
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
console.log("MR --------------------------------------- ",result.rows.length);
response.push({
  name : "PART ACK",
  count : result.rows.length
});

 audit();

});
});
}






function audit(){
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
            "SELECT * FROM JLS_SITEAUDIT_HDR WHERE  OM_OSA_STATUS in ('N','S')",
            {},
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
console.log("MR --------------------------------------- ",result.rows.length);
response.push({
  name : "Audit",
  count : result.rows.length
});

 mr_breakdown();

});
});
}





function mr_breakdown(){
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
            "SELECT * FROM JLS_SERCALL_HDR_MR WHERE JLS_SCHM_DWNFLAG = 'N' and JLS_SCHM_SERTYPE = 'P' ",
            {},
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
console.log("MR --------------------------------------- ",result.rows.length);
response.push({
  name : "MR BREAKDOWN",
  count : result.rows.length
});
 mr_preventive();
});
});
}


function mr_preventive(){
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
            "SELECT * FROM JLS_SERCALL_HDR_MR WHERE JLS_SCHM_DWNFLAG = 'N' and JLS_SCHM_SERTYPE = 'P'",
            {},
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
console.log("MR --------------------------------------- ",result.rows.length);
response.push({
  name : "MR PREVENTIVE",
  count : result.rows.length
});


res.json({Status:"Success",Message:"Total Count", Data : response ,Code:200});

});
});
}




});


module.exports = router;
