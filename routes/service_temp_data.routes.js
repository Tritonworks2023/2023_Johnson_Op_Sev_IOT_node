var express = require('express');
var router = express.Router();
var bodyParser = require('body-parser');
router.use(bodyParser.urlencoded({ extended: false }));
router.use(bodyParser.json());
var service_temp_dataModel = require('./../models/service_temp_dataModel');


router.post('/create', async function(req, res) {

  var iot_branch_detail  =  await service_temp_dataModel.findOne({branch_code:   req.body.branch_code});

  if(iot_branch_detail == null){
  try{
        await service_temp_dataModel.create({  
  branch_code:   req.body.branch_code || "",
  branch_name :  req.body.branch_name || "",
  branch_lat :  req.body.branch_lat || 0,
  branch_long :  req.body.branch_long || 0,
  created_by :  req.body.created_by || "",
  created_at :  req.body.created_at || "",
  updated_at:  req.body.updated_at || ""
        }, 
        function (err, user) {

        res.json({Status:"Success",Message:"Added successfully", Data : user ,Code:200}); 
        });
}
catch(e){
      res.json({Status:"Failed",Message:"Internal Server Error", Data : {},Code:500});
}
          }
          else{
             res.json({Status:"Failed",Message:"This Branch Code Already Added", Data : {},Code:500});
          }
});


router.get('/deletes', function (req, res) {
      service_temp_dataModel.remove({}, function (err, user) {
          if (err) return res.status(500).send("There was a problem deleting the user.");
             res.json({Status:"Success",Message:"iot branch code Deleted", Data : {} ,Code:200});     
      });
});


router.post('/getlist_id', function (req, res) {
        service_temp_dataModel.find({user_id:req.body.user_id}, function (err, StateList) {
          res.json({Status:"Success",Message:"iot branch code List", Data : StateList ,Code:200});
        });
});



router.post('/create_local_value',async function(req, res) {


var datas = await service_temp_dataModel.findOne({user_mobile_no: req.body.user_mobile_no,jobId:req.body.jobId,key_value :req.body.SMU_SCH_COMPNO});

if(datas == null){

    try{
  await service_temp_dataModel.create({
  user_mobile_no: req.body.user_mobile_no || "",
  jobId : req.body.jobId || "",
  key_value :req.body.SMU_SCH_COMPNO || "",
  data_store : [req.body]
        }, 
        function (err, user) {
        res.json({Status:"Success",Message:"Added successfully", Data : {} ,Code:200}); 
        });
}
catch(e){
      res.json({Status:"Failed",Message:"Internal Server Error", Data : {},Code:500});
}
}
else {

  let datasss = {
  user_mobile_no: req.body.user_mobile_no || "",
  jobId : req.body.jobId || "",
  key_value :req.body.SMU_SCH_COMPNO || "",
  data_store : [req.body]
  }
  service_temp_dataModel.findByIdAndUpdate(datas._id, datasss, {new: true}, function (err, UpdatedDetails) {
            if (err) return res.json({Status:"Failed",Message:"Internal Server Error", Data : {},Code:500});
             res.json({Status:"Success",Message:"Functiondetails Updated", Data : UpdatedDetails ,Code:200});
  });
}
});




router.post('/create_local_value_form_4',async function(req, res) {


var datas = await service_temp_dataModel.findOne({user_mobile_no: req.body.user_mobile_no,jobId:req.body.jobId,key_value:req.body.SMU_SCH_COMPNO});

if(datas == null){
    try{
  await service_temp_dataModel.create({
  user_mobile_no: req.body.user_mobile_no || "",
  jobId : req.body.jobId || "",
  key_value :req.body.SMU_SCH_COMPNO || "",
  data_store : [req.body]
        }, 
        function (err, user) {
        res.json({Status:"Success",Message:"Added successfully", Data : {} ,Code:200}); 
        });
}
catch(e){
      res.json({Status:"Failed",Message:"Internal Server Error", Data : {},Code:500});
}
}
else {
  let datasss = {
  user_mobile_no: req.body.user_mobile_no || "",
  jobId : req.body.jobId || "",
  key_value :req.body.SMU_SCH_COMPNO || "",
  data_store : [req.body]
  }
  service_temp_dataModel.findByIdAndUpdate(datas._id, datasss, {new: true}, function (err, UpdatedDetails) {
            if (err) return res.json({Status:"Failed",Message:"Internal Server Error", Data : {},Code:500});
             res.json({Status:"Success",Message:"Functiondetails Updated", Data : UpdatedDetails ,Code:200});
  });
}
});



