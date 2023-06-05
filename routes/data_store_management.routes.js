var express = require('express');
var router = express.Router();
var bodyParser = require('body-parser');
router.use(bodyParser.urlencoded({ extended: false }));
router.use(bodyParser.json());
var data_store_managementModel = require('./../models/data_store_managementModel');
var group_detailModel = require('./../models/group_detailModel');
var user_management = require('./../models/user_managementModel');
var new_group_listModel = require('./../models/new_group_listModel');
var oracledb = require('oracledb');
var request = require("request");
var temp_data_storedataModel = require('./../models/temp_data_storedataModel');
var error_log_oracelModel = require('./../models/error_log_oracelModel');
var pdfgeneratorHelper = require('./pdfhelper')



// router.post('/create_test', async function(req, res) {
    
// var user_details  =  await user_management.findOne({_id:req.body.user_id});

//  console.log(user_details.user_id);

//  if(user_details.user_id == '57541804879621' || user_details.user_id == '57541804879461'){
//     console.log("************* Data In");
//    res.json({Status:"Failed",Message:"Session Full Try After 10 Sec", Data : {} ,Code:404}); 
//  } else {


//   try{

//         await data_store_managementModel.create({
//               user_id :  req.body.user_id || "",
//               activity_id : req.body.activity_id || "",
//               job_id : req.body.job_id || "",
//               group_id : req.body.group_id || "",
//               sub_group_id : req.body.sub_group_id || "",
//               data_store : req.body.Data,
//               work_status : "Submitted",
//               work_time : [],
//               start_time : req.body.start_time || "",
//               pause_time : req.body.pause_time || "",
//               stop_time : req.body.stop_time || "",
//               storage_status : req.body.storage_status || "",
//               date_of_create : req.body.date_of_create || "",
//               date_of_update : req.body.date_of_update || "",
//               created_by : req.body.created_by || "",
//               updated_by : req.body.updated_by || "",
//               update_reason : req.body.update_reason || "",
//         }, async function (err, user) {
//            var group_detail  =  await new_group_listModel.findOne({_id:req.body.group_id});

//            if(req.body.created_by == 'ESPD-ACTIMF'){
//                group_detail = {SMU_UKEY:'ESPD-ACTIMF'};
//            }
//            if(group_detail.SMU_UKEY == 'ESPD-ACT3'){
//  var temp_count = req.body.Data;
//  var index = 0;
//  recall(index,req,temp_count);
   
// function recall(index,req,temp_count){
// var a = index;
// if(index < temp_count.length){
//       oracledb.getConnection({
//       user: "JLSMART",
//       password: "JLSMART",
//       connectString: "(DESCRIPTION =(ADDRESS = (PROTOCOL = TCP)(HOST = 192.168.1.112)(PORT = 1521))(CONNECT_DATA =(SID = jlpl)))"
// }, function(err, connection) {
// if (err) {
//     console.error(err.message);
//     return;
// }
//     var string = temp_count[a]._id.split(",");
//     let da = {
//       OM_GSPA_JOBNO : string[0],
//       OM_GSPA_SLNO : +string[1] || 0,
//       OM_GSPA_LCODE : string[2],
//       OM_GSPA_LPCODE : ""+string[3],
//       OM_GSPA_LCSLNO : 0,
//       OM_GSPA_SPLDESC : string[5],
//       OM_GSPA_VALUE  : string[6],
//       OM_GSPA_REVNO : 3,
//       OM_GSPA_REVDT : '15-MAR-2018',
//       OM_GSPA_DEPTSTATUS : 'Y',
//     }
//       connection.execute(
//             "INSERT INTO SPECVERIFY4492 VALUES (:OM_GSPA_JOBNO, :OM_GSPA_SLNO, :OM_GSPA_LCODE, :OM_GSPA_LPCODE, :OM_GSPA_LCSLNO, :OM_GSPA_SPLDESC, :OM_GSPA_VALUE, :OM_GSPA_REVNO, :OM_GSPA_REVDT, :OM_GSPA_DEPTSTATUS)",
//               da, // Bind values
//               { autoCommit: true}, 
//      async  function (err, result) {
//     if (err) { console.error(err.message);
//          let a = {
//           "job_no" : req.body.job_id || '',
//           "service_type" : "Operation",
//           "activity" : "ESPD-ACT3",
//           "follow_detail":"SPECVERIFY4492",
//           "url":"/data_store",
//           "date_time" : new Date(),
//           "error_detail": [err.toString()],
//           "data" : [req.body],
//           "user_no" : req.body.user_id 
//           }   
//           var submitted = await error_log_oracelModel.create(a);
//           doRelease(connection);
//           return;
//      }
//     index = index + 1;
//     recall(index,req,temp_count);
//     doRelease(connection);
//    });
//       function doRelease(connection) {
//        connection.release(function(err) {
//          if (err) {
//           console.error(err.message);
//         }
//       }
//    );
// } 
//    });
// } 

// else {

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
//     "UPDATE ESPD_OP_HDR set SMU_ACTIVITY_STATUS=:ac,SM_ACTIVITY_STATDATE=:dfd WHERE SMU_JOBNO=:jn and SMU_UKEY=:uk and SMU_ACTIVITY_STATUS IN (:acd,:ace)",
//             {
//                 ac: 'SUBMITTED',
//                 dfd: new Date(),
//                 jn : req.body.job_id,
//                 uk : 'ESPD-ACT3',
//                 acd : 'PUSHED TO MOBILE',
//                 ace : 'START'
//             },
//         {autoCommit: true},
//         function (err, result) {
//     if (err) { console.error(err.message);
//           doRelease(connection);
//           return;
//      }
//      doRelease(connection);
//     res.json({Status:"Success",Message:"Added successfully", Data : {} ,Code:200}); 
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

//      }
//    }
//   }


// else if(group_detail.SMU_UKEY == 'OP-ACT1'){
// request.post(
//     'http://smart.johnsonliftsltd.com:3000/api/activity/plumchar_entry',
//     { json: req.body },
//     function (error, response, body) {
//         if (!error && response.statusCode == 200) {
// oracledb.getConnection({
//       user: "JLSMART",
//       password: "JLSMART",
//       connectString: "(DESCRIPTION =(ADDRESS = (PROTOCOL = TCP)(HOST = 192.168.1.112)(PORT = 1521))(CONNECT_DATA =(SID = jlpl)))"
// }, function(err, connection) {
// if (err) {
//     return;
// }
// connection.execute(
//     "UPDATE ESPD_OP_HDR set SMU_ACTIVITY_STATUS=:ac,SM_ACTIVITY_STATDATE=:dfd WHERE SMU_JOBNO=:jn and SMU_UKEY=:uk and SMU_ACTIVITY_STATUS IN (:acd,:ace)",
//             {
//                 ac: 'SUBMITTED',
//                 dfd: new Date(),
//                 jn : req.body.job_id,
//                 uk : 'OP-ACT1',
//                 acd : 'PUSHED TO MOBILE',
//                 ace : 'START'
//             },
//         {autoCommit: true},
//         function (err, result) {
//     if (err) { console.error(err.message);
//           doRelease(connection);
//           return;
//      }  
//      doRelease(connection);
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
//         }
//     res.json({Status:"Success",Message:"Added successfully", Data : {} ,Code:200}); 
//     }
// );

//     }


//     else if(group_detail.SMU_UKEY == 'ESPD-ACT4'){
// request.post(
//     'http://smart.johnsonliftsltd.com:3000/api/activity/upload_photo_act_four',
//     { json: req.body },
//     function (error, response, body) {
//         if (!error && response.statusCode == 200) {
//         }

// oracledb.getConnection({
//       user: "JLSMART",
//       password: "JLSMART",
//       connectString: "(DESCRIPTION =(ADDRESS = (PROTOCOL = TCP)(HOST = 192.168.1.112)(PORT = 1521))(CONNECT_DATA =(SID = jlpl)))"
// }, function(err, connection) {
// if (err) {
//     return;
// }
// connection.execute(
//     "UPDATE ESPD_OP_HDR set SMU_ACTIVITY_STATUS=:ac,SM_ACTIVITY_STATDATE=:dfd WHERE SMU_JOBNO=:jn and SMU_UKEY=:uk and SMU_ACTIVITY_STATUS IN (:acd,:ace)",
//             {
//                 ac: 'SUBMITTED',
//                 dfd: new Date(),
//                 jn : req.body.job_id,
//                 uk : 'ESPD-ACT4',
//                 acd : 'PUSHED TO MOBILE',
//                 ace : 'START'
//             },
//         {autoCommit: true},
//         function (err, result) {
//     if (err) { console.error(err.message);
//           doRelease(connection);
//           return;
//      }  

//      doRelease(connection);
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

//     res.json({Status:"Success",Message:"Added successfully", Data : {} ,Code:200}); 
//     }
// );
//     }


//  else if(group_detail.SMU_UKEY == 'OP-ACT3'){
// request.post(
//     'http://smart.johnsonliftsltd.com:3000/api/activity/update_opact3_score',
//     { json: req.body },
//     function (error, response, body) {
//         if (!error && response.statusCode == 200) {
//         }

// oracledb.getConnection({
//       user: "JLSMART",
//       password: "JLSMART",
//       connectString: "(DESCRIPTION =(ADDRESS = (PROTOCOL = TCP)(HOST = 192.168.1.112)(PORT = 1521))(CONNECT_DATA =(SID = jlpl)))"
// }, function(err, connection) {
// if (err) {
//     return;
// }
// connection.execute(
//     "UPDATE ESPD_OP_HDR set SMU_ACTIVITY_STATUS=:ac,SM_ACTIVITY_STATDATE=:dfd WHERE SMU_JOBNO=:jn and SMU_UKEY=:uk and SMU_ACTIVITY_STATUS IN (:acd,:ace)",
//             {
//                 ac: 'SUBMITTED',
//                 dfd: new Date(),
//                 jn : req.body.job_id,
//                 uk : 'OP-ACT3',
//                 acd : 'PUSHED TO MOBILE',
//                 ace : 'START'
//             },
//         {autoCommit: true},
//         function (err, result) {
//     if (err) { console.error(err.message);
//           doRelease(connection);
//           return;
//      }  

//      doRelease(connection);
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

//     res.json({Status:"Success",Message:"Added successfully", Data : {} ,Code:200}); 
//     }
// );
//     }



//  else if(group_detail.SMU_UKEY == 'OP-ACT7'){
// request.post(
//     'http://smart.johnsonliftsltd.com:3000/api/activity/update_opact7_score',
//     { json: req.body },
//     function (error, response, body) {
//         if (!error && response.statusCode == 200) {
//         }

// oracledb.getConnection({
//       user: "JLSMART",
//       password: "JLSMART",
//       connectString: "(DESCRIPTION =(ADDRESS = (PROTOCOL = TCP)(HOST = 192.168.1.112)(PORT = 1521))(CONNECT_DATA =(SID = jlpl)))"
// }, function(err, connection) {
// if (err) {
//     return;
// }
// connection.execute(
//     "UPDATE ESPD_OP_HDR set SMU_ACTIVITY_STATUS=:ac,SM_ACTIVITY_STATDATE=:dfd WHERE SMU_JOBNO=:jn and SMU_UKEY=:uk and SMU_ACTIVITY_STATUS IN (:acd,:ace)",
//             {
//                 ac: 'SUBMITTED',
//                 dfd: new Date(),
//                 jn : req.body.job_id,
//                 uk : 'OP-ACT7',
//                 acd : 'PUSHED TO MOBILE',
//                 ace : 'START'
//             },
//         {autoCommit: true},
//         function (err, result) {
//     if (err) { console.error(err.message);
//           doRelease(connection);
//           return;
//      }  

//      doRelease(connection);
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

//     res.json({Status:"Success",Message:"Added successfully", Data : {} ,Code:200}); 
//     }
// );
//     }




// else if(group_detail.SMU_UKEY == 'ESPD-ACT2'){
// request.post(
//     'http://smart.johnsonliftsltd.com:3000/api/activity/test_preciption',
//     { json: req.body },
//     function (error, response, body) {
//         if (!error && response.statusCode == 200) {
//         }

    
// oracledb.getConnection({
//       user: "JLSMART",
//       password: "JLSMART",
//       connectString: "(DESCRIPTION =(ADDRESS = (PROTOCOL = TCP)(HOST = 192.168.1.112)(PORT = 1521))(CONNECT_DATA =(SID = jlpl)))"
// }, function(err, connection) {
// if (err) {
//     return;
// }
// connection.execute(
//     "UPDATE ESPD_OP_HDR set SMU_ACTIVITY_STATUS=:ac,SM_ACTIVITY_STATDATE=:dfd WHERE SMU_JOBNO=:jn and SMU_UKEY=:uk and SMU_ACTIVITY_STATUS IN (:acd,:ace)",
//             {
//                 ac: 'SUBMITTED',
//                 dfd: new Date(),
//                 jn : req.body.job_id,
//                 uk : 'ESPD-ACT2',
//                 acd : 'PUSHED TO MOBILE',
//                 ace : 'START'

//             },
//         {autoCommit: true},
//         function (err, result) {
//     if (err) { console.error(err.message);
//           doRelease(connection);
//           return;
//      }

//      doRelease(connection);


