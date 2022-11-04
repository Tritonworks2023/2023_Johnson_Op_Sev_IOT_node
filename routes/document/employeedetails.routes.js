var express = require('express');
var router = express.Router();
var bodyParser = require('body-parser');
router.use(bodyParser.urlencoded({ extended: false }));
router.use(bodyParser.json());
var nodemailer = require('nodemailer');

var Mailer = require('./../../helpers/user.helper');
var hbs = require('nodemailer-express-handlebars');
var employeedetailsModel = require('./../../models/document/employeedetailsModel');


router.post('/create', async function(req, res) {
  try{
        await employeedetailsModel.create({
            fullname:  req.body.fullname,
            company_id : req.body.company_id,
            email_id : req.body.email_id,
            password : req.body.password,
            avator : req.body.avator,
            designations : req.body.designations,
            handling : req.body.handling,
            noofexp : req.body.noofexp,
            access : req.body.access,
            add_info : req.body.add_info,
            date_of_create : req.body.date_of_create,
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
      employeedetailsModel.remove({}, function (err, user) {
          if (err) return res.status(500).send("There was a problem deleting the user.");
             res.json({Status:"Success",Message:"employee type Deleted", Data : {} ,Code:200});     
      });
});


router.post('/getlist_id', function (req, res) {
        employeedetailsModel.find({company_id:req.body.company_id}, function (err, StateList) {
          console.log(StateList);
          res.json({Status:"Success",Message:"employee type List", Data : StateList ,Code:200});
        });
});



router.post('/find_email_id', function (req, res) {
        employeedetailsModel.find({email_id:req.body.email_id}, function (err, StateList) {
          console.log(StateList);
          res.json({Status:"Success",Message:"employee type List", Data : StateList ,Code:200});
        });
});



router.post('/user_login', function (req, res) {
        employeedetailsModel.findOne({company_id:req.body.company_id,email_id:req.body.email_id,password:req.body.password}, function (err, StateList) {
          console.log(StateList);
          res.json({Status:"Success",Message:"employee type List", Data : StateList ,Code:200});
        });
});



router.get('/getlist', function (req, res) {
        employeedetailsModel.find({}, function (err, Functiondetails) {
          res.json({Status:"Success",Message:"employee type Details", Data : Functiondetails ,Code:200});
        });
});


router.get('/mobile/getlist', function (req, res) {
        employeedetailsModel.find({}, function (err, Functiondetails) {
          let a = {
            usertypedata : Functiondetails
          }
          res.json({Status:"Success",Message:"employee type Details", Data : a ,Code:200});
        });
});

router.post('/edit', function (req, res) {
        employeedetailsModel.findByIdAndUpdate(req.body._id, req.body, {new: true}, function (err, UpdatedDetails) {
            if (err) return res.json({Status:"Failed",Message:"Internal Server Error", Data : {},Code:500});
             res.json({Status:"Success",Message:"employee type Updated", Data : UpdatedDetails ,Code:200});
        });
});


// // DELETES A USER FROM THE DATABASE
router.post('/delete', function (req, res) {
      employeedetailsModel.findByIdAndRemove(req.body._id, function (err, user) {
          if (err) return res.json({Status:"Failed",Message:"Internal Server Error", Data : {},Code:500});
          res.json({Status:"Success",Message:"employee type Deleted successfully", Data : {} ,Code:200});
      });
});



module.exports = router;