router.post('/retrive_local_value_form_4',async function(req, res) {


var datas = await service_temp_dataModel.findOne({user_mobile_no: req.body.user_mobile_no,jobId:req.body.jobId,key_value :req.body.SMU_SCH_COMPNO});

res.json({Status:"Success",Message:"Functiondetails Updated", Data : datas.data_store[0] ,Code:200});
});





router.post('/create_local_value_form_2',async function(req, res) {


var datas = await service_temp_dataModel.findOne({user_mobile_no: req.body.user_mobile_no,jobId:req.body.job_id,key_value:req.body.SMU_SCH_COMPNO});

if(datas == null){
    try{
  await service_temp_dataModel.create({
  user_mobile_no: req.body.user_mobile_no || "",
  jobId : req.body.job_id || "",
  key_value :req.body.SMU_SCH_COMPNO || "",
  data_store : [req.body]
        }, 
        function (err, user) {
        res.json({Status:"Success",Message:"Added successfully", Data : {} ,Code:200}); 
        });
}
catch(e){
      res.json({Status:"Failed",Message:"Internal Server Error", Data : {},Code:500});
}
}
else {
  let datasss = {
  user_mobile_no: req.body.user_mobile_no || "",
  jobId : req.body.job_id || "",
  key_value :req.body.SMU_SCH_COMPNO || "",
  data_store : [req.body]
  }
  service_temp_dataModel.findByIdAndUpdate(datas._id, datasss, {new: true}, function (err, UpdatedDetails) {
            if (err) return res.json({Status:"Failed",Message:"Internal Server Error", Data : {},Code:500});
             res.json({Status:"Success",Message:"Functiondetails Updated", Data : UpdatedDetails ,Code:200});
  });
}
});



router.post('/retrive_local_value_form_2',async function(req, res) {


var datas = await service_temp_dataModel.findOne({user_mobile_no: req.body.user_mobile_no,jobId:req.body.job_id,key_value :req.body.SMU_SCH_COMPNO});

res.json({Status:"Success",Message:"Functiondetails Updated", Data : datas.data_store[0] ,Code:200});
});




router.post('/create_local_value_form_check',async function(req, res) {


var datas = await service_temp_dataModel.findOne({user_mobile_no: req.body.user_mobile_no,jobId:req.body.job_id,key_value:req.body.SMU_SCH_COMPNO+"cheeck"});

if(datas == null){
    try{
  await service_temp_dataModel.create({
  user_mobile_no: req.body.user_mobile_no || "",
  jobId : req.body.job_id || "",
  key_value :req.body.SMU_SCH_COMPNO+"cheeck" || "",
  data_store : [req.body]
        }, 
        function (err, user) {
        res.json({Status:"Success",Message:"Added successfully", Data : {} ,Code:200}); 
        });
}
catch(e){
      res.json({Status:"Failed",Message:"Internal Server Error", Data : {},Code:500});
}
}
else {
  let datasss = {
  user_mobile_no: req.body.user_mobile_no || "",
  jobId : req.body.job_id || "",
  key_value :req.body.SMU_SCH_COMPNO+"cheeck" || "",
  data_store : [req.body]
  }
  service_temp_dataModel.findByIdAndUpdate(datas._id, datasss, {new: true}, function (err, UpdatedDetails) {
            if (err) return res.json({Status:"Failed",Message:"Internal Server Error", Data : {},Code:500});
             res.json({Status:"Success",Message:"Functiondetails Updated", Data : UpdatedDetails ,Code:200});
  });
}
});





