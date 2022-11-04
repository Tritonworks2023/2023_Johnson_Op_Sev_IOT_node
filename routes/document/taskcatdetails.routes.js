var express = require('express');
var router = express.Router();
var bodyParser = require('body-parser');
router.use(bodyParser.urlencoded({ extended: false }));
router.use(bodyParser.json());
var nodemailer = require('nodemailer');

var Mailer = require('./../../helpers/user.helper');
var hbs = require('nodemailer-express-handlebars');
var taskcatdetailsModel = require('./../../models/document/taskcatdetailsModel');


router.post('/create', async function(req, res) {
  try{
        await taskcatdetailsModel.create({
            company_id : req.body.company_id,
            project_id : req.body.project_id,
            task_title:  req.body.task_title,
            task_status : req.body.task_status,
            task_start_date : req.body.task_start_date,
            task_start_end : req.body.task_start_end,
            remainder_end : req.body.remainder_end,
            date_and_time : req.body.date_and_time
        },async function (err, user) {
          console.log(user)
        //   data={
        //   link: 'http://bouncebacklist.com/#/home/email_verfication/'+ req.body.Email + '_candidate_' + Verification_Code,
        //   username: req.body.Name
        // };
        // let mail = await Mailer.sendEmail(req.body.Email, "BounceBack List - Please Verify your email." , "addUser", data);
        res.json({Status:"Success",Message:"employee type Added successfully", Data : user ,Code:200}); 
        });
}
catch(e){
      res.json({Status:"Failed",Message:"Internal Server Error", Data : {},Code:500});
}
});


router.get('/deletes', function (req, res) {
      taskcatdetailsModel.remove({}, function (err, user) {
          if (err) return res.status(500).send("There was a problem deleting the user.");
             res.json({Status:"Success",Message:"employee type Deleted", Data : {} ,Code:200});     
      });
});


router.post('/getlist_id', function (req, res) {
        taskcatdetailsModel.find({company_id:req.body.company_id}, function (err, StateList) {
          console.log(StateList);
          res.json({Status:"Success",Message:"employee type List", Data : StateList ,Code:200});
        });
});


router.post('/user_login', function (req, res) {
        taskcatdetailsModel.findOne({company_id:req.body.company_id,email_id:req.body.email_id,password:req.body.password}, function (err, StateList) {
          console.log(StateList);
          res.json({Status:"Success",Message:"employee type List", Data : StateList ,Code:200});
        });
});



router.get('/getlist', function (req, res) {
        taskcatdetailsModel.find({}, function (err, Functiondetails) {
          res.json({Status:"Success",Message:"employee type Details", Data : Functiondetails ,Code:200});
        });
});


router.get('/mobile/getlist', function (req, res) {
        taskcatdetailsModel.find({}, function (err, Functiondetails) {
          let a = {
            usertypedata : Functiondetails
          }
          res.json({Status:"Success",Message:"employee type Details", Data : a ,Code:200});
        });
});

router.post('/edit', function (req, res) {
        taskcatdetailsModel.findByIdAndUpdate(req.body._id, req.body, {new: true}, function (err, UpdatedDetails) {
            if (err) return res.json({Status:"Failed",Message:"Internal Server Error", Data : {},Code:500});
             res.json({Status:"Success",Message:"employee type Updated", Data : UpdatedDetails ,Code:200});
        });
});


// // DELETES A USER FROM THE DATABASE
router.post('/delete', function (req, res) {
      taskcatdetailsModel.findByIdAndRemove(req.body._id, function (err, user) {
          if (err) return res.json({Status:"Failed",Message:"Internal Server Error", Data : {},Code:500});
          res.json({Status:"Success",Message:"employee type Deleted successfully", Data : {} ,Code:200});
      });
});



module.exports = router;
