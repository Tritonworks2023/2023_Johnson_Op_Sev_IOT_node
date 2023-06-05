var express = require('express');
var router = express.Router();
var bodyParser = require('body-parser');
router.use(bodyParser.urlencoded({ extended: false }));
router.use(bodyParser.json());
var preventive_data_managementModel = require('./../models/preventive_data_managementModel');
var breakdown_managementModel = require('./../models/breakdown_managementModel');

const dates = require('date-and-time');
const now1  =  new Date();
const value1 = dates.format(now1,'YYYY-MM-DDTHH:mm:ss');




router.post('/create',async function(req, res) {
var job_details_two  =  await breakdown_managementModel.findOne({SMU_SCH_MECHCELL: req.body.user_mobile_no,SMU_SCH_COMPNO:req.body.SMU_SCH_COMPNO});
  try{
  await preventive_data_managementModel.create({
  SMU_SCH_COMPNO  : req.body.SMU_SCH_COMPNO,
  SMU_SCH_SERTYPE  : req.body.SMU_SCH_SERTYPE,
  action_req_customer:  req.body.action_req_customer,
  customer_name : req.body.customer_name,
  customer_number : req.body.customer_number,
  customer_signature : req.body.customer_signature,
  field_value : req.body.field_value,
  job_id : req.body.job_id,
  job_status_type : req.body.job_status_type,
  mr_1 : req.body.mr_1,
  mr_2 : req.body.mr_2,
  mr_3 : req.body.mr_3,
  mr_4 : req.body.mr_4,
  mr_5 : req.body.mr_5,
  mr_6 : req.body.mr_6,
  mr_7 : req.body.mr_7,
  mr_8 : req.body.mr_8,
  mr_9 : req.body.mr_9,
  mr_10 :req.body.mr_10,
  mr_status : req.body.mr_status,
  pm_status : req.body.pm_status,
  preventive_check : req.body.preventive_check,
  tech_signature : req.body.tech_signature,
  user_mobile_no : req.body.user_mobile_no
        },async function (err, user) {
       let datas = {
            JOB_END_TIME : ""+value1,
            JOB_STATUS : "Job Submitted",
            SMU_SCH_CHKLIST : ""+req.body.mr_status.toUpperCase(),
       }
        breakdown_managementModel.findByIdAndUpdate(job_details_two._id, datas, {new: true}, function (err, UpdatedDetails) {
            if (err) return res.json({Status:"Failed",Message:"Internal Server Error", Data : {},Code:500});
        });
        });
}
catch(e){
      res.json({Status:"Failed",Message:"Internal Server Error", Data : {},Code:500});
}
});





router.post('/service_mr_job_status_count', function (req, res) {
      // var bd_paused_count  =  await breakdown_managementModel.count({SMU_SCH_MECHCELL: req.body.user_mobile_no,JOB_STATUS:'Job Paused',SMU_SCH_SERTYPE : 'B'});
        let a  = {
            paused_count : 10
        }
       res.json({Status:"Success",Message:"Job status count", Data : a ,Code:200});
});




router.post('/update_mr',async function (req, res) {
  var job_details_two  =  await breakdown_managementModel.findOne({SMU_SCH_MECHCELL: req.body.user_mobile_no,SMU_SCH_JOBNO:req.body.jobId});
        let datas = {
            JOB_END_TIME : ""+value1,
            JOB_STATUS : "Job Submitted"
       }
        breakdown_managementModel.findByIdAndUpdate(job_details_two._id, datas, {new: true}, function (err, UpdatedDetails) {
            if (err) return res.json({Status:"Failed",Message:"Internal Server Error", Data : {},Code:500});
        });
});



