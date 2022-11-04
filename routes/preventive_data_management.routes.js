var express = require('express');
var router = express.Router();
var bodyParser = require('body-parser');
router.use(bodyParser.urlencoded({ extended: false }));
router.use(bodyParser.json());
var preventive_data_managementModel = require('./../models/preventive_data_managementModel');
var breakdown_managementModel = require('./../models/breakdown_managementModel');

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
          // console.log(user);
       let datas = {
            JOB_END_TIME : ""+new Date(),
            JOB_STATUS : "Job Submitted"
       }
        breakdown_managementModel.findByIdAndUpdate(job_details_two._id, datas, {new: true}, function (err, UpdatedDetails) {
            if (err) return res.json({Status:"Failed",Message:"Internal Server Error", Data : {},Code:500});
        });
        });
}
catch(e){
              console.log(e);
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
            JOB_END_TIME : ""+new Date(),
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
            JOB_START_TIME : ""+new Date(),
            JOB_END_TIME : ""+new Date()
        }
         breakdown_mr_data_managementModel.findByIdAndUpdate(job_details._id, da, {new: true}, function (err, UpdatedDetails) {
            if (err) return res.json({Status:"Failed",Message:"Internal Server Error", Data : {},Code:500});
            res.json({Status:"Success",Message:"Update successfully", Data : {} ,Code:200});
         }); 
        }else if(req.body.Status == 'Job Stopped'){
            let da = {
            JOB_STATUS : req.body.Status,
            JOB_END_TIME : ""+new Date()
        }
         breakdown_mr_data_managementModel.findByIdAndUpdate(job_details._id, da, {new: true}, function (err, UpdatedDetails) {
            if (err) return res.json({Status:"Failed",Message:"Internal Server Error", Data : {},Code:500});
            res.json({Status:"Success",Message:"Update successfully", Data : {} ,Code:200});
         }); 
        }else if(req.body.Status == 'Job Paused'){
            let da = {
            JOB_STATUS : req.body.Status,
            JOB_END_TIME : ""+new Date()
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
       res.json({Status:"Success",Message:job_details.JOB_STATUS, Data : {} ,Code:200});
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






router.get('/deletes', function (req, res) {
      preventive_data_managementModel.remove({}, function (err, user) {
          if (err) return res.status(500).send("There was a problem deleting the user.");
             res.json({Status:"Success",Message:"preventive_data_managementModel Deleted", Data : {} ,Code:200});     
      });
});


router.post('/fetch_job_id', function (req, res) {
        preventive_data_managementModel.findOne({job_id:req.body.job_id}, function (err, StateList) {
          res.json({Status:"Success",Message:"Break Down Data Detail", Data : StateList ,Code:200});
        });
});



router.get('/getlist', function (req, res) {
        preventive_data_managementModel.find({}, function (err, Functiondetails) {
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
