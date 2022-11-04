var express = require('express');
var router = express.Router();
var bodyParser = require('body-parser');
router.use(bodyParser.urlencoded({ extended: false }));
router.use(bodyParser.json());
const moment = require('moment');
var EmailModel = require('./../../models/document/EmailModel');


router.post('/create', async function(req, res) {
  try{
        let date = new Date();
         const time = moment(date);
         var finalDate = moment(new Date()).format("DD-MM-YYYY hh:mm:ss A");
        await EmailModel.create({
            email_id : req.body.email_id || "",
            user_id: req.body.user_id || "",
            user_name: req.body.user_name || "",
            user_email: req.body.user_email || "",
            message: req.body.message || "",
            name : req.body.name || "",
            subject : req.body.subject || "",
            message_status: req.body.message_status || "",
            status : req.body.status || "",
            send_by_id : req.body.send_by_id || "",
            send_by_name : req.body.send_by_name || "",
            send_by_email : req.body.send_by_email || "",
            created_by : req.body.created_by || "",
            attach : req.body.attach || "",
            Date: finalDate || "",
            start_by : req.body.start_by, 
        }, 
       async function (err, user) {
        res.json({Status:"Success",Message:"Email created successfully", Data : user,Code:200}); 
        });
}
catch(e){
      res.error(500, "Internal server error");
}
});


router.post('/getlist_id', async function (req, res) {
        await EmailModel.find({user_id:req.body.user_id}, function (err, Roledetails) {
          let notification_tone = 0 ;
          let unread_count = 0 ;
          let unread_data = [];
          if(Roledetails.length == 0){
            let c =  {
               notification_tone : notification_tone,
               unread_count : unread_count,
               unread_data : unread_data
              }
                res.json({Status:"Success",Message:"Email Details", Data : c ,Code:200});
              }else {
            for(let a = 0 ; a < Roledetails.length ; a ++){
            if(Roledetails[a].message_status == "unread"){
              unread_data.push(Roledetails[a]);
              unread_count = unread_count + 1;
            }
            if(Roledetails[a].status == "0"){
              notification_tone = 1
            }
            if(a == Roledetails.length - 1){
              let c =  {
               notification_tone : notification_tone,
               unread_count : unread_count,
               unread_data : unread_data
              }
                res.json({Status:"Success",Message:"Email Details", Data : c ,Code:200});
            }
          
          }
              }         
        });
});



router.post('/getlist_sendby', async function (req, res) {
        await EmailModel.find({send_by_id:req.body.send_by_id}, function (err, Roledetails) {
          res.json({Status:"Success",Message:"Email List", Data : Roledetails ,Code:200});
        });
});


router.get('/getlist', async function (req, res) {
        await EmailModel.find({}, function (err, Roledetails) {
          res.json({Status:"Success",Message:"Email List", Data : Roledetails ,Code:200});
        });
});



router.post('/fetch_by_email_id', async function (req, res) {
        await EmailModel.find({email_id:req.body.email_id}, function (err, Roledetails) {
          res.json({Status:"Success",Message:"Email List", Data : Roledetails ,Code:200});
        });
});


router.post('/getlistss', async function (req, res) {
        await EmailModel.find({user_id:req.body.user_id}, function (err, Roledetails) {
          res.json({Status:"Success",Message:"Email List", Data : Roledetails ,Code:200});
        });
});



router.post('/getcount', async function (req, res) {
        await EmailModel.find({user_id:req.body.user_id,message_status:"unread"}, function (err, count) {
          res.json({Status:"Success",Message:"Email count", Data : count ,Code:200});
        }).count();
});



router.get('/deletes', function (req, res) {
      EmailModel.remove({}, function (err, user) {
          if (err) return res.status(500).send("There was a problem deleting the user.");
             res.json({Status:"Success",Message:"Email Details Deleted", Data : {} ,Code:200});
      });
});

router.post('/edit', function (req, res) {
        EmailModel.findByIdAndUpdate(req.body._id, req.body, {new: true}, function (err, UpdatedDetails) {
            if (err) return res.json({Status:"Failed",Message:"Internal Server Error", Data : {},Code:500});
             res.json({Status:"Success",Message:"Email Updated", Data : UpdatedDetails ,Code:200});
        });
});



// router.post('/edit', async function (req, res) {
//        await NotificationModel.findOneAndUpdate({user_id:req.body.user_id}, req.body, {new: true}, function (err, UpdatedDetails) {
//             if (err) return res.status(500).send("There was a problem updating the user.");
//              res.json({Status:"Success",Message:"Notification Updated", Data : UpdatedDetails ,Code:200});
//         });
// });
// // DELETES A USER FROM THE DATABASE
router.post('/delete', function (req, res) {
      EmailModel.findByIdAndRemove(req.body.Role_id, function (err, user) {
          if (err) return res.status(500).send("There was a problem deleting the user.");
          res.json({Status:"Success",Message:"Email Deleted successfully", Data : {} ,Code:200});
      });
});
module.exports = router;
