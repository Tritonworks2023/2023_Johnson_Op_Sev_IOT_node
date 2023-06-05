var express = require('express');
var router = express.Router();
var bodyParser = require('body-parser');
router.use(bodyParser.urlencoded({ extended: false }));
router.use(bodyParser.json());
var tab_user_management = require('./../models/tab_usermanagerModel');


router.post('/create', async function(req, res) {
  try{
        await tab_user_management.create({  
  user_id:  req.body.user_id || "",
  user_password : req.body.user_password || "",
  user_name : req.body.user_name || "",
  user_location : req.body.user_location || "",
  user_agent_code : req.body.user_agent_code || "",
  user_status :  req.body.user_status || "",
  user_status_us_on_date : req.body.user_status_us_on_date || "",
  user_imei_no : req.body.user_imei_no || "",
  delete_status : false,

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
      tab_user_management.remove({}, function (err, user) {
          if (err) return res.status(500).send("There was a problem deleting the user.");
             res.json({Status:"Success",Message:"User management Deleted", Data : {} ,Code:200});     
      });
});


router.post('/getlist_id', function (req, res) {
        tab_user_management.find({user_id:req.body.user_id}, function (err, StateList) {
          res.json({Status:"Success",Message:"User management List", Data : StateList ,Code:200});
        });
});



router.post('/mobile/login_page', function (req, res) {
        tab_user_management.findOne({user_id:req.body.user_id,user_password:req.body.user_password}, function (err, StateList) {
            if(StateList == null){
              res.json({Status:"Failed",Message:"Account not found", Data : {} ,Code:404});
            }else{
              res.json({Status:"Success",Message:"User Details", Data : StateList ,Code:200});
            }          
        });
});


router.get('/reload_data2',async function (req, res) {
        var ref_code_details  =  await tab_user_management.find({}).sort({index:1});
        for(let a  = 0; a < ref_code_details.length ; a ++){
         let d = {
            user_role : "USER",
         }
         tab_user_management.findByIdAndUpdate(ref_code_details[a]._id, d, {new: true}, function (err, UpdatedDetails) {
            if (err) return res.json({Status:"Failed",Message:"Internal Server Error", Data : {},Code:500});
        });
         if(a == ref_code_details.length - 1){
            res.json({Status:"Success",Message:"group_detailModel Updated", Data : {} ,Code:200});
         }
        }

});


router.post('/admin_delete', function (req, res) {
      tab_user_management.findByIdAndRemove(req.body._id, function (err, user) {
          if (err) return res.json({Status:"Failed",Message:"Internal Server Error", Data : {},Code:500});
          res.json({Status:"Success",Message:"User management Deleted successfully", Data : {} ,Code:200});
      });
});


router.get('/getlist', function (req, res) {
        tab_user_management.find({}, function (err, Functiondetails) {
          res.json({Status:"Success",Message:"User management", Data : Functiondetails ,Code:200});
        });
});


router.post('/edit', function (req, res) {
        tab_user_management.findByIdAndUpdate(req.body._id, req.body, {new: true}, function (err, UpdatedDetails) {
            if (err) return res.json({Status:"Failed",Message:"Internal Server Error", Data : {},Code:500});
             res.json({Status:"Success",Message:"User management Updated", Data : UpdatedDetails ,Code:200});
        });
});
// // DELETES A USER FROM THE DATABASE
router.post('/delete', function (req, res) {
      tab_user_management.findByIdAndRemove(req.body._id, function (err, user) {
          if (err) return res.json({Status:"Failed",Message:"Internal Server Error", Data : {},Code:500});
          res.json({Status:"Success",Message:"User management Deleted successfully", Data : {} ,Code:200});
      });
});
module.exports = router;
