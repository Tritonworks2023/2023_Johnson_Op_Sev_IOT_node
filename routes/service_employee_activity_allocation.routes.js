var express = require('express');
var router = express.Router();
var bodyParser = require('body-parser');
router.use(bodyParser.urlencoded({ extended: false }));
router.use(bodyParser.json());
var service_employee_activity_allocationModel = require('./../models/service_employee_activity_allocationModel');


router.post('/create', async function(req, res) {
  try{

        await service_employee_activity_allocationModel.create({
  employee_no: req.body.employee_no,
  activity_code : req.body.activity_code,
  activity_name : req.body.activity_name,
  date_and_time : req.body.date_and_time,
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
      service_employee_activity_allocationModel.remove({}, function (err, user) {
          if (err) return res.status(500).send("There was a problem deleting the user.");
             res.json({Status:"Success",Message:"service_employee_activity_allocationModel Deleted", Data : {} ,Code:200});     
      });
});


router.post('/fetch_allocation', function (req, res) {
        service_employee_activity_allocationModel.find({employee_no: req.body.employee_no}, function (err, StateList) {
          res.json({Status:"Success",Message:"Allocation List", Data : StateList ,Code:200});
        });
});



router.get('/getlist', function (req, res) {
        service_employee_activity_allocationModel.find({}, function (err, Functiondetails) {
          res.json({Status:"Success",Message:"Functiondetails", Data : Functiondetails ,Code:200});
        });
});


router.post('/edit', function (req, res) {
        service_employee_activity_allocationModel.findByIdAndUpdate(req.body.Activity_id, req.body, {new: true}, function (err, UpdatedDetails) {
            if (err) return res.json({Status:"Failed",Message:"Internal Server Error", Data : {},Code:500});
             res.json({Status:"Success",Message:"Functiondetails Updated", Data : UpdatedDetails ,Code:200});
        });
});
// // DELETES A USER FROM THE DATABASE
router.post('/delete',async function (req, res) {
      var user_details  =  await service_employee_activity_allocationModel.findOne({employee_no: req.body.employee_no,activity_code : req.body.activity_code});
      service_employee_activity_allocationModel.findByIdAndRemove(user_details._id, function (err, user) {
          if (err) return res.json({Status:"Failed",Message:"Internal Server Error", Data : {},Code:500});
          res.json({Status:"Success",Message:"Allocation Deleted successfully", Data : {} ,Code:200});
      });
});
module.exports = router;
