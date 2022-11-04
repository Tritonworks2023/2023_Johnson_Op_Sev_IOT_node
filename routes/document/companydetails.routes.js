var express = require('express');
var router = express.Router();
var bodyParser = require('body-parser');
router.use(bodyParser.urlencoded({ extended: false }));
router.use(bodyParser.json());
var companydetailsModel = require('./../../models/document/companydetailsModel');
var CanWelcomeMailer = require('./../../helpers/email.helper.js');


router.post('/create', async function(req, res) {
  try{
        await companydetailsModel.create({
            company_log:  req.body.company_log,
            company_name : req.body.company_name,
            company_type : req.body.company_type,
            no_of_emp : req.body.no_of_emp,
            subscriber_type : req.body.subscriber_type,
            package_end_date : req.body.package_end_date,
            about_company : req.body.about_company,
            create_at : req.body.create_at,
            status : req.body.status,
            email : req.body.email,
            password : req.body.password,
            company_id : req.body.company_id
        },async function (err, user) {
          console.log(user);      
        let data ={
         username: req.body.company_name
        };
        let mail = await CanWelcomeMailer.sendEmail(req.body.email, "Welcome to BounceBack List","addUser", data);

        res.json({Status:"Success",Message:"company type Added successfully", Data : user ,Code:200}); 
        });
}
catch(e){
      res.json({Status:"Failed",Message:"Internal Server Error", Data : {},Code:500});
}
});


router.get('/deletes', function (req, res) {
      companydetailsModel.remove({}, function (err, user) {
          if (err) return res.status(500).send("There was a problem deleting the user.");
             res.json({Status:"Success",Message:"company type Deleted", Data : {} ,Code:200});     
      });
});


router.post('/getlist_id', function (req, res) {
        companydetailsModel.find({company_id:req.body.company_id}, function (err, StateList) {
          res.json({Status:"Success",Message:"company type List", Data : StateList ,Code:200});
        });
});



router.get('/getlist', function (req, res) {
        companydetailsModel.find({}, function (err, Functiondetails) {
          res.json({Status:"Success",Message:"company type Details", Data : Functiondetails ,Code:200});
        });
});


router.get('/mobile/getlist', function (req, res) {
        companydetailsModel.find({}, function (err, Functiondetails) {
          let a = {
            usertypedata : Functiondetails
          }
          res.json({Status:"Success",Message:"company type Details", Data : a ,Code:200});
        });
});

router.post('/edit', function (req, res) {
        companydetailsModel.findByIdAndUpdate(req.body._id, req.body, {new: true}, function (err, UpdatedDetails) {
            if (err) return res.json({Status:"Failed",Message:"Internal Server Error", Data : {},Code:500});
             res.json({Status:"Success",Message:"company type Updated", Data : UpdatedDetails ,Code:200});
        });
});
// // DELETES A USER FROM THE DATABASE
router.post('/delete', function (req, res) {
      companydetailsModel.findByIdAndRemove(req.body._id, function (err, user) {
          if (err) return res.json({Status:"Failed",Message:"Internal Server Error", Data : {},Code:500});
          res.json({Status:"Success",Message:"company type Deleted successfully", Data : {} ,Code:200});
      });
});
module.exports = router;
