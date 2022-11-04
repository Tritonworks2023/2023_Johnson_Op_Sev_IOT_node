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


// router.post('/create', async function(req, res) {
// var final_grouplist = [];
// var group_list = await group_detailModel.find({});
// console.log(group_list);
// group_list.forEach(element => {
//   let c = {
//       "group_id":element._id,
//       "group_name":"",
//       "group_data":[]
//      }
//   final_grouplist.push(c)
// });
//   var data_store_detail = await data_store_managementModel.findOne({
//               user_id :  req.body.user_id,
//               activity_id : req.body.activity_id,
//               job_id : req.body.job_id,
//   });
//   console.log(data_store_detail,"Existing");
//   if(data_store_detail == null){
//   let data_stru = final_grouplist;
//    data_stru.forEach(element => {
//     if(element.group_id == req.body.group_id){
//       element.group_data = req.body.Data;
//     }
//    });
//   try{
//         await data_store_managementModel.create({
//               user_id :  req.body.user_id || "",
//               activity_id : req.body.activity_id || "",
//               job_id : req.body.job_id || "",
//               group_id : req.body.group_id || "",
//               sub_group_id : req.body.sub_group_id || "",
//               data_store : data_stru,
//               work_status : "Started",
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
//         }, 
//         function (err, user) {
//           console.log(err);
//           console.log(user)
//         res.json({Status:"Success",Message:"Added successfully", Data : {} ,Code:200}); 
//         });
// }
// catch(e){
//       res.json({Status:"Failed",Message:"Internal Server Error", Data : {},Code:500});
// }
//   }
//   else{
//     data_store_detail.data_store.forEach(element => {
//     if(element.group_id == req.body.group_id){
//       element.group_data = req.body.Data;
//     }
//    });
//     let c = {
//       data_store : data_store_detail.data_store
//     }
//      data_store_managementModel.findByIdAndUpdate(data_store_detail._id, c, {new: true}, function (err, UpdatedDetails) {
//             if (err) return res.json({Status:"Failed",Message:"Internal Server Error", Data : {},Code:500});
//              res.json({Status:"Success",Message:"Functiondetails Updated", Data : {} ,Code:200});
//     });
//   }
// });




