var express = require('express');
var router = express.Router();
var bodyParser = require('body-parser');
router.use(bodyParser.urlencoded({ extended: false }));
router.use(bodyParser.json());
var nodemailer = require('nodemailer');

var Mailer = require('./../../helpers/user.helper');
var hbs = require('nodemailer-express-handlebars');
var taskitemdetailsModel = require('./../../models/document/taskitemdetailsModel');


router.post('/create', async function(req, res) {
  try{
        await taskitemdetailsModel.create({

  company_id : req.body.company_id,
  project_id : req.body.project_id,
  taskcat_id : req.body.taskcat_id,
  task_type : req.body.task_type,
  task_title : req.body.task_title,
  group_by:  req.body.group_by,
  task_descri : req.body.task_descri,
  task_assignee : req.body.task_assignee,
  task_status : req.body.task_status,
  task_est :req.body.task_est,
  task_val : req.body.task_val,
  due_date : req.body.due_date,
  attach_file : req.body.attach_file,
  attach_link : req.body.attach_link,
  check_list : req.body.check_list,
  assignee_update_date :req.body.assignee_update_date,
  assignee_comments : req.body.assignee_comments,
  follower_id : req.body.follower_id,
  follower_update_date : req.body.follower_update_date,
  follower_comments : req.body.follower_comments,
  follower_status : req.body.status,
  date_and_time : req.body.date_and_time,
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
      taskitemdetailsModel.remove({}, function (err, user) {
          if (err) return res.status(500).send("There was a problem deleting the user.");
             res.json({Status:"Success",Message:"employee type Deleted", Data : {} ,Code:200});     
      });
});


router.post('/getlist_id', function (req, res) {
        taskitemdetailsModel.find({taskcat_id:req.body.taskcat_id}, function (err, StateList) {
          console.log(StateList);
          res.json({Status:"Success",Message:"employee type List", Data : StateList ,Code:200});
        }).populate('task_assignee');
});


router.post('/user_login', function (req, res) {
        taskitemdetailsModel.findOne({company_id:req.body.company_id,email_id:req.body.email_id,password:req.body.password}, function (err, StateList) {
          console.log(StateList);
          res.json({Status:"Success",Message:"employee type List", Data : StateList ,Code:200});
        });
});



router.get('/getlist', function (req, res) {
        taskitemdetailsModel.find({}, function (err, Functiondetails) {
          res.json({Status:"Success",Message:"employee type Details", Data : Functiondetails ,Code:200});
        });
});


router.get('/mobile/getlist', function (req, res) {
        taskitemdetailsModel.find({}, function (err, Functiondetails) {
          let a = {
            usertypedata : Functiondetails
          }
          res.json({Status:"Success",Message:"employee type Details", Data : a ,Code:200});
        });
});

router.post('/edit', function (req, res) {
        taskitemdetailsModel.findByIdAndUpdate(req.body._id, req.body, {new: true}, function (err, UpdatedDetails) {
            if (err) return res.json({Status:"Failed",Message:"Internal Server Error", Data : {},Code:500});
             res.json({Status:"Success",Message:"employee type Updated", Data : UpdatedDetails ,Code:200});
        });
});


// // DELETES A USER FROM THE DATABASE
router.post('/delete', function (req, res) {
      taskitemdetailsModel.findByIdAndRemove(req.body._id, function (err, user) {
          if (err) return res.json({Status:"Failed",Message:"Internal Server Error", Data : {},Code:500});
          res.json({Status:"Success",Message:"employee type Deleted successfully", Data : {} ,Code:200});
      });
});



module.exports = router;
