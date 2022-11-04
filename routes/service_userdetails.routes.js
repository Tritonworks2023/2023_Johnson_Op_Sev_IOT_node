var express = require('express');
var router = express.Router();
var bodyParser = require('body-parser');
router.use(bodyParser.urlencoded({ extended: false }));
router.use(bodyParser.json());
var service_user_management = require('./../models/service_userdetailsModel');
var breakdown_managementModel = require('./../models/breakdown_managementModel');
var service_employee_activity_allocationModel = require('./../models/service_employee_activity_allocationModel');

var breakdown_mr_data_managementModel = require('./../models/breakdown_mr_data_managementModel');
var lr_service_managementModel = require('./../models/lr_service_managementModel');

var part_reply_service_managementModel = require('./../models/part_reply_service_managementModel');

var audit_data_managementModel = require('./../models/audit_data_managementModel');



var oracledb = require('oracledb');
var request = require("request");

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
          console.log(err)
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


router.get('/deletes', function (req, res) {
      service_user_management.remove({}, function (err, user) {
          if (err) return res.status(500).send("There was a problem deleting the user.");
             res.json({Status:"Success",Message:"User management Deleted", Data : {} ,Code:200});     
      });
});


router.post('/getlist_id', function (req, res) {
        service_user_management.find({user_id:req.body.user_id}, function (err, StateList) {
          res.json({Status:"Success",Message:"User management List", Data : StateList ,Code:200});
        });
});



router.post('/info', function (req, res) {
        service_user_management.findOne({user_mobile_no:req.body.user_mobile_no}, function (err, StateList) {
          res.json({Status:"Success",Message:"User Management Details", Data : StateList ,Code:200});
        });
});



router.post('/change_password', function (req, res) {
         service_user_management.findByIdAndUpdate(req.body._id, req.body, {new: true}, function (err, UpdatedDetails) {
            if (err)return res.json({Status:"Failed",Message:"Internal Server Error", Data:err,Code:500});
             res.json({Status:"Success",Message:"User management Updated", Data : UpdatedDetails ,Code:200});
        });
});

router.get('/logout_reason', function (req, res) {
         var StateList = [
             {
                logout_reason:"LEAVE"
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
             }
         ];
        res.json({Status:"Success",Message:"LOGOUT REASON", Data : StateList ,Code:200});
});




