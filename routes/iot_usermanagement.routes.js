var express = require('express');
var router = express.Router();
var bodyParser = require('body-parser');
router.use(bodyParser.urlencoded({ extended: false }));
router.use(bodyParser.json());
var iot_usermanagement = require('./../models/iot_usermanagementModel');
var oracledb = require('oracledb');


router.post('/create', async function(req, res) {
  console.log(req.body);
  var iot_user = await iot_usermanagement.findOne({phone_number:req.body.phone_number});
  console.log(iot_user);
  if(iot_user == null){
  try{
        await iot_usermanagement.create({  
  
  name :  req.body.name || "",
  emp_no : req.body.emp_no || "",
  agent_code : req.body.agent_code || [],
  branch_code : req.body.branch_code || "",
  password : req.body.password || "",
  email_id : req.body.email_id || "",
  phone_number : req.body.phone_number || "",
  last_login_date :  req.body.last_login_date || "",
  active_status : req.body.active_status || ""

        }, 
        function (err, user) {
          console.log(user)
        res.json({Status:"Success",Message:"Added successfully", Data : user ,Code:200}); 
        });
}
catch(e){
      res.json({Status:"Failed",Message:"Internal Server Error", Data : {},Code:500});
}
}

else{

    res.json({Status:"Failed",Message:"This mobile number already register", Data : {} ,Code:400});

  }
});


router.get('/deletes', function (req, res) {
      iot_usermanagement.remove({}, function (err, user) {
          if (err) return res.status(500).send("There was a problem deleting the user.");
             res.json({Status:"Success",Message:"User management Deleted", Data : {} ,Code:200});     
      });
});


router.post('/getlist_id', function (req, res) {
        iot_usermanagement.find({user_id:req.body.user_id}, function (err, StateList) {
          res.json({Status:"Success",Message:"User management List", Data : StateList ,Code:200});
        });
});



router.post('/iot/login_page', function (req, res) {
        iot_usermanagement.findOne({emp_no:req.body.email_id,password:req.body.password}, function (err, StateList) {
            if(StateList == null){
              res.json({Status:"Failed",Message:"Account not found", Data : {} ,Code:404});
            }else{
              res.json({Status:"Success",Message:"User Details", Data : StateList ,Code:200});
            }          
        });
});




router.post('/admin_delete', function (req, res) {
      iot_usermanagement.findByIdAndRemove(req.body._id, function (err, user) {
          if (err) return res.json({Status:"Failed",Message:"Internal Server Error", Data : {},Code:500});
          res.json({Status:"Success",Message:"User management Deleted successfully", Data : {} ,Code:200});
      });
});



router.post('/get_lift_status', function (req, res) {
// console.log(req.body.lift_detail);
// req.body.lift_detail = ["L-P2909"];
req.body.lift_detail = ["L-P2909"];
var text  = '';     
req.body.lift_detail.forEach(element => {
  // console.log(element);
  text = text +"'"+element+"',";
});
text = text.substring(0, text.length-1);
// console.log(text);
oracledb.getConnection({
      user: "JLPLIOT",
      password: "JLPLIOT",
      connectString: "(DESCRIPTION =(ADDRESS = (PROTOCOL = TCP)(HOST = 192.168.1.191)(PORT = 1521))(CONNECT_DATA =(SID = jiot)))"
}, function(err, connection) {
if (err) {
    // console.error(err.message);
    return;
}
// in ('"+req.body.job_status_type+"','JAN')
// console.log('select SLIFTID, SFLRSTAT2, SRUNSTAT2 from IOT_MONGOSCHED_DTL_DEMO where SLIFTID in ('+text+')');
connection.execute(
            'select SLIFTID, SFLRSTAT2, SRUNSTAT2 from IOT_MONGOSCHED_DTL_DEMO where SLIFTID in ('+text+')',
            {},
        {autoCommit: true},
        function (err, result) {
    if (err) { console.error(err.message);
          doRelease(connection);
          return;
     }
     // console.log(result);
var ary = [];
for(let a = 0 ; a < result.rows.length ; a++){
var temp_data = result.rows[a];
var results = {}
for (var i = 0; i < result.metaData.length; ++i){
results[result.metaData[i].name] = temp_data[i];
}
 ary.push(results);   
 if(a == result.rows.length - 1){


  // test_data = [
  //       {
  //           "SLIFTID": "L-M7376",
  //           "SFLRSTAT2": 6,
  //           "SRUNSTAT2": 0
  //       },
        // {
        //     "SLIFTID": "L-P2909",
        //     "SFLRSTAT2": 2,
        //     "SRUNSTAT2": 1
        // },
        // {
        //     "SLIFTID": "L-H1258",
        //     "SFLRSTAT2": 3,
        //     "SRUNSTAT2": 0
        // },
        // {
        //     "SLIFTID": "L-H1257",
        //     "SFLRSTAT2": 4,
        //     "SRUNSTAT2": 1
        // },
        // {
        //     "SLIFTID": "L-M2287",
        //     "SFLRSTAT2": 5,
        //     "SRUNSTAT2": 0
        // }
    // ]


  res.json({Status:"Success",Message:"check list value", Data : ary ,Code:200});
     }
} 
   });
function doRelease(connection) {
       connection.release(function(err) {
         if (err) {
          console.error(err.message);
        }
      }
   );
}
});
});







router.post('/admin_delete', function (req, res) {
      iot_usermanagement.findByIdAndRemove(req.body._id, function (err, user) {
          if (err) return res.json({Status:"Failed",Message:"Internal Server Error", Data : {},Code:500});
          res.json({Status:"Success",Message:"User management Deleted successfully", Data : {} ,Code:200});
      });
});


router.get('/getlist', function (req, res) {
        iot_usermanagement.find({}, function (err, Functiondetails) {
          res.json({Status:"Success",Message:"User management", Data : Functiondetails ,Code:200});
        });
});


router.post('/edit', function (req, res) {
        iot_usermanagement.findByIdAndUpdate(req.body._id, req.body, {new: true}, function (err, UpdatedDetails) {
            if (err) return res.json({Status:"Failed",Message:"Internal Server Error", Data : {},Code:500});
             res.json({Status:"Success",Message:"User management Updated", Data : UpdatedDetails ,Code:200});
        });
});
// // DELETES A USER FROM THE DATABASE
router.post('/delete', function (req, res) {
      iot_usermanagement.findByIdAndRemove(req.body._id, function (err, user) {
          if (err) return res.json({Status:"Failed",Message:"Internal Server Error", Data : {},Code:500});
          res.json({Status:"Success",Message:"User management Deleted successfully", Data : {} ,Code:200});
      });
});
module.exports = router;
