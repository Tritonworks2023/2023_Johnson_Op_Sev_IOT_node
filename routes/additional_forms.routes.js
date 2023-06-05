var express = require('express');
var router = express.Router();
var bodyParser = require('body-parser');
router.use(bodyParser.urlencoded({ extended: false }));
router.use(bodyParser.json());
var oracledb = require('oracledb');
var path = require('path');       
var fs = require('fs');


var diagram_dataModel = require('./../models/diagram_dataModel');


/////Form Module Declaration////////
var add_escalator_surveyModel = require('./../models/add_escalator_surveyModel');
var add_elevator_surveyModel = require('./../models/add_elevator_surveyModel');
var add_service_visiblityModel = require('./../models/add_service_visiblityModel');
var add_failur_reportModel = require('./../models/add_failur_reportModel');

var add_failur_report_tempModel = require('./../models/add_failur_report_tempModel');

var add_rope_maintenanceModel = require('./../models/add_rope_maintenanceModel');
var add_safety_auditModel = require('./../models/add_safety_auditModel');

var add_repair_work_request_tempModel = require('./../models/add_repair_work_request_tempModel');
var add_repair_work_requestModel = require('./../models/add_repair_work_requestModel');
var add_repair_work_job_hazadModel = require('./../models/add_repair_work_job_hazadModel');






////////////Failure Report DROP_DOWN ///////////
var faiure_final_datas = {
matl_reture_type : [
      {
        display_name : "Local Repair",
        value : "L"
      },
      {
        display_name : "For Repair",
        value : "P"
      },
      {
        display_name : "For return of replacement matl already issued",
        value : "R"
      }
   ],
/////////////////////////////////////////


   pys_condition : [
      {
        display_name : "Others",
        value : "O"
      },
      {
        display_name : "Damaged",
        value : "D"
      },
      {
        display_name : "Water Entry",
        value : "W"
      },
      {
        display_name : "Burnt high voltage",
        value : "by"
      },
      {
        display_name : "Customer Problem",
        value : "C"
      }
   ],
/////////////////////////////////////////

   cuur_status : [
      {
        display_name : "Spare Unit Provide",
        value : "S"
      },
      {
        display_name : "Shut Down",
        value : "D"
      }
   ],
/////////////////////////////////////////

   natu_failure : [
      {
        display_name : "NA",
        value : ""
      },
      {
        display_name : "Trip",
        value : "T"
      },
      {
        display_name : "Dead",
        value : "D"
      }
      
   ],
/////////////////////////////////////////


   vvvf_trip_while : [
      {
        display_name : "NA",
        value : ""
      },
      {
        display_name : "Trip",
        value : "U"
      },
      {
        display_name : "Down",
        value : "D"
      }
   ],
/////////////////////////////////////////


   electric_supply : [
      {
        display_name : "NA",
        value : ""
      },
      {
        display_name : "E.B",
        value : "E"
      },
      {
        display_name : "Generator",
        value : "G"
      }
   ],
/////////////////////////////////////////


   vvvf_trip_type : [
      {
        display_name : "NA",
        value : ""
      },
      {
        display_name : "Accelaration",
        value : "A"
      },
      {
        display_name : "Decelaration",
        value : "D"
      },
      {
        display_name : "Stopping",
        value : "S"
      },
      {
        display_name : "Running",
        value : "R"
      }
   ],
/////////////////////////////////////////


   bat_check_status : [
      {
        display_name : "NA",
        value : ""
      },
      {
        display_name : "Checked OK",
        value : "Y"
      },
      {
        display_name : "Defective",
        value : "N"
      },
      {
        display_name : "Pending",
        value : "P"
      }
   ],
/////////////////////////////////////////



   bat_warr_status : [
      {
        display_name : "NA",
        value : ""
      },
      {
        display_name : "NO",
        value : "N"
      },
      {
        display_name : "YES",
        value : "Y"
      }
   ],
/////////////////////////////////////////



   depart : [
      {
        display_name : "TESTING",
        value : "T"
      },
      {
        display_name : "SERVICE",
        value : "S"
      },
      {
        display_name : "ERECTION",
        value : "E"
      }
   ],
/////////////////////////////////////////



   serv_type : [
      {
        display_name : "NA",
        value : ""
      },
      {
        display_name : "FREE SERVICE",
        value : "F"
      },
      {
        display_name : "SLIVER",
        value : "S"
      },
      {
        display_name : "GOLD",
        value : "G"
      },
       {
        display_name : "PLATINUM",
        value : "P"
      }
   ],
/////////////////////////////////////////




   encoder_checked : [
      {
        display_name : "NA",
        value : ""
      },
      {
        display_name : "NO",
        value : "N"
      },
      {
        display_name : "Yes",
        value : "Y"
      }
   ],
/////////////////////////////////////////


   ld_inside_lift : [
      {
        display_name : "NA",
        value : ""
      },
      {
        display_name : "NO",
        value : "N"
      },
      {
        display_name : "Yes",
        value : "Y"
      }
   ],

/////////////////////////////////////////


/////////////////////////////////////////


   reasoncode : [
      {
        display_name : "MY FAULT",
        value : "BRN002"
      },
      {
        display_name : "SAME MATERIAL USED FOR EACH FLOOR",
        value : "BRN001"
      },
      {
        display_name : "RECENTLY ISSUED BARCODE AMTERIAL FAILED",
        value : "BRN003"
      },
       {
        display_name : "FIRST TIME FAILURE FOR OLD JOB BEFORE BARCODE IMPLEMENTATION",
        value : "BRN0024"
      },
       {
        display_name : "DUPLEX JOB FOR WHICH ICS WERE SUPPLIED WITH FIRST JOB",
        value : "BRN005"
      }
   ],

/////////////////////////////////////////

}




/////////////////////////// Escalator Survey /////////////////////////////////////////


router.post('/escalator_survey/create', async function(req, res) {
  try{
        await add_escalator_surveyModel.create({
  job_id : req.body.job_id,
  building_name : req.body.building_name,
  machine_type : req.body.machine_type,
  cus_address : req.body.cus_address,
  controller_type : req.body.controller_type,
  installed_on : req.body.installed_on,
  survey_no : req.body.survey_no,
  date : req.body.date,
  machine : req.body.machine,
  gear : req.body.gear,
  motor : req.body.motor,
  brake_motor : req.body.brake_motor,
  micro_process : req.body.micro_process,
  relays : req.body.relays,
  contractor : req.body.contractor,
  controller_inspec : req.body.controller_inspec,
  controller_colling_fan : req.body.controller_colling_fan,
  vvvf_conducation : req.body.vvvf_conducation,
  main_shaft : req.body.main_shaft,
  step_roller: req.body.step_roller,
  step_chain_roller : req.body.step_chain_roller,
  handrail_con : req.body.handrail_con,
  handrail_tension : req.body.handrail_tension,
  comb_teeth : req.body.comb_teeth,
  steps_conducation : req.body.steps_conducation,
  skirting_brush: req.body.skirting_brush,
  glass : req.body.glass,
  end_revesable_bear : req.body.end_revesable_bear,
  sub_roller : req.body.sub_roller,
  handrail_ped : req.body.handrail_ped,
  main_drive : req.body.main_drive,
  pinion_wheel : req.body.pinion_wheel,
  drive_chain_slider : req.body.drive_chain_slider,
  tangent_rail :req.body.tangent_rail,
  all_safety_switchs : req.body.all_safety_switchs,
  cable_conducation : req.body.cable_conducation,
  smps_board : req.body.smps_board,
  eme_stop_button : req.body.eme_stop_button,
  key_switch : req.body.key_switch,
  sensors : req.body.sensors,
  inspec_plugs : req.body.inspec_plugs,
  step_gap_light : req.body.step_gap_light,
  skirting_light : req.body.skirting_light,
  pit_light : req.body.pit_light,
  comb_light : req.body.comb_light,
  traffic_light : req.body.traffic_light,
  handrail_light : req.body.handrail_light,
  escaltor_safe_op : req.body.escaltor_safe_op,
  major_concern : req.body.major_concern,
  recommendation : req.body.recommendation,
  cus_name : req.body.cus_name,
  cus_desg : req.body.cus_desg,
  cus_contract : req.body.cus_contract,
  cus_survey_conducted :req.body.cus_survey_conducted,
  cus_survey_by_signature : req.body.cus_survey_by_signature,

  submitted_by_num : req.body.submitted_by_num,
  submitted_by_name : req.body.submitted_by_name,
  submitted_by_emp_code : req.body.submitted_by_emp_code,
  submitted_by_on : req.body.submitted_by_on,

  all_pcbs : req.body.all_pcbs,
  ss_balustrade : req.body.ss_balustrade,


  delete_status : false
         }, 
        function (err, user) {
        res.json({Status:"Success",Message:"Added successfully", Data : {} ,Code:200}); 
        });
}
catch(e){
      res.json({Status:"Failed",Message:"Internal Server Error", Data : {},Code:500});
}
});



router.get('/escalator_survey/deletes', function (req, res) {
      add_escalator_surveyModel.remove({}, function (err, user) {
          if (err) return res.status(500).send("There was a problem deleting the user.");
             res.json({Status:"Success",Message:"Job_no_managment Deleted", Data : {} ,Code:200});     
      });
});

// select CAM_ATY_DESC FROM COM_ACTIVITY_MST Where CAM_ATY_TYPE = 'PROTYPE'