router.post('/fetch_iso_number', function (req, res) {   
oracledb.getConnection({
      user: "SMARTSM",
      password: "SMARTSM",
      connectString: "(DESCRIPTION =(ADDRESS = (PROTOCOL = TCP)(HOST = 192.168.1.112)(PORT = 1521))(CONNECT_DATA =(SID = jlpl)))"
}, function(err, connection) {
if (err) {
    // console.error(err.message);
    return;
}
// "SELECT * from SSM_SERCALL_HDR_UPLOAD where SMU_SCH_MECHCELL = '7358780824'  and SMU_SCH_DWNFLAG IS NULL",
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




router.post('/fetch_breakdown_job_detail',async function (req, res) {   
   var job_details  =  await breakdown_managementModel.findOne({SMU_SCH_JOBNO : req.body.job_id});
   res.json({Status:"Success",Message:"Job Detail", Data : job_details,Code:200}); 
});



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
// "SELECT * from SSM_SERCALL_HDR_UPLOAD where SMU_SCH_MECHCELL = '7358780824'  and SMU_SCH_DWNFLAG IS NULL",
connection.execute(
            "SELECT DBSOM_GET_JOBADDRESS(:ln,'OI') INSADR, DBSOM_GET_JLSMARTADDR(:ln,'C') CUSADD, DBSOM_GET_JOBADDRESS(:ln,'OB') BRANCNAME, DBSOM_GET_JLSMARTADDR(:ln,'C') BRADD FROM DUAL",
            {ln:req.body.job_id},
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
// console.log(result.rows.length);
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



router.post('/pull_job_from',async function (req, res) {
   

request.post(
    'http://smart.johnsonliftsltd.com:3000/api/preventive_service_data_management/fetch_data_from_oracle_mr_breakdown_pull',
    { json: req.body},
    function (error, response, body) {
        if (!error && response.statusCode == 200) {
        }
    }
);


request.post(
    'http://smart.johnsonliftsltd.com:3000/api/lr_service_data_management/fetch_data_from_oracle_lr_service_pull',
    { json: req.body},
    function (error, response, body) {
        if (!error && response.statusCode == 200) {
        }
    }
);



request.post(
    'http://smart.johnsonliftsltd.com:3000/api/audit_data_management/fetch_data_from_oracle_audit_service_pull',
    { json: req.body},
    function (error, response, body) {
        if (!error && response.statusCode == 200) {
        }
    }
);


request.post(
    'http://smart.johnsonliftsltd.com:3000/api/part_replacement/fetch_data_from_oracle_part_replacement_pull',
    { json: req.body},
    function (error, response, body) {
        if (!error && response.statusCode == 200) {
        }
    }
);



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
            "SELECT * from JLS_SERCALL_HDR_UPLOAD where SMU_SCH_SERTYPE in ('P','B') and SMU_SCH_DWNFLAG <> 'Y'",
            { 
              
            },
        {autoCommit: true},
        function (err, result) {
    if (err) { console.error(err.message);
          doRelease(connection);
          return;
     }
var ary = [];
console.log(result.rows.length);
if(result.rows.length == 0){
 res.json({Status:"Success",Message:"User Details", Data : StateList ,Code:200});
}else{
for(let a = 0 ; a < result.rows.length; a++){
var temp_data = result.rows[a];
var results = {}
for (var i = 0; i < result.metaData.length; ++i){
results[result.metaData[i].name] = temp_data[i];
}
 // console.log(results);
request.post(
    'http://smart.johnsonliftsltd.com:3000/api/breakdown_management/create',
    { json: results},
    function (error, response, body) {
        if (!error && response.statusCode == 200) {
        }
    }
);



 // ary.push(results.length);
 if(a == result.rows.length - 1){
    // res.json({Status:"Success",Message:"Updated", Data : ary,Code:200}); 
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
            "UPDATE JLS_SERCALL_HDR_UPLOAD set SMU_SCH_DWNFLAG='Y', SMU_SCH_DWNFLAGDATE=:SMU_SCH_DWNFLAGDATE WHERE SMU_SCH_SERTYPE in ('P','B') and SMU_SCH_DWNFLAG <> 'Y' ",
            {
                SMU_SCH_DWNFLAGDATE : new Date()
            },
        {autoCommit: true},
        function (err, result_one) {
    if (err) { console.error(err.message);
          doRelease(connection);
          return;
     }
    });
});
    doRelease(connection);    
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
res.json({Status:"Success",Message:"Data all Jobs Pulled", Data : {} ,Code:200});


});







router.post('/mobile/login_page', function (req, res) {

    console.log(req.body);

    
        service_user_management.findOne({user_mobile_no:req.body.user_mobile_no,user_password:req.body.user_password}, function (err, StateList) {
            if(StateList == null){
              res.json({Status:"Failed",Message:"Account not found", Data : {} ,Code:404});
            }else{


request.post(
    'http://smart.johnsonliftsltd.com:3000/api/preventive_service_data_management/fetch_data_from_oracle_mr_breakdown',
    { json: req.body},
    function (error, response, body) {
        if (!error && response.statusCode == 200) {
        }
    }
);


request.post(
    'http://smart.johnsonliftsltd.com:3000/api/lr_service_data_management/fetch_data_from_oracle_lr_service',
    { json: req.body},
    function (error, response, body) {
        if (!error && response.statusCode == 200) {
        }
    }
);



request.post(
    'http://smart.johnsonliftsltd.com:3000/api/audit_data_management/fetch_data_from_oracle_audit_service',
    { json: req.body},
    function (error, response, body) {
        if (!error && response.statusCode == 200) {
        }
    }
);


request.post(
    'http://smart.johnsonliftsltd.com:3000/api/part_replacement/fetch_data_from_oracle_part_replacement',
    { json: req.body},
    function (error, response, body) {
        if (!error && response.statusCode == 200) {
        }
    }
);


// request.post(
//     'http://smart.johnsonliftsltd.com:3000/api/service_userdetails/update_login_time',
//     { json: req.body},
//     function (error, response, body) {
//         if (!error && response.statusCode == 200) {
//         }
//     }
// );

console.log("Calling");


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
            "SELECT * from JLS_SERCALL_HDR_UPLOAD where SMU_SCH_SERTYPE in ('P','B') and SMU_SCH_DWNFLAG <> 'Y' and SMU_SCH_MECHCELL=:SMU_SCH_MECHCELL",
            { 
              SMU_SCH_MECHCELL:req.body.user_mobile_no
            },
        {autoCommit: true},
        function (err, result) {
    if (err) { console.error(err.message);
          doRelease(connection);
          return;
     }
var ary = [];
console.log(result.rows.length);
if(result.rows.length == 0){
 res.json({Status:"Success",Message:"User Details", Data : StateList ,Code:200});
}else{
for(let a = 0 ; a < result.rows.length; a++){
var temp_data = result.rows[a];
var results = {}
for (var i = 0; i < result.metaData.length; ++i){
results[result.metaData[i].name] = temp_data[i];
}
 // console.log(results);
request.post(
    'http://smart.johnsonliftsltd.com:3000/api/breakdown_management/create',
    { json: results},
    function (error, response, body) {
        if (!error && response.statusCode == 200) {
        }
    }
);



 // ary.push(results.length);
 if(a == result.rows.length - 1){
    // res.json({Status:"Success",Message:"Updated", Data : ary,Code:200}); 
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
            "UPDATE JLS_SERCALL_HDR_UPLOAD set SMU_SCH_DWNFLAG='Y', SMU_SCH_DWNFLAGDATE=:SMU_SCH_DWNFLAGDATE WHERE SMU_SCH_MECHCELL=:SMU_SCH_MECHCELL and SMU_SCH_SERTYPE in ('P','B') and SMU_SCH_DWNFLAG <> 'Y'",
            {
                SMU_SCH_DWNFLAGDATE : new Date(),
                SMU_SCH_MECHCELL : req.body.user_mobile_no,
            },
        {autoCommit: true},
        function (err, result_one) {
    if (err) { console.error(err.message);
          doRelease(connection);
          return;
     }
    });
});
    res.json({Status:"Success",Message:"User Details", Data : StateList ,Code:200});
    doRelease(connection);    
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
});


router.get('/reload_data2',async function (req, res) {
        var ref_code_details  =  await breakdown_managementModel.find({}).sort({index:1});
        for(let a  = 0; a < ref_code_details.length ; a ++){
         let d = {
            "JOB_STATUS": "Not Started",
            "JOB_VIEW_STATUS": "Not Viewed",
            "LAST_UPDATED_TIME": "Wed Sep 21 2022 13:58:06 GMT+0530 (India Standard Time)",
            "JOB_START_TIME": "",
            "JOB_END_TIME": "",
         }
         breakdown_managementModel.findByIdAndUpdate(ref_code_details[a]._id, d, {new: true}, function (err, UpdatedDetails) {
            if (err) return res.json({Status:"Failed",Message:"Internal Server Error", Data : {},Code:500});
        });
         if(a == ref_code_details.length - 1){
            res.json({Status:"Success",Message:"group_detailModel Updated", Data : {} ,Code:200});
         }
        }
});


router.post('/admin_delete', function (req, res) {
      service_user_management.findByIdAndRemove(req.body._id, function (err, user) {
          if (err) return res.json({Status:"Failed",Message:"Internal Server Error", Data : {},Code:500});
          res.json({Status:"Success",Message:"User management Deleted successfully", Data : {} ,Code:200});
      });
});




router.post('/search_service_employee', function (req, res) {
     console.log(req.body);
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
var ary = [];
console.log(result.rows.length);
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





router.post('/mainmenu_counts',async function (req, res) {
var bd_total_count  =  await service_employee_activity_allocationModel.count({employee_no:req.body.user_mobile_no});
        let a  = {
            services_count : bd_total_count,
            view_status : 0
        }
       res.json({Status:"Success",Message:"Main Menu Counts", Data : a ,Code:200});
});



router.post('/job_status_count',async function (req, res) {
 var bd_paused_count  =  await breakdown_managementModel.count({SMU_SCH_MECHCELL: req.body.user_mobile_no,JOB_STATUS:'Job Paused',SMU_SCH_SERTYPE : 'B'});
         
        let a  = {
            paused_count : bd_paused_count
        }
       res.json({Status:"Success",Message:"Job status count", Data : a ,Code:200});
});



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



router.post('/pause_job_list',async function (req, res) {
var job_details  =  await breakdown_managementModel.find({SMU_SCH_MECHCELL: req.body.user_mobile_no,JOB_STATUS:'Job Paused',SMU_SCH_SERTYPE:'B'});
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



router.post('/customer_details',async function (req, res) {
    console.log(req.body);
var job_details  =  await breakdown_managementModel.findOne({SMU_SCH_MECHCELL: req.body.user_mobile_no,SMU_SCH_JOBNO:req.body.job_id,SMU_SCH_SERTYPE:req.body.SMU_SCH_SERTYPE,SMU_SCH_COMPNO:req.body.SMU_SCH_COMPNO});
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
});




router.post('/check_work_status',async function (req, res) {
console.log("BreakDown Job Work Status",req.body);
var job_details  =  await breakdown_managementModel.findOne({SMU_SCH_MECHCELL: req.body.user_mobile_no,SMU_SCH_JOBNO:req.body.job_id,SMU_SCH_COMPNO:req.body.SMU_SCH_COMPNO,SMU_SCH_SERTYPE:req.body.SMU_SCH_SERTYPE});
       res.json({Status:"Success",Message:job_details.JOB_STATUS, Data : {} ,Code:200});
});




router.post('/job_work_status_update',async function (req, res) {
    console.log("BreakDown Job Update",req.body);

        var statuss = 0;
        var job_details  =  await breakdown_managementModel.findOne({SMU_SCH_MECHCELL: req.body.user_mobile_no,SMU_SCH_JOBNO:req.body.job_id,SMU_SCH_COMPNO:req.body.SMU_SCH_COMPNO,SMU_SCH_SERTYPE:req.body.SMU_SCH_SERTYPE});
        if(req.body.Status == 'Job Started'){
            let da = {
            JOB_STATUS : req.body.Status,
            JOB_VIEW_STATUS : "Viewed",
            JOB_START_TIME : ""+new Date(),
            JOB_END_TIME : ""+new Date(),
           
        }
         statuss = 1;
         breakdown_managementModel.findByIdAndUpdate(job_details._id, da, {new: true}, function (err, UpdatedDetails) {
            if (err) return res.json({Status:"Failed",Message:"Internal Server Error", Data : {},Code:500});
            res.json({Status:"Success",Message:"Update successfully", Data : {} ,Code:200});
         }); 
        }else if(req.body.Status == 'Job Stopped'){
            let da = {
            JOB_STATUS : req.body.Status,
            JOB_END_TIME : ""+new Date(),
           
        }
         statuss = 4;
         breakdown_managementModel.findByIdAndUpdate(job_details._id, da, {new: true}, function (err, UpdatedDetails) {
            if (err) return res.json({Status:"Failed",Message:"Internal Server Error", Data : {},Code:500});
            res.json({Status:"Success",Message:"Update successfully", Data : {} ,Code:200});
         }); 
        }else if(req.body.Status == 'Job Paused'){
            let da = {
            JOB_STATUS : req.body.Status,
            JOB_END_TIME : ""+new Date(),
           
        }
         statuss = 2;
         breakdown_managementModel.findByIdAndUpdate(job_details._id, da, {new: true}, function (err, UpdatedDetails) {
            if (err) return res.json({Status:"Failed",Message:"Internal Server Error", Data : {},Code:500});
            res.json({Status:"Success",Message:"Update successfully", Data : {} ,Code:200});
         }); 
        }  
        else if(req.body.Status == 'Job Resume'){
            let da = {
            JOB_STATUS : req.body.Status,
            JOB_END_TIME : ""+new Date(),
           
        }
         statuss = 3;
         breakdown_managementModel.findByIdAndUpdate(job_details._id, da, {new: true}, function (err, UpdatedDetails) {
            if (err) return res.json({Status:"Failed",Message:"Internal Server Error", Data : {},Code:500});
            res.json({Status:"Success",Message:"Update successfully", Data : {} ,Code:200});
         }); 
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




router.post('/bd_details_list', function (req, res) {
    console.log(req.body);
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




router.get('/bd_details_list', function (req, res) {
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
});



// router.get('/feedback_group_list', function (req, res) {   
// console.log("******",req.body);
// console.log("***********",req.body.job_id[0]);

// oracledb.getConnection({
//       user: "JLSMART",
//       password: "JLSMART",
//       connectString: "(DESCRIPTION =(ADDRESS = (PROTOCOL = TCP)(HOST = 192.168.1.112)(PORT = 1521))(CONNECT_DATA =(SID = jlpl)))"
// }, function(err, connection) {
// if (err) {
//     // console.error(err.message);
//     return;
// }
// // "SELECT * from SSM_SERCALL_HDR_UPLOAD where SMU_SCH_MECHCELL = '7358780824'  and SMU_SCH_DWNFLAG IS NULL",
// connection.execute(
//             "select * from COM_ACTIVITY_MST where CAM_ATY_STATUS = 'A' and CAM_ATY_APPTO =:type",
//             {type :req.body.job_id[0] },
//         {autoCommit: true},
//         function (err, result) {
//     if (err) { console.error(err.message);
//           doRelease(connection);
//           return;
//      }
// // console.log(result.rows.length);
// var ary = [];
// for(let a = 0 ; a < result.rows.length; a++){
// var temp_data = result.rows[a];
// var results = {}
// for (var i = 0; i < result.metaData.length; ++i){
// results[result.metaData[i].name] = temp_data[i];
// }
// ary.push(results);   
// if(a == result.rows.length - 1){
// // console.log(ary);
// let datasss = [];
// ary.forEach(element => {
//   datasss.push({
//             "codes" : element.CAM_ATY_CODE,
//             "title": element.CAM_ATY_DESC
//          })
// });
//     res.json({Status:"Success",Message:"Feedback group list", Data : datasss ,Code:200});
//     // res.json({Status:"Success",Message:"Updated", Data : ary,Code:200}); 
//     doRelease(connection);    
//  }
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
// });




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







router.post('/breakdown_data_submit',async function (req, res) {
console.log(req.body);
request.post(
    'http://smart.johnsonliftsltd.com:3000/api/breakdown_data_management/create',
    { json: req.body},
    function (error, response, body) {
        if (!error && response.statusCode == 200) {
        }
    }
);
var job_details_two  =  await breakdown_managementModel.findOne({SMU_SCH_MECHCELL: req.body.user_mobile_no,SMU_SCH_JOBNO:req.body.job_id,SMU_SCH_SERTYPE:req.body.SMU_SCH_SERTYPE,SMU_SCH_COMPNO:req.body.SMU_SCH_COMPNO});
// console.log(job_details_two);
job_details_two.JOB_START_TIME = new Date();
job_details_two.JOB_END_TIME = new Date();
var start_date = new Date(job_details_two.JOB_START_TIME).toISOString().slice(0, 10);
var start_time = new Date(job_details_two.JOB_START_TIME).toISOString().slice(11, 19);
const myArray1 = start_date.split("-");
var month_list = ["", "Jan", "Feb", "Mar", "Apr", "May", "Jun" ,"Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
start_date = ""+myArray1[2]+"-"+month_list[+myArray1[1]]+"-"+myArray1[0]
var end_date = new Date(job_details_two.JOB_END_TIME).toISOString().slice(0, 10);
var end_time = new Date(job_details_two.JOB_END_TIME).toISOString().slice(11, 19);
const myArray2 = end_date.split("-");
var month_list = ["", "Jan", "Feb", "Mar", "Apr", "May", "Jun" ,"Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
end_date = ""+myArray2[2]+"-"+month_list[+myArray2[1]]+"-"+myArray2[0]
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
    return;
}
connection.execute(
            "SELECT * from JLS_SERCALL_HDR_UPLOAD where SMU_SCH_SERTYPE = 'B'  and  SMU_SCH_JOBNO=:SMU_SCH_JOBNO and SMU_SCH_MECHCELL=:SMU_SCH_MECHCELL and SMU_SCH_COMPNO=:SMU_SCH_COMPNO",
            {
                SMU_SCH_JOBNO :req.body.job_id,
                SMU_SCH_MECHCELL : req.body.user_mobile_no,
                SMU_SCH_COMPNO : req.body.SMU_SCH_COMPNO
             },
        {autoCommit: true},
        function (err, result) {
    if (err) { console.error(err.message);
          doRelease(connection);
          return;
     }
     console.log("Start 1");
var ary = [];
for(let a = 0 ; a < result.rows.length; a++){
var temp_data = result.rows[a];
var results = {}
for (var i = 0; i < result.metaData.length; ++i){
results[result.metaData[i].name] = temp_data[i];
}
ary.push(results);   
if(a == result.rows.length - 1){
var job_details = ary[0];
///////Fetch Data of Job Details////////

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
// console.log(result.rows.length);
var ary = [];
for(let a = 0 ; a < result.rows.length; a++){
var temp_data = result.rows[a];
var results = {}
for (var i = 0; i < result.metaData.length; ++i){
results[result.metaData[i].name] = temp_data[i];
}
ary.push(results);   
if(a == result.rows.length - 1){
    // console.log(ary);
        // console.log(myArray);
       for(let c = 0 ; c < ary.length ; c++){
             for(let d = 0 ; d < myArray.length ; d++){
                  if(ary[c].CAM_ATY_CODE == myArray[d]){
                    console.log(ary[c]);
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
     // console.log(da);
      connection.execute(
            "INSERT INTO JLS_SERCALLHDR_FEEDBK VALUES (:JLS_SCHF_COMPNO, :JLS_SCHF_JOBNO, :JLS_SCHF_SERTYPE, :JLS_SCHF_CHKLISTTYPE, :JLS_SCHF_PARCODE, :JLS_SCHF_ACTCODE, :JLS_SCHF_FDBK_RMRKS, :JLS_SCHF_PMRMRKS, :JLS_SCHF_ORCL_STATUS)",
              da, // Bind values
              { autoCommit: true}, 
        function (err, result) {
    if (err) { console.error(err.message);
          doRelease(connection);
          return;
     }
     console.log("Inserted 1",result)
   });
   });
                  }
             }
     //////// Second Stage Completed ///////
     if(c == ary.length - 1){

 //////// Third Stage Completed ///////

if(""+req.body.mr_status.toUpperCase().substring(0, 1) !== 'N'){
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
        JLS_SCHM_DWNFLAG : "N"
    }
    // console.log(das);
      connection.execute(
            "INSERT INTO JLS_SERCALL_HDR_MR VALUES (:JLS_SCHM_COMPNO, :JLS_SCHM_JOBNO, :JLS_SCHM_SERTYPE, :JLS_SCHM_PREP_DATE, :JLS_SCHM_VAN_ID, :JLS_SCHM_STATUS, :JLS_SCHM_ORCL_STATUS, :JLS_SCHM_ENGR_PHONE, :JLS_SCHM_ENGR_FLAG, :JLS_SCHM_ERRDESC, :JLS_SCHM_AGENT_NAME, :JLS_SCHM_CUSTOMER_NAME, :JLS_SCHM_DWNFLAG)",
              das, // Bind values
              { autoCommit: true}, 
        function (err, result) {
    if (err) { console.error(err.message);
          doRelease(connection);
          return;
     }
     console.log("Inserted 2",result);
   });
   });
  }




 ////// four Stage Completed ///////
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
            "JLS_SCH_ACTION": "",
            "JLS_SCH_REMARKS": ""+req.body.feedback_remark_text,
            "JLS_SCH_MRTAG" : ""+req.body.mr_status.toUpperCase().substring(0, 1),

    }
    console.log(dass);
      connection.execute(
        "INSERT INTO JLS_SERCALL_HDR_DNLOAD VALUES (:JLS_SCH_COMPNO, :JLS_SCH_JOBNO, :JLS_SCH_SERTYPE, to_date(:JLS_SCH_JOBSTARTTIME, 'DD/MM/YYYY HH24:MI:SS'), to_date(:JLS_SCH_JOBENDTIME, 'DD/MM/YYYY HH24:MI:SS'), :JLS_SCH_COMPSTATUS, :JLS_SCH_TYP_BRKDWN, :JLS_SCH_ACTION, :JLS_SCH_REMARKS,:JLS_SCH_MRTAG)",
              dass, // Bind values
              { autoCommit: true}, 
        function (err, result) {
    if (err) { console.error(err.message);
          doRelease(connection);
          return;
     }
     console.log("Inserted 3",result);

   if(""+req.body.mr_status.toUpperCase().substring(0, 1) !== 'N'){
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
    }


     res.json({Status:"Success",Message:"breakdown data submit successfully", Data : {} ,Code:200});  


     doRelease(connection);
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
        function (err, result) {
    if (err) { console.error(err.message);
          doRelease(connection);
          return;
     }
     console.log("Inserted 4",result);
   });
   });
   }
   }
   });
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
 }
} 
});
});
});



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
    connection.execute(
            "select * from COM_ACTIVITY_MST where CAM_ATY_STATUS = 'A' and CAM_ATY_PCODE in ("+final_text+")",
            {},
        {autoCommit: true},
        function (err, result) {
    if (err) { console.error(err.message);
          doRelease(connection);
          return;
     }
     // console.log(result);
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


router.post('/service_list',async function (req, res) {
   var service_list_alloc  =  await service_employee_activity_allocationModel.find({employee_no:req.body.user_mobile_no});
     var count = 0;
     var a = [];
     if(service_list_alloc.length == 0){
        res.json({Status:"Success",Message:"Service List", Data : [] ,Code:200});
     } else {
          recall(service_list_alloc[count].activity_name);
     }
   async function recall(argument) {
   if(argument == 'Breakdown Serivce'){
   var bd_total_count  =  await breakdown_managementModel.find({'JOB_STATUS': {$nin : ["Job Submitted", "Job Paused"]},SMU_SCH_MECHCELL: req.body.user_mobile_no,SMU_SCH_SERTYPE : 'B'}).count();
   var bd_upload_count  =  await breakdown_managementModel.count({SMU_SCH_MECHCELL: req.body.user_mobile_no,JOB_STATUS:'Job Submitted',SMU_SCH_SERTYPE : 'B'});
   var bd_pending_count  =  await breakdown_managementModel.count({SMU_SCH_MECHCELL: req.body.user_mobile_no,JOB_STATUS:'Job Started',SMU_SCH_SERTYPE : 'B'});
   var bd_paused_count  =  await breakdown_managementModel.count({SMU_SCH_MECHCELL: req.body.user_mobile_no,JOB_STATUS:'Job Paused',SMU_SCH_SERTYPE : 'B'});
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
   var bd_total_count  =  await breakdown_managementModel.find({'JOB_STATUS': {$nin : ["Job Submitted", "Job Paused"]},SMU_SCH_MECHCELL: req.body.user_mobile_no,SMU_SCH_SERTYPE : 'P'}).count();
   var bd_upload_count  =  await breakdown_managementModel.count({SMU_SCH_MECHCELL: req.body.user_mobile_no,JOB_STATUS:'Job Submitted',SMU_SCH_SERTYPE : 'P'});
   var bd_pending_count  =  await breakdown_managementModel.count({SMU_SCH_MECHCELL: req.body.user_mobile_no,JOB_STATUS:'Job Started',SMU_SCH_SERTYPE : 'P'});
   var bd_paused_count  =  await breakdown_managementModel.count({SMU_SCH_MECHCELL: req.body.user_mobile_no,JOB_STATUS:'Job Paused',SMU_SCH_SERTYPE : 'P'});
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
   var bd_total_count  =  await breakdown_mr_data_managementModel.find({'JOB_STATUS': {$nin : ["Job Submitted", "Job Paused"]},JLS_SCHM_ENGR_PHONE: req.body.user_mobile_no,JLS_SCHM_SERTYPE : 'B'}).count();
   var bd_upload_count  =  await breakdown_mr_data_managementModel.count({JLS_SCHM_ENGR_PHONE: req.body.user_mobile_no,JOB_STATUS:'Job Submitted',JLS_SCHM_SERTYPE : 'B'});
   var bd_pending_count  =  await breakdown_mr_data_managementModel.count({JLS_SCHM_ENGR_PHONE: req.body.user_mobile_no,JOB_STATUS:'Job Started',JLS_SCHM_SERTYPE : 'B'});
   var bd_paused_count  =  await breakdown_mr_data_managementModel.count({JLS_SCHM_ENGR_PHONE: req.body.user_mobile_no,JOB_STATUS:'Job Paused',JLS_SCHM_SERTYPE : 'B'});
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
   var bd_total_count  =  await breakdown_mr_data_managementModel.find({'JOB_STATUS': {$nin : ["Job Submitted", "Job Paused"]},JLS_SCHM_ENGR_PHONE: req.body.user_mobile_no,JLS_SCHM_SERTYPE:'P'}).count();
   var bd_upload_count  =  await breakdown_mr_data_managementModel.count({JLS_SCHM_ENGR_PHONE: req.body.user_mobile_no,JOB_STATUS:'Job Submitted',JLS_SCHM_SERTYPE : 'P'});
   var bd_pending_count  =  await breakdown_mr_data_managementModel.count({JLS_SCHM_ENGR_PHONE: req.body.user_mobile_no,JOB_STATUS:'Job Started',JLS_SCHM_SERTYPE : 'P'});
   var bd_paused_count  =  await breakdown_mr_data_managementModel.count({JLS_SCHM_ENGR_PHONE: req.body.user_mobile_no,JOB_STATUS:'Job Paused',JLS_SCHM_SERTYPE : 'P'});
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
   var bd_total_count  =  await lr_service_managementModel.find({'JOB_STATUS': {$nin : ["Job Submitted", "Job Paused"]},SMU_SEN_MOBILENO: req.body.user_mobile_no}).count();
   var bd_upload_count  =  await lr_service_managementModel.count({SMU_SEN_MOBILENO: req.body.user_mobile_no,JOB_STATUS:'Job Submitted'});
   var bd_pending_count  =  await lr_service_managementModel.count({SMU_SEN_MOBILENO: req.body.user_mobile_no,JOB_STATUS:'Job Started'});
   var bd_paused_count  =  await lr_service_managementModel.count({SMU_SEN_MOBILENO: req.body.user_mobile_no,JOB_STATUS:'Job Paused'});
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
   var bd_total_count  =  await part_reply_service_managementModel.find({'JOB_STATUS': {$nin : ["Job Submitted", "Job Paused"]},SMU_ACK_MOBILENO: req.body.user_mobile_no}).count();
   var bd_upload_count  =  await part_reply_service_managementModel.count({SMU_ACK_MOBILENO: req.body.user_mobile_no,JOB_STATUS:'Job Submitted'});
   var bd_pending_count  =  await part_reply_service_managementModel.count({SMU_ACK_MOBILENO: req.body.user_mobile_no,JOB_STATUS:'Job Started'});
   var bd_paused_count  =  await part_reply_service_managementModel.count({SMU_ACK_MOBILENO: req.body.user_mobile_no,JOB_STATUS:'Job Paused'});
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
   var bd_total_count  =  await audit_data_managementModel.find({'JOB_STATUS': {$nin : ["Job Submitted", "Job Paused"]},OM_OSA_MOBILE: req.body.user_mobile_no}).count();
   var bd_upload_count  =  await audit_data_managementModel.count({OM_OSA_MOBILE: req.body.user_mobile_no,JOB_STATUS:'Job Submitted'});
   var bd_pending_count  =  await audit_data_managementModel.count({OM_OSA_MOBILE: req.body.user_mobile_no,JOB_STATUS:'Job Started'});
   var bd_paused_count  =  await audit_data_managementModel.count({OM_OSA_MOBILE: req.body.user_mobile_no,JOB_STATUS:'Job Paused'});
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
    

    if(service_list_alloc.length - 1 == count){
        numArray = a.sort(function (a, b) {  return a.index - b.index;  });
     res.json({Status:"Success",Message:"Service List", Data : numArray ,Code:200});
    } else {
          count = count + 1;
          recall(service_list_alloc[count].activity_name);
    }
    }   
});



router.post('/job_details_in_text',async function (req, res) {
    console.log(req.body);
    var job_details =  await breakdown_managementModel.findOne({SMU_SCH_COMPNO:req.body.SMU_SCH_COMPNO});
        let a  = {
                        text_value : "The work is completed in a satfisfactory manner and we hereby reqeust to accept the same for job ID : "+ job_details.SMU_SCH_JOBNO +" . Customer Name : "+  job_details.SMU_SCH_CUSNAME +" and BDNO : "+ job_details.SMU_SCH_COMPNO+".",
                 }       
       res.json({Status:"Success",Message:"Job Detail Text", Data : a ,Code:200});
});





router.post('/view_status', function (req, res) {
        let a  = [
               {

                status_title : "Pending Job",
                count : 1,
                service_list : [
                    {
                        service_name : 'Breakdown Serivce',
                        count : 0
                    },
                    {
                        service_name : 'LR SERVICE',
                        count : 0
                    },
                    {
                        service_name : 'Preventive Maintenance',
                        count : 0
                    },
                    {
                        service_name : 'Parts Replacement ACK',
                        count : 0
                    }
                ] 
               },
               {
                status_title : "Completed Job",
                count : 1,
                service_list : [
                    {
                        service_name : 'Breakdown Serivce',
                        count : 0
                    },
                    {
                        service_name : 'LR SERVICE',
                        count : 0
                    },
                    {
                        service_name : 'Preventive Maintenance',
                        count : 0
                    },
                    {
                        service_name : 'Parts Replacement ACK',
                        count : 0
                    }
                ] 
               },
               {
                status_title : "Error Job",
                count : 1,
                service_list : [
                    {
                        service_name : 'Breakdown Serivce',
                        count : 0
                    },
                    {
                        service_name : 'LR SERVICE',
                        count : 0
                    },
                    {
                        service_name : 'Preventive Maintenance',
                        count : 0
                    },
                    {
                        service_name : 'Parts Replacement ACK',
                        count : 0
                    }
                ] 
               }

        ]        
       res.json({Status:"Success",Message:"Service List", Data : a ,Code:200});
});



router.post('/fetch_service_repport', function (req, res) {
      let result =  {
           created : 20,
           mobile_status : 1000,
           completed :300,
           paused : 1670,
           not_attend : 200,
       }
       res.json({Status:"Success",Message:"Service Report", Data : result ,Code:200});
});






router.post('/eng_mrlist', function (req, res) {
       let result = [
          {
            title : 'Mr1',
            value : 'coil'
          },
          {
            title : 'Mr2',
            value : 'coli11'
          },{
            title : 'Mr3',
            value : ''
          },{
            title : 'Mr4',
            value : ''
          },{
            title : 'Mr5',
            value : 'colio'
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
       res.json({Status:"Success",Message:"Service Report", Data : result ,Code:200});
});



router.post('/eng_mrlist_submit', function (req, res) {
    console.log(req.body);
       res.json({Status:"Success",Message:"Data submitted successfully", Data : {} ,Code:200});
});






router.post('/attendnace_report', function (req, res) {
      if(req.body.date_type == "week"){
      let result =  [
           {
            title: "MON",
            count : 200
           },
            {
            title: "TUE",
            count : 3000
           },
            {
            title: "WEB",
            count : 100
           },
            {
            title: "THUS",
            count : 40
           },
            {
            title: "FRI",
            count : 6000
           },
            {
            title: "SAT",
            count : 200
           },
            {
            title: "SUN",
            count : 100
           }
       ]
       res.json({Status:"Success",Message:"Attendnace report", Data : result ,Code:200});
   }
   else if(req.body.date_type == "year"){
      let result =  [
           {
            title: "JAN",
            count : 200
           },
            {
            title: "FEB",
            count : 3000
           },
            {
            title: "MAR",
            count : 100
           },
            {
            title: "APR",
            count : 40
           },
            {
            title: "MAY",
            count : 6000
           },
            {
            title: "JUN",
            count : 200
           },
            {
            title: "JUL",
            count : 100
           },
            {
            title: "AUG",
            count : 100
           },
            {
            title: "SEP",
            count : 100
           },
            {
            title: "OCT",
            count : 100
           },
            {
            title: "NOV",
            count : 100
           },
            {
            title: "DEC",
            count : 100
           }
       ]
       res.json({Status:"Success",Message:"Attendnace report", Data : result ,Code:200});
   }
   else if(req.body.date_type == "month"){
      let result =  [
           {
            title: "1",
            count : 200
           },
            {
            title: "2",
            count : 3000
           },
            {
            title: "3",
            count : 100
           },
            {
            title: "4",
            count : 40
           },
            {
            title: "5",
            count : 6000
           },
            {
            title: "6",
            count : 200
           },
            {
            title: "7",
            count : 100
           },
            {
            title: "8",
            count : 100
           },
            {
            title: "9",
            count : 100
           },
            {
            title: "10",
            count : 100
           },
            {
            title: "11",
            count : 100
           },
            {
            title: "12",
            count : 100
           }
       ]
       res.json({Status:"Success",Message:"Attendnace report", Data : result ,Code:200});
   }
});









router.post('/update_login_time',async function (req, res) {
        var user_detail  =  await service_user_management.findOne({user_mobile_no: req.body.user_mobile_no});
        let a = {
            last_login_time : new Date().toLocaleString('en-US',{timeZone: 'Asia/Calcutta'}),
            user_type : "Log In"
           }
        service_user_management.findByIdAndUpdate(user_detail._id, a, {new: true}, function (err, UpdatedDetails) {
            if (err)return res.json({Status:"Failed",Message:"Internal Server Error", Data:err,Code:500});
             // res.json({Status:"Success",Message:"User management Updated", Data : UpdatedDetails ,Code:200});
        });
});





router.post('/update_logout_time',async function (req, res) {
        console.log(req.body);
        var user_detail  =  await service_user_management.findOne({user_mobile_no: req.body.user_mobile_no});
        let a = {
            last_logout_time : new Date().toLocaleString('en-US', {timeZone: 'Asia/Calcutta'}),
            user_type : "Log Out"
           }
        service_user_management.findByIdAndUpdate(user_detail._id, a, {new: true}, function (err, UpdatedDetails) {
            if (err)return res.json({Status:"Failed",Message:"Internal Server Error", Data:err,Code:500});    
// console.log(results);
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




router.post('/update_pause_resume_time',async function (req, res) {
        console.log("yyyyyyyyyyyyyyyy",req.body);
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
    console.log(da);
      connection.execute(
            "INSERT INTO PAUSE_RESUME_TIME (SERVICE_NAME, JOB_NO, COMPLAINT_NO, AGENT_NAME, EMP_ID, ACTIVITY_TIME, ACTION, AGENT_ID, ACTION_LOCATION, JOB_LOCATION) VALUES (:SERVICE_NAME, :JOB_NO, :COMPLAINT_NO, :AGENT_NAME, :EMP_ID, to_date(:ACTIVITY_TIME, 'DD/MM/YYYY HH24:MI:SS'),:ACTION,:AGENT_ID,'','' )",
              da, // Bind values
              { autoCommit: true}, 
        function (err, result) {
    if (err) { console.error(err.message);
          doRelease(connection);
          return;
     }
     console.log(result);
     res.json({Status:"Success",Message:"Request Send Successfully", Data : {},Code:200});
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



router.get('/getlist', function (req, res) {
        service_user_management.find({}, function (err, Functiondetails) {
          res.json({Status:"Success",Message:"User management", Data : Functiondetails ,Code:200});
        });
});


router.post('/update_att_orcal',async function (req, res) {
console.log("333333333333",req.body);
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
console.log(hh.slice(-2) + ":" + mm.slice(-2) + ":" + ss.slice(-2)); 
var time_diff = "+000000000 "+hh.slice(-2) + ":" + mm.slice(-2) + ":" + ss.slice(-2)+".000000000";
console.log(time_diff);
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
console.log("current date and time : " + value1,value2);



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
        }
        console.log(da);
      connection.execute(
            "INSERT INTO AGENTATTENDANCE(AGENTID, AGENTNAME, INTIME, OUTTIME, LOGOUTREASON, TIME_DIFFERENCE, LOCATION, EMPLOYEE_ID, LOGIN_LOCATION, AGENT_START_JOB_LOCATION, CORRECT_START_JOB_LOCATION, START_JOBID, LOGOUT_LOCATION, AGENT_STOP_JOB_LOCATION, CORRECT_STOP_JOB_LOCATION, STOP_JOBID) VALUES (:AGENTID, :AGENTNAME, to_date(:INTIME, 'DD/MM/YYYY HH24:MI:SS'), to_date(:OUTTIME, 'DD/MM/YYYY HH24:MI:SS'), :LOGOUTREASON,:TIME_DIFFERENCE,:LOCATION,:EMPLOYEE_ID,'','','','','','','','')",
              da, // Bind values
              { autoCommit: true}, 
        function (err, result) {
    if (err) { console.error(err.message);
          doRelease(connection);
          return;
     }
     console.log(result);
     res.json({Status:"Success",Message:"Request Send Successfully", Data : {},Code:200});
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



router.post('/edit', function (req, res) {
        service_user_management.findByIdAndUpdate(req.body._id, req.body, {new: true}, function (err, UpdatedDetails) {
            if (err)return res.json({Status:"Failed",Message:"Internal Server Error", Data:err,Code:500});
             res.json({Status:"Success",Message:"User management Updated", Data : UpdatedDetails ,Code:200});
        });
});
// // DELETES A USER FROM THE DATABASE
router.post('/delete', function (req, res) {
      service_user_management.findByIdAndRemove(req.body._id, function (err, user) {
          if (err) return res.json({Status:"Failed",Message:"Internal Server Error", Data : {},Code:500});
          res.json({Status:"Success",Message:"User management Deleted successfully", Data : {} ,Code:200});
      });
});
module.exports = router;
