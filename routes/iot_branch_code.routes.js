var express = require('express');
var router = express.Router();
var bodyParser = require('body-parser');
router.use(bodyParser.urlencoded({ extended: false }));
router.use(bodyParser.json());
var iot_branch_codeModel = require('./../models/iot_branch_codeModel');




router.post('/create', async function(req, res) {
  var iot_branch_detail  =  await iot_branch_codeModel.findOne({branch_code:   req.body.branch_code});
  if(iot_branch_detail == null){
  try{
        await iot_branch_codeModel.create({  
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
      iot_branch_codeModel.remove({}, function (err, user) {
          if (err) return res.status(500).send("There was a problem deleting the user.");
             res.json({Status:"Success",Message:"iot branch code Deleted", Data : {} ,Code:200});     
      });
});


router.post('/getlist_id', function (req, res) {
        iot_branch_codeModel.find({user_id:req.body.user_id}, function (err, StateList) {
          res.json({Status:"Success",Message:"iot branch code List", Data : StateList ,Code:200});
        });
});



router.post('/mobile/login_page', function (req, res) {
        iot_branch_codeModel.findOne({user_id:req.body.user_id,user_password:req.body.user_password}, function (err, StateList) {
            if(StateList == null){
              res.json({Status:"Failed",Message:"Account not found", Data : {} ,Code:404});
            }else{
              res.json({Status:"Success",Message:"iot branch code Details", Data : StateList ,Code:200});
            }          
        });
});


router.get('/reload_data2',async function (req, res) {
        var ref_code_details  =  await iot_branch_codeModel.find({}).sort({index:1});
        for(let a  = 0; a < ref_code_details.length ; a ++){
         let d = {
            user_role : "USER",
         }
         iot_branch_codeModel.findByIdAndUpdate(ref_code_details[a]._id, d, {new: true}, function (err, UpdatedDetails) {
            if (err) return res.json({Status:"Failed",Message:"Internal Server Error", Data : {},Code:500});
        });
         if(a == ref_code_details.length - 1){
            res.json({Status:"Success",Message:"iot branch code Updated", Data : {} ,Code:200});
         }
        }

});


router.post('/admin_delete', function (req, res) {
      iot_branch_codeModel.findByIdAndRemove(req.body._id, function (err, user) {
          if (err) return res.json({Status:"Failed",Message:"Internal Server Error", Data : {},Code:500});
          res.json({Status:"Success",Message:"iot branch code Deleted successfully", Data : {} ,Code:200});
      });
});



// ******************************************************************************************************************************************************************************
// IOT DETAILS BRANCH LIST - ADMIN PANEL
// ******************************************************************************************************************************************************************************

router.get('/getlist', function (req, res) {
        iot_branch_codeModel.find({}, function (err, Functiondetails) {
          res.json({Status:"Success",Message:"iot branch code", Data : Functiondetails ,Code:200});
        });
});



router.get('/getlist_custom', function (req, res) {
        iot_branch_codeModel.find({}, function (err, Functiondetails) {
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
        iot_branch_codeModel.findByIdAndUpdate(req.body._id, req.body, {new: true}, function (err, UpdatedDetails) {
            if (err) return res.json({Status:"Failed",Message:"Internal Server Error", Data : {},Code:500});
             res.json({Status:"Success",Message:"iot branch code Updated", Data : UpdatedDetails ,Code:200});
        });
});
// // DELETES A USER FROM THE DATABASE
router.post('/delete', function (req, res) {
      iot_branch_codeModel.findByIdAndRemove(req.body._id, function (err, user) {
          if (err) return res.json({Status:"Failed",Message:"Internal Server Error", Data : {},Code:500});
          res.json({Status:"Success",Message:"iot branch code Deleted successfully", Data : {} ,Code:200});
      });
});
module.exports = router;