router.post('/mr_job_work_status_update',async function (req, res) {



        var job_details  =  await breakdown_mr_data_managementModel.findOne({JLS_SCHM_ENGR_PHONE: req.body.user_mobile_no,SMU_SCH_JOBNO:req.body.job_id});
        // res.json({Status:"Success",Message:"Update successfully", Data : {} ,Code:200});
        if(req.body.Status == 'Job Started'){
            let da = {
            JOB_STATUS : req.body.Status,
            JOB_VIEW_STATUS : "Viewed",
            JOB_START_TIME : ""+value1,
            JOB_END_TIME : ""+value1,
            LAST_UPDATED_TIME : ""+value1,
        }
         breakdown_mr_data_managementModel.findByIdAndUpdate(job_details._id, da, {new: true}, function (err, UpdatedDetails) {
            if (err) return res.json({Status:"Failed",Message:"Internal Server Error", Data : {},Code:500});
            res.json({Status:"Success",Message:"Update successfully", Data : {} ,Code:200});
         }); 
          var location_tracking_job_wiseModel = require('./../models/location_tracking_job_wiseModel');
          let a = {
          "job_no" : req.body.job_id,
          "complaint_no" : req.body.SMU_SCH_COMPNO,
          "user_mobile_no" : req.body.user_mobile_no,
          "location_text" : req.body.JOB_LOCATION,
          "loc_lat" : req.body.JOB_START_LAT,
          "loc_long" : req.body.JOB_START_LONG,
          "date" : new Date(),
          "km" : "MR Preventive",
          "remarks" : "",
          }   
          var submitted = await location_tracking_job_wiseModel.create(a);
        }else if(req.body.Status == 'Job Stopped'){
            let da = {
            JOB_STATUS : req.body.Status,
            JOB_END_TIME : ""+value1,
            LAST_UPDATED_TIME : ""+value1,
        }
         breakdown_mr_data_managementModel.findByIdAndUpdate(job_details._id, da, {new: true}, function (err, UpdatedDetails) {
            if (err) return res.json({Status:"Failed",Message:"Internal Server Error", Data : {},Code:500});
            res.json({Status:"Success",Message:"Update successfully", Data : {} ,Code:200});
         }); 
        }else if(req.body.Status == 'Job Paused'){
            let da = {
            JOB_STATUS : req.body.Status,
            LAST_UPDATED_TIME : ""+value1,
        }
         breakdown_mr_data_managementModel.findByIdAndUpdate(job_details._id, da, {new: true}, function (err, UpdatedDetails) {
            if (err) return res.json({Status:"Failed",Message:"Internal Server Error", Data : {},Code:500});
            res.json({Status:"Success",Message:"Update successfully", Data : {} ,Code:200});
         }); 
        }               
});








router.post('/service_mr_new_job_list',async function (req, res) {
var job_details  =  await breakdown_managementModel.find({SMU_SCH_MECHCELL: req.body.user_mobile_no,JOB_STATUS:'Not Started',SMU_SCH_SERTYPE : 'B'});
let a = [];
job_details.forEach(element => {
  a.push({
            job_id : element.SMU_SCH_JOBNO,
            customer_name : element.SMU_SCH_CUSNAME,
            pm_date :element.SMU_SCH_COMPDT,
            status : "Active",
            SMU_SCH_COMPNO: element.SMU_SCH_COMPNO,
            SMU_SCH_SERTYPE : element.SMU_SCH_SERTYPE,
  })
});
res.json({Status:"Success",Message:"New Job List", Data : a ,Code:200});
});




router.post('/service_mr_customer_details',async function (req, res) {
var job_details  =  await breakdown_managementModel.findOne({SMU_SCH_MECHCELL: req.body.user_mobile_no,SMU_SCH_JOBNO:req.body.job_id});
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
            bd_date : job_details.SMU_SCH_COMPDT,
            breakdown_type : job_details.SMU_SCH_BRKDOWNTYPE,
        }
       res.json({Status:"Success",Message:"Customer Details", Data : a ,Code:200});
});


router.post('/service_mr_check_work_status',async function (req, res) {
var job_details  =  await breakdown_managementModel.findOne({SMU_SCH_MECHCELL: req.body.user_mobile_no,SMU_SCH_JOBNO:req.body.job_id});
 res.json({Status:"Success", Message:job_details.JOB_STATUS, time:job_details.JOB_START_TIME,  Data : {} ,Code:200});
});





