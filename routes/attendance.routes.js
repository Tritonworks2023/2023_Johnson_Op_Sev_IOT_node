var express = require('express');
var router = express.Router();
var bodyParser = require('body-parser');
router.use(bodyParser.urlencoded({ extended: false }));
router.use(bodyParser.json());
var attendanceModel = require('./../models/attendanceModel');



// ******************************************************************************************************************************************************************************
// OPERATION ATTENDANCE CREATE - MOBILE
// ******************************************************************************************************************************************************************************

router.post('/create', async function(req, res) {
  try{
        await attendanceModel.create({
  attendance_name :  req.body.attendance_name || "",
  attendance_start_date : req.body.attendance_start_date || "",
  attendance_start_date_time : req.body.attendance_start_date_time || "",
  attendance_end_date : req.body.attendance_end_date || "",
  attendance_end_time : req.body.attendance_end_time || "",
  attendance_start_lat : req.body.attendance_start_lat || 0,
  attendance_start_long : req.body.attendance_start_long || 0,
  attendance_end_lat : req.body.attendance_end_lat || 0,
  attendance_end_long : req.body.attendance_end_long || 0,
  attendance_created_at : req.body.attendance_created_at || "",
  distance_start_range : req.body.distance_start_range || 0,
  distance_end_range : req.body.distance_end_range || 0,
  user_id : req.body.user_id || "",
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
      attendanceModel.remove({}, function (err, user) {
          if (err) return res.status(500).send("There was a problem deleting the user.");
             res.json({Status:"Success",Message:"activedetail_management Deleted", Data : {} ,Code:200});     
      });
});


router.post('/getlist_id', function (req, res) {
        let final_data = []; 
         var keyword = req.body.search_string.toLowerCase();
         attendanceModel.find({}, function (err, StateList) {
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



router.get('/getlist', function (req, res) {
        attendanceModel.find({}, function (err, Functiondetails) {
          res.json({Status:"Success",Message:"activedetail_management", Data : Functiondetails ,Code:200});
        });
});


router.post('/edit', function (req, res) {
        attendanceModel.findByIdAndUpdate(req.body._id, req.body, {new: true}, function (err, UpdatedDetails) {
            if (err) return res.json({Status:"Failed",Message:"Internal Server Error", Data : {},Code:500});
             res.json({Status:"Success",Message:"activedetail_management Updated", Data : UpdatedDetails ,Code:200});
        });
});



router.post('/logout',async function (req, res) {
    var group_list = await attendanceModel.findOne({user_id:req.body._id});
    let a = {
attendance_end_date: req.body.attendance_end_date,
attendance_end_lat:req.body.attendance_end_lat,
attendance_end_long: req.body.attendance_end_long,
attendance_end_time: req.body.attendance_end_time,
    }
        attendanceModel.findByIdAndUpdate(group_list._id, a, {new: true}, function (err, UpdatedDetails) {
            if (err) return res.json({Status:"Failed",Message:"Internal Server Error", Data : {},Code:500});
             res.json({Status:"Success",Message:"activedetail_management Updated", Data : UpdatedDetails ,Code:200});
        });
});


// // DELETES A USER FROM THE DATABASE
router.post('/admin_delete', function (req, res) {
      attendanceModel.findByIdAndRemove(req.body._id, function (err, user) {
          if (err) return res.json({Status:"Failed",Message:"Internal Server Error", Data : {},Code:500});

          res.json({Status:"Success",Message:"activedetail_management Deleted successfully", Data : {} ,Code:200});
      });
});



// // DELETES A USER FROM THE DATABASE
router.post('/delete', function (req, res) {
      attendanceModel.findByIdAndRemove(req.body._id, function (err, user) {
          if (err) return res.json({Status:"Failed",Message:"Internal Server Error", Data : {},Code:500});
          res.json({Status:"Success",Message:"activedetail_management Deleted successfully", Data : {} ,Code:200});
      });
});
module.exports = router;