//      res.json({Status:"Success",Message:"Added successfully", Data : {} ,Code:200}); 
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
//     }
// );
//     }
//     else if(group_detail.SMU_UKEY == 'ESPD-ACT1'){
// request.post(
//     'http://smart.johnsonliftsltd.com:3000/api/activity/insert_floorheight_detail',
//     { json: req.body },
//     function (error, response, body) {
//         if (!error && response.statusCode == 200) {
//         }
//          res.json({Status:"Success",Message:"Added successfully", Data : {} ,Code:200}); 
//     }
// );
//     } 
//     else if(group_detail.SMU_UKEY == 'ESPD-ACTIMF'){


//  request.post(
//     'http://smart.johnsonliftsltd.com:3000/api/activity/plumchart_data_update',
//     { json: req.body },
//     function (error, response, body) {
//         if (!error && response.statusCode == 200) {
//         }
//  oracledb.getConnection({
//       user: "JLSMART",
//       password: "JLSMART",
//       connectString: "(DESCRIPTION =(ADDRESS = (PROTOCOL = TCP)(HOST = 192.168.1.112)(PORT = 1521))(CONNECT_DATA =(SID = jlpl)))"
// }, function(err, connection) {
// if (err) {
//     return;
// }
// connection.execute(
//     "UPDATE ESPD_OP_HDR set SMU_ACTIVITY_STATUS=:ac,SM_ACTIVITY_STATDATE=:dfd WHERE SMU_JOBNO=:jn and SMU_UKEY=:uk and SMU_ACTIVITY_STATUS IN (:acd,:ace)",
//             {
//                 ac: 'SUBMITTED',
//                 dfd: new Date(),
//                 jn : req.body.job_id,
//                 uk : 'ESPD-ACT1',
//                 acd : 'PUSHED TO MOBILE',
//                 ace : 'START'
//             },
//         {autoCommit: true},
//         function (err, result) {    
//     if (err) { console.error(err.message);
//           doRelease(connection);
//           return;
//      }  
        
//      doRelease(connection);
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
   
//     res.json({Status:"Success",Message:"Added successfully", Data : {} ,Code:200}); 
//     }
//     );
//       // res.json({Status:"Success",Message:"Added successfully", Data : {} ,Code:200}); 
//     } 
//   else{
//     oracledb.getConnection({
//       user: "JLSMART",
//       password: "JLSMART",
//       connectString: "(DESCRIPTION =(ADDRESS = (PROTOCOL = TCP)(HOST = 192.168.1.112)(PORT = 1521))(CONNECT_DATA =(SID = jlpl)))"
// }, function(err, connection) {
// if (err) {
//     return;
// }
// connection.execute(
//     "UPDATE ESPD_OP_HDR set SMU_ACTIVITY_STATUS=:ac,SM_ACTIVITY_STATDATE=:dfd WHERE SMU_JOBNO=:jn and SMU_UKEY=:uk and SMU_ACTIVITY_STATUS IN (:acd,:ace)",
//             {
//                 ac: 'SUBMITTED',
//                 dfd: new Date(),
//                 jn : req.body.job_id,
//                 uk : group_detail.SMU_UKEY,
//                 acd : 'PUSHED TO MOBILE',
//                 ace : 'START'
//             },
//         {autoCommit: true},
//         function (err, result) {
//     if (err) { console.error(err.message);
//           doRelease(connection);
//           return;
//      }   
//      doRelease(connection);
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
//     res.json({Status:"Success",Message:"Added successfully", Data : {} ,Code:200}); 
//   }
//         });
// }
// catch(e){
//     res.json({Status:"Failed",Message:"Internal Server Error", Data : {},Code:500});
// }

//  }

// });






// ******************************************************************************************************