router.post('/service_mr_eng_mrlist', function (req, res) {
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





router.post('/service_mr_eng_mrlist_submit', function (req, res) {
       res.json({Status:"Success",Message:"Data submitted successfully", Data : {} ,Code:200});
});




router.post('/job_details_in_text',async function (req, res) {
    var job_details =  await breakdown_managementModel.findOne({SMU_SCH_COMPNO:req.body.SMU_SCH_COMPNO});
        let a  = {
                        text_value : "The work is completed in a satfisfactory manner and we hereby reqeust to accept the same for job ID : "+ job_details.SMU_SCH_JOBNO +" . Customer Name : "+  job_details.SMU_SCH_CUSNAME +" and PM NO : "+ job_details.SMU_SCH_COMPNO+".",
                 }       
       res.json({Status:"Success",Message:"Job Detail Text", Data : a ,Code:200});
});







router.get('/deletes', function (req, res) {
      preventive_data_managementModel.remove({}, function (err, user) {
          if (err) return res.status(500).send("There was a problem deleting the user.");
             res.json({Status:"Success",Message:"preventive_data_managementModel Deleted", Data : {} ,Code:200});     
      });
});


// ******************************************************************************************************************************************************************************
// SERVICE FETCH PREVENTIVE JOB DETAILS BY JOB ID - ADMIN PANEL
// ******************************************************************************************************************************************************************************
router.post('/fetch_job_id', function (req, res) {
        preventive_data_managementModel.findOne({job_id:req.body.job_id}, function (err, StateList) {
          res.json({Status:"Success",Message:"Break Down Data Detail", Data : StateList ,Code:200});
        });
});


// ******************************************************************************************************************************************************************************
// SERVICE FETCH PREVENTIVE JOB DETAILS BY COMP ID - ADMIN PANEL
// ******************************************************************************************************************************************************************************
router.post('/fetch_job_id_comp', function (req, res) {
        preventive_data_managementModel.findOne({job_id:req.body.job_id,SMU_SCH_COMPNO : req.body.key_value }, function (err, StateList) {
          res.json({Status:"Success",Message:"Break Down Data Detail", Data : StateList ,Code:200});
        });
});






// ******************************************************************************************************************************************************************************
// SERVICE FETCH PREVENTIVE JOB DETAILS GRAPH DATA- ADMIN PANEL
// ******************************************************************************************************************************************************************************

router.post('/report/preventive_detail_graph',async function (req, res) {


  if(req.body.user_type == 'Admin'){


       var bd_b_total_count  =  await breakdown_managementModel.find({"SMU_SCH_SERTYPE":"P",'JOB_STATUS': {$in : ["Not Started" , "Job Started","Job Submitted","Job Paused"]}});
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
   else {

    let a = [];
    req.body.access_location.forEach(function(element) {
    a.push(element.branch_code);
    });


    var bd_b_total_count  =  await breakdown_managementModel.find({"SMU_SCH_SERTYPE":"P",'SMU_SCH_BRCODE':{$in:a},'JOB_STATUS': {$in : ["Not Started" , "Job Started","Job Submitted","Job Paused"]}});
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
// SERVICE PREVENTIVE DETAILS OVER ALL DATA - ADMIN PANEL
// ******************************************************************************************************************************************************************************
router.post('/report/preventive_detail_list',async function (req, res) {
        if(req.body.user_type == 'Admin'){
       if(req.body.status == 'Not Started'){
       var bd_b_total_count  =  await breakdown_managementModel.find({"SMU_SCH_SERTYPE":"P",'JOB_STATUS': {$in : ["Not Started"]}});
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
       var bd_b_total_count  =  await breakdown_managementModel.find({"SMU_SCH_SERTYPE":"P",'JOB_STATUS': {$in : ["Job Started"]}});
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
       var bd_b_total_count  =  await breakdown_managementModel.find({"SMU_SCH_SERTYPE":"P",'JOB_STATUS': {$in : ["Job Submitted"]}});
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
       }else if(req.body.status == 'Job Paused'){
       var bd_b_total_count  =  await breakdown_managementModel.find({"SMU_SCH_SERTYPE":"P",'JOB_STATUS': {$in : ["Job Paused"]}});
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
       var bd_b_total_count  =  await breakdown_managementModel.find({"SMU_SCH_SERTYPE":"P",'JOB_STATUS': {$in : ["Not Started","Job Started","Job Submitted","Job Paused"]}});
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
      var bd_b_total_count  =  await breakdown_managementModel.find({"SMU_SCH_SERTYPE":"P",'SMU_SCH_BRCODE':{$in:loc},'JOB_STATUS': {$in : ["Not Started"]}});
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
      var bd_b_total_count  =  await breakdown_managementModel.find({"SMU_SCH_SERTYPE":"P",'SMU_SCH_BRCODE':{$in:loc},'JOB_STATUS': {$in : ["Job Started"]}});
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
      var bd_b_total_count  =  await breakdown_managementModel.find({"SMU_SCH_SERTYPE":"P",'SMU_SCH_BRCODE':{$in:loc},'JOB_STATUS': {$in : ["Job Submitted"]}});
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
      }else if(req.body.status == 'Job Paused'){
      var bd_b_total_count  =  await breakdown_managementModel.find({"SMU_SCH_SERTYPE":"P",'SMU_SCH_BRCODE':{$in:loc},'JOB_STATUS': {$in : ["Job Paused"]}});
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





router.get('/getlist', function (req, res) {
        preventive_data_managementModel.find({}, function (err, Functiondetails) {
          res.json({Status:"Success",Message:"Functiondetails", Data : Functiondetails ,Code:200});
        });
});



router.post('/date_range_getlist', function (req, res) {
        breakdown_managementModel.find({ LAST_UPDATED_TIME: {
        $gte: new Date(2023, 3, 1), 
        $lt: new Date(2023, 3, 15)
    }}, function (err, Functiondetails) {
          res.json({Status:"Success",Message:"Functiondetails", Data : Functiondetails ,Code:200});
        });
});


router.post('/edit', function (req, res) {
        preventive_data_managementModel.findByIdAndUpdate(req.body.Activity_id, req.body, {new: true}, function (err, UpdatedDetails) {
            if (err) return res.json({Status:"Failed",Message:"Internal Server Error", Data : {},Code:500});
             res.json({Status:"Success",Message:"Functiondetails Updated", Data : UpdatedDetails ,Code:200});
        });
});
// // DELETES A USER FROM THE DATABASE
router.post('/delete', function (req, res) {
      preventive_data_managementModel.findByIdAndRemove(req.body.Activity_id, function (err, user) {
          if (err) return res.json({Status:"Failed",Message:"Internal Server Error", Data : {},Code:500});
          res.json({Status:"Success",Message:"SubFunction Deleted successfully", Data : {} ,Code:200});
      });
});
module.exports = router;