router.get('/escalator_survey/drop_down', function (req, res) {
  


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
            "select CAM_ATY_DESC FROM COM_ACTIVITY_MST Where CAM_ATY_TYPE = 'PROTYPE'",
            {},
        {autoCommit: true},
        function (err, result) {
    if (err) { console.error(err.message);
          doRelease(connection);
          return;
     }
 doRelease(connection);
var ary = [];
if(result.rows.length == 0){
    step_one(ary);
} else {
for(let a = 0 ; a < result.rows.length ; a++){
var temp_data = result.rows[a];
var results = {}
for (var i = 0; i < result.metaData.length; ++i){
results[result.metaData[i].name] = temp_data[i];
}
ary.push({type_name : results.CAM_ATY_DESC});  
if(a == result.rows.length - 1){
     step_one(ary);
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


function step_one(data){


   let final_value = {
      machine_type : [
       {
        type_name : "GEARED MACHINE"
       },
       {
        type_name : "GEAR LESS MACHINE"
       }
       ],
      controller_type : data 
     }
     res.json({Status:"Success",Message:"Escalator Dropdown Details", Data : final_value ,Code:200});    


}


    
});


router.post('/escalator_survey/check_data', function (req, res) {
        add_escalator_surveyModel.findOne({job_id : req.body.job_id, survey_no : req.body.survey_no, submitted_by_num : req.body.submitted_by_num }, function (err, StateList) {
            if(StateList == null){
                res.json({Status:"Success",Message:"No Record Found", Data : {} ,Code:404});
            }else {
                res.json({Status:"Success",Message:"Already you have submitted the data", Data : {} ,Code:200});
            }
        });
});



// ******************************************************************************************************************************************************************************
// SERVICE ADDITION FORM ESCALATOR VIEW SINGLE DETAILS - ADMIN PANEL
// ******************************************************************************************************************************************************************************
router.post('/escalator_survey/getlist_id', function (req, res) {
    add_escalator_surveyModel.findOne({job_id : req.body.job_id, survey_no : req.body.survey_no }, function (err, StateList) {
        res.json({Status:"Success",Message:"Submitted Data", Data : StateList ,Code:200});
    });
});









// router.post('/escalator_survey/fetch_data_job_id', function (req, res) {
// console.log(req.body);
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
//             "SELECT * FROM JLS_SERMAS_CUST_VW  WHERE JOBNO=:JOBNO",
//             {JOBNO : req.body.job_id},
//         {autoCommit: true},
//         function (err, result) {
//     if (err) { console.error(err.message);
//           doRelease(connection);
//           return;
//      }
//  doRelease(connection);
// if(result.rows.length == 0){
//      res.json({Status:"Success",Message:"No Data Found", Data : [] ,Code:200});
// } else {
// var ary = [];
// for(let a = 0 ; a < result.rows.length ; a++){
// var temp_data = result.rows[a];
// var results = {}
// for (var i = 0; i < result.metaData.length; ++i){
// results[result.metaData[i].name] = temp_data[i];
// }
// results.imie_no = '';
// results.insp_by = '';
// results.tech_code = 'E1200';
// results.tech_name = 'Mohammed';
//  ary.push(results);   
//  if(a == result.rows.length - 1){
//     console.log(ary);
//   res.json({Status:"Success",Message:"Job Details", Data : ary ,Code:200});
 





//      }
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
// });




router.post('/escalator_survey/fetch_data_job_id', function (req, res) {
oracledb.getConnection({
      user: "JLSMART",
      password: "JLSMART",
      connectString: "(DESCRIPTION =(ADDRESS = (PROTOCOL = TCP)(HOST = 192.168.1.112)(PORT = 1521))(CONNECT_DATA =(SID = jlpl)))"
}, function(err, connection) {
if (err) {
    // console.error(err.message);
    return;
}
//SOM DATABASE
connection.execute(
            "SELECT * FROM JLS_SERMAS_CUST_VW  WHERE JOBNO=:JOBNO",
            {JOBNO : req.body.job_id},
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
results.imie_no = '';
results.insp_by = '';
results.tech_code = 'E00000';
results.tech_name = 'Unknown';
results.mech_code = 'E00000';
results.mech_name = 'Unknown';
results.zone_code = 'E00000';
results.zone_name = 'Unknown';
results.EPROUTECD = '';
results.ZPROUTECD = '';
results.SERV_TYPE = '';
results.DEPRT = '';
 ary.push(results);   
 if(a == result.rows.length - 1){
   fetch_mech_details(ary);
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


function fetch_mech_details(ary){
    oracledb.getConnection({
          user: "JLSMART",
          password: "JLSMART",
          connectString: "(DESCRIPTION =(ADDRESS = (PROTOCOL = TCP)(HOST = 192.168.1.112)(PORT = 1521))(CONNECT_DATA =(SID = jlpl)))"
    }, function(err, connection) {
    if (err) {
        return;
    }
    connection.execute(
                "SELECT  * FROM OM_SERENGROUTE_VW  WHERE TREETYPE=:TREETYPE AND trunc(SYSDATE) between SFRDT and STODT AND ROUTECD=:ROUTECD AND  BRCODE=:BRCODE",
                {ROUTECD : ary[0].SROUTE, BRCODE : ary[0].BRCODE, TREETYPE : 'M' },
            {autoCommit: true},
            function (err, result) {
        if (err) { console.error(err.message);
              doRelease(connection);
              return;
         }  
     doRelease(connection);
    if(result.rows.length == 0){
         fetch_eng_details(ary);
    } else {
    var arys = [];
    for(let a = 0 ; a < result.rows.length ; a++){
    var temp_data = result.rows[a];
    var results = {}
    for (var i = 0; i < result.metaData.length; ++i){
    results[result.metaData[i].name] = temp_data[i];
    }
     arys.push(results);   
     if(a == result.rows.length - 1){
        ary[0].mech_code = arys[0].EMPCODE;
        ary[0].mech_name = arys[0].ENAME;
        ary[0].EPROUTECD = arys[0].PROUTECD;
        fetch_eng_details(ary);
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


function fetch_eng_details(ary){
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
                "SELECT  * FROM OM_SERENGROUTE_VW  WHERE TREETYPE=:TREETYPE AND trunc(SYSDATE) between SFRDT and STODT AND ROUTECD=:ROUTECD AND  BRCODE=:BRCODE",
                {ROUTECD : ary[0].EPROUTECD, BRCODE : ary[0].BRCODE, TREETYPE : 'E' },
            {autoCommit: true},
            function (err, result) {
        if (err) { console.error(err.message);
              doRelease(connection);
              return;
         }  
     doRelease(connection);
    if(result.rows.length == 0){
          fetch_zone_details(ary);
    } else {
    var arys = [];
    for(let a = 0 ; a < result.rows.length ; a++){
    var temp_data = result.rows[a];
    var results = {}
    for (var i = 0; i < result.metaData.length; ++i){
    results[result.metaData[i].name] = temp_data[i];
    }
     arys.push(results);   
     if(a == result.rows.length - 1){
        ary[0].tech_code = arys[0].EMPCODE;
        ary[0].tech_name = arys[0].ENAME;
        ary[0].ZPROUTECD = arys[0].PROUTECD;
        fetch_zone_details(ary);
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




function fetch_zone_details(ary){
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
                "SELECT  * FROM OM_SERENGROUTE_VW  WHERE TREETYPE=:TREETYPE AND trunc(SYSDATE) between SFRDT and STODT AND ROUTECD=:ROUTECD AND  BRCODE=:BRCODE",
                {ROUTECD : ary[0].ZPROUTECD, BRCODE : ary[0].BRCODE, TREETYPE : 'Z' },
            {autoCommit: true},
            function (err, result) {
        if (err) { console.error(err.message);
              doRelease(connection);
              return;
         }
     doRelease(connection);
    if(result.rows.length == 0){
        serv_type(ary);
    } else {
    var arys = [];
    for(let a = 0 ; a < result.rows.length ; a++){
    var temp_data = result.rows[a];
    var results = {}
    for (var i = 0; i < result.metaData.length; ++i){
    results[result.metaData[i].name] = temp_data[i];
    }
     arys.push(results);   
     if(a == result.rows.length - 1){
        ary[0].zone_code = arys[0].EMPCODE;
        ary[0].zone_name = arys[0].ENAME;
        serv_type(ary);
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



function serv_type(ary) {

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
              "SELECT CASE WHEN OM_SED_SERTYPE = 'PSM' THEN 'P' WHEN OM_SED_SERTYPE = 'GSM' THEN 'G' WHEN OM_SED_SERTYPE = 'SSM' THEN 'S' WHEN OM_SED_SERTYPE = 'FSM' THEN 'F' ELSE 'N' END SERTYPE FROM OM_SERMAS_DTL WHERE OM_SED_JOBNO = :ST_FLH_JOBNO AND OM_SED_STODT = (SELECT MAX(OM_SED_STODT) FROM OM_SERMAS_DTL WHERE OM_SED_SFRDT <=TRUNC(SYSDATE) AND OM_SED_JOBNO = :ST_FLH_JOBNO)",
              {ST_FLH_JOBNO : ary[0].JOBNO },
          {autoCommit: true},
          function (err, result) {
      if (err) { console.error(err.message);
            doRelease(connection);
            return;
       }  
   doRelease(connection);
  if(result.rows.length == 0){
        res.json({Status:"Success",Message:"Job Details", Data : ary ,Code:200});
  } else {
  var arys = [];
  for(let a = 0 ; a < result.rows.length ; a++){
  var temp_data = result.rows[a];
  var results = {}
  for (var i = 0; i < result.metaData.length; ++i){
  results[result.metaData[i].name] = temp_data[i];
  }
   arys.push(results);   
   if(a == result.rows.length - 1){
      ary[0].SERV_TYPE = arys[0].SERTYPE;
      ary[0].DEPRT = 'S';
      res.json({Status:"Success",Message:"Job Details", Data : ary ,Code:200});

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


// ******************************************************************************************************************************************************************************
// SERVICE ADDITION FORM ESCALATOR LIST - ADMIN PANEL
// ******************************************************************************************************************************************************************************
router.get('/escalator_survey/getlist', function (req, res) {
        add_escalator_surveyModel.find({}, function (err, Functiondetails) {
          res.json({Status:"Success",Message:"Data List", Data : Functiondetails ,Code:200});
        });
});


router.post('/escalator_survey/edit', function (req, res) {
        add_escalator_surveyModel.findByIdAndUpdate(req.body._id, req.body, {new: true}, function (err, UpdatedDetails) {
            if (err) return res.json({Status:"Failed",Message:"Internal Server Error", Data : {},Code:500});
             res.json({Status:"Success",Message:"Updated successfully", Data : UpdatedDetails ,Code:200});
        });
});

// // DELETES A USER FROM THE DATABASE
router.post('/escalator_survey/delete', function (req, res) {
      add_escalator_surveyModel.findByIdAndRemove(req.body.Activity_id, function (err, user) {
          if (err) return res.json({Status:"Failed",Message:"Internal Server Error", Data : {},Code:500});
          res.json({Status:"Success",Message:"Deleted successfully", Data : {} ,Code:200});
      });
});

/////////////////////////// Escalator Survey /////////////////////////////////////////





/////////////////////////// Elevator Survey /////////////////////////////////////////



router.post('/elevator_survey/create', async function(req, res) {
  try{
        await add_elevator_surveyModel.create({
  job_id : req.body.job_id,
  building_name : req.body.building_name,
  machine_type : req.body.machine_type,
  cus_address : req.body.cus_address,
  controller_type : req.body.controller_type,
  installed_on : req.body.installed_on,
  survey_no : req.body.survey_no,
  date : req.body.date,
  machine : req.body.machine,
  gear : req.body.gear,
  sheave : req.body.sheave,
  ropes : req.body.ropes,
  motor : req.body.motor,
  controller_drive : req.body.controller_drive,
  relays : req.body.relays,
  controller_inspec : req.body.controller_inspec,
  governor_rope : req.body.governor_rope,
  ard : req.body.ard,
  car_type : req.body.car_type,
  fan: req.body.fan,
  eme_light : req.body.eme_light,
  buttons : req.body.buttons,
  car_op_panel : req.body.car_op_panel,
  car_top_sheave : req.body.car_top_sheave,
  car_inspec_box: req.body.car_inspec_box,
  retiring_cam : req.body.retiring_cam,
  mechanical_safe : req.body.mechanical_safe,
  car_gate_switch : req.body.car_gate_switch,
  sub_roller : req.body.sub_roller,
  buffer : req.body.buffer,
  gov_tension_pulley : req.body.gov_tension_pulley,
  pti_condition : req.body.pti_condition,
  travelling_cable : req.body.travelling_cable,
  door_lock : req.body.door_lock,
  limit_switch : req.body.limit_switch,
  magnet_vanes : req.body.magnet_vanes,
  counter_weight : req.body.counter_weight,
  eme_alarm : req.body.eme_alarm,
  door_closer : req.body.door_closer,
  hall_button : req.body.hall_button,
  door_Vf : req.body.door_Vf,
  type_of_entrance : req.body.type_of_entrance,
  elevator_safe_op : req.body.elevator_safe_op,
  major_concern : req.body.major_concern,
  recommendation : req.body.recommendation,
  cus_name : req.body.cus_name,
  cus_desg : req.body.cus_desg,
  cus_contract : req.body.cus_contract,
  cus_survey_conducted : req.body.cus_survey_conducted,
  cus_survey_by_signature : req.body.cus_survey_by_signature,
  submitted_by_num : req.body.submitted_by_num,
  submitted_by_name : req.body.submitted_by_name,
  submitted_by_emp_code : req.body.submitted_by_emp_code,
  submitted_by_on : req.body.submitted_by_on,
  rescue_switch : req.body.rescue_switch,
  rope_hole_cutout :req.body.rope_hole_cutout,
  osg_gaurd : req.body.osg_gaurd,
  ard_battery_box : req.body.ard_battery_box,
  car_top_barricade : req.body.car_top_barricade,
  additional_car_stop_switch : req.body.additional_car_stop_switch,
  pit_switch_positioning : req.body.pit_switch_positioning,
  pit_ladder : req.body.pit_ladder,
  cwt_guard : req.body.cwt_guard,
  delete_status : false
         }, 
        function (err, user) {
        res.json({Status:"Success",Message:"Added successfully", Data : user ,Code:200}); 
        });
}
catch(e){
      res.json({Status:"Failed",Message:"Internal Server Error", Data : {},Code:500});
}
});


router.get('/elevator_survey/deletes', function (req, res) {
      add_elevator_surveyModel.remove({}, function (err, user) {
          if (err) return res.status(500).send("There was a problem deleting the user.");
             res.json({Status:"Success",Message:"Job_no_managment Deleted", Data : {} ,Code:200});     
      });
});


router.post('/elevator_survey/check_data', function (req, res) {
        add_elevator_surveyModel.findOne({job_id : req.body.job_id, survey_no : req.body.survey_no, submitted_by_num : req.body.submitted_by_num }, function (err, StateList) {
            if(StateList == null){
                res.json({Status:"Success",Message:"No Record Found", Data : {} ,Code:404});
            }else {
                res.json({Status:"Success",Message:"Already you have submitted the data", Data : {} ,Code:200});
            }
        });
});




// ******************************************************************************************************************************************************************************
// SERVICE ADDITION FORM ELEVATOR LIST - ADMIN PANEL
// ******************************************************************************************************************************************************************************

router.get('/elevator_survey/getlist', function (req, res) {
        add_elevator_surveyModel.find({}, function (err, Functiondetails) {
          res.json({Status:"Success",Message:"Data List", Data : Functiondetails ,Code:200});
        });
});

// ******************************************************************************************************************************************************************************
// SERVICE ADDITION FORM ELEVATOR VIEW SINGLE DETAIL - ADMIN PANEL
// ******************************************************************************************************************************************************************************

router.post('/elevator_survey/getlist_id', function (req, res) {
    add_elevator_surveyModel.findOne({job_id : req.body.job_id, survey_no : req.body.survey_no }, function (err, StateList) {
        res.json({Status:"Success",Message:"Submitted Data", Data : StateList ,Code:200});
    });
});



router.post('/elevator_survey/edit', function (req, res) {
        add_elevator_surveyModel.findByIdAndUpdate(req.body._id, req.body, {new: true}, function (err, UpdatedDetails) {
            if (err) return res.json({Status:"Failed",Message:"Internal Server Error", Data : {},Code:500});
             res.json({Status:"Success",Message:"Updated successfully", Data : UpdatedDetails ,Code:200});
        });
});

// // DELETES A USER FROM THE DATABASE
router.post('/elevator_survey/delete', function (req, res) {
      add_elevator_surveyModel.findByIdAndRemove(req.body.Activity_id, function (err, user) {
          if (err) return res.json({Status:"Failed",Message:"Internal Server Error", Data : {},Code:500});
          res.json({Status:"Success",Message:"Deleted successfully", Data : {} ,Code:200});
      });
});


/////////////////////////// Elevator Survey /////////////////////////////////////////


/////////////////////////// Service Visiblity Form/////////////////////////////////////////

router.post('/service_visiblity/create', async function(req, res) {
 
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
        `SELECT GET_ENGRSQNO(:job_id) ENG FROM DUAL`,
        {job_id : req.body.submitted_by_emp_code},
        {autoCommit: true},
     function(err, result) {
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
}
recall(results,req);
});
});

async function recall(data,req) {
  try{
        await add_service_visiblityModel.create({
  job_id : req.body.job_id || "",
  building_name : req.body.building_name || "",
  cat_type : req.body.cat_type,
  images_ary : req.body.images_ary,
  cus_name : req.body.cus_name,
  submitted_by_emp_code : req.body.submitted_by_emp_code,
  submitted_by_num : req.body.submitted_by_num,
  submitted_by_name : req.body.submitted_by_name,
  submitted_by_on : req.body.submitted_by_on,
  program_date : req.body.program_date,
  delete_status : false
         }, 
        function (err, user) {     

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
            "JLS_SVD_BRCODE": req.body.brcode || "TN01",
            "JLS_SVD_DATE": req.body.program_date,
            "JLS_SVD_PROGCD": req.body.cat_type || "",
            "JLS_SVD_JOBNO": req.body.job_id || "",
            "JLS_SVD_CUSNAME": req.body.cus_name || "",
            "JLS_SVD_ENGRSQNO":  +data.ENG,
            "JLS_SVD_PREPBY": ""+req.body.submitted_by_num,
            "JLS_SVD_PREPDT": ""+req.body.submitted_by_on,
            "JLS_SVD_STATUS": "A"
    }
      connection.execute(
            "INSERT INTO JLS_SERVISIB_DTL (JLS_SVD_BRCODE, JLS_SVD_DATE, JLS_SVD_PROGCD, JLS_SVD_JOBNO, JLS_SVD_CUSNAME, JLS_SVD_ENGRSQNO, JLS_SVD_PREPBY, JLS_SVD_PREPDT, JLS_SVD_STATUS) VALUES (:JLS_SVD_BRCODE, :JLS_SVD_DATE, :JLS_SVD_PROGCD, :JLS_SVD_JOBNO, :JLS_SVD_CUSNAME, :JLS_SVD_ENGRSQNO, :JLS_SVD_PREPBY, :JLS_SVD_PREPDT, :JLS_SVD_STATUS)",
              da, // Bind values
              { autoCommit: true}, 
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

 });
}
catch(e){
      res.json({Status:"Failed",Message:"Internal Server Error", Data : {},Code:500});
}


}

});


router.get('/service_visiblity/deletes', function (req, res) {
      add_service_visiblityModel.remove({}, function (err, user) {
          if (err) return res.status(500).send("There was a problem deleting the user.");
             res.json({Status:"Success",Message:"Job_no_managment Deleted", Data : {} ,Code:200});     
      });
});



router.post('/service_visiblity/check_data', function (req, res) {
        add_service_visiblityModel.findOne({job_id : req.body.job_id, program_date : req.body.program_date, submitted_by_num : req.body.submitted_by_num, cat_type : req.body.cat_type }, function (err, StateList) {
            if(StateList == null){
                res.json({Status:"Success",Message:"No Record Found", Data : {} ,Code:404});
            }else {
                res.json({Status:"Success",Message:"Already you have submitted the data", Data : {} ,Code:200});
            }
        });
});


router.post('/service_visiblity/get_imie_brcd', function (req, res) {
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
      "SELECT DISTINCT OM_SEN_BRCODE, PA_PTE_SEQNO, PA_PTE_DEPT,PA_PTE_EQUIPTYPE, PA_PTH_USERCODE, ENAME, PA_PTE_IMEINO1 FROM PA_TELEQUIP_MST, PA_TELEPHONE_HDR, EMPLOYEE_VW, OM_SERENGR_MST WHERE PA_PTH_EQUIPCODE = PA_PTE_SEQNO AND PA_PTH_USERCODE = EMPNO AND PA_PTH_TODT IS NULL AND PA_PTH_CLOSDATE IS NULL AND PA_PTE_DEPT = 'SERM' AND OM_SEN_BRCODE =:brcode AND PA_PTH_USERCODE = OM_SEN_EMPCODE AND OM_SEN_STATUS = 'A'order by 1,5",
            {brcode: req.body.brcode},
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
 ary.push( {
            "OM_SM_IMEI": results.PA_PTE_IMEINO1,
            "OM_SEN_BRCODE": results.OM_SEN_BRCODE,
            "OM_SEN_SQNO":  results.PA_PTE_SEQNO,
            "OM_SM_EMPID":  results.PA_PTH_USERCODE,
            "OM_SM_EMPNAME":  results.ENAME,
        });   
 if(a == result.rows.length - 1){
  res.json({Status:"Success",Message:"IMIE Details", Data : ary ,Code:200});
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



router.get('/service_visiblity/getlist', function (req, res) {
        add_service_visiblityModel.find({}, function (err, Functiondetails) {
          res.json({Status:"Success",Message:"Data  List", Data : Functiondetails ,Code:200});
        });
});


router.post('/service_visiblity/getlist_id', function (req, res) {
    add_service_visiblityModel.findOne({job_id : req.body.job_id, program_date : req.body.program_date }, function (err, StateList) {
        res.json({Status:"Success",Message:"Submitted Data", Data : StateList ,Code:200});
    });
});



router.post('/service_visiblity/edit', function (req, res) {
        add_service_visiblityModel.findByIdAndUpdate(req.body._id, req.body, {new: true}, function (err, UpdatedDetails) {
            if (err) return res.json({Status:"Failed",Message:"Internal Server Error", Data : {},Code:500});
             res.json({Status:"Success",Message:"Updated successfully", Data : UpdatedDetails ,Code:200});
        });
});

// // DELETES A USER FROM THE DATABASE
router.post('/service_visiblity/delete', function (req, res) {
      add_service_visiblityModel.findByIdAndRemove(req.body.Activity_id, function (err, user) {
          if (err) return res.json({Status:"Failed",Message:"Internal Server Error", Data : {},Code:500});
          res.json({Status:"Success",Message:"Deleted successfully", Data : {} ,Code:200});
      });
});


/////////////////////////// Service Visiblity Form/////////////////////////////////////////









/////////////////////////// FAILURE REPORT FORM /////////////////////////////////////////

router.post('/temp/failure_report/create', async function(req, res) {
  try{
        await add_failur_report_tempModel.create({
  matl_return_type :  req.body.matl_return_type || "",
  qr_bar_code : req.body.qr_bar_code || "",
  status : req.body.status || "",
  matl_id : req.body.matl_id || "",
  bar_code_job_no : req.body.bar_code_job_no || "",
  seq_no : req.body.seq_no || "",
  fr_no : req.body.fr_no || "",
  br_code : req.body.br_code || "",
  job_id : req.body.job_id || "",
  comp_device_name : req.body.comp_device_name || "",
  comp_device_no: req.body.comp_device_no || "",
  depart_name : req.body.depart_name || "",
  serv_type : req.body.serv_type || "",
  model_make : req.body.model_make || "",
  rating: req.body.rating || "",
  serial_no : req.body.serial_no || "",
  failure_date : req.body.failure_date || "",
  observation : req.body.observation || "",
  supply_vol : req.body.supply_vol || "",
  inst_date : req.body.inst_date || "",
  phys_cond : req.body.phys_cond || "",
  curr_status : req.body.curr_status || "",
  tech_comment : req.body.tech_comment || "",
  mech_code : req.body.mech_code || "",
  mech_name : req.body.mech_name || "",
  eng_code : req.body.eng_code || "",
  eng_name : req.body.eng_name || "",
  reason_code : req.body.reason_code || "",
  route_code : req.body.route_code || "",
  curlss_no : req.body.curlss_no || "",
  prvlss_no : req.body.prvlss_no || "",
  nature_failure: req.body.nature_failure || "",
  vvf_remarks : req.body.vvf_remarks || "",
  vvf_item : req.body.vvf_item || "",
  vvvf_trip_while : req.body.vvvf_trip_while || "",
  vvvf_trip_type : req.body.vvvf_trip_type || "",
  encoder_checked : req.body.encoder_checked || "",
  load_inside_lift : req.body.load_inside_lift || "",
  electric_supply : req.body.electric_supply || "",
  electric_volt : req.body.electric_volt || "",
  bat_check_status : req.body.bat_check_status || "",
  bat_warranty_status : req.body.bat_warranty_status || "",
  ins_address : req.body.ins_address || "",
  customer_address : req.body.customer_address || "",
  file_image : req.body.file_image || "",
  app_status : 'PENDING',
  submitted_by_emp_code : req.body.submitted_by_emp_code || "",
  submitted_by_num : req.body.submitted_by_num || "",
  submitted_by_name : req.body.submitted_by_name || "",
  submitted_by_on : req.body.submitted_by_on || "",
  delete_status : false
         }, function (err, user) {
console.log(err);
res.json({Status:"Success",Message:"Failure Report Data Submitted", Data : user ,Code:200});
});
}
catch(e){
      res.json({Status:"Failed",Message:"Internal Server Error", Data : {},Code:500});
}
});


router.get('/temp/failure_report/getlist', function (req, res) {
        add_failur_report_tempModel.find({}, function (err, Functiondetails) {
          res.json({Status:"Success",Message:"Failure Report Data", Data : Functiondetails ,Code:200});
        });
});



router.post('/temp/failure_report/edit', function (req, res) {
      
         console.log(req.body);



         add_failur_report_tempModel.findByIdAndUpdate(req.body._id, req.body, {new: true}, function (err, UpdatedDetails) {
            if (err) return res.json({Status:"Failed",Message:"Internal Server Error", Data : {},Code:500});
          
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

              "JLS_FLH_SEQNO"    : ""+UpdatedDetails.seq_no || "",
              "JLS_FLH_RETURNTYPE"    : ""+UpdatedDetails.matl_return_type || "",
              "JLS_FLH_NO"  :  ""+UpdatedDetails.fr_no || "",
              "JLS_FLH_BARCODENO"    : ""+UpdatedDetails.qr_bar_code || "",
              "JLS_FLH_STATUS"    : ""+UpdatedDetails.status || "",
              "JLS_FLH_BARCODEJOBNO"    : ""+UpdatedDetails.job_id  || "",
              "JLS_FLH_BRID"     : ""+UpdatedDetails.br_code || "",
              "JLS_FLH_JOBNO"    : ""+UpdatedDetails.job_id || "",
              "JLS_FLH_DEPT"    : ""+UpdatedDetails.depart_name || "",
              "JLS_FLH_SERTYP"  : ""+UpdatedDetails.serv_type || "",
              "JLS_FLH_MODEL"  : ""+UpdatedDetails.model_make || "",
              "JLS_FLH_RATING"  : ""+UpdatedDetails.rating || "",
              "JLS_FLH_SNO"  : ""+UpdatedDetails.serial_no || "",
              "JLS_FLH_DATE"  : ""+UpdatedDetails.failure_date || "",
              "JLS_FLH_OBSER"   : ""+UpdatedDetails.observation || "",
              "JLS_FLH_INSTALDT"    : ""+UpdatedDetails.failure_date || "",
              "JLS_FLH_PSYCON"    : ""+UpdatedDetails.phys_cond || "",
              "JLS_FLH_CURSTAT"    : ""+UpdatedDetails.curr_status || "",
              "JLS_FLH_COMMENT"    : ""+UpdatedDetails.tech_comment || "",
              "JLS_FLH_ENGR"    : ""+UpdatedDetails.eng_code || "",
              "JLS_FLH_MECH"    : ""+UpdatedDetails.mech_code || "",
              "JLS_FLH_TECH"    : ""+UpdatedDetails.submitted_by_emp_code || "",
              "JLS_FLH_REASONCD"    : ""+UpdatedDetails.reason_code.substring(0,6) || "",
              "JLS_FLH_VVFREMARKS"    : ""+UpdatedDetails.vvf_remarks || "",
              "JLS_FLH_VVFTRIP"    : ""+UpdatedDetails.vvvf_trip_while || "",
              "JLS_FLH_VVFTRIPTYPE"    : ""+UpdatedDetails.vvvf_trip_type || "",
              "JLS_FLH_ENCODER"    : ""+UpdatedDetails.encoder_checked || "",
              "JLS_FLH_TRIPLOAD"    : ""+UpdatedDetails.load_inside_lift || "",
              "JLS_FLH_ELECTRIC"    : ""+UpdatedDetails.electric_supply || "",
              "JLS_FLH_EBVOLT"    : +UpdatedDetails.electric_volt || "",
              "JLS_FLH_WARSTATUS"    : ""+UpdatedDetails.bat_warranty_status || "",
              "JLS_FLH_PREPBY"    : ""+UpdatedDetails.submitted_by_emp_code,
              "JLS_FLH_PREPDT"    : ""+UpdatedDetails.submitted_by_on, 
              "JLS_FLH_MATID"    : +UpdatedDetails.comp_device_no || "",
              "JLS_FLH_INSUP"    : ""+UpdatedDetails.supply_vol || "",
              "JLS_FLH_VVFFAILNAT"    : ""+UpdatedDetails.nature_failure || "", 
              "JLS_FLH_CHECKSTATUS"    : ""+UpdatedDetails.bat_check_status || "",

            }
            console.log("BR CODE DETAILS",da);
              connection.execute(
                "INSERT INTO JLS_FAILURE_REPHDR (JLS_FLH_SEQNO, JLS_FLH_RETURNTYPE, JLS_FLH_NO, JLS_FLH_BARCODENO, JLS_FLH_STATUS, JLS_FLH_BARCODEJOBNO, JLS_FLH_BRID, JLS_FLH_JOBNO, JLS_FLH_DEPT, JLS_FLH_SERTYP, JLS_FLH_MODEL, JLS_FLH_RATING, JLS_FLH_SNO, JLS_FLH_DATE, JLS_FLH_OBSER, JLS_FLH_INSTALDT, JLS_FLH_PSYCON, JLS_FLH_CURSTAT, JLS_FLH_COMMENT, JLS_FLH_ENGR, JLS_FLH_MECH, JLS_FLH_TECH, JLS_FLH_REASONCD, JLS_FLH_VVFREMARKS, JLS_FLH_VVFTRIP, JLS_FLH_VVFTRIPTYPE, JLS_FLH_ENCODER, JLS_FLH_TRIPLOAD, JLS_FLH_ELECTRIC, JLS_FLH_EBVOLT, JLS_FLH_WARSTATUS, JLS_FLH_PREPBY, JLS_FLH_PREPDT, JLS_FLH_MATID, JLS_FLH_INSUP, JLS_FLH_VVFFAILNAT, JLS_FLH_CHECKSTATUS) VALUES ( :JLS_FLH_SEQNO, :JLS_FLH_RETURNTYPE, :JLS_FLH_NO, :JLS_FLH_BARCODENO, :JLS_FLH_STATUS, :JLS_FLH_BARCODEJOBNO, :JLS_FLH_BRID, :JLS_FLH_JOBNO, :JLS_FLH_DEPT, :JLS_FLH_SERTYP, :JLS_FLH_MODEL, :JLS_FLH_RATING, :JLS_FLH_SNO, :JLS_FLH_DATE, :JLS_FLH_OBSER, :JLS_FLH_INSTALDT, :JLS_FLH_PSYCON, :JLS_FLH_CURSTAT, :JLS_FLH_COMMENT, :JLS_FLH_ENGR, :JLS_FLH_MECH, :JLS_FLH_TECH, :JLS_FLH_REASONCD, :JLS_FLH_VVFREMARKS, :JLS_FLH_VVFTRIP, :JLS_FLH_VVFTRIPTYPE, :JLS_FLH_ENCODER, :JLS_FLH_TRIPLOAD, :JLS_FLH_ELECTRIC, :JLS_FLH_EBVOLT, :JLS_FLH_WARSTATUS, :JLS_FLH_PREPBY, :JLS_FLH_PREPDT, :JLS_FLH_MATID, :JLS_FLH_INSUP, :JLS_FLH_VVFFAILNAT, :JLS_FLH_CHECKSTATUS )",
                      da, // Bind values
                      { autoCommit: true}, 
                function (err, result) {
            if (err) { console.error(err.message);
                  doRelease(connection);
                  return;
             }
             console.log(result);
             // res.json({Status:"Success",Message:"Added successfully", Data : {} ,Code:200}); 
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


            //  res.json({Status:"Success",Message:"Functiondetails Updated", Data : UpdatedDetails ,Code:200});
        });
});



router.get('/temp/failure_report/deletes', function (req, res) {
      add_failur_report_tempModel.remove({}, function (err, Functiondetails) {
          res.json({Status:"Success",Message:"error_log", Data : Functiondetails ,Code:200});
        });
});





router.post('/temp/failure_report/getlist_by_eng_code', function (req, res) {
      // console.log(req.body);
        add_failur_report_tempModel.find({eng_code : req.body.eng_code}, function (err, Functiondetails) {
          console.log(err);
          res.json({Status:"Success",Message:"Failure Report Request Data", Data : Functiondetails ,Code:200});
        }).sort({app_status: 1 });
});



router.post('/temp/failure_report/branch_head/getlist_by_eng_code', function (req, res) {
      // console.log(req.body);
        add_failur_report_tempModel.find({br_code : req.body.br_code}, function (err, Functiondetails) {
          console.log(err);
          res.json({Status:"Success",Message:"Failure Report Request Data", Data : Functiondetails ,Code:200});
        }).sort({app_status: 1 });
});




router.post('/temp/failure_report/admin_delete', function (req, res) {
      add_failur_report_tempModel.findByIdAndRemove(req.body._id, function (err, user) {
          if (err) return res.json({Status:"Failed",Message:"Internal Server Error", Data : {},Code:500});
          res.json({Status:"Success",Message:"activedetail_management Deleted successfully", Data : {} ,Code:200});
      });
});




router.get('/temp/failure_report/getlist', function (req, res) {
        add_failur_report_tempModel.find({}, function (err, Functiondetails) {
          res.json({Status:"Success",Message:"Failure Report Request Data", Data : Functiondetails ,Code:200});
        });
});




router.post('/temp/failure_report/getlist_by_mech_code', function (req, res) {
        add_failur_report_tempModel.find({mech_code : req.body.mech_code, app_status : 'PENDING'}, function (err, Functiondetails) {
          res.json({Status:"Success",Message:"Failure Report Request Data", Data : Functiondetails ,Code:200});
        })
       
});



router.post('/failure_report/check_data', function (req, res) {
        add_failur_report_tempModel.findOne({ job_id : req.body.job_id, report_date : req.body.report_date, submitted_by_num : req.body.submitted_by_num }, function (err, StateList) {
            if(StateList == null){
                res.json({Status:"Success",Message:"No Record Found", Data : {} ,Code:404});
            }else {
                res.json({Status:"Success",Message:"Already you have submitted the data", Data : {} ,Code:200});
            }
        });
});



router.post('/failure_report/fetch_details_by_code', function (req, res) {
var final_data = {
   install_address : "",
   customer_address : "",
   job_id : req.body.job_id,
   status : "A",
   bar_code_job_no : req.body.job_id,
   comp_device : "",
   comp_device_name : "",
   malt_id : "",
   department : "",
   serv_type : "",
};

fetch_mat_detail(req,final_data);
//////fetch_mat_detail/////
function fetch_mat_detail(req,final_data) {
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
      `SELECT ST_GRID_JOBNO, BARCODEJOBNO, ST_GRID_MATLID,
ST_GRID_ISMRSEQNO , ST_GRID_BARCODENO  FROM(
SELECT DISTINCT ST_GRID_JOBNO, ST_GRID_JOBNO BARCODEJOBNO, ST_GRID_MATLID ,
ST_GRID_ISMRSEQNO , ST_GRID_BARCODENO  
FROM ST_GRNOTEIDNO_DTL
WHERE NVL(ST_GRID_FACIDNO,ST_GRID_BARCODENO) =:FACTBARCODE )
WHERE NVL(ST_GRID_JOBNO,'SPARES') <> 'SPARES'`,
        {FACTBARCODE: req.body.FACTBARCODE},
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
   final_data.job_id = ary[0].ST_GRID_JOBNO,
   final_data.bar_code_job_no = ary[0].BARCODEJOBNO,
   final_data.comp_device = ary[0].ST_GRID_MATLID
   fetch_job_address(req,final_data);
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



function fetch_job_address(req,final_data) {
///////fetch_address_value
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
      "SELECT * FROM OM_SERMAS_DTL WHERE OM_SED_JOBNO = :ST_FLH_JOBNO and (om_sed_jobno,OM_SED_SFRDT) in (SELECT om_sed_jobno,MAX(OM_SED_SFRDT) from om_sermas_dtl group by om_sed_jobno)",
        {ST_FLH_JOBNO: final_data.job_id},
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
    final_data.customer_address =  ary[0].OM_SED_NAME +", "+ ary[0].OM_SED_ADDRESS1 +", "+ ary[0].OM_SED_ADDRESS2 +", "+ ary[0].OM_SED_ADDRESS3 +", "+  ary[0].OM_SED_ADDRESS4 +", "+ ary[0].OM_SED_APINCODE;
    final_data.install_address = ary[0].OM_SED_INSTADD1 +", "+ ary[0].OM_SED_INSTADD2 +", "+ ary[0].OM_SED_INSTADD3 +", "+ ary[0].OM_SED_LANDMARK+", "+ ary[0].OM_SED_IPINCODE;
    fetch_device_name(req,final_data);
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






function fetch_device_name(req,final_data){
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
      "SELECT CASE WHEN NVL(ST_PMH_CRITICALITEM ,0) = 0 THEN 'N' ELSE 'Y' END, st_pmh_partname , ST_PMH_BARCODEID FROM ST_PARTMAS_HDR WHERE ST_PMH_PARTNO =:ST_PMH_PARTNO",
        {ST_PMH_PARTNO: final_data.comp_device},
        {autoCommit: true},
        function (err, result) {
    if (err) { console.error(err.message);
          doRelease(connection);
          return;
     }
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
    final_data.comp_device_name = ary[0].ST_PMH_PARTNAME;
    final_data.malt_id = ary[0].ST_PMH_BARCODEID;
    res.json({Status:"Success",Message:"JOB DETAIL", Data : [final_data], Dropdown : faiure_final_datas, Code:200});
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






router.post('/failure_report/fetch_details_by_job', function (req, res) {
var final_data = {
   install_address : "",
   customer_address : "",
   job_id : req.body.job_id,
   status : "A",
   bar_code_job_no : req.body.job_id,
   comp_device : "NO NUM",
   comp_device_name : "NO NAME",
   malt_id : "NA",
   department : "T",
   serv_type : "F",
};

fetch_job_address(req,final_data);

function fetch_job_address(req,final_data) {
///////fetch_address_value
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
      "SELECT * FROM OM_SERMAS_DTL WHERE OM_SED_JOBNO = :ST_FLH_JOBNO and (om_sed_jobno,OM_SED_SFRDT) in (SELECT om_sed_jobno,MAX(OM_SED_SFRDT) from om_sermas_dtl group by om_sed_jobno)",
        {ST_FLH_JOBNO: req.body.job_id},
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
    final_data.customer_address =  ary[0].OM_SED_NAME +", "+ ary[0].OM_SED_ADDRESS1 +", "+ ary[0].OM_SED_ADDRESS2 +", "+ ary[0].OM_SED_ADDRESS3 +", "+  ary[0].OM_SED_ADDRESS4 +", "+ ary[0].OM_SED_APINCODE;
    final_data.install_address = ary[0].OM_SED_INSTADD1 +", "+ ary[0].OM_SED_INSTADD2 +", "+ ary[0].OM_SED_INSTADD3 +", "+ ary[0].OM_SED_LANDMARK+", "+ ary[0].OM_SED_IPINCODE;
    res.json({Status:"Success",Message:"JOB DETAIL", Data : [final_data] , Dropdown:faiure_final_datas, Code:200});
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




router.post('/failure_report/fetch_details_by_com_id', function (req, res) {

 final_data = {
   comp_device_name : "NO NAME",
   malt_id : "NA",
};


fetch_device_name(req,final_data);

function fetch_device_name(req,final_data){
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
      "SELECT CASE WHEN NVL(ST_PMH_CRITICALITEM ,0) = 0 THEN 'N' ELSE 'Y' END, st_pmh_partname , ST_PMH_BARCODEID FROM ST_PARTMAS_HDR WHERE ST_PMH_PARTNO =:ST_PMH_PARTNO",
        {ST_PMH_PARTNO: req.body.comp_device_no},
        {autoCommit: true},
        function (err, result) {
    if (err) { console.error(err.message);
          doRelease(connection);
          return;
     }
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
    final_data.comp_device_name = ary[0].ST_PMH_PARTNAME;
    final_data.malt_id = ary[0].ST_PMH_BARCODEID;
    res.json({Status:"Success",Message:"JOB DETAIL", Data : [final_data],Code:200});
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


router.post('/failure_report/comp_device_list', function (req, res) {
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
      "SELECT ST_PMH_PARTNAME,ST_PMH_PARTNO, ST_PMH_COMPPARTNO, ST_PMH_DRAWINGNO,ST_PMH_OLDPART , ST_PMH_BARCODEID FROM ST_PARTMAS_HDR WHERE ST_PMH_PARTNATURE NOT IN('OS','RM','AS','HW','M1','SH','IS') AND ((ST_PMH_COMPPARTNO IS NOT NULL AND ((SUBSTR(ST_PMH_COMPPARTNO,1,3) IN ('001','002','003','998')) OR SUBSTR(ST_PMH_COMPPARTNO,1,7) = '400 401') ) OR ST_PMH_COMPPARTNO IS NULL) AND SUBSTR(:ST_FLH_JOBNO,1,1)='E' AND ST_PMH_REPMATL in ( 'Y','S') UNION ALL SELECT ST_PMH_PARTNAME,ST_PMH_PARTNO, ST_PMH_COMPPARTNO, ST_PMH_DRAWINGNO,ST_PMH_OLDPART , ST_PMH_BARCODEID FROM ST_PARTMAS_HDR WHERE ST_PMH_PARTNATURE NOT IN('OS','RM','AS','HW','M1','SH','IS') AND ((ST_PMH_COMPPARTNO IS NOT NULL AND SUBSTR(ST_PMH_COMPPARTNO,1,3) NOT IN ('001','002','003','998')) OR ST_PMH_COMPPARTNO IS NULL) AND SUBSTR(:ST_FLH_JOBNO,1,1)='L' AND ST_PMH_REPMATL in ( 'Y','S') ORDER BY 3",
        {ST_FLH_JOBNO : req.body.job_id},
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
    res.json({Status:"Success",Message:"Comp Device List", Data : ary,Code:200});
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



router.get('/failure_report/drop_down', function (req, res) {
res.json({Status:"Success",Message:"Failure report DropDown", Data : faiure_final_datas ,Code:200});
});

/////////////////////////// FAILURE REPORT FORM /////////////////////////////////////////

/////////////////////////// ROPE MAINTENANCE FORM /////////////////////////////////////////

router.post('/rope_maintenance/create', async function(req, res) {


var JLS_MWK_ACTCODE1 = '';
var JLS_MWK_ACTCODE2 = '';
var JLS_MWK_ACTCODE3 = '';

if(req.body.activity_code_list.length = 1){
    if(req.body.activity_code_list[0] == 'Rope Alignment'){
        JLS_MWK_ACTCODE1 = 'ROPALI';
    }
    if(req.body.activity_code_list[0] == 'Rope Lubrication'){
        JLS_MWK_ACTCODE1 = 'ROPLUB';
    }
    if(req.body.activity_code_list[0] == 'Rope Cleaning'){
        JLS_MWK_ACTCODE1 = 'ROPCLE';
    }
}  

if(req.body.activity_code_list.length = 2){
    if(req.body.activity_code_list[0] == 'Rope Alignment'){
        JLS_MWK_ACTCODE1 = 'ROPALI';
    }
    if(req.body.activity_code_list[0] == 'Rope Lubrication'){
        JLS_MWK_ACTCODE1 = 'ROPLUB';
    }
    if(req.body.activity_code_list[0] == 'Rope Cleaning'){
        JLS_MWK_ACTCODE1 = 'ROPCLE';
    }
    if(req.body.activity_code_list[1] == 'Rope Alignment'){
        JLS_MWK_ACTCODE2 = 'ROPALI';
    }
    if(req.body.activity_code_list[2] == 'Rope Lubrication'){
        JLS_MWK_ACTCODE2 = 'ROPLUB';
    }
    if(req.body.activity_code_list[3] == 'Rope Cleaning'){
        JLS_MWK_ACTCODE2 = 'ROPCLE';
    }
}

if(req.body.activity_code_list.length = 3){
    if(req.body.activity_code_list[0] == 'Rope Alignment'){
        JLS_MWK_ACTCODE1 = 'ROPALI';
    }
    if(req.body.activity_code_list[0] == 'Rope Lubrication'){
        JLS_MWK_ACTCODE1 = 'ROPLUB';
    }
    if(req.body.activity_code_list[0] == 'Rope Cleaning'){
        JLS_MWK_ACTCODE1 = 'ROPCLE';
    }
    if(req.body.activity_code_list[1] == 'Rope Alignment'){
        JLS_MWK_ACTCODE2 = 'ROPALI';
    }
    if(req.body.activity_code_list[1] == 'Rope Lubrication'){
        JLS_MWK_ACTCODE2 = 'ROPLUB';
    }
    if(req.body.activity_code_list[1] == 'Rope Cleaning'){
        JLS_MWK_ACTCODE2 = 'ROPCLE';
    } 
    if(req.body.activity_code_list[2] == 'Rope Alignment'){
        JLS_MWK_ACTCODE3 = 'ROPALI';
    }
    if(req.body.activity_code_list[2] == 'Rope Lubrication'){
        JLS_MWK_ACTCODE3 = 'ROPLUB';
    }
    if(req.body.activity_code_list[2] == 'Rope Cleaning'){
        JLS_MWK_ACTCODE3 = 'ROPCLE';
    }
}


if(req.body.main_rope_dia == '6 MM'){
    JLS_MWK_MAINROPE = 'RO06';
}
else if(req.body.main_rope_dia == '8 MM'){
    JLS_MWK_MAINROPE = 'RO05';
}
else if(req.body.main_rope_dia == '10 MM'){
    JLS_MWK_MAINROPE = 'RO02';
}
else if(req.body.main_rope_dia == '13 MM'){
    JLS_MWK_MAINROPE = 'RO03';
}
else if(req.body.main_rope_dia == '16 MM'){
    JLS_MWK_MAINROPE = 'RO04';
}

if(req.body.osg_rope_dia == '6 MM'){
   JLS_MWK_OSGROPE = 'RO06';
}
else if(req.body.osg_rope_dia == '8 MM'){
   JLS_MWK_OSGROPE = 'RO05';
}


  try{
        await add_rope_maintenanceModel.create({
  job_id : req.body.job_id,
  building_name : req.body.building_name,
  machine_type : req.body.machine_type,
  main_rope_dia : req.body.main_rope_dia,
  osg_rope_dia : req.body.osg_rope_dia,
  activity_code : req.body.activity_code,
  activity_code_list : req.body.activity_code_list,
  tech_name : req.body.tech_name,
  tech_code : req.body.tech_code,
  activity_date : req.body.activity_date,
  remarks : req.body.remarks,
  submitted_by_emp_code : req.body.submitted_by_emp_code,
  submitted_by_num : req.body.submitted_by_num,
  submitted_by_name : req.body.submitted_by_name,
  submitted_by_on : req.body.submitted_by_on,
  delete_status : false
         }, 
        function (err, user) {
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

  "JLS_MWK_JOBNO"     : ""+req.body.job_id || "",
  "JLS_MWK_SITENAME"  : ""+req.body.building_name || "",
  "JLS_MWK_TYPMC"     : ""+req.body.machine_type || "",
  "JLS_MWK_PREPBY"    : ""+req.body.submitted_by_emp_code || "",
  "JLS_MWK_PREPDT"    : ""+req.body.submitted_by_on || "",
  "JLS_MWK_MAINROPE"  : ""+JLS_MWK_MAINROPE || "",
  "JLS_MWK_OSGROPE"   : ""+JLS_MWK_OSGROPE || "",
  "JLS_MWK_ACTCODE1"  : ""+JLS_MWK_ACTCODE1 || "",
  "JLS_MWK_ACTCODE2"  : ""+JLS_MWK_ACTCODE2 || "",
  "JLS_MWK_ACTCODE3"  : ""+JLS_MWK_ACTCODE3 || "",
  "JLS_MWK_TECHNAME"  : ""+req.body.tech_name || "",
  "JLS_MWK_ACTDATE"   : ""+req.body.activity_date || "",
  "JLS_MWK_REMARK"    : ""+req.body.remarks || "",

    }
      connection.execute(
            "INSERT INTO JLS_MECHWRK_DTL ( JLS_MWK_JOBNO, JLS_MWK_SITENAME, JLS_MWK_TYPMC, JLS_MWK_PREPBY, JLS_MWK_PREPDT, JLS_MWK_MAINROPE, JLS_MWK_OSGROPE, JLS_MWK_ACTCODE1, JLS_MWK_ACTCODE2, JLS_MWK_ACTCODE3, JLS_MWK_TECHNAME, JLS_MWK_ACTDATE, JLS_MWK_REMARK ) VALUES ( :JLS_MWK_JOBNO, :JLS_MWK_SITENAME, :JLS_MWK_TYPMC, :JLS_MWK_PREPBY, :JLS_MWK_PREPDT, :JLS_MWK_MAINROPE, :JLS_MWK_OSGROPE, :JLS_MWK_ACTCODE1, :JLS_MWK_ACTCODE2, :JLS_MWK_ACTCODE3, :JLS_MWK_TECHNAME, :JLS_MWK_ACTDATE, :JLS_MWK_REMARK )",
              da, // Bind values
              { autoCommit: true}, 
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
        });
}
catch(e){
      res.json({Status:"Failed",Message:"Internal Server Error", Data : {},Code:500});
}
});


router.get('/rope_maintenance/getlist', function (req, res) {
        add_rope_maintenanceModel.find({}, function (err, Functiondetails) {
          res.json({Status:"Success",Message:"Failure Report Data", Data : Functiondetails ,Code:200});
        });
});


router.post('/rope_maintenance/check_data', function (req, res) {
        add_rope_maintenanceModel.findOne({ job_id : req.body.job_id, submitted_by_on : req.body.submitted_by_on, submitted_by_num : req.body.submitted_by_num }, function (err, StateList) {
            if(StateList == null){
                res.json({Status:"Success",Message:"No Record Found", Data : {} ,Code:404});
            }else {
                res.json({Status:"Success",Message:"Already you have submitted the data", Data : {} ,Code:200});
            }
        });
});



/////////////////////////// ROPE MAINTENANCE FORM /////////////////////////////////////////





/////////////////////////// SAFETY AUDIT /////////////////////////////////////////



router.post('/safety_audit/create', async function(req, res) {
    try{
          await add_safety_auditModel.create({
    "job_id": req.body.job_id,
    "SA01" : req.body.SA01,
    "SA02" : req.body.SA02,
    "SA03" : req.body.SA03,
    "SA04" : req.body.SA04,
    "SA05" : req.body.SA05,
    "SA06" : req.body.SA06,
    "SA07" : req.body.SA07,
    "SA08" : req.body.SA08,
    "SA09" : req.body.SA09,
    "SA10" : req.body.SA10,
    "SA11" : req.body.SA11,
    "SA12" : req.body.SA12,
    "SA13" : req.body.SA13,
    "SA14" : req.body.SA14,
    "SA15" : req.body.SA15,
    "SA16" : req.body.SA16,
    "SA17" : req.body.SA17,
    "SA18" : req.body.SA18,
    "SA19" : req.body.SA19,
    "SA20" : req.body.SA20,
    "SA21" : req.body.SA21,
    "SA22" : req.body.SA22,
    "SA23" : req.body.SA23,
    "SA24" : req.body.SA24,
    "SA25" : req.body.SA25,
    "SA26" : req.body.SA26,
    "SA27" : req.body.SA27,
    "SA28" : req.body.SA28,
    "SA29" : req.body.SA29,
    "SA30" : req.body.SA30,
    "SA31" : req.body.SA31,
    "SA32" : req.body.SA32,
    "SA33" : req.body.SA33,
    "SA34" : req.body.SA34,
    "SA35" : req.body.SA35,
    "SA36" : req.body.SA36,
    "SA37" : req.body.SA37,
    "SA38" : req.body.SA38,
    "SA39" : req.body.SA39,
    "SA40" : req.body.SA40,
    "remarks" : req.body.remarks,
    "Total_marks" : 0,
    "submitted_by_num" : req.body.submitted_by_num,
    "submitted_by_name" : req.body.submitted_by_name,
    "submitted_by_emp_code" : req.body.submitted_by_emp_code,
    "submitted_by_on" : req.body.submitted_by_on,
    "observation_a" : req.body.observation_a,
    "observation_b" : req.body.observation_b,
    "observation_c" : req.body.observation_c,
    "observation_d" : req.body.observation_d,
    "general_comment" : req.body.general_comment,
    "engineer_name" : req.body.engineer_name,
    "conducted_on" : req.body.conducted_on,
    "engineer_signature" : req.body.engineer_signature,
    delete_status : false
    }, 
    function (err, user){
     var code_value = [
        {
            JLS_OSFAD_SLNO : 1,
            JLS_OSFAD_ACODE : "SA01",//CAM_ATY_CODE
            JLS_OSFAD_PACODE : "I",//CAM_ATY_PCODE
            JLS_OSFAD_AUDDATE : req.body.conducted_on,
            JLS_OSFAD_BRCODE : req.body.brcode,
            JLS_OSFAD_JOBNO : req.body.job_id,
            JLS_OSFAD_RATING : req.body.SA01, //A/B/C/D
            JLS_OSFAD_SCORE : 0
        },
        {
            JLS_OSFAD_SLNO : 2,
            JLS_OSFAD_ACODE : "SA02",
            JLS_OSFAD_PACODE : "I",
            JLS_OSFAD_AUDDATE : req.body.conducted_on,
            JLS_OSFAD_BRCODE : req.body.brcode,
            JLS_OSFAD_JOBNO : req.body.job_id,
            JLS_OSFAD_RATING : req.body.SA02, //A/B/C/D
            JLS_OSFAD_SCORE : 0
        },
        {
             JLS_OSFAD_SLNO : 3,
            JLS_OSFAD_ACODE : "SA03",
            JLS_OSFAD_PACODE : "I",
            JLS_OSFAD_AUDDATE : req.body.conducted_on,
            JLS_OSFAD_BRCODE : req.body.brcode,
            JLS_OSFAD_JOBNO : req.body.job_id,
            JLS_OSFAD_RATING : req.body.SA03, //A/B/C/D
            JLS_OSFAD_SCORE : 0
        },
        {
             JLS_OSFAD_SLNO : 4,
            JLS_OSFAD_ACODE : "SA04",
            JLS_OSFAD_PACODE : "II",
            JLS_OSFAD_AUDDATE : req.body.conducted_on,
            JLS_OSFAD_BRCODE : req.body.brcode,
            JLS_OSFAD_JOBNO : req.body.job_id,
            JLS_OSFAD_RATING : req.body.SA04, //A/B/C/D
            JLS_OSFAD_SCORE : 0
        },
        {
             JLS_OSFAD_SLNO : 5,
            JLS_OSFAD_ACODE : "SA05",
            JLS_OSFAD_PACODE : "II",
            JLS_OSFAD_AUDDATE : req.body.conducted_on,
            JLS_OSFAD_BRCODE : req.body.brcode,
            JLS_OSFAD_JOBNO : req.body.job_id,
            JLS_OSFAD_RATING : req.body.SA05, //A/B/C/D
            JLS_OSFAD_SCORE : 0
        },
        {
             JLS_OSFAD_SLNO : 6,
            JLS_OSFAD_ACODE : "SA06",
            JLS_OSFAD_PACODE : "II",
            JLS_OSFAD_AUDDATE : req.body.conducted_on,
            JLS_OSFAD_BRCODE : req.body.brcode,
            JLS_OSFAD_JOBNO : req.body.job_id,
            JLS_OSFAD_RATING : req.body.SA06, //A/B/C/D
            JLS_OSFAD_SCORE : 0
        },
        {
             JLS_OSFAD_SLNO : 7,
            JLS_OSFAD_ACODE : "SA07",
            JLS_OSFAD_PACODE : "II",
            JLS_OSFAD_AUDDATE : req.body.conducted_on,
            JLS_OSFAD_BRCODE : req.body.brcode,
            JLS_OSFAD_JOBNO : req.body.job_id,
            JLS_OSFAD_RATING : req.body.SA07, //A/B/C/D
            JLS_OSFAD_SCORE : 0
        },
        {
             JLS_OSFAD_SLNO : 8,
            JLS_OSFAD_ACODE : "SA08",
            JLS_OSFAD_PACODE : "II",
            JLS_OSFAD_AUDDATE : req.body.conducted_on,
            JLS_OSFAD_BRCODE : req.body.brcode,
            JLS_OSFAD_JOBNO : req.body.job_id,
            JLS_OSFAD_RATING : req.body.SA08, //A/B/C/D
            JLS_OSFAD_SCORE : 0
        },
        {
             JLS_OSFAD_SLNO : 9,
            JLS_OSFAD_ACODE : "SA09",
            JLS_OSFAD_PACODE : "II",
            JLS_OSFAD_AUDDATE : req.body.conducted_on,
            JLS_OSFAD_BRCODE : req.body.brcode,
            JLS_OSFAD_JOBNO : req.body.job_id,
            JLS_OSFAD_RATING : req.body.SA09, //A/B/C/D
            JLS_OSFAD_SCORE : 0
        },
        {
             JLS_OSFAD_SLNO : 10,
            JLS_OSFAD_ACODE : "SA10",
            JLS_OSFAD_PACODE : "II",
            JLS_OSFAD_AUDDATE : req.body.conducted_on,
            JLS_OSFAD_BRCODE : req.body.brcode,
            JLS_OSFAD_JOBNO : req.body.job_id,
            JLS_OSFAD_RATING : req.body.SA10, //A/B/C/D
            JLS_OSFAD_SCORE : 0
        },
        {
             JLS_OSFAD_SLNO : 11,
            JLS_OSFAD_ACODE : "SA11",
            JLS_OSFAD_PACODE : "II",
            JLS_OSFAD_AUDDATE : req.body.conducted_on,
            JLS_OSFAD_BRCODE : req.body.brcode,
            JLS_OSFAD_JOBNO : req.body.job_id,
            JLS_OSFAD_RATING : req.body.SA11, //A/B/C/D
            JLS_OSFAD_SCORE : 0
        },
        {
             JLS_OSFAD_SLNO : 12,
            JLS_OSFAD_ACODE : "SA12",
            JLS_OSFAD_PACODE : "II",
            JLS_OSFAD_AUDDATE : req.body.conducted_on,
            JLS_OSFAD_BRCODE : req.body.brcode,
            JLS_OSFAD_JOBNO : req.body.job_id,
            JLS_OSFAD_RATING : req.body.SA12, //A/B/C/D
            JLS_OSFAD_SCORE : 0
        },
        {
             JLS_OSFAD_SLNO : 13,
            JLS_OSFAD_ACODE : "SA13",
            JLS_OSFAD_PACODE : "II",
            JLS_OSFAD_AUDDATE : req.body.conducted_on,
            JLS_OSFAD_BRCODE : req.body.brcode,
            JLS_OSFAD_JOBNO : req.body.job_id,
            JLS_OSFAD_RATING : req.body.SA13, //A/B/C/D
            JLS_OSFAD_SCORE : 0
        },
        {
             JLS_OSFAD_SLNO : 14,
            JLS_OSFAD_ACODE : "SA14",
            JLS_OSFAD_PACODE : "II",
            JLS_OSFAD_AUDDATE : req.body.conducted_on,
            JLS_OSFAD_BRCODE : req.body.brcode,
            JLS_OSFAD_JOBNO : req.body.job_id,
            JLS_OSFAD_RATING : req.body.SA14, //A/B/C/D
            JLS_OSFAD_SCORE : 0
        },
        {
             JLS_OSFAD_SLNO : 15,
            JLS_OSFAD_ACODE : "SA15",
            JLS_OSFAD_PACODE : "II",
            JLS_OSFAD_AUDDATE : req.body.conducted_on,
            JLS_OSFAD_BRCODE : req.body.brcode,
            JLS_OSFAD_JOBNO : req.body.job_id,
            JLS_OSFAD_RATING : req.body.SA15, //A/B/C/D
            JLS_OSFAD_SCORE : 0
        },
        {
             JLS_OSFAD_SLNO : 16,
            JLS_OSFAD_ACODE : "SA16",
            JLS_OSFAD_PACODE : "II",
            JLS_OSFAD_AUDDATE : req.body.conducted_on,
            JLS_OSFAD_BRCODE : req.body.brcode,
            JLS_OSFAD_JOBNO : req.body.job_id,
            JLS_OSFAD_RATING : req.body.SA16, //A/B/C/D
            JLS_OSFAD_SCORE : 0
        },
        {
             JLS_OSFAD_SLNO : 17,
            JLS_OSFAD_ACODE : "SA17",
            JLS_OSFAD_PACODE : "III",
            JLS_OSFAD_AUDDATE : req.body.conducted_on,
            JLS_OSFAD_BRCODE : req.body.brcode,
            JLS_OSFAD_JOBNO : req.body.job_id,
            JLS_OSFAD_RATING : req.body.SA17, //A/B/C/D
            JLS_OSFAD_SCORE : 0
        },
        {
             JLS_OSFAD_SLNO : 18,
            JLS_OSFAD_ACODE : "SA18",
            JLS_OSFAD_PACODE : "III",
            JLS_OSFAD_AUDDATE : req.body.conducted_on,
            JLS_OSFAD_BRCODE : req.body.brcode,
            JLS_OSFAD_JOBNO : req.body.job_id,
            JLS_OSFAD_RATING : req.body.SA18, //A/B/C/D
            JLS_OSFAD_SCORE : 0
        },
        {
             JLS_OSFAD_SLNO : 19,
            JLS_OSFAD_ACODE : "SA19",
            JLS_OSFAD_PACODE : "III",
            JLS_OSFAD_AUDDATE : req.body.conducted_on,
            JLS_OSFAD_BRCODE : req.body.brcode,
            JLS_OSFAD_JOBNO : req.body.job_id,
            JLS_OSFAD_RATING : req.body.SA19, //A/B/C/D
            JLS_OSFAD_SCORE : 0
        },
        {
             JLS_OSFAD_SLNO : 20,
            JLS_OSFAD_ACODE : "SA20",
            JLS_OSFAD_PACODE : "III",
            JLS_OSFAD_AUDDATE : req.body.conducted_on,
            JLS_OSFAD_BRCODE : req.body.brcode,
            JLS_OSFAD_JOBNO : req.body.job_id,
            JLS_OSFAD_RATING : req.body.SA20, //A/B/C/D
            JLS_OSFAD_SCORE : 0
        },
        {
            JLS_OSFAD_SLNO : 21,
            JLS_OSFAD_ACODE : "SA21",
            JLS_OSFAD_PACODE : "III",
            JLS_OSFAD_AUDDATE : req.body.conducted_on,
            JLS_OSFAD_BRCODE : req.body.brcode,
            JLS_OSFAD_JOBNO : req.body.job_id,
            JLS_OSFAD_RATING : req.body.SA21, //A/B/C/D
            JLS_OSFAD_SCORE : 0
        },
        {
             JLS_OSFAD_SLNO : 22,
            JLS_OSFAD_ACODE : "SA22",
            JLS_OSFAD_PACODE : "III",
            JLS_OSFAD_AUDDATE : req.body.conducted_on,
            JLS_OSFAD_BRCODE : req.body.brcode,
            JLS_OSFAD_JOBNO : req.body.job_id,
            JLS_OSFAD_RATING : req.body.SA22, //A/B/C/D
            JLS_OSFAD_SCORE : 0
        },
        {
             JLS_OSFAD_SLNO : 23,
            JLS_OSFAD_ACODE : "SA23",
            JLS_OSFAD_PACODE : "IV",
            JLS_OSFAD_AUDDATE : req.body.conducted_on,
            JLS_OSFAD_BRCODE : req.body.brcode,
            JLS_OSFAD_JOBNO : req.body.job_id,
            JLS_OSFAD_RATING : req.body.SA23, //A/B/C/D
            JLS_OSFAD_SCORE : 0
        },
        {
            JLS_OSFAD_SLNO : 24,
            JLS_OSFAD_ACODE : "SA24",
            JLS_OSFAD_PACODE : "IV",
            JLS_OSFAD_AUDDATE : req.body.conducted_on,
            JLS_OSFAD_BRCODE : req.body.brcode,
            JLS_OSFAD_JOBNO : req.body.job_id,
            JLS_OSFAD_RATING : req.body.SA24, //A/B/C/D
            JLS_OSFAD_SCORE : 0
        },
        {
            JLS_OSFAD_SLNO : 25,
            JLS_OSFAD_ACODE : "SA25",
            JLS_OSFAD_PACODE : "IV",
            JLS_OSFAD_AUDDATE : req.body.conducted_on,
            JLS_OSFAD_BRCODE : req.body.brcode,
            JLS_OSFAD_JOBNO : req.body.job_id,
            JLS_OSFAD_RATING : req.body.SA25, //A/B/C/D
            JLS_OSFAD_SCORE : 0
        },
        {
            JLS_OSFAD_SLNO : 26,
            JLS_OSFAD_ACODE : "SA26",
            JLS_OSFAD_PACODE : "IV",
            JLS_OSFAD_AUDDATE : req.body.conducted_on,
            JLS_OSFAD_BRCODE : req.body.brcode,
            JLS_OSFAD_JOBNO : req.body.job_id,
            JLS_OSFAD_RATING : req.body.SA26, //A/B/C/D
            JLS_OSFAD_SCORE : 0
        },
        {
            JLS_OSFAD_SLNO : 27,
            JLS_OSFAD_ACODE : "SA27",
            JLS_OSFAD_PACODE : "IV",
            JLS_OSFAD_AUDDATE : req.body.conducted_on,
            JLS_OSFAD_BRCODE : req.body.brcode,
            JLS_OSFAD_JOBNO : req.body.job_id,
            JLS_OSFAD_RATING : req.body.SA27, //A/B/C/D
            JLS_OSFAD_SCORE : 0
        },
        {
            JLS_OSFAD_SLNO : 28,
            JLS_OSFAD_ACODE : "SA28",
            JLS_OSFAD_PACODE : "IV",
            JLS_OSFAD_AUDDATE : req.body.conducted_on,
            JLS_OSFAD_BRCODE : req.body.brcode,
            JLS_OSFAD_JOBNO : req.body.job_id,
            JLS_OSFAD_RATING : req.body.SA28, //A/B/C/D
            JLS_OSFAD_SCORE : 0
        },
        {
            JLS_OSFAD_SLNO : 29,
            JLS_OSFAD_ACODE : "SA29",
            JLS_OSFAD_PACODE : "V",
            JLS_OSFAD_AUDDATE : req.body.conducted_on,
            JLS_OSFAD_BRCODE : req.body.brcode,
            JLS_OSFAD_JOBNO : req.body.job_id,
            JLS_OSFAD_RATING : req.body.SA29, //A/B/C/D
            JLS_OSFAD_SCORE : 0
        },
        {
            JLS_OSFAD_SLNO : 30,
            JLS_OSFAD_ACODE : "SA30",
            JLS_OSFAD_PACODE : "V",
            JLS_OSFAD_AUDDATE : req.body.conducted_on,
            JLS_OSFAD_BRCODE : req.body.brcode,
            JLS_OSFAD_JOBNO : req.body.job_id,
            JLS_OSFAD_RATING : req.body.SA30, //A/B/C/D
            JLS_OSFAD_SCORE : 0
        },
        {
            JLS_OSFAD_SLNO : 31,
            JLS_OSFAD_ACODE : "SA31",
            JLS_OSFAD_PACODE : "V",
            JLS_OSFAD_AUDDATE : req.body.conducted_on,
            JLS_OSFAD_BRCODE : req.body.brcode,
            JLS_OSFAD_JOBNO : req.body.job_id,
            JLS_OSFAD_RATING : req.body.SA31, //A/B/C/D
            JLS_OSFAD_SCORE : 0
        },
        {
            JLS_OSFAD_SLNO : 32,
            JLS_OSFAD_ACODE : "SA32",
            JLS_OSFAD_PACODE : "V",
            JLS_OSFAD_AUDDATE : req.body.conducted_on,
            JLS_OSFAD_BRCODE : req.body.brcode,
            JLS_OSFAD_JOBNO : req.body.job_id,
            JLS_OSFAD_RATING : req.body.SA32, //A/B/C/D
            JLS_OSFAD_SCORE : 0
        },
        {
            JLS_OSFAD_SLNO : 33,
            JLS_OSFAD_ACODE : "SA33",
            JLS_OSFAD_PACODE : "V",
            JLS_OSFAD_AUDDATE : req.body.conducted_on,
            JLS_OSFAD_BRCODE : req.body.brcode,
            JLS_OSFAD_JOBNO : req.body.job_id,
            JLS_OSFAD_RATING : req.body.SA33, //A/B/C/D
            JLS_OSFAD_SCORE : 0
        },
        {
            JLS_OSFAD_SLNO : 34,
            JLS_OSFAD_ACODE : "SA34",
            JLS_OSFAD_PACODE : "V",
            JLS_OSFAD_AUDDATE : req.body.conducted_on,
            JLS_OSFAD_BRCODE : req.body.brcode,
            JLS_OSFAD_JOBNO : req.body.job_id,
            JLS_OSFAD_RATING : req.body.SA34, //A/B/C/D
            JLS_OSFAD_SCORE : 0
        },
        {  
            JLS_OSFAD_SLNO : 35,
            JLS_OSFAD_ACODE : "SA35",
            JLS_OSFAD_PACODE : "VI",
            JLS_OSFAD_AUDDATE : req.body.conducted_on,
            JLS_OSFAD_BRCODE : req.body.brcode,
            JLS_OSFAD_JOBNO : req.body.job_id,
            JLS_OSFAD_RATING : req.body.SA35, //A/B/C/D
            JLS_OSFAD_SCORE : 0
        },
        {
            JLS_OSFAD_SLNO : 36,
            JLS_OSFAD_ACODE : "SA36",
            JLS_OSFAD_PACODE : "VI",
            JLS_OSFAD_AUDDATE : req.body.conducted_on,
            JLS_OSFAD_BRCODE : req.body.brcode,
            JLS_OSFAD_JOBNO : req.body.job_id,
            JLS_OSFAD_RATING : req.body.SA36, //A/B/C/D
            JLS_OSFAD_SCORE : 0
        },
        {
            JLS_OSFAD_SLNO : 37,
            JLS_OSFAD_ACODE : "SA37",
            JLS_OSFAD_PACODE : "VI",
            JLS_OSFAD_AUDDATE : req.body.conducted_on,
            JLS_OSFAD_BRCODE : req.body.brcode,
            JLS_OSFAD_JOBNO : req.body.job_id,
            JLS_OSFAD_RATING : req.body.SA37, //A/B/C/D
            JLS_OSFAD_SCORE : 0
        },
        {
            JLS_OSFAD_SLNO : 38,
            JLS_OSFAD_ACODE : "SA38",
            JLS_OSFAD_PACODE : "VI",
            JLS_OSFAD_AUDDATE : req.body.conducted_on,
            JLS_OSFAD_BRCODE : req.body.brcode,
            JLS_OSFAD_JOBNO : req.body.job_id,
            JLS_OSFAD_RATING : req.body.SA38, //A/B/C/D
            JLS_OSFAD_SCORE : 0
        },
        {
            JLS_OSFAD_SLNO : 39,
            JLS_OSFAD_ACODE : "SA39",
            JLS_OSFAD_PACODE : "VI",
            JLS_OSFAD_AUDDATE : req.body.conducted_on,
            JLS_OSFAD_BRCODE : req.body.brcode,
            JLS_OSFAD_JOBNO : req.body.job_id,
            JLS_OSFAD_RATING : req.body.SA39, //A/B/C/D
            JLS_OSFAD_SCORE : 0
        },
        {
            JLS_OSFAD_SLNO : 40,
            JLS_OSFAD_ACODE : "SA40",
            JLS_OSFAD_PACODE : "VI",
            JLS_OSFAD_AUDDATE : req.body.conducted_on,
            JLS_OSFAD_BRCODE : req.body.brcode,
            JLS_OSFAD_JOBNO : req.body.job_id,
            JLS_OSFAD_RATING : req.body.SA40, //A/B/C/D
            JLS_OSFAD_SCORE : 0
        }
    ];
    var index = 0;
    recall(index,code_value);
    function recall(index,code_value){
        if(index < code_value.length){
         var values = code_value[index];
          if(values.JLS_OSFAD_RATING == 'A'){
              values.JLS_OSFAD_SCORE = 0;
          }else if(values.JLS_OSFAD_RATING == 'B'){
              values.JLS_OSFAD_SCORE = 1;
          }else if(values.JLS_OSFAD_RATING == 'C'){
              values.JLS_OSFAD_SCORE = 1.5;
          }else if(values.JLS_OSFAD_RATING == 'D'){
              values.JLS_OSFAD_SCORE = 2.5;
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
 let da = values;
      connection.execute(
            "INSERT INTO JLS_SAFEAUDIT_DTL (JLS_OSFAD_AUDDATE, JLS_OSFAD_BRCODE, JLS_OSFAD_JOBNO, JLS_OSFAD_SLNO, JLS_OSFAD_ACODE, JLS_OSFAD_PACODE, JLS_OSFAD_RATING, JLS_OSFAD_SCORE ) VALUES ( :JLS_OSFAD_AUDDATE, :JLS_OSFAD_BRCODE, :JLS_OSFAD_JOBNO, :JLS_OSFAD_SLNO, :JLS_OSFAD_ACODE, :JLS_OSFAD_PACODE, :JLS_OSFAD_RATING, :JLS_OSFAD_SCORE )",
              da, // Bind values
              { autoCommit: true}, 
        function (err, result) {
    if (err) { console.error(err.message);
          doRelease(connection);
          return;
     }
     index = index + 1;
     recall(index,code_value);
     // res.json({Status:"Success",Message:"Added successfully", Data : {} ,Code:200}); 
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
        oracledb.getConnection({
                  user: "JLSMART",
                  password: "JLSMART",
                  connectString: "(DESCRIPTION =(ADDRESS = (PROTOCOL = TCP)(HOST = 192.168.1.112)(PORT = 1521))(CONNECT_DATA =(SID = jlpl)))"
            }, function(err, connection) {
            if (err) {
                console.error(err.message);
                return;
            }
             let da = {
             JLS_OSFA_AUDDATE : req.body.conducted_on,
             JLS_OSFA_BRCODE : req.body.brcode,
             JLS_OSFA_JOBNO : req.body.job_id,
             JLS_OSFA_AUDITORNAME : req.body.mech_code, // Submmited by
             JLS_OSFA_SITENAME : req.body.site_name,
             JLS_OSFA_ENGRCODE : req.body.tech_code, // Submmited by
             JLS_OSFA_SERMGRCODE : req.body.zonal_code, // Submmited by
             JLS_OSFA_WORKCOMPBY : req.body.submitted_by_emp_code, // Submmited by
             JLS_OSFA_WORKCOMPDT : req.body.conducted_on,
             JLS_OSFA_AREMARK : req.body.observation_a,
             JLS_OSFA_BREMARK : req.body.observation_b,
             JLS_OSFA_CREMARK : req.body.observation_c,
             JLS_OSFA_DREMARK : req.body.observation_d,
             JLS_OSFA_STATUS : "A",
             JLS_OSFA_PREPBY : req.body.submitted_by_emp_code,
             JLS_OSFA_PREPDT : req.body.conducted_on
             };
                  connection.execute(
                        "INSERT INTO JLS_SAFEAUDIT_HDR ( JLS_OSFA_AUDDATE, JLS_OSFA_BRCODE, JLS_OSFA_JOBNO, JLS_OSFA_AUDITORNAME, JLS_OSFA_SITENAME, JLS_OSFA_ENGRCODE, JLS_OSFA_SERMGRCODE, JLS_OSFA_WORKCOMPBY, JLS_OSFA_WORKCOMPDT, JLS_OSFA_AREMARK, JLS_OSFA_BREMARK, JLS_OSFA_CREMARK, JLS_OSFA_DREMARK, JLS_OSFA_STATUS, JLS_OSFA_PREPBY, JLS_OSFA_PREPDT ) VALUES ( :JLS_OSFA_AUDDATE, :JLS_OSFA_BRCODE, :JLS_OSFA_JOBNO, :JLS_OSFA_AUDITORNAME, :JLS_OSFA_SITENAME, :JLS_OSFA_ENGRCODE, :JLS_OSFA_SERMGRCODE, :JLS_OSFA_WORKCOMPBY, :JLS_OSFA_WORKCOMPDT, :JLS_OSFA_AREMARK, :JLS_OSFA_BREMARK, :JLS_OSFA_CREMARK, :JLS_OSFA_DREMARK, :JLS_OSFA_STATUS, :JLS_OSFA_PREPBY, :JLS_OSFA_PREPDT )",
                          da, // Bind values
                          { autoCommit: true}, 
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
    }
});
}
catch(e){
      res.json({Status:"Failed",Message:"Internal Server Error", Data : {},Code:500});
}
});




router.post('/safety_audit/check_data', function (req, res) {
        add_safety_auditModel.findOne({ job_id : req.body.job_id, conducted_on : req.body.conducted_on, submitted_by_num : req.body.submitted_by_num }, function (err, StateList) {
            if(StateList == null){
                res.json({Status:"Success",Message:"No Record Found", Data : {} ,Code:404});
            }else {
                res.json({Status:"Success",Message:"Already you have submitted the data", Data : {} ,Code:200});
            }
        });
});


/////////////////////////// SAFETY AUDIT /////////////////////////////////////////






/////////////////////////// REPAIR WORK REQEUST  /////////////////////////////////////////

//////STAGE - 1/////////


router.post('/repair_work_request_temp/create', async function(req, res) {
  try{
        await add_repair_work_request_tempModel.create({
  request_on : req.body.request_on,
  job_id :  req.body.job_id,
  site_name : req.body.site_name,
  br_code : req.body.br_code,
  route : req.body.route,
  status : "RE Approval Pending",
  mat_available_sts : req.body.mat_available_sts,
  remarks : req.body.remarks,
  tech_name : req.body.tech_name,
  tech_code :  req.body.tech_code,
  submitted_by_emp_code : req.body.submitted_by_emp_code,
  submitted_by_num : req.body.submitted_by_num,
  submitted_by_name : req.body.submitted_by_name,
  submitted_by_on : req.body.submitted_by_on,
  repair_work_eng_id : "",
  repair_work_eng_phone : "",
  repair_work_eng_name : "",
  repair_work_eng_date : "",
  delete_status : false

         }, 
        function (err, user) {
        res.json({Status:"Success",Message:"Added successfully", Data : {} ,Code:200}); 
        });
}
catch(e){
      res.json({Status:"Failed",Message:"Internal Server Error", Data : {},Code:500});
}
});


router.post('/repair_work_request_temp/fetch_list_tech_id', function (req, res) {
        add_repair_work_request_tempModel.find({submitted_by_emp_code :  req.body.tech_code}, function (err, Functiondetails) {
          res.json({Status:"Success",Message:"Repair work request temp Data",Data : Functiondetails ,Code:200});
        }).sort({"_id":-1});
});


router.post('/repair_work_request_temp/fetch_list_eng_id', function (req, res) {
        add_repair_work_request_tempModel.find({tech_code :  req.body.eng_code}, function (err, Functiondetails) {
          res.json({Status:"Success",Message:"Repair work request temp Data",Data : Functiondetails ,Code:200});
        }).sort({"_id":-1});
});



router.post('/repair_work_request_temp/branch_head/fetch_list_eng_id', function (req, res) {
        add_repair_work_request_tempModel.find({br_code :  req.body.br_code}, function (err, Functiondetails) {
          res.json({Status:"Success",Message:"Repair work request temp Data",Data : Functiondetails ,Code:200});
        }).sort({"_id":-1});
});



router.get('/repair_work_request_temp/deletes', function (req, res) {
      add_repair_work_request_tempModel.remove({}, function (err, user) {
          if (err) return res.status(500).send("There was a problem deleting the user.");
             res.json({Status:"Success",Message:"repair work request temp Deleted", Data : {} ,Code:200});     
      });
});


router.get('/repair_work_request_temp/getlist', function (req, res) {
        add_repair_work_request_tempModel.find({}, function (err, Functiondetails) {
          res.json({Status:"Success",Message:"Failure Report Data", Data : Functiondetails ,Code:200});
        });
});



router.post('/repair_work_request_temp/edit', function (req, res) {
        add_repair_work_request_tempModel.findByIdAndUpdate(req.body._id, req.body, {new: true}, function (err, UpdatedDetails) {
            if (err) return res.json({Status:"Failed",Message:"Internal Server Error", Data : {},Code:500});
             res.json({Status:"Success",Message:"Updated successfully", Data : UpdatedDetails ,Code:200});
        });
});


router.post('/repair_work_request_temp/mech/request', function (req, res) {
        add_repair_work_request_tempModel.find({repair_work_eng_id : req.body.rep_eng_code, "status": "RE APPROVED"}, function (err, Functiondetails) {
          res.json({Status:"Success",Message:"Repair work request temp Data",Data : Functiondetails ,Code:200});
        });
});



router.post('/repair_work_request_temp/mech/branch_head/request', function (req, res) {
        add_repair_work_request_tempModel.find({br_code : req.body.br_code, "status": "RE APPROVED"}, function (err, Functiondetails) {
          res.json({Status:"Success",Message:"Repair work request temp Data",Data : Functiondetails ,Code:200});
        });
});




router.post('/repair_work_request_temp/approval_request/create', async function(req, res) {
  try{
        await add_repair_work_requestModel.create({
  request_on : req.body.request_on,
  br_code :  req.body.br_code,
  rb_no : req.body.rb_no,
  route_code :  req.body.route_code,
  job_no :  req.body.job_no,
  customer_name :  req.body.customer_name,
  execution_by :  req.body.execution_by,
  service_type :  req.body.service_type,
  mech_id :  req.body.mech_id,
  mech_name :  req.body.mech_name,
  zonal_eng_id :  req.body.zonal_eng_id,
  zonal_eng_name :  req.body.zonal_eng_name,
  assistant_name :  req.body.assistant_name,
  branch_office_no :  req.body.branch_office_no,
  install_address :  req.body.install_address,
  nature_of_work_id :  req.body.nature_of_work_id,
  nature_of_work_name :  req.body.nature_of_work_name,
  nature_of_work_process_id :  req.body.nature_of_work_process_id,
  nature_of_work_process_name :  req.body.nature_of_work_process_name,
  other_process :  req.body.other_process,
  work_start_date :  req.body.work_start_date,
  work_expected_date :  req.body.work_expected_date,
  tech_trained :  req.body.tech_trained,
  man_power :  req.body.man_power,
  mr_no :  req.body.mr_no,
  material_available_site :  req.body.material_available_site,
  repair_toolkit :  req.body.repair_toolkit,
  first_aid_kit :  req.body.first_aid_kit,
  full_body_harness :  req.body.full_body_harness,
  hard_hat :  req.body.hard_hat,
  safety_shoes :  req.body.safety_shoes,
  hand_gloves : req.body.hand_gloves,
  chain_block_status : req.body.chain_block_status,
  chain_block_capacity : req.body.chain_block_capacity.substring(0,1),
  webbing_belt : req.body.webbing_belt,
  ladder_req : req.body.ladder_req,
  ms_pipe_req : req.body.ms_pipe_req,
  rebelling_clamp : req.body.rebelling_clamp,
  dshackle_req : req.body.dshackle_req,
  barricate_main_req : req.body.barricate_main_req,
  completed_date : req.body.completed_date,
  status : "JOB WORK ORDER CREATED",
  pref_id : req.body.pref_id,
  repair_work_mech_id : req.body.repair_work_mech_id,
  repair_work_mech_name : req.body.repair_work_mech_name,
  repair_work_mech_no : req.body.repair_work_mech_no,
  submitted_by_emp_code : req.body.submitted_by_emp_code,
  submitted_by_num : req.body.submitted_by_num,
  submitted_by_name : req.body.submitted_by_name,
  submitted_by_on : req.body.submitted_by_on,
  delete_status : false
         }, 
        function (err, user) {
        
        // res.json({Status:"Success",Message:"Added successfully", Data : {} ,Code:200}); 


        oracledb.getConnection({
              user: "JLSMART",
              password: "JLSMART",
              connectString: "(DESCRIPTION =(ADDRESS = (PROTOCOL = TCP)(HOST = 192.168.1.112)(PORT = 1521))(CONNECT_DATA =(SID = jlpl)))"
        }, function(err, connection) {
        if (err) {
            console.error(err.message);
            return;
        }
         let da = {
  JLS_BJD_BRDNO           :user.rb_no,
  JLS_BJD_JOBNO           :user.job_no,      
  JLS_BJD_BRCODE          :user.br_code,
  JLS_BJD_WORKNAT         :user.nature_of_work_name,
  JLS_BJD_WORKSTDATE      :user.work_start_date,    
  JLS_BJD_WORKEXPDATE     :user.work_expected_date,    
  JLS_BJD_TECHCODE        :user.mech_id,   
  JLS_BJD_TECHNAME        :user.mech_name,  
  JLS_BJD_TECHMOBILE      :123456789,
  JLS_BJD_TECHTRAINED     :user.tech_trained.substring(0,1),
  JLS_BJD_WORKPROCESS     :user.nature_of_work_process_name,
  JLS_BJD_ASSTECHNAME     :user.assistant_name,
  JLS_BJD_MANPOWER        :+user.man_power,  
  JLS_BJD_MRNO            :user.mr_no,    
  JLS_BJD_SITEMATL        :user.material_available_site.substring(0,1),
  JLS_BJD_REPTOOLKIT      :user.repair_toolkit.substring(0,1),  
  JLS_BJD_FIRSTAIDKIT     :user.first_aid_kit.substring(0,1),       
  JLS_BJD_CHAINBLOCKSTAT  :user.chain_block_status.substring(0,2),  
  JLS_BJD_CHAINBLOCKCAP   :user.chain_block_capacity.substring(0,1),  
  JLS_BJD_WOBLINGBELT     :user.webbing_belt,   
  JLS_BJD_LADDERREQD      :user.ladder_req,  
  JLS_BJD_MSPIPEREQD      :user.ms_pipe_req,    
  JLS_BJD_CLAMPREQD       :user.rebelling_clamp,    
  JLS_BJD_SHACKLEREQD     :user.dshackle_req,  
  JLS_BJD_BARRICADEREQD   :user.barricate_main_req, 
  JLS_BJD_PREPBY          :user.submitted_by_emp_code,    
  JLS_BJD_PREPDT          :user.submitted_by_on,    
  JLS_BJD_STATUS          :"A",
  JLS_BJD_FBH             :user.full_body_harness.substring(0,1),  
  JLS_BJD_HARDHAT         :user.hard_hat.substring(0,1),   
  JLS_BJD_SHOE            :user.safety_shoes.substring(0,1),  
  JLS_BJD_GLOVES          :user.hand_gloves.substring(0,1),  
  JLS_BJD_ZNAME           :user.zonal_eng_id,  
  JLS_BJD_ZMOBILE         :12345678990,
  JLS_BJD_OTHPROCESS      :user.other_process, 
  JLS_BJD_CONTYPE         :user.execution_by,  
  JLS_BJD_WORKNATCD       :user.nature_of_work_id,
  JLS_BJD_WORKPROCESSCD   :user.nature_of_work_process_id,
            }

            console.log(da);
              connection.execute(
                "INSERT INTO JLS_BRKDOWNJOB_DTL (JLS_BJD_BRDNO,JLS_BJD_JOBNO,JLS_BJD_BRCODE,JLS_BJD_WORKNAT,JLS_BJD_WORKSTDATE,JLS_BJD_WORKEXPDATE,JLS_BJD_TECHCODE,JLS_BJD_TECHNAME,JLS_BJD_TECHMOBILE,JLS_BJD_TECHTRAINED,JLS_BJD_WORKPROCESS,JLS_BJD_ASSTECHNAME,JLS_BJD_MANPOWER,JLS_BJD_MRNO,JLS_BJD_SITEMATL,JLS_BJD_REPTOOLKIT,JLS_BJD_FIRSTAIDKIT,JLS_BJD_CHAINBLOCKSTAT,JLS_BJD_CHAINBLOCKCAP,JLS_BJD_WOBLINGBELT,JLS_BJD_LADDERREQD,JLS_BJD_MSPIPEREQD,JLS_BJD_CLAMPREQD,JLS_BJD_SHACKLEREQD,JLS_BJD_BARRICADEREQD,JLS_BJD_PREPBY,JLS_BJD_PREPDT,JLS_BJD_STATUS,JLS_BJD_FBH,JLS_BJD_HARDHAT,JLS_BJD_SHOE,JLS_BJD_GLOVES,JLS_BJD_ZNAME,JLS_BJD_ZMOBILE,JLS_BJD_OTHPROCESS,JLS_BJD_CONTYPE,JLS_BJD_WORKNATCD,JLS_BJD_WORKPROCESSCD) VALUES ( :JLS_BJD_BRDNO, :JLS_BJD_JOBNO, :JLS_BJD_BRCODE, :JLS_BJD_WORKNAT, :JLS_BJD_WORKSTDATE, :JLS_BJD_WORKEXPDATE, :JLS_BJD_TECHCODE, :JLS_BJD_TECHNAME, :JLS_BJD_TECHMOBILE, :JLS_BJD_TECHTRAINED, :JLS_BJD_WORKPROCESS, :JLS_BJD_ASSTECHNAME, :JLS_BJD_MANPOWER, :JLS_BJD_MRNO, :JLS_BJD_SITEMATL, :JLS_BJD_REPTOOLKIT, :JLS_BJD_FIRSTAIDKIT, :JLS_BJD_CHAINBLOCKSTAT, :JLS_BJD_CHAINBLOCKCAP, :JLS_BJD_WOBLINGBELT, :JLS_BJD_LADDERREQD, :JLS_BJD_MSPIPEREQD, :JLS_BJD_CLAMPREQD, :JLS_BJD_SHACKLEREQD, :JLS_BJD_BARRICADEREQD, :JLS_BJD_PREPBY, :JLS_BJD_PREPDT, :JLS_BJD_STATUS, :JLS_BJD_FBH, :JLS_BJD_HARDHAT, :JLS_BJD_SHOE, :JLS_BJD_GLOVES, :JLS_BJD_ZNAME, :JLS_BJD_ZMOBILE, :JLS_BJD_OTHPROCESS, :JLS_BJD_CONTYPE, :JLS_BJD_WORKNATCD, :JLS_BJD_WORKPROCESSCD )",
                      da, // Bind values
                      { autoCommit: true}, 
                function (err, result) {
            if (err) {

                  console.error(err.message);
                  doRelease(connection);
                  res.json({Status:"Failed",Message:"This data already in Oracle table", Data : {} ,Code:404});
                  return;

             }

        let da = {
          "status": "JOB WORK ORDER CREATED"
         }
         add_repair_work_request_tempModel.findByIdAndUpdate(req.body.pref_id, da, {new: true}, function (err, UpdatedDetails) {
            if (err) return res.json({Status:"Failed",Message:"Internal Server Error", Data : {},Code:500});
             res.json({Status:"Success",Message:"Added successfully", Data : {} ,Code:200}); 
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
        });
}
catch(e){
      res.json({Status:"Failed",Message:"Internal Server Error", Data : {},Code:500});
}
});


router.get('/repair_work_request_temp/approval_request/getlist',async function (req, res) {
        add_repair_work_requestModel.find({},async function (err, Functiondetails) {        
          res.json({Status:"Success",Message:"repair work request temp approval request Data", Data : Functiondetails ,Code:200});
        });
});

router.post('/repair_work_request_temp/approval_request/delete',async function (req, res) {
        add_repair_work_requestModel.findByIdAndRemove(req.body._id, function (err, user) {
          if (err) return res.json({Status:"Failed",Message:"Internal Server Error", Data : {},Code:500});
          res.json({Status:"Success",Message:"Deleted successfully", Data : {} ,Code:200});
        });
});


router.post('/repair_work_request_temp/approval_request/getlist_by_rp_eng', function (req, res) {
        add_repair_work_requestModel.find({submitted_by_emp_code : req.body.repair_work_eng_id,  status : {$in : ["RW SITE WORK COMPLETED", "JOB WORK ORDER CREATED","RW JOB WORK FINISHED"]}}, function (err, Functiondetails) {
          res.json({Status:"Success",Message:"repair work request temp approval request Data", Data : Functiondetails ,Code:200});
        }).sort({"_id":-1});
});



router.post('/repair_work_request_temp/approval_request/branch_head/getlist_by_rp_eng', function (req, res) {
        add_repair_work_requestModel.find({br_code : req.body.br_code,  status : {$in : ["RW SITE WORK COMPLETED", "JOB WORK ORDER CREATED","RW JOB WORK FINISHED"]}}, function (err, Functiondetails) {
          res.json({Status:"Success",Message:"repair work request temp approval request Data", Data : Functiondetails ,Code:200});
        }).sort({"_id":-1});
});



router.post('/repair_work_request_temp/approval_request/getlist_by_rp_mech', function (req, res) {
        add_repair_work_requestModel.find({repair_work_mech_id : req.body.repair_work_mech_id,status : "JOB WORK ORDER CREATED" }, function (err, Functiondetails) {
          res.json({Status:"Success",Message:"repair work request temp approval request Data", Data : Functiondetails ,Code:200});
        });
});




router.post('/repair_work_request_temp/job_hazad/create', async function(req, res) {
  try{
        await add_repair_work_job_hazadModel.create({
 
  pref_id : req.body.pref_id,
  report_date :  req.body.report_date,
  job_no : req.body.job_no,
  br_code : req.body.br_code,
  site_name : req.body.site_name,
  nature_of_work : req.body.nature_of_work,
  rb_no : req.body.rb_no,
  GRW01:  req.body.GRW01,
  GRW02:  req.body.GRW02,
  GRW03:  req.body.GRW03,
  GRW04:  req.body.GRW04,
  GRW05:  req.body.GRW05,
  GRW06:  req.body.GRW06,
  GRW07:  req.body.GRW07,
  GRW08:  req.body.GRW08,
  MRW01:  req.body.MRW01,
  MRW02:  req.body.MRW02,
  MRW03:  req.body.MRW03,
  MRW04:  req.body.MRW04,
  MRW05:  req.body.MRW05,
  MRW06:  req.body.MRW06,
  CRW01:  req.body.CRW01,
  CRW02:  req.body.CRW02,
  CRW03:  req.body.CRW03,
  CRW04:  req.body.CRW04,
  CRW05:  req.body.CRW05,
  CRW06:  req.body.CRW06,
  CRW07:  req.body.CRW07,
  CRW08:  req.body.CRW08,
  HRW01:  req.body.HRW01,
  HRW02:  req.body.HRW02,
  HRW03:  req.body.HRW03,
  PRW01:  req.body.PRW01,
  PRW02:  req.body.PRW02,
  PRW03:  req.body.PRW03,
  PRW04:  req.body.PRW04,
  PRW05:  req.body.PRW05,
  PRW06:  req.body.PRW06,
  PRW07:  req.body.PRW07,
  remarks:  req.body.remarks,
  mech_name : req.body.mech_name,
  mech_emp_id : req.body.mech_emp_id,
  date_of_sub : req.body.date_of_sub,
  mech_signature : req.body.mech_signature,
  eng_signature : req.body.eng_signature,
  eng_sign_date : req.body.eng_sign_date,
  submitted_by_num:  req.body.submitted_by_num,
  submitted_by_name:  req.body.submitted_by_name,
  submitted_by_emp_code:  req.body.submitted_by_emp_code,
  submitted_by_on:  req.body.submitted_by_on,
  delete_status : false
         }, 
        function (err, user) {
      
         let da = {
          "status": "RW SITE WORK COMPLETED"
         }
         add_repair_work_requestModel.findByIdAndUpdate(req.body.pref_id, da, {new: true}, function (err, UpdatedDetails) {
            if (err) return res.json({Status:"Failed",Message:"Internal Server Error", Data : {},Code:500});
             // res.json({Status:"Success",Message:"DiaGram Data  Updated", Data : UpdatedDetails ,Code:200});
        });
         res.json({Status:"Success",Message:"Added successfully", Data : {} ,Code:200}); 
        });
}
catch(e){
      res.json({Status:"Failed",Message:"Internal Server Error", Data : {},Code:500});
}
});

   

router.post('/repair_work_request_temp/job_hazad/getlist_by_pref_id', function (req, res) {
        add_repair_work_job_hazadModel.findOne({ pref_id : req.body.pref_id}, function (err, Functiondetails) {
          res.json({Status:"Success",Message:"repair work request temp approval request Data", Data : Functiondetails ,Code:200});
        });
});   

router.get('/repair_work_request_temp/job_hazad/getlist', function (req, res) {
        add_repair_work_job_hazadModel.find({}, function (err, Functiondetails) {
          res.json({Status:"Success",Message:"repair work request temp approval request Data", Data : Functiondetails ,Code:200});
        });
});



router.post('/repair_work_request_temp/final_completion/edit',async function (req, res) {
    var job_haz_detail  =  await add_repair_work_job_hazadModel.findOne({_id:req.body.job_haz_id});
    var repair_work_detail  =  await add_repair_work_requestModel.findOne({_id:req.body.repair_pref_id});
  

  console.log(repair_work_detail);
  console.log(job_haz_detail);



 add_repair_work_job_hazadModel_value = {
        eng_signature : req.body.signature_eng,
        eng_sign_date : req.body.date_signature_eng,
       }
        add_repair_work_job_hazadModel.findByIdAndUpdate(req.body.job_haz_id, add_repair_work_job_hazadModel_value, {new: true}, function (err, UpdatedDetails) {
        if (err) return res.json({Status:"Failed",Message:"Internal Server Error", Data : {},Code:500});
        if(UpdatedDetails !== null){
           add_repair_work_requestModel_value = {
           completed_date : req.body.completed_date,
           status : "RW JOB WORK FINISHED",
        }
        add_repair_work_requestModel.findByIdAndUpdate(req.body.repair_pref_id, add_repair_work_requestModel_value, {new: true}, function (err, UpdatedDetails) {
            if (err) return res.json({Status:"Failed",Message:"Internal Server Error", Data : {},Code:500});
             // res.json({Status:"Success",Message:"Final Completion", Data : {} ,Code:200});
             insert_oracle(req);
        });
      } else {
            res.json({Status:"Failed",Message:"Not Updated", Data : {} ,Code:404});
      }
});


function insert_oracle(req){

      var job_haz_data = [
        {
            "JLS_JHD_BRDNO" : repair_work_detail.rb_no,
            "JLS_JHD_DATE" : job_haz_detail.report_date,
            "JLS_JHD_JOBNO": job_haz_detail.job_no,
            "JLS_JHD_ACTCODE": "JHG1",
            "JLS_JHD_ACTDESC": "Mechanic / team aware of standard repair process and undertstand to perform activity",
            "JLS_JHD_SEQNO": 10,
            "JLS_JHD_RESULT" : job_haz_detail.GRW01
        },
        {
            "JLS_JHD_BRDNO" : repair_work_detail.rb_no,
            "JLS_JHD_DATE" : job_haz_detail.report_date,
            "JLS_JHD_JOBNO": job_haz_detail.job_no,
            "JLS_JHD_ACTCODE": "JHG2",
            "JLS_JHD_ACTDESC": "Mechanic trained / competent to conduct the process",
            "JLS_JHD_SEQNO": 20,
            "JLS_JHD_RESULT" : job_haz_detail.GRW02
        },
        {
            "JLS_JHD_BRDNO" : repair_work_detail.rb_no,
            "JLS_JHD_DATE" : job_haz_detail.report_date,
            "JLS_JHD_JOBNO": job_haz_detail.job_no,
            "JLS_JHD_ACTCODE": "JHG3",
            "JLS_JHD_ACTDESC": "All process related PPEs are available",
            "JLS_JHD_SEQNO": 30,
            "JLS_JHD_RESULT" : job_haz_detail.GRW03
        },
        {
          "JLS_JHD_BRDNO" : repair_work_detail.rb_no,
            "JLS_JHD_DATE" : job_haz_detail.report_date,
            "JLS_JHD_JOBNO": job_haz_detail.job_no,
            "JLS_JHD_ACTCODE": "JHG4",
            "JLS_JHD_ACTDESC": "Proper & special Tools are available",
            "JLS_JHD_SEQNO": 40,
            "JLS_JHD_RESULT" : job_haz_detail.GRW04
        },
        {
          "JLS_JHD_BRDNO" : repair_work_detail.rb_no,
            "JLS_JHD_DATE" : job_haz_detail.report_date,
            "JLS_JHD_JOBNO": job_haz_detail.job_no,
            "JLS_JHD_ACTCODE": "JHG5",
            "JLS_JHD_ACTDESC": "Mechanics not working at different levels",
            "JLS_JHD_SEQNO": 50,
            "JLS_JHD_RESULT" : job_haz_detail.GRW05
        },
        {
          "JLS_JHD_BRDNO" : repair_work_detail.rb_no,
            "JLS_JHD_DATE" : job_haz_detail.report_date,
            "JLS_JHD_JOBNO": job_haz_detail.job_no,
            "JLS_JHD_ACTCODE": "JHG6",
            "JLS_JHD_ACTDESC": "Barricade and Maintenance display card available",
            "JLS_JHD_SEQNO": 60,
            "JLS_JHD_RESULT" : job_haz_detail.GRW06
        },
        {
          "JLS_JHD_BRDNO" : repair_work_detail.rb_no,
            "JLS_JHD_DATE" : job_haz_detail.report_date,
            "JLS_JHD_JOBNO": job_haz_detail.job_no,
            "JLS_JHD_ACTCODE": "JHG7",
            "JLS_JHD_ACTDESC": "Disconnecting of electrical circuit while on work",
            "JLS_JHD_SEQNO": 70,
            "JLS_JHD_RESULT" : job_haz_detail.GRW07
        },
        {
          "JLS_JHD_BRDNO" : repair_work_detail.rb_no,
            "JLS_JHD_DATE" : job_haz_detail.report_date,
            "JLS_JHD_JOBNO": job_haz_detail.job_no,
            "JLS_JHD_ACTCODE": "JHG8",
            "JLS_JHD_ACTDESC": "Certified Hoistina tools used in process",
            "JLS_JHD_SEQNO": 80,
            "JLS_JHD_RESULT" : job_haz_detail.GRW08
        },
        {
          "JLS_JHD_BRDNO" : repair_work_detail.rb_no,
            "JLS_JHD_DATE" : job_haz_detail.report_date,
            "JLS_JHD_JOBNO": job_haz_detail.job_no,
            "JLS_JHD_ACTCODE": "JHM1",
            "JLS_JHD_ACTDESC": "Access to Machine room is safe & well lit",
            "JLS_JHD_SEQNO": 90,
            "JLS_JHD_RESULT" : job_haz_detail.MRW01
        },
        {
          "JLS_JHD_BRDNO" : repair_work_detail.rb_no,
            "JLS_JHD_DATE" : job_haz_detail.report_date,
            "JLS_JHD_JOBNO": job_haz_detail.job_no,
            "JLS_JHD_ACTCODE": "JHM2",
            "JLS_JHD_ACTDESC": "Lighting is adequate",
            "JLS_JHD_SEQNO": 100,
            "JLS_JHD_RESULT" : job_haz_detail.MRW02
        },
        {
          "JLS_JHD_BRDNO" : repair_work_detail.rb_no,
            "JLS_JHD_DATE" : job_haz_detail.report_date,
            "JLS_JHD_JOBNO": job_haz_detail.job_no,
            "JLS_JHD_ACTCODE": "JHM3",
            "JLS_JHD_ACTDESC": "Floor is free of oil & material which may cause tripping Hazard",
            "JLS_JHD_SEQNO": 110,
            "JLS_JHD_RESULT" : job_haz_detail.MRW03
        },
        {
          "JLS_JHD_BRDNO" : repair_work_detail.rb_no,
            "JLS_JHD_DATE" : job_haz_detail.report_date,
            "JLS_JHD_JOBNO": job_haz_detail.job_no,
            "JLS_JHD_ACTCODE": "JHM4",
            "JLS_JHD_ACTDESC": "Oils & Lubricants are in closed & sealed containers",
            "JLS_JHD_SEQNO": 120,
            "JLS_JHD_RESULT" : job_haz_detail.MRW04
        },
        {
          "JLS_JHD_BRDNO" : repair_work_detail.rb_no,
            "JLS_JHD_DATE" : job_haz_detail.report_date,
            "JLS_JHD_JOBNO": job_haz_detail.job_no,
            "JLS_JHD_ACTCODE": "JHM5",
            "JLS_JHD_ACTDESC": "Speed Governor Functional",
            "JLS_JHD_SEQNO": 130,
            "JLS_JHD_RESULT" : job_haz_detail.MRW05
        },
        {
          "JLS_JHD_BRDNO" : repair_work_detail.rb_no,
            "JLS_JHD_DATE" : job_haz_detail.report_date,
            "JLS_JHD_JOBNO": job_haz_detail.job_no,
            "JLS_JHD_ACTCODE": "JHM6",
            "JLS_JHD_ACTDESC": "Safe means of hoisting is available. (Capacity, hook locking, etc)",
            "JLS_JHD_SEQNO": 140,
            "JLS_JHD_RESULT" : job_haz_detail.MRW01
        },
        {
          "JLS_JHD_BRDNO" : repair_work_detail.rb_no,
            "JLS_JHD_DATE" : job_haz_detail.report_date,
            "JLS_JHD_JOBNO": job_haz_detail.job_no,
            "JLS_JHD_ACTCODE": "JHC1",
            "JLS_JHD_ACTDESC": "Emergency stop switch easily accessible & identified",
            "JLS_JHD_SEQNO": 150,
            "JLS_JHD_RESULT" : job_haz_detail.CRW01
        },
        {
          "JLS_JHD_BRDNO" : repair_work_detail.rb_no,
            "JLS_JHD_DATE" : job_haz_detail.report_date,
            "JLS_JHD_JOBNO": job_haz_detail.job_no,
            "JLS_JHD_ACTCODE": "JHC2",
            "JLS_JHD_ACTDESC": " Emergency stop switch functional & verified",
            "JLS_JHD_SEQNO": 160,
            "JLS_JHD_RESULT" : job_haz_detail.CRW02
        },
        {
          "JLS_JHD_BRDNO" : repair_work_detail.rb_no,
            "JLS_JHD_DATE" : job_haz_detail.report_date,
            "JLS_JHD_JOBNO": job_haz_detail.job_no,
            "JLS_JHD_ACTCODE": "JHC3",
            "JLS_JHD_ACTDESC": "Car top Inspection Box installed & Functioning properly and verified",
            "JLS_JHD_SEQNO": 170,
            "JLS_JHD_RESULT" : job_haz_detail.CRW03
        },
        {
          "JLS_JHD_BRDNO" : repair_work_detail.rb_no,
            "JLS_JHD_DATE" : job_haz_detail.report_date,
            "JLS_JHD_JOBNO": job_haz_detail.job_no,
            "JLS_JHD_ACTCODE": "JHC4",
            "JLS_JHD_ACTDESC": "Lighting is adequate on car top & hoistway",
            "JLS_JHD_SEQNO": 180,
            "JLS_JHD_RESULT" : job_haz_detail.CRW04
        },
        {
          "JLS_JHD_BRDNO" : repair_work_detail.rb_no,
            "JLS_JHD_DATE" : job_haz_detail.report_date,
            "JLS_JHD_JOBNO": job_haz_detail.job_no,
            "JLS_JHD_ACTCODE": "JHC5",
            "JLS_JHD_ACTDESC": "Car top barricade angle installed (To loop FBH while on work)",
            "JLS_JHD_SEQNO": 190,
            "JLS_JHD_RESULT" : job_haz_detail.CRW05
        },
        {
          "JLS_JHD_BRDNO" : repair_work_detail.rb_no,
            "JLS_JHD_DATE" : job_haz_detail.report_date,
            "JLS_JHD_JOBNO": job_haz_detail.job_no,
            "JLS_JHD_ACTCODE": "JHC6",
            "JLS_JHD_ACTDESC": "Car top wiring gaurded to ensure no physical damage of cables / wire while on work",
            "JLS_JHD_SEQNO": 200,
            "JLS_JHD_RESULT" : job_haz_detail.CRW06
        },
        {
          "JLS_JHD_BRDNO" : repair_work_detail.rb_no,
            "JLS_JHD_DATE" : job_haz_detail.report_date,
            "JLS_JHD_JOBNO": job_haz_detail.job_no,
            "JLS_JHD_ACTCODE": "JHC7",
            "JLS_JHD_ACTDESC": "Tools & material required for repair activity placed safely on car top",
            "JLS_JHD_SEQNO": 210,
            "JLS_JHD_RESULT" : job_haz_detail.CRW07
        },
        {
            "JLS_JHD_BRDNO" : repair_work_detail.rb_no,
            "JLS_JHD_DATE" : job_haz_detail.report_date,
            "JLS_JHD_JOBNO": job_haz_detail.job_no,
            "JLS_JHD_ACTCODE": "JHC8",
            "JLS_JHD_ACTDESC": "Mechincal safety gear (OSG) functional",
            "JLS_JHD_SEQNO": 220,
            "JLS_JHD_RESULT" : job_haz_detail.CRW08
        },
        {
          "JLS_JHD_BRDNO" : repair_work_detail.rb_no,
            "JLS_JHD_DATE" : job_haz_detail.report_date,
            "JLS_JHD_JOBNO": job_haz_detail.job_no,
            "JLS_JHD_ACTCODE": "JHH1",
            "JLS_JHD_ACTDESC": "Lighting is adequate on car top & hoistway",
            "JLS_JHD_SEQNO": 230,
            "JLS_JHD_RESULT" : job_haz_detail.HRW01
        },
        {
          "JLS_JHD_BRDNO" : repair_work_detail.rb_no,
            "JLS_JHD_DATE" : job_haz_detail.report_date,
            "JLS_JHD_JOBNO": job_haz_detail.job_no,
            "JLS_JHD_ACTCODE": "JHH2",
            "JLS_JHD_ACTDESC": "All covers / Fascia installed",
            "JLS_JHD_SEQNO": 240,
            "JLS_JHD_RESULT" : job_haz_detail.HRW02
        },
        {
          "JLS_JHD_BRDNO" : repair_work_detail.rb_no,
            "JLS_JHD_DATE" : job_haz_detail.report_date,
            "JLS_JHD_JOBNO": job_haz_detail.job_no,
            "JLS_JHD_ACTCODE": "JHH3",
            "JLS_JHD_ACTDESC": "Hoistway screening / protection installed",
            "JLS_JHD_SEQNO": 250,
            "JLS_JHD_RESULT" : job_haz_detail.HRW03
        },
        {
          "JLS_JHD_BRDNO" : repair_work_detail.rb_no,
            "JLS_JHD_DATE" : job_haz_detail.report_date,
            "JLS_JHD_JOBNO": job_haz_detail.job_no,
            "JLS_JHD_ACTCODE": "JHP1",
            "JLS_JHD_ACTDESC": "Emergency stop switch easily accessible & identified. Functional & verified",
            "JLS_JHD_SEQNO": 260,
            "JLS_JHD_RESULT" : job_haz_detail.PRW01
        },
        {
          "JLS_JHD_BRDNO" : repair_work_detail.rb_no,
            "JLS_JHD_DATE" : job_haz_detail.report_date,
            "JLS_JHD_JOBNO": job_haz_detail.job_no,
            "JLS_JHD_ACTCODE": "JHP2",
            "JLS_JHD_ACTDESC": "Emergency stop switch functional & verified",
            "JLS_JHD_SEQNO": 270,
            "JLS_JHD_RESULT" : job_haz_detail.PRW02
        },
        {
          "JLS_JHD_BRDNO" : repair_work_detail.rb_no,
            "JLS_JHD_DATE" : job_haz_detail.report_date,
            "JLS_JHD_JOBNO": job_haz_detail.job_no,
            "JLS_JHD_ACTCODE": "JHP3",
            "JLS_JHD_ACTDESC": "Lighting is adequate",
            "JLS_JHD_SEQNO": 280,
            "JLS_JHD_RESULT" : job_haz_detail.PRW03
        },
        {
          "JLS_JHD_BRDNO" : repair_work_detail.rb_no,
            "JLS_JHD_DATE" : job_haz_detail.report_date,
            "JLS_JHD_JOBNO": job_haz_detail.job_no,
            "JLS_JHD_ACTCODE": "JHP4",
            "JLS_JHD_ACTDESC": "Pit ladder is installed & easily accessible",
            "JLS_JHD_SEQNO": 290,
            "JLS_JHD_RESULT" : job_haz_detail.PRW04
        },
        {
          "JLS_JHD_BRDNO" : repair_work_detail.rb_no,
            "JLS_JHD_DATE" : job_haz_detail.report_date,
            "JLS_JHD_JOBNO": job_haz_detail.job_no,
            "JLS_JHD_ACTCODE": "JHP5",
            "JLS_JHD_ACTDESC": "CWT screen guard installed & level below CWT buffer top",
            "JLS_JHD_SEQNO": 300,
            "JLS_JHD_RESULT" : job_haz_detail.PRW05
        },
        {
          "JLS_JHD_BRDNO" : repair_work_detail.rb_no,
            "JLS_JHD_DATE" : job_haz_detail.report_date,
            "JLS_JHD_JOBNO": job_haz_detail.job_no,
            "JLS_JHD_ACTCODE": "JHP6",
            "JLS_JHD_ACTDESC": "Exercise caution while working on duplex shafts where PIT seperation is not done",
            "JLS_JHD_SEQNO": 310,
            "JLS_JHD_RESULT" : job_haz_detail.PRW06
        },
        {
            "JLS_JHD_BRDNO" : repair_work_detail.rb_no,
            "JLS_JHD_DATE" : job_haz_detail.report_date,
            "JLS_JHD_JOBNO": job_haz_detail.job_no,
            "JLS_JHD_ACTCODE": "JHP7",
            "JLS_JHD_ACTDESC": "Floor must be free of water leakaqe, oil & materials which may cause trippinq Hazard",
            "JLS_JHD_SEQNO": 320,
            "JLS_JHD_RESULT" : job_haz_detail.PRW07
        }
    ];


    


var photo1 = (""+job_haz_detail.mech_signature).slice(49);
var photo2 = (""+job_haz_detail.eng_signature).slice(49);
var blob1 = fetchblog(photo1);
var blob2 = fetchblog(photo2);
function fetchblog(filepath) {
var path = require('path');       
var fs = require('fs');

var source = fs.readFileSync('/home/smart/johnson_application/public/uploads/'+filepath);
return source;
}
    var job_haz_data_details = {
      JLS_JHH_ENTRYDATE :job_haz_detail.report_date,
      JLS_JHH_BRDNO : repair_work_detail.rb_no,
      JLS_JHH_BRCODE : job_haz_detail.br_code,
      JLS_JHH_JOBNO :job_haz_detail.job_no,
      JLS_JHH_NATOFWORK : job_haz_detail.nature_of_work,
      JLS_JHH_ZONE_EID : repair_work_detail.zonal_eng_id,
      JLS_JHH_ZONE_ENAME :repair_work_detail.zonal_eng_name,
      JLS_JHH_MECH_ID : job_haz_detail.submitted_by_emp_code,
      JLS_JHH_MECH_NAME : job_haz_detail.mech_name,
      JLS_JHH_MECH_SIGN : blob1,
      JLS_JHH_MECH_SIGNDT : job_haz_detail.submitted_by_on,
      JLS_JHH_ENGG_ID : repair_work_detail.submitted_by_emp_code,
      JLS_JHH_ENGG_SIGN : blob2,
      JLS_JHH_ENGG_SIGNDT : job_haz_detail.eng_sign_date,
      JLS_JHH_SUBMIT_DATE : job_haz_detail.submitted_by_on,
      JLS_JHH_SUBMIT_ECODE : job_haz_detail.submitted_by_emp_code,
    }

     console.log(job_haz_data_details);
        oracledb.getConnection({
              user: "JLSMART",
              password: "JLSMART",
              connectString: "(DESCRIPTION =(ADDRESS = (PROTOCOL = TCP)(HOST = 192.168.1.112)(PORT = 1521))(CONNECT_DATA =(SID = jlpl)))"
        }, function(err, connection) {
        if (err) {
            console.error(err.message);
            return;
        }
         let da = job_haz_data_details;

              connection.execute(
                "INSERT INTO JLS_JOBHAZARD_HDR ( JLS_JHH_BRDNO, JLS_JHH_ENTRYDATE, JLS_JHH_BRCODE, JLS_JHH_JOBNO, JLS_JHH_NATOFWORK, JLS_JHH_ZONE_EID, JLS_JHH_ZONE_ENAME, JLS_JHH_MECH_ID, JLS_JHH_MECH_NAME, JLS_JHH_MECH_SIGN,  JLS_JHH_MECH_SIGNDT, JLS_JHH_ENGG_ID, JLS_JHH_ENGG_SIGN, JLS_JHH_ENGG_SIGNDT, JLS_JHH_SUBMIT_DATE, JLS_JHH_SUBMIT_ECODE ) VALUES ( :JLS_JHH_BRDNO, :JLS_JHH_ENTRYDATE, :JLS_JHH_BRCODE, :JLS_JHH_JOBNO, :JLS_JHH_NATOFWORK, :JLS_JHH_ZONE_EID, :JLS_JHH_ZONE_ENAME, :JLS_JHH_MECH_ID, :JLS_JHH_MECH_NAME, :JLS_JHH_MECH_SIGN,  :JLS_JHH_MECH_SIGNDT, :JLS_JHH_ENGG_ID, :JLS_JHH_ENGG_SIGN, :JLS_JHH_ENGG_SIGNDT, :JLS_JHH_SUBMIT_DATE, :JLS_JHH_SUBMIT_ECODE )",
                      da, // Bind values
                      { autoCommit: true}, 
                function (err, result) {
            if (err) {

                  console.error(err.message);
                  doRelease(connection);
                  res.json({Status:"Failed",Message:"This data already in Oracle table", Data : {} ,Code:404});
                  return;

             }
             console.log(result);

             var index = 0; 
             recall(index,job_haz_data);


             function recall(index,job_haz_data){
               if(index < job_haz_data.length){

      oracledb.getConnection({
              user: "JLSMART",
              password: "JLSMART",
              connectString: "(DESCRIPTION =(ADDRESS = (PROTOCOL = TCP)(HOST = 192.168.1.112)(PORT = 1521))(CONNECT_DATA =(SID = jlpl)))"
        }, function(err, connection) {
        if (err) {
            console.error(err.message);
            return;
        }
         let da = job_haz_data[index];
        console.log(da);
              connection.execute(
                "INSERT INTO JLS_JOBHAZARD_DTL ( JLS_JHD_BRDNO,  JLS_JHD_DATE, JLS_JHD_JOBNO, JLS_JHD_ACTCODE, JLS_JHD_ACTDESC, JLS_JHD_SEQNO, JLS_JHD_RESULT ) VALUES ( :JLS_JHD_BRDNO, :JLS_JHD_DATE, :JLS_JHD_JOBNO, :JLS_JHD_ACTCODE, :JLS_JHD_ACTDESC, :JLS_JHD_SEQNO, :JLS_JHD_RESULT )",
                      da, // Bind values
                      { autoCommit: true}, 
                function (err, result) {
            if (err) {
                  console.error(err.message);
                  doRelease(connection);
                  res.json({Status:"Failed",Message:"This data already in Oracle table", Data : {} ,Code:404});
                  return;
             }
             console.log(result);
             index = index + 1;
             recall(index,job_haz_data);
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

               } else {
                
                res.json({Status:"Success",Message:"Job Hazard Inserted", Data : {},Code:200});

               }

             }

       

     //   for(let a = 0 ; a < job_haz_data.length ; a++){

     //   oracledb.getConnection({
     //          user: "JLSMART",
     //          password: "JLSMART",
     //          connectString: "(DESCRIPTION =(ADDRESS = (PROTOCOL = TCP)(HOST = 192.168.1.112)(PORT = 1521))(CONNECT_DATA =(SID = jlpl)))"
     //    }, function(err, connection) {
     //    if (err) {
     //        console.error(err.message);
     //        return;
     //    }
     //     let da = job_haz_data[a];
     //    console.log(da);
     //          connection.execute(
     //            "INSERT INTO JLS_JOBHAZARD_DTL ( JLS_JHD_BRDNO,  JLS_JHD_DATE, JLS_JHD_JOBNO, JLS_JHD_ACTCODE, JLS_JHD_ACTDESC, JLS_JHD_SEQNO, JLS_JHD_RESULT ) VALUES ( :JLS_JHD_BRDNO, :JLS_JHD_DATE, :JLS_JHD_JOBNO, :JLS_JHD_ACTCODE, :JLS_JHD_ACTDESC, :JLS_JHD_SEQNO, :JLS_JHD_RESULT )",
     //                  da, // Bind values
     //                  { autoCommit: true}, 
     //            function (err, result) {
     //        if (err) {
     //              console.error(err.message);
     //              doRelease(connection);
     //              res.json({Status:"Failed",Message:"This data already in Oracle table", Data : {} ,Code:404});
     //              return;
     //         }
     //         console.log(result);
     //         doRelease(connection);
     //       });
     //        function doRelease(connection) {
     //           connection.release(function(err) {
     //             if (err) {
     //              console.error(err.message);
     //             }
     //           }
     //         );
     //       } 
     //    });

     //   if(a == job_haz_data.length - 1){

     //       // res.json({Status:"Success",Message:"Job Hazard Inserted", Data : {},Code:200});

     //   }

     // }
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



router.get('/repair_work_request_temp/nature_of_work', function (req, res) {
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
      "SELECT * FROM JLS_NATUREOFWORK_VW",
        {},
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
    res.json({Status:"Success",Message:"JLS_NATUREOFWORK_VW List", Data : ary,Code:200});
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




router.post('/repair_work_request_temp/mech_id_list', function (req, res) {
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
      "select * from JLS_RepairWork_VW where BR_CODE =:BR_CODE and CONTYPE=:CONTYPE",
        {
          BR_CODE : req.body.BR_CODE,
          CONTYPE : req.body.CONTYPE
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
    res.json({Status:"Success",Message:"Mech Detail List", Data : ary,Code:200});
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






router.get('/repair_work_request_temp/jopazh/checklist', function (req, res) {
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
      "select CAM_ATY_CODE, CAM_ATY_DESC, CAM_ATY_SEQNO  from com_activity_mst where cam_aty_TYPE = 'JOBHAZ'",
        {},
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





router.post('/find/flrnumber',async function (req, res){
const dates = require('date-and-time');
const now1  =  new Date();
const value1 = dates.format(now1,'DD-MMM-YYYY');
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
      `SELECT TO_CHAR(CFM_FIN_FRDT,'YY') as year
FROM COM_FINYR_MST
WHERE :DT BETWEEN CFM_FIN_FRDT AND CFM_FIN_TODT
AND CFM_FIN_YRTYPE = 'ACCYR'
AND CFM_FIN_COMCODE = 1`,
        {DT:value1},
        {autoCommit: true},
        function (err, result) {
    if (err) { console.error(err.message);
          doRelease(connection);
          return;
     }
 doRelease(connection);
 console.log(result);
if(result.rows.length == 0){
     res.json({Status:"Success",Message:"No Data Found", Data : {} ,Code:200});
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
console.log(ary);
var br_code = req.body.br_code;
var yy = ary[0].YEAR
oracledb.getConnection({
      user: "JLSMART",
      password: "JLSMART",
      connectString: "(DESCRIPTION =(ADDRESS = (PROTOCOL = TCP)(HOST = 192.168.1.112)(PORT = 1521))(CONNECT_DATA =(SID = jlpl)))"
},async function(err, connection) {
if (err) {
    // console.error(err.message);
    return;
}
 const query = "DECLARE FLNO VARCHAR2(50); BEGIN :ret := DBCONTROL_NUM_GENERATE(40,'GLOBAL.LBRCODE='||'"+br_code+"'||',GLOBAL.GYY='||"+yy+");COMMIT; END;"
  const result = await connection.execute(
      query,
      { ret: {dir: oracledb.BIND_OUT,type: oracledb.STRING} });
console.log('Output: ' + result.outBinds.ret);
doRelease(connection);
res.json({Status:"Success",Message:"FLR NUMBER", Data : {FLRNO : result.outBinds.ret},Code:200});
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




router.post('/find/rbwnumber',async function (req, res){
const dates = require('date-and-time');
const now1  =  new Date();
const month = dates.format(now1,'MM');
const year = dates.format(now1,'YY');


console.log("*******",month,year);

var br_code = req.body.br_code;

oracledb.getConnection({
      user: "JLSMART",
      password: "JLSMART",
      connectString: "(DESCRIPTION =(ADDRESS = (PROTOCOL = TCP)(HOST = 192.168.1.112)(PORT = 1521))(CONNECT_DATA =(SID = jlpl)))"
},async function(err, connection) {
if (err) {
    // console.error(err.message);
    return;
}
 const query = "DECLARE FLNO VARCHAR2(50); BEGIN :ret := DBCONTROL_NUM_GENERATE(77,'GLOBAL.LBRCODE='||'"+br_code+"'||',GLOBAL.YYMM='||"+year+month+");COMMIT; END;"
  const result = await connection.execute(
      query,
      { ret: {dir: oracledb.BIND_OUT,type: oracledb.STRING} });
console.log('Output: ' + result.outBinds.ret);
doRelease(connection);
res.json({Status:"Success",Message:"RW NUMBER", Data : {RWNO : result.outBinds.ret},Code:200});
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


/////////////////////////// REPAIR WORK REQEUST  /////////////////////////////////////////







router.get('/get_next_seqno', function (req, res) {
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
      // "select OM_BRKDOWNJOB_DTL_SEQ.nextval into :OM_BJD_SEQNO from dual",

       "SELECT ST_FAILUREREP_SEQ.NEXTVAL INTO :F_SEQNO FROM DUAL",
        {},
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
    res.json({Status:"Success",Message:"Seq No", Data : ary,Code:200});
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














module.exports = router;
