var express = require('express');
var router = express.Router();
var bodyParser = require('body-parser');
router.use(bodyParser.urlencoded({ extended: false }));
router.use(bodyParser.json());
var notificationModel = require('./../models/notificationModel');
var service_user_management = require('./../models/service_userdetailsModel');

var oracledb = require('oracledb');


router.post('/create',async function(req, res) {
   var notification_detail  =  await notificationModel.findOne({notification_title :req.body.notification_title,notification_desc:req.body.notification_desc,user_mobile_no:req.body.user_mobile_no}); 
   if(notification_detail == null){
   var user_detail  =  await service_user_management.findOne({user_mobile_no: req.body.user_mobile_no});
  try{
        await notificationModel.create({
  notification_title : req.body.notification_title || "",
  notification_desc : req.body.notification_desc || "",
  user_mobile_no :req.body.user_mobile_no || "",
  date_and_time :req.body.date_and_time || "",
  read_status : req.body.read_status || "",
  date_value : req.body.date_value || "",
         }, 
        function (err, user) {
if(user_detail !== null){
const headers = {
 'Authorization': 'key=AAAAjuadi54:APA91bFRpHYqKm_0hd2-tjjHXo_ISQKS47e6m8lZrB_T0oapV1OaLM-zqTYj-U5CfrYXEGdlX8X-qYdNiPbZhFpfE6-fAuENcjuFaasU1BPCgU5JLwdi5r-7R6QSaS4RuKBfPPSnusNb',
 'Content-Type': 'application/json'
}
     // Set the message as high priority and have it expire after 24 hours.
        var options = {
          priority: "high",
          timeToLive: 60 * 60 * 24
        };
          var request1 = require("request");
           // firebase url
        var myURL1 = "https://fcm.googleapis.com/fcm/send";
        var body1 = {
          to: user_detail.user_token,
          notification: {
            title: req.body.notification_title,
            body: req.body.notification_desc,
            sound: "default"
          },
          data : {}
        };
         request1.post(
            {
              url: myURL1,
              method: "POST",
              headers,
              body: body1,
              options,
              json: true
            }, function(error, response, body1) {
              if (error) {
                return res.json(
                  _.merge(
                    {
                      error: error
                    },
                    utils.errors["500"]
                  )
                );
              }else {
              }
            });
 }    

        res.json({Status:"Success",Message:"Added successfully", Data : {} ,Code:200}); 
        });
}
catch(e){
      res.json({Status:"Failed",Message:"Internal Server Error", Data : {},Code:500});
}
   } else {
       res.json({Status:"Success",Message:"Added successfully", Data : {} ,Code:200}); 
   }

});


router.get('/deletes', function (req, res) {
      notificationModel.remove({}, function (err, user) {
          if (err) return res.status(500).send("There was a problem deleting the user.");
             res.json({Status:"Success",Message:"notification Deleted", Data : {} ,Code:200});     
      });
});



router.post('/getlist_id', function (req, res) {

        notificationModel.find({activedetail_id:req.body.activedetail_id,job_no_id:req.body.job_no_id}, function (err, StateList) {
          res.json({Status:"Success",Message:"notification Data List", Data : StateList ,Code:200});


        });
});

router.post('/getlist_by_user_mobile_no', function (req, res) {
        notificationModel.find({activedetail__id:req.body.user_mobile_no}, function (err, StateList) {
          res.json({Status:"Success",Message:"notification Data List", Data : StateList ,Code:200});
        });
});



router.post('/getlist_by_user_mobile_no_test', function (req, res) {
        notificationModel.find({activedetail__id:req.body.user_mobile_no}, function (err, StateList) {
          res.json({Status:"Success",Message:"notification Data List", Data : StateList ,Code:200});
        });
});


