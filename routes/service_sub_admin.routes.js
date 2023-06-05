var express = require('express');
var router = express.Router();
var bodyParser = require('body-parser');
router.use(bodyParser.urlencoded({ extended: false }));
router.use(bodyParser.json());
var service_sub_adminMdodel = require('./../models/service_sub_adminMdodel');




// ******************************************************************************************************************************************************************************
// SERVICE SUB ADMIN CREATE 
// ******************************************************************************************************************************************************************************

router.post('/create', async function(req, res) {
  try{
        await service_sub_adminMdodel.create({
  firstname : req.body.firstname,
  lastname : req.body.lastname,
  status : req.body.status,
  email_id : req.body.email_id,
  mobile_no :  req.body.mobile_no,
  user_name :  req.body.user_name,
  password : req.body.password,
  confirm_password : req.body.confirm_password,
  access_live : req.body.access_live,
  employee_detail :  req.body.employee_detail,
  delete_status : req.body.delete_status,
  last_login : new Date()
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
      service_sub_adminMdodel.remove({}, function (err, user) {
          if (err) return res.status(500).send("There was a problem deleting the user.");
             res.json({Status:"Success",Message:"service_sub_adminMdodel Deleted", Data : {} ,Code:200});     
      });
});


router.post('/getlist_id', function (req, res) {
        service_sub_adminMdodel.find({Person_id:req.body.Person_id}, function (err, StateList) {
          res.json({Status:"Success",Message:"State List", Data : StateList ,Code:200});
        });
});


// ******************************************************************************************************************************************************************************
// SERVICE FETCH SUB ADMIN DETAILS BY MOBILE
// ******************************************************************************************************************************************************************************
router.post('/fetch_data', function (req, res) {
        service_sub_adminMdodel.findOne({ mobile_no :  req.body.mobile_no}, function (err, StateList) {
            if(StateList == null){
                res.json({Status:"Failed",Message:"No Details Found", Data : {} ,Code:404});
            }else{
                res.json({Status:"Success",Message:"Sub Admin Detail", Data : StateList ,Code:404});
            }
         
        });
});



router.post('/mobile/login_page',async function (req, res) {
        service_sub_adminMdodel.findOne({mobile_no:req.body.user_mobile_no,password:req.body.user_password}, function (err, StateList) {
            if(StateList == null){
              res.json({Status:"Failed",Message:"Account not found", Data : {} ,Code:404});
            } else {
               

            let a = {
            "_id": StateList._id,
            "firstname": StateList.firstname,
            "lastname": StateList.lastname,
            "status":StateList.status,
            "email_id": StateList.email_id,
            "mobile_no":StateList.mobile_no,
            "user_name": StateList.user_name,
            "password": StateList.password,
            "last_login" : new Date()
            }
            service_sub_adminMdodel.findByIdAndUpdate(StateList._id, {last_login : new Date()}, {new: true}, function (err, UpdatedDetails) {
            if (err) return res.json({Status:"Failed",Message:"Internal Server Error", Data : {},Code:500});
             // res.json({Status:"Success",Message:"Functiondetails Updated", Data : UpdatedDetails ,Code:200});
           });
            res.json({Status:"Success",Message:"User Details", Data : a ,Code:200});
               // if(req.body.device_id == StateList.imie_code){
               //    res.json({Status:"Success",Message:"User Details", Data : StateList ,Code:200});
               // }else {
               //     res.json({Status:"Failed",Message:"INVALID DEVICE ID PLEASE CHECK.", Data : {} ,Code:404});
               // }
            }          
        });
});




router.post('/service_list', function (req, res) {
      
      let a = [
        {
            service_name : "Breakdown",
        },
         {
            service_name : "LR SERVICE",
        },
         {
            service_name : "PREVENTIVE SERVICE",
        },
         {
            service_name : "PART REPLACENMENT",
        },
         {
            service_name : "ONE",
        },
         {
            service_name : "TWO",
        },
         {
            service_name : "THREE",
        },
         {
            service_name : "FOUR",
        },

      ]
      res.json({Status:"Success",Message:"service_list", Data : a ,Code:200});
});





router.get('/getlist', function (req, res) {
        service_sub_adminMdodel.find({}, function (err, Functiondetails) {
          res.json({Status:"Success",Message:"Functiondetails", Data : Functiondetails ,Code:200});
        });
});


// ******************************************************************************************************************************************************************************
// SERVICE SUB ADMIN EDIT 
// ******************************************************************************************************************************************************************************
router.post('/edit', function (req, res) {
        service_sub_adminMdodel.findByIdAndUpdate(req.body._id, req.body, {new: true}, function (err, UpdatedDetails) {
            if (err) return res.json({Status:"Failed",Message:"Internal Server Error", Data : {},Code:500});
             res.json({Status:"Success",Message:"Functiondetails Updated", Data : UpdatedDetails ,Code:200});
        });
});



// // DELETES A USER FROM THE DATABASE
router.post('/delete', function (req, res) {
      service_sub_adminMdodel.findByIdAndRemove(req.body._id, function (err, user) {
          if (err) return res.json({Status:"Failed",Message:"Internal Server Error", Data : {},Code:500});
          res.json({Status:"Success",Message:"SubFunction Deleted successfully", Data : {} ,Code:200});
      });
});
module.exports = router;
