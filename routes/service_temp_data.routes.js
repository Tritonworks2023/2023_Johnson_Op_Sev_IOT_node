var express = require('express');
var router = express.Router();
var bodyParser = require('body-parser');
router.use(bodyParser.urlencoded({ extended: false }));
router.use(bodyParser.json());
var service_temp_dataModel = require('./../models/service_temp_dataModel');
var error_log_oracelModel = require('./../models/error_log_oracelModel');
var temp_data_storedataModel = require('./../models/temp_data_storedataModel');
var service_tab_submit_data_br_Model = require('./../models/service_tab_submit_data_br_Model');
var service_submitted_valueModel = require('./../models/service_submitted_valueModel');
var notificationModel = require('./../models/notificationModel');
var pop_notificationModel = require('./../models/pop_notificationModel');



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



router.post('/retrive_local_value',async function(req, res) {
var datas = await service_temp_dataModel.findOne({user_mobile_no: req.body.user_mobile_no,jobId:req.body.jobId,key_value :req.body.SMU_SCH_COMPNO});
if(datas == null){
res.json({Status:"Success",Message:"Functiondetails Updated", Data : {} ,Code:200});
}else {
  res.json({Status:"Success",Message:"Functiondetails Updated", Data : datas.data_store[0] ,Code:200});
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
if(datas == null){
   res.json({Status:"Success",Message:"Functiondetails Updated", Data : {} ,Code:200});
}
else {
  res.json({Status:"Success",Message:"Functiondetails Updated", Data : datas.data_store[0] ,Code:200});
}
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
if(datas !== null){
res.json({Status:"Success",Message:"Functiondetails Updated", Data : datas.data_store[0] ,Code:200});
}else {
res.json({Status:"Success",Message:"Functiondetails Updated", Data : {}, Code:200});
}
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





router.post('/create_local_value_form_check_two',async function(req, res) {


var datas = await service_temp_dataModel.findOne({user_mobile_no: req.body.user_mobile_no,jobId:req.body.job_id,key_value:""+req.body.OM_OSA_COMPNO+"-cheeck"});

if(datas == null){
    try{
  await service_temp_dataModel.create({
  user_mobile_no: req.body.user_mobile_no || "",
  jobId : req.body.job_id || "",
  key_value :""+req.body.OM_OSA_COMPNO+"-cheeck" || "",
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
  key_value  :""+req.body.OM_OSA_COMPNO+"-cheeck"|| "",
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
if(datas == null){
   res.json({Status:"Success",Message:"Functiondetails Updated", Data : {} ,Code:200});
}else {
  res.json({Status:"Success",Message:"Functiondetails Updated", Data : datas.data_store[0] ,Code:200});
}
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

if(datas == null){
   res.json({Status:"Success",Message:"Functiondetails Updated", Data : {} ,Code:200});
}else {
  res.json({Status:"Success",Message:"Functiondetails Updated", Data : datas.data_store[0] ,Code:200});
}

// res.json({Status:"Success",Message:"Functiondetails Updated", Data : datas.data_store[0] ,Code:200});
});




router.post('/retrive_local_value_form_6',async function(req, res) {

var datas = await service_temp_dataModel.findOne({user_mobile_no: req.body.user_mobile_no,jobId:req.body.jobId,key_value :req.body.SMU_ACK_COMPNO});

if(datas == null){
   res.json({Status:"Success",Message:"Functiondetails Updated", Data : {} ,Code:200});
}else {
  res.json({Status:"Success",Message:"Functiondetails Updated", Data : datas.data_store[0] ,Code:200});
}

// res.json({Status:"Success",Message:"Functiondetails Updated", Data : datas.data_store[0] ,Code:200});
});







router.post('/create_local_value_form_7',async function(req, res) {
var datas = await service_temp_dataModel.findOne({user_mobile_no: req.body.userMobileNo,jobId:req.body.jobId,key_value:req.body.omOsaCompno});
if(datas == null){
    try{
  await service_temp_dataModel.create({
  user_mobile_no: req.body.userMobileNo || "",
  jobId : req.body.jobId || "",
  key_value :req.body.omOsaCompno || "",
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
  user_mobile_no: req.body.userMobileNo || "",
  jobId : req.body.jobId || "",
  key_value :req.body.omOsaCompno || "",
  data_store : [req.body]
  }
  service_temp_dataModel.findByIdAndUpdate(datas._id, datasss, {new: true}, function (err, UpdatedDetails) {
            if (err) return res.json({Status:"Failed",Message:"Internal Server Error", Data : {},Code:500});
             res.json({Status:"Success",Message:"Functiondetails Updated", Data : UpdatedDetails ,Code:200});
  });
}
});



router.post('/retrive_local_value_form_7',async function(req, res) {
var datas = await service_temp_dataModel.findOne({user_mobile_no: req.body.user_mobile_no,jobId:req.body.jobId,key_value :req.body.OM_OSA_COMPNO});
console.log(datas);
if(datas == null){
   res.json({Status:"Success",Message:"Functiondetails Updated", Data : {} ,Code:200});
}else {
  res.json({Status:"Success",Message:"Functiondetails Updated", Data : datas.data_store[0] ,Code:200});
}

});









router.get('/getlist', function (req, res) {
        service_temp_dataModel.remove({}, function (err, Functiondetails) {
          res.json({Status:"Success",Message:"iot branch code", Data : Functiondetails ,Code:200});
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


















// ******************************************************************************************************************************************************************************
// ERROR LOG
// ******************************************************************************************************************************************************************************

router.get('/get_error_log_count',async function (req, res) {
        error_log_oracelModel.find({},async function (err, Functiondetails) {
         res.json({Status:"Success",Message:"ERROR LOG", Data : Functiondetails ,Code:200});
        }).count();
});


router.get('/get_error_log_count_one_data',async function (req, res) {
        error_log_oracelModel.find({},async function (err, Functiondetails) {
         res.json({Status:"Success",Message:"get_error_log_count", Data : Functiondetails ,Code:200});
        }).limit(10).sort({ _id: -1 });
});



router.get('/get_error_log_count_delete',async function (req, res) {
   var total_error_count  =  await error_log_oracelModel.find({}).count();
   console.log(total_error_count);
   if(total_error_count > 500){
    var limits = total_error_count - 500;
     error_log_oracelModel.find({},async function (err, Functiondetails) {
          for(let a  = 0 ; a < Functiondetails.length ; a++){
          error_log_oracelModel.findByIdAndRemove(Functiondetails[a]._id, function (err, user) {
          if (err) return res.json({Status:"Failed",Message:"Internal Server Error", Data : {},Code:500});
          // res.json({Status:"Success",Message:"iot branch code Deleted successfully", Data : {} ,Code:200});
          });
          if(a == Functiondetails.length - 1){
          res.json({Status:"Success",Message:"DELETED", Data : {} ,Code:200});
          }
          }
      }).limit(limits).sort({ _id: 1 });
   }else {
        res.json({Status:"Success",Message:"DELETED", Data : {} ,Code:200});
   }
});






// ******************************************************************************************************************************************************************************
// OPERATION TEMP DATA
// ******************************************************************************************************************************************************************************

router.get('/get_operation_temp_count',async function (req, res) {
     var total_error_count  =  await temp_data_storedataModel.find({}).count();
     res.json({Status:"Success",Message:"OPERATION TEMP DATA", Data : total_error_count ,Code:200});
});


router.get('/get_operation_temp_one_data',async function (req, res) {
        temp_data_storedataModel.find({},async function (err, Functiondetails) {
         res.json({Status:"Success",Message:"get_error_log_count", Data : Functiondetails[Functiondetails.length - 1] ,Code:200});
        });
});



router.get('/get_operation_temp_delete',async function (req, res) {
   var total_error_count  =  await temp_data_storedataModel.find({}).count();
   console.log(total_error_count);
   if(total_error_count > 500){
    var limits = total_error_count - 500;
    temp_data_storedataModel.find({},async function (err, Functiondetails) {
          console.log(")))))))))))))",Functiondetails.length);
          for(let a  = 0 ; a < Functiondetails.length ; a++){
          temp_data_storedataModel.findByIdAndRemove(Functiondetails[a]._id, function (err, user) {
          if (err) return res.json({Status:"Failed",Message:"Internal Server Error", Data : {},Code:500});
          // res.json({Status:"Success",Message:"iot branch code Deleted successfully", Data : {} ,Code:200});
          });
          if(a == Functiondetails.length - 1){
          res.json({Status:"Success",Message:"DELETED", Data : {} ,Code:200});
          }
          }
        }).limit(limits).sort({ _id: 1 });
  } else {
     res.json({Status:"Success",Message:"ONLY 500 RECORD", Data : {} ,Code:200});
  }     
});




// ******************************************************************************************************************************************************************************
// SERVICE TEMP DATA
// ******************************************************************************************************************************************************************************

router.get('/get_serivce_temp_count',async function (req, res) {
        service_temp_dataModel.find({},async function (err, Functiondetails) {
         res.json({Status:"Success",Message:"SERVICE TEMP DATA", Data : Functiondetails ,Code:200});
        }).count();
});


router.get('/get_serivce_temp_one_data',async function (req, res) {
        service_temp_dataModel.find({},async function (err, Functiondetails) {
         res.json({Status:"Success",Message:"get_serivce_temp_count", Data : Functiondetails[Functiondetails.length - 1] ,Code:200});
        });
});



router.get('/get_serivce_temp_delete',async function (req, res) {
   var total_error_count  =  await service_temp_dataModel.find({}).count();
   console.log(total_error_count);
   if(total_error_count > 20000){
    var limits = total_error_count - 20000;
    service_temp_dataModel.find({},async function (err, Functiondetails) {
      console.log(")))))))))))))))))",Functiondetails.length);
          for(let a  = 0 ; a < Functiondetails.length ; a++){
          service_temp_dataModel.findByIdAndRemove(Functiondetails[a]._id, function (err, user) {
          if (err) return res.json({Status:"Failed",Message:"Internal Server Error", Data : {},Code:500});
          // console.log(err);
          // res.json({Status:"Success",Message:"iot branch code Deleted successfully", Data : {} ,Code:200});
          });
          if(a == Functiondetails.length - 1){
          res.json({Status:"Success",Message:"DELETED", Data : {} ,Code:200});
          }
          }
        }).limit(2000).sort({ _id: 1 });
  }else {
     res.json({Status:"Success",Message:"ONLY 20000 RECORD", Data : {} ,Code:200});
  }     
});


router.post('/fetch_submitted_data_job_no',async function (req, res) {
        service_tab_submit_data_br_Model.find({"comp_id" : req.body.SMU_SCH_COMPNO},async function (err, Functiondetails) {
          service_tab_submit_data_br_Model.findByIdAndUpdate(Functiondetails[0]._id, {"upload_status" : "N"}, {new: true}, function (err, UpdatedDetails) {
            if (err)return res.json({Status:"Failed",Message:"Internal Server Error", Data:err,Code:500});
             res.json({Status:"Success",Message:"UPDATED", Data : {} ,Code:200});
          });
        });
});




// ******************************************************************************************************************************************************************************
// SERVICE SUBMITTED VALUE DATA
// ******************************************************************************************************************************************************************************

router.get('/get_serivce_submitted_value_count',async function (req, res) {
        service_submitted_valueModel.find({},async function (err, Functiondetails) {
         res.json({Status:"Success",Message:"SERVICE SUBMITTED VALUE DATA", Data : Functiondetails ,Code:200});
        }).count();
});


router.get('/get_serivce_submitted_value_data',async function (req, res) {
        service_submitted_valueModel.find({},async function (err, Functiondetails) {
         res.json({Status:"Success",Message:"get_serivce_temp_count", Data : Functiondetails[Functiondetails.length - 1] ,Code:200});
        });
});





router.get('/get_serivce_submitted_value_delete',async function (req, res) {
   var total_error_count  =  await service_submitted_valueModel.find({}).count();
   console.log(total_error_count);
   if(total_error_count > 500){
    var limits = total_error_count - 500;
    service_submitted_valueModel.find({},async function (err, Functiondetails) {
      console.log(")))))))))))))))))",Functiondetails.length);
          for(let a  = 0 ; a < Functiondetails.length ; a++){
          service_submitted_valueModel.findByIdAndRemove(Functiondetails[a]._id, function (err, user) {
          if (err) return res.json({Status:"Failed",Message:"Internal Server Error", Data : {},Code:500});
          // console.log(err);
          // res.json({Status:"Success",Message:"iot branch code Deleted successfully", Data : {} ,Code:200});
          });
          if(a == Functiondetails.length - 1){
          res.json({Status:"Success",Message:"DELETED", Data : {} ,Code:200});
          }
          }
        }).limit(limits).sort({ _id: 1 });
  }else {
     res.json({Status:"Success",Message:"ONLY 20000 RECORD", Data : {} ,Code:200});
  }     
});


router.post('/fetch_serivce_submitted_value_job_no',async function (req, res) {
        service_submitted_valueModel.find({"comp_id" : req.body.SMU_SCH_COMPNO},async function (err, Functiondetails) {
          service_submitted_valueModel.findByIdAndUpdate(Functiondetails[0]._id, {"upload_status" : "N"}, {new: true}, function (err, UpdatedDetails) {
            if (err)return res.json({Status:"Failed",Message:"Internal Server Error", Data:err,Code:500});
             res.json({Status:"Success",Message:"UPDATED", Data : {} ,Code:200});
          });
        });
});





// ******************************************************************************************************************************************************************************
// NOTIFICATION COUNT VALUE DATA
// ******************************************************************************************************************************************************************************

router.get('/get_notification_count',async function (req, res) {
        notificationModel.find({},async function (err, Functiondetails) {
         res.json({Status:"Success",Message:"NOTIFICATION COUNT VALUE DATA", Data : Functiondetails ,Code:200});
        }).count();
});


router.get('/get_notification_delete',async function (req, res) {
   var total_error_count  =  await notificationModel.find({}).count();
   console.log(total_error_count);
   if(total_error_count > 5000){
    var limits = total_error_count - 5000;
    notificationModel.find({},async function (err, Functiondetails) {
      console.log(")))))))))))))))))",Functiondetails.length);
          for(let a  = 0 ; a < Functiondetails.length ; a++){
          notificationModel.findByIdAndRemove(Functiondetails[a]._id, function (err, user) {
          if (err) return res.json({Status:"Failed",Message:"Internal Server Error", Data : {},Code:500});
          // console.log(err);
          // res.json({Status:"Success",Message:"iot branch code Deleted successfully", Data : {} ,Code:200});
          });
          if(a == Functiondetails.length - 1){
          res.json({Status:"Success",Message:"DELETED", Data : {} ,Code:200});
          }
          }
        }).limit(limits).sort({ _id: 1 });
  }else {
     res.json({Status:"Success",Message:"ONLY 20000 RECORD", Data : {} ,Code:200});
  }     
});



// ******************************************************************************************************************************************************************************
// POP - NOTIFICATION COUNT VALUE DATA
// ******************************************************************************************************************************************************************************

router.get('/get_pop_notification_count',async function (req, res) {
        pop_notificationModel.find({status : 'Viewed'},async function (err, Functiondetails) {
         res.json({Status:"Success",Message:"POP - NOTIFICATION COUNT VALUE DATA", Data : Functiondetails ,Code:200});
        }).count();
});


router.get('/get_pop_notification_delete',async function (req, res) {
   var total_error_count  =  await pop_notificationModel.find({status : 'Viewed'}).count();
   console.log(total_error_count);
   if(total_error_count > 500){
    var limits = total_error_count - 500;
    pop_notificationModel.find({status : 'Viewed'},async function (err, Functiondetails) {
      console.log(")))))))))))))))))",Functiondetails.length);
          for(let a  = 0 ; a < Functiondetails.length ; a++){
          pop_notificationModel.findByIdAndRemove(Functiondetails[a]._id, function (err, user) {
          if (err) return res.json({Status:"Failed",Message:"Internal Server Error", Data : {},Code:500});
          // console.log(err);
          // res.json({Status:"Success",Message:"iot branch code Deleted successfully", Data : {} ,Code:200});
          });
          if(a == Functiondetails.length - 1){
          res.json({Status:"Success",Message:"DELETED", Data : {} ,Code:200});
          }
          }
        }).limit(limits).sort({ _id: 1 });
  }else {
     res.json({Status:"Success",Message:"ONLY 20000 RECORD", Data : {} ,Code:200});
  }     
});




















module.exports = router;
