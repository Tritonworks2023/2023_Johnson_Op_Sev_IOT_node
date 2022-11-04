var express = require('express');
var router = express.Router();
var bodyParser = require('body-parser');
router.use(bodyParser.urlencoded({ extended: false }));
router.use(bodyParser.json());
var docdetailsModel = require('./../../models/document/docdetailsModel');


router.post('/create', async function(req, res) {
  try{
        await docdetailsModel.create({
            company_id:  req.body.company_id,
            project_id : req.body.project_id,
            file_name : req.body.file_name,
            file_type : req.body.file_type,
            file_link : req.body.file_link,
            access_status : req.body.access_status,
            addi_info : req.body.addi_info,
            date_and_time : req.body.date_and_time,
        }, 
        function (err, user) {
          console.log(user)
        res.json({Status:"Success",Message:"company type Added successfully", Data : user ,Code:200}); 
        });
}
catch(e){
      res.json({Status:"Failed",Message:"Internal Server Error", Data : {},Code:500});
}
});


router.get('/deletes', function (req, res) {
      docdetailsModel.remove({}, function (err, user) {
          if (err) return res.status(500).send("There was a problem deleting the user.");
             res.json({Status:"Success",Message:"company type Deleted", Data : {} ,Code:200});     
      });
});


router.post('/getlist_id', function (req, res) {
        docdetailsModel.find({project_id:req.body.project_id}, function (err, StateList) {
          res.json({Status:"Success",Message:"company type List", Data : StateList ,Code:200});
        });
});



router.get('/getlist', function (req, res) {
        docdetailsModel.find({}, function (err, Functiondetails) {
          res.json({Status:"Success",Message:"company type Details", Data : Functiondetails ,Code:200});
        });
});


router.get('/mobile/getlist', function (req, res) {
        docdetailsModel.find({}, function (err, Functiondetails) {
          let a = {
            usertypedata : Functiondetails
          }
          res.json({Status:"Success",Message:"company type Details", Data : a ,Code:200});
        });
});

router.post('/edit', function (req, res) {
        docdetailsModel.findByIdAndUpdate(req.body._id, req.body, {new: true}, function (err, UpdatedDetails) {
            if (err) return res.json({Status:"Failed",Message:"Internal Server Error", Data : {},Code:500});
             res.json({Status:"Success",Message:"company type Updated", Data : UpdatedDetails ,Code:200});
        });
});
// // DELETES A USER FROM THE DATABASE
router.post('/delete', function (req, res) {
      docdetailsModel.findByIdAndRemove(req.body._id, function (err, user) {
          if (err) return res.json({Status:"Failed",Message:"Internal Server Error", Data : {},Code:500});
          res.json({Status:"Success",Message:"company type Deleted successfully", Data : {} ,Code:200});
      });
});

module.exports = router;
