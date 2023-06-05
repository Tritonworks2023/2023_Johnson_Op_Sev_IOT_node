var express = require('express');
var router = express.Router();
var bodyParser = require('body-parser');
router.use(bodyParser.urlencoded({ extended: false }));
router.use(bodyParser.json());
var breakdown_managementModel = require('./../models/breakdown_managementModel');
var breakdown_mr_data_managementModel = require('./../models/breakdown_mr_data_managementModel');

var oracledb = require('oracledb');

router.post('/create', async function(req, res) {
var user_detail  =  await breakdown_managementModel.findOne({SMU_SCH_JOBNO : req.body.SMU_SCH_JOBNO,SMU_SCH_MECHANIC : req.body.SMU_SCH_MECHANIC,SMU_SCH_SERTYPE : req.body.SMU_SCH_SERTYPE,SMU_SCH_COMPNO : req.body.SMU_SCH_COMPNO});
 if(user_detail == null){
  try{
        await breakdown_managementModel.create({
SMU_SCH_COMPNO : req.body.SMU_SCH_COMPNO,
SMU_SCH_COMPDT : req.body.SMU_SCH_COMPDT,
SMU_SCH_JOBNO : req.body.SMU_SCH_JOBNO,
SMU_SCH_BRCODE : req.body.SMU_SCH_BRCODE,
SMU_SCH_REPORTBY : req.body.SMU_SCH_REPORTBY,
SMU_SCH_REPORTCELL : req.body.SMU_SCH_REPORTCELL,
SMU_SCH_BRKDOWNTYPE : req.body.SMU_SCH_BRKDOWNTYPE,
SMU_SCH_BRKDOWNDESC : req.body.SMU_SCH_BRKDOWNDESC,
SMU_SCH_ROUTECODE : req.body.SMU_SCH_ROUTECODE,
SMU_SCH_MECHANIC : req.body.SMU_SCH_MECHANIC,
SMU_SCH_DEPUTEDDT : req.body.SMU_SCH_DEPUTEDDT,
SMU_SCH_CRTDT  : req.body.SMU_SCH_CRTDT,
SMU_SCH_STATUS : req.body.SMU_SCH_STATUS,
SMU_SCH_EMPCODE : req.body.SMU_SCH_EMPCODE,
SMU_SCH_SERTYPE : req.body.SMU_SCH_SERTYPE,
SMU_SCH_CONTNO : req.body.SMU_SCH_CONTNO, 
SMU_SCH_DWNFLAG : req.body.SMU_SCH_DWNFLAG,
SMU_SCH_CANCFLAG : req.body.SMU_SCH_CANCFLAG,
SMU_SCH_DWNFLAGDATE : req.body.SMU_SCH_DWNFLAGDATE,
SMU_SCH_CUSCODE : req.body.SMU_SCH_CUSCODE,
SMU_SCH_CUSNAME : req.body.SMU_SCH_CUSNAME, 
SMU_SCH_CUSADD1  : req.body.SMU_SCH_CUSADD1,
SMU_SCH_CUSADD2  : req.body.SMU_SCH_CUSADD2,
SMU_SCH_CUSADD3 : req.body.SMU_SCH_CUSADD3,
SMU_SCH_CUSADD4  : req.body.SMU_SCH_CUSADD4,
SMU_SCH_CUSPIN : req.body.SMU_SCH_CUSPIN,
SMU_SCH_MECHCELL : req.body.SMU_SCH_MECHCELL,
SMU_SCH_AMCTYPE  : req.body.SMU_SCH_AMCTYPE,
SMU_SCH_AMCTODT : req.body.SMU_SCH_AMCTODT,
SMU_SCH_VANID  : req.body.SMU_SCH_VANID,
SSM_SCH_APPTO : req.body.SSM_SCH_APPTO,
SMU_SCH_SUPCELLNO : req.body.SMU_SCH_SUPCELLNO,
SMU_SCH_JOBCURSTATUS : req.body.SMU_SCH_JOBCURSTATUS,
SMU_SCH_MODDT : req.body.SMU_SCH_MODDT,
SMU_SCH_ERRDESC : req.body.SMU_SCH_ERRDESC,
SMU_SCH_DOORTYPE : req.body.SMU_SCH_DOORTYPE,
SMU_SCH_CHKLIST : "NO",
JOB_STATUS : 'Not Started',
JOB_VIEW_STATUS : 'Not Viewed',
LAST_UPDATED_TIME : ""+new Date(),
JOB_START_TIME : "",
JOB_END_TIME : "",
JOB_LOCATION : "",
JOB_START_LAT : "",
JOB_START_LONG : "",
        }, 
        function (err, user) {

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
                SMU_SCH_COMPNO : req.body.SMU_SCH_COMPNO,
            },
        {autoCommit: true},
        function (err, result_one) {
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


        });
}
catch(e){
      res.json({Status:"Failed",Message:"Internal Server Error", Data : {},Code:500});
}
}
else{
   res.json({Status:"Success",Message:"Added successfully", Data : {} ,Code:200}); 
}

});


