var express = require('express');
var router = express.Router();
var bodyParser = require('body-parser');
router.use(bodyParser.urlencoded({ extended: false }));
router.use(bodyParser.json());
var location_tracking_job_wiseModel = require('./../models/location_tracking_job_wiseModel');
var service_user_management = require('./../models/service_userdetailsModel');


router.post('/create', async function(req, res) {
  let a = {
  "job_no" : req.body.job_no,
  "complaint_no" : req.body.complaint_no,
  "user_mobile_no" : req.body.user_mobile_no,
  "location_text" : req.body.location_text,
  "loc_lat" : req.body.loc_lat,
  "loc_long" : req.body.loc_long,
  "date" : req.body.date,
  "km" : req.body.km,
  "remarks" : req.body.remarks,
  }   
var data  = await location_tracking_job_wiseModel.create(a);
res.json({Status:"Success",Message:"location_added", Data : data ,Code:200});     
});


router.get('/deletes', function (req, res) {
      location_tracking_job_wiseModel.remove({}, function (err, user) {
          if (err) return res.status(500).send("There was a problem deleting the user.");
             res.json({Status:"Success",Message:"location_tracking_job_wiseModel Deleted", Data : {} ,Code:200});     
      });
});


router.post('/getlist_id', function (req, res) {
     // req.body.group_id = '629ede01886f5404a75d4a91';
let datas = [{
form_type: "1",
group_id: "629ede01886f5404a75d4a91",
sub_group_detail_created_at: "3/8/2022, 3:35:28 PM",
sub_group_detail_created_by: "3/8/2022, 3:35:28 PM",
sub_group_detail_name: "Joint Insepection",
sub_group_detail_update_at: "",
sub_group_detail_updated_by: "",
__v: 0,
_id: "62272a6927c1eb17e6365877",
}];
res.json({Status:"Success",Message:"location_tracking_job_wiseModel List", Data : datas ,Code:200});     

     // let final_data = []; 
     // var keyword = req.body.search_string.toLowerCase();
     //    location_tracking_job_wiseModel.find({group_id:req.body.group_id}, function (err, StateList) {
     //      if(StateList.length == 0 || req.body.search_string == ""){
     //        res.json({Status:"Success",Message:"location_tracking_job_wiseModel List", Data : StateList ,Code:200});
     //      }else {
     //      for(let a = 0 ; a  < StateList.length; a ++){
     //      var active_text = StateList[a].sub_group_detail_name.toLowerCase();
     //      if(active_text.indexOf(keyword) !== -1 == true){
     //           final_data.push(StateList[a]);
     //      }
     //      if(a == StateList.length - 1){
     //         res.json({Status:"Success",Message:"location_tracking_job_wiseModel List", Data : final_data ,Code:200});
     //      }
     //      }
     //      }
     //      // res.json({Status:"Success",Message:"State List", Data : StateList ,Code:200});
     //    });
});



router.get('/getlist', function (req, res) {

        location_tracking_job_wiseModel.find({km: {$in : ["Preventive Maintance", "Breakdown Serivce", "Audit"]}, loc_lat: {$nin : ["0"]}, loc_long: {$nin : ["0"]}}, function (err, Functiondetails) {
          res.json({Status:"Success",Message:"Functiondetails", Data : Functiondetails ,Code:200});
        });
});


router.post('/admin_delete', function (req, res) {
      location_tracking_job_wiseModel.findByIdAndRemove(req.body._id, function (err, user) {
          if (err) return res.json({Status:"Failed",Message:"Internal Server Error", Data : {},Code:500});
          res.json({Status:"Success",Message:"SubFunction Deleted successfully", Data : {} ,Code:200});
      });
});


router.get('/update_gorup_id',async function (req, res) {
    var sub_group_detail  =  await location_tracking_job_wiseModel.find({});
    let c = {
        "group_id": "629ede01886f5404a75d4a91",
    }
    for(let a  = 0 ; a < sub_group_detail.length ; a++){
        location_tracking_job_wiseModel.findByIdAndUpdate(sub_group_detail[a]._id, c, {new: true}, function (err, UpdatedDetails) {
            if (err) return res.json({Status:"Failed",Message:"Internal Server Error", Data : {},Code:500});             
        });
        if(a == sub_group_detail.length - 1){
            res.json({Status:"Success",Message:"Functiondetails Updated", Data : {} ,Code:200});
        }
    }
});


router.post('/edit', function (req, res) {
        location_tracking_job_wiseModel.findByIdAndUpdate(req.body._id, req.body, {new: true}, function (err, UpdatedDetails) {
            if (err) return res.json({Status:"Failed",Message:"Internal Server Error", Data : {},Code:500});
             res.json({Status:"Success",Message:"Functiondetails Updated", Data : UpdatedDetails ,Code:200});
        });
});


// ******************************************************************************************************************************************************************************
// SERVICE LISTING TRACKING JOB WISE - ADMIN PANEL
// ******************************************************************************************************************************************************************************

router.post('/list_tracking_job_wise', function (req, res) {
         location_tracking_job_wiseModel.find({"job_no" : req.body.job_no}, function (err, Functiondetails) {
          res.json({Status:"Success",Message:"Functiondetails", Data : Functiondetails ,Code:200});
        });
});



// ******************************************************************************************************************************************************************************
// SERVICE LISTING TRACKING USER WISE - ADMIN PANEL
// ******************************************************************************************************************************************************************************

router.post('/list_tracking_user_wise',async function (req, res) {
    console.log(req.body);
         var job_details_two  = await service_user_management.findOne({user_id: req.body.user_mobile_no});
         location_tracking_job_wiseModel.find({"user_mobile_no" : job_details_two.user_mobile_no, km: {$in : ["Preventive Maintance", "Breakdown Serivce", "Audit"]}, loc_lat: {$nin : ["0"]}, loc_long: {$nin : ["0"]} }, function (err, Functiondetails) {
         var final_value = [];
          for(let a = 0; a < Functiondetails.length ; a ++){
            var comp_date = new Date(Functiondetails[a].date).toString().substring(0,15);
            var current_date = new Date(req.body.current_date).toString().substring(0,15);
            if(comp_date ==  current_date){
              final_value.push(Functiondetails[a]);
              
              // if(Functiondetails[a].km == 'Breakdown Serivce'){
              //   location_tracking_job_wiseModel.findByIdAndRemove(Functiondetails[a]._id, function (err, user) {
              //   if (err) return res.json({Status:"Failed",Message:"Internal Server Error", Data : {},Code:500});
              //     // res.json({Status:"Success",Message:"SubFunction Deleted successfully", Data : {} ,Code:200});
              //    });
              // }

            }
            if(a ==  Functiondetails.length - 1){
                res.json({Status:"Success",Message:"Functiondetails", Data : final_value ,Code:200});
            }
          }
        });
});


// // DELETES A USER FROM THE DATABASE
router.post('/delete', function (req, res) {
      location_tracking_job_wiseModel.findByIdAndRemove(req.body.Activity_id, function (err, user) {
          if (err) return res.json({Status:"Failed",Message:"Internal Server Error", Data : {},Code:500});
          res.json({Status:"Success",Message:"SubFunction Deleted successfully", Data : {} ,Code:200});
      });
});
module.exports = router;
