var express = require('express');
var router = express.Router();
var bodyParser = require('body-parser');
router.use(bodyParser.urlencoded({ extended: false }));
router.use(bodyParser.json());
var service_attendanceModel = require('./../models/service_attendanceModel');

var service_user_management = require('./../models/service_userdetailsModel');

var request = require("request");
var oracledb = require('oracledb');

router.post('/create', async function(req, res) {
    var user_detail  =  await service_user_management.findOne({user_mobile_no: req.body.user_mobile_no});
    const dates = require('date-and-time');
    const now1  =  new Date();
    const value1 = dates.format(now1,'YYYY-MM-DDTHH:mm:ss');
     let data = {
        "login_lat" : req.body.login_lat || 0.0,
        "login_long" : req.body.login_long || 0.0,
        "login_address" : req.body.login_address || 'Unknow',
        "user_type": "Log In",
        "last_login_time": ""+value1,
     }
     service_user_management.findByIdAndUpdate(user_detail._id, data, {new: true}, function (err, UpdatedDetails) {
            if (err)return res.json({Status:"Failed",Message:"Internal Server Error", Data:err,Code:500});
             res.json({Status:"Success",Message:"Attendance Marked Successfully", Data : {} ,Code:200}); 
     });
});






router.post('/fetch_attendance_list_operation', function (req, res) {
  var Submitted_attendance = [];
  let datas = [];
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
        `Select * from JLS_OPER_ATTENDANCE WHERE JLS_OA_ENGGCODE =:JLS_OA_ENGGCODE AND TRUNC(JLS_OA_ATTDATE)=:JLS_OA_ATTDATE`,
          {
            JLS_OA_ENGGCODE : req.body.JLS_OA_ENGGCODE,
            JLS_OA_ATTDATE : req.body.JLS_OA_ATTDATE
         },
          {autoCommit: true},
       function(err, result) {
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
  if(result.rows.length == 0){
    Submitted_attendance = ary;
    stage_two(Submitted_attendance);
  }
  else {
  for(let a = 0 ; a < result.rows.length;a++){
  var temp_data = result.rows[a];
  var results = {}
  for (var i = 0; i < result.metaData.length; ++i){
  results[result.metaData[i].name] = temp_data[i];
  }
   ary.push(results);   
   if(a == result.rows.length - 1){
      Submitted_attendance = ary;
      stage_two(Submitted_attendance);
   }
  }
  }
  });

function stage_two(Submitted_attendance){
    oracledb.getConnection({
         user: "JLSMART",
        password: "JLSMART",
        connectString: "(DESCRIPTION =(ADDRESS = (PROTOCOL = TCP)(HOST = 192.168.1.112)(PORT = 1521))(CONNECT_DATA =(SID = jlpl)))"
    }, function(err, connection) {
    if (err) {
        console.error(err.message);
        return;
    }
   
   console.log({fn: req.body.JLS_OA_ENGGCODE})


     connection.execute(
            "select EMPNO , ENAME , BRCODE from EMPLOYEE_VW where (EMPNO =:fn OR REPMGR=:fn) AND DOR IS NULL",
            {fn: req.body.JLS_OA_ENGGCODE},
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
          var final_value = [];   
          ary.forEach(element => {
          var stauts_value = '';
          var stauts = 'Not Marked';
          Submitted_attendance.forEach(elements => {
          if(element.EMPNO == elements.JLS_OA_TECH_ASST_CODE){
              stauts_value = elements.JLS_OA_STATUS;
              stauts = 'Marked';
          }
          });    
          final_value.push({
          JLS_HA_ENGGCODE : req.body.JLS_OA_ENGGCODE,
          JLS_HA_ENGGNAME : '',
          JLS_HA_HELPERCODE : element.EMPNO,
          JLS_HA_HELPERNAME :element.ENAME,
          JLS_HA_ROUTECD :  element.BRCODE,
          JLS_HA_ATTDATE : "",
          JLS_HA_STATUS : stauts_value,
          JLS_HA_FROMTIME : "",
          JLS_HA_TOTIME : "",
          JLS_HA_SUBMITDATE : "",
          JLS_HA_REMARKS  : "",
          JLS_HA_VALUE  : stauts,
                 });
          });
    res.json({Status:"Success",Message:"Updated", Data : final_value,Code:200}); 
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
});



router.post('/operation_attendance_submit', function (req, res) {  
   var index = 0 ;
   recall(index);
   function recall(index){
    if(index < req.body.ATTENDANCE_DETAILS.length){
  oracledb.getConnection({
       user: "JLSMART",
      password: "JLSMART",
      connectString: "(DESCRIPTION =(ADDRESS = (PROTOCOL = TCP)(HOST = 192.168.1.112)(PORT = 1521))(CONNECT_DATA =(SID = jlpl)))"
  }, function(err, connection) {
  if (err) {
      console.error(err.message);
      return;
  }
       if(req.body.ATTENDANCE_DETAILS[index].JLS_HA_FROMTIME == "" && req.body.ATTENDANCE_DETAILS[index].JLS_HA_TOTIME == ""){
        req.body.ATTENDANCE_DETAILS[index].JLS_HA_FROMTIME =  req.body.ATTENDANCE_DETAILS[index].JLS_HA_ATTDATE+" 12:00";
        req.body.ATTENDANCE_DETAILS[index].JLS_HA_TOTIME =  req.body.ATTENDANCE_DETAILS[index].JLS_HA_ATTDATE+" 12:00";
       }
      let da =
       {
            "JLS_OA_ENGGCODE": req.body.ATTENDANCE_DETAILS[index].JLS_HA_ENGGCODE,
            "JLS_OA_ENGGNAME": req.body.ATTENDANCE_DETAILS[index].JLS_HA_ENGGNAME,
            "JLS_OA_TECH_ASST_CODE": req.body.ATTENDANCE_DETAILS[index].JLS_HA_HELPERCODE,
            "JLS_OA_TECH_ASST_NAME": req.body.ATTENDANCE_DETAILS[index].JLS_HA_HELPERNAME,
            "JLS_OA_ROUTECD": req.body.ATTENDANCE_DETAILS[index].JLS_HA_ROUTECD,
            "JLS_OA_ATTDATE": req.body.ATTENDANCE_DETAILS[index].JLS_HA_ATTDATE,
            "JLS_OA_STATUS": req.body.ATTENDANCE_DETAILS[index].JLS_HA_STATUS,
            "JLS_OA_FROMTIME": req.body.ATTENDANCE_DETAILS[index].JLS_HA_FROMTIME,
            "JLS_OA_TOTIME": req.body.ATTENDANCE_DETAILS[index].JLS_HA_TOTIME,
            "JLS_OA_SUBMITDATE": req.body.ATTENDANCE_DETAILS[index].JLS_HA_SUBMITDATE,
            "JLS_OA_REMARKS": req.body.ATTENDANCE_DETAILS[index].JLS_HA_REMARKS,
        }
        connection.execute(
            "INSERT INTO JLS_OPER_ATTENDANCE(JLS_OA_ENGGCODE, JLS_OA_ENGGNAME, JLS_OA_TECH_ASST_CODE, JLS_OA_TECH_ASST_NAME, JLS_OA_ROUTECD, JLS_OA_ATTDATE, JLS_OA_STATUS, JLS_OA_FROMTIME, JLS_OA_TOTIME, JLS_OA_SUBMITDATE, JLS_OA_REMARKS) VALUES (:JLS_OA_ENGGCODE, :JLS_OA_ENGGNAME, :JLS_OA_TECH_ASST_CODE, :JLS_OA_TECH_ASST_NAME, :JLS_OA_ROUTECD,   to_date(:JLS_OA_ATTDATE, 'DD/MM/YYYY HH24:MI:SS'),  :JLS_OA_STATUS,    to_date(:JLS_OA_FROMTIME,  'DD/MM/YYYY HH24:MI:SS'),  to_date(:JLS_OA_TOTIME, 'DD/MM/YYYY HH24:MI:SS'),    to_date(:JLS_OA_SUBMITDATE, 'DD/MM/YYYY HH24:MI:SS'), :JLS_OA_REMARKS)",
              da, // Bind values
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
    index = index + 1;
    recall(index);
  });
}); 

    } else {
     res.json({Status:"Success",Message:"Submitted  Attendance", Data : {} ,Code:200}); 
    }
   }
});





router.post('/operation_work_sheet_insert', function (req, res) {  
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
            "JLS_EWD_WKDATE": req.body.JLS_EWD_WKDATE,
            "JLS_EWD_BRCODE": req.body.JLS_EWD_BRCODE,
            "JLS_EWD_JOBNO": req.body.JLS_EWD_JOBNO,
            "JLS_EWD_EMPNO": req.body.JLS_EWD_EMPNO,
            "JLS_EWD_ACTIVITY": req.body.JLS_EWD_ACTIVITY,
            "JLS_EWD_WRKHOUR": req.body.JLS_EWD_WRKHOUR,
            "JLS_EWD_PREPBY": req.body.JLS_EWD_PREPBY,
            "JLS_EWD_PREPDT": req.body.JLS_EWD_PREPDT,
            "JLS_EWD_STATUS": "A",
            "JLS_EWD_MODBY": "",
            "JLS_EWD_MODDT": "",
            "JLS_EWD_DISTANCE": req.body.JLS_EWD_DISTANCE,
        }
        connection.execute(
            "INSERT INTO JLS_EMPWRK_DTL(JLS_EWD_WKDATE, JLS_EWD_BRCODE, JLS_EWD_JOBNO, JLS_EWD_EMPNO, JLS_EWD_ACTIVITY, JLS_EWD_WRKHOUR, JLS_EWD_PREPBY, JLS_EWD_PREPDT, JLS_EWD_STATUS, JLS_EWD_MODBY, JLS_EWD_MODDT, JLS_EWD_DISTANCE) VALUES (to_date(:JLS_EWD_WKDATE, 'DD/MM/YYYY HH24:MI:SS'), :JLS_EWD_BRCODE, :JLS_EWD_JOBNO, :JLS_EWD_EMPNO, :JLS_EWD_ACTIVITY, :JLS_EWD_WRKHOUR, :JLS_EWD_PREPBY, to_date(:JLS_EWD_PREPDT, 'DD/MM/YYYY HH24:MI:SS'),  :JLS_EWD_STATUS,  to_date(:JLS_EWD_MODDT,  'DD/MM/YYYY HH24:MI:SS'), :JLS_EWD_MODBY, :JLS_EWD_DISTANCE)",
              da, // Bind values
              { autoCommit: true}, 
        function (err, result) {
    if (err) { console.error(err.message);
          doRelease(connection);
          return;
     }
     res.json({Status:"Success",Message:"INSERTED VALUE", Data : {}, Code:200});
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




router.post('/Update_operation_work_sheet_insert', function (req, res) {  
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
            // "JLS_EWD_WKDATE": req.body.JLS_EWD_WKDATE,
            "JLS_EWD_JOBNO": req.body.JLS_EWD_JOBNO,
            "JLS_EWD_EMPNO": req.body.JLS_EWD_EMPNO,
            "JLS_EWD_ACTIVITY": req.body.JLS_EWD_ACTIVITY,
            "JLS_EWD_WRKHOUR": req.body.JLS_EWD_WRKHOUR,
            "JLS_EWD_PREPBY": req.body.JLS_EWD_PREPBY,
            "JLS_EWD_DISTANCE": req.body.JLS_EWD_DISTANCE,
        }
        connection.execute(
            "UPDATE JLS_EMPWRK_DTL set JLS_EWD_ACTIVITY=:JLS_EWD_ACTIVITY, JLS_EWD_WRKHOUR=:JLS_EWD_WRKHOUR, JLS_EWD_DISTANCE=:JLS_EWD_DISTANCE WHERE JLS_EWD_JOBNO=:JLS_EWD_JOBNO and JLS_EWD_PREPBY=:JLS_EWD_PREPBY and JLS_EWD_EMPNO=:JLS_EWD_EMPNO",
              da, // Bind values
              { autoCommit: true}, 
        function (err, result) {
    if (err) { console.error(err.message);
          doRelease(connection);
          return;
     }
     res.json({Status:"Success",Message:"INSERTED VALUE", Data : {}, Code:200});
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





router.post('/operation_work_sheet_get_list', function (req, res) {  
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
            "JLS_EWD_WKDATE": req.body.JLS_EWD_WKDATE,
            "JLS_EWD_BRCODE": req.body.JLS_EWD_BRCODE,
            "JLS_EWD_PREPBY": req.body.JLS_EWD_PREPBY,
            "JLS_EWD_EMPNO": req.body.JLS_EWD_EMPNO
        }
        connection.execute(
            "SELECT * FROM  JLS_EMPWRK_DTL WHERE JLS_EWD_WKDATE=:JLS_EWD_WKDATE and JLS_EWD_BRCODE=:JLS_EWD_BRCODE and JLS_EWD_PREPBY=:JLS_EWD_PREPBY and JLS_EWD_EMPNO=:JLS_EWD_EMPNO",
              da, // Bind values
              { autoCommit: true}, 
        function (err, result) {
    if (err) { console.error(err.message);
          doRelease(connection);
          return;
     }
     if(result.rows == 0){
       res.json({Status:"Success",Message:"LIST TIME SHEET", Data : [], Code:200, hrs_count : 0});
     } else {

  var ary = [];
  var hrs_count = 0;
  for(let a = 0 ; a < result.rows.length;a++){
  var temp_data = result.rows[a];
  var results = {}
  for (var i = 0; i < result.metaData.length; ++i){
  results[result.metaData[i].name] = temp_data[i];
  }
  results.JLS_EWD_WKDATE.setDate(results.JLS_EWD_WKDATE.getDate() + 1);
  results.JLS_EWD_PREPDT.setDate(results.JLS_EWD_PREPDT.getDate() + 1);
  hrs_count = hrs_count + +results.JLS_EWD_WRKHOUR;
   ary.push(results);   
   if(a == result.rows.length - 1){
     res.json({Status:"Success",Message:"LIST TIME SHEET", Data : ary, Code:200, hrs_count : hrs_count});
   }
  }
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
});




router.post('/job_list_work_activity', function (req, res) {  
  console.log("************* TN ***********",req.body);
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
            "BRCODE": req.body.BRCODE
        }
        connection.execute(
            "select * from jls_jobno_wseq25 where BRCODE=:BRCODE",
              da, // Bind values
              { autoCommit: true}, 
        function (err, result) {
    if (err) { console.error(err.message);
          doRelease(connection);
          return;
     }
     if(result.rows == 0){
       res.json({Status:"Success",Message:"JOB DETAIL LIST", Data : [], Code:200});
     } else {

  var ary = [];
  for(let a = 0 ; a < result.rows.length;a++){
  var temp_data = result.rows[a];
  var results = {}
  for (var i = 0; i < result.metaData.length; ++i){
  results[result.metaData[i].name] = temp_data[i];
  }
  let tem  = { 
        _id: results.JOBNO,
        activedetail__id : '61c55f858bc953743afdaa52',
        job_detail_no : results.JOBNO,
        "job_detail_created_at": "23-10-2021 11:00 AM",
        "job_detail_update_at": "",
        "job_detail_created_by": "Admin",
        "job_detail_updated_by": "",
        "update_reason": "",
        "activedetail_id":'61c55f858bc953743afdaa52',
    }
   ary.push(tem);   
   if(a == result.rows.length - 1){
      ary.push({ 
        _id: "Training",
        activedetail__id : '61c55f858bc953743afdaa52',
        job_detail_no : "Training",
        "job_detail_created_at": "23-10-2021 11:00 AM",
        "job_detail_update_at": "",
        "job_detail_created_by": "Admin",
        "job_detail_updated_by": "",
        "update_reason": "",
        "activedetail_id":'61c55f858bc953743afdaa52',
    });
      ary.push({ 
        _id: "ADHO",
        activedetail__id : '61c55f858bc953743afdaa52',
        job_detail_no : "ADHO",
        "job_detail_created_at": "23-10-2021 11:00 AM",
        "job_detail_update_at": "",
        "job_detail_created_by": "Admin",
        "job_detail_updated_by": "",
        "update_reason": "",
        "activedetail_id":'61c55f858bc953743afdaa52',
    });
     res.json({Status:"Success",Message:"JOB DETAIL LIST", Data : ary, Code:200});
   }
  }
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
});






router.post('/helper_list', function (req, res) {
 

  

  

  var Submitted_attendance = [];
  let datas = [];
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
        `Select * from JLS_HELPER_ATTENDANCE WHERE JLS_HA_ENGGCODE =:JLS_HA_ENGGCODE AND TRUNC(JLS_HA_ATTDATE)=:JLS_HA_ATTDATE`,
          {
            JLS_HA_ENGGCODE : req.body.JLS_HA_ENGGCODE,
            JLS_HA_ATTDATE : req.body.JLS_HA_ATTDATE
         },
          {autoCommit: true},
       function(err, result) {
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

  if(result.rows.length == 0){
    Submitted_attendance = ary;
    stage_two(Submitted_attendance);
  }
  else {
  for(let a = 0 ; a < result.rows.length;a++){
  var temp_data = result.rows[a];
  var results = {}
  for (var i = 0; i < result.metaData.length; ++i){
  results[result.metaData[i].name] = temp_data[i];
  }
   ary.push(results);   
   if(a == result.rows.length - 1){
      Submitted_attendance = ary;
      stage_two(Submitted_attendance);
   }
  }
  }
  });
});      

function stage_two(Submitted_attendance){
    var temp_submit_value = Submitted_attendance;
    let datas = [];
    oracledb.getConnection({
         user: "JLSMART",
        password: "JLSMART",
        connectString: "(DESCRIPTION =(ADDRESS = (PROTOCOL = TCP)(HOST = 192.168.1.112)(PORT = 1521))(CONNECT_DATA =(SID = jlpl)))"
    }, function(err, connection) {
    if (err) {
        console.error(err.message);
        return;
    }
     // SELECT * FROM JLS_HELPER_VW WHERE ENGCODE = :JLS_HA_ENGGCODE
          connection.execute(
          `SELECT DISTINCT PGRCODE, ENGCODE, ENGNAME, AEMPCODE, AEMPNAME FROM JLS_HELPER_VW WHERE  ENGCODE =:JLS_HA_ENGGCODE`,
            {
              JLS_HA_ENGGCODE : req.body.JLS_HA_ENGGCODE
           },
            {autoCommit: true},
         function(err, result) {
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

    if(result.rows.length == 0){
    res.json({Status:"Success",Message:"No Record Found", Data : [], Code:200});
    }
    else {
    for(let a = 0 ; a < result.rows.length;a++){
    var temp_data = result.rows[a];
    var results = {}
    for (var i = 0; i < result.metaData.length; ++i){
    results[result.metaData[i].name] = temp_data[i];
    }

    var stauts_value = '';
    var stauts = 'Not Marked';
    temp_submit_value.forEach(element => {
    if(results.AEMPCODE == element.JLS_HA_HELPERCODE){
        stauts_value = element.JLS_HA_STATUS;
        stauts = 'Marked';
    }
    });
    let temp_value = {
         JLS_HA_ENGGCODE : results.ENGCODE,
         JLS_HA_ENGGNAME :results.ENGNAME,
         JLS_HA_HELPERCODE : results.AEMPCODE,
         JLS_HA_HELPERNAME :results.AEMPNAME,
         JLS_HA_ROUTECD :  "",
         JLS_HA_ATTDATE : "",
         JLS_HA_STATUS : stauts_value,
         JLS_HA_FROMTIME : "",
         JLS_HA_TOTIME : "",
         JLS_HA_SUBMITDATE : "",
         JLS_HA_REMARKS  : "",
         JLS_HA_VALUE  : stauts,
      };
     ary.push(temp_value);   
     if(a == result.rows.length - 1){
       res.json({Status:"Success",Message:"ATTENDANCE HELPER LIST", Data : ary ,Code:200});     
     }
    }
    }     
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



router.post('/helper_attendance_submit', function (req, res) {  
   var index = 0 ;
   recall(index);
   function recall(index){
    if(index < req.body.ATTENDANCE_DETAILS.length){
  oracledb.getConnection({
       user: "JLSMART",
      password: "JLSMART",
      connectString: "(DESCRIPTION =(ADDRESS = (PROTOCOL = TCP)(HOST = 192.168.1.112)(PORT = 1521))(CONNECT_DATA =(SID = jlpl)))"
  }, function(err, connection) {
  if (err) {
      console.error(err.message);
      return;
  }
       if(req.body.ATTENDANCE_DETAILS[index].JLS_HA_FROMTIME == "" && req.body.ATTENDANCE_DETAILS[index].JLS_HA_TOTIME == ""){
        req.body.ATTENDANCE_DETAILS[index].JLS_HA_FROMTIME =  req.body.ATTENDANCE_DETAILS[index].JLS_HA_ATTDATE+" 12:00";
        req.body.ATTENDANCE_DETAILS[index].JLS_HA_TOTIME =  req.body.ATTENDANCE_DETAILS[index].JLS_HA_ATTDATE+" 12:00";
       }
      let da =
       {
            "JLS_HA_ENGGCODE": req.body.ATTENDANCE_DETAILS[index].JLS_HA_ENGGCODE,
            "JLS_HA_ENGGNAME": req.body.ATTENDANCE_DETAILS[index].JLS_HA_ENGGNAME,
            "JLS_HA_HELPERCODE": req.body.ATTENDANCE_DETAILS[index].JLS_HA_HELPERCODE,
            "JLS_HA_HELPERNAME": req.body.ATTENDANCE_DETAILS[index].JLS_HA_HELPERNAME,
            "JLS_HA_ROUTECD": req.body.ATTENDANCE_DETAILS[index].JLS_HA_ROUTECD,
            "JLS_HA_ATTDATE": req.body.ATTENDANCE_DETAILS[index].JLS_HA_ATTDATE,
            "JLS_HA_STATUS": req.body.ATTENDANCE_DETAILS[index].JLS_HA_STATUS,
            "JLS_HA_FROMTIME": req.body.ATTENDANCE_DETAILS[index].JLS_HA_FROMTIME,
            "JLS_HA_TOTIME": req.body.ATTENDANCE_DETAILS[index].JLS_HA_TOTIME,
            "JLS_HA_SUBMITDATE": req.body.ATTENDANCE_DETAILS[index].JLS_HA_SUBMITDATE,
            "JLS_HA_REMARKS": req.body.ATTENDANCE_DETAILS[index].JLS_HA_REMARKS,
        }
        connection.execute(
            "INSERT INTO JLS_Helper_Attendance(JLS_HA_ENGGCODE, JLS_HA_ENGGNAME, JLS_HA_HELPERCODE, JLS_HA_HELPERNAME, JLS_HA_ROUTECD, JLS_HA_ATTDATE, JLS_HA_STATUS, JLS_HA_FROMTIME, JLS_HA_TOTIME, JLS_HA_SUBMITDATE, JLS_HA_REMARKS) VALUES (:JLS_HA_ENGGCODE, :JLS_HA_ENGGNAME, :JLS_HA_HELPERCODE, :JLS_HA_HELPERNAME, :JLS_HA_ROUTECD,   to_date(:JLS_HA_ATTDATE, 'DD/MM/YYYY HH24:MI:SS'),  :JLS_HA_STATUS,    to_date(:JLS_HA_FROMTIME,  'DD/MM/YYYY HH24:MI:SS'),  to_date(:JLS_HA_TOTIME, 'DD/MM/YYYY HH24:MI:SS'),    to_date(:JLS_HA_SUBMITDATE, 'DD/MM/YYYY HH24:MI:SS'), :JLS_HA_REMARKS)",
              da, // Bind values
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
    index = index + 1;
    recall(index);
  });
}); 

    } else {
     res.json({Status:"Success",Message:"Submitted  Attendance", Data : {} ,Code:200}); 
    }
   }
});




router.get('/deletes', function (req, res) {
      service_attendanceModel.remove({}, function (err, user) {
          if (err) return res.status(500).send("There was a problem deleting the user.");
             res.json({Status:"Success",Message:"activedetail_management Deleted", Data : {} ,Code:200});     
      });
});





// ******************************************************************************************************************************************************************************
// SERVICE ADMIN ATTENDANCE DETAILS - ADMIN PANEL
// ******************************************************************************************************************************************************************************
  router.post('/admin_attendance_detail', function (req, res) {
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
        `SELECT * FROM AGENTATTENDANCE WHERE INTIME BETWEEN to_date(:FROMDATE, 'DD/MM/YYYY HH24:MI:SS') AND  to_date(:TODATE, 'DD/MM/YYYY HH24:MI:SS')`,
          {
            FROMDATE : req.body.from_date,
            TODATE : req.body.to_date,
         },
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
// SERVICE SUB ADMIN ATTENDANCE DETAILS - ADMIN PANEL
// ******************************************************************************************************************************************************************************

  router.post('/sub_admin_attendance_detail', function (req, res) {
   let a = '';
  req.body.access_location.forEach(element => {
   a = a + ',' + "'"+element.branch_code+"'";
  });
    const withoutFirstAndLast  = a.substring(1).toUpperCase();  
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
        "SELECT * FROM AGENTATTENDANCE WHERE INTIME BETWEEN to_date(:FROMDATE, 'DD/MM/YYYY HH24:MI:SS') AND  to_date(:TODATE, 'DD/MM/YYYY HH24:MI:SS') AND LOCATION in ("+withoutFirstAndLast+")",
          {
            FROMDATE : req.body.from_date,
            TODATE : req.body.to_date
         },
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


router.post('/getlist_id', function (req, res) {
        let final_data = []; 
         var keyword = req.body.search_string.toLowerCase();
         service_attendanceModel.find({}, function (err, StateList) {
          if(StateList.length == 0 || req.body.search_string == ""){
            res.json({Status:"Success",Message:"activedetail_management List", Data : StateList ,Code:200});
          }else {
          for(let a = 0 ; a  < StateList.length; a ++){
          var active_text = StateList[a].activedetail_name.toLowerCase();
          if(active_text.indexOf(keyword) !== -1 == true){
               final_data.push(StateList[a]);
          }
          if(a == StateList.length - 1){
             res.json({Status:"Success",Message:"activedetail_management List", Data : final_data ,Code:200});
          }
          }
          }
        });
});


// ******************************************************************************************************************************************************************************
// SERVICE SUB ADMIN ATTENDANCE DETAILS OVER ALL - ADMIN PANEL
// ******************************************************************************************************************************************************************************

router.get('/getlist', function (req, res) {
        service_attendanceModel.find({}, function (err, Functiondetails) {
          res.json({Status:"Success",Message:"activedetail_management", Data : Functiondetails ,Code:200});
        });
});


router.post('/check_login_status',async function (req, res) {
       var user_detail  =  await service_user_management.findOne({user_mobile_no: req.body.user_mobile_no});
       if(user_detail == null){
        res.json({Status:"Failed",Message:"Contact Admin Check Login Status", Data : {} ,Code:404});
       }else {
        if(user_detail.user_type == "Log Out"){
        res.json({Status:"Failed",Message:"Not Present", Data : {} ,Code:404});
       } else {
        res.json({Status:"Success",Message:"Present", Data : {} ,Code:200});
       }  
       }
       

        // service_attendanceModel.findOne({user_mobile_no:req.body.user_mobile_no,att_date:req.body.att_date}, function (err, Functiondetails) {
        //    if(Functiondetails == null){
        //   res.json({Status:"Failed",Message:"Not Present", Data : {} ,Code:404});
        //    }else{
        //       if(Functiondetails.att_reason == ''){
                 
        //       }else {
                
        //         // res.json({Status:"Failed",Message:"Already Logout", Data : {} ,Code:404});
        //       }
        //    }
        // });
});




router.post('/edit', function (req, res) {
        service_attendanceModel.findByIdAndUpdate(req.body._id, req.body, {new: true}, function (err, UpdatedDetails) {
            if (err) return res.json({Status:"Failed",Message:"Internal Server Error", Data : {},Code:500});
             res.json({Status:"Success",Message:"activedetail_management Updated", Data : UpdatedDetails ,Code:200});
        });
});



router.post('/logout',async function (req, res) {
   var service_attendance_detail  =  await service_attendanceModel.findOne({_id:req.body._id});
   var last_count = service_attendance_detail.attendance_data.length - 1;
   service_attendance_detail.attendance_data[last_count].att_end_time = req.body.att_end_time;
   service_attendance_detail.attendance_data[last_count].att_no_of_hrs = req.body.att_no_of_hrs;
   service_attendance_detail.attendance_data[last_count].att_reason = req.body.att_reason;
   var  att_no_of_hrs = +service_attendance_detail.att_no_of_hrs + +req.body.att_no_of_hrs;
   req.body.attendance_data = service_attendance_detail.attendance_data;
   req.body.att_no_of_hrs = att_no_of_hrs;
        service_attendanceModel.findByIdAndUpdate(req.body._id, req.body, {new: true}, function (err, UpdatedDetails) {
            if (err) return res.json({Status:"Failed",Message:"Internal Server Error", Data : {},Code:500});
            res.json({Status:"Success",Message:"Logout Updated", Data : {} ,Code:200});
        });
});


// // DELETES A USER FROM THE DATABASE
router.post('/admin_delete', function (req, res) {
      service_attendanceModel.findByIdAndRemove(req.body._id, function (err, user) {
        console.log(err);
          if (err) return res.json({Status:"Failed",Message:"Internal Server Error", Data : {},Code:500});

          res.json({Status:"Success",Message:"activedetail_management Deleted successfully", Data : {} ,Code:200});
      });
});



// // DELETES A USER FROM THE DATABASE
router.post('/delete', function (req, res) {
      service_attendanceModel.findByIdAndRemove(req.body._id, function (err, user) {
          if (err) return res.json({Status:"Failed",Message:"Internal Server Error", Data : {},Code:500});
          res.json({Status:"Success",Message:"activedetail_management Deleted successfully", Data : {} ,Code:200});
      });
});
module.exports = router;
