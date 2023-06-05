var express = require('express');
var router = express.Router();
var bodyParser = require('body-parser');
router.use(bodyParser.urlencoded({ extended: false }));
router.use(bodyParser.json());
var temp_data_storedataModel = require('./../models/temp_data_storedataModel');


router.post('/create', async function(req, res) {
  try{
        await temp_data_storedataModel.create({
  job_id: req.body.job_id || "",
  group_id : req.body.group_id || "",
  user_id :req.body.user_id || "",
  datas : []
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
      temp_data_storedataModel.remove({}, function (err, user) {
          if (err) return res.status(500).send("There was a problem deleting the user.");
             res.json({Status:"Success",Message:"activedetail_management Deleted", Data : {} ,Code:200});     
      });
});


router.post('/check_local_storage',async function (req, res) {
  console.log("Operation Comple",req.body);
  if(req.body.group_id == ""){
    res.json({Status:"Success",Message:"Not Stored Data", Data : {} ,Code:200});
  } else {
    temp_data_storedataModel.findOne({
       job_id: req.body.job_id,
       group_id : req.body.group_id,
       user_id :req.body.user_id
    }, function (err, Functiondetails) {
       if(Functiondetails ==  null){
            res.json({Status:"Success",Message:"Not Stored Data", Data : {} ,Code:200});
       }else{
         if(req.body.group_id == "629ede01886f5404a75d4a84" || req.body.group_id == "629ede01886f5404a75d4a86"){
            res.json({Status:"Success",Message:"Not Stored Data", Data : {} ,Code:200});
        }else {
            res.json({Status:"Success",Message:"Stored Data", Data : {} ,Code:200});
        }
       }     
    });
  }
});



router.post('/joint/check_local_storage',async function (req, res) {
    temp_data_storedataModel.findOne({
       job_id: req.body.job_id,
       group_id : req.body.group_id,
    },async function (err, Functiondetails) {
     temp_data_storedataModel.findByIdAndRemove(Functiondetails._id, function (err, user) {
          if (err) return res.json({Status:"Failed",Message:"Internal Server Error", Data : {},Code:500});
            res.json({Status:"Success",Message:"joint/check_local_storage", Data : {} ,Code:200});
      });
    });
});








router.post('/find_job', function (req, res) {
        temp_data_storedataModel.find({job_id: req.body.job_id}, function (err, Functiondetails) {
          res.json({Status:"Success",Message:"activedetail_management", Data : Functiondetails ,Code:200});
        });
});

router.post('/delete_storage',async function (req, res) {
   var datas = await temp_data_storedataModel.findOne({job_id: req.body.job_id,group_id:req.body.group_id,user_id :req.body.user_id});
   if(datas == null){
      res.json({Status:"Success",Message:"Deleted", Data : {} ,Code:200});
   }else {
       temp_data_storedataModel.findByIdAndRemove(datas._id, function (err, user) {
          if (err) return res.json({Status:"Failed",Message:"Internal Server Error", Data : {},Code:500});
            res.json({Status:"Success",Message:"Deleted", Data : {} ,Code:200});
      });
   }
});

router.post('/edit', function (req, res) {
        temp_data_storedataModel.findByIdAndUpdate(req.body._id, req.body, {new: true}, function (err, UpdatedDetails) {
            if (err) return res.json({Status:"Failed",Message:"Internal Server Error", Data : {},Code:500});
             res.json({Status:"Success",Message:"activedetail_management Updated", Data : UpdatedDetails ,Code:200});
        });
});



router.post('/logout',async function (req, res) {
    var group_list = await temp_data_storedataModel.findOne({user_id:req.body._id});
    let a = {
attendance_end_date: req.body.attendance_end_date,
attendance_end_lat:req.body.attendance_end_lat,
attendance_end_long: req.body.attendance_end_long,
attendance_end_time: req.body.attendance_end_time,
    }
        temp_data_storedataModel.findByIdAndUpdate(group_list._id, a, {new: true}, function (err, UpdatedDetails) {
            if (err) return res.json({Status:"Failed",Message:"Internal Server Error", Data : {},Code:500});
             res.json({Status:"Success",Message:"activedetail_management Updated", Data : UpdatedDetails ,Code:200});
        });
});


// // DELETES A USER FROM THE DATABASE
router.post('/admin_delete', function (req, res) {
      temp_data_storedataModel.findByIdAndRemove(req.body._id, function (err, user) {
          if (err) return res.json({Status:"Failed",Message:"Internal Server Error", Data : {},Code:500});

          res.json({Status:"Success",Message:"activedetail_management Deleted successfully", Data : {} ,Code:200});
      });
});



// // DELETES A USER FROM THE DATABASE
router.post('/delete', function (req, res) {
      temp_data_storedataModel.findByIdAndRemove(req.body._id, function (err, user) {
          if (err) return res.json({Status:"Failed",Message:"Internal Server Error", Data : {},Code:500});
          res.json({Status:"Success",Message:"activedetail_management Deleted successfully", Data : {} ,Code:200});
      });
});











// ******************************************************************************************************************************************************************************
// OPERATION TEMP DATA DELETE PROCESS QUERY
// ******************************************************************************************************************************************************************************

router.post('/delete_old_record',async function (req, res) {
        temp_data_storedataModel.find({},async function (err, Functiondetails) {
         for(let a = 0 ; a < Functiondetails.length; a++){
          temp_data_storedataModel.findByIdAndRemove(Functiondetails[a]._id, function (err, user) {
          if (err) return res.json({Status:"Failed",Message:"Internal Server Error", Data : {},Code:500});
          });
           if(a == Functiondetails.length - 1){
            res.json({Status:"Success",Message:"Deleted", Data : {} ,Code:200});
           }
         }
        }).sort({_id:1}).limit(req.body.limit);
});


router.get('/getlist_count',async function (req, res) {
        temp_data_storedataModel.find({},async function (err, Functiondetails) {
         res.json({Status:"Success",Message:"Deleted", Data : Functiondetails ,Code:200});
        }).count();
});

// ******************************************************************************************************************************************************************************







module.exports = router;
