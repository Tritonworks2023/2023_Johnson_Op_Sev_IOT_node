var express = require('express');
var router = express.Router();
var bodyParser = require('body-parser');
router.use(bodyParser.urlencoded({ extended: false }));
router.use(bodyParser.json());
var service_employee_activity_allocationModel = require('./../models/service_employee_activity_allocationModel');
var service_user_management = require('./../models/service_userdetailsModel');




// ******************************************************************************************************************************************************************************
// SERVICE EMPLOYEE ALLOCATION CREATE - ADMIN PANEL
// ******************************************************************************************************************************************************************************
router.post('/create', async function(req, res) {
  try{

        await service_employee_activity_allocationModel.create({
  employee_no: req.body.employee_no,
  activity_code : req.body.activity_code,
  activity_name : req.body.activity_name,
  date_and_time : req.body.date_and_time,
        }, 
        function (err, user) {
        res.json({Status:"Success",Message:"Added successfully", Data : user ,Code:200}); 
        });
}
catch(e){
      res.json({Status:"Failed",Message:"Internal Server Error", Data : {},Code:500});
}
});





router.post('/updated_value', async function(req, res) {
var user_detail  =  await service_user_management.find({emp_type:"Mechanic"});
 var index = 0;
 recall(index);
 async function recall(index){
    if(index < user_detail.length){
  try{
  await service_employee_activity_allocationModel.create({
           "employee_no": user_detail[index].user_mobile_no,
           "activity_code": req.body.service_code,
           "activity_name":  req.body.service_name,
           "date_and_time":  req.body.date_of_create,
        }, 
        function (err, user) {

        // res.json({Status:"Success",Message:"Added successfully", Data : user ,Code:200});
         index = index + 1;
         recall(index); 
        });
}
catch(e){
      res.json({Status:"Failed",Message:"Internal Server Error", Data : {},Code:500});
}
    }
    else{
      res.json({Status:"Success",Message:"Completed", Data : {} ,Code:200}); 
    }
 } 
});








// {
//             "_id": "63884d331bdff8392287bdb8",
//             "employee_no": "9500069135",
//             "activity_code": "PR",
//             "activity_name": "Parts Replacement ACK",
//             "date_and_time": "2022-12-01T06:44:03.551Z",
//             "__v": 0
// },

// {
//             "_id": "63884d4d1bdff8392287bed2",
//             "employee_no": "7358707999",
//             "activity_code": "BD",
//             "activity_name": "Breakdown Serivce",
//             "date_and_time": "2022-12-01T06:44:29.736Z",
//             "__v": 0
// },

// {
//             "_id": "63884d4e1bdff8392287bee5",
//             "employee_no": "7358707999",
//             "activity_code": "LR",
//             "activity_name": "LR SERVICE",
//             "date_and_time": "2022-12-01T06:44:30.717Z",
//             "__v": 0
// },

// {
//             "_id": "63884d4f1bdff8392287bee7",
//             "employee_no": "7358707999",
//             "activity_code": "PM",
//             "activity_name": "Preventive Maintenance",
//             "date_and_time": "2022-12-01T06:44:31.360Z",
//             "__v": 0
// }



router.get('/deletes', function (req, res) {
      service_employee_activity_allocationModel.remove({}, function (err, user) {
          if (err) return res.status(500).send("There was a problem deleting the user.");
             res.json({Status:"Success",Message:"service_employee_activity_allocationModel Deleted", Data : {} ,Code:200});     
      });
});


// ******************************************************************************************************************************************************************************
// SERVICE EMPLOYEE ALLOCATION DETAILS - ADMIN PANEL
// ******************************************************************************************************************************************************************************
router.post('/fetch_allocation', function (req, res) {
        service_employee_activity_allocationModel.find({employee_no: req.body.employee_no}, function (err, StateList) {
          res.json({Status:"Success",Message:"Allocation List", Data : StateList ,Code:200});
        });
});




router.post('/fetch_allocation_delete',async function (req, res) {
        service_employee_activity_allocationModel.find({"activity_name":req.body.service_name},async function (err, StateList) {
          // res.json({Status:"Success",Message:"Allocation List", Data : StateList ,Code:200});
           for(let a = 0 ; a < StateList.length ; a++ ){
        service_employee_activity_allocationModel.findByIdAndRemove(StateList[a]._id, function (err, user) {
            console.log(err);
          if (err) return res.json({Status:"Failed",Message:"Internal Server Error", Data : {},Code:500});
           // res.json({Status:"Success",Message:"Allocation Deleted successfully", Data : {} ,Code:200});
            });
            if(a == StateList.length - 1){
                res.json({Status:"Success",Message:"Allocation Deleted successfully", Data : {} ,Code:200});
            }
           }
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

// ******************************************************************************************************************************************************************************
// SERVICE EMPLOYEE ALLOCATION DELETE - ADMIN PANEL
// ******************************************************************************************************************************************************************************
// // DELETES A USER FROM THE DATABASE
router.post('/delete',async function (req, res) {
      service_employee_activity_allocationModel.findByIdAndRemove(req.body._id, function (err, user) {
          if (err) return res.json({Status:"Failed",Message:"Internal Server Error", Data : {},Code:500});
          res.json({Status:"Success",Message:"Allocation Deleted successfully", Data : {} ,Code:200});
      });
});
module.exports = router;