router.post('/create', async function(req, res) {
    console.log("DATA STORE IN",req.body);
    var user_details  =  await user_management.findOne({_id:req.body.user_id});
    // console.log("********USER DETAILS***************");
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
           var group_detail  =  await new_group_listModel.findOne({_id:req.body.group_id});
           // console.log("Group Type : ",group_detail);
           if(req.body.created_by == 'ESPD-ACTIMF'){
               group_detail = {SMU_UKEY:'ESPD-ACTIMF'};
           }
           if(group_detail.SMU_UKEY == 'ESPD-ACT3'){
  let temp_count = req.body.Data;
  for(let a  = 0 ;a  < temp_count.length ; a ++){
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
        function (err, result) {
    if (err) { console.error(err.message);
          doRelease(connection);
          return;
     }
    console.log("STEP 1");
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
       if(a == temp_count.length - 1){
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
    console.log("STEP 2");
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
        console.log("STEP 3");
        res.json({Status:"Success",Message:"Added successfully", Data : {} ,Code:200}); 
      }
  }

  }


else if(group_detail.SMU_UKEY == 'OP-ACT1'){
request.post(
    'http://smart.johnsonliftsltd.com:3000/api/activity/plumchar_entry',
    { json: req.body },
    function (error, response, body) {
        if (!error && response.statusCode == 200) {
        }
    console.log("STEP 1");
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
         console.log("STEP 2");
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
    console.log("STEP 3");
    res.json({Status:"Success",Message:"Added successfully", Data : {} ,Code:200}); 
    }
);
    }


    else if(group_detail.SMU_UKEY == 'ESPD-ACT4'){
request.post(
    'http://smart.johnsonliftsltd.com:3000/api/activity/upload_photo_act_four',
    { json: req.body },
    function (error, response, body) {
        if (!error && response.statusCode == 200) {
        }
    console.log("STEP 1");
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
         console.log("STEP 2");
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
    console.log("STEP 3");
    res.json({Status:"Success",Message:"Added successfully", Data : {} ,Code:200}); 
    }
);
    }


 else if(group_detail.SMU_UKEY == 'OP-ACT3'){
request.post(
    'http://smart.johnsonliftsltd.com:3000/api/activity/update_opact3_score',
    { json: req.body },
    function (error, response, body) {
        if (!error && response.statusCode == 200) {
        }
    console.log("STEP 1");
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
         console.log("STEP 2");
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
    console.log("STEP 3");
    res.json({Status:"Success",Message:"Added successfully", Data : {} ,Code:200}); 
    }
);
    }




else if(group_detail.SMU_UKEY == 'ESPD-ACT2'){
request.post(
    'http://smart.johnsonliftsltd.com:3000/api/activity/test_preciption',
    { json: req.body },
    function (error, response, body) {
        if (!error && response.statusCode == 200) {
        }
    console.log("STEP 1");
    
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
        console.log("STEP 2");
     doRelease(connection);

     console.log("STEP 3");
     res.json({Status:"Success",Message:"Added successfully", Data : {} ,Code:200}); 
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
);
    }
    else if(group_detail.SMU_UKEY == 'ESPD-ACT1'){
request.post(
    'http://smart.johnsonliftsltd.com:3000/api/activity/insert_floorheight_detail',
    { json: req.body },
    function (error, response, body) {
        if (!error && response.statusCode == 200) {
        }
    console.log("STEP 1");
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
//          console.log("STEP 2");    
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
         console.log("STEP 3");
         res.json({Status:"Success",Message:"Added successfully", Data : {} ,Code:200}); 
    }
);
    } 
    else if(group_detail.SMU_UKEY == 'ESPD-ACTIMF'){
        console.log("****************888888888",req.body);
        // console.log(user_details);
 request.post(
    'http://smart.johnsonliftsltd.com:3000/api/activity/plumchart_data_update',
    { json: req.body },
    function (error, response, body) {
        if (!error && response.statusCode == 200) {
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
         console.log("****************",result);
         console.log("STEP 2");    
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
    console.log("STEP 3");   
    res.json({Status:"Success",Message:"Added successfully", Data : {} ,Code:200}); 
    }
    );
      // res.json({Status:"Success",Message:"Added successfully", Data : {} ,Code:200}); 
    } 
  else{
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
    res.json({Status:"Success",Message:"Added successfully", Data : {} ,Code:200}); 
  }
        });
}
catch(e){
    res.json({Status:"Failed",Message:"Internal Server Error", Data : {},Code:500});
}
});




