var express = require('express');
var router = express.Router();
var bodyParser = require('body-parser');
router.use(bodyParser.urlencoded({ extended: false }));
router.use(bodyParser.json());
var service_attendanceModel = require('./../models/service_attendanceModel');

var request = require("request");


router.post('/create', async function(req, res) {
   var service_attendance_detail  =  await service_attendanceModel.findOne({user_mobile_no:req.body.user_mobile_no,att_date:req.body.att_date});
   if(service_attendance_detail == null){
      try{
        await service_attendanceModel.create({
  user_mobile_no : req.body.user_mobile_no || "",
  user_name : req.body.user_name || "",
  att_date : req.body.att_date || "",
  att_start_time : req.body.att_start_time || "",
  att_end_time : "",
  att_status : req.body.att_status || "",
  att_reason : "",
  att_start_lat: req.body.att_start_lat || "",
  att_start_long: req.body.att_start_long || "",
  att_end_lat : "",
  att_end_long : "",
  att_no_of_hrs : "0",
  attendance_data : [
     {
        att_start_time : req.body.att_start_time || "",
        att_end_time : "",
        att_no_of_hrs : "",
        att_reason: "",
     }
  ]
        }, function (err, user) {

request.post(
    'http://smart.johnsonliftsltd.com:3000/api/service_userdetails/update_login_time',
    { json: req.body},
    function (error, response, body) {
        if (!error && response.statusCode == 200) {
        }
    }
);

        res.json({Status:"Success",Message:"Attendance Marked Successfully", Data : user ,Code:200}); 
        });
}
catch(e){
      console.log(e);
      res.json({Status:"Failed",Message:"Internal Server Error", Data : {},Code:500});
}
}
else{

request.post(
    'http://smart.johnsonliftsltd.com:3000/api/service_userdetails/update_login_time',
    { json: req.body},
    function (error, response, body) {
        if (!error && response.statusCode == 200) {
        }
    }
);



     service_attendance_detail.attendance_data.push( {
        att_start_time : req.body.att_start_time || "",
        att_end_time : "",
        att_no_of_hrs : "",
        att_reason: ""
     })
 let datas = {
     att_reason : '',
     attendance_data : service_attendance_detail.attendance_data
 }
service_attendanceModel.findByIdAndUpdate(service_attendance_detail._id, datas, {new: true}, function (err, UpdatedDetails) {
            if (err) return res.json({Status:"Failed",Message:"Internal Server Error", Data : {},Code:500});
             res.json({Status:"Success",Message:"Attendance Marked Successfully", Data : UpdatedDetails ,Code:200});
});
}
});





router.get('/deletes', function (req, res) {
      service_attendanceModel.remove({}, function (err, user) {
          if (err) return res.status(500).send("There was a problem deleting the user.");
             res.json({Status:"Success",Message:"activedetail_management Deleted", Data : {} ,Code:200});     
      });
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



router.get('/getlist', function (req, res) {
        service_attendanceModel.find({}, function (err, Functiondetails) {
          res.json({Status:"Success",Message:"activedetail_management", Data : Functiondetails ,Code:200});
        });
});


router.post('/check_login_status', function (req, res) {
        service_attendanceModel.findOne({user_mobile_no:req.body.user_mobile_no,att_date:req.body.att_date}, function (err, Functiondetails) {
           if(Functiondetails == null){
          res.json({Status:"Failed",Message:"Not Present", Data : {} ,Code:404});
           }else{
              if(Functiondetails.att_reason == ''){
                 res.json({Status:"Success",Message:"Present", Data : Functiondetails ,Code:200});
              }else {
                res.json({Status:"Failed",Message:"Not Present", Data : {} ,Code:404});
                // res.json({Status:"Failed",Message:"Already Logout", Data : {} ,Code:404});
              }
           }
        });
});




router.post('/edit', function (req, res) {
        service_attendanceModel.findByIdAndUpdate(req.body._id, req.body, {new: true}, function (err, UpdatedDetails) {
            if (err) return res.json({Status:"Failed",Message:"Internal Server Error", Data : {},Code:500});
             res.json({Status:"Success",Message:"activedetail_management Updated", Data : UpdatedDetails ,Code:200});
        });
});



router.post('/logout',async function (req, res) {
   console.log(req.body);
   var service_attendance_detail  =  await service_attendanceModel.findOne({_id:req.body._id});
   // console.log(service_attendance_detail);
   // console.log(service_attendance_detail.attendance_data.length);
   var last_count = service_attendance_detail.attendance_data.length - 1;
   service_attendance_detail.attendance_data[last_count].att_end_time = req.body.att_end_time;
   service_attendance_detail.attendance_data[last_count].att_no_of_hrs = req.body.att_no_of_hrs;
   service_attendance_detail.attendance_data[last_count].att_reason = req.body.att_reason;
   console.log(service_attendance_detail.attendance_data[last_count]);
   var  att_no_of_hrs = +service_attendance_detail.att_no_of_hrs + +req.body.att_no_of_hrs;
   console.log(att_no_of_hrs);
   req.body.attendance_data = service_attendance_detail.attendance_data;
   req.body.att_no_of_hrs = att_no_of_hrs;
   console.log(req.body);
        service_attendanceModel.findByIdAndUpdate(req.body._id, req.body, {new: true}, function (err, UpdatedDetails) {
            if (err) return res.json({Status:"Failed",Message:"Internal Server Error", Data : {},Code:500});
             
request.post(
    'http://smart.johnsonliftsltd.com:3000/api/service_userdetails/update_logout_time',
    { json: req.body},
    function (error, response, body) {
        if (!error && response.statusCode == 200) {
        }
    }
);
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
