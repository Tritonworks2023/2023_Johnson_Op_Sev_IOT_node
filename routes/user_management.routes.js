var express = require('express');
var router = express.Router();
var bodyParser = require('body-parser');
router.use(bodyParser.urlencoded({ extended: false }));
router.use(bodyParser.json());
var user_management = require('./../models/user_managementModel');


router.post('/create', async function(req, res) {
  try{
        await user_management.create({  
  user_id:  req.body.user_id || "",
  user_email_id : req.body.user_email_id || "",
  user_password : req.body.user_password || "",
  user_name : req.body.user_name || "",
  user_designation : req.body.user_designation || "",
  user_role :  req.body.user_role || "",
  user_type : req.body.user_type || "",
  user_status : req.body.user_status || "",
  reg_date_time : req.body.reg_date_time || "",
  user_token : req.body.user_token || "",
  last_login_time : req.body.last_login_time || "",
  last_logout_time: req.body.last_logout_time || "",
  delete_status : false,
  imie_code : req.body.imie_code || "",
  agent_code : req.body.agent_code || "",
  location: req.body.location || "",
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
      user_management.remove({}, function (err, user) {
          if (err) return res.status(500).send("There was a problem deleting the user.");
             res.json({Status:"Success",Message:"User management Deleted", Data : {} ,Code:200});     
      });
});


router.post('/getlist_id', function (req, res) {
        user_management.find({user_id:req.body.user_id}, function (err, StateList) {
          res.json({Status:"Success",Message:"User management List", Data : StateList ,Code:200});
        });
});


router.post('/getlist_fetch_id', function (req, res) {
        user_management.findOne({_id:req.body.user_id}, function (err, StateList) {
          res.json({Status:"Success",Message:"User management List", Data : StateList ,Code:200});
        });
});



router.post('/mobile/login_page', function (req, res) {
    console.log(req.body);
        user_management.findOne({user_id:req.body.user_id,user_type : "Mobile",user_password:req.body.user_password}, function (err, StateList) {
            if(StateList == null){
              res.json({Status:"Failed",Message:"Account not found", Data : {} ,Code:404});
            } else {
               // console.log(req.body);
               console.log(StateList);
               res.json({Status:"Success",Message:"User Details", Data : StateList ,Code:200});
               // if(req.body.device_id == StateList.imie_code){
               //    res.json({Status:"Success",Message:"User Details", Data : StateList ,Code:200});
               // }else if(req.body.user_id == '7338865027'){
               //    res.json({Status:"Success",Message:"User Details", Data : StateList ,Code:200});
               // }else if(req.body.device_id == 'fc1f4f9f4b061c27'){
               //    res.json({Status:"Success",Message:"User Details", Data : StateList ,Code:200});
               // }
               // else {
               //     res.json({Status:"Failed",Message:"INVALID DEVICE ID PLEASE CHECK.", Data : {} ,Code:404});
               // }
            }          
        });
});


router.get('/reload_data2',async function (req, res) {
        var ref_code_details  =  await user_management.find({}).sort({index:1});
        for(let a  = 0; a < ref_code_details.length ; a ++){
         let d = {
            user_role : "USER",
         }
         user_management.findByIdAndUpdate(ref_code_details[a]._id, d, {new: true}, function (err, UpdatedDetails) {
            if (err) return res.json({Status:"Failed",Message:"Internal Server Error", Data : {},Code:500});
        });
         if(a == ref_code_details.length - 1){
            res.json({Status:"Success",Message:"group_detailModel Updated", Data : {} ,Code:200});
         }
        }

});


router.post('/admin_delete', function (req, res) {
      user_management.findByIdAndRemove(req.body._id, function (err, user) {
          if (err) return res.json({Status:"Failed",Message:"Internal Server Error", Data : {},Code:500});
          res.json({Status:"Success",Message:"User management Deleted successfully", Data : {} ,Code:200});
      });
});


router.get('/getlist', function (req, res) {
        user_management.find({}, function (err, Functiondetails) {
          res.json({Status:"Success",Message:"User management", Data : Functiondetails ,Code:200});
        });
});


router.post('/edit', function (req, res) {
        user_management.findByIdAndUpdate(req.body._id, req.body, {new: true}, function (err, UpdatedDetails) {
            if (err) return res.json({Status:"Failed",Message:"Internal Server Error", Data : {},Code:500});
             res.json({Status:"Success",Message:"User management Updated", Data : UpdatedDetails ,Code:200});
        });
});
// // DELETES A USER FROM THE DATABASE
router.post('/delete', function (req, res) {
      user_management.findByIdAndRemove(req.body._id, function (err, user) {
          if (err) return res.json({Status:"Failed",Message:"Internal Server Error", Data : {},Code:500});
          res.json({Status:"Success",Message:"User management Deleted successfully", Data : {} ,Code:200});
      });
});
module.exports = router;