router.post('/create_local_value_form_5',async function(req, res) {


var datas = await service_temp_dataModel.findOne({user_mobile_no: req.body.userId,jobId:req.body.jobId,key_value:req.body.SMU_SCQH_QUOTENO});

if(datas == null){
    try{
  await service_temp_dataModel.create({
  user_mobile_no: req.body.userId || "",
  jobId : req.body.jobId || "",
  key_value :req.body.SMU_SCQH_QUOTENO || "",
  data_store : [req.body]
        }, 
        function (err, user) {
        res.json({Status:"Success",Message:"Added successfully", Data : {} ,Code:200}); 
        });
}
catch(e){
      res.json({Status:"Failed",Message:"Internal Server Error", Data : {},Code:500});
}
}
else {
  let datasss = {
  user_mobile_no: req.body.userId || "",
  jobId : req.body.jobId || "",
  key_value :req.body.SMU_SCQH_QUOTENO || "",
  data_store : [req.body]
  }
  service_temp_dataModel.findByIdAndUpdate(datas._id, datasss, {new: true}, function (err, UpdatedDetails) {
            if (err) return res.json({Status:"Failed",Message:"Internal Server Error", Data : {},Code:500});
             res.json({Status:"Success",Message:"Functiondetails Updated", Data : UpdatedDetails ,Code:200});
  });
}
});



router.post('/retrive_local_value_form_5',async function(req, res) {

var datas = await service_temp_dataModel.findOne({user_mobile_no: req.body.user_mobile_no,jobId:req.body.jobId,key_value :req.body.SMU_SCQH_QUOTENO});

res.json({Status:"Success",Message:"Functiondetails Updated", Data : datas.data_store[0] ,Code:200});
});




router.post('/create_local_value_form_6',async function(req, res) {

var datas = await service_temp_dataModel.findOne({user_mobile_no: req.body.userId,jobId:req.body.jobId,key_value:req.body.SMU_ACK_COMPNO});

if(datas == null){
    try{
  await service_temp_dataModel.create({
  user_mobile_no: req.body.userId || "",
  jobId : req.body.jobId || "",
  key_value :req.body.SMU_ACK_COMPNO || "",
  data_store : [req.body]
        }, 
        function (err, user) {
        res.json({Status:"Success",Message:"Added successfully", Data : {} ,Code:200}); 
        });
}
catch(e){
      res.json({Status:"Failed",Message:"Internal Server Error", Data : {},Code:500});
}
}
else {
  let datasss = {
  user_mobile_no: req.body.userId || "",
  jobId : req.body.jobId || "",
  key_value :req.body.SMU_ACK_COMPNO || "",
  data_store : [req.body]
  }
  service_temp_dataModel.findByIdAndUpdate(datas._id, datasss, {new: true}, function (err, UpdatedDetails) {
            if (err) return res.json({Status:"Failed",Message:"Internal Server Error", Data : {},Code:500});
             res.json({Status:"Success",Message:"Functiondetails Updated", Data : UpdatedDetails ,Code:200});
  });
}
});





router.post('/create_local_value_form_1',async function(req, res) {

var datas = await service_temp_dataModel.findOne({user_mobile_no: req.body.user_mobile_no,jobId:req.body.job_id,key_value:req.body.SMU_SCH_COMPNO});

if(datas == null){
    try{
  await service_temp_dataModel.create({
  user_mobile_no: req.body.user_mobile_no || "",
  jobId : req.body.job_id || "",
  key_value :req.body.SMU_SCH_COMPNO || "",
  data_store : [req.body]
        }, 
        function (err, user) {
        res.json({Status:"Success",Message:"Added successfully", Data : {} ,Code:200}); 
        });
}
catch(e){
      res.json({Status:"Failed",Message:"Internal Server Error", Data : {},Code:500});
}
}
else {
  let datasss = {
  user_mobile_no: req.body.user_mobile_no || "",
  jobId : req.body.job_id || "",
  key_value :req.body.SMU_SCH_COMPNO || "",
  data_store : [req.body]
  }
  service_temp_dataModel.findByIdAndUpdate(datas._id, datasss, {new: true}, function (err, UpdatedDetails) {
            if (err) return res.json({Status:"Failed",Message:"Internal Server Error", Data : {},Code:500});
             res.json({Status:"Success",Message:"Functiondetails Updated", Data : UpdatedDetails ,Code:200});
  });
}
});