router.post('/update_view_status',async function (req, res) {
        var notification_detail  =  await notificationModel.find({user_mobile_no :req.body.user_mobile_no,"read_status":"Not Readed"});
        if(notification_detail.length ==  0){
           res.json({Status:"Failed",Message:"Notification Update", Data : {} ,Code:200});
        }else{
        for(let a  = 0; a < notification_detail.length; a++){
         let data = {
           "read_status" :  "Readed",
         }
         notificationModel.findByIdAndUpdate(notification_detail[a]._id, data, {new: true}, function (err, UpdatedDetails) {
            if (err) return res.json({Status:"Failed",Message:"Internal Server Error", Data : {},Code:500});
         });
        if(a == notification_detail.length - 1){
            res.json({Status:"Failed",Message:"Notification Update", Data : {} ,Code:200});
        }
        }
     }
});


router.post('/delete_notificaiton',async function (req, res) {
        var notification_detail  =  await notificationModel.find({user_mobile_no :req.body.user_mobile_no});
        if(notification_detail.length ==  0){
           res.json({Status:"Failed",Message:"Notification Update", Data : {} ,Code:200});
        }else{
        for(let a  = 0; a < notification_detail.length; a++){
         const dates = require('date-and-time');
          const now1  =  new Date(notification_detail[a].date_value);
          now1.setDate(now1.getDate()-2);
          const passed_date = dates.format(now1,'YYYY-MM-DD');
         if(""+passed_date == ""+notification_detail[a].date_value){
         notificationModel.findByIdAndRemove(notification_detail[a]._id, function (err, user) {
          if (err) return res.json({Status:"Failed",Message:"Internal Server Error", Data : {},Code:500});
          // res.json({Status:"Success",Message:"notification Data  Deleted successfully", Data : {} ,Code:200});
         });
         }
        if(a == notification_detail.length - 1){
            res.json({Status:"Failed",Message:"Notification Update", Data : {} ,Code:200});
        }
        }
     }
});



         



router.post('/check_diagram_id', function (req, res) {
        notificationModel.findOne({activedetail_id:req.body.activedetail_id,job_no_id:req.body.job_no_id}, function (err, StateList) {
        if(StateList == null){
           res.json({Status:"Failed",Message:"notification Data Not Found", Data : "" ,Code:404});
        }else{
          res.json({Status:"Success",Message:"notification Data Found", Data : StateList.diagram_id ,Code:200});  
        }          
        });
});











router.get('/getconnection', function (req, res) { 
    oracledb.getConnection(
    {
       user : "",
       password : "",
       connectionString : ""    
    },function(err, connection){
       
       if(err){
        console.error(err.message);
        return;
       }
       connection.execute(
             "SELECT * from node", function(err,result){
              if(err){
                console.error(err.message);
                doRelease(connection);
                return;
              }
        
              doRelease(connection);
             });
     });
    function doRelease(connection)
    {
    connection.close({
      function(err){
        console.error(err.message);
      }
    })
    }
});

router.post('/getlist_id', function (req, res) {
        notificationModel.find({activedetail__id:req.body.activedetail__id}, function (err, StateList) {
          res.json({Status:"Success",Message:"notification Data  List", Data : StateList ,Code:200});
        });
});





router.get('/getlist', function (req, res) {
        notificationModel.find({}, function (err, Functiondetails) {
          res.json({Status:"Success",Message:"notification Data ", Data : Functiondetails ,Code:200});
        });
});


router.post('/edit', function (req, res) {
        notificationModel.findByIdAndUpdate(req.body._id, req.body, {new: true}, function (err, UpdatedDetails) {
            if (err) return res.json({Status:"Failed",Message:"Internal Server Error", Data : {},Code:500});
             res.json({Status:"Success",Message:"notification Data  Updated", Data : UpdatedDetails ,Code:200});
        });
});
// // DELETES A USER FROM THE DATABASE
router.post('/delete', function (req, res) {
      notificationModel.findByIdAndRemove(req.body.Activity_id, function (err, user) {
          if (err) return res.json({Status:"Failed",Message:"Internal Server Error", Data : {},Code:500});
          res.json({Status:"Success",Message:"notification Data  Deleted successfully", Data : {} ,Code:200});
      });
});
module.exports = router;
