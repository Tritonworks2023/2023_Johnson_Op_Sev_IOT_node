var express = require('express');
var router = express.Router();
var bodyParser = require('body-parser');
router.use(bodyParser.urlencoded({ extended: false }));
router.use(bodyParser.json());
var pop_notificationModel = require('./../models/pop_notificationModel');


var notificationModelss = require('./../models/notificationModel');




// ******************************************************************************************************************************************************************************
// SERVICE POP UP NOTIFICATION CREATE - ADMIN PANEL
// ******************************************************************************************************************************************************************************


router.post('/create', async function(req, res) {
  try{
        await pop_notificationModel.create({  
            user_mobile_no:  req.body.user_mobile_no,
            code :  req.body.code,
            status :  req.body.status,
            image_path :  req.body.image_path,
            date_of_create :  req.body.date_of_create
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
      pop_notificationModel.remove({}, function (err, user) {
          if (err) return res.status(500).send("There was a problem deleting the user.");
             res.json({Status:"Success",Message:"User management Deleted", Data : {} ,Code:200});     
      });
});




router.post('/getlist_id', function (req, res) {
        pop_notificationModel.find({user_mobile_no:  req.body.user_mobile_no,}, function (err, StateList) {
          res.json({Status:"Success",Message:"User management List", Data : StateList ,Code:200});
        });
});




// router.post('/getlist_by_mobile_no',async function (req, res) {
   
//    console.log()

//     var notification_detail  =  await notificationModelss.count({user_mobile_no :req.body.user_mobile_no,"read_status":"Not Readed"});
//     console.log("********** notification_detail ************",notification_detail);



//         notificationModelss.find({user_mobile_no:req.body.user_mobile_no}, function (err, StateList) {
//           res.json({Status:"Success",Message:"User management List", Data : StateList ,Code:200});
//         }).sort({_id:-1});
// });




router.post('/getlist_by_mobile_no',async function (req, res) {
    console.log(req.body);
    var notification_detail  =  await notificationModelss.find({user_mobile_no:req.body.user_mobile_no});
    console.log("********** notification_detail ************",notification_detail);
    res.json({Status:"Success",Message:"User management List", Data : notification_detail ,Code:200});

});




router.post('/check_image', function (req, res) {
    pop_notificationModel.findOne({user_mobile_no:req.body.user_mobile_no,status:"Not View"}, function (err, StateList) {
       if(StateList == null){
           res.json({Status:"Success",Message:"No Image", Data : {} ,Code:200});
       }else {
          res.json({Status:"Success",Message:"Image Detail", Data : StateList ,Code:200});
       }   
    });
});


router.post('/update_status', function (req, res) {

       pop_notificationModel.findByIdAndUpdate(req.body.__id, req.body, {new: true}, function (err, UpdatedDetails) {
            if (err) return res.json({Status:"Failed",Message:"Internal Server Error", Data : {},Code:500});
             res.json({Status:"Success",Message:"User management Updated", Data : UpdatedDetails ,Code:200});
        });
});



router.get('/reload_data2',async function (req, res) {
        var ref_code_details  =  await pop_notificationModel.find({}).sort({index:1});
        for(let a  = 0; a < ref_code_details.length ; a ++){
         let d = {
            user_role : "USER",
         }
         pop_notificationModel.findByIdAndUpdate(ref_code_details[a]._id, d, {new: true}, function (err, UpdatedDetails) {
            if (err) return res.json({Status:"Failed",Message:"Internal Server Error", Data : {},Code:500});
        });
         if(a == ref_code_details.length - 1){
            res.json({Status:"Success",Message:"group_detailModel Updated", Data : {} ,Code:200});
         }
        }

});


router.post('/admin_delete', function (req, res) {
      pop_notificationModel.findByIdAndRemove(req.body._id, function (err, user) {
          if (err) return res.json({Status:"Failed",Message:"Internal Server Error", Data : {},Code:500});
          res.json({Status:"Success",Message:"User management Deleted successfully", Data : {} ,Code:200});
      });
});

// ******************************************************************************************************************************************************************************
// SERVICE POP UP NOTIFICATION GET ALL DETAILS - ADMIN PANEL
// ******************************************************************************************************************************************************************************
router.get('/getlist', function (req, res) {
        pop_notificationModel.find({}, function (err, Functiondetails) {
          res.json({Status:"Success",Message:"User management", Data : Functiondetails ,Code:200});
        });
});


router.post('/edit', function (req, res) {
        pop_notificationModel.findByIdAndUpdate(req.body._id, req.body, {new: true}, function (err, UpdatedDetails) {
            if (err) return res.json({Status:"Failed",Message:"Internal Server Error", Data : {},Code:500});
             res.json({Status:"Success",Message:"User management Updated", Data : UpdatedDetails ,Code:200});
        });
});

// ******************************************************************************************************************************************************************************
// SERVICE POP UP NOTIFICATION DELETE - ADMIN PANEL
// ******************************************************************************************************************************************************************************
// // DELETES A USER FROM THE DATABASE
router.post('/delete', function (req, res) {
      pop_notificationModel.findByIdAndRemove(req.body._id, function (err, user) {
          if (err) return res.json({Status:"Failed",Message:"Internal Server Error", Data : {},Code:500});
          res.json({Status:"Success",Message:"User management Deleted successfully", Data : {} ,Code:200});
      });
});


module.exports = router;