router.post('/retrive_local_value_form_1',async function(req, res) {

var datas = await service_temp_dataModel.findOne({user_mobile_no: req.body.user_mobile_no,jobId:req.body.job_id,key_value :req.body.SMU_SCH_COMPNO});

res.json({Status:"Success",Message:"Functiondetails Updated", Data : datas.data_store[0] ,Code:200});
});




router.post('/retrive_local_value_form_6',async function(req, res) {

var datas = await service_temp_dataModel.findOne({user_mobile_no: req.body.user_mobile_no,jobId:req.body.jobId,key_value :req.body.SMU_ACK_COMPNO});

res.json({Status:"Success",Message:"Functiondetails Updated", Data : datas.data_store[0] ,Code:200});
});






router.post('/retrive_local_value',async function(req, res) {

var datas = await service_temp_dataModel.findOne({user_mobile_no: req.body.user_mobile_no,jobId:req.body.jobId,key_value :req.body.SMU_SCH_COMPNO});

res.json({Status:"Success",Message:"Functiondetails Updated", Data : datas.data_store[0] ,Code:200});
});




router.post('/mobile/login_page', function (req, res) {
        service_temp_dataModel.findOne({user_id:req.body.user_id,user_password:req.body.user_password}, function (err, StateList) {
            if(StateList == null){
              res.json({Status:"Failed",Message:"Account not found", Data : {} ,Code:404});
            }else{
              res.json({Status:"Success",Message:"iot branch code Details", Data : StateList ,Code:200});
            }          
        });
});


router.get('/reload_data2',async function (req, res) {
        var ref_code_details  =  await service_temp_dataModel.find({}).sort({index:1});
        for(let a  = 0; a < ref_code_details.length ; a ++){
         let d = {
            user_role : "USER",
         }
         service_temp_dataModel.findByIdAndUpdate(ref_code_details[a]._id, d, {new: true}, function (err, UpdatedDetails) {
            if (err) return res.json({Status:"Failed",Message:"Internal Server Error", Data : {},Code:500});
        });
         if(a == ref_code_details.length - 1){
            res.json({Status:"Success",Message:"iot branch code Updated", Data : {} ,Code:200});
         }
        }

});


router.post('/admin_delete', function (req, res) {
      service_temp_dataModel.findByIdAndRemove(req.body._id, function (err, user) {
          if (err) return res.json({Status:"Failed",Message:"Internal Server Error", Data : {},Code:500});
          res.json({Status:"Success",Message:"iot branch code Deleted successfully", Data : {} ,Code:200});
      });
});


router.get('/getlist', function (req, res) {
        service_temp_dataModel.find({}, function (err, Functiondetails) {
          res.json({Status:"Success",Message:"iot branch code", Data : Functiondetails ,Code:200});
        });
});



router.get('/getlist_custom', function (req, res) {
        service_temp_dataModel.find({}, function (err, Functiondetails) {
          var final_data = [];
          for(let a  = 0 ; a <  Functiondetails.length ; a++){
              let c = {
            BBRCD: Functiondetails[a].branch_code,
            BBRNAME: Functiondetails[a].branch_name,
            px: Functiondetails[a].branch_lat,
            py: Functiondetails[a].branch_long,
             }
              final_data.push(c);
              if(a == Functiondetails.length - 1){
                res.json({Status:"Success",Message:"iot branch code", Data : final_data ,Code:200});
              }
          }
        });
});


router.post('/edit', function (req, res) {
        service_temp_dataModel.findByIdAndUpdate(req.body._id, req.body, {new: true}, function (err, UpdatedDetails) {
            if (err) return res.json({Status:"Failed",Message:"Internal Server Error", Data : {},Code:500});
             res.json({Status:"Success",Message:"iot branch code Updated", Data : UpdatedDetails ,Code:200});
        });
});




// // DELETES A USER FROM THE DATABASE
router.post('/delete', function (req, res) {
      service_temp_dataModel.findByIdAndRemove(req.body._id, function (err, user) {
          if (err) return res.json({Status:"Failed",Message:"Internal Server Error", Data : {},Code:500});
          res.json({Status:"Success",Message:"iot branch code Deleted successfully", Data : {} ,Code:200});
      });
});



module.exports = router;
