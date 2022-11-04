var express = require('express');
var router = express.Router();
var bodyParser = require('body-parser');
router.use(bodyParser.urlencoded({ extended: false }));
router.use(bodyParser.json());
var breakdown_managementModel = require('./../models/breakdown_managementModel');


router.post('/create', async function(req, res) {
var user_detail  =  await breakdown_managementModel.findOne({SMU_SCH_JOBNO : req.body.SMU_SCH_JOBNO,SMU_SCH_MECHANIC : req.body.SMU_SCH_MECHANIC,SMU_SCH_SERTYPE : req.body.SMU_SCH_SERTYPE,SMU_SCH_COMPNO : req.body.SMU_SCH_COMPNO});
 if(user_detail == null){
  try{
        console.log('BR INSERT');
        await breakdown_managementModel.create({
SMU_SCH_COMPNO : req.body.SMU_SCH_COMPNO,
SMU_SCH_COMPDT : req.body.SMU_SCH_COMPDT,
SMU_SCH_JOBNO : req.body.SMU_SCH_JOBNO,
SMU_SCH_BRCODE : req.body.SMU_SCH_BRCODE,
SMU_SCH_REPORTBY : req.body.SMU_SCH_REPORTBY,
SMU_SCH_REPORTCELL : req.body.SMU_SCH_REPORTCELL,
SMU_SCH_BRKDOWNTYPE : req.body.SMU_SCH_BRKDOWNTYPE,
SMU_SCH_BRKDOWNDESC : req.body.SMU_SCH_BRKDOWNDESC,
SMU_SCH_ROUTECODE : req.body.SMU_SCH_ROUTECODE,
SMU_SCH_MECHANIC : req.body.SMU_SCH_MECHANIC,
SMU_SCH_DEPUTEDDT : req.body.SMU_SCH_DEPUTEDDT,
SMU_SCH_CRTDT  : req.body.SMU_SCH_CRTDT,
SMU_SCH_STATUS : req.body.SMU_SCH_STATUS,
SMU_SCH_EMPCODE : req.body.SMU_SCH_EMPCODE,
SMU_SCH_SERTYPE : req.body.SMU_SCH_SERTYPE,
SMU_SCH_CONTNO : req.body.SMU_SCH_CONTNO, 
SMU_SCH_DWNFLAG : req.body.SMU_SCH_DWNFLAG,
SMU_SCH_CANCFLAG : req.body.SMU_SCH_CANCFLAG,
SMU_SCH_DWNFLAGDATE : req.body.SMU_SCH_DWNFLAGDATE,
SMU_SCH_CUSCODE : req.body.SMU_SCH_CUSCODE,
SMU_SCH_CUSNAME : req.body.SMU_SCH_CUSNAME, 
SMU_SCH_CUSADD1  : req.body.SMU_SCH_CUSADD1,
SMU_SCH_CUSADD2  : req.body.SMU_SCH_CUSADD2,
SMU_SCH_CUSADD3 : req.body.SMU_SCH_CUSADD3,
SMU_SCH_CUSADD4  : req.body.SMU_SCH_CUSADD4,
SMU_SCH_CUSPIN : req.body.SMU_SCH_CUSPIN,
SMU_SCH_MECHCELL : req.body.SMU_SCH_MECHCELL,
SMU_SCH_AMCTYPE  : req.body.SMU_SCH_AMCTYPE,
SMU_SCH_AMCTODT : req.body.SMU_SCH_AMCTODT,
SMU_SCH_VANID  : req.body.SMU_SCH_VANID,
SSM_SCH_APPTO : req.body.SSM_SCH_APPTO,
SMU_SCH_SUPCELLNO : req.body.SMU_SCH_SUPCELLNO,
SMU_SCH_JOBCURSTATUS : req.body.SMU_SCH_JOBCURSTATUS,
SMU_SCH_MODDT : req.body.SMU_SCH_MODDT,
SMU_SCH_ERRDESC : req.body.SMU_SCH_ERRDESC,
SMU_SCH_DOORTYPE : req.body.SMU_SCH_DOORTYPE,
SMU_SCH_CHKLIST : req.body.SMU_SCH_CHKLIST,
JOB_STATUS : 'Not Started',
JOB_VIEW_STATUS : 'Not Viewed',
LAST_UPDATED_TIME : ""+new Date(),
JOB_START_TIME : "",
JOB_END_TIME : "",
        }, 
        function (err, user) {
        res.json({Status:"Success",Message:"Added successfully", Data : {} ,Code:200}); 
        });
}
catch(e){
      res.json({Status:"Failed",Message:"Internal Server Error", Data : {},Code:500});
}
}
else{
   res.json({Status:"Success",Message:"Added successfully", Data : {} ,Code:200}); 
}

});


router.get('/deletes', function (req, res) {
      breakdown_managementModel.remove({}, function (err, user) {
          if (err) return res.status(500).send("There was a problem deleting the user.");
             res.json({Status:"Success",Message:"breakdown_managementModel Deleted", Data : {} ,Code:200});     
      });
});


router.post('/getlist_id', function (req, res) {
        breakdown_managementModel.find({Person_id:req.body.Person_id}, function (err, StateList) {
          res.json({Status:"Success",Message:"State List", Data : StateList ,Code:200});
        });
});



router.post('/fetch_job_id', function (req, res) {
        breakdown_managementModel.findOne({SMU_SCH_JOBNO : req.body.job_id}, function (err, StateList) {
          res.json({Status:"Success",Message:"Break Down Details", Data : StateList ,Code:200});
        });
});




router.get('/getlist', function (req, res) {
        breakdown_managementModel.find({}, function (err, Functiondetails) {
          res.json({Status:"Success",Message:"Functiondetails", Data : Functiondetails ,Code:200});
        });
});


router.get('/getlist_completed', function (req, res) {
        breakdown_managementModel.find({JOB_STATUS : 'Job Submitted'}, function (err, Functiondetails) {
          res.json({Status:"Success",Message:"Functiondetails", Data : Functiondetails ,Code:200});
        });
});


router.post('/edit', function (req, res) {
        breakdown_managementModel.findByIdAndUpdate(req.body._id, req.body, {new: true}, function (err, UpdatedDetails) {
            if (err) return res.json({Status:"Failed",Message:"Internal Server Error", Data : {},Code:500});
             res.json({Status:"Success",Message:"Functiondetails Updated", Data : UpdatedDetails ,Code:200});
        });
});
// // DELETES A USER FROM THE DATABASE
router.post('/delete', function (req, res) {
      breakdown_managementModel.findByIdAndRemove(req.body.Activity_id, function (err, user) {
          if (err) return res.json({Status:"Failed",Message:"Internal Server Error", Data : {},Code:500});
          res.json({Status:"Success",Message:"SubFunction Deleted successfully", Data : {} ,Code:200});
      });
});
module.exports = router;