router.get('/deletes', function (req, res) {
      breakdown_managementModel.remove({}, function (err, user) {
          if (err) return res.status(500).send("There was a problem deleting the user.");
             res.json({Status:"Success",Message:"breakdown_managementModel Deleted", Data : {} ,Code:200});     
      });
});


router.post('/getlist_id', function (req, res) {
        breakdown_managementModel.find({SMU_SCH_JOBNO:req.body.job_id}, function (err, StateList) {
          res.json({Status:"Success",Message:"State List", Data : StateList ,Code:200});
        });
});


// ******************************************************************************************************************************************************************************
// SERVICE BREAKDOWN DETAILS DATE WISE FILTER
// ******************************************************************************************************************************************************************************
router.post('/bd_date_wise_filter',async function (req, res) {
var job_details  =  await breakdown_managementModel.find({SMU_SCH_SERTYPE : 'B'});
let a = [];
  // console.log(req.body);
job_details.forEach(element => {
  var check = new Date(element.SMU_SCH_COMPDT);
  var from = new Date(req.body.from_date);
  var to = new Date(req.body.to_date);
  if(check > from && check < to){
   if(element.JOB_STATUS == "Job Started" || element.JOB_STATUS == "Job Stopped" || element.JOB_STATUS == "Not Started" || element.JOB_STATUS == "Job Paused"){
  a.push({
            job_id : element.SMU_SCH_JOBNO,
            customer_name : element.SMU_SCH_CUSNAME,
            pm_date : element.SMU_SCH_COMPDT.substring(0, 10),
            SMU_SCH_BRCODE :element.SMU_SCH_BRCODE,
            SMU_SCH_MECHCELL :element.SMU_SCH_MECHCELL,
            status : "Active",
            JOB_STATUS: element.JOB_STATUS,
            SMU_SCH_COMPNO: element.SMU_SCH_COMPNO,
            SMU_SCH_SERTYPE : element.SMU_SCH_SERTYPE,
            _id : element._id,
            delete_status : false
  });
   }
}
});
res.json({Status:"Success",Message:"New Job List", Data : a ,Code:200});
});



// ******************************************************************************************************************************************************************************
// SERVICE FETCH PREVENTIVE DETAILS DATE FILTER - ADMIN PANEL
// ******************************************************************************************************************************************************************************

router.post('/pm_date_wise_filter',async function (req, res) {
var job_details  =  await breakdown_managementModel.find({SMU_SCH_SERTYPE : 'P'});
let a = [];
  // console.log(req.body);
job_details.forEach(element => {
  var check = new Date(element.SMU_SCH_COMPDT);
  var from = new Date(req.body.from_date);
  var to = new Date(req.body.to_date);
  if(check > from && check < to){
   if(element.JOB_STATUS == "Job Started" || element.JOB_STATUS == "Job Stopped" || element.JOB_STATUS == "Not Started" || element.JOB_STATUS == "Job Paused"){
  a.push({
            job_id : element.SMU_SCH_JOBNO,
            customer_name : element.SMU_SCH_CUSNAME,
            pm_date : element.SMU_SCH_COMPDT.substring(0, 10),
            SMU_SCH_BRCODE :element.SMU_SCH_BRCODE,
            SMU_SCH_MECHCELL :element.SMU_SCH_MECHCELL,
            status : "Active",
            JOB_STATUS: element.JOB_STATUS,
            SMU_SCH_COMPNO: element.SMU_SCH_COMPNO,
            SMU_SCH_SERTYPE : element.SMU_SCH_SERTYPE,
            _id : element._id,
            delete_status : false
  });
   }
}
});
res.json({Status:"Success",Message:"New Job List", Data : a ,Code:200});
});




