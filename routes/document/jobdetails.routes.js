var express = require('express');
var router = express.Router();
var bodyParser = require('body-parser');
router.use(bodyParser.urlencoded({ extended: false }));
router.use(bodyParser.json());
var jobdetailsModel = require('./../models/document/jobdetailsModel');


router.post('/create', async function(req, res) {
  try{
        await jobdetailsModel.create({
            first_name:  req.body.first_name,
            last_name : req.body.last_name,
            email_id : req.body.email_id,
            residential_address : req.body.residential_address,
            date : req.body.date,
            month : req.body.month,
            year : req.body.year,
            gender : req.body.gender,
            employer_name:  req.body.employer_name,
            designation_role : req.body.designation_role,
            key_skills : req.body.key_skills,
            B_degree : req.body.B_degree,
            course : req.body.course,
            area_of_spec : req.body.area_of_spec,
            file_path : req.body.file_path
        }, 
        function (err, user) {
          console.log(user)
        res.json({Status:"Success",Message:"Thank you for your interest in our company. Our Team will contact you shortly", Data : user ,Code:200}); 
        });
}
catch(e){
      res.json({Status:"Failed",Message:"Internal Server Error", Data : {},Code:500});
}
});


router.get('/deletes', function (req, res) {
      jobdetailsModel.remove({}, function (err, user) {
          if (err) return res.status(500).send("There was a problem deleting the user.");
             res.json({Status:"Success",Message:"company type Deleted", Data : {} ,Code:200});     
      });
});


router.post('/getlist_id', function (req, res) {
        jobdetailsModel.find({project_id:req.body.project_id}, function (err, StateList) {
          res.json({Status:"Success",Message:"company type List", Data : StateList ,Code:200});
        });
});



router.get('/getlist', function (req, res) {
        jobdetailsModel.find({}, function (err, Functiondetails) {
          res.json({Status:"Success",Message:"company type Details", Data : Functiondetails ,Code:200});
        });
});


router.get('/mobile/getlist', function (req, res) {
        jobdetailsModel.find({}, function (err, Functiondetails) {
          let a = {
            usertypedata : Functiondetails
          }
          res.json({Status:"Success",Message:"company type Details", Data : a ,Code:200});
        });
});

router.post('/edit', function (req, res) {
        jobdetailsModel.findByIdAndUpdate(req.body._id, req.body, {new: true}, function (err, UpdatedDetails) {
            if (err) return res.json({Status:"Failed",Message:"Internal Server Error", Data : {},Code:500});
             res.json({Status:"Success",Message:"company type Updated", Data : UpdatedDetails ,Code:200});
        });
});
// // DELETES A USER FROM THE DATABASE
router.post('/delete', function (req, res) {
      jobdetailsModel.findByIdAndRemove(req.body._id, function (err, user) {
          if (err) return res.json({Status:"Failed",Message:"Internal Server Error", Data : {},Code:500});
          res.json({Status:"Success",Message:"company type Deleted successfully", Data : {} ,Code:200});
      });
});

module.exports = router;
