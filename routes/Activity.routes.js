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

router.post('/create', async function(req, res) {
  try{

        await ActivityModel.create({
            user_type:  req.body.user_type,
            user_name : req.body.user_name,
            user_mobile : req.body.user_mobile,
            user_id : req.body.user_id,
            title : req.body.title,
            describ : req.body.describ,
            date_and_time: req.body.date_and_time,
        }, 
        function (err, user) {
        res.json({Status:"Success",Message:"Added successfully", Data : user ,Code:200}); 
        });
}
catch(e){
      res.json({Status:"Failed",Message:"Internal Server Error", Data : {},Code:500});
}
});


router.get('/deletes', function (req, res) {
      ActivityModel.remove({}, function (err, user) {
          if (err) return res.status(500).send("There was a problem deleting the user.");
             res.json({Status:"Success",Message:"ActivityModel Deleted", Data : {} ,Code:200});     
      });
});


router.post('/leave_request_test', function (req, res) {    
 res.json({Status:"Success",Message:"Request Send Successfully", Data : {},Code:200});
});




router.post('/delete_lift_well_data',async function (req, res) {
var data_store_managementModel = require('./../models/data_store_managementModel');
var job_details_two  =  await data_store_managementModel.findOne({job_id:req.body.job_id, group_id:'629ede01886f5404a75d4a84'});
console.log(job_details_two);
step0();
async function step0() {
data_store_managementModel.findByIdAndRemove(job_details_two._id, function (err, user) {
          if (err) return res.json({Status:"Failed",Message:"Internal Server Error", Data : {},Code:500});
          // res.json({Status:"Success",Message:"SubFunction Deleted successfully", Data : {} ,Code:200});
          step1();
      });
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
      console.log("STEP 1");   
      console.log("****************",result);
         
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
      console.log("STEP 2");   
      console.log("****************",result);
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
      console.log("STEP 3");   
      console.log("****************",result);
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



router.post('/leave_request', function (req, res) { 
var month_list = ["","Jan","Feb","Mar","Apr","May","Jun","Jul",'Aug',"Sep","Oct","Nov","Dec"];   
var temp_from = req.body.PA_LAH_FRMDT.split("/");
var temp_to = req.body.PA_LAH_TODT.split("/");
var from_date = temp_from[0]+"-"+month_list[temp_from[1]]+"-"+temp_from[2];
var to_date = temp_to[0]+"-"+month_list[+temp_to[1]]+"-"+temp_to[2];
const today = new Date();
const yyyy = today.getFullYear();
let mm = today.getMonth() + 1; // Months start at 0!
let dd = today.getDate();
if (dd < 10) dd = '0' + dd;
if (mm < 10) mm = '0' + mm;
const todays = dd + '-' + month_list[+mm] + '-' + yyyy;
var count_value = 0;
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
            "SELECT LVAPPL_SEQ.NEXTVAL FROM DUAL",
              {},
              { autoCommit: true}, 
        function (err, result1) {
    if (err) { 
          console.error(err.message);
          doRelease(connection);
          return;
     }
     count_value = result1.rows[0][0];
     callone();
     // doRelease(connection);
   });
   function callone(){
   // var string = temp_count[a]._id.split(",");
    let da = {
        "PA_LAH_LVAPNO": count_value,
        "PA_LAH_LVAPDT": ""+todays,
        "PA_LAH_EMPNO": ""+req.body.PA_LAH_EMPNO,
        "PA_LAH_LVCODE": ""+req.body.PA_LAH_LVCODE,
        "PA_LAH_NOFDYS": +req.body.PA_LAH_NOFDYS,
        "PA_LAH_FRMDT":  ""+from_date,
        "PA_LAH_FRMSES": "FN",
        "PA_LAH_TODT":  ""+to_date,
        "PA_LAH_TOSES": "AN",
        "PA_LAH_REASON": ""+req.body.PA_LAH_REASON,
        "PA_LAH_STATUS": ""+req.body.PA_LAH_STATUS,
        "PA_LAH_APPMGR": "",
        "PA_LAH_LVSANCDT": "",
        "PA_LAH_LVSANCBY": "",
        "PA_LAH_SOURCE": "JLSMART",
        "PA_LAH_ENTRYBY": "MOBUSER",
        "PA_LAH_ENTRYDT":  ""+todays,
        "PA_LAH_MODBY": "",
        "PA_LAH_MODDT":  "",
        "PA_LAH_MENUSNO": +"6388"
    }
      connection.execute(
            "insert into  JLSMART_LIFTWELL_DATA(JOBNO, CLEAR_WIDTH, CLEAR_DEPTH, BEAM_PROJECTION, THROUGH_CAR,FLOOR_BEAM_HEIGHT, CLEAR_OPENING_HEIGHT, LEFT_WALL_THICKNESS,RIGHT_WALL_THICKNESS, BACK_WALL_THICKNESS, FRONT_WALL_THICKNESS,LEFT_WALL_TYPE, RIGHT_WALL_TYPE, BACK_WALL_TYPE, FRONT_WALL_TYPE,TERRACE_NAME, GROUND_FLOOR_NAME,TOTAL_TRAVEL, PIT_HEIGHT,HEAD_ROOM_HEIGHT, MACHINE_ROOM_HEIGHT, DUPLEX_BOX_COVER, DUPLEX_JOB,NO_OF_BASEMENT_FLOORS , PIT_WALLTYPE) values ('L-Q1234',9999,9999,'Y','Y',9999,9999,9999,9999,9999,9999,'BRICK','SOLID','RCC','BRICK','TERRACE NAME1234567','GFLOOR NAMES1234567',9999,9999,9999,9999,'Y','L-Q1235',1,'BRICK')",
        function (err, result) {
    if (err) { console.error(err.message);
          doRelease(connection);
          return;
     }

     res.json({Status:"Success",Message:"Request Send Successfully", Data : {},Code:200});
     doRelease(connection);
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
});



router.post('/getlist_attendance', function (req, res) {
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
            "SELECT * FROM JLS_SITEAUDIT_HDR WHERE OM_OSA_MOBILE = '7347017614' AND OM_OSA_STATUS = 'N'",
            {},
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
  res.json({Status:"Success",Message:"check list value", Data : ary ,Code:200});
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







router.post('/submitt_sub_attendance', function (req, res) {

    var month_list = ["","Jan","Feb","Mar","Apr","May","Jun","Jul",'Aug',"Sep","Oct","Nov","Dec"];
    const today = new Date();
    const yyyy = today.getFullYear();
    let mm = today.getMonth() + 1; // Months start at 0!
    let dd = today.getDate();
    if (dd < 10) dd = '0' + dd;
    if (mm < 10) mm = '0' + mm;
    const todays = dd + '-' + month_list[+mm] + '-' + yyyy;
    var mobile_no = req.body.user_phone;
    var temp_data = req.body.Data;

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
            "JL_RA_ATTDATE": ""+todays,
            "JL_RA_EMPNO": temp_data[a].EMPNO,
            "JL_RA_MORNSES": temp_data[a].FN || "",
            "JL_RA_EVESES": temp_data[a].AN || "",
            "JL_RA_NONWORKHRS": +temp_data[a].PER_IN_HR || 0,
            "JL_RA_NONWORKTYPE": temp_data[a].PER_OFF  || "",
            "JL_RA_NONWORKREASON": temp_data[a].REASON  || "",
            "JL_RA_ENTRYBY": ""+mobile_no,
            "JL_RA_ENTRYDT": ""+todays,
            "JL_RA_SOURCE": "JLSMART"
        }

      connection.execute(
            "INSERT INTO JLSMART_REPORTEE_ATT VALUES (:JL_RA_ATTDATE, :JL_RA_EMPNO, :JL_RA_MORNSES, :JL_RA_EVESES, :JL_RA_NONWORKHRS, :JL_RA_NONWORKTYPE, :JL_RA_NONWORKREASON, :JL_RA_ENTRYBY, :JL_RA_ENTRYDT, :JL_RA_SOURCE )",
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

        if(a == temp_data.length - 1){
            res.json({Status:"Success",Message:"Submitted Successfully", Data : {} ,Code:200});  
        }
    } 
});



router.post('/fetch_attendance_list', function (req, res) {
       oracledb.getConnection({
      user: "JLSMART",
      password: "JLSMART",
      connectString: "(DESCRIPTION =(ADDRESS = (PROTOCOL = TCP)(HOST = 192.168.1.112)(PORT = 1521))(CONNECT_DATA =(SID = jlpl)))"
}, function(err, connection) {
if (err) {
    return;
}
connection.execute(
            "select DBSOM_GET_EMPFROMMOB(:fn) from dual",
            {fn: req.body.phone_number},
        {autoCommit: true},
        function (err, result) {
    if (err) { console.error(err.message);
          doRelease(connection);
          return;
     }
recallone(result.rows[0][0]);
});
function recallone(repmgr){
connection.execute(
            "select EMPNO , ENAME from EMPLOYEE_VW where REPMGR=:fn AND DOR IS NULL",
            {fn: repmgr},
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
          ary.forEach(element => {
          element.EMPNO = element.EMPNO;
          element.ENAME = element.ENAME;
          element.DATE = "";
          element.FN = "";
          element.AN = "";
          element.PER_IN_HR = "";
          element.PER_OFF = "";
          element.REASON = "";
          });
    res.json({Status:"Success",Message:"Updated", Data : ary,Code:200}); 
    doRelease(connection);    
 }
} 
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
});




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
        function (err, result) {
    if (err) { console.error(err.message);
          doRelease(connection);
          return;
     }
     console.log('8888888888888888888',result);
     res.json({Status:"Success",Message:"Updated", Data : {} ,Code:200});     
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



router.post('/insert_floorheight_detail', function (req, res) {
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
var REMARKS = "";
var ENT_WALL_OPEN = 0;
var BELOW_LINTAL_HT = 0;
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
          }else if(temp_data[a].field_comments == 'site details upload '){
               SITE_UPLOAD = temp_data[a].field_value;
          }else if(temp_data[a].field_comments == 'Remarks'){
               REMARKS = temp_data[a].field_value;
          }
          else if(temp_data[a].field_comments == 'ENT_WALL_OPEN'){
               ENT_WALL_OPEN = temp_data[a].field_value;
          }
          else if(temp_data[a].field_comments == 'BELOW_LINTAL_HT'){
               BELOW_LINTAL_HT = temp_data[a].field_value;
          }
      }
    }

    var final_temp_data2 = [];
    final_temp_data.forEach(element => {
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
            // "INSERT INTO JLSMART_FLOORHEIGHT_DATA VALUES (:JOBNO, :FLOOR_NUMBER, :FLOOR_HEIGHT)",
                 "INSERT INTO JLSMART_FLOORHEIGHT_DATA VALUES (:JOBNO, :FLOOR_NUMBER, :FLOOR_HEIGHT, :SUBMITDATE)",
              da, // Bind values
              { autoCommit: true}, 
        function (err, result) {
    if (err) { console.error(err.message);
          doRelease(connection);
          return;
     }
          console.log("Stage 2");

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
        if(a == temp_data.length - 1){


// ********************************************************************

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
}
var obj = das;
var keys = Object.keys(obj);
var final_req = [];
for (var i = 0; i < keys.length; i++) {
  final_req.push(obj[keys[i]]);
}
    // console.log(das);
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
               ENT_WALL_OPEN
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
               :ENT_WALL_OPEN
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
               },
        {autoCommit: true},
        function (err, result) {
    if (err) { 
      console.log(err);
      console.error("error",err.message);
          doRelease(connection);
          return;
     }
     console.log("Stage 3");
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
// **********************************************************************
            // res.json({Status:"Success",Message:"Submitted Successfully", Data : {} ,Code:200});  
        }
    } 



res.json({Status:"Success",Message:"Request Send Successfully", Data : {},Code:200});
});





router.post('/attendance_list', function (req, res) {
      ActivityModel.remove({}, function (err, user) {
          if (err) return res.status(500).send("There was a problem deleting the user.");
             res.json({Status:"Success",Message:"ActivityModel Deleted", Data : {} ,Code:200});     
      });
});


router.post('/attendance_mark', function (req, res) {
      ActivityModel.remove({}, function (err, user) {
          if (err) return res.status(500).send("There was a problem deleting the user.");
             res.json({Status:"Success",Message:"ActivityModel Deleted", Data : {} ,Code:200});     
      });
});


router.post('/getlist_id_test', function (req, res) {
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
            "SELECT *  FROM ESPD_OP_HDR WHERE SMU_TECHMOBNO=:fn and SMU_UKEY=:uk and SMU_JOBNO=:jn",
            {fn: '7338865080',uk:'ESPD-ACT1',jn:'L-Q4715'},
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
 // console.log(results);
 ary.push(results);   
 if(a == result.rows.length - 1){
    res.json({Status:"Success",Message:"Updated", Data : ary[0],Code:200}); 
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



router.get('/getlist', function (req, res) {
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
      `SELECT UKEY,UKEY_DESC,CELL_NUMBER, NVL(NEW_ACTIVITY,0) NEW_ACTIVITY, NVL(WIP_ACTIVITY,0) WIP_ACTIVITY FROM (SELECT 
ESPD_OP_HDR.SMU_UKEY UKEY, SMU_UKEY_DESCRIPTION UKEY_DESC,SMU_TECHMOBNO CELL_NUMBER 
FROM ESPD_OP_HDR,TEMPLATE_MASTER
WHERE ESPD_OP_HDR.SMU_UKEY = TEMPLATE_MASTER.SMU_UKEY
AND SMU_TECHMOBNO =:fn
and nvl(SMU_ACTIVITY_STATUS,'ALL') <> 'SUBMITTED'
GROUP BY  SMU_TECHMOBNO, ESPD_OP_HDR.SMU_UKEY,SMU_UKEY_DESCRIPTION
),
(
SELECT 
ESPD_OP_HDR.SMU_UKEY UKEY1, SMU_UKEY_DESCRIPTION,SMU_TECHMOBNO, ESPD_OP_HDR.SMU_DWNFLAG , COUNT(*) NEW_ACTIVITY
FROM ESPD_OP_HDR,TEMPLATE_MASTER
WHERE ESPD_OP_HDR.SMU_UKEY = TEMPLATE_MASTER.SMU_UKEY
AND ESPD_OP_HDR.SMU_DWNFLAG ='N'
AND SMU_TECHMOBNO =:fn
GROUP BY  SMU_TECHMOBNO, ESPD_OP_HDR.SMU_UKEY,SMU_UKEY_DESCRIPTION,ESPD_OP_HDR.SMU_DWNFLAG
),
(
SELECT 
ESPD_OP_HDR.SMU_UKEY UKEY2, SMU_UKEY_DESCRIPTION, SMU_TECHMOBNO,ESPD_OP_HDR.SMU_DWNFLAG,COUNT(*) WIP_ACTIVITY
FROM ESPD_OP_HDR,TEMPLATE_MASTER
WHERE 
ESPD_OP_HDR.SMU_UKEY = TEMPLATE_MASTER.SMU_UKEY
AND ESPD_OP_HDR.SMU_DWNFLAG ='Y'
AND SMU_ACTIVITY_STATUS <> 'SUBMITTED'
AND SMU_TECHMOBNO =:fn
GROUP BY  SMU_TECHMOBNO, ESPD_OP_HDR.SMU_UKEY,SMU_UKEY_DESCRIPTION,ESPD_OP_HDR.SMU_DWNFLAG
)
WHERE UKEY = UKEY1(+)
AND UKEY = UKEY2(+)`,
        {fn: "9043456963"},
        {autoCommit: true},
     function(err, result) {
    if (err) { console.error(err.message);
          doRelease(connection);
          return;
     }
     // console.log(result.rows);
     // console.log(result.metaData);
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
 // console.log(results);
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
and nvl(SMU_ACTIVITY_STATUS,'ALL') <> 'SUBMITTED'
GROUP BY  SMU_TECHMOBNO, ESPD_OP_HDR.SMU_UKEY,SMU_UKEY_DESCRIPTION
),
(
SELECT
ESPD_OP_HDR.SMU_UKEY UKEY1, SMU_UKEY_DESCRIPTION,SMU_TECHMOBNO , COUNT(*) NEW_ACTIVITY
FROM ESPD_OP_HDR,TEMPLATE_MASTER
WHERE ESPD_OP_HDR.SMU_UKEY = TEMPLATE_MASTER.SMU_UKEY
AND SMU_ACTIVITY_STATUS <> 'SUBMITTED'
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
 // console.log(results);
 ary.push(results);   
 if(a == result.rows.length - 1){
    let temp_data = [];
     for(let c = 0; c < group_details.length ; c++){
       for(let d = 0 ; d < ary.length ; d++){
        if(ary[d].UKEY == group_details[c].SMU_UKEY){

            // console.log(group_details[c]);
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
        // console.log(temp_data);
       temp_data = temp_data.sort((a, b) => a.seqno > b.seqno ? 1 : -1);

        res.json({Status:"Success",Message:"Respose Data", Data : temp_data ,Code:200});
       }
     }
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
       // console.log(result.rows);
       // console.log(result.metaData);
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
   // console.log(results);
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
       // console.log(result.rows);
       // console.log(result.metaData);
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
   // console.log(results);
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
         // console.log(result.rows);
         // console.log(result.metaData);
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
     // console.log(results);
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
         // console.log(result.rows);
         // console.log(result.metaData);
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
     // console.log(results);
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
         // console.log(result.rows);
         // console.log(result.metaData);
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
     // console.log(results);
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
           // console.log(result.rows);
           // console.log(result.metaData);
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
       // console.log(results);
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
             // console.log(result.rows);
             // console.log(result.metaData);
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
         // console.log(results);
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
     // console.log(result.rows);
     // console.log(result.metaData);
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
 // console.log(results);
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
     // console.log(result.rows);
     // console.log(result.metaData);
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
 // console.log(results);
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



router.post('/update_join_inspect_hdr',async function (req, res) {
    console.log(req.body);
var joininspectionModel = require('./../models/joininspectionModel');
var user_detail = await joininspectionModel.findOne({job_id : req.body.job_no});
console.log(user_detail);
if(user_detail == null){
  res.json({Status:"Failed",Message:"Please fill the forms",Data : {} ,Code:404});
} else
{
var string = req.body.Name.split(",");
console.log(string);
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
        function (err, result) {
    if (err) { console.error(err.message);
          doRelease(connection);
          return;
     }
     console.log(result);

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
        function (err, results) {
    if (err) { console.error(err.message);
          doRelease(connection);
          return;
     }
     console.log(results.rows);   
     if(results.rows.length == 0){
    


//         oracledb.getConnection({
//       user: "JLSMART",
//       password: "JLSMART",
//       connectString: "(DESCRIPTION =(ADDRESS = (PROTOCOL = TCP)(HOST = 192.168.1.112)(PORT = 1521))(CONNECT_DATA =(SID = jlpl)))"
// }, function(err, connection) {
// if (err) {
//     // console.error(err.message);
//     return;
// }
//             console.log({ 
//                SMU_ACTIVITYNO: 85,
//                SMU_UKEY: 'OP-ACT8S',
//                SMU_JOBNO : SMU_JOBNO,
//                SMU_ECODE : SMU_SERVJI_EMPNO,
//                SMU_TECHNAME : SMU_SERVJI_EMPNAME,
//                SMU_TECHMOBNO : SMU_SERVJI_MOBNO,
//                SMU_DWNFLAG : 'N',
//                SMU_ACTIVITY_STATUS : 'START',
//                SMU_SEQNO : 17000,
//                ST_MDH_SEQNO : 1
//            });
//      connection.execute(
//              `INSERT INTO ESPD_OP_HDR (SMU_SEQNO, SMU_ACTIVITYNO, SMU_UKEY, SMU_JOBNO, SMU_ECODE, SMU_TECHNAME, SMU_TECHMOBNO, SMU_DWNFLAG, SMU_ACTIVITY_STATUS, ST_MDH_SEQNO) VALUES (:SMU_SEQNO, :SMU_ACTIVITYNO, :SMU_UKEY, :SMU_JOBNO, :SMU_ECODE, :SMU_TECHNAME, :SMU_TECHMOBNO, :SMU_DWNFLAG, :SMU_ACTIVITY_STATUS, :ST_MDH_SEQNO)`,
//                 { 
//                SMU_SEQNO : 17112,
//                SMU_ACTIVITYNO: 85,
//                SMU_UKEY: 'OP-ACT8S',
//                SMU_JOBNO : SMU_JOBNO,
//                SMU_ECODE : SMU_SERVJI_EMPNO,
//                SMU_TECHNAME : SMU_SERVJI_EMPNAME,
//                SMU_TECHMOBNO : SMU_SERVJI_MOBNO,
//                SMU_DWNFLAG : 'N',
//                SMU_ACTIVITY_STATUS : 'START',
//                ST_MDH_SEQNO : 1
//            },
//         {autoCommit: true},
//         function (err, result1) {
//     if (err) { console.error(err.message);
//           doRelease(connection);
//           return;
//      }
//     // console.log(result1);
//          res.json({Status:"Success",Message:"Updated Success",Data : {} ,Code:200});
//      doRelease(connection);
//    });
// });

        res.json({Status:"Success",Message:"Updated Success",Data : {} ,Code:200});
     }else{
        res.json({Status:"Success",Message:"Updated Success",Data : {} ,Code:200});
     }
     doRelease(connection);
   });
});
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


}



});



router.post('/join_inspec_check_status',async function (req, res) {
var Job_no  = '';
var user_number = '';
var ukey = '';
res.json({Status:"Success",Message:"Submitted",Data : {} ,Code:200});
});



router.post('/test_preciption',async function (req, res) {
 console.log("Request Data ******************** 99999999",req.body);

  // console.log("Request Data ********************",req.body.user_id);
  var user_details = await user_management.findOne({_id:req.body.user_id});
// console.log(user_details);

 var branch_name = '';
 var customer_name = '';
 var customer_address = '';
 var customer_email_address = '';
 var cc_list = "";
    // console.log(req.body);
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
    // console.log(result1.rows);
    let temp_data = result1.rows;
      temp_data.forEach(element => {
      // console.log(element[0]);
      cc_list = cc_list + element[0] +","
      });
     // doRelease(connection);
   });


      connection.execute(
            "SELECT DBSOM_GET_JOBADDRESS(:ln,'OI') INSADR, DBSOM_GET_JLSMARTADDR(:ln,'C') CUSADD, DBSOM_GET_JOBADDRESS(:ln,'OB') BRANCNAME, DBSOM_GET_JLSMARTADDR(:ln,'C') BRADD FROM DUAL",
            {ln:req.body.job_id},
        {autoCommit: true},
        function (err, result) {
    if (err) { console.error(err.message);
          doRelease(connection);
          return;
     }
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
     calltwo();
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

async function calltwo() {
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
      callone()
     }
   }
   // console.log(final_data);
    async function callone(){
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
// console.log("Prescription",pdfpath);

var mystr = (""+pdfpath).slice(62);
// console.log(mystr);
// console.log("/public/prescriptions"+mystr);
mystr = "/public/prescriptions"+mystr;
var path = require('path');       
var fs = require('fs');
// console.log(__dirname+mystr);
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
        function (err, result1) {
    if (err) { console.error(err.message);
          doRelease(connection);
          return;
     }
    // console.log(result1);
    res.json({Status:"Success",Message:"Mail Send", Data : {} ,Code:200});
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







// var nodemailer = require('nodemailer');
// var transporter = nodemailer.createTransport({
//   service: 'Gmail',
//   type: "SMTP",
//   host: "smtp.gmail.com",
//   secure: true,
//   auth: {
//     user: 'mohammedimthi2395@gmail.com',
//     pass: 'Mohammed2395@'
//   }
// });
// var mailOptions = {
//   from: 'mohammedimthi2395@gmail.com',
//   to: customer_email_address,
//   // cc: cc_list,
//   subject: 'testing purpose - pending work at your Site Job no - '+req.body.job_id+' - '+customer_name,
//   // text: 'Dear Sir/ Madam',
//   html : "<b>Dear Sir / Madam </b> <p> Attachment of pending work from your end, based on our Engineer site visit , pls complete the work and inform us at the earliest</p> <br><br> ",
//   attachments: [{
//     filename: 'Liftpendingwork.pdf',
//     path: pdfpath,
//     contentType: 'application/pdf'
//   }]
// };

// transporter.sendMail(mailOptions, function(error, info){
//   if (error) {
//     console.log(error);
//   } else {
//     console.log('Email sent');
//     console.log("FFFFFFFFFFFFFFFFFFFFFFFFF");
//     // res.json({Status:"Success",Message:"Mail Send", Data : {} ,Code:200});
//   }
// });


    }
}
});


// router.get('/getlatest_version', function (req, res) {

//    var start_date = req.body.start_date;
//    var start_sesion = req.body.start_sesion;
//    var end_date = "";
//    var end_session = "";
//    var no_of_days = req.body.no_of_days;



//    if(no_of_days == 0.5){
//     start_date = req.body.start_date;
//     start_sesion = req.body.start_sesion;
//     end_date = req.body.start_date;
//     end_session = req.body.start_sesion;
//     no_of_days = req.body.no_of_days;
//    }
  




//   res.json({Status:"Success",Message:"Version", Data : {
//     start_date : start_date,
//     start_sesion : start_sesion,
//     end_date :"",
//     end_session : "",
//     no_of_days: no_of_days
//   },Code:200});
// });


router.post('/upload_photo_act_four',async function (req, res) { 
console.log(req.body);
 
var photo1 = "";
var photo2 = "";
var photo3 = "";
req.body.Data.forEach(element => {
  console.log(element);
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
console.log(__dirname);
var source = fs.readFileSync('/home/smart/johnson_application/public/uploads/'+filepath);
return source;
}
console.log(blog1);
console.log(blog2);
console.log(blog3);
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
 console.log(temp);
  connection.execute(
            "INSERT INTO JLSMART_MATMCR_PHOTO VALUES (:JLS_JMP_JOBNO, :JLS_JMP_PHOTO1, :JLS_JMP_PHOTO2, :JLS_JMP_PHOTO3)",
            temp, // Bind values
        {autoCommit: true},
        function (err, result) {
    if (err) { console.error(err.message);
          // doRelease(connection);
          return;
     }
     console.log(result);
     res.json({Status:"Success",Message:"Successfully Submitted", Data : {} ,Code:200});
    });
  });
});






router.post('/plumchar_entry',async function (req, res) {
      // console.log(req.body);
      var datas = req.body.Data;
      var user_details = await user_management.findOne({_id:req.body.user_id});
      // console.log(user_details);
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
// console.log(todayDate);
const myArray1 = todayDate.split("-");
// console.log(myArray1);


const myArray = req.body.date_of_update.split(" - ");
var month_list = ["", "Jan", "Feb", "Mar", "Apr", "May", "Jun" ,"Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
 var da = {
    JL_PCH_JOBNO : req.body.job_id,
    JL_PCH_BKTTYP : myArray[1],
    JL_PCH_MOBNO : +req.body.date_of_create,
    JL_PCH_PREPBY : +user_details.user_id,
    JL_PCH_PREPDT : ""+myArray1[2]+"-"+month_list[+myArray1[1]]+"-"+myArray1[0]
 }
 // console.log(da);
 connection.execute(
           "INSERT INTO PLMCHRT_HDR VALUES (:JL_PCH_JOBNO, :JL_PCH_BKTTYP, :JL_PCH_MOBNO, :JL_PCH_PREPBY, :JL_PCH_PREPDT)",
            da, // Bind values
        {autoCommit: true},
        function (err, result) {
    if (err) { console.error(err.message);
          // doRelease(connection);
          return;
     }
     // console.log(result);
    });

   // ***********************************************

var count = 0;
datas.forEach(element => {
// console.log(element);
count = count + 1;
let temp =  {
JL_PCD_JOBNO : req.body.job_id,
JL_PCD_SLNO : +count,
JL_PCD_DIMX1 : +element.dimx_one,
JL_PCD_DIMX2  : +element.dimx_two,
JL_PCD_DIMX3  : +element.dimx_three,
JL_PCD_DIMX4 : +element.dimx_four,
JL_PCD_DIMY1  : +element.dimy_one,
JL_PCD_DIMY2  : +element.dimy_two,
JL_PCD_REMARKS : ""+element.remarks,
JL_PCH_BKTTYP : myArray[1],
}
  connection.execute(
            "INSERT INTO PLMCHRT_DTL VALUES (:JL_PCD_JOBNO, :JL_PCD_SLNO, :JL_PCD_DIMX1, :JL_PCD_DIMX2, :JL_PCD_DIMX3, :JL_PCD_DIMX4, :JL_PCD_DIMY1, :JL_PCD_DIMY2, :JL_PCD_REMARKS, :JL_PCH_BKTTYP)",
            temp, // Bind values
        {autoCommit: true},
        function (err, result) {
    if (err) { console.error(err.message);
          // doRelease(connection);
          return;
     }
     // console.log(result);
    });
});

res.json({Status:"Success",Message:"Successfully Submitted", Data : {} ,Code:200});

});
});









router.post('/get_joins_user_list',async function (req, res) {
    console.log('*********',req.body);
    console.log(req.body.user_location);
    if(req.body.user_location == undefined){
       req.body.user_location = "'TN01','KA01','TG01'"
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
   

console.log("SELECT OM_JIM_EMPNO EMPNO, OM_JIM_EMPNAME EMPNAME, OM_JIM_MOBNO MOBILE FROM OM_JOINTINSP_MST WHERE OM_JIM_BRCODE in ("+req.body.user_location+")");

//       `SELECT OM_JIM_EMPNO EMPNO, OM_JIM_EMPNAME EMPNAME, OM_JIM_MOBNO MOBILE
// FROM OM_JOINTINSP_MST
// WHERE OM_JIM_BRCODE in ('TN01','KA01','TG01')`,

      connection.execute(
      "SELECT OM_JIM_EMPNO EMPNO, OM_JIM_EMPNAME EMPNAME, OM_JIM_MOBNO MOBILE FROM OM_JOINTINSP_MST WHERE OM_JIM_BRCODE in ("+req.body.user_location+")",
        {},
        {autoCommit: true},
     function(err, result) {
    if (err) { console.error(err.message);
          doRelease(connection);
          return;
     }
     // console.log(result.rows);
     // console.log(result.metaData);
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
 // console.log(results);
 ary.push(results);   
 if(a == result.rows.length - 1){

    // console.log(ary);
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





router.get('/getlatest_version', function (req, res) {
        res.json({Status:"Success",Message:"Version", Data : {
            // version : "23.04.2022.1",
            // apk_link : "http://smart.johnsonliftsltd.com:3000/api/uploads/johnson_mob_23_04_2022_1.apk"
            // version : "23.05.2022",
            // apk_link : "http://smart.johnsonliftsltd.com:3000/api/uploads/jo.apk"

            


            // //new Version////
            // version : "22.08.2022",
            // apk_link : "http://smart.johnsonliftsltd.com:3000/api/uploads/jo230822.apk"

                 // version : "23.08.2022",
                 // apk_link : "http://smart.johnsonliftsltd.com:3000/api/uploads/23082201.apk"


                 // version : "02.09.2022",
                 // apk_link : "http://smart.johnsonliftsltd.com:3000/api/uploads/020922.apk"



                    
                 // version : "26.09.2022",
                 // apk_link : "http://smart.johnsonliftsltd.com:3000/api/uploads/260922.apk"


version : "21.10.2022",
apk_link : "http://smart.johnsonliftsltd.com:3000/api/uploads/211022.apk"






            // version : "18.08.2022",
            // apk_link : "http://smart.johnsonliftsltd.com:3000/api/uploads/jo18082022.apk"





            ////Second Version////
            // version : "27.06.2022",
            // apk_link : "http://smart.johnsonliftsltd.com:3000/api/uploads/jo27062022.apk"


            // version : "20.06.2022",
            // apk_link : "http://smart.johnsonliftsltd.com:3000/api/uploads/jo200622.apk"


            // jo200622.apk

        } ,Code:200});
});



router.get('/tab_getlatest_version', function (req, res) {
        res.json({Status:"Success",Message:"Version", Data : {
            version : "25.08.2022.1",
            apk_link : "http://smart.johnsonliftsltd.com:3000/api/uploads/johnson_tab_16_5_22.apk"
        } ,Code:200});
});



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



router.post('/image_post', function (req, res) {
var path = require('path');       
var fs = require('fs');
// console.log(__dirname+"/views/dd.pdf");
var source = fs.readFileSync(__dirname+"/views/dd.pdf");
// console.log(source);
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
                { JL_TECHMOBILE: 9988776654,
                JL_JOBNO: "L_Q1234",
               JL_BLDRPDF : source,
               JL_CUSTEMAIL : "mohammedimthi2395@gmail.com"},
        {autoCommit: true},
        function (err, result1) {
    if (err) { console.error(err.message);
          doRelease(connection);
          return;
     }
    // console.log(result1);
    
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








///////TAB QUERYS/////////////////////////








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
 // console.log(results);
 ary.push(results);   
 if(a == result.rows.length - 1){
ary.forEach(element => {
  var todayDate = new Date(element.FA_BSD_BANKDT).toISOString().slice(0, 10);
  const myArray2 = todayDate.split("-");
  element.FA_BSD_BANKDT = ""+myArray2[2]+"/"+myArray2[1]+"/"+myArray2[0];
});
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
     // console.log(result.rows);
     // console.log(result.metaData);
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
 // console.log(results);
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


router.get('/lift_data_test_list', function (req, res) {
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
      `select SLIFTID,SFLRSTAT2,SDEVDATE,SSERVDATE,SPKTDATE,SPROCINPUT, SRUNSTAT2 from (select SLIFTID,SFLRSTAT2,SDEVDATE,SSERVDATE,SPKTDATE,SPROCINPUT, SRUNSTAT2 from JLPLIOT.IOT_MONGOSCHED_DTL a where SDEVDATE = (SELECT MAX(SDEVDATE) FROM JLPLIOT.IOT_MONGOSCHED_DTL b where SLIFTID = 'L-P2909') and  sflrstat2 is not null AND sLIFTID = 'L-P2909' order by 3 desc)`,
        {},
        {autoCommit: true},
     function(err, result) {
    if (err) { console.error(err.message);
          doRelease(connection);
          return;
     }
     // console.log(result.rows);
     // console.log(result.metaData);
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
 // console.log(results);
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


router.post('/form3_rtgs_jobno_find', function (req, res) {
console.log("****",req.body);
     req.body.Job_no = req.body.Job_no;
      // `select * from COLLECTION_LOV_VW where JOBNO = 'L-I8257'`,
      //   {req.body.job_id},
if(req.body.jtype == 'Service'){
console.log('SERV');
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
console.log(result.rows.length);
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
 // console.log(results);
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
    console.log('MAJ');
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
console.log(result.rows.length);
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
 // console.log(results);
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


router.post('/form3_submit', function (req, res) {
console.log(req.body);
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
     // console.log(result); 
var ary = [];  
for(let a = 0 ; a < result.rows.length;a++){
var temp_data = result.rows[a];
var results = {}
for (var i = 0; i < result.metaData.length; ++i){
results[result.metaData[i].name] = temp_data[i];
}
 // console.log(results);
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




router.post('/update_opact3_score',async function (req, res) {
console.log(req.body);    
var user_details  =  await user_management.findOne({_id:req.body.user_id});
var SMU_SAFSCORE = 0;
var acount = 0;
var bcount = 0;
var ccount = 0;
var dcount = 0;
var nacount = 0;
req.body.Data.forEach(element => {
  console.log(element);
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
console.log("A = "+acount,"B = "+bcount,"C = "+ccount,"D = "+dcount,"NA = "+nacount);
console.log("A = "+0,"B = "+bcount/1,"C = "+ccount/1.5,"D = "+dcount/2.5,"NA = "+nacount/2.5);
var total_values = acount + bcount + ccount + dcount + nacount;
console.log('total_value = ',total_values);
SMU_SAFSCORE = +total_values;
console.log(SMU_SAFSCORE);
var SMU_JOBNO = req.body.job_id;
var SMU_TECHMOBNO = user_details.user_id
console.log(SMU_SAFSCORE,SMU_TECHMOBNO,SMU_JOBNO)
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
        function (err, result_one) {
    if (err) { console.error(err.message);
          doRelease(connection);
          return;
     }
     console.log(result_one);
      res.json({Status:"Success",Message:"State List", Data : {},Code:200});  
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




// router.post('/form3_rtgs_jobno_find', function (req, res) {
//         let StateList = [
//               {
//                   "customer_name":"Bulider Mohammmed3",
//                   "contract_no" : "L-9807o"
//               },
//                {
//                   "customer_name":"Bulider Mohammmed4",
//                   "contract_no" : "L-9807p"
//               },
//                {
//                   "customer_name":"Bulider Mohammmed5",
//                   "contract_no" : "L-9807q"
//               },
//                {
//                   "customer_name":"Bulider Mohammmed6",
//                   "contract_no" : "L-9807i"
//               }
//             ];
//     res.json({Status:"Success",Message:"State List", Data : StateList ,Code:200});  
// });



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
console.log(result.rows.length);
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
 console.log("9999999",results);
 ary.push(results);   
 if(a == result.rows.length - 1){
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
    }
    console.log(fin_data);
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
    // res.json({Status:"Success",Message:"State List", Data : {"customer_name":"Bulider Mohammmed3"}, Code:200});
});



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
    console.log(temp_data[a]);
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

    console.log(da);

      connection.execute(
            "INSERT INTO JLSMART_FLOORHEIGHT_DATA VALUES (:JOBNO, :FLOOR_NUMBER, :FLOOR_HEIGHT, :SUBMITDATE)",
              da, // Bind values
              { autoCommit: true}, 
        function (err, result) {
    if (err) { console.error(err.message);
          doRelease(connection);
          return;
     }
          console.log("Stage 2");
          console.log(result);
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




router.get('/update_service_all_status', function (req, res) {
// JLS_SERCALL_HDR_UPLOAD - SMU_SCH_DWNFLAG - SMU_SCH_MECHCELL
// JLS_SERCALL_HDR_MR - JLS_SCHM_DWNFLAG - JLS_SCHM_ENGR_PHONE
// JLS_QUOTELR_UPLOAD - SMU_SCQH_STATUS - SMU_SEN_MOBILENO
// JLS_ACK_UPLOAD - SMU_ACK_STATUS - SMU_ACK_MOBILENO
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
            "UPDATE JLS_SERCALL_HDR_UPLOAD set SMU_SCH_DWNFLAG='N' WHERE SMU_SCH_MECHCELL='7358780824'",
            {
            },
        {autoCommit: true},
        function (err, result_one) {
    if (err) { console.error(err.message);
          doRelease(connection);
          return;
     }
     console.log("JLS_SERCALL_HDR_UPLOAD  UPDATED",result_one);
      // res.json({Status:"Success",Message:"State List", Data : {},Code:200});  
    });
});
////////////////////////////////////////// 1
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
            "UPDATE JLS_SERCALL_HDR_MR set JLS_SCHM_DWNFLAG='N' WHERE JLS_SCHM_ENGR_PHONE='7358386468'",
            {
              
            },
        {autoCommit: true},
        function (err, result_one) {
    if (err) { console.error(err.message);
          doRelease(connection);
          return;
     }
     console.log("JLS_SERCALL_HDR_UPLOAD  UPDATED",result_one);
      // res.json({Status:"Success",Message:"State List", Data : {},Code:200});  
    });
});
////////////////////////////////////////// 2
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
           "UPDATE JLS_QUOTELR_UPLOAD set SMU_SCQH_STATUS='N' WHERE SMU_SEN_MOBILENO='8136802900'",
            {
              
            },
        {autoCommit: true},
        function (err, result_one) {
    if (err) { console.error(err.message);
          doRelease(connection);
          return;
     }
     console.log("JLS_SERCALL_HDR_UPLOAD  UPDATED",result_one);
      // res.json({Status:"Success",Message:"State List", Data : {},Code:200});  
    });
});
////////////////////////////////////////// 3
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
           "UPDATE JLS_ACK_UPLOAD set SMU_ACK_STATUS='N' WHERE SMU_ACK_MOBILENO='9384879167'",
            {
               
            },
        {autoCommit: true},
        function (err, result_one) {
    if (err) { console.error(err.message);
          doRelease(connection);
          return;
     }
     console.log("JLS_SERCALL_HDR_UPLOAD  UPDATED",result_one);
      // res.json({Status:"Success",Message:"State List", Data : {},Code:200});  
    });
});
////////////////////////////////////////// 4
function doRelease(connection) {
       connection.release(function(err) {
         if (err) {
          console.error(err.message);
        }
      }
   );
}
});














router.get('/remove_orcal_fetch_data',async function (req, res) {
var breakdown_managementModel = require('./../models/breakdown_managementModel');
var breakdown_mr_data_managementModel = require('./../models/breakdown_mr_data_managementModel');
var lr_service_managementModel = require('./../models/lr_service_managementModel');
var part_reply_service_managementModel = require('./../models/part_reply_service_managementModel');

   breakdown_managementModel.remove({}, function (err, user) {
          if (err) return res.status(500).send("There was a problem deleting the user.");
           console.log("Deleted 1");
    });

    breakdown_mr_data_managementModel.remove({}, function (err, user) {
          if (err) return res.status(500).send("There was a problem deleting the user.");
           console.log("Deleted 2");
    });

     lr_service_managementModel.remove({}, function (err, user) {
          if (err) return res.status(500).send("There was a problem deleting the user.");
           console.log("Deleted 3");
    });

      part_reply_service_managementModel.remove({}, function (err, user) {
          if (err) return res.status(500).send("There was a problem deleting the user.");
           console.log("Deleted 4");
    });

});




router.get('/remove_stored_data',async function (req, res) {
var breakdown_data_managementModel = require('./../models/breakdown_data_managementModel');

   breakdown_data_managementModel.remove({}, function (err, user) {
          if (err) return res.status(500).send("There was a problem deleting the user.");
           console.log("Deleted 1");
    });

});






router.get('/getlist_stored_data',async function (req, res) {
var breakdown_data_managementModel = require('./../models/breakdown_data_managementModel');
var group_details = await breakdown_data_managementModel.find({});
res.json({Status:"Success",Message:"Details", Data : group_details ,Code:200});
});



router.get('/test_getlist',validateToken, async function (req, res) {
var breakdown_data_managementModel = require('./../models/breakdown_data_managementModel');
var group_details = await breakdown_data_managementModel.find({});
res.json({Status:"Success",Message:"Details", Data : group_details ,Code:200});
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


function validateToken(req, res, next) {
//get token from request header
var authHeader = req.headers["authorization"];
console.log(authHeader);
if(authHeader == undefined){
     res.status(400).end('Token not present');
       // res.sendStatus(400).send("Token not present")
}else {
    var authHeader_value = ""+req.headers["authorization"];
    console.log(authHeader_value);
     console.log(authHeader_value);
     if(authHeader_value == "Ao00911kklill00011"){
       console.log('True');
       next();
     } else {
        console.log('false');
     }
}

// const token = authHeader.split(" ")[1]
// //the request header contains the token "Bearer <token>", split the string and use the second value in the split array.
// if (token == null) res.sendStatus(400).send("Token not present")
// jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
// if (err) { 
//  res.status(403).send("Token invalid")
//  }
//  else {
//  req.user = user
//  next() //proceed to the next action in the calling function
//  }
// }) //end of jwt.verify()
} //end of function




module.exports = router;
