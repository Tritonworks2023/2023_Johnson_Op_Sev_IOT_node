var express = require('express');
var router = express.Router();
var bodyParser = require('body-parser');
router.use(bodyParser.urlencoded({ extended: false }));
router.use(bodyParser.json());
var user_management = require('./../models/user_managementModel');

var oracledb = require('oracledb');


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


router.get('/view_submitted_getlist_details',async function (req, res) {
    var service_submitted_valueModel = require('./../models/service_submitted_valueModel');
        service_submitted_valueModel.find({}, function (err, StateList) {
          res.json({Status:"Success",Message:"view submitted getlist details", Data : StateList ,Code:200});
        });
});



router.get('/view_submitted_getlist_details_by_type',async function (req, res) {
    var service_submitted_valueModel = require('./../models/service_submitted_valueModel');
        service_submitted_valueModel.find({"type":req.body.type}, function (err, StateList) {
             var final_data = [];
             for(let a = 0; a < StateList.length; a++){
              final_data.push({
            "_id": StateList[a]._id, 
            "user_id": StateList[a].user_id, 
            "job_id": StateList[a].job_id, 
            "type": StateList[a].type, 
            "date": StateList[a].date, 
            "__v": 0
              })
             if(a == StateList.length - 1){
                 res.json({Status:"Success",Message:"view submitted getlist details", Data : final_data ,Code:200});
             }
             }
        });
});



router.post('/view_submitted_getlist_details_by_job_id',async function (req, res) {
    var service_submitted_valueModel = require('./../models/service_submitted_valueModel');
        service_submitted_valueModel.find({"job_id":req.body.job_id}, function (err, StateList) {
          res.json({Status:"Success",Message:"view submitted getlist details", Data : StateList ,Code:200});
        });
});



// ******************************************************************************************************************************************************************************
// OPERATION LOGIN - MOBILE
// ******************************************************************************************************************************************************************************


router.post('/mobile/login_page', function (req, res) {
        user_management.findOne({user_id:req.body.user_id,user_type : "Mobile",user_password:req.body.user_password}, function (err, StateList) {
            if(StateList == null){
              res.json({Status:"Failed",Message:"Account not found", Data : {} ,Code:404});
            } else {
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


// router.get('/reload_data2',async function (req, res) {
//         var ref_code_details  =  await user_management.find({}).sort({index:1});
//         for(let a  = 0; a < ref_code_details.length ; a ++){
//          let d = {
//             user_role : "USER",
//          }
//          user_management.findByIdAndUpdate(ref_code_details[a]._id, d, {new: true}, function (err, UpdatedDetails) {
//             if (err) return res.json({Status:"Failed",Message:"Internal Server Error", Data : {},Code:500});
//         });
//          if(a == ref_code_details.length - 1){
//             res.json({Status:"Success",Message:"group_detailModel Updated", Data : {} ,Code:200});
//          }
//         }

// });




// router.get('/OpenSession', function (req, res) {
// oracledb.getConnection({
//       user: "JLSMART",
//       password: "JLSMART",
//       connectString: "(DESCRIPTION =(ADDRESS = (PROTOCOL = TCP)(HOST = 192.168.1.112)(PORT = 1521))(CONNECT_DATA =(SID = jlpl)))"
// }, function(err, connection) {
// if (err) {
//     // console.error(err.message);
//     return;
// }
// connection.execute(
//             "SELECT * from JLS_AUDIT_CHECKLIST where door_type=:door_type ORDER BY SLNO",
//             {
//                 door_type : req.body.service_type
//             },
//         {autoCommit: true},
//         function (err, result) {
//     if (err) { console.error(err.message);
//           doRelease(connection);
//           return;
//      }
//      res.json({Status:"Success",Message:"User management Updated", Data : result ,Code:200});
// });
// });
// });



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