router.post('/fetch_job_id', function (req, res) {
        breakdown_managementModel.find({SMU_SCH_JOBNO : req.body.job_id}, function (err, StateList) {
          res.json({Status:"Success",Message:"Break Down Details", Data : StateList ,Code:200});
        });
});




router.post('/fetch_comp_id', function (req, res) {
        breakdown_managementModel.find({SMU_SCH_COMPNO : req.body.job_id}, function (err, StateList) {
          res.json({Status:"Success",Message:"Break Down Details", Data : StateList ,Code:200});
        });
});



router.get('/getlist', function (req, res) {
        breakdown_managementModel.find({}, function (err, Functiondetails) {
          res.json({Status:"Success",Message:"Functiondetails", Data : Functiondetails ,Code:200});
        });
});


// ******************************************************************************************************************************************************************************
// SERVICE FETCH BREAKDOWN SUBMITTED DETAILS - ADMIN PANEL
// ******************************************************************************************************************************************************************************

router.get('/getlist_completed_bd', function (req, res) {
        breakdown_managementModel.find({JOB_STATUS : 'Job Submitted',SMU_SCH_SERTYPE:"B"}, function (err, Functiondetails) {
          res.json({Status:"Success",Message:"Functiondetails", Data : Functiondetails ,Code:200});
        });
});


// ******************************************************************************************************************************************************************************
// SERVICE FETCH BREAKDOWN DETAILS BASED ON LOCATION - ADMIN PANEL
// ******************************************************************************************************************************************************************************

router.post('/getlist_completed_bd_location', function (req, res) {
   let a = [];
   req.body.access_location.forEach(function(element) {
   a.push(element.branch_code);
   });
        breakdown_managementModel.find({JOB_STATUS : 'Job Submitted',SMU_SCH_SERTYPE:"B",SMU_SCH_BRCODE:{$in:a}}, function (err, Functiondetails) {
          res.json({Status:"Success",Message:"Functiondetails", Data : Functiondetails ,Code:200});
        });
});


// ******************************************************************************************************************************************************************************
// SERVICE FETCH PREVENTIVE SUBMITTED DETAILS - ADMIN PANEL
// ******************************************************************************************************************************************************************************

router.get('/getlist_completed_pm', function (req, res) {
        breakdown_managementModel.find({JOB_STATUS : 'Job Submitted',SMU_SCH_SERTYPE :"P"}, function (err, Functiondetails) {
          res.json({Status:"Success",Message:"Functiondetails", Data : Functiondetails ,Code:200});
        });
});


// ******************************************************************************************************************************************************************************
// SERVICE FETCH PREVENTIVE DETAILS BASED ON LOCATION - ADMIN PANEL
// ******************************************************************************************************************************************************************************

router.post('/getlist_completed_pm_location', function (req, res) {
   let a = [];
   req.body.access_location.forEach(function(element) {
   a.push(element.branch_code);
   });

        breakdown_managementModel.find({JOB_STATUS : 'Job Submitted',SMU_SCH_SERTYPE :"P",SMU_SCH_BRCODE:{$in:a}}, function (err, Functiondetails) {
          res.json({Status:"Success",Message:"Functiondetails", Data : Functiondetails ,Code:200});
        });
});




// router.post('/deletes_value',async function (req, res) {
//     var user_detail  =  await breakdown_managementModel.find({"SMU_SCH_MECHCELL": "7358386527","SMU_SCH_SERTYPE": "P"});
//     for(let a = 0; a < user_detail.length ; a++){
//         breakdown_managementModel.findByIdAndRemove(user_detail[a]._id, function (err, user) {
//           if (err) return res.json({Status:"Failed",Message:"Internal Server Error", Data : {},Code:500});
//           // res.json({Status:"Success",Message:"SubFunction Deleted successfully", Data : {} ,Code:200});
//       });
//         if(a == user_detail.length - 1){
//             res.json({Status:"Success",Message:"Functiondetails Updated", Data :  user_detail.length ,Code:200});
//         }
//     }    
// });


