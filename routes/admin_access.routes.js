var express = require('express');
var router = express.Router();
var bodyParser = require('body-parser');
router.use(bodyParser.urlencoded({ extended: false }));
router.use(bodyParser.json());
var admin_accessModel = require('./../models/admin_accessModel');


// ******************************************************************************************************************************************************************************
// SERVICE SUB-ADMIN CREATION - ADMIN PANEL
// ******************************************************************************************************************************************************************************
router.post('/create', async function(req, res) {
   var job_details_two  =  await admin_accessModel.findOne({user_name:req.body.user_name});
   if(job_details_two == null){
    try{
        await admin_accessModel.create({
  firstname : req.body.firstname,
  lastname : req.body.lastname,
  status : req.body.status,
  email_id : req.body.email_id,
  mobile_no :  req.body.mobile_no,
  user_name :  req.body.user_name,
  password : req.body.password,
  confirm_password : req.body.confirm_password,
  access_location : req.body.access_location,
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
   }
   else{
    res.json({Status:"Alread this username used",Message:"Alread this username used", Data : {},Code:500});
   }
});


router.get('/deletes', function (req, res) {
      admin_accessModel.remove({}, function (err, user) {
          if (err) return res.status(500).send("There was a problem deleting the user.");
             res.json({Status:"Success",Message:"admin_accessModel Deleted", Data : {} ,Code:200});     
      });
});



router.post('/getlist_id', function (req, res) {
        admin_accessModel.find({Person_id:req.body.Person_id}, function (err, StateList) {
          res.json({Status:"Success",Message:"State List", Data : StateList ,Code:200});
        });
});



// ******************************************************************************************************************************************************************************
// SERVICE SUB-ADMIN LOGIN - ADMIN PANEL
// ******************************************************************************************************************************************************************************

router.post('/admin/login', function (req, res) {
        admin_accessModel.findOne({user_name : req.body.email_id,password : req.body.password}, function (err, StateList) {
         if(StateList !== null){
           res.json({Status:"Success",Message:"Admin Acess Detail", Data : StateList ,Code:200}); 
       }else {
            res.json({Status:"Failed",Message:"Account Not Found", Data : {} ,Code:200}); 
       }
        });
});



// ******************************************************************************************************************************************************************************
// SERVICE SUB-ADMIN FETCH DETAILS - ADMIN PANEL
// ******************************************************************************************************************************************************************************
router.post('/fetch_data', function (req, res) {
        admin_accessModel.findOne({ mobile_no :  req.body.mobile_no}, function (err, StateList) {
            if(StateList == null){
                res.json({Status:"Failed",Message:"No Details Found", Data : {} ,Code:404});
            }else{
                res.json({Status:"Success",Message:"Sub Admin Detail", Data : StateList ,Code:404});
            }
         
        });
});



router.post('/mobile/login_page',async function (req, res) {
        admin_accessModel.findOne({mobile_no:req.body.user_mobile_no,password:req.body.user_password}, function (err, StateList) {
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
            admin_accessModel.findByIdAndUpdate(StateList._id, {last_login : new Date()}, {new: true}, function (err, UpdatedDetails) {
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




// ******************************************************************************************************************************************************************************
// SERVICE SUB-ADMIN LIST - ADMIN PANEL
// ******************************************************************************************************************************************************************************
router.get('/getlist', function (req, res) {
        admin_accessModel.find({}, function (err, Functiondetails) {
          res.json({Status:"Success",Message:"Functiondetails", Data : Functiondetails ,Code:200});
        });
});

// ******************************************************************************************************************************************************************************
// SERVICE SUB-ADMIN EDIT - ADMIN PANEL
// ******************************************************************************************************************************************************************************
router.post('/edit', function (req, res) {
        admin_accessModel.findByIdAndUpdate(req.body._id, req.body, {new: true}, function (err, UpdatedDetails) {
            if (err) return res.json({Status:"Failed",Message:"Internal Server Error", Data : {},Code:500});
             res.json({Status:"Success",Message:"Functiondetails Updated", Data : UpdatedDetails ,Code:200});
        });
});

// ******************************************************************************************************************************************************************************
// SERVICE SUB-ADMIN DELETE - ADMIN PANEL
// ******************************************************************************************************************************************************************************
router.post('/delete', function (req, res) {
      admin_accessModel.findByIdAndRemove(req.body._id, function (err, user) {
          if (err) return res.json({Status:"Failed",Message:"Internal Server Error", Data : {},Code:500});
          res.json({Status:"Success",Message:"SubFunction Deleted successfully", Data : {} ,Code:200});
      });
});
module.exports = router;
