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
var error_log_oracelModel = require('./../models/error_log_oracelModel');
var service_tab_submit_data_br_Model = require('./../models/service_tab_submit_data_br_Model');



// ******************************************************************************************************************************************************************************
// OPERATION ESPD-ACT 1 DELETE DATA FROM ORACLE
// ******************************************************************************************************************************************************************************


router.post('/delete_lift_well_data',async function (req, res) {
var data_store_managementModel = require('./../models/data_store_managementModel');
var job_details_two  =  await data_store_managementModel.findOne({job_id:req.body.job_id, group_id:'629ede01886f5404a75d4a84'});
step0();
async function step0() {
    if(job_details_two == null){
step1();
    }else {
       data_store_managementModel.findByIdAndRemove(job_details_two._id, function (err, user) {
          if (err) return res.json({Status:"Failed",Message:"Internal Server Error", Data : {},Code:500});
          // res.json({Status:"Success",Message:"SubFunction Deleted successfully", Data : {} ,Code:200});
          step1();
      }); 
    }
}

function step1() {
 oracledb.getConnection({
      user: "JLSMART",
      password: "JLSMART",
      connectString: "(DESCRIPTION =(ADDRESS = (PROTOCOL = TCP)(HOST = 192.168.1.112)(PORT = 1521))(CONNECT_DATA =(SID = jlpl)))"
}, function(err, connection) {
if (err) {
    return;
}
connection.execute(
    "UPDATE ESPD_OP_HDR set SMU_ACTIVITY_STATUS=:ac WHERE SMU_JOBNO=:jn and SMU_UKEY=:uk",
            {
                ac: 'PUSHED TO MOBILE',
                jn : req.body.job_id,
                uk : 'ESPD-ACT1'
            },
        {autoCommit: true},
        function (err, result) {
    if (err) { console.error(err.message);
          doRelease(connection);
          return;
     }     
     doRelease(connection);
      step2();
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
   function step2() {
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
            "Delete FROM JLSMART_FLOORHEIGHT_DATA WHERE JOBNO = :JOBNO",
            {JOBNO : req.body.job_id},
        {autoCommit: true},
        function (err, result) {
    if (err) { console.error(err.message);
          doRelease(connection);
          return;
     }
     doRelease(connection);
     step3();
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
   function step3() {
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
            "Delete FROM JLSMART_LIFTWELL_DATA WHERE JOBNO = :JOBNO",
            {JOBNO : req.body.job_id},
        {autoCommit: true},
        function (err, result) {
    if (err) { console.error(err.message);
          doRelease(connection);
          return;
     }
     doRelease(connection);
     res.json({Status:"Success",Message:"Removed", Data : {},Code:200});
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
// OPERATION ESPD-ACT 1 COLUMN DETAILS INSERT
// ******************************************************************************************************************************************************************************



router.post('/plumchart_data_update', function (req, res) {
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
     res.json({Status:"Success",Message:"Updated", Data : {} ,Code:200});     

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
// OPERATION ESPD-ACT 1 LIFT WELL DETAILS DATA INSERTING ORACEL
// ******************************************************************************************************************************************************************************



router.post('/insert_floorheight_detail', function (req, res) {
//// This API calling for delete the existing Data and inserting //////////
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

///////// Regular process /////////////
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
     res.json({Status:"Success",Message:"Request Send Successfully", Data : {},Code:200});
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
});












// ******************************************************************************************************************************************************************************
// OPERATION MOBILE JOB COUNT BY ACTIVITY
// ******************************************************************************************************************************************************************************



router.post('/getlist_number',async function (req, res) {
var group_details = await new_group_listModel.find({});    
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
      `SELECT UKEY,UKEY_DESC,CELL_NUMBER, NVL(NEW_ACTIVITY,0) NEW_ACTIVITY FROM (
SELECT
ESPD_OP_HDR.SMU_UKEY UKEY, SMU_UKEY_DESCRIPTION UKEY_DESC,SMU_TECHMOBNO CELL_NUMBER
FROM ESPD_OP_HDR,TEMPLATE_MASTER
WHERE ESPD_OP_HDR.SMU_UKEY = TEMPLATE_MASTER.SMU_UKEY
AND SMU_TECHMOBNO =:fn
and nvl(SMU_ACTIVITY_STATUS,'ALL') NOT IN  ('SUBMITTED','DELETED')
GROUP BY  SMU_TECHMOBNO, ESPD_OP_HDR.SMU_UKEY,SMU_UKEY_DESCRIPTION
),
(
SELECT
ESPD_OP_HDR.SMU_UKEY UKEY1, SMU_UKEY_DESCRIPTION,SMU_TECHMOBNO , COUNT(*) NEW_ACTIVITY
FROM ESPD_OP_HDR,TEMPLATE_MASTER
WHERE ESPD_OP_HDR.SMU_UKEY = TEMPLATE_MASTER.SMU_UKEY
AND SMU_ACTIVITY_STATUS NOT IN  ('SUBMITTED','DELETED')
AND SMU_TECHMOBNO =:fn
GROUP BY  SMU_TECHMOBNO, ESPD_OP_HDR.SMU_UKEY,SMU_UKEY_DESCRIPTION
)
WHERE UKEY = UKEY1(+)`,
        {fn: req.body.phone_number},
        {autoCommit: true},
     function(err, result) {
    if (err) { console.error(err.message);
          doRelease(connection);
          return;
     }
     doRelease(connection);
var ary = [];

if(result.rows.length == 0){
res.json({Status:"Success",Message:"No Record Found", Data : [], Code:200});
}

else{

for(let a = 0 ; a < result.rows.length;a++){
var temp_data = result.rows[a];
var results = {}
for (var i = 0; i < result.metaData.length; ++i){
results[result.metaData[i].name] = temp_data[i];
}
 ary.push(results);   
 if(a == result.rows.length - 1){
    let temp_data = [];
     for(let c = 0; c < group_details.length ; c++){
       for(let d = 0 ; d < ary.length ; d++){
        if(ary[d].UKEY == group_details[c].SMU_UKEY){
            let te = {
            "seqno": group_details[c].SMU_SEQNO,
            "UKEY": ary[d].UKEY,
            "UKEY_DESC": ary[d].UKEY_DESC,
            "CELL_NUMBER": ary[d].CELL_NUMBER,
            "NEW_ACTIVITY": +ary[d].NEW_ACTIVITY,
            "WIP_ACTIVITY": 0,
            "_id": group_details[c]._id,
            "form_type": group_details[c].SMU_FORMTYPE
            }
            temp_data.push(te);
        }
       }
       if(c == group_details.length - 1){

       temp_data = temp_data.sort((a, b) => a.seqno > b.seqno ? 1 : -1);

        res.json({Status:"Success",Message:"Respose Data", Data : temp_data ,Code:200});
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






// ******************************************************************************************************************************************************************************
// IOT DASHBOARD DETAILS
// ******************************************************************************************************************************************************************************




router.get('/dashboard_one', function (req, res) {
oracledb.getConnection({
      user: "jlpliot",
      password: "jlpliot",
      connectString: "(DESCRIPTION =(ADDRESS = (PROTOCOL = TCP)(HOST = 192.168.1.112)(PORT = 1521))(CONNECT_DATA =(SID = jlpl)))"
}, function(err, connection) {
if (err) {
    console.error(err.message);
    return;
}
      connection.execute(
      `SELECT DBD_BRCODE BBRCD, CBM_BR_ANAME BBRNAME,
SUM(CASE WHEN DBD_STAT='UP' THEN 1 ELSE 0 END) BRUP,
SUM(CASE WHEN DBD_STAT='ENT' and DBD_CLEAREDDATE is null THEN 1 ELSE 0 END) BRENTRAP,
SUM(CASE WHEN DBD_STAT='ENT' and DBD_CLEAREDDATE is not null THEN 1 ELSE 0 END) BRENTRAPCLEAR,
SUM(CASE WHEN DBD_STAT='DWN2' THEN 1 ELSE 0 END) BRDWN2,
SUM(CASE WHEN DBD_STAT='BAT' THEN 1 ELSE 0 END) BRBATTERY,
SUM(CASE WHEN DBD_STAT='NC' THEN 1 ELSE 0 END) BRNC,
SUM(CASE WHEN DBD_STAT='DWN1' THEN 1 ELSE 0 END) BRDWN1,
COUNT(*) BRTOT
FROM IOT_DASHBOARD_VW, fties.COM_BRANCH_MST
WHERE DBD_STAT<>'IJ'
AND DBD_BRCODE=CBM_BR_CODE
GROUP BY DBD_BRCODE, CBM_BR_ANAME
ORDER BY 4 DESC, 5 DESC, 6 DESC, 7 DESC, 8 DESC, 1`,
        {},
        {autoCommit: true},
     function(err, result) {
    if (err) { console.error(err.message);
          doRelease(connection);
          return;
     }
      doRelease(connection);
var ary = [];

if(result.rows.length == 0){
res.json({Status:"Success",Message:"No Record Found", Data : [], Code:200});
}

else{
for(let a = 0 ; a < result.rows.length;a++){
var temp_data = result.rows[a];
var results = {}
for (var i = 0; i < result.metaData.length; ++i){
results[result.metaData[i].name] = temp_data[i];
}
 ary.push(results);   
 if(a == result.rows.length - 1){
   res.json({Status:"Success",Message:"Respose Data", Data : ary ,Code:200});
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
// IOT DASHBOARD ENTRAP LIST DETAILS 
// ******************************************************************************************************************************************************************************



router.get('/entrap_list', function (req, res) {
  oracledb.getConnection({
        user: "jlpliot",
        password: "jlpliot",
        connectString: "(DESCRIPTION =(ADDRESS = (PROTOCOL = TCP)(HOST = 192.168.1.112)(PORT = 1521))(CONNECT_DATA =(SID = jlpl)))"
  }, function(err, connection) {
  if (err) {
      console.error(err.message);
      return;
  }
        connection.execute(
        `SELECT DBD_STATDESC,DBD_JOBNO, DBD_BRCODE, DBD_BDOWNTIME, DBD_FAULTDESC, DBD_MECHMOBNO, DBD_CLEAREDDATE
        FROM IOT_DASHBOARD_VW
        WHERE DBD_STATDESC = 'ENTRAP' and DBD_CLEAREDDATE is NULL
        ORDER BY DBD_BDOWNTIME DESC`,
          {},
          {autoCommit: true},
       function(err, result) {
      if (err) { console.error(err.message);
            doRelease(connection);
            return;
       }
        doRelease(connection);
  var ary = [];
  if(result.rows.length == 0){
  res.json({Status:"Success",Message:"No Record Found", Data : [], Code:200});
  }
  
  else{
  for(let a = 0 ; a < result.rows.length;a++){
  var temp_data = result.rows[a];
  var results = {}
  for (var i = 0; i < result.metaData.length; ++i){
  results[result.metaData[i].name] = temp_data[i];
  }
   
   ary.push(results);   
   if(a == result.rows.length - 1){
     res.json({Status:"Success",Message:"Respose Data", Data : ary ,Code:200});
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
// IOT DASHBOARD ENTRAP LIST NO DETAILS 
// ******************************************************************************************************************************************************************************

  

  router.get('/entrap_list_no_null', function (req, res) {
  oracledb.getConnection({
        user: "jlpliot",
        password: "jlpliot",
        connectString: "(DESCRIPTION =(ADDRESS = (PROTOCOL = TCP)(HOST = 192.168.1.112)(PORT = 1521))(CONNECT_DATA =(SID = jlpl)))"
  }, function(err, connection) {
  if (err) {
      console.error(err.message);
      return;
  }
        connection.execute(
        `SELECT DBD_STATDESC,DBD_JOBNO, DBD_BRCODE, DBD_BDOWNTIME, DBD_FAULTDESC, DBD_MECHMOBNO, DBD_CLEAREDDATE
        FROM IOT_DASHBOARD_VW
        WHERE DBD_STATDESC = 'ENTRAP' and DBD_CLEAREDDATE is NOT NULL
        ORDER BY DBD_BDOWNTIME DESC`,
          {},
          {autoCommit: true},
       function(err, result) {
      if (err) { console.error(err.message);
            doRelease(connection);
            return;
       }
       doRelease(connection);
  var ary = [];
  if(result.rows.length == 0){
  res.json({Status:"Success",Message:"No Record Found", Data : [], Code:200});
  }
  else{
  for(let a = 0 ; a < result.rows.length;a++){
  var temp_data = result.rows[a];
  var results = {}
  for (var i = 0; i < result.metaData.length; ++i){
  results[result.metaData[i].name] = temp_data[i];
  }
   
   ary.push(results);   
   if(a == result.rows.length - 1){
     res.json({Status:"Success",Message:"Respose Data", Data : ary ,Code:200});
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
// IOT DASHBOARD BRDN LIST NO DETAILS 
// ******************************************************************************************************************************************************************************



  router.get('/brdn_list_no_null', function (req, res) {
    oracledb.getConnection({
          user: "jlpliot",
          password: "jlpliot",
          connectString: "(DESCRIPTION =(ADDRESS = (PROTOCOL = TCP)(HOST = 192.168.1.112)(PORT = 1521))(CONNECT_DATA =(SID = jlpl)))"
    }, function(err, connection) {
    if (err) {
        console.error(err.message);
        return;
    }
          connection.execute(
          `SELECT DBD_STATDESC,DBD_JOBNO, DBD_BRCODE, DBD_BDOWNTIME, DBD_FAULTDESC, DBD_MECHMOBNO, DBD_CLEAREDDATE
          FROM IOT_DASHBOARD_VW
          WHERE DBD_STATDESC = 'BRDN' and DBD_CLEAREDDATE is NOT NULL
          ORDER BY DBD_BDOWNTIME DESC`,
            {},
            {autoCommit: true},
         function(err, result) {
        if (err) { console.error(err.message);
              doRelease(connection);
              return;
         }
    doRelease(connection);
    var ary = [];
    if(result.rows.length == 0){
    res.json({Status:"Success",Message:"No Record Found", Data : [], Code:200});
    }
    
    else{
    for(let a = 0 ; a < result.rows.length;a++){
    var temp_data = result.rows[a];
    var results = {}
    for (var i = 0; i < result.metaData.length; ++i){
    results[result.metaData[i].name] = temp_data[i];
    }
     ary.push(results);   
     if(a == result.rows.length - 1){
       res.json({Status:"Success",Message:"Respose Data", Data : ary ,Code:200});
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
// IOT DASHBOARD BRDN DETAILS 
// ******************************************************************************************************************************************************************************


  router.get('/brdn_list', function (req, res) {
    oracledb.getConnection({
          user: "jlpliot",
          password: "jlpliot",
          connectString: "(DESCRIPTION =(ADDRESS = (PROTOCOL = TCP)(HOST = 192.168.1.112)(PORT = 1521))(CONNECT_DATA =(SID = jlpl)))"
    }, function(err, connection) {
    if (err) {
        console.error(err.message);
        return;
    }
          connection.execute(
          `SELECT DBD_STATDESC,DBD_JOBNO, DBD_BRCODE, DBD_BDOWNTIME, DBD_FAULTDESC, DBD_MECHMOBNO, DBD_CLEAREDDATE
          FROM IOT_DASHBOARD_VW
          WHERE DBD_STATDESC = 'BRDN' and DBD_CLEAREDDATE is NULL
          ORDER BY DBD_BDOWNTIME DESC`,
            {},
            {autoCommit: true},
         function(err, result) {
        if (err) { console.error(err.message);
              doRelease(connection);
              return;
         }
          doRelease(connection);
    var ary = [];
    if(result.rows.length == 0){
    res.json({Status:"Success",Message:"No Record Found", Data : [], Code:200});
    }
    else{
    for(let a = 0 ; a < result.rows.length;a++){
    var temp_data = result.rows[a];
    var results = {}
    for (var i = 0; i < result.metaData.length; ++i){
    results[result.metaData[i].name] = temp_data[i];
    }
     ary.push(results);   
     if(a == result.rows.length - 1){
       res.json({Status:"Success",Message:"Respose Data", Data : ary ,Code:200});
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
// IOT DASHBOARD BRDN ALL DETAILS 
// ******************************************************************************************************************************************************************************


  router.get('/brdn_list_all', function (req, res) {
    oracledb.getConnection({
          user: "jlpliot",
          password: "jlpliot",
          connectString: "(DESCRIPTION =(ADDRESS = (PROTOCOL = TCP)(HOST = 192.168.1.112)(PORT = 1521))(CONNECT_DATA =(SID = jlpl)))"
    }, function(err, connection) {
    if (err) {
        console.error(err.message);
        return;
    }
          connection.execute(
          `SELECT DBD_STATDESC,DBD_JOBNO, DBD_BRCODE, DBD_BDOWNTIME, DBD_FAULTDESC, DBD_MECHMOBNO, DBD_CLEAREDDATE
          FROM IOT_DASHBOARD_VW
          WHERE DBD_STATDESC = 'BRDN'
          ORDER BY DBD_BDOWNTIME DESC`,
            {},
            {autoCommit: true},
         function(err, result) {
        if (err) { console.error(err.message);
              doRelease(connection);
              return;
         }
         doRelease(connection);
       
    var ary = [];
    
    if(result.rows.length == 0){
    res.json({Status:"Success",Message:"No Record Found", Data : [], Code:200});
    }
    
    else{
    for(let a = 0 ; a < result.rows.length;a++){
    var temp_data = result.rows[a];
    var results = {}
    for (var i = 0; i < result.metaData.length; ++i){
    results[result.metaData[i].name] = temp_data[i];
    }

     ary.push(results);   
     if(a == result.rows.length - 1){
       res.json({Status:"Success",Message:"Respose Data", Data : ary ,Code:200});
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

// ******************************************************************************************************************************************************************************
// IOT DASHBOARD ABAT DETAILS 
// ******************************************************************************************************************************************************************************



    router.get('/abat_list', function (req, res) {
      oracledb.getConnection({
            user: "jlpliot",
            password: "jlpliot",
            connectString: "(DESCRIPTION =(ADDRESS = (PROTOCOL = TCP)(HOST = 192.168.1.112)(PORT = 1521))(CONNECT_DATA =(SID = jlpl)))"
      }, function(err, connection) {
      if (err) {
          console.error(err.message);
          return;
      }
            connection.execute(
            `SELECT DBD_STATDESC,DBD_JOBNO, DBD_BRCODE, DBD_BDOWNTIME, DBD_FAULTDESC, DBD_MECHMOBNO, DBD_CLEAREDDATE
            FROM IOT_DASHBOARD_VW
            WHERE DBD_STATDESC = 'ABAT'
            ORDER BY DBD_BDOWNTIME DESC`,
              {},
              {autoCommit: true},
           function(err, result) {
          if (err) { console.error(err.message);
                doRelease(connection);
                return;
           }
            doRelease(connection);
          
      var ary = [];
      
      if(result.rows.length == 0){
      res.json({Status:"Success",Message:"No Record Found", Data : [], Code:200});
      }
      
      else{
      for(let a = 0 ; a < result.rows.length;a++){
      var temp_data = result.rows[a];
      var results = {}
      for (var i = 0; i < result.metaData.length; ++i){
      results[result.metaData[i].name] = temp_data[i];
      }
      
       ary.push(results);   
       if(a == result.rows.length - 1){
         res.json({Status:"Success",Message:"Respose Data", Data : ary ,Code:200});
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
// IOT DASHBOARD EBAT DETAILS 
// ******************************************************************************************************************************************************************************


      router.get('/ebat_list', function (req, res) {
        oracledb.getConnection({
              user: "jlpliot",
              password: "jlpliot",
              connectString: "(DESCRIPTION =(ADDRESS = (PROTOCOL = TCP)(HOST = 192.168.1.112)(PORT = 1521))(CONNECT_DATA =(SID = jlpl)))"
        }, function(err, connection) {
        if (err) {
            console.error(err.message);
            return;
        }
              connection.execute(
              `SELECT DBD_STATDESC,DBD_JOBNO, DBD_BRCODE, DBD_BDOWNTIME, DBD_FAULTDESC, DBD_MECHMOBNO, DBD_CLEAREDDATE
              FROM IOT_DASHBOARD_VW
              WHERE DBD_STATDESC = 'EBAT'
              ORDER BY DBD_BDOWNTIME DESC`,
                {},
                {autoCommit: true},
             function(err, result) {
            if (err) { console.error(err.message);
                  doRelease(connection);
                  return;
             }
              doRelease(connection);
        var ary = [];
        if(result.rows.length == 0){
        res.json({Status:"Success",Message:"No Record Found", Data : [], Code:200});
        }
        else{
        for(let a = 0 ; a < result.rows.length;a++){
        var temp_data = result.rows[a];
        var results = {}
        for (var i = 0; i < result.metaData.length; ++i){
        results[result.metaData[i].name] = temp_data[i];
        }
   
         ary.push(results);   
         if(a == result.rows.length - 1){
           res.json({Status:"Success",Message:"Respose Data", Data : ary ,Code:200});
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
// IOT DASHBOARD DETAILS OVER ALL
// ******************************************************************************************************************************************************************************


router.get('/dashboard_two', function (req, res) {
    // AND DBD_BRCODE = 'TN01'
oracledb.getConnection({
      user: "jlpliot",
      password: "jlpliot",
      connectString: "(DESCRIPTION =(ADDRESS = (PROTOCOL = TCP)(HOST = 192.168.1.112)(PORT = 1521))(CONNECT_DATA =(SID = jlpl)))"
}, function(err, connection) {
if (err) {
    console.error(err.message);
    return;
}
      connection.execute(
      `SELECT SYSDATE ASOFTIME, STAT, SUM(STATCNT) STATCNT, MAX(SNO) SNO FROM
(SELECT DBD_STAT STAT, COUNT(*) STATCNT, 0 SNO
FROM IOT_DASHBOARD_VW
WHERE DBD_STAT<>'IJ'

GROUP BY DBD_STAT
UNION
SELECT 'UP', 0, 1 SNO FROM DUAL
UNION
SELECT 'ENT', 0, 2 SNO FROM DUAL
UNION
SELECT 'DWN2', 0, 3 SNO FROM DUAL
UNION
SELECT 'BAT', 0, 4 SNO FROM DUAL
UNION
SELECT 'NC', 0, 5 SNO FROM DUAL
UNION
SELECT 'DWN1', 0, 6 SNO FROM DUAL
)
GROUP BY STAT
ORDER BY 4`,
        {},
        {autoCommit: true},
     function(err, result) {
    if (err) { console.error(err.message);
          doRelease(connection);
          return;
     }
      doRelease(connection);
var ary = [];

if(result.rows.length == 0){
res.json({Status:"Success",Message:"No Record Found", Data : [], Code:200});
}

else{
for(let a = 0 ; a < result.rows.length;a++){
var temp_data = result.rows[a];
var results = {}
for (var i = 0; i < result.metaData.length; ++i){
results[result.metaData[i].name] = temp_data[i];
}

 ary.push(results);   
 if(a == result.rows.length - 1){
   res.json({Status:"Success",Message:"Respose Data", Data : ary ,Code:200});
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
// IOT DASHBOARD DETAILS BRANCHWISE
// ******************************************************************************************************************************************************************************



router.post('/dashboard_two_branch_wise', function (req, res) {
    // AND DBD_BRCODE = 'TN01'
oracledb.getConnection({
      user: "jlpliot",
      password: "jlpliot",
      connectString: "(DESCRIPTION =(ADDRESS = (PROTOCOL = TCP)(HOST = 192.168.1.112)(PORT = 1521))(CONNECT_DATA =(SID = jlpl)))"
}, function(err, connection) {
if (err) {
    console.error(err.message);
    return;
}
      connection.execute(
      `SELECT SYSDATE ASOFTIME, STAT, SUM(STATCNT) STATCNT, MAX(SNO) SNO FROM
(SELECT DBD_STAT STAT, COUNT(*) STATCNT, 0 SNO
FROM IOT_DASHBOARD_VW
WHERE DBD_STAT<>'IJ' AND DBD_BRCODE=:brncd
GROUP BY DBD_STAT
UNION
SELECT 'UP', 0, 1 SNO FROM DUAL
UNION
SELECT 'ENT', 0, 2 SNO FROM DUAL
UNION
SELECT 'DWN2', 0, 3 SNO FROM DUAL
UNION
SELECT 'BAT', 0, 4 SNO FROM DUAL
UNION
SELECT 'NC', 0, 5 SNO FROM DUAL
UNION
SELECT 'DWN1', 0, 6 SNO FROM DUAL
)
GROUP BY STAT
ORDER BY 4`,
        { brncd : req.body.brncd},
        {autoCommit: true},
     function(err, result) {
    if (err) { console.error(err.message);
          doRelease(connection);
          return;
     }
doRelease(connection);
var ary = [];
if(result.rows.length == 0){
res.json({Status:"Success",Message:"No Record Found", Data : [], Code:200});
}

else{
for(let a = 0 ; a < result.rows.length;a++){
var temp_data = result.rows[a];
var results = {}
for (var i = 0; i < result.metaData.length; ++i){
results[result.metaData[i].name] = temp_data[i];
}
 ary.push(results);   
 if(a == result.rows.length - 1){
   res.json({Status:"Success",Message:"Respose Data", Data : ary ,Code:200});
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
// OPERATION JOINT INSPECTION ENG SUBMIT
// ******************************************************************************************************************************************************************************

router.post('/update_join_inspect_hdr',async function (req, res) {
var joininspectionModel = require('./../models/joininspectionModel');
var user_detail = await joininspectionModel.findOne({job_id : req.body.job_no});
if(user_detail == null){
  res.json({Status:"Failed",Message:"Please fill the forms",Data : {} ,Code:404});
} else
{
var string = req.body.Name.split(",");

var SMU_SERVJI_MOBNO = string[2];
var SMU_SERVJI_EMPNO = string[0];
var SMU_SERVJI_EMPNAME = string[1];
var SMU_JOBNO = req.body.job_no;
var SMU_UKEY = ''
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
    "UPDATE ESPD_OP_HDR set SMU_SERVJI_MOBNO=:SMU_SERVJI_MOBNO,SMU_SERVJI_EMPNO=:SMU_SERVJI_EMPNO,SMU_SERVJI_EMPNAME=:SMU_SERVJI_EMPNAME,SMU_ACTIVITY_STATUS=:SMU_ACTIVITY_STATUS WHERE SMU_JOBNO=:SMU_JOBNO and SMU_UKEY=:SMU_UKEY",
            {
                SMU_SERVJI_MOBNO: SMU_SERVJI_MOBNO,
                SMU_SERVJI_EMPNO : SMU_SERVJI_EMPNO,
                SMU_SERVJI_EMPNAME : SMU_SERVJI_EMPNAME,
                SMU_JOBNO : SMU_JOBNO,
                SMU_UKEY : 'OP-ACT8',
                SMU_ACTIVITY_STATUS : 'SUBMITTED'
            },
        {autoCommit: true},
     async   function (err, result) {
    if (err) { console.error(err.message);
          let a = {
          "job_no" : SMU_JOBNO || '',
          "service_type" : "Operation",
          "activity" : "OP-ACT8",
          "follow_detail":"ESPD_OP_HDR UPDATE",
          "url":"/update_join_inspect_hdr",
          "date_time" : new Date(),
          "error_detail": [err.toString()],
          "data" : [req.body],
          "user_no" : SMU_SERVJI_MOBNO
          }   
      var submitted = await error_log_oracelModel.create(a);

          doRelease(connection);
          return;
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
    `select * from ESPD_OP_HDR where SMU_TECHMOBNO=:SMU_TECHMOBNO and SMU_JOBNO=:SMU_JOBNO and SMU_UKEY=:SMU_UKEY`,
            {
                SMU_TECHMOBNO : SMU_SERVJI_MOBNO,
                SMU_JOBNO : SMU_JOBNO,
                SMU_UKEY : 'OP-ACT8S',
            },
        {autoCommit: true},
     async   function (err, results) {
    if (err) { console.error(err.message);
  
          let a = {
          "job_no" : SMU_JOBNO || '',
          "service_type" : "Operation",
          "activity" : "OP-ACT8",
          "follow_detail":"ESPD_OP_HDR SELETE",
          "url":"/update_join_inspect_hdr",
          "date_time" : new Date(),
          "error_detail": [err.toString()],
          "data" : [req.body],
          "user_no" : SMU_SERVJI_MOBNO
          }   
      var submitted = await error_log_oracelModel.create(a);

          doRelease(connection);
          return;
     }  
     if(results.rows.length == 0){
        res.json({Status:"Success",Message:"Updated Success",Data : {} ,Code:200});
     }else{
        res.json({Status:"Success",Message:"Updated Success",Data : {} ,Code:200});
     }
     doRelease(connection);
   });
}); 
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







// ******************************************************************************************************************************************************************************
// OPERATION 
// ******************************************************************************************************************************************************************************



router.post('/test_preciption',async function (req, res) {
   
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
    res.json({Status:"Success",Message:"Mail Send", Data : {} ,Code:200});
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
// OPERATION OP ACT 4 FILE INSERT ORACLE
// ******************************************************************************************************************************************************************************


router.post('/upload_photo_act_four',async function (req, res) { 

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
     res.json({Status:"Success",Message:"Successfully Submitted", Data : {} ,Code:200});
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
// OPERATION PLUMCHAR ENTRY ORACLE INSERT
// ******************************************************************************************************************************************************************************


router.post('/plumchar_entry',async function (req, res) {
      var datas = req.body.Data;
      var user_details = await user_management.findOne({_id:req.body.user_id});

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
second_stage(myArray);   
});
});
function second_stage(myArray){
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
    }else {
        res.json({Status:"Success",Message:"Successfully Submitted", Data : {} ,Code:200});
    }
}
}
});







// ******************************************************************************************************************************************************************************
// OPERATION JOINT INSPECTION ENG LIST FETCH FROM ORACEL
// ******************************************************************************************************************************************************************************

router.post('/get_joins_user_list',async function (req, res) {
    if(req.body.user_location == undefined){
       req.body.user_location = "'TN01','KA01','TG01','TN17','TN04','PY01','TN14','TN03','TN15','TN27'";
    }else {
        req.body.user_location = "'"+req.body.user_location+"'";
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
      connection.execute(
      "SELECT OM_JIM_EMPNO EMPNO, OM_JIM_EMPNAME EMPNAME, OM_JIM_MOBNO MOBILE FROM OM_JOINTINSP_MST WHERE OM_JIM_BRCODE in ("+req.body.user_location+")",
        {},
        {autoCommit: true},
     function(err, result) {
    if (err) { console.error(err.message);
          doRelease(connection);
          return;
     }
     doRelease(connection);
var ary = [];
if(result.rows.length == 0){
res.json({Status:"Success",Message:"No Record Found", Data : [], Code:200});
}
else{
for(let a = 0 ; a < result.rows.length;a++){
var temp_data = result.rows[a];
var results = {}
for (var i = 0; i < result.metaData.length; ++i){
results[result.metaData[i].name] = temp_data[i];
}
 ary.push(results);   
 if(a == result.rows.length - 1){
   
    var temp_data = []; 
    ary.forEach(element => {
     temp_data.push(
        { name : ''+element.EMPNO+","+element.EMPNAME+","+element.MOBILE}
        )
    });
   res.json({Status:"Success",Message:"Respose Data", Data : temp_data ,Code:200});
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
// MOBILE APP VERSION RELEASE DETAILS
// ******************************************************************************************************************************************************************************



router.get('/getlatest_version', function (req, res) {
        res.json({Status:"Success",Message:"Version", Data : {
version : "17.04.2023",
apk_link : "http://smart.johnsonliftsltd.com:3000/api/uploads/17042023.apk"
        } ,Code:200});
});



router.get('/service_getlatest_version', function (req, res) {
       res.json({Status:"Success",Message:"Version", Data : {
            version : "29.03.2023.1",
            apk_link : "http://smart.johnsonliftsltd.com:3000/api/uploads/JLS_26_08_23.apk"
        } ,Code:200});
});



router.get('/tab_getlatest_version', function (req, res) {
        res.json({Status:"Success",Message:"Version", Data : {
            version : "25.08.2022.1",
            apk_link : "http://smart.johnsonliftsltd.com:3000/api/uploads/johnson_tab_16_5_22.apk"
        } ,Code:200});
});


// ******************************************************************************************************************************************************************************






// ******************************************************************************************************************************************************************************
// OPERAION PLUM CHART DROPDOWN
// ******************************************************************************************************************************************************************************



router.get('/pump_chart_dropdown', function (req, res) {
  res.json({Status:"Success",Message:"Version", Data : [
{
     name:"STANDARD - GBT000",
     img_url:"http://smart.johnsonliftsltd.com:3000/api/uploads/default.jpg"
},
{
     name:"REAR SIDE CWT SLING - GBT001",
     img_url:"http://smart.johnsonliftsltd.com:3000/api/uploads/input1.jpg"
},
{
    name:"RH SIDE CWT WITH MRL BRACKET - GBT002",
    img_url:"http://smart.johnsonliftsltd.com:3000/api/uploads/input2.jpg"
},
{
  name:"LH SIDE CWT WITH MRL BRACKET - GBT003",
  img_url:"http://smart.johnsonliftsltd.com:3000/api/uploads/input3.jpg"
},
{
  name:"RH SIDE CWT WITH COMBINE BRACKET - GBT004",
  img_url:"http://smart.johnsonliftsltd.com:3000/api/uploads/input5.jpg"
},
{
  name:"LH SIDE CWT WITH COMBINE BRACKET - GBT005",
  img_url:"http://smart.johnsonliftsltd.com:3000/api/uploads/input4.jpg"
  
},

] ,Code:200});
});

















// ******************************************************************************************************************************************************************************
// SALES CHEQ COLLECTION RTGS LIST
// ******************************************************************************************************************************************************************************


router.get('/form3_rtgs_list', function (req, res) {
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
      `select FA_BSD_UTRNO, FA_BSD_bankDT, FA_BSD_AMOUNT, FA_BSD_CUSACNM, FA_BSD_IFSCCD, FA_BSD_BALAMT
from FA_BANKSTMT_DTL
where FA_BSD_PREPDT >= '01-apr-2022'
and FA_BSD_BALAMT > 0`,
        {},
        {autoCommit: true},
     function(err, result) {
    if (err) { console.error(err.message);
          res.json({Status:"Failed",Message:"Internal Server Error", Data : [], Code:500});
          doRelease(connection);
          return;
     }
var ary = [];

if(result.rows.length == 0){
res.json({Status:"Success",Message:"No Record Found", Data : [], Code:200});
}

else{
for(let a = 0 ; a < result.rows.length;a++){
var temp_data = result.rows[a];
var results = {}
for (var i = 0; i < result.metaData.length; ++i){
results[result.metaData[i].name] = temp_data[i];
}

 ary.push(results);   
 if(a == result.rows.length - 1){
ary.forEach(element => {
  var todayDate = new Date(element.FA_BSD_BANKDT).toISOString().slice(0, 10);
  const myArray2 = todayDate.split("-");
  element.FA_BSD_BANKDT = ""+myArray2[2]+"/"+myArray2[1]+"/"+myArray2[0];
});


   // ary = ary.sort((a, b) => a.FA_BSD_BANKDT > b.FA_BSD_BANKDT ? 1 : -1);
 
   res.json({Status:"Success",Message:"Respose Data", Data : ary ,Code:200});
 }
}
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
});







router.post('/lift_data_test', function (req, res) {
    // AND DBD_BRCODE = 'TN01'
oracledb.getConnection({
      user: "jlpliot",
      password: "jlpliot",
      connectString: "(DESCRIPTION =(ADDRESS = (PROTOCOL = TCP)(HOST = 192.168.1.112)(PORT = 1521))(CONNECT_DATA =(SID = jlpl)))"
}, function(err, connection) {
if (err) {
    console.error(err.message);
    return;
}
      connection.execute(
      `select SLIFTID,SFLRSTAT2,SDEVDATE,SSERVDATE,SPKTDATE,SPROCINPUT from (select  SLIFTID,SFLRSTAT2,SDEVDATE,SSERVDATE,SPKTDATE,SPROCINPUT from JLPLIOT.IOT_MONGOSCHED_DTL a where SDEVDATE =  (SELECT MAX(SDEVDATE) FROM JLPLIOT.IOT_MONGOSCHED_DTL b where SLIFTID =:fn) and  sflrstat2 is not null AND SLIFTID =:fn )`,
        {fn:req.body.job_no},
        {autoCommit: true},
     function(err, result) {
    if (err) { console.error(err.message);
          doRelease(connection);
          return;
     }
     
var ary = [];

if(result.rows.length == 0){
res.json({Status:"Success",Message:"No Record Found", Data : [], Code:200});
}

else{
for(let a = 0 ; a < result.rows.length;a++){
var temp_data = result.rows[a];
var results = {}
for (var i = 0; i < result.metaData.length; ++i){
results[result.metaData[i].name] = temp_data[i];
}

 ary.push(results);   
 if(a == result.rows.length - 1){
   res.json({Status:"Success",Message:"Respose Data", Data : ary ,Code:200});
 }
}
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

});



// ******************************************************************************************************************************************************************************
// IOT 
// ******************************************************************************************************************************************************************************


router.get('/lift_data_test_list', function (req, res) {
oracledb.getConnection({
      user: "jlpliot",
      password: "jlpliot",
      connectString: "(DESCRIPTION =(ADDRESS = (PROTOCOL = TCP)(HOST = 192.168.1.112)(PORT = 1521))(CONNECT_DATA =(SID = jlpl)))"
}, function(err, connection) {
if (err) {
    console.error(err.message);
    return;
}
      connection.execute(
      `select SLIFTID,SFLRSTAT2,SDEVDATE,SSERVDATE,SPKTDATE,SPROCINPUT, SRUNSTAT2 from (select SLIFTID,SFLRSTAT2,SDEVDATE,SSERVDATE,SPKTDATE,SPROCINPUT, SRUNSTAT2 from JLPLIOT.IOT_MONGOSCHED_DTL a where SDEVDATE = (SELECT MAX(SDEVDATE) FROM JLPLIOT.IOT_MONGOSCHED_DTL b where SLIFTID = 'L-P2909') and  sflrstat2 is not null AND sLIFTID = 'L-P2909' order by 3 desc)`,
        {},
        {autoCommit: true},
     function(err, result) {
    if (err) { console.error(err.message);
          doRelease(connection);
          return;
     }
   
var ary = [];

if(result.rows.length == 0){
res.json({Status:"Success",Message:"No Record Found", Data : [], Code:200});
}

else{
for(let a = 0 ; a < result.rows.length;a++){
var temp_data = result.rows[a];
var results = {}
for (var i = 0; i < result.metaData.length; ++i){
results[result.metaData[i].name] = temp_data[i];
}
 
 ary.push(results);   
 if(a == result.rows.length - 1){
   res.json({Status:"Success",Message:"Respose Data", Data : ary ,Code:200});
 }
}
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

});



// ******************************************************************************************************************************************************************************
// SALES CHEQ COLLECTION RTGS FIND JOB
// ******************************************************************************************************************************************************************************



router.post('/form3_rtgs_jobno_find', function (req, res) {

     req.body.Job_no = req.body.Job_no;
   
if(req.body.jtype == 'Service'){

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
        `select * from collection_lov_vw where jtype = 'SERV' and  JOBNO=:Job_no`,
        {Job_no:req.body.Job_no},
        {autoCommit: true},
     function(err, result) {
    if (err) { console.error(err.message);
          res.json({Status:"Failed",Message:"Internal Server Error", Data : [], Code:500});
          doRelease(connection);
          return;
     }
var ary = [];

if(result.rows.length == 0){
res.json({Status:"Success",Message:"No Record Found", Data : [], Code:200});
}

else{
for(let a = 0 ; a < result.rows.length;a++){
var temp_data = result.rows[a];
var results = {}
for (var i = 0; i < result.metaData.length; ++i){
results[result.metaData[i].name] = temp_data[i];
}
 
 ary.push(results);   
 if(a == result.rows.length - 1){
  var fin_data = [];
  ary.forEach(element => {
    fin_data.push({
                   "customer_name": element.CUSNAME,
                   "contract_no" : element.CONTNO
               });
  });
   res.json({Status:"Success",Message:"Respose Data", Data : fin_data ,Code:200});
 }
}
}
     doRelease(connection);
   });
});

}
else {
  
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
        `select * from collection_lov_vw where jtype = 'MAJ' and CONTNO=:Job_no`,
        {Job_no:req.body.Job_no},
        {autoCommit: true},
     function(err, result) {
    if (err) { console.error(err.message);
          res.json({Status:"Failed",Message:"Internal Server Error", Data : [], Code:500});
          doRelease(connection);
          return;
     }
var ary = [];

if(result.rows.length == 0){
res.json({Status:"Success",Message:"No Record Found", Data : [], Code:200});
}

else{
for(let a = 0 ; a < result.rows.length;a++){
var temp_data = result.rows[a];
var results = {}
for (var i = 0; i < result.metaData.length; ++i){
results[result.metaData[i].name] = temp_data[i];
}

 ary.push(results);   
 if(a == result.rows.length - 1){
     var fin_data = [];
  ary.forEach(element => {
    fin_data.push({
                   "customer_name": element.CUSNAME,
                   "contract_no" : element.CONTNO
               });
  });
   res.json({Status:"Success",Message:"Respose Data", Data : fin_data ,Code:200});
 }
}
}
     doRelease(connection);
   });
});

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



// ******************************************************************************************************************************************************************************
// SALES CHEQ COLLECTION FORM SUBMIT
// ******************************************************************************************************************************************************************************



router.post('/form3_submit', function (req, res) {

request.post(
    'http://smart.johnsonliftsltd.com:3000/api/tab_form_three/create',
    { json: req.body },
    function (error, response, body) {
        if (!error && response.statusCode == 200) {
            res.json({Status:"Success",Message:"Data Submitted Successfully", Data : {} ,Code:200});
        }
    }
);
});



// ******************************************************************************************************************************************************************************
// SALES CHEQ COLLECTION FORM SUBMIT
// ******************************************************************************************************************************************************************************



router.post('/form3_submit_test', function (req, res) {
 res.json({Status:"Success",Message:"Data Submitted Successfully", Data : {} ,Code:200});
});



// ******************************************************************************************************************************************************************************
// OPERATION JOINT INSEPECTION COUNT ORACLE UPDATE 
// ******************************************************************************************************************************************************************************



router.post('/updatejointinspection_count', function (req, res) {
var SMU_SERVJI_MOBNO = req.body.SMU_SERVJI_MOBNO;
var SMU_JOBNO = req.body.SMU_JOBNO;
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
         `select * from ESPD_OP_HDR where SMU_TECHMOBNO=:SMU_SERVJI_MOBNO and SMU_JOBNO=:SMU_JOBNO and SMU_UKEY=:SMU_UKEY`,
            {
                SMU_SERVJI_MOBNO : SMU_SERVJI_MOBNO,
                SMU_JOBNO : SMU_JOBNO,
                SMU_UKEY : 'OP-ACT8S',
            },
        {autoCommit: true},
        function (err, result) {
    if (err) { console.error(err.message);
          doRelease(connection);
          return;
     }
    
var ary = [];  
for(let a = 0 ; a < result.rows.length;a++){
var temp_data = result.rows[a];
var results = {}
for (var i = 0; i < result.metaData.length; ++i){
results[result.metaData[i].name] = temp_data[i];
}

 ary.push(results);   
 if(a == result.rows.length - 1){
    var final_data = ary[0];
    if(final_data.SMU_8SREVNO == null){
        final_data.SMU_8SREVNO = 0;
    }
    final_data.SMU_8SREVNO = final_data.SMU_8SREVNO + 1;


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
    "UPDATE ESPD_OP_HDR set SMU_8SREVNO=:SMU_8SREVNO WHERE SMU_TECHMOBNO=:SMU_SERVJI_MOBNO and SMU_JOBNO=:SMU_JOBNO and SMU_UKEY=:SMU_UKEY",
            {
                SMU_SERVJI_MOBNO : SMU_SERVJI_MOBNO,
                SMU_JOBNO : SMU_JOBNO,
                SMU_UKEY : 'OP-ACT8S',
                SMU_8SREVNO : final_data.SMU_8SREVNO
            },
        {autoCommit: true},
        function (err, result) {
    if (err) { console.error(err.message);
          doRelease(connection);
          return;
     }
     res.json({Status:"Success",Message:"Updated Success",Data : {} ,Code:200});
     // res.json({Status:"Success",Message:"Updated", Data : result ,Code:200});     
     doRelease(connection);
   }); 
  }); 
    

 }
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
});



// ******************************************************************************************************************************************************************************
// OPERATION OP-ACT 3 SCORE ORACLE INSERT
// ******************************************************************************************************************************************************************************




router.post('/update_opact3_score',async function (req, res) {
   
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
      res.json({Status:"Success",Message:"State List", Data : {},Code:200});  
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
// OPERATION OP-ACT 7 SCORE UPDATE ORACEL INSERT
// ******************************************************************************************************************************************************************************




router.post('/update_opact7_score',async function (req, res) {
    
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
      res.json({Status:"Success",Message:"State List", Data : {},Code:200});  
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
// IOT CUSTOMER NAME RTGS
// ******************************************************************************************************************************************************************************


router.post('/form3_rtgs_jobno_find_customer', function (req, res) {
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
        `select * from collection_lov_vw where CONTNO=:CONTNO`,
        {CONTNO:req.body.contract_no},
        {autoCommit: true},
     function(err, result) {
    if (err) { console.error(err.message);
          res.json({Status:"Failed",Message:"Internal Server Error", Data : [], Code:500});
          doRelease(connection);
          return;
     }
var ary = [];

if(result.rows.length == 0){
res.json({Status:"Success",Message:"No Record Found", Data : [], Code:200});
}

else{
for(let a = 0 ; a < result.rows.length;a++){
var temp_data = result.rows[a];
var results = {}
for (var i = 0; i < result.metaData.length; ++i){
results[result.metaData[i].name] = temp_data[i];
}
 
 ary.push(results);   
 if(a == result.rows.length - 1){
    console.log("RTGS *****************",ary);
    if(ary[0].FRDT == null){
       ary[0].FRDT = "";
    }
    else{
        ary[0].FRDT.setDate(ary[0].FRDT.getDate() + 1);
    }

    if(ary[0].TODT == null){
          ary[0].TODT = "";
    }else{
          ary[0].TODT.setDate(ary[0].TODT.getDate() + 1);
    }
    let fin_data = {
        customer_name : ary[0].CUSNAME,
        FRDT : ary[0].FRDT,
        TODT : ary[0].TODT,
        BALAMT : ary[0].BALAMT
    }
  
   res.json({Status:"Success",Message:"Respose Data", Data : fin_data ,Code:200});
 }
}
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
});




// ******************************************************************************************************************************************************************************
// OPERATION LIFT WELL DETAIL FLOOR HEIGHT INSERT ORACEL
// ******************************************************************************************************************************************************************************


router.post('/update_floor_heigh_value2', function (req, res) {
 final_temp_data2 = [];

 req.body.lift_list.forEach(element => {
         var string = element.title.split("-");
         var number = +string[0]
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
              da, // Bind values
              { autoCommit: true}, 
        function (err, result) {
    if (err) { console.error(err.message);
          doRelease(connection);
          return;
     }
         
     // res.json({Status:"Success",Message:"Request Send Successfully", Data : {},Code:200});
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
}
});













// ******************************************************************************************************************************************************************************
// OPERATION SPEC DETAILS VIEW
// ******************************************************************************************************************************************************************************


router.post('/spec_details',async function (req, res) {
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
        `SELECT * from JLS_SPEC_DTL where JOBNO = : P_JOBNO`,
        {P_JOBNO :  req.body.job_id},
        {autoCommit: true},
     function(err, result) {
    if (err) { console.error(err.message);
          res.json({Status:"Failed",Message:"Internal Server Error", Data : {}, Code:500});
          doRelease(connection);
          return;
     }
     doRelease(connection);
var ary = [];

if(result.rows.length == 0){
res.json({Status:"Success",Message:"No Record Found", Data : {}, Code:200});
}

else{
for(let a = 0 ; a < result.rows.length;a++){
var temp_data = result.rows[a];
var results = {}
for (var i = 0; i < result.metaData.length; ++i){
results[result.metaData[i].name] = temp_data[i];
}
 if(a == result.rows.length - 1){
    res.json({Status:"Success",Message:"Data Submitted Successfully", Data : results ,Code:200});
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











router.get('/pull_data_partmst',async function (req, res) {
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
        `Select * from JLS_Partmaster where DWNLOAD_STATUS = 'N'`,
        {},
        {autoCommit: true},
     function(err, result) {
    if (err) { console.error(err.message);
          res.json({Status:"Failed",Message:"Internal Server Error", Data : [], Code:500});
          doRelease(connection);
          return;
     }
      doRelease(connection);
var ary = [];

if(result.rows.length == 0){
res.json({Status:"Success",Message:"No Record Found", Data : [], Code:200});
}

else{
for(let a = 0 ; a < result.rows.length;a++){
var temp_data = result.rows[a];
var results = {}
for (var i = 0; i < result.metaData.length; ++i){
results[result.metaData[i].name] = temp_data[i];
}
 
 ary.push({
                   "part_no": results.PARTNO,
                   "part_type":results.MODELTYPE,
                   "part_name" : results.PARTNAME});   
 if(a == result.rows.length - 1){
   
    res.json({Status:"Success",Message:"Data Submitted Successfully", Data : ary ,Code:200});
 }
}
}
     // doRelease(connection);
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
// OPERATION ATTENDANCE ATIVITY LIST
// ******************************************************************************************************************************************************************************


router.get('/operation_activity_list', function (req, res) {
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
            `select CAM_ATY_ATTRIBUTE ACT_CODE, CAM_ATY_CODE OPR_ACT_CODE, CAM_ATY_DESC ACT_DESC from com_activity_mst where  CAM_ATY_TYPE = 'WKACT' ORDER BY 2`,
            {},
            {autoCommit: true},
         function(err, result) {
        if (err) { console.error(err.message);
              res.json({Status:"Failed",Message:"Internal Server Error", Data : [], Code:500});
              doRelease(connection);
              return;
         }
    doRelease(connection);
    var ary = [];
    if(result.rows.length == 0){
    res.json({Status:"Success",Message:"No Record Found", Data : [], Code:200});
    }
    else{
    for(let a = 0 ; a < result.rows.length;a++){
    var temp_data = result.rows[a];
    var results = {}
    for (var i = 0; i < result.metaData.length; ++i){
    results[result.metaData[i].name] = temp_data[i];
    }
     ary.push({
        act_name : results.ACT_CODE,
        desc : results.ACT_DESC
     });   
     if(a == result.rows.length - 1){
         res.json({Status:"Success",Message:"Activity Name List", Data : ary ,Code:200});
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
// OPERATION ATTENDANCE ATIVITY LIST
// ******************************************************************************************************************************************************************************



router.post('/operation_activity_job', function (req, res) {
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
            `select * from ESPD_OP_HDR where SMU_JOBNO=:JOBNO`,
            {JOBNO : req.body.JOBNO},
            {autoCommit: true},
         function(err, result) {
        if (err) { console.error(err.message);
              res.json({Status:"Failed",Message:"Internal Server Error", Data : [], Code:500});
              doRelease(connection);
              return;
         }
    doRelease(connection);
    var ary = [];
    if(result.rows.length == 0){
    res.json({Status:"Success",Message:"No Record Found", Data : [], Code:200});
    }
    else{
    for(let a = 0 ; a < result.rows.length;a++){
    var temp_data = result.rows[a];
    var results = {}
    for (var i = 0; i < result.metaData.length; ++i){
    results[result.metaData[i].name] = temp_data[i];
    }
     ary.push(results);   
     if(a == result.rows.length - 1){
         res.json({Status:"Success",Message:"Activity Name List", Data : ary ,Code:200});
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
// IOT CHECK LIST AGCODE
// ******************************************************************************************************************************************************************************


router.post('/get_ag_code', function (req, res) {
req.body.ag_code =  req.body.ag_code.replace('-','');
console.log(req.body.ag_code);
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
            `SELECT * FROM JLS_AGENT_VW WHERE AGCODE =:AGCODE`,
            {AGCODE: req.body.ag_code},
            {autoCommit: true},
         function(err, result) {
        if (err) { console.error(err.message);
              res.json({Status:"Failed",Message:"Internal Server Error", Data : [], Code:500});
              doRelease(connection);
              return;
         }
    doRelease(connection);
    var ary = [];
    if(result.rows.length == 0){
    res.json({Status:"Success",Message:"NOT VALID AGCODE", Data : {} ,Code:404});
    }
    else{
    for(let a = 0 ; a < result.rows.length;a++){
    var temp_data = result.rows[a];
    var results = {}
    for (var i = 0; i < result.metaData.length; ++i){
    results[result.metaData[i].name] = temp_data[i];
    }
     ary.push(results);   
     if(a == result.rows.length - 1){
          res.json({Status:"Success",Message:"VALID AGCODE", Data : {} ,Code:200});
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










// ******************************************************************************************************************************************************************************
// OPERATION CHECK GAD VIEW
// ******************************************************************************************************************************************************************************

router.post('/check_file_name', function (req, res) {
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
        `SELECT GET_GADREVNO(:job_no) REVNO FROM DUAL`,
        {job_no : req.body.job_no},
        {autoCommit: true},
     function(err, result) {
    if (err) { console.error(err.message);
          res.json({Status:"Failed",Message:"Internal Server Error", Data : [], Code:500});
          doRelease(connection);
          return;
     }
      doRelease(connection);
var ary = [];

if(result.rows.length == 0){
res.json({Status:"Success",Message:"No Record Found", Data : [], Code:200});
}

else{
for(let a = 0 ; a < result.rows.length;a++){
var temp_data = result.rows[a];
var results = {}
for (var i = 0; i < result.metaData.length; ++i){
results[result.metaData[i].name] = temp_data[i];
}

 ary.push(results);   
 if(a == result.rows.length - 1){
    

    recall(ary);
    // res.json({Status:"Success",Message:"Data Submitted Successfully", Data : ary ,Code:200});
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
function recall(rev_value){

var code = "rev"+rev_value[0].REVNO   

const testFolder = './../public/Gad_Drawing';
const fs = require('fs');
  var file_data = [];
  fs.readdir(testFolder, (err, files) => {
  files.forEach(file => {
   if(file.indexOf(req.body.job_no) >= 0){
              if(file.indexOf(code) >= 0){
                 file_data.push({file_name:file,file_path : "http://smart.johnsonliftsltd.com:3000/api/Gad_Drawing/"+file});
              }
   }
  });
  res.json({Status:"Success",Message:"SubFunction Deleted successfully", Data : file_data ,Code:200});
}); 
}
});




// ******************************************************************************************************************************************************************************
// SERVICE ERROR LOG DETAILS
// ******************************************************************************************************************************************************************************


router.get('/check_error_log', function (req, res) {
        error_log_oracelModel.find({}, function (err, Functiondetails) {
          res.json({Status:"Success",Message:"error_log", Data : Functiondetails ,Code:200});
        });
});

router.get('/check_error_log_date', function (req, res) {
var date = new Date();
date.setDate(date.getDate() - 1);
        error_log_oracelModel.find({service_type:{$ne:"Operation"}
}, function (err, Functiondetails) {
      var final_data = [];  
      for(let a  = 0 ; a < Functiondetails.length ; a++){
const dates = require('date-and-time');
const now1  =  new Date(Functiondetails[a].date_time);
const value1 = dates.format(now1,'YYYY-MM-DDTHH:mm:ss');
        final_data.push({
            "req_2": Functiondetails[a].data[0].req_2,
            "error_detail": Functiondetails[a].error_detail,
            "_id": "64082c5ad70ac149a5f49d35",
            "job_no": Functiondetails[a].job_no,
            "service_type": Functiondetails[a].service_type,
            "activity": Functiondetails[a].activity,
            "follow_detail": Functiondetails[a].follow_detail,
            "url": Functiondetails[a].url,
            "date_time": value1,
            "user_no": "",
            "__v": 0
        });
        if(a == Functiondetails.length - 1){
             res.json({Status:"Success",Message:"error_log", Data : final_data ,Code:200});
        }
      }
        });
});

router.get('/check_error_log_delete_all', function (req, res) {
      error_log_oracelModel.remove({}, function (err, Functiondetails) {
          res.json({Status:"Success",Message:"error_log", Data : Functiondetails ,Code:200});
        });
});

router.post('/check_error_log_job_no', function (req, res) {
        error_log_oracelModel.find({"job_no":req.body.job_no}, function (err, Functiondetails) {
          res.json({Status:"Success",Message:"error_log", Data : Functiondetails ,Code:200});
        });
});

router.post('/check_error_log_job_no_delete', function (req, res) {
      error_log_oracelModel.findByIdAndRemove(req.body._id, function (err, user) {
          if (err) return res.json({Status:"Failed",Message:"Internal Server Error", Data : {},Code:500});
          res.json({Status:"Success",Message:"SubFunction Deleted successfully", Data : {} ,Code:200});
      });
});



// ******************************************************************************************************************************************************************************
// TAB SUBMITTED DATA CHECK API DETAILS
// ******************************************************************************************************************************************************************************


router.get('/get_temp_submitted_data_detail',async function (req, res) {
    var submitted_data_br  =  await service_tab_submit_data_br_Model.find({"upload_status" : "N", "serv_type" : "BREAKDOWN"}).count();
    var submitted_data_pm  =  await service_tab_submit_data_br_Model.find({"upload_status" : "N", "serv_type" : "PREVENTIVE_CHANGE"}).count();
    var submitted_data_brmr  =  await service_tab_submit_data_br_Model.find({"upload_status" : "N", "serv_type" : "BREAKDOWNMR"}).count();
    var submitted_data_pmmr =  await service_tab_submit_data_br_Model.find({"upload_status" : "N", "serv_type" : "PREVENTIVE_MR"}).count();
    var submitted_data_audit  =  await service_tab_submit_data_br_Model.find({"upload_status" : "N", "serv_type" : "AUDIT"}).count();
    var submitted_data_all  =  await service_tab_submit_data_br_Model.find({}).count();
    var submitted_pm  =  await service_tab_submit_data_br_Model.find({"upload_status" : "Y"}).count();
     res.json({Status:"Success",Message:"error_log", Data : {
      submitted_data_br : submitted_data_br,
      submitted_data_pm : submitted_data_pm,
      submitted_data_brmr : submitted_data_brmr,
      submitted_data_pmmr : submitted_data_pmmr,
      submitted_data_audit : submitted_data_audit,
      submitted_data_all : submitted_data_all,
      submitted_pm : submitted_pm,
     }, Code:200});   
});


router.get('/get_temp_submitted_data_count',async function (req, res) {
        service_tab_submit_data_br_Model.find({},async function (err, Functiondetails) {
         res.json({Status:"Success",Message:"get_serivce_temp_count", Data : Functiondetails ,Code:200});
        }).count();
});


router.get('/temp_submitte_delete',async function (req, res) {
   var total_error_count  =  await service_tab_submit_data_br_Model.find({"upload_status" : "Y"}).count();
   console.log(total_error_count);
   if(total_error_count > 1200){
    var limits = total_error_count - 1200;
    service_tab_submit_data_br_Model.find({"upload_status" : "Y"},async function (err, Functiondetails) {
      console.log(")))))))))))))))))",Functiondetails.length);
          for(let a  = 0 ; a < Functiondetails.length ; a++){
          service_tab_submit_data_br_Model.findByIdAndRemove(Functiondetails[a]._id, function (err, user) {
          if (err) return res.json({Status:"Failed",Message:"Internal Server Error", Data : {},Code:500});
          // console.log(err);
          // res.json({Status:"Success",Message:"iot branch code Deleted successfully", Data : {} ,Code:200});
          });
          if(a == Functiondetails.length - 1){
          res.json({Status:"Success",Message:"DELETED", Data : {} ,Code:200});
          }
          }
        }).limit(1000).sort({ _id: 1 });
  }else {
     res.json({Status:"Success",Message:"ONLY 20000 RECORD", Data : {} ,Code:200});
  }     
});


// ******************************************************************************************************************************************************************************




router.post('/iot/get_data_by_job_fetch_count', function (req, res) {

var dates = require('date-and-time');
var now1  =  new Date();
var value1 = dates.format(now1,'DD-MMM-YYYY');
value1.toUpperCase();


  oracledb.getConnection({
      user: "jlpliot",
      password: "jlpliot",
      connectString: "(DESCRIPTION =(ADDRESS = (PROTOCOL = TCP)(HOST = 192.168.1.112)(PORT = 1521))(CONNECT_DATA =(SID = jlpl)))"
}, function(err, connection) {
if (err) {
    // console.error(err.message);
    return;
}
connection.execute(
"SELECT COUNT(*) TOTCNT FROM IOT_MONGOSCHED_DTL WHERE SLIFTID=:JOBNO AND TRUNC(SSERVDATE)=:CURDATE AND (SFDSTATUS IS NOT NULL OR SMODEEVENTS IS NOT NULL)",{
            
             JOBNO : req.body.job_id,
             CURDATE :  value1
        },
        {autoCommit: true},
        function (err, result) {
    if (err) { console.error(err.message);
          doRelease(connection);
          return;
     }
 doRelease(connection);
if(result.rows.length == 0){
     res.json({Status:"Success",Message:"No Data Found", Data : [] ,Code:200});
} else {
var ary = [];
for(let a = 0 ; a < result.rows.length ; a++){
var temp_data = result.rows[a];
var results = {}
for (var i = 0; i < result.metaData.length; ++i){
results[result.metaData[i].name] = temp_data[i];
}
 ary.push(results);   
 if(a == result.rows.length - 1){
    res.json({Status:"Success",Message:"jopazh Detail List", Data : ary,Code:200});
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




router.post('/iot/get_data_by_job', function (req, res) {



const dates = require('date-and-time');
const now1  =  new Date();
const value1 = dates.format(now1,'DD-MMM-YYYY');
value1.toUpperCase();


oracledb.getConnection({
      user: "jlpliot",
      password: "jlpliot",
      connectString: "(DESCRIPTION =(ADDRESS = (PROTOCOL = TCP)(HOST = 192.168.1.112)(PORT = 1521))(CONNECT_DATA =(SID = jlpl)))"
}, function(err, connection) {
if (err) {
    // console.error(err.message);
    return;
}
connection.execute(
`SELECT *
FROM
(
SELECT ROWNUM RNO,
SDEVICEID, SLIFTID, SSERVTIME, SPKTTIME, SDEVTIME, SSERVDATE, SPKTDATE, SDEVDATE, SFDSTATUS, SPROCINPUT,
SPROCOUTPUT, SMODEEVENTS, SOBJECTID, SOBJECTID_DEC, SFLRSTAT2, SVVVFTRIP2, SDOORZONE2, SDOOROPCL2, SDOOROPLIM2,
SDOORCLLIM2, SDIRECTION2, SRUNSTAT2, SDOORZNSEEK3, SCLOCKVANE3, SSETSW3, SLASTSW3, SNDLSW3, SNULSW3, SSCRSENSOR3,
SOSG3, SPIT3, STDL3, STUL3, SSTPERMIT3, SMCI3, SBKI3, SLGL3, SDOOROPEN4, SDOORCLOS4, SCC4, SBP4, SAUTOMODE5, SLOCREMOTE5,
SPARKMODE5, SFIREMAN5, SMAINTMODE5, SARDMODE5, SCARALARM5, SPOWERSUP5, SOVERLOAD5, SFULLLOAD5, SFAULTEVENT5, SNEXTLAND5, SSAFELAND5, SEXTINPUT5,
SFDESSTATVAL, SFLRPOSSTATVAL, SDIROFTRAVEL, SDOORSTAT, SCARCALL0TO15, SCARCALL16TO31, SCARCALL32TO47, SCARCALL48TO63, SDOWNLOADTIME
FROM IOT_MONGOSCHED_DTL
WHERE SLIFTID=:JOBNO
AND TRUNC(SSERVDATE)=:CURDATE
AND (SFDSTATUS IS NOT NULL OR SMODEEVENTS IS NOT NULL)
ORDER BY 1
)
WHERE RNO BETWEEN :FROMREC AND :TOREC`,
        {
        FROMREC : req.body.FROMREC,
        TOREC : req.body.TOREC,
         CURDATE :  value1,
        JOBNO : req.body.job_id
        },
        {autoCommit: true},
        function (err, result) {
    if (err) { console.error(err.message);
          doRelease(connection);
          return;
     }
 doRelease(connection);
if(result.rows.length == 0){
     var ary = [];
     second_value(ary,req)
     // res.json({Status:"Success",Message:"No Data Found", Data : [] ,Code:200});
} else {
var ary = [];
for(let a = 0 ; a < result.rows.length ; a++){
var temp_data = result.rows[a];
var results = {}
for (var i = 0; i < result.metaData.length; ++i){
results[result.metaData[i].name] = temp_data[i];
}
 ary.push(results);   
 if(a == result.rows.length - 1){
    second_value(ary,req)
    // res.json({Status:"Success",Message:"jopazh Detail List", Data : ary,Code:200});
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







async function second_value(ary,req){
    oracledb.getConnection({
      user: "jlpliot",
      password: "jlpliot",
      connectString: "(DESCRIPTION =(ADDRESS = (PROTOCOL = TCP)(HOST = 192.168.1.112)(PORT = 1521))(CONNECT_DATA =(SID = jlpl)))"
}, function(err, connection) {
if (err) {
    // console.error(err.message);
    return;
}
connection.execute(
"select * from IOT_DASHBOARD_VW where DBD_JOBNO =:JOBNO and DBD_STAT = 'DWN2'",{
             JOBNO : req.body.job_id
        },
        {autoCommit: true},
        function (err, result) {
    if (err) { console.error(err.message);
          doRelease(connection);
          return;
     }
 doRelease(connection);
var breakdown_color = 'Green';
if(result.rows.length == 0){
     var ary_one = [];
     breakdown_color = 'Green';
     third_value(ary,req,ary_one,breakdown_color);
     // res.json({Status:"Success",Message:"No Data Found", Data : [] ,Code:200});
} else {
var ary_one = [];
for(let a = 0 ; a < result.rows.length ; a++){
var temp_data = result.rows[a];
var results = {}
for (var i = 0; i < result.metaData.length; ++i){
results[result.metaData[i].name] = temp_data[i];
}
 ary_one.push(results);   
 if(a == result.rows.length - 1){
 if(ary_one[0].DBD_CLEAREDDATE == null){
    breakdown_color = 'Red';
 } else {
    breakdown_color = 'Green';
 }
third_value(ary,req,ary_one,breakdown_color);
    // res.json({Status:"Success",Message:"jopazh Detail List", Data : ary, Breakdown : ary_one , Code:200});

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
}


async function third_value(ary,req,ary_one,breakdown_color){
 
 console.log("BreakDown Color **************** ",breakdown_color);

    oracledb.getConnection({
      user: "jlpliot",
      password: "jlpliot",
      connectString: "(DESCRIPTION =(ADDRESS = (PROTOCOL = TCP)(HOST = 192.168.1.112)(PORT = 1521))(CONNECT_DATA =(SID = jlpl)))"
}, function(err, connection) {
if (err) {
    // console.error(err.message);
    return;
}
connection.execute(
"select * from IOT_DASHBOARD_VW where DBD_JOBNO =:JOBNO and DBD_STAT = 'ENT'",{
             JOBNO : req.body.job_id
        },
        {autoCommit: true},
        function (err, result) {
    if (err) { console.error(err.message);
          doRelease(connection);
          return;
     }
 doRelease(connection);
var Entrapment_color = 'Green'; 
if(result.rows.length == 0){

     console.log("Data Enter &&&&&&&&&&&&&&&&&&",breakdown_color,Entrapment_color);
    res.json({Status:"Success",Message:"Lift Status Detail List", Data : ary, Breakdown : { "value":0, "color":breakdown_color }, Entrapment : { "value":0, "color":Entrapment_color }, Code:200});
     // res.json({Status:"Success",Message:"No Data Found", Data : [] ,Code:200});
} else {
var ary_two = [];
for(let a = 0 ; a < result.rows.length ; a++){
var temp_data = result.rows[a];
var results = {}
for (var i = 0; i < result.metaData.length; ++i){
results[result.metaData[i].name] = temp_data[i];
}
 ary_two.push(results);   
 if(a == result.rows.length - 1){

 console.log("Ary Two *************** ",ary_two[0]);
 if(ary_two[0].DBD_CLEAREDDATE == null){
    Entrapment_color = 'Red';
 } else {
    Entrapment_color = 'Green';
 }
console.log("Data Enter &&&&&&&&&&&&&&&&&&",breakdown_color,Entrapment_color);
res.json({Status:"Success",Message:"Lift Status Detail List", Data : ary, Breakdown : { "value":0, "color":breakdown_color }, Entrapment : { "value":0, "color":Entrapment_color }, Code:200});

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


}


});










module.exports = router;