// router.post('/report/breakdown_detail_graph',async function (req, res) {
//        var bd_b_total_count  =  await breakdown_managementModel.find({'JOB_STATUS': {$in : ["Not Started"]}}).count();
//        var bd_b_total_count  =  await breakdown_managementModel.find({'JOB_STATUS': {$in : ["Job Started"]}}).count();
//        var bd_b_total_count  =  await breakdown_managementModel.find({'JOB_STATUS': {$in : ["Job Submitted"]}}).count();
//        var bd_b_total_count  =  await breakdown_managementModel.find({'JOB_STATUS': {$in : ["Job Paused"]}}).count();
//       let a =  {
//           Not_Started : 120,
//           Job_Started : 10,
//           Job_Submitted : 200,
//           Job_Paused : 20
//       }
//       res.json({Status:"Success",Message:"Functiondetails", Data : a ,Code:200});
// });


// ******************************************************************************************************************************************************************************
// SERVICE FETCH BREAKDOWN DETAILS FOR GRAPH - ADMIN PANEL
// ******************************************************************************************************************************************************************************

router.post('/report/breakdown_detail_graph',async function (req, res) {
  if(req.body.user_type == 'Admin'){
       var bd_b_total_count  =  await breakdown_managementModel.find({"SMU_SCH_SERTYPE":"B",'JOB_STATUS': {$in : ["Not Started" , "Job Started","Job Submitted","Job Paused"]}});
       var b = {
          Not_Started : 0,
          Job_Started : 0,
          Job_Submitted : 0,
          Job_Paused : 0,
          total_coutn : 0
        };
        if(bd_b_total_count.length == 0){
            res.json({Status:"Success",Message:"Functiondetails", Data : b ,Code:200});
        }else{
        for(let a = 0 ; a < bd_b_total_count.length ; a++){
             if(bd_b_total_count[a].JOB_STATUS == "Not Started"){
                    var from  = new Date(req.body.start_date);
                    var to = new Date(req.body.end_date);
                    var check =  new Date(bd_b_total_count[a].LAST_UPDATED_TIME);
                    if(check > from && check < to) {
                      b.Not_Started = b.Not_Started + 1;
                    }  
             }
             else if(bd_b_total_count[a].JOB_STATUS == "Job Started"){
                    var from  = new Date(req.body.start_date);
                    var to = new Date(req.body.end_date);
                    var check =  new Date(bd_b_total_count[a].JOB_START_TIME);
                    if(check > from && check < to) {
                      b.Job_Started = b.Job_Started + 1;
                    }  
             }
             else if(bd_b_total_count[a].JOB_STATUS == "Job Submitted"){
                    var from  = new Date(req.body.start_date);
                    var to = new Date(req.body.end_date);
                    var check =  new Date(bd_b_total_count[a].JOB_END_TIME);
                    if(check > from && check < to) {
                      b.Job_Submitted = b.Job_Submitted + 1;
                    }  
             }
             else if(bd_b_total_count[a].JOB_STATUS == "Job Paused"){
                    var from  = new Date(req.body.start_date);
                    var to = new Date(req.body.end_date);
                    var check =  new Date(bd_b_total_count[a].LAST_UPDATED_TIME);
                    if(check > from && check < to) {
                      b.Job_Paused = b.Job_Paused + 1;
                    }  
             }
        if(a ==  bd_b_total_count.length - 1){
             b.total_coutn = b.Not_Started + b.Job_Started + b.Job_Submitted + b.Job_Paused ;
           res.json({Status:"Success",Message:"Functiondetails", Data : b ,Code:200});
        }
        }
    }
  } else {

    let a = [];
    req.body.access_location.forEach(function(element) {
    a.push(element.branch_code);
    });
    var bd_b_total_count  =  await breakdown_managementModel.find({"SMU_SCH_SERTYPE":"B",'SMU_SCH_BRCODE':{$in:a},'JOB_STATUS': {$in : ["Not Started" , "Job Started","Job Submitted","Job Paused"]}});
    var b = {
       Not_Started : 0,
       Job_Started : 0,
       Job_Submitted : 0,
       Job_Paused : 0,
       total_coutn : 0
     };
     if(bd_b_total_count.length == 0){
         res.json({Status:"Success",Message:"Functiondetails", Data : b ,Code:200});
     }else{
     for(let a = 0 ; a < bd_b_total_count.length ; a++){
          if(bd_b_total_count[a].JOB_STATUS == "Not Started"){
                 var from  = new Date(req.body.start_date);
                 var to = new Date(req.body.end_date);
                 var check =  new Date(bd_b_total_count[a].LAST_UPDATED_TIME);
                 if(check > from && check < to) {
                   b.Not_Started = b.Not_Started + 1;
                 }  
          }
          else if(bd_b_total_count[a].JOB_STATUS == "Job Started"){
                 var from  = new Date(req.body.start_date);
                 var to = new Date(req.body.end_date);
                 var check =  new Date(bd_b_total_count[a].JOB_START_TIME);
                 if(check > from && check < to) {
                   b.Job_Started = b.Job_Started + 1;
                 }  
          }
          else if(bd_b_total_count[a].JOB_STATUS == "Job Submitted"){
                 var from  = new Date(req.body.start_date);
                 var to = new Date(req.body.end_date);
                 var check =  new Date(bd_b_total_count[a].JOB_END_TIME);
                 if(check > from && check < to) {
                   b.Job_Submitted = b.Job_Submitted + 1;
                 }  
          }
          else if(bd_b_total_count[a].JOB_STATUS == "Job Paused"){
                 var from  = new Date(req.body.start_date);
                 var to = new Date(req.body.end_date);
                 var check =  new Date(bd_b_total_count[a].LAST_UPDATED_TIME);
                 if(check > from && check < to) {
                   b.Job_Paused = b.Job_Paused + 1;
                 }  
          }
     if(a ==  bd_b_total_count.length - 1){
         b.total_coutn = b.Not_Started + b.Job_Started + b.Job_Submitted + b.Job_Paused ;
        res.json({Status:"Success",Message:"Functiondetails", Data : b ,Code:200});
     }
     }
 }
  }
});