router.post('/create', async function(req, res) {
console.log("**************************  OPERATION INSERTING");
// *********************************************************************
// SESSION CHECK 
// *********************************************************************
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
                if(+ary[0].USER_LIMIT <  20) {
                 console.log("**************************  OPERATION INSERTING STARTING");

                if(req.body.group_id == ""){
                      res.json({Status:"Failed",Message:"Group id not Selected Properly", Data : {} ,Code:404}); 
                }
                else {
                	 insert(req);
                }

               
              } else {
                console.log("**************************  OPERATION SESSION NOT AVAILABLE");
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
// *********************************************************************


async function insert(req) {
  





  // console.log(req.body);

    var user_details  =  await user_management.findOne({_id:req.body.user_id});
    var group_detail  =  await new_group_listModel.findOne({_id:req.body.group_id});
    

    // console.log("group_detail",group_detail);



    if(req.body.created_by == 'ESPD-ACTIMF'){
        group_detail = {SMU_UKEY:'ESPD-ACTIMF'};
    }

// *********************************************************************
// ESPD-ACT3 INSERT 
// *********************************************************************

if(group_detail.SMU_UKEY == 'ESPD-ACT3'){

  console.log("**************************  OPERATION ESPD-ACT3 SPECVERIFY4492 INSERT");  
    var temp_count = req.body.Data;
    var index = 0;
    recall(index,req,temp_count);
    function recall(index,req,temp_count){
        var a = index;
        if(index < temp_count.length){
          oracledb.getConnection({
              user: "JLSMART",
              password: "JLSMART",
              connectString: "(DESCRIPTION =(ADDRESS = (PROTOCOL = TCP)(HOST = 192.168.1.112)(PORT = 1521))(CONNECT_DATA =(SID = jlpl)))"
          }, function(err, connection) {
            if (err) {
                console.error(err.message);
                return;
            }
            var string = temp_count[a]._id.split(",");
            let da = {
              OM_GSPA_JOBNO : string[0],
              OM_GSPA_SLNO : +string[1] || 0,
              OM_GSPA_LCODE : string[2],
              OM_GSPA_LPCODE : ""+string[3],
              OM_GSPA_LCSLNO : 0,
              OM_GSPA_SPLDESC : string[5],
              OM_GSPA_VALUE  : string[6],
              OM_GSPA_REVNO : 3,
              OM_GSPA_REVDT : '15-MAR-2018',
              OM_GSPA_DEPTSTATUS : 'Y',
          }
          connection.execute(
            "INSERT INTO SPECVERIFY4492 VALUES (:OM_GSPA_JOBNO, :OM_GSPA_SLNO, :OM_GSPA_LCODE, :OM_GSPA_LPCODE, :OM_GSPA_LCSLNO, :OM_GSPA_SPLDESC, :OM_GSPA_VALUE, :OM_GSPA_REVNO, :OM_GSPA_REVDT, :OM_GSPA_DEPTSTATUS)",
              da, // Bind values
              { autoCommit: true}, 
              async  function (err, result) {
                if (err) { console.error(err.message);
                 let a = {
                  "job_no" : req.body.job_id || '',
                  "service_type" : "Operation",
                  "activity" : "ESPD-ACT3",
                  "follow_detail":"SPECVERIFY4492",
                  "url":"/data_store",
                  "date_time" : new Date(),
                  "error_detail": [err.toString()],
                  "data" : [req.body],
                  "user_no" : req.body.user_id 
              }   
              var submitted = await error_log_oracelModel.create(a);
              doRelease(connection);
              return;
          }
          index = index + 1;
          recall(index,req,temp_count);
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
      else {

        console.log("**************************  OPERATION ESPD-ACT3 ESPD_OP_HRD UPDATE");  

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
    "UPDATE ESPD_OP_HDR set SMU_ACTIVITY_STATUS=:ac,SM_ACTIVITY_STATDATE=:dfd WHERE SMU_JOBNO=:jn and SMU_UKEY=:uk and SMU_ACTIVITY_STATUS IN (:acd,:ace)",
    {
        ac: 'SUBMITTED',
        dfd: new Date(),
        jn : req.body.job_id,
        uk : 'ESPD-ACT3',
        acd : 'PUSHED TO MOBILE',
        ace : 'START'
    },
    {autoCommit: true},
    function (err, result) {
        if (err) { console.error(err.message);
          doRelease(connection);
          return;
      }
      doRelease(connection);

      res.json({Status:"Success",Message:"Added successfully", Data : {} ,Code:200}); 
// *********************************************************************
// MONGO DB INSERT 
// *********************************************************************
console.log("**************************  OPERATION ESPD-ACT3 MONGO DB INSERT");
request.post(
    'http://smart.johnsonliftsltd.com:3000/api/data_store_management/mongo_insert_data',
    { json: req.body },
    function (error, response, body) {
        if (!error && response.statusCode == 200) {
        }
    });
// *********************************************************************

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
// *********************************************************************




else if(group_detail.SMU_UKEY == 'OP-ACT1'){

console.log("**************************  OPERATION OP-ACT1 PLMCHRT_HDR INSERT");     
    var datas = req.body.Data;
    var user_details = await user_management.findOne({_id:req.body.user_id});
// ********************************* OP-ACT1 HRD INSERT START
oracledb.getConnection({
  user: "JLSMART",
  password: "JLSMART",
  connectString: "(DESCRIPTION =(ADDRESS = (PROTOCOL = TCP)(HOST = 192.168.1.112)(PORT = 1521))(CONNECT_DATA =(SID = jlpl)))"
}, function(err, connection) {
    if (err) {
        console.error(err.message);
        return;
    }
    var todayDate = new Date().toISOString().slice(0, 10);
    const myArray1 = todayDate.split("-");
    const myArray = req.body.date_of_update.split(" - ");
    var month_list = ["", "Jan", "Feb", "Mar", "Apr", "May", "Jun" ,"Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    var da = {
        JL_PCH_JOBNO : req.body.job_id,
        JL_PCH_BKTTYP : myArray[1],
        JL_PCH_MOBNO : +req.body.date_of_create,
        JL_PCH_PREPBY : +user_details.user_id,
        JL_PCH_PREPDT : ""+myArray1[2]+"-"+month_list[+myArray1[1]]+"-"+myArray1[0]
    }
    connection.execute(
       "INSERT INTO PLMCHRT_HDR VALUES (:JL_PCH_JOBNO, :JL_PCH_BKTTYP, :JL_PCH_MOBNO, :JL_PCH_PREPBY, :JL_PCH_PREPDT)",
            da, // Bind values
            {autoCommit: true},
            async    function (err, result) {
                if (err) { console.error(err.message);

                  let a = {
                      "job_no" : req.body.job_id || '',
                      "service_type" : "Operation",
                      "activity" : "OP-ACT1",
                      "follow_detail":"PLMCHRT_HDR",
                      "url":"/plumchar_entry",
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
              function doRelease(connection) {
               connection.release(function(err) {
                 if (err) {
                  console.error(err.message);
              }
          }
          );
           }
           second_stage(myArray,req);   
       });
});
// ********************************* OP-ACT1 HRD INSERT END


// ********************************* OP-ACT1 DTL INSERT START
function second_stage(myArray,req){
console.log("**************************  OPERATION OP-ACT1 PLMCHRT_DTL INSERT");   
    var count = 0;
    let index = 0;
    recall(index , myArray);
    function recall(index, myArray){
        if(index < datas.length){
           count = count + 1;
           oracledb.getConnection({
              user: "JLSMART",
              password: "JLSMART",
              connectString: "(DESCRIPTION =(ADDRESS = (PROTOCOL = TCP)(HOST = 192.168.1.112)(PORT = 1521))(CONNECT_DATA =(SID = jlpl)))"
          }, function(err, connection) {
            if (err) {
                console.error(err.message);
                return;
            }
            let temp =  {
                JL_PCD_JOBNO : req.body.job_id,
                JL_PCD_SLNO : +count,
                JL_PCD_DIMX1 : +datas[index].dimx_one,
                JL_PCD_DIMX2  : +datas[index].dimx_two,
                JL_PCD_DIMX3  : +datas[index].dimx_three,
                JL_PCD_DIMX4 : +datas[index].dimx_four,
                JL_PCD_DIMY1  : +datas[index].dimy_one,
                JL_PCD_DIMY2  : +datas[index].dimy_two,
                JL_PCD_REMARKS : ""+datas[index].remarks,
                JL_PCH_BKTTYP : myArray[1],
            }
            connection.execute(
                "INSERT INTO PLMCHRT_DTL VALUES (:JL_PCD_JOBNO, :JL_PCD_SLNO, :JL_PCD_DIMX1, :JL_PCD_DIMX2, :JL_PCD_DIMX3, :JL_PCD_DIMX4, :JL_PCD_DIMY1, :JL_PCD_DIMY2, :JL_PCD_REMARKS, :JL_PCH_BKTTYP)",
            temp, // Bind values
            {autoCommit: true},
            async    function (err, result) {
                if (err) { console.error(err.message);

                    let a = {
                      "job_no" : req.body.job_id || '',
                      "service_type" : "Operation",
                      "activity" : "OP-ACT1",
                      "follow_detail":"PLMCHRT_DTL",
                      "url":"/plumchar_entry",
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
              function doRelease(connection) {
                 connection.release(function(err) {
                   if (err) {
                      console.error(err.message);
                  }
              }
              );
             }
             index = index + 1;
             recall(index,myArray);
         });
        });
       } else {

// ********************************* STATUS UPDATE ORACLE START
console.log("**************************  OPERATION OP-ACT1  ESPD_OP_HRD UPDATE");  
oracledb.getConnection({
  user: "JLSMART",
  password: "JLSMART",
  connectString: "(DESCRIPTION =(ADDRESS = (PROTOCOL = TCP)(HOST = 192.168.1.112)(PORT = 1521))(CONNECT_DATA =(SID = jlpl)))"
}, function(err, connection) {
    if (err) {
        return;
    }
    connection.execute(
        "UPDATE ESPD_OP_HDR set SMU_ACTIVITY_STATUS=:ac,SM_ACTIVITY_STATDATE=:dfd WHERE SMU_JOBNO=:jn and SMU_UKEY=:uk and SMU_ACTIVITY_STATUS IN (:acd,:ace)",
        {
            ac: 'SUBMITTED',
            dfd: new Date(),
            jn : req.body.job_id,
            uk : 'OP-ACT1',
            acd : 'PUSHED TO MOBILE',
            ace : 'START'
        },
        {autoCommit: true},
        function (err, result) {
            if (err) { console.error(err.message);
              doRelease(connection);
              return;
          }  
          doRelease(connection);
          res.json({Status:"Success",Message:"Successfully Submitted, Go Back and Check the List", Data : {} ,Code:200});

// ********************************* MONGO DB INSERT START
console.log("**************************  OPERATION OP-ACT1 MONGO DB INSERT");
request.post(
    'http://smart.johnsonliftsltd.com:3000/api/data_store_management/mongo_insert_data',
    { json: req.body },
    function (error, response, body) {
        if (!error && response.statusCode == 200) {
        }
    });
// ********************************* MONGO DB INSERT END

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
// ********************************* STATUS UPDATE ORACLE END
}
}
}
// ********************************* OP-ACT1 DTL INSERT END
}
// ************************************************




else if(group_detail.SMU_UKEY == 'ESPD-ACT4'){
console.log("**************************  OPERATION ESPD-ACT4 JLSMART_MATMCR_PHOTO INSERT");  
// ********************************* ESPD-ACT4 INSERT START

var photo1 = "";
var photo2 = "";
var photo3 = "";
req.body.Data.forEach(element => {
  if(element.field_name == 'MCR REPORT PHOTO'){
   photo1 = (""+element.field_value).slice(50);
}else if(element.field_name == 'PHOTO AFTER REMOVING COVER'){
   photo2 = (""+element.field_value).slice(50);
}else if(element.field_name == 'LORRY WITH NUMBER PLATE PHOTO'){
   photo3 = (""+element.field_value).slice(50);
}
});
var blog1 = fetchblog(photo1);
var blog2 = fetchblog(photo2);
var blog3 = fetchblog(photo3);
function fetchblog(filepath) {
    var path = require('path');       
    var fs = require('fs');
    var source = fs.readFileSync('/home/smart/johnson_application/public/uploads/'+filepath);
    return source;
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
    var temp = {
        JLS_JMP_JOBNO : req.body.job_id,
        JLS_JMP_PHOTO1 : blog1,
        JLS_JMP_PHOTO2 : blog2,
        JLS_JMP_PHOTO3 : blog3
    }
    connection.execute(
        "INSERT INTO JLSMART_MATMCR_PHOTO VALUES (:JLS_JMP_JOBNO, :JLS_JMP_PHOTO1, :JLS_JMP_PHOTO2, :JLS_JMP_PHOTO3)",
            temp, // Bind values
            {autoCommit: true},
            async    function (err, result) {
                if (err) { console.error(err.message);
                 let a = {
                  "job_no" : req.body.job_id || '',
                  "service_type" : "Operation",
                  "activity" : "ESPD-ACT4",
                  "follow_detail":"JLSMART_MATMCR_PHOTO",
                  "url":"/upload_photo_act_four",
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

// ********************************* STATUS UPDATE ORACLE START
console.log("**************************  OPERATION ESPD-ACT4 ORACLE UPDATE");
oracledb.getConnection({
  user: "JLSMART",
  password: "JLSMART",
  connectString: "(DESCRIPTION =(ADDRESS = (PROTOCOL = TCP)(HOST = 192.168.1.112)(PORT = 1521))(CONNECT_DATA =(SID = jlpl)))"
}, function(err, connection) {
    if (err) {
        return;
    }
    connection.execute(
        "UPDATE ESPD_OP_HDR set SMU_ACTIVITY_STATUS=:ac,SM_ACTIVITY_STATDATE=:dfd WHERE SMU_JOBNO=:jn and SMU_UKEY=:uk and SMU_ACTIVITY_STATUS IN (:acd,:ace)",
        {
            ac: 'SUBMITTED',
            dfd: new Date(),
            jn : req.body.job_id,
            uk : 'ESPD-ACT4',
            acd : 'PUSHED TO MOBILE',
            ace : 'START'
        },
        {autoCommit: true},
        function (err, result) {
            if (err) { console.error(err.message);
              doRelease(connection);
              return;
          }  

          doRelease(connection);

          res.json({Status:"Success",Message:"Successfully Submitted", Data : {} ,Code:200});

                       // ********************************* MONGO DB INSERT START
                       console.log("**************************  OPERATION ESPD-ACT4 MONGO INSERT");
                       request.post(
                        'http://smart.johnsonliftsltd.com:3000/api/data_store_management/mongo_insert_data',
                        { json: req.body },
                        function (error, response, body) {
                            if (!error && response.statusCode == 200) {
                            }
                        });
// ********************************* MONGO DB INSERT END

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

// ********************************* STATUS UPDATE ORACLE END

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

// ************************************************



else if(group_detail.SMU_UKEY == 'OP-ACT3'){

console.log("**************************  OPERATION OP-ACT3 ESPD_OP_HDR UPDATE SCORE");    

// ********************************* OP-ACT3 DTL INSERT START
var user_details  =  await user_management.findOne({_id:req.body.user_id});
var SMU_SAFSCORE = 0;
var acount = 0;
var bcount = 0;
var ccount = 0;
var dcount = 0;
var nacount = 0;
req.body.Data.forEach(element => {

  if(element.field_value == 'A'){
    acount = acount +  0;
}if(element.field_value == 'B'){
    bcount = bcount +  1;
}if(element.field_value == 'C'){
    ccount = ccount +  1.5;
}if(element.field_value == 'D'){
    dcount = dcount +  2.5;
}if(element.field_value == 'NA'){
    nacount = nacount +  2.5;
}
if(element.field_name == 'Total Score'){
    SMU_SAFSCORE = +element.field_value;
}
if(element.field_name == 'Additional Remarks'){
    element.field_value = "A = "+acount,"B = "+bcount,"C = "+ccount,"D = "+dcount,"NA = "+nacount+""+"A = "+0,"B = "+bcount/1,"C = "+ccount/1.5,"D = "+dcount/2.5,"NA = "+nacount/2.5;
}
});
var total_values = acount + bcount + ccount + dcount + nacount;
SMU_SAFSCORE = +total_values;
var SMU_JOBNO = req.body.job_id;
var SMU_TECHMOBNO = user_details.user_id
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
    "UPDATE ESPD_OP_HDR set SMU_SAFSCORE=:SMU_SAFSCORE WHERE SMU_TECHMOBNO=:SMU_TECHMOBNO and SMU_JOBNO=:SMU_JOBNO and SMU_UKEY=:SMU_UKEY",
    {
        SMU_SAFSCORE : +SMU_SAFSCORE,
        SMU_TECHMOBNO : SMU_TECHMOBNO,
        SMU_JOBNO : SMU_JOBNO,
        SMU_UKEY : 'OP-ACT3',
    },
    {autoCommit: true},
    async function (err, result_one) {
        if (err) { console.error(err.message);

           let a = {
              "job_no" : SMU_JOBNO || '',
              "service_type" : "Operation",
              "activity" : "OP-ACT3",
              "follow_detail":"ESPD_OP_HDR UPDATE",
              "url":"/update_opact3_score",
              "date_time" : new Date(),
              "error_detail": [err.toString()],
              "data" : [req.body],
              "user_no" : SMU_TECHMOBNO
          }   
          var submitted = await error_log_oracelModel.create(a);
          doRelease(connection);
          return;
      }
      doRelease(connection);


// ********************************* STATUS UPDATE ORACLE START

console.log("**************************  OPERATION OP-ACT3 ESPD_OP_HDR UPDATE");    

oracledb.getConnection({
  user: "JLSMART",
  password: "JLSMART",
  connectString: "(DESCRIPTION =(ADDRESS = (PROTOCOL = TCP)(HOST = 192.168.1.112)(PORT = 1521))(CONNECT_DATA =(SID = jlpl)))"
}, function(err, connection) {
    if (err) {
        return;
    }
    connection.execute(
        "UPDATE ESPD_OP_HDR set SMU_ACTIVITY_STATUS=:ac,SM_ACTIVITY_STATDATE=:dfd WHERE SMU_JOBNO=:jn and SMU_UKEY=:uk and SMU_ACTIVITY_STATUS IN (:acd,:ace)",
        {
            ac: 'SUBMITTED',
            dfd: new Date(),
            jn : req.body.job_id,
            uk : 'OP-ACT3',
            acd : 'PUSHED TO MOBILE',
            ace : 'START'
        },
        {autoCommit: true},
        function (err, result) {
            if (err) { console.error(err.message);
              doRelease(connection);
              return;
          }  
          doRelease(connection);
          res.json({Status:"Success",Message:"Added successfully", Data : {} ,Code:200}); 
                    // ********************************* MONGO DB INSERT START
                    console.log("**************************  OPERATION OP-ACT3 MONGO INSERT"); 
                    request.post(
                        'http://smart.johnsonliftsltd.com:3000/api/data_store_management/mongo_insert_data',
                        { json: req.body },
                        function (error, response, body) {
                            if (!error && response.statusCode == 200) {
                            }
                        });
                    // ********************************* MONGO DB INSERT END
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

// ********************************* STATUS UPDATE ORACLE END

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

// ************************************************

else if(group_detail.SMU_UKEY == 'OP-ACT7'){


 console.log("**************************  OPERATION OP-ACT7 ESPD_OP_HDR UPDATE SCORE"); 


// ********************************* OP-ACT7 SCORE INSERT START

var user_details  =  await user_management.findOne({_id:req.body.user_id});
var SMU_SAFSCORE = 0;
var acount = 0;
var bcount = 0;
var ccount = 0;
var dcount = 0;
var nacount = 0;
req.body.Data.forEach(element => {
    if(element.field_name == 'Total Score'){
        SMU_SAFSCORE = +element.field_value;
    }
});
SMU_SAFSCORE = +SMU_SAFSCORE;
var SMU_JOBNO = req.body.job_id;
var SMU_TECHMOBNO = user_details.user_id;
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
    "UPDATE ESPD_OP_HDR set SMU_SAFSCORE=:SMU_SAFSCORE WHERE SMU_TECHMOBNO=:SMU_TECHMOBNO and SMU_JOBNO=:SMU_JOBNO and SMU_UKEY=:SMU_UKEY",
    {
        SMU_SAFSCORE : +SMU_SAFSCORE,
        SMU_TECHMOBNO : SMU_TECHMOBNO,
        SMU_JOBNO : SMU_JOBNO,
        SMU_UKEY : 'OP-ACT7',
    },
    {autoCommit: true},
    async    function (err, result_one) {
        if (err) { console.error(err.message);
            let a = {
                "job_no" : SMU_JOBNO || '',
                "service_type" : "Operation",
                "activity" : "OP-ACT7",
                "follow_detail":"ESPD_OP_HDR UPDATE",
                "url":"/update_opact7_score",
                "date_time" : new Date(),
                "error_detail": [err.toString()],
                "data" : [req.body],
                "user_no" : SMU_TECHMOBNO,
            }   
            var submitted = await error_log_oracelModel.create(a);
            doRelease(connection);
            return;
        }
        doRelease(connection);

// ********************************* STATUS UPDATE ORACLE START
 console.log("**************************  OPERATION OP-ACT7 ESPD_OP_HDR UPDATE"); 
oracledb.getConnection({
    user: "JLSMART",
    password: "JLSMART",
    connectString: "(DESCRIPTION =(ADDRESS = (PROTOCOL = TCP)(HOST = 192.168.1.112)(PORT = 1521))(CONNECT_DATA =(SID = jlpl)))"
}, function(err, connection) {
    if (err) {
        return;
    }
    connection.execute(
        "UPDATE ESPD_OP_HDR set SMU_ACTIVITY_STATUS=:ac,SM_ACTIVITY_STATDATE=:dfd WHERE SMU_JOBNO=:jn and SMU_UKEY=:uk and SMU_ACTIVITY_STATUS IN (:acd,:ace)",
        {
            ac: 'SUBMITTED',
            dfd: new Date(),
            jn : req.body.job_id,
            uk : 'OP-ACT7',
            acd : 'PUSHED TO MOBILE',
            ace : 'START'
        },
        {autoCommit: true},
        function (err, result) {
            if (err) { console.error(err.message);
                doRelease(connection);
                return;
            }  
            doRelease(connection);
res.json({Status:"Success",Message:"Added successfully", Data : {} ,Code:200}); 
// ********************************* MONGO DB INSERT START
 console.log("**************************  OPERATION OP-ACT7 MONGO INSERT"); 
request.post(
    'http://smart.johnsonliftsltd.com:3000/api/data_store_management/mongo_insert_data',
    { json: req.body },
    function (error, response, body) {
        if (!error && response.statusCode == 200) {
        }
    });
// ********************************* MONGO DB INSERT END

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

 // ********************************* STATUS UPDATE ORACLE END

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

// ********************************* OP-ACT7 SCORE INSERT END

}

// ************************************************


else if(group_detail.SMU_UKEY == 'ESPD-ACT2'){

 console.log("**************************  OPERATION ESPD-ACT2 OM_BMM_MAILID FIND"); 

// ********************************* ESPD-ACT2 FETCH MAIL ID
var user_details = await user_management.findOne({_id:req.body.user_id});
var branch_name = '';
var customer_name = '';
var customer_address = '';
var customer_email_address = '';
var cc_list = "";
step_1(req,user_details,branch_name,customer_name,customer_address,customer_email_address,cc_list);
function step_1(req,user_details,branch_name,customer_name,customer_address,customer_email_address,cc_list){
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
        "SELECT OM_BMM_MAILID FROM OM_BRKDOWNMAIL_MST , OM_ORDMAST_HDR WHERE OM_ORH_JOBNO =:ln AND OM_ORH_SERBRCODE = OM_BMM_BRCODE and OM_BMM_ETYPE = 'O'AND OM_BMM_STATUS = 'A'AND ROWNUM < 3",
        {ln:req.body.job_id},
        {autoCommit: true},
        function (err, result1) {
            if (err) { console.error(err.message);
              doRelease(connection);
              return;
          }
          doRelease(connection);
          let temp_data = result1.rows;
          temp_data.forEach(element => {
      cc_list = cc_list + element[0] +"," //final_value
  });
          step_2(req,user_details,branch_name,customer_name,customer_address,customer_email_address, cc_list);
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

// ********************************* ESPD-ACT2 FETCH JOB ADDRESS ID
 console.log("**************************  OPERATION ESPD-ACT2 FETCH JOB ADDRESS ID"); 
function step_2(req,user_details,branch_name,customer_name,customer_address,customer_email_address, cc_list) {
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
        "SELECT DBSOM_GET_JOBADDRESS(:ln,'OI') INSADR, DBSOM_GET_JLSMARTADDR(:ln,'C') CUSADD, DBSOM_GET_JOBADDRESS(:ln,'OB') BRANCNAME, DBSOM_GET_JLSMARTADDR(:ln,'C') BRADD FROM DUAL",
        {ln:req.body.job_id},
        {autoCommit: true},
        function (err, result) {
            if (err) { console.error(err.message);
              doRelease(connection);
              return;
          }
          doRelease(connection);
          var add_list = result.rows[0];
          branch_name = add_list[2];
          customer_address = "";
          var string = add_list[1].split("\n");
          for(let c = 0 ; c < string.length;c++){
              if(c !== 0){
                customer_address = customer_address + string[c]+", ";
            } 
        }
        customer_name = string[0];
        step_3(req,user_details,branch_name, customer_name, customer_address,customer_email_address, cc_list ,branch_name);
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

// ********************************* ESPD-ACT2 FILTERING 'NO' VALUE
 console.log("**************************  OPERATION ESPD-ACT2 'NO' VALUE"); 
function step_3(req,user_details,branch_name, customer_name, customer_address,customer_email_address, cc_list, branch_name){
   let data = req.body.Data;
   var remarks = "";
   var signature = "";
   var signed_by = "";
   var signed_role = "";
   var final_data = [];
   for(let a = 0 ; a < data.length;a++){
     if(data[a].field_type == "Dropdown" && data[a].field_value == "No"){
         final_data.push(
         {
             sno : final_data.length + 1,
             task : data[a].field_comments,
             status :"No"
         }
         )
     }
     if(data[a].field_type == "Signature"){
        signature = data[a].field_value
    }
    if(data[a].field_name == "Customer Designation"){
        signed_role = data[a].field_value
    }
    if(data[a].field_name == "Customer Name"){
        signed_by = data[a].field_value
    }
    if(data[a].field_name == "Remarks"){
        remarks = data[a].field_value
    }
    if(data[a].field_name == "Customer email"){
        customer_email_address = data[a].field_value
    }
    if(a == data.length - 1){
      step_4(req,user_details,branch_name, customer_name, customer_address,customer_email_address, cc_list, data , branch_name ,signature , signed_role , signed_by , remarks, customer_email_address , final_data);
  }
}
}

// ********************************* ESPD-ACT2 PDF GENERATE AND INSERT ORACLE
 console.log("**************************  OPERATION ESPD-ACT2 PDF GENERATE AND INSERT ORACLE"); 
async function step_4(req,user_details,branch_name, customer_name, customer_address,customer_email_address, cc_list, data , branch_name ,signature , signed_role , signed_by , remarks, customer_email_address, final_data) {
   var datas = {
    branch_name : branch_name,
    job_no : req.body.job_id,
    date_of_create : ""+new Date(),
    customer_name : customer_name,
    customer_address : customer_address,
    remarks : remarks,
    signature : signature,
    signed_by : signed_by,
    signed_role : signed_role,
    taskdetails : final_data
};
var pdfpath = await pdfgeneratorHelper.pdfgenerator(datas);
var mystr = (""+pdfpath).slice(62);
mystr = "/public/prescriptions"+mystr;
var path = require('path');       
var fs = require('fs');
var source = fs.readFileSync(__dirname+mystr);
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
     `INSERT INTO JLSMART_BLDRNOTE (JL_TECHMOBILE, JL_JOBNO, JL_BLDRPDF, JL_CUSTEMAIL) VALUES (:JL_TECHMOBILE, :JL_JOBNO, :JL_BLDRPDF, :JL_CUSTEMAIL)`,
     { JL_TECHMOBILE: +user_details.user_id,
        JL_JOBNO: req.body.job_id,
        JL_BLDRPDF : source,
        JL_CUSTEMAIL : customer_email_address},
        {autoCommit: true},
        async function (err, result1) {
            if (err) { console.error(err.message);
            	 res.json({Status:"Failed",Message:"ENTER VALID MAIL ID", Data : {} ,Code:404});
                doRelease(connection);
                return;
                let a = {
                  "job_no" : req.body.job_id || '',
                  "service_type" : "Operation",
                  "activity" : "ESPD-ACT2",
                  "follow_detail":"JLSMART_BLDRNOTE",
                  "url":"/test_preciption",
                  "date_time" : new Date(),
                  "error_detail": [err.toString()],
                  "data" : [req.body],
                  "user_no" : ""
              }   
              var submitted = await error_log_oracelModel.create(a);


          }
          doRelease(connection);
// ********************************* STATUS UPDATE ORACLE START     
 console.log("**************************  OPERATION ESPD-ACT2 UPDATE ORACLE");    
oracledb.getConnection({
  user: "JLSMART",
  password: "JLSMART",
  connectString: "(DESCRIPTION =(ADDRESS = (PROTOCOL = TCP)(HOST = 192.168.1.112)(PORT = 1521))(CONNECT_DATA =(SID = jlpl)))"
}, function(err, connection) {
    if (err) {
        return;
    }
    connection.execute(
        "UPDATE ESPD_OP_HDR set SMU_ACTIVITY_STATUS=:ac,SM_ACTIVITY_STATDATE=:dfd WHERE SMU_JOBNO=:jn and SMU_UKEY=:uk and SMU_ACTIVITY_STATUS IN (:acd,:ace)",
        {
            ac: 'SUBMITTED',
            dfd: new Date(),
            jn : req.body.job_id,
            uk : 'ESPD-ACT2',
            acd : 'PUSHED TO MOBILE',
            ace : 'START'

        },
        {autoCommit: true},
        function (err, result) {
            if (err) { console.error(err.message);
              doRelease(connection);
              return;
          }
          doRelease(connection);
          res.json({Status:"Success",Message:"Added successfully", Data : {} ,Code:200}); 

// ********************************* MONGO DB INSERT START
 console.log("**************************  OPERATION ESPD-ACT2 MONGO INSERT");    
request.post(
    'http://smart.johnsonliftsltd.com:3000/api/data_store_management/mongo_insert_data',
    { json: req.body },
    function (error, response, body) {
        if (!error && response.statusCode == 200) {
        }
    });
// ********************************* MONGO DB INSERT END
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

// ************************************************


else if(group_detail.SMU_UKEY == 'ESPD-ACT1'){

console.log("**************************  OPERATION ESPD-ACT1 JLSMART_FLOORHEIGHT_DATA INSERT"); 

// ********************************* ESPD-ACT1 DELTE EXISTING
request.post(
    'http://smart.johnsonliftsltd.com:3000/api/activity/delete_lift_well_data',
    { json: {"job_id":req.body.job_id}
},
function (error, response, body) {
    if (!error && response.statusCode == 200) {
        recall(req);
    }

}
);

// ********************************* ESPD-ACT1 FLOOR HEIGHT INSERT

function recall(req){
    var JOBNO = req.body.job_id;
    var CLEAR_WIDTH = 0;
    var CLEAR_DEPTH = 0;
    var BEAM_PROJECTION = "";
    var THROUGH_CAR = "";
    var FLOOR_BEAM_HEIGHT = 0;
    var CLEAR_OPENING_HEIGHT= 0;
    var LEFT_WALL_THICKNESS= 0;
    var RIGHT_WALL_THICKNESS = 0;
    var BACK_WALL_THICKNESS= 0;
    var FRONT_WALL_THICKNESS = 0;
    var LEFT_WALL_TYPE = "";
    var RIGHT_WALL_TYPE = "";
    var BACK_WALL_TYPE = "";
    var FRONT_WALL_TYPE = "";
    var TERRACE_NAME = "";
    var GROUND_FLOOR_NAME = "";
    var TOTAL_TRAVEL = 0;
    var PIT_HEIGHT = 0;
    var HEAD_ROOM_HEIGHT = 0;
    var MACHINE_ROOM_HEIGHT = 0;
    var DUPLEX_BOX_COVER = "";
    var DUPLEX_JOB = req.body.job_id;
    var NO_OF_BASEMENT_FLOORS = "";
    var PIT_WALLTYPE = "";
    var SITE_UPLOAD = "";
    var SITE_UPLOAD2 = "";
    var REMARKS = "";
    var ENT_WALL_OPEN = 0;
    var BELOW_LINTAL_HT = 0;
    var FRONT_WALL_RECESS = 0;
    var LAST_FLR_HEIGHT = 0;
    var NO_OF_FLRSERVED = 0;
    var HANDAG = "";
    var PLUMB_READING = "";
    var temp_data = req.body.Data;
    var final_temp_data = [];
    for(let a = 0 ; a < temp_data.length ; a++){
      if(temp_data[a].field_type == 'Lift' && temp_data[a].field_value == 'LIFT'){
         final_temp_data = temp_data[a].lift_list
     } else {
      if(temp_data[a].field_comments == 'CLEAR_WIDTH'){
       CLEAR_WIDTH = temp_data[a].field_value;
   }else if(temp_data[a].field_comments == 'CLEAR_DEPTH'){
       CLEAR_DEPTH = temp_data[a].field_value;
   }else if(temp_data[a].field_comments == 'BEAM_PROJECTION'){
       BEAM_PROJECTION = temp_data[a].field_value;
   }else if(temp_data[a].field_comments == 'THROUGH_CAR'){
       THROUGH_CAR = temp_data[a].field_value;
   }else if(temp_data[a].field_comments == 'FLOOR_BEAM_HEIGHT'){
       FLOOR_BEAM_HEIGHT = temp_data[a].field_value;
   }else if(temp_data[a].field_comments == 'CLEAR_OPENING_HEIGHT'){
       CLEAR_OPENING_HEIGHT = temp_data[a].field_value;
   }else if(temp_data[a].field_comments == 'LEFT_WALL_THICKNESS'){
       LEFT_WALL_THICKNESS = temp_data[a].field_value;
   }else if(temp_data[a].field_comments == 'RIGHT_WALL_THICKNESS'){
       RIGHT_WALL_THICKNESS = temp_data[a].field_value;
   }else if(temp_data[a].field_comments == 'BACK_WALL_THICKNESS'){
       BACK_WALL_THICKNESS = temp_data[a].field_value;
   }else if(temp_data[a].field_comments == 'FRONT_WALL_THICKNESS'){
       FRONT_WALL_THICKNESS = temp_data[a].field_value;
   }else if(temp_data[a].field_comments == 'LEFT_WALL_TYPE'){
       LEFT_WALL_TYPE = temp_data[a].field_value;
   }else if(temp_data[a].field_comments == 'RIGHT_WALL_TYPE'){
       RIGHT_WALL_TYPE = temp_data[a].field_value;
   }else if(temp_data[a].field_comments == 'BACK_WALL_TYPE'){
       BACK_WALL_TYPE = temp_data[a].field_value;
   }else if(temp_data[a].field_comments == 'FRONT_WALL_TYPE'){
       FRONT_WALL_TYPE = temp_data[a].field_value;
   }else if(temp_data[a].field_comments == 'TERRACE_NAME'){
       TERRACE_NAME = temp_data[a].field_value;
   }else if(temp_data[a].field_comments == 'GROUND_FLOOR_NAME'){
       GROUND_FLOOR_NAME = temp_data[a].field_value;
   }else if(temp_data[a].field_comments == 'TOTAL_TRAVEL'){
       TOTAL_TRAVEL = temp_data[a].field_value;
   }else if(temp_data[a].field_comments == 'PIT_HEIGHT'){
       PIT_HEIGHT = temp_data[a].field_value;
   }else if(temp_data[a].field_comments == 'HEAD_ROOM_HEIGHT'){
       HEAD_ROOM_HEIGHT = temp_data[a].field_value;
   }else if(temp_data[a].field_comments == 'MACHINE_ROOM_HEIGHT'){
       MACHINE_ROOM_HEIGHT = temp_data[a].field_value;
   }else if(temp_data[a].field_comments == 'DUPLEX_BOX_COVER'){
       DUPLEX_BOX_COVER = temp_data[a].field_value;
   }else if(temp_data[a].field_comments == 'DUPLEX_JOB'){
       DUPLEX_JOB = temp_data[a].field_value;
   }else if(temp_data[a].field_comments == 'NO_OF_BASEMENT_FLOORS'){
       NO_OF_BASEMENT_FLOORS = temp_data[a].field_value;
   }else if(temp_data[a].field_comments == 'PIT_WALLTYPE'){
       PIT_WALLTYPE = temp_data[a].field_value;
   }
   else if(temp_data[a].field_comments == 'site details upload '){
       SITE_UPLOAD = temp_data[a].field_value;
   }
   else if(temp_data[a].field_comments == 'site_details_upload_2'){
       SITE_UPLOAD2 = temp_data[a].field_value;
   }
   else if(temp_data[a].field_comments == 'Remarks'){
       REMARKS = temp_data[a].field_value;
   }
   else if(temp_data[a].field_comments == 'ENT_WALL_OPEN'){
       ENT_WALL_OPEN = temp_data[a].field_value;
   }else if(temp_data[a].field_comments == 'BELOW_LINTAL_HT'){
       BELOW_LINTAL_HT = temp_data[a].field_value;
   }else if(temp_data[a].field_comments == 'FRONT_WALL_RECESS'){
       FRONT_WALL_RECESS = temp_data[a].field_value;
       if(FRONT_WALL_RECESS == 'N'){
        FRONT_WALL_RECESS = 0;
    }
}
else if(temp_data[a].field_comments == 'LAST_FLR_HEIGHT'){
   LAST_FLR_HEIGHT = temp_data[a].field_value;
}else if(temp_data[a].field_comments == 'NO_OF_FLRSERVED'){
   NO_OF_FLRSERVED = temp_data[a].field_value;
}else if(temp_data[a].field_comments == 'HANDAG'){
   HANDAG = temp_data[a].field_value;
}else if(temp_data[a].field_comments == 'PLUMB_READING'){
   PLUMB_READING = temp_data[a].field_value;
}
}
}
var final_temp_data2 = [];
final_temp_data.forEach(element => {
 var string = element.title.split("( to )");
 var number = string[0];
 let c = {
    JOBNO : req.body.job_id,
    FLOOR_NUMBER : ""+number,
    FLOOR_HEIGHT : +element.left
}
final_temp_data2.push(c);
});
var temp_data = final_temp_data2;
for(let a = 0; a < temp_data.length ; a++){
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
        "JOBNO": temp_data[a].JOBNO,
        "FLOOR_NUMBER":  temp_data[a].FLOOR_NUMBER,
        "FLOOR_HEIGHT":  +temp_data[a].FLOOR_HEIGHT,
        "SUBMITDATE" : new Date()
    }
    connection.execute(
     "INSERT INTO JLSMART_FLOORHEIGHT_DATA VALUES (:JOBNO, :FLOOR_NUMBER, :FLOOR_HEIGHT, :SUBMITDATE)",
     da,
     { autoCommit: true}, 
     async  function (err, result) {
        if (err) { console.error(err.message);
          var error_log_oracelModel = require('./../models/error_log_oracelModel');
          let a = {
              "job_no" : req.body.job_id || '',
              "service_type" : "Operation",
              "activity" : "ESPD-ACT1",
              "follow_detail":"JLSMART_FLOORHEIGHT_DATA",
              "url":"/insert_floorheight_detail",
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
 if(a == temp_data.length - 1){


  // ********************************* ESPD-ACT1 DTL INSERT
console.log("**************************  OPERATION ESPD-ACT1 JLSMART_LIFTWELL_DATA INSERT"); 
  oracledb.getConnection({
      user: "JLSMART",
      password: "JLSMART",
      connectString: "(DESCRIPTION =(ADDRESS = (PROTOCOL = TCP)(HOST = 192.168.1.112)(PORT = 1521))(CONNECT_DATA =(SID = jlpl)))"
  }, function(err, connection) {
    if (err) {
        console.error(err.message);
        return;
    }
    var mystr = (""+SITE_UPLOAD).slice(49);
    mystr = "/home/smart/johnson_application/public/uploads"+mystr;
    var path = require('path');       
    var fs = require('fs');
    var source = fs.readFileSync(mystr);
    var mystr1 = (""+SITE_UPLOAD2).slice(49);
    mystr1 = "/home/smart/johnson_application/public/uploads"+mystr1;
    var path = require('path');       
    var fs = require('fs');
    var source1 = fs.readFileSync(mystr1);
    let das = {
        "JOBNO" : req.body.job_id,
        "CLEAR_WIDTH" : +CLEAR_WIDTH,
        "CLEAR_DEPTH" : +CLEAR_DEPTH,
        "BEAM_PROJECTION" : ""+BEAM_PROJECTION[0],
        "THROUGH_CAR" : ""+THROUGH_CAR[0],
        "FLOOR_BEAM_HEIGHT" : +FLOOR_BEAM_HEIGHT,
        "CLEAR_OPENING_HEIGHT" : +CLEAR_OPENING_HEIGHT,
        "LEFT_WALL_THICKNESS" : +LEFT_WALL_THICKNESS,
        "RIGHT_WALL_THICKNESS" : +RIGHT_WALL_THICKNESS,
        "BACK_WALL_THICKNESS" : +BACK_WALL_THICKNESS,
        "FRONT_WALL_THICKNESS" : +FRONT_WALL_THICKNESS,
        "LEFT_WALL_TYPE" : LEFT_WALL_TYPE,
        "RIGHT_WALL_TYPE" : RIGHT_WALL_TYPE,
        "BACK_WALL_TYPE" : BACK_WALL_TYPE,
        "FRONT_WALL_TYPE" : FRONT_WALL_TYPE,
        "TERRACE_NAME" : TERRACE_NAME,
        "GROUND_FLOOR_NAME" : GROUND_FLOOR_NAME,
        "TOTAL_TRAVEL" : +TOTAL_TRAVEL,
        "PIT_HEIGHT" : +PIT_HEIGHT,
        "HEAD_ROOM_HEIGHT" : +HEAD_ROOM_HEIGHT,
        "MACHINE_ROOM_HEIGHT" : +MACHINE_ROOM_HEIGHT,
        "DUPLEX_BOX_COVER" : ""+DUPLEX_BOX_COVER[0],
        "DUPLEX_JOB" : DUPLEX_JOB,
        "NO_OF_BASEMENT_FLOORS" : NO_OF_BASEMENT_FLOORS,
        "PIT_WALLTYPE" : PIT_WALLTYPE,
        "SITE_UPLOAD" : source,
        "SITE_UPLOAD2" : source1,
        "REMARKS" : REMARKS,
        COLUMN_C1_WIDTH :  0,
        COLUMN_C1_DEPTH :  0,
        COLUMN_C2_WIDTH :  0,
        COLUMN_C2_DEPTH :  0,
        COLUMN_C3_WIDTH :  0,
        COLUMN_C3_DEPTH :  0,
        COLUMN_C4_WIDTH :  0,
        COLUMN_C4_DEPTH :  0,
        COLUMN_C5_WIDTH :  0,
        COLUMN_C5_DEPTH :  0,
        COLUMN_C6_WIDTH :  0,
        COLUMN_C6_DEPTH :  0,
        COLUMN_C7_WIDTH :  0,
        COLUMN_C7_DEPTH :  0,
        COLUMN_C8_WIDTH :  0,
        COLUMN_C8_DEPTH :  0,
        COLUMN_C9_WIDTH :  0,
        COLUMN_C9_DEPTH :  0,
        BELOW_LINTAL_HT : BELOW_LINTAL_HT,
        ENT_WALL_OPEN :  ENT_WALL_OPEN,
        FRONT_WALL_RECESS : FRONT_WALL_RECESS,
        LAST_FLR_HEIGHT : LAST_FLR_HEIGHT,
        NO_OF_FLRSERVED : NO_OF_FLRSERVED,
        HANDAG : HANDAG,
        PLUMB_READING : PLUMB_READING,
    }
    var obj = das;
    var keys = Object.keys(obj);
    var final_req = [];
    for (var i = 0; i < keys.length; i++) {
      final_req.push(obj[keys[i]]);
  }
  connection.execute(
   `INSERT INTO JLSMART_LIFTWELL_DATA (
   JOBNO,
   CLEAR_WIDTH,
   CLEAR_DEPTH,
   BEAM_PROJECTION,
   THROUGH_CAR,
   FLOOR_BEAM_HEIGHT,
   CLEAR_OPENING_HEIGHT,
   LEFT_WALL_THICKNESS,
   RIGHT_WALL_THICKNESS,
   BACK_WALL_THICKNESS,
   FRONT_WALL_THICKNESS,
   LEFT_WALL_TYPE,
   RIGHT_WALL_TYPE,
   BACK_WALL_TYPE,
   FRONT_WALL_TYPE,
   TERRACE_NAME,
   GROUND_FLOOR_NAME,
   TOTAL_TRAVEL,
   PIT_HEIGHT,
   HEAD_ROOM_HEIGHT,
   MACHINE_ROOM_HEIGHT,
   DUPLEX_BOX_COVER,
   DUPLEX_JOB,
   PIT_WALLTYPE,
   REMARKS,
   SITE_UPLOAD,
   SITE_UPLOAD2,
   COLUMN_C1_WIDTH,
   COLUMN_C1_DEPTH,
   COLUMN_C2_WIDTH,
   COLUMN_C2_DEPTH,
   COLUMN_C3_WIDTH,
   COLUMN_C3_DEPTH,
   COLUMN_C4_WIDTH,
   COLUMN_C4_DEPTH,
   COLUMN_C5_WIDTH,
   COLUMN_C5_DEPTH,
   COLUMN_C6_WIDTH,
   COLUMN_C6_DEPTH,
   COLUMN_C7_WIDTH,
   COLUMN_C7_DEPTH,
   COLUMN_C8_WIDTH,
   COLUMN_C8_DEPTH,
   COLUMN_C9_WIDTH,
   COLUMN_C9_DEPTH,
   BELOW_LINTAL_HT,
   ENT_WALL_OPEN,
   FRONT_WALL_RECESS,
   LAST_FLR_HEIGHT,
   NO_OF_FLRSERVED,
   HANDAG,
   PLUMB_READING
   ) VALUES (
   :JOBNO,
   :CLEAR_WIDTH,
   :CLEAR_DEPTH,
   :BEAM_PROJECTION,
   :THROUGH_CAR,
   :FLOOR_BEAM_HEIGHT,
   :CLEAR_OPENING_HEIGHT,
   :LEFT_WALL_THICKNESS,
   :RIGHT_WALL_THICKNESS,
   :BACK_WALL_THICKNESS,
   :FRONT_WALL_THICKNESS,
   :LEFT_WALL_TYPE,
   :RIGHT_WALL_TYPE,
   :BACK_WALL_TYPE,
   :FRONT_WALL_TYPE,
   :TERRACE_NAME,
   :GROUND_FLOOR_NAME,
   :TOTAL_TRAVEL,
   :PIT_HEIGHT,
   :HEAD_ROOM_HEIGHT,
   :MACHINE_ROOM_HEIGHT,
   :DUPLEX_BOX_COVER,
   :DUPLEX_JOB,
   :PIT_WALLTYPE,
   :REMARKS,
   :SITE_UPLOAD,
   :SITE_UPLOAD2,
   :COLUMN_C1_WIDTH,
   :COLUMN_C1_DEPTH,
   :COLUMN_C2_WIDTH,
   :COLUMN_C2_DEPTH,
   :COLUMN_C3_WIDTH,
   :COLUMN_C3_DEPTH,
   :COLUMN_C4_WIDTH,
   :COLUMN_C4_DEPTH,
   :COLUMN_C5_WIDTH,
   :COLUMN_C5_DEPTH,
   :COLUMN_C6_WIDTH,
   :COLUMN_C6_DEPTH,
   :COLUMN_C7_WIDTH,
   :COLUMN_C7_DEPTH,
   :COLUMN_C8_WIDTH,
   :COLUMN_C8_DEPTH,
   :COLUMN_C9_WIDTH,
   :COLUMN_C9_DEPTH,
   :BELOW_LINTAL_HT,
   :ENT_WALL_OPEN,
   :FRONT_WALL_RECESS,
   :LAST_FLR_HEIGHT,
   :NO_OF_FLRSERVED,
   :HANDAG,
   :PLUMB_READING
   )`,
   { 
       JOBNO : das.JOBNO,
       CLEAR_WIDTH : das.CLEAR_WIDTH,
       CLEAR_DEPTH : das.CLEAR_DEPTH,
       BEAM_PROJECTION : das.BEAM_PROJECTION,
       THROUGH_CAR : das.THROUGH_CAR,
       FLOOR_BEAM_HEIGHT : das.FLOOR_BEAM_HEIGHT,
       CLEAR_OPENING_HEIGHT : das.CLEAR_OPENING_HEIGHT,
       LEFT_WALL_THICKNESS : das.LEFT_WALL_THICKNESS,
       RIGHT_WALL_THICKNESS : das.RIGHT_WALL_THICKNESS,
       BACK_WALL_THICKNESS : das.BACK_WALL_THICKNESS,
       FRONT_WALL_THICKNESS : das.FRONT_WALL_THICKNESS,
       LEFT_WALL_TYPE : das.LEFT_WALL_TYPE,
       RIGHT_WALL_TYPE : das.RIGHT_WALL_TYPE,
       BACK_WALL_TYPE : das.BACK_WALL_TYPE,
       FRONT_WALL_TYPE : das.FRONT_WALL_TYPE,
       TERRACE_NAME : das.TERRACE_NAME,
       GROUND_FLOOR_NAME : das.GROUND_FLOOR_NAME,
       TOTAL_TRAVEL : das.TOTAL_TRAVEL,
       PIT_HEIGHT : das.PIT_HEIGHT,
       HEAD_ROOM_HEIGHT : das.HEAD_ROOM_HEIGHT,
       MACHINE_ROOM_HEIGHT : das.MACHINE_ROOM_HEIGHT,
       DUPLEX_BOX_COVER : das.DUPLEX_BOX_COVER,
       DUPLEX_JOB : das.DUPLEX_JOB,
       PIT_WALLTYPE : das.PIT_WALLTYPE,
       REMARKS : das.REMARKS,
       SITE_UPLOAD : das.SITE_UPLOAD,
       SITE_UPLOAD2 : das.SITE_UPLOAD2,
       COLUMN_C1_WIDTH : das.COLUMN_C1_WIDTH,
       COLUMN_C1_DEPTH : das.COLUMN_C1_DEPTH,
       COLUMN_C2_WIDTH : das.COLUMN_C2_WIDTH,
       COLUMN_C2_DEPTH : das.COLUMN_C2_DEPTH,
       COLUMN_C3_WIDTH : das.COLUMN_C3_WIDTH,
       COLUMN_C3_DEPTH : das.COLUMN_C3_DEPTH,
       COLUMN_C4_WIDTH : das.COLUMN_C4_WIDTH,
       COLUMN_C4_DEPTH : das.COLUMN_C4_DEPTH,
       COLUMN_C5_WIDTH : das.COLUMN_C5_WIDTH,
       COLUMN_C5_DEPTH : das.COLUMN_C5_DEPTH,
       COLUMN_C6_WIDTH : das.COLUMN_C6_WIDTH,
       COLUMN_C6_DEPTH : das.COLUMN_C6_DEPTH,
       COLUMN_C7_WIDTH : das.COLUMN_C7_WIDTH,
       COLUMN_C7_DEPTH : das.COLUMN_C7_DEPTH,
       COLUMN_C8_WIDTH : das.COLUMN_C8_WIDTH,
       COLUMN_C8_DEPTH : das.COLUMN_C8_DEPTH,
       COLUMN_C9_WIDTH : das.COLUMN_C9_WIDTH,
       COLUMN_C9_DEPTH : das.COLUMN_C9_DEPTH,
       BELOW_LINTAL_HT : BELOW_LINTAL_HT,
       ENT_WALL_OPEN :  ENT_WALL_OPEN,
       FRONT_WALL_RECESS : FRONT_WALL_RECESS,
       LAST_FLR_HEIGHT : LAST_FLR_HEIGHT,
       NO_OF_FLRSERVED : NO_OF_FLRSERVED,
       HANDAG : HANDAG,
       PLUMB_READING : PLUMB_READING,
   },
   {autoCommit: true},
   async   function (err, result) {
    if (err) { 
      var error_log_oracelModel = require('./../models/error_log_oracelModel');
      let a = {
          "job_no" : req.body.job_id || '',
          "service_type" : "Operation",
          "activity" : "ESPD-ACT1",
          "follow_detail":"JLSMART_LIFTWELL_DATA",
          "url":"/insert_floorheight_detail",
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
  res.json({Status:"Success",Message:"Added successfully", Data : {} ,Code:200}); 
// ********************************* MONGO DB INSERT START
console.log("**************************  OPERATION ESPD-ACT1 MONGO INSERT"); 
request.post(
    'http://smart.johnsonliftsltd.com:3000/api/data_store_management/mongo_insert_data',
    { json: req.body },
    function (error, response, body) {
        if (!error && response.statusCode == 200) {
        }
    });
// ********************************* MONGO DB INSERT END
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
////////////Funcation End///////////
}
} 
// ************************************************

else if(group_detail.SMU_UKEY == 'ESPD-ACTIMF'){


console.log("**************************  OPERATION ESPD-ACTIMF JLSMART_LIFTWELL_DATA UPDATE");

  // ********************************* ESPD-ACT1 IMAGE UPDATE

  var COLUMN_C1_WIDTH = 0;
  var COLUMN_C1_DEPTH = 0;
  var COLUMN_C2_WIDTH = 0;
  var COLUMN_C2_DEPTH = 0;
  var COLUMN_C3_WIDTH = 0;
  var COLUMN_C3_DEPTH = 0;
  var COLUMN_C4_WIDTH = 0;
  var COLUMN_C4_DEPTH = 0;
  var COLUMN_C5_WIDTH = 0;
  var COLUMN_C5_DEPTH = 0;
  var COLUMN_C6_WIDTH = 0;
  var COLUMN_C6_DEPTH = 0;
  var COLUMN_C7_WIDTH = 0;
  var COLUMN_C7_DEPTH = 0;
  var COLUMN_C8_WIDTH = 0;
  var COLUMN_C8_DEPTH = 0;
  var COLUMN_C9_WIDTH = 0;
  var COLUMN_C9_DEPTH = 0;
  var datas = req.body.Data;
  for(let a  = 0; a < datas.length; a++){
   if(datas[a].title == 'C4'){
    COLUMN_C4_WIDTH = datas[a].value_a;
    COLUMN_C4_DEPTH = datas[a].value_b;
}
if(datas[a].title == 'ICB'){

}
if(datas[a].title == 'C3'){
    COLUMN_C3_WIDTH = datas[a].value_a;
    COLUMN_C3_DEPTH = datas[a].value_b;
}
if(datas[a].title == 'ICL'){

}
if(datas[a].title == 'ICR'){

}
if(datas[a].title == 'C1'){
    COLUMN_C1_WIDTH = datas[a].value_a;
    COLUMN_C1_DEPTH = datas[a].value_b;
}
if(datas[a].title == 'C2'){
    COLUMN_C2_WIDTH = datas[a].value_a;
    COLUMN_C2_DEPTH = datas[a].value_b;
}
} 

oracledb.getConnection({
  user: "JLSMART",
  password: "JLSMART",
  connectString: "(DESCRIPTION =(ADDRESS = (PROTOCOL = TCP)(HOST = 192.168.1.112)(PORT = 1521))(CONNECT_DATA =(SID = jlpl)))"
}, function(err, connection) {
    if (err) {
        return;
    }
    connection.execute(
        "UPDATE JLSMART_LIFTWELL_DATA set SUBMITDATE=:SUBMITDATE, COLUMN_C1_WIDTH =:COLUMN_C1_WIDTH,COLUMN_C1_DEPTH =:COLUMN_C1_DEPTH,COLUMN_C2_WIDTH =:COLUMN_C2_WIDTH,COLUMN_C2_DEPTH =:COLUMN_C2_DEPTH,COLUMN_C3_WIDTH =:COLUMN_C3_WIDTH,COLUMN_C3_DEPTH =:COLUMN_C3_DEPTH,COLUMN_C4_WIDTH =:COLUMN_C4_WIDTH,COLUMN_C4_DEPTH =:COLUMN_C4_DEPTH,COLUMN_C5_WIDTH =:COLUMN_C5_WIDTH,COLUMN_C5_DEPTH =:COLUMN_C5_DEPTH,COLUMN_C6_WIDTH =:COLUMN_C6_WIDTH,COLUMN_C6_DEPTH =:COLUMN_C6_DEPTH,COLUMN_C7_WIDTH =:COLUMN_C7_WIDTH,COLUMN_C7_DEPTH =:COLUMN_C7_DEPTH,COLUMN_C8_WIDTH =:COLUMN_C8_WIDTH,COLUMN_C8_DEPTH =:COLUMN_C8_DEPTH,COLUMN_C9_WIDTH =:COLUMN_C9_WIDTH,COLUMN_C9_DEPTH =:COLUMN_C9_DEPTH WHERE JOBNO=:JOBNO",
        {
            JOBNO : req.body.job_id,
            COLUMN_C1_WIDTH :  COLUMN_C1_WIDTH,
            COLUMN_C1_DEPTH :  COLUMN_C1_DEPTH,
            COLUMN_C2_WIDTH :  COLUMN_C2_WIDTH,
            COLUMN_C2_DEPTH :  COLUMN_C2_DEPTH,
            COLUMN_C3_WIDTH :  COLUMN_C3_WIDTH,
            COLUMN_C3_DEPTH :  COLUMN_C3_DEPTH,
            COLUMN_C4_WIDTH :  COLUMN_C4_WIDTH,
            COLUMN_C4_DEPTH :  COLUMN_C4_DEPTH,
            COLUMN_C5_WIDTH :  COLUMN_C5_WIDTH,
            COLUMN_C5_DEPTH :  COLUMN_C5_DEPTH,
            COLUMN_C6_WIDTH :  COLUMN_C6_WIDTH,
            COLUMN_C6_DEPTH :  COLUMN_C6_DEPTH,
            COLUMN_C7_WIDTH :  COLUMN_C7_WIDTH,
            COLUMN_C7_DEPTH :  COLUMN_C7_DEPTH,
            COLUMN_C8_WIDTH :  COLUMN_C8_WIDTH,
            COLUMN_C8_DEPTH :  COLUMN_C8_DEPTH,
            COLUMN_C9_WIDTH :  COLUMN_C9_WIDTH,
            COLUMN_C9_DEPTH :  COLUMN_C9_DEPTH,
            SUBMITDATE : new Date(),
        },
        {autoCommit: true},
        async  function (err, result) {
            if (err) { console.error(err.message);

                let a = {
                  "job_no" : req.body.job_id || '',
                  "service_type" : "Operation",
                  "activity" : "ESPD-ACTIMF",
                  "follow_detail":"JLSMART_LIFTWELL_DATA",
                  "url":"/plumchart_data_update",
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

// ********************************* STATUS UPDATE ORACLE START
console.log("**************************  OPERATION ESPD-ACTIMF ESPD_OP_HDR UPDATE");

oracledb.getConnection({
  user: "JLSMART",
  password: "JLSMART",
  connectString: "(DESCRIPTION =(ADDRESS = (PROTOCOL = TCP)(HOST = 192.168.1.112)(PORT = 1521))(CONNECT_DATA =(SID = jlpl)))"
}, function(err, connection) {
    if (err) {
        return;
    }
    connection.execute(
        "UPDATE ESPD_OP_HDR set SMU_ACTIVITY_STATUS=:ac,SM_ACTIVITY_STATDATE=:dfd WHERE SMU_JOBNO=:jn and SMU_UKEY=:uk and SMU_ACTIVITY_STATUS IN (:acd,:ace)",
        {
            ac: 'SUBMITTED',
            dfd: new Date(),
            jn : req.body.job_id,
            uk : 'ESPD-ACT1',
            acd : 'PUSHED TO MOBILE',
            ace : 'START'
        },
        {autoCommit: true},
        function (err, result) {    
            if (err) { console.error(err.message);
              doRelease(connection);
              return;
          }  
          doRelease(connection);
          res.json({Status:"Success",Message:"Added successfully", Data : {} ,Code:200}); 

// ********************************* MONGO DB INSERT START
console.log("**************************  OPERATION ESPD-ACTIMF MONGO INSERT");
request.post(
    'http://smart.johnsonliftsltd.com:3000/api/data_store_management/mongo_insert_data',
    { json: req.body },
    function (error, response, body) {
        if (!error && response.statusCode == 200) {
        }
    });
// ********************************* MONGO DB INSERT END
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
// ********************************* STATUS UPDATE ORACLE START

oracledb.getConnection({
  user: "JLSMART",
  password: "JLSMART",
  connectString: "(DESCRIPTION =(ADDRESS = (PROTOCOL = TCP)(HOST = 192.168.1.112)(PORT = 1521))(CONNECT_DATA =(SID = jlpl)))"
}, function(err, connection) {
    if (err) {
        return;
    }
    connection.execute(
        "UPDATE ESPD_OP_HDR set SMU_ACTIVITY_STATUS=:ac,SM_ACTIVITY_STATDATE=:dfd WHERE SMU_JOBNO=:jn and SMU_UKEY=:uk and SMU_ACTIVITY_STATUS IN (:acd,:ace)",
        {
            ac: 'SUBMITTED',
            dfd: new Date(),
            jn : req.body.job_id,
            uk : group_detail.SMU_UKEY,
            acd : 'PUSHED TO MOBILE',
            ace : 'START'
        },
        {autoCommit: true},
        function (err, result) {
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
// ********************************* STATUS UPDATE ORACLE END
res.json({Status:"Success",Message:"Added successfully", Data : {} ,Code:200}); 
// ********************************* MONGO DB INSERT START
request.post(
    'http://smart.johnsonliftsltd.com:3000/api/data_store_management/mongo_insert_data',
    { json: req.body },
    function (error, response, body) {
        if (!error && response.statusCode == 200) {
        }
    });
// ********************************* MONGO DB INSERT END
}
// ************************************************



}
});



// router.post('/form_5_create_resubmit',async function(req, res) {
//     var user_details  =  await data_store_managementModel.findOne({job_id:req.body.job_id,"group_id": "629ede01886f5404a75d4a88"});
//     res.json({Status:"Success",Message:"", Data : user_details,Code:500});
//   var final_data = user_details.data_store;
//   // let a = {"accepts":0,"demage":0,"desc_qty":0,"excess":0,"material_desc":""+req.body.Data.remarks,"part_no":"remarks","shortage":0};
//   // final_data.push(a);
//          req.body.Data = final_data;
//           var counts = req.body.Data.length;
//           var init_value = 0;
//           recall();
//           function recall() {
//             if(init_value == counts){
//             res.json({Status:"Success",Message:"Added successfully", Data : {} ,Code:200}); 
//             } else {
//                var temp_data = req.body.Data[init_value];
//                let da = {
//                 ST_MDD_SEQNO : temp_data.ST_MDD_SEQNO || 0,
//                 ST_MDD_SLNO : temp_data.ST_MDD_SLNO || 0,
//                 ST_MDD_MATLID :temp_data.ST_MDD_MATLID || 0,
//                 ST_MDD_PARTNO : temp_data.part_no,
//                 ST_MDD_QTY : temp_data.desc_qty || 0,
//                 ST_MDD_UOM : temp_data.ST_MDD_UOM || "NOS",
//                 ST_MDD_STATUS : temp_data.ST_MDD_STATUS || "A",
//                 ST_MDD_SSID : temp_data.ST_MDD_SSID || null,
//                 ST_MDD_BOMQTY : temp_data.ST_MDD_BOMQTY || 0,
//                 ST_MDD_RECQTY : temp_data.accepts,
//                 ST_MDD_DAMQTY : temp_data.demage,
//                 ST_MDD_SHEXQTY : temp_data.shortage,
//                 ST_MDD_RCREMARKS : temp_data.ST_MDD_RCREMARKS || "",
//                }
// oracledb.getConnection({
//       user: "JLSMART",
//       password: "JLSMART",
//       connectString: "(DESCRIPTION =(ADDRESS = (PROTOCOL = TCP)(HOST = 192.168.1.112)(PORT = 1521))(CONNECT_DATA =(SID = jlpl)))"
// }, function(err, connection) {
// if (err) {
//     return;
// }
//       connection.execute(
//             "INSERT INTO DISPATCH_ACK VALUES (:ST_MDD_SEQNO, :ST_MDD_SLNO, :ST_MDD_MATLID, :ST_MDD_PARTNO, :ST_MDD_QTY, :ST_MDD_UOM, :ST_MDD_STATUS, :ST_MDD_SSID, :ST_MDD_BOMQTY, :ST_MDD_RECQTY, :ST_MDD_DAMQTY, :ST_MDD_SHEXQTY, :ST_MDD_RCREMARKS)",
//               da, // Bind values
//               { autoCommit: true}, 
//         function (err, result) {
//     if (err) { console.error(err.message);
//           doRelease(connection);
//           return;
//      }

//  doRelease(connection);
//    });
// });
// function doRelease(connection) {
//        connection.release(function(err) {
//          if (err) {
//           console.error(err.message);
//         }
//       }
//    );
// }
//             init_value = init_value + 1;
//             recall();
//             }
//           } 
// });





router.post('/mongo_insert_data', async function(req, res) {
  try{
              await data_store_managementModel.create({
              user_id :  req.body.user_id || "",
              activity_id : req.body.activity_id || "",
              job_id : req.body.job_id || "",
              group_id : req.body.group_id || "",
              sub_group_id : req.body.sub_group_id || "",
              data_store : req.body.Data,
              work_status : "Submitted",
              work_time : [],
              start_time : req.body.start_time || "",
              pause_time : req.body.pause_time || "",
              stop_time : req.body.stop_time || "",
              storage_status : req.body.storage_status || "",
              date_of_create : req.body.date_of_create || "",
              date_of_update : req.body.date_of_update || "",
              created_by : req.body.created_by || "",
              updated_by : req.body.updated_by || "",
              update_reason : req.body.update_reason || "",
        }, async function (err, user) {
        res.json({Status:"Success",Message:"Added successfully", Data : user ,Code:200}); 
        });
}
catch(e){
      res.json({Status:"Failed",Message:"Internal Server Error", Data : {},Code:500});
}
});





// router.post('/create_two', async function(req, res) {
//   try{
//         await data_store_managementModel.create({
//               user_id :  req.body.user_id || "",
//               activity_id : req.body.activity_id || "",
//               job_id : req.body.job_id || "",
//               group_id : req.body.group_id || "",
//               sub_group_id : req.body.sub_group_id || "",
//               data_store : [],
//               data_store_one : [],
//               data_store_two : req.body.data_store_two ,
//               work_status : "Started",
//               start_time : req.body.start_time || "",
//               pause_time : req.body.pause_time || "",
//               stop_time : req.body.stop_time || "",
//               storage_status : req.body.storage_status || "",
//               date_of_create : req.body.date_of_create || "",
//               date_of_update : req.body.date_of_update || "",
//               created_by : req.body.created_by || "",
//               updated_by : req.body.updated_by || "",
//               update_reason : req.body.update_reason || "",
//         }, 
//         function (err, user) {
//         res.json({Status:"Success",Message:"Added successfully", Data : user ,Code:200}); 
//         });
// }
// catch(e){
//       res.json({Status:"Failed",Message:"Internal Server Error", Data : {},Code:500});
// }
// });




// router.get('/deletes_one', function (req, res) {
//       data_store_managementModel.remove({}, function (err, user) {
//           if (err) return res.status(500).send("There was a problem deleting the user.");
//              res.json({Status:"Success",Message:"data_store_managementModel Deleted", Data : {} ,Code:200});     
//       });
// });





router.post('/form_5_create', async function(req, res) {


var user_details  =  await user_management.findOne({_id:req.body.user_id});

if(user_details.user_id == '57541804879621' || user_details.user_id == '57541804879461'){

   res.json({Status:"Failed",Message:"Session Full Try After 10 Sec", Data : {} ,Code:404}); 
 } else {
  var final_data = req.body.Data.material_details;
  // let a = {"accepts":0,"demage":0,"desc_qty":0,"excess":0,"material_desc":""+req.body.Data.remarks,"part_no":"remarks","shortage":0};
  // final_data.push(a);
  req.body.Data = final_data;
  try{
        await data_store_managementModel.create({
              user_id :  req.body.user_id || "",
              activity_id : req.body.activity_id || "",
              job_id : req.body.job_id || "",
              group_id : req.body.group_id || "",
              sub_group_id : req.body.sub_group_id || "",
              data_store : req.body.Data,
              work_status : "Submitted",
              work_time : [],
              start_time : req.body.start_time || "",
              pause_time : req.body.pause_time || "",
              stop_time : req.body.stop_time || "",
              storage_status : req.body.storage_status || "",
              date_of_create : req.body.date_of_create || "",
              date_of_update : req.body.date_of_update || "",
              created_by : req.body.created_by || "",
              updated_by : req.body.updated_by || "",
              update_reason : req.body.update_reason || "",
        }, 
        function (err, user) {
          var counts = req.body.Data.length;
          var init_value = 0;
          recall();
          function recall() {
            if(init_value == counts) {
oracledb.getConnection({
      user: "JLSMART",
      password: "JLSMART",
      connectString: "(DESCRIPTION =(ADDRESS = (PROTOCOL = TCP)(HOST = 192.168.1.112)(PORT = 1521))(CONNECT_DATA =(SID = jlpl)))"
}, function(err, connection) {
if (err) {
    return;
}

connection.execute(
    "UPDATE ESPD_OP_HDR set SMU_ACTIVITY_STATUS=:ac,SM_ACTIVITY_STATDATE=:dfd WHERE SMU_JOBNO=:jn and SMU_UKEY=:uk and ST_MDH_SEQNO=:ST_MDH_SEQNO and SMU_ACTIVITY_STATUS IN (:acd,:ace)",
            {
                ac: 'SUBMITTED',
                dfd: new Date(),
                ST_MDH_SEQNO : final_data[0].ST_MDD_SEQNO,
                jn : req.body.job_id,
                uk : 'ESPD-ACT5',
                acd : 'PUSHED TO MOBILE',
                ace : 'START'
            },
        {autoCommit: true},
        function (err, result) {
    if (err) { console.error(err.message);
          doRelease(connection);
          return;
     }
     res.json({Status:"Success",Message:"Added successfully", Data : {} ,Code:200}); 
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
            else {
               var temp_data = req.body.Data[init_value];
               let da = {
                ST_MDD_SEQNO : temp_data.ST_MDD_SEQNO || 0,
                ST_MDD_SLNO : temp_data.ST_MDD_SLNO || 0,
                ST_MDD_MATLID :temp_data.ST_MDD_MATLID || 0,
                ST_MDD_PARTNO : temp_data.part_no,
                ST_MDD_QTY : temp_data.desc_qty || 0,
                ST_MDD_UOM : temp_data.ST_MDD_UOM || "NOS",
                ST_MDD_STATUS : temp_data.ST_MDD_STATUS || "A",
                ST_MDD_SSID : temp_data.ST_MDD_SSID || "",
                ST_MDD_BOMQTY : temp_data.ST_MDD_BOMQTY || 0,
                ST_MDD_RECQTY : temp_data.accepts,
                ST_MDD_DAMQTY : temp_data.demage,
                ST_MDD_SHEXQTY : temp_data.shortage,
                ST_MDD_RCREMARKS : temp_data.ST_MDD_RCREMARKS || "",
               }
oracledb.getConnection({
      user: "JLSMART",
      password: "JLSMART",
      connectString: "(DESCRIPTION =(ADDRESS = (PROTOCOL = TCP)(HOST = 192.168.1.112)(PORT = 1521))(CONNECT_DATA =(SID = jlpl)))"
}, function(err, connection) {
if (err) {
    return;
}
     // connection.execute("SELECT * FROM ESPD_OP_HDR",[], function
      connection.execute(
            "INSERT INTO DISPATCH_ACK (ST_MDD_SEQNO, ST_MDD_SLNO, ST_MDD_MATLID, ST_MDD_PARTNO, ST_MDD_QTY, ST_MDD_UOM, ST_MDD_STATUS, ST_MDD_SSID, ST_MDD_BOMQTY, ST_MDD_RECQTY, ST_MDD_DAMQTY, ST_MDD_SHEXQTY, ST_MDD_RCREMARKS) VALUES (:ST_MDD_SEQNO, :ST_MDD_SLNO, :ST_MDD_MATLID, :ST_MDD_PARTNO, :ST_MDD_QTY, :ST_MDD_UOM, :ST_MDD_STATUS, :ST_MDD_SSID, :ST_MDD_BOMQTY, :ST_MDD_RECQTY, :ST_MDD_DAMQTY, :ST_MDD_SHEXQTY, :ST_MDD_RCREMARKS)",
              da, // Bind values
              { autoCommit: true}, 
    async  function (err, result) {
    if (err) { console.error(err.message);

         let a = {
          "job_no" : req.body.job_id || '',
          "service_type" : "Operation",
          "activity" : "ESPD-ACT5",
          "follow_detail":"DISPATCH_ACK",
          "url":"/form_5_create",
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
        function doRelease(connection) {
       connection.release(function(err) {
         if (err) {
          console.error(err.message);
        }
      }
   );
}
            init_value = init_value + 1;
            recall();
   });
});

            }

          }
        });
}
catch(e){
      res.json({Status:"Failed",Message:"Internal Server Error", Data : {},Code:500});
}


}
 
});




router.post('/check_data_store', function (req, res) {
        data_store_managementModel.findOne({
          user_id :  req.body.user_id,
          activity_id : req.body.activity_id,
          job_id : req.body.job_id,
        }, function (err, StateList) {
           if(StateList == null){
           let final_output = {
              work_status : "",
              start_time : "",
              pause_time :  "",
           }
           res.json({Status:"Success",Message:"Storage List", Data : final_output ,Code:200});
           }else{
            let final_output = {
              work_status :StateList.work_status,
              start_time : StateList.start_time || "",
              pause_time : StateList.pause_time || "",
           }
           res.json({Status:"Success",Message:"Storage List", Data : final_output ,Code:200});
           }
        });
});




router.post('/check_location', function (req, res) {
        data_store_managementModel.findOne({
          job_id : req.body.job_id,
        }, function (err, StateList) {
           if(StateList == null){
           res.json({Status:"Success",Message:"ESP Not Started the Work", Data : {
            distance : 0
           } ,Code:404});
           }else{
           var distance = calcCrow(StateList.job_lat,StateList.job_long,req.body.job_lat,req.body.job_long).toFixed(2);
          function calcCrow(lat1, lon1, lat2, lon2) 
              {
                var R = 6371; // km
                var dLat = toRad(lat2-lat1);
                var dLon = toRad(lon2-lon1);
                var lat1 = toRad(lat1);
                var lat2 = toRad(lat2);

                var a = Math.sin(dLat/2) * Math.sin(dLat/2) +
                  Math.sin(dLon/2) * Math.sin(dLon/2) * Math.cos(lat1) * Math.cos(lat2); 
                var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a)); 
                var d = R * c;
                return d;
              }
              // Converts numeric degrees to radians
              function toRad(Value) 
              {
                  return Value * Math.PI / 180;
              }
             
              if(distance < 0.5){
              res.json({Status:"Success",Message:"", Data : {},Code:200});
              }else{
              res.json({Status:"Success",Message:"Invalid Data your are fare for the marked loction", Data : {},Code:404});
              }
           }
        }).sort({ _id:-1});
});





router.post('/start_work',async function (req, res) {
  try{
        await data_store_managementModel.create({
              user_id :  req.body.user_id || "",
              activity_id : req.body.activity_id || "",
              job_id : req.body.job_id || "",
              group_id : req.body.group_id || "",
              sub_group_id : req.body.sub_group_id || "",
              data_store : [],
              work_status : "Started",
              work_time : [],
              start_time : req.body.start_time || "",
              job_long : req.body.job_long,
              job_lat : req.body.job_lat,
              pause_time : req.body.pause_time || "",
              stop_time : req.body.stop_time || "",
              storage_status : req.body.storage_status || "",
              date_of_create : req.body.date_of_create || "",
              date_of_update : req.body.date_of_update || "",
              created_by : req.body.created_by || "",
              updated_by : req.body.updated_by || "",
              update_reason : req.body.update_reason || "",
        }, 
        function (err, user) {
   
        res.json({Status:"Success",Message:"Added successfully", Data : {} ,Code:200}); 
        });
}
catch(e){
      res.json({Status:"Failed",Message:"Internal Server Error", Data : {},Code:500});
}
});





router.post('/pause_job', function (req, res) {
        data_store_managementModel.findOne({
          user_id :  req.body.user_id,
          activity_id : req.body.activity_id,
          job_id : req.body.job_id,
        },function (err, StateList){
          if(StateList.work_time.length == 0){
        let time_array = {
           start_time : StateList.start_time,
           end_time : req.body.pause_time,
           no_of_hrs_work : 0
         }
        StateList.work_time.push(time_array);
        let data = {
          work_time : StateList.work_time,
          pause_time : req.body.pause_time || "",
          work_status : "Paused",
        }
        data_store_managementModel.findByIdAndUpdate(StateList._id, data, {new: true}, function (err, UpdatedDetails) {
            if (err) return res.json({Status:"Failed",Message:"Internal Server Error", Data : {},Code:500});
             res.json({Status:"Success",Message:"Functiondetails Updated", Data : UpdatedDetails ,Code:200});
        });
          }
        else {
        StateList.work_time[StateList.work_time.length - 1].end_time = req.body.pause_time;
        let data = {
          work_time : StateList.work_time,
          pause_time : req.body.pause_time || "",
          work_status : "Paused",
        }
        data_store_managementModel.findByIdAndUpdate(StateList._id, data, {new: true}, function (err, UpdatedDetails) {
            if (err) return res.json({Status:"Failed",Message:"Internal Server Error", Data : {},Code:500});
             res.json({Status:"Success",Message:"Functiondetails Updated", Data : UpdatedDetails ,Code:200});
        });
          }
        });
});




router.post('/resume_job', function (req, res) {
        data_store_managementModel.findOne({
          user_id :  req.body.user_id,
          activity_id : req.body.activity_id,
          job_id : req.body.job_id,
        },function (err, StateList){
        let time_array = {
           start_time : req.body.resume_time,
           end_time : '',
           no_of_hrs_work : 0
         }
        StateList.work_time.push(time_array);
        let data = {
          work_time : StateList.work_time,
          work_status : "Resumed",
        }
        data_store_managementModel.findByIdAndUpdate(StateList._id, data, {new: true}, function (err, UpdatedDetails) {
            if (err) return res.json({Status:"Failed",Message:"Internal Server Error", Data : {},Code:500});
             res.json({Status:"Success",Message:"Functiondetails Updated", Data : UpdatedDetails ,Code:200});
        });
        });
});



router.post('/stop_job', function (req, res) {
        data_store_managementModel.findOne({
          user_id :  req.body.user_id,
          activity_id : req.body.activity_id,
          job_id : req.body.job_id,
        },function (err, StateList){
        let total_work_time = 0;
        for(let a  = 0; a < StateList.work_time.length ; a++){
            var date1 = StateList.work_time[a].start_time;
            var date2 = StateList.work_time[a].end_time;
const convertTime = timeStr => {
   const [time, modifier] = timeStr.split(' ');
   let [hours, minutes] = time.split(':');
   if (hours === '12') {
      hours = '00';
   }
   if (modifier === 'PM') {
      hours = parseInt(hours, 10) + 12;
   }
   return `${hours}:${minutes}`;
};
            var date = StateList.work_time[a].start_time.split(' ');
            var splitdate = date[0].split('-');
            var convert_time = convertTime(date[1]);
            var final_date_start = splitdate[2]+"-"+splitdate[1]+"-"+splitdate[0]+"T"+convert_time+":00.000Z";

            var date1 = StateList.work_time[a].end_time.split(' ');
            var splitdate1 = date1[0].split('-');
            var convert_time1 = convertTime(date1[1]);
            var final_date_end = splitdate1[2]+"-"+splitdate1[1]+"-"+splitdate1[0]+"T"+convert_time1+":00.000Z";

            var date1 = new Date(final_date_start);
            var date2 = new Date(final_date_end);

            var diff = date2.valueOf() - date1.valueOf();
            var diffInHours = diff/1000/60/60; // Convert milliseconds to hours

            StateList.work_time[a].no_of_hrs_work = diffInHours;
            total_work_time = +total_work_time + +diffInHours;
            if(a == StateList.work_time.length - 1){
       let data = {
       work_time:StateList.work_time,
       stop_time:req.body.stop_time,
       work_status : "Stopped",
       total_work_time : total_work_time,
       }
        data_store_managementModel.findByIdAndUpdate(StateList._id, data, {new: true}, function (err, UpdatedDetails) {
            if (err) return res.json({Status:"Failed",Message:"Internal Server Error", Data : {},Code:500});
             res.json({Status:"Success",Message:"Functiondetails Updated", Data : UpdatedDetails ,Code:200});
        });

            }
        }
        });
});










router.post('/fetch_record_byuserid', function (req, res) {
        var counts = 0;
           data_store_managementModel.find({user_id:req.body.user_id,activity_id:req.body.activity_id}, function (err, StateList2) {
            counts = counts + StateList2.length;
          res.json({Status:"Success",Message:"Storage List", Data : {count : counts}  ,Code:200});
        });
});







router.post('/fetch_record_by_group', function (req, res) {
        data_store_managementModel.findOne({
              user_id :  req.body.user_id ,
              activity_id : req.body.activity_id,
              job_id : req.body.job_id,
              group_id : req.body.group_id,
              sub_group_id : req.body.sub_group_id,
              start_time :  req.body.start_time,
             }, function (err, StateList) {
                let final_data = {
              user_id :  req.body.user_id ,
              activity_id : req.body.activity_id,
              job_id : req.body.job_id,
              group_id : req.body.group_id,
              sub_group_id : req.body.sub_group_id,
              start_time : req.body.start_time,
              data_store : []
                }
                if(StateList !== null){
                  final_data.data_store = StateList.data_store
                }
          res.json({Status:"Success",Message:"Storage List", Data : final_data  ,Code:200});
        });
});


router.post('/fetch_record_by_group_one', function (req, res) {
         data_store_managementModel.findOne({
              user_id :  req.body.user_id ,
              activity_id : req.body.activity_id,
              job_id : req.body.job_id,
              group_id : req.body.group_id,
              sub_group_id : req.body.sub_group_id,
              start_time :  req.body.start_time,
             }, function (err, StateList) {
                let final_data = {
              user_id :  req.body.user_id ,
              activity_id : req.body.activity_id,
              job_id : req.body.job_id,
              group_id : req.body.group_id,
              sub_group_id : req.body.sub_group_id,
              start_time : req.body.start_time,
              data_store_one : []
                }
                if(StateList !== null){
                  final_data.data_store_one = StateList.data_store_one
                }
          res.json({Status:"Success",Message:"Storage List", Data : final_data   ,Code:200});
        });
});


router.post('/fetch_record_by_group_two', function (req, res) {
           data_store_managementModel.findOne({
              user_id :  req.body.user_id ,
              activity_id : req.body.activity_id,
              job_id : req.body.job_id,
              group_id : req.body.group_id,
              sub_group_id : req.body.sub_group_id,
              start_time : req.body.start_time,
             }, function (err, StateList) {
                let final_data = {
              user_id :  req.body.user_id ,
              activity_id : req.body.activity_id,
              job_id : req.body.job_id,
              group_id : req.body.group_id,
              sub_group_id : req.body.sub_group_id,
              start_time :  req.body.start_time,
              data_store_two : []
                }
                if(StateList !== null){
                  final_data.data_store_two = StateList.data_store_two
                }
          res.json({Status:"Success",Message:"Storage List", Data : final_data  ,Code:200});
        });
});




router.get('/getlist', function (req, res) {
        data_store_managementModel.find({}, function (err, Functiondetails) {
          let final_Data = [];
          const ids = Functiondetails.map(o => o.job_id)
          const filtered = Functiondetails.filter(({job_id}, index) => !ids.includes(job_id, index + 1))

          Functiondetails = filtered;
          for(let a = 0 ; a < Functiondetails.length ; a++){
            let ad = {
              _id :   Functiondetails[a]._id || "",
              user_id :  Functiondetails[a].user_id || "",
              activity_id : Functiondetails[a].activity_id || "",
              job_id : Functiondetails[a].job_id || "",
              group_id : Functiondetails[a].group_id || "",
              sub_group_id : Functiondetails[a].sub_group_id || "",
              data_store : [],
              work_status : "Submitted",
              work_time : [],
              start_time : Functiondetails[a].start_time || "",
              pause_time : Functiondetails[a].pause_time || "",
              stop_time : Functiondetails[a].stop_time || "",
              storage_status : Functiondetails[a].storage_status || "",
              date_of_create : Functiondetails[a].date_of_create || "",
              date_of_update : Functiondetails[a].date_of_update || "",
              created_by : Functiondetails[a].created_by || "",
              updated_by :Functiondetails[a].updated_by || "",
              update_reason : Functiondetails[a].update_reason || "",
            }
            final_Data.push(ad);
            if(a == Functiondetails.length - 1){
      
            
               res.json({Status:"Success",Message:"Functiondetails", Data : final_Data ,Code:200});  
            }
          }
        });
});

router.post('/fetch_data', function (req, res) {
        data_store_managementModel.findOne({_id:req.body._id}, function (err, Functiondetails) {
          res.json({Status:"Success",Message:"Functiondetails", Data : Functiondetails ,Code:200});
        });
});


router.post('/activity_list', function (req, res) {
        data_store_managementModel.find({
              user_id :  req.body.user_id ,
              job_id : req.body.job_id,
        }, function (err, Functiondetails) {
          res.json({Status:"Success",Message:"Functiondetails", Data : Functiondetails ,Code:200});
        });
});



router.post('/admin_delete', function (req, res) {
      data_store_managementModel.findByIdAndRemove(req.body._id, function (err, user) {
          if (err) return res.json({Status:"Failed",Message:"Internal Server Error", Data : {},Code:500});
          res.json({Status:"Success",Message:"SubFunction Deleted successfully", Data : {} ,Code:200});
      });
});


router.post('/fetch_job_details', function (req, res) {
      data_store_managementModel.find({job_id:req.body.job_id}, function (err, Functiondetails) {
          res.json({Status:"Success",Message:"Functiondetails", Data : Functiondetails ,Code:200});
        });
});



router.post('/delete_by_job_no',async function (req, res) {
    var group_list = await data_store_managementModel.find({job_id:req.body.job_id});
    for(let a  = 0; a < group_list.length; a++){
              data_store_managementModel.findByIdAndRemove(group_list[a]._id, function (err, user) {
          if (err) return res.json({Status:"Failed",Message:"Internal Server Error", Data : {},Code:500});
      });
              if(a == group_list.length - 1){
                res.json({Status:"Success",Message:"Deleted successfully", Data : {} ,Code:200});
              }
    }
});



router.post('/fetch_saved_data',async function(req, res) {
    var datas = await temp_data_storedataModel.findOne({job_id: req.body.job_id,group_id:req.body.group_id,user_id :req.body.user_id});
    res.json({Status:"Success",Message:"Joininspection", Data : datas.datas[0].Data, work_status : "Not Submitted", Code:200}); 
});



router.post('/fetch_data_admin',async function(req, res) {
    var datas = await data_store_managementModel.findOne({job_id: req.body.job_id,group_id:req.body.group_id});
    res.json({Status:"Success",Message:"Joininspection", Data : datas, work_status : "Not Submitted", Code:200}); 
});




router.post('/fetch_data_admin_form2',async function(req, res) {
    var datas = await data_store_managementModel.findOne({job_id: req.body.job_id,created_by:'ESPD-ACTIMF'});
    res.json({Status:"Success",Message:"Joininspection", Data : datas, work_status : "Not Submitted", Code:200}); 
});


router.post('/fetch_data_admin_form2_get',async function(req, res) {
    var datas = await data_store_managementModel.find({job_id: req.body.job_id});
    res.json({Status:"Success",Message:"Joininspection", Data : datas, work_status : "Not Submitted", Code:200}); 
});



router.post('/delete_by_user_no',async function (req, res) {
    var group_list = await data_store_managementModel.find({user_id:req.body.user_id});
    for(let a  = 0; a < group_list.length; a++){
              data_store_managementModel.findByIdAndRemove(group_list[a]._id, function (err, user) {
          if (err) return res.json({Status:"Failed",Message:"Internal Server Error", Data : {},Code:500});
      });
              if(a == group_list.length - 1){
                res.json({Status:"Success",Message:"Deleted successfully", Data : {} ,Code:200});
              }
    }
});



router.post('/edit', function (req, res) {
        data_store_managementModel.findByIdAndUpdate(req.body._id, req.body, {new: true}, function (err, UpdatedDetails) {
            if (err) return res.json({Status:"Failed",Message:"Internal Server Error", Data : {},Code:500});
             res.json({Status:"Success",Message:"Functiondetails Updated", Data : UpdatedDetails ,Code:200});
        });
});
// // DELETES A USER FROM THE DATABASE
router.post('/delete', function (req, res) {
      data_store_managementModel.findByIdAndRemove(req.body._id, function (err, user) {
          if (err) return res.json({Status:"Failed",Message:"Internal Server Error", Data : {},Code:500});
          res.json({Status:"Success",Message:"SubFunction Deleted successfully", Data : {} ,Code:200});
      });
});
module.exports = router;