router.post('/form_5_create', async function(req, res) {
  // console.log(req.body.Data);
  var final_data = req.body.Data.material_details;
  // let a = {"accepts":0,"demage":0,"desc_qty":0,"excess":0,"material_desc":""+req.body.Data.remarks,"part_no":"remarks","shortage":0};
  // final_data.push(a);
  // console.log("********* Final Data ********",final_data);
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
          console.log(err);
          var counts = req.body.Data.length;
          var init_value = 0;
          recall();
          function recall() {
            // console.log(init_value,counts);
            if(init_value == counts){
              console.log("Existing");
oracledb.getConnection({
      user: "JLSMART",
      password: "JLSMART",
      connectString: "(DESCRIPTION =(ADDRESS = (PROTOCOL = TCP)(HOST = 192.168.1.112)(PORT = 1521))(CONNECT_DATA =(SID = jlpl)))"
}, function(err, connection) {
if (err) {
    // console.error(err.message);
    return;
}
// console.log(req.body.job_id);
connection.execute(
    "UPDATE ESPD_OP_HDR set SMU_ACTIVITY_STATUS=:ac,SM_ACTIVITY_STATDATE=:dfd WHERE SMU_JOBNO=:jn and SMU_UKEY=:uk and SMU_ACTIVITY_STATUS IN (:acd,:ace)",
            {
                ac: 'SUBMITTED',
                dfd: new Date(),
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
     // console.log(result);
     // res.json({Status:"Success",Message:"Updated", Data : result ,Code:200});     
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



    oracledb.getConnection({
      user: "JLSMART",
      password: "JLSMART",
      connectString: "(DESCRIPTION =(ADDRESS = (PROTOCOL = TCP)(HOST = 192.168.1.112)(PORT = 1521))(CONNECT_DATA =(SID = jlpl)))"
}, function(err, connection) {
if (err) {
    // console.error(err.message);
    return;
}
// console.log(req.body.job_id);
connection.execute(
    "UPDATE ESPD_OP_HDR set SMU_ACTIVITY_STATUS=:ac,SM_ACTIVITY_STATDATE=:dfd WHERE SMU_JOBNO=:jn and SMU_UKEY=:uk and SMU_ACTIVITY_STATUS IN (:acd,:ace)",
            {
                ac: 'SUBMITTED',
                dfd: new Date(),
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
     console.log(result);
     // res.json({Status:"Success",Message:"Updated", Data : result ,Code:200});     
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
              res.json({Status:"Success",Message:"Added successfully", Data : {} ,Code:200}); 
            } else {
               // console.log("Input Data Testing"+""+init_value,req.body.Data[init_value]);
               var temp_data = req.body.Data[init_value];
               // console.log("Input Values",temp_data.accepts,temp_data.shortage,temp_data.demage,temp_data.ST_MDD_SLNO);
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
               // console.log(da);
oracledb.getConnection({
      user: "JLSMART",
      password: "JLSMART",
      connectString: "(DESCRIPTION =(ADDRESS = (PROTOCOL = TCP)(HOST = 192.168.1.112)(PORT = 1521))(CONNECT_DATA =(SID = jlpl)))"
}, function(err, connection) {
if (err) {
    // console.error(err.message);
    return;
}
     // connection.execute("SELECT * FROM ESPD_OP_HDR",[], function
      connection.execute(
            "INSERT INTO DISPATCH_ACK (ST_MDD_SEQNO, ST_MDD_SLNO, ST_MDD_MATLID, ST_MDD_PARTNO, ST_MDD_QTY, ST_MDD_UOM, ST_MDD_STATUS, ST_MDD_SSID, ST_MDD_BOMQTY, ST_MDD_RECQTY, ST_MDD_DAMQTY, ST_MDD_SHEXQTY, ST_MDD_RCREMARKS) VALUES (:ST_MDD_SEQNO, :ST_MDD_SLNO, :ST_MDD_MATLID, :ST_MDD_PARTNO, :ST_MDD_QTY, :ST_MDD_UOM, :ST_MDD_STATUS, :ST_MDD_SSID, :ST_MDD_BOMQTY, :ST_MDD_RECQTY, :ST_MDD_DAMQTY, :ST_MDD_SHEXQTY, :ST_MDD_RCREMARKS)",
              da, // Bind values
              { autoCommit: true}, 
        function (err, result) {
    if (err) { console.error(err.message);
          doRelease(connection);
          return;
     }

 doRelease(connection);
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
            init_value = init_value + 1;
            recall();
            }
          }
        });
}
catch(e){
      res.json({Status:"Failed",Message:"Internal Server Error", Data : {},Code:500});
}
 
});





router.post('/form_5_create_resubmit',async function(req, res) {
  // console.log(req.body.Data);
 
    var user_details  =  await data_store_managementModel.findOne({job_id:req.body.job_id,"group_id": "629ede01886f5404a75d4a88"});
    res.json({Status:"Success",Message:"", Data : user_details,Code:500});
  var final_data = user_details.data_store;
  // let a = {"accepts":0,"demage":0,"desc_qty":0,"excess":0,"material_desc":""+req.body.Data.remarks,"part_no":"remarks","shortage":0};
  // final_data.push(a);
  // console.log("********* Final Data ********",final_data);
         req.body.Data = final_data;
          // console.log(err);
          var counts = req.body.Data.length;
          var init_value = 0;
          recall();
          function recall() {
            // console.log(init_value,counts);
            if(init_value == counts){
            // console.log("Existing");
            res.json({Status:"Success",Message:"Added successfully", Data : {} ,Code:200}); 
            } else {
               // console.log("Input Data Testing"+""+init_value,req.body.Data[init_value]);
               var temp_data = req.body.Data[init_value];
               // console.log("Input Values",temp_data.accepts,temp_data.shortage,temp_data.demage,temp_data.ST_MDD_SLNO);
               let da = {
                ST_MDD_SEQNO : temp_data.ST_MDD_SEQNO || 0,
                ST_MDD_SLNO : temp_data.ST_MDD_SLNO || 0,
                ST_MDD_MATLID :temp_data.ST_MDD_MATLID || 0,
                ST_MDD_PARTNO : temp_data.part_no,
                ST_MDD_QTY : temp_data.desc_qty || 0,
                ST_MDD_UOM : temp_data.ST_MDD_UOM || "NOS",
                ST_MDD_STATUS : temp_data.ST_MDD_STATUS || "A",
                ST_MDD_SSID : temp_data.ST_MDD_SSID || null,
                ST_MDD_BOMQTY : temp_data.ST_MDD_BOMQTY || 0,
                ST_MDD_RECQTY : temp_data.accepts,
                ST_MDD_DAMQTY : temp_data.demage,
                ST_MDD_SHEXQTY : temp_data.shortage,
                ST_MDD_RCREMARKS : temp_data.ST_MDD_RCREMARKS || "",
               }
               // console.log(da);
oracledb.getConnection({
      user: "JLSMART",
      password: "JLSMART",
      connectString: "(DESCRIPTION =(ADDRESS = (PROTOCOL = TCP)(HOST = 192.168.1.112)(PORT = 1521))(CONNECT_DATA =(SID = jlpl)))"
}, function(err, connection) {
if (err) {
    // console.error(err.message);
    return;
}
     // connection.execute("SELECT * FROM ESPD_OP_HDR",[], function
      connection.execute(
            "INSERT INTO DISPATCH_ACK VALUES (:ST_MDD_SEQNO, :ST_MDD_SLNO, :ST_MDD_MATLID, :ST_MDD_PARTNO, :ST_MDD_QTY, :ST_MDD_UOM, :ST_MDD_STATUS, :ST_MDD_SSID, :ST_MDD_BOMQTY, :ST_MDD_RECQTY, :ST_MDD_DAMQTY, :ST_MDD_SHEXQTY, :ST_MDD_RCREMARKS)",
              da, // Bind values
              { autoCommit: true}, 
        function (err, result) {
    if (err) { console.error(err.message);
          doRelease(connection);
          return;
     }
  console.log(result);
 doRelease(connection);
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
            init_value = init_value + 1;
            recall();
            }
          } 
});






router.post('/create_one', async function(req, res) {
  try{
        await data_store_managementModel.create({
              user_id :  req.body.user_id || "",
              activity_id : req.body.activity_id || "",
              job_id : req.body.job_id || "",
              group_id : req.body.group_id || "",
              sub_group_id : req.body.sub_group_id || "",
              data_store : [],
              data_store_one : req.body.data_store_one || [],
              data_store_two : [],
              work_status : "Started",
              start_time : req.body.start_time || "",
              pause_time : req.body.pause_time || "",
              total_work_time : 0,
              stop_time : req.body.stop_time || "",
              storage_status : req.body.storage_status || "",
              date_of_create : req.body.date_of_create || "",
              date_of_update : req.body.date_of_update || "",
              created_by : req.body.created_by || "",
              updated_by : req.body.updated_by || "",
              update_reason : req.body.update_reason || "",
        }, 
        function (err, user) {
          console.log(err);
          // console.log(user)
        res.json({Status:"Success",Message:"Added successfully", Data : user ,Code:200}); 
        });
}
catch(e){
      res.json({Status:"Failed",Message:"Internal Server Error", Data : {},Code:500});
}
});


router.post('/create_two', async function(req, res) {
  try{
        await data_store_managementModel.create({
              user_id :  req.body.user_id || "",
              activity_id : req.body.activity_id || "",
              job_id : req.body.job_id || "",
              group_id : req.body.group_id || "",
              sub_group_id : req.body.sub_group_id || "",
              data_store : [],
              data_store_one : [],
              data_store_two : req.body.data_store_two ,
              work_status : "Started",
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
          console.log(err);
          // console.log(user)
        res.json({Status:"Success",Message:"Added successfully", Data : user ,Code:200}); 
        });
}
catch(e){
      res.json({Status:"Failed",Message:"Internal Server Error", Data : {},Code:500});
}
});




router.get('/deletes_one', function (req, res) {
      data_store_managementModel.remove({}, function (err, user) {
          if (err) return res.status(500).send("There was a problem deleting the user.");
             res.json({Status:"Success",Message:"data_store_managementModel Deleted", Data : {} ,Code:200});     
      });
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
        // console.log(          
        //   // job_lat :  req.body.job_lat,
        //   // job_long :  req.body.job_long,
        //   )
        data_store_managementModel.findOne({
          job_id : req.body.job_id,
        }, function (err, StateList) {
           if(StateList == null){
           res.json({Status:"Success",Message:"ESP Not Started the Work", Data : {
            distance : 0
           } ,Code:404});
           }else{
          // console.log(StateList);
          // console.log(StateList.job_lat,StateList.job_long,req.body.job_lat,req.body.job_long);
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
             
              // console.log(distance);
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
          console.log(err);
          // console.log(user)
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
          // console.log(StateList.work_time);
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
          // console.log(StateList.work_time);
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
        console.log(StateList.work_time);

        let total_work_time = 0;
        for(let a  = 0; a < StateList.work_time.length ; a++){
            var date1 = StateList.work_time[a].start_time;
            var date2 = StateList.work_time[a].end_time;
            // console.log(StateList.work_time[a].start_time);
            // console.log(StateList.work_time[a].end_time);
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
            console.log(final_date_start);
            var date1 = StateList.work_time[a].end_time.split(' ');
            var splitdate1 = date1[0].split('-');
            var convert_time1 = convertTime(date1[1]);
            var final_date_end = splitdate1[2]+"-"+splitdate1[1]+"-"+splitdate1[0]+"T"+convert_time1+":00.000Z";
            console.log(final_date_end);
            var date1 = new Date(final_date_start);
            var date2 = new Date(final_date_end);
            console.log(date1,date2);
            var diff = date2.valueOf() - date1.valueOf();
            var diffInHours = diff/1000/60/60; // Convert milliseconds to hours
            console.log(diffInHours);
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
  console.log(req.body);
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
          console.log(filtered.length);
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
               console.log("Testings");
               console.log(Functiondetails.length);
            
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
    console.log(datas);
    res.json({Status:"Success",Message:"Joininspection", Data : datas.datas[0].Data, work_status : "Not Submitted", Code:200}); 
});



router.post('/fetch_data_admin',async function(req, res) {
    var datas = await data_store_managementModel.findOne({job_id: req.body.job_id,group_id:req.body.group_id});
    res.json({Status:"Success",Message:"Joininspection", Data : datas, work_status : "Not Submitted", Code:200}); 
});




router.post('/fetch_data_admin_form2',async function(req, res) {
    var datas = await data_store_managementModel.findOne({job_id: req.body.job_id,created_by:'ESPD-ACTIMF'});
    console.log(datas);
    res.json({Status:"Success",Message:"Joininspection", Data : datas, work_status : "Not Submitted", Code:200}); 
});




router.post('/delete_by_user_no',async function (req, res) {
    var group_list = await data_store_managementModel.find({user_id:req.body.user_id});
    console.log(group_list.length);
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