// ******************************************************************************************************************************************************************************
// SERVICE BREAKDOWN DETAILS GRPAH LIST - ADMIN PANEL
// ******************************************************************************************************************************************************************************

router.post('/report/breakdown_detail_list',async function (req, res) {
       if(req.body.user_type == 'Admin'){
       if(req.body.status == 'Not Started'){
       var bd_b_total_count  =  await breakdown_managementModel.find({"SMU_SCH_SERTYPE":"B",'JOB_STATUS': {$in : ["Not Started"]}});
       var final_data = []; 
       if(bd_b_total_count.length == 0){
        res.json({Status:"Success",Message:"Not Started List", Data : [],Code:200}); 
       }else {
       for(let a = 0 ; a < bd_b_total_count.length ; a++){
                    var from  = new Date(req.body.start_date);
                    var to = new Date(req.body.end_date);
                    var check =  new Date(bd_b_total_count[a].LAST_UPDATED_TIME);
                    if(check > from && check < to) {
                        final_data.push(bd_b_total_count[a]);
                    }  
        if(a == bd_b_total_count.length - 1){
           res.json({Status:"Success",Message:"Not Started List", Data : final_data,Code:200}); 
        }
       }
       }
       }else if(req.body.status == 'Job Started'){
       var bd_b_total_count  =  await breakdown_managementModel.find({"SMU_SCH_SERTYPE":"B",'JOB_STATUS': {$in : ["Job Started"]}});
       var final_data = []; 
       if(bd_b_total_count.length == 0){
        res.json({Status:"Success",Message:"Job Started List", Data : [],Code:200}); 
       }else {
       for(let a = 0 ; a < bd_b_total_count.length ; a++){
                    var from  = new Date(req.body.start_date);
                    var to = new Date(req.body.end_date);
                    var check =  new Date(bd_b_total_count[a].JOB_START_TIME);
                    if(check > from && check < to) {
                        final_data.push(bd_b_total_count[a]);
                    }  
        if(a == bd_b_total_count.length - 1){
           res.json({Status:"Success",Message:"Job Started List", Data : final_data,Code:200}); 
        }
       }
       }
       }else if(req.body.status == 'Job Submitted'){
       var bd_b_total_count  =  await breakdown_managementModel.find({"SMU_SCH_SERTYPE":"B",'JOB_STATUS': {$in : ["Job Submitted"]}});
       var final_data = []; 
       if(bd_b_total_count.length == 0){
        res.json({Status:"Success",Message:"Job Submitted List", Data : [],Code:200}); 
       }else {
       for(let a = 0 ; a < bd_b_total_count.length ; a++){
                    var from  = new Date(req.body.start_date);
                    var to = new Date(req.body.end_date);
                    var check =  new Date(bd_b_total_count[a].JOB_END_TIME);
                    if(check > from && check < to) {
                        final_data.push(bd_b_total_count[a]);
                    }  
        if(a == bd_b_total_count.length - 1){
           res.json({Status:"Success",Message:"Job Submitted List", Data : final_data,Code:200}); 
        }
       }
       }
       }
       else if(req.body.status == 'Job Paused'){
       var bd_b_total_count  =  await breakdown_managementModel.find({"SMU_SCH_SERTYPE":"B",'JOB_STATUS': {$in : ["Job Paused"]}});
       var final_data = []; 
       if(bd_b_total_count.length == 0){
        res.json({Status:"Success",Message:"Job Paused List", Data : [],Code:200}); 
       }else {
       for(let a = 0 ; a < bd_b_total_count.length ; a++){
                    var from  = new Date(req.body.start_date);
                    var to = new Date(req.body.end_date);
                    var check =  new Date(bd_b_total_count[a].LAST_UPDATED_TIME);
                    if(check > from && check < to) {
                        final_data.push(bd_b_total_count[a]);
                    }  
        if(a == bd_b_total_count.length - 1){
           res.json({Status:"Success",Message:"Job Paused List", Data : final_data,Code:200}); 
        }
       }
        }
       }
        else if(req.body.status == 'Total Job'){
       var bd_b_total_count  =  await breakdown_managementModel.find({"SMU_SCH_SERTYPE":"B",'JOB_STATUS': {$in : ["Not Started","Job Started","Job Submitted","Job Paused"]}});
       var final_data = []; 
       if(bd_b_total_count.length == 0){
        res.json({Status:"Success",Message:"Job Paused List", Data : [],Code:200}); 
       }else {
       for(let a = 0 ; a < bd_b_total_count.length ; a++){
                    var from  = new Date(req.body.start_date);
                    var to = new Date(req.body.end_date);
                    var check =  new Date(bd_b_total_count[a].LAST_UPDATED_TIME);
                    if(check > from && check < to) {
                        final_data.push(bd_b_total_count[a]);
                    }  
        if(a == bd_b_total_count.length - 1){
           res.json({Status:"Success",Message:"Job Paused List", Data : final_data,Code:200}); 
        }
       }
        }
       }

      }
      
      else {
    let loc = [];
    req.body.access_location.forEach(function(element) {
    loc.push(element.branch_code);
    });


    if(req.body.status == 'Not Started'){
      var bd_b_total_count  =  await breakdown_managementModel.find({"SMU_SCH_SERTYPE":"B",'SMU_SCH_BRCODE':{$in:loc},'JOB_STATUS': {$in : ["Not Started"]}});
      var final_data = []; 
      if(bd_b_total_count.length == 0){
       res.json({Status:"Success",Message:"Not Started List", Data : [],Code:200}); 
      }else {
      for(let a = 0 ; a < bd_b_total_count.length ; a++){
                   var from  = new Date(req.body.start_date);
                   var to = new Date(req.body.end_date);
                   var check =  new Date(bd_b_total_count[a].LAST_UPDATED_TIME);
                   if(check > from && check < to) {
                       final_data.push(bd_b_total_count[a]);
                   }  
       if(a == bd_b_total_count.length - 1){
          res.json({Status:"Success",Message:"Not Started List", Data : final_data,Code:200}); 
       }
      }
      }
      }else if(req.body.status == 'Job Started'){
      var bd_b_total_count  =  await breakdown_managementModel.find({"SMU_SCH_SERTYPE":"B",'SMU_SCH_BRCODE':{$in:loc},'JOB_STATUS': {$in : ["Job Started"]}});
      var final_data = []; 
      if(bd_b_total_count.length == 0){
       res.json({Status:"Success",Message:"Job Started List", Data : [],Code:200}); 
      }else {
      for(let a = 0 ; a < bd_b_total_count.length ; a++){
                   var from  = new Date(req.body.start_date);
                   var to = new Date(req.body.end_date);
                   var check =  new Date(bd_b_total_count[a].JOB_START_TIME);
                   if(check > from && check < to) {
                       final_data.push(bd_b_total_count[a]);
                   }  
       if(a == bd_b_total_count.length - 1){
          res.json({Status:"Success",Message:"Job Started List", Data : final_data,Code:200}); 
       }
      }
      }
      }else if(req.body.status == 'Job Submitted'){
      var bd_b_total_count  =  await breakdown_managementModel.find({"SMU_SCH_SERTYPE":"B",'SMU_SCH_BRCODE':{$in:loc},'JOB_STATUS': {$in : ["Job Submitted"]}});
      var final_data = []; 
      if(bd_b_total_count.length == 0){
       res.json({Status:"Success",Message:"Job Submitted List", Data : [],Code:200}); 
      }else {
      for(let a = 0 ; a < bd_b_total_count.length ; a++){
                   var from  = new Date(req.body.start_date);
                   var to = new Date(req.body.end_date);
                   var check =  new Date(bd_b_total_count[a].JOB_END_TIME);
                   if(check > from && check < to) {
                       final_data.push(bd_b_total_count[a]);
                   }  
       if(a == bd_b_total_count.length - 1){
          res.json({Status:"Success",Message:"Job Submitted List", Data : final_data,Code:200}); 
       }
      }
      }
      }
      else if(req.body.status == 'Job Paused'){
      var bd_b_total_count  =  await breakdown_managementModel.find({"SMU_SCH_SERTYPE":"B",'SMU_SCH_BRCODE':{$in:loc},'JOB_STATUS': {$in : ["Job Paused"]}});
      var final_data = []; 
      if(bd_b_total_count.length == 0){
       res.json({Status:"Success",Message:"Job Paused List", Data : [],Code:200}); 
      }else {
      for(let a = 0 ; a < bd_b_total_count.length ; a++){
                   var from  = new Date(req.body.start_date);
                   var to = new Date(req.body.end_date);
                   var check =  new Date(bd_b_total_count[a].LAST_UPDATED_TIME);
                   if(check > from && check < to) {
                       final_data.push(bd_b_total_count[a]);
                   }  
       if(a == bd_b_total_count.length - 1){
          res.json({Status:"Success",Message:"Job Paused List", Data : final_data,Code:200}); 
       }
      }
       }
      }






      }
});





// ******************************************************************************************************************************************************************************
// SERVICE EDIT BREAKDOWN DETAILS - ADMIN PANE
// ******************************************************************************************************************************************************************************
router.post('/edit', function (req, res) {
        breakdown_managementModel.findByIdAndUpdate(req.body._id, req.body, {new: true}, function (err, UpdatedDetails) {
            if (err) return res.json({Status:"Failed",Message:"Internal Server Error", Data : {},Code:500});
             res.json({Status:"Success",Message:"Functiondetails Updated", Data : UpdatedDetails ,Code:200});
        });
});
// // DELETES A USER FROM THE DATABASE
router.post('/delete', function (req, res) {
      breakdown_managementModel.findByIdAndRemove(req.body._id, function (err, user) {
          if (err) return res.json({Status:"Failed",Message:"Internal Server Error", Data : {},Code:500});
          res.json({Status:"Success",Message:"SubFunction Deleted successfully", Data : {} ,Code:200});
      });
});
module.exports = router;
