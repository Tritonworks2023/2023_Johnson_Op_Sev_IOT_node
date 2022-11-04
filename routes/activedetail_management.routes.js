var express = require('express');
var router = express.Router();
var bodyParser = require('body-parser');
router.use(bodyParser.urlencoded({ extended: false }));
router.use(bodyParser.json());
var activedetail_managementModel = require('./../models/activedetail_managementModel');


router.post('/create', async function(req, res) {
  try{
        await activedetail_managementModel.create({
  activedetail_name : req.body.activedetail_name || "",
  activedetail_created_at : req.body.activedetail_created_at || "",
  activedetail_update_at : req.body.activedetail_update_at || "",
  activedetail_created_by : req.body.activedetail_created_by || "",
  activedetail_updated_by : req.body.activedetail_updated_by || ""
        }, 
        function (err, user) {
          console.log(user)
        res.json({Status:"Success",Message:"Added successfully", Data : user ,Code:200}); 
        });
}
catch(e){
      res.json({Status:"Failed",Message:"Internal Server Error", Data : {},Code:500});
}
});


router.get('/deletes', function (req, res) {
      activedetail_managementModel.remove({}, function (err, user) {
          if (err) return res.status(500).send("There was a problem deleting the user.");
             res.json({Status:"Success",Message:"activedetail_management Deleted", Data : {} ,Code:200});     
      });
});


router.post('/getlist_id', function (req, res) {
        let final_data = []; 
         var keyword = req.body.search_string.toLowerCase();
         activedetail_managementModel.find({}, function (err, StateList) {
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
        activedetail_managementModel.find({}, function (err, Functiondetails) {
          res.json({Status:"Success",Message:"activedetail_management", Data : Functiondetails ,Code:200});
        });
});


router.post('/edit', function (req, res) {
        activedetail_managementModel.findByIdAndUpdate(req.body._id, req.body, {new: true}, function (err, UpdatedDetails) {
            if (err) return res.json({Status:"Failed",Message:"Internal Server Error", Data : {},Code:500});
             res.json({Status:"Success",Message:"activedetail_management Updated", Data : UpdatedDetails ,Code:200});
        });
});

// // DELETES A USER FROM THE DATABASE
router.post('/admin_delete', function (req, res) {
      activedetail_managementModel.findByIdAndRemove(req.body._id, function (err, user) {
          if (err) return res.json({Status:"Failed",Message:"Internal Server Error", Data : {},Code:500});
          res.json({Status:"Success",Message:"activedetail_management Deleted successfully", Data : {} ,Code:200});
      });
});



// // DELETES A USER FROM THE DATABASE
router.post('/delete', function (req, res) {
      activedetail_managementModel.findByIdAndRemove(req.body._id, function (err, user) {
          if (err) return res.json({Status:"Failed",Message:"Internal Server Error", Data : {},Code:500});
          res.json({Status:"Success",Message:"activedetail_management Deleted successfully", Data : {} ,Code:200});
      });
});
module.exports = router;
