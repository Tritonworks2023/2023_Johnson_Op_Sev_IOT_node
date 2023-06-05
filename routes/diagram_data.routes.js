var express = require('express');
var router = express.Router();
var bodyParser = require('body-parser');
router.use(bodyParser.urlencoded({ extended: false }));
router.use(bodyParser.json());
var diagram_dataModel = require('./../models/diagram_dataModel');

var oracledb = require('oracledb');


router.post('/create', async function(req, res) {
  try{
        await diagram_dataModel.create({
  activedetail_id :req.body.activedetail_id || "",
  job_no_id : req.body.job_no_id || "",
  user_id : req.body.user_id || "",
  group_id : req.body.group_id || "",
  sub_group_id : req.body.sub_group_id || "",
  submitted_date : req.body.submitted_date || "",
  diagram_id : req.body.diagram_id || "",
  dimx_one: req.body.dimx_one || "",
  dimx_two: req.body.dimx_two || "",
  dimx_three: req.body.dimx_three || "",
  dimy_one: req.body.dimy_one || "",
  dimy_two: req.body.dimy_two || "",
  dimy_three: req.body.dimy_three || "",
  remarks : req.body.remarks || "",
  update_id :  "",
  update_date:  "",
  update_reason : "",

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
      diagram_dataModel.remove({}, function (err, user) {
          if (err) return res.status(500).send("There was a problem deleting the user.");
             res.json({Status:"Success",Message:"Job_no_managment Deleted", Data : {} ,Code:200});     
      });
});



router.post('/getlist_id', function (req, res) {
        diagram_dataModel.find({activedetail_id:req.body.activedetail_id,job_no_id:req.body.job_no_id}, function (err, StateList) {
          res.json({Status:"Success",Message:"DiaGram Data List", Data : StateList ,Code:200});
        });
});


router.post('/check_diagram_id', function (req, res) {
        diagram_dataModel.findOne({activedetail_id:req.body.activedetail_id,job_no_id:req.body.job_no_id}, function (err, StateList) {
        if(StateList == null){
           res.json({Status:"Failed",Message:"DiaGram Data Not Found", Data : "" ,Code:404});
        }else{
          res.json({Status:"Success",Message:"DiaGram Data Found", Data : StateList.diagram_id ,Code:200});  
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
        diagram_dataModel.find({activedetail__id:req.body.activedetail__id}, function (err, StateList) {
          res.json({Status:"Success",Message:"DiaGram Data  List", Data : StateList ,Code:200});
        });
});



router.get('/getlist', function (req, res) {
        diagram_dataModel.find({}, function (err, Functiondetails) {
          res.json({Status:"Success",Message:"DiaGram Data ", Data : Functiondetails ,Code:200});
        });
});


router.post('/edit', function (req, res) {
        diagram_dataModel.findByIdAndUpdate(req.body._id, req.body, {new: true}, function (err, UpdatedDetails) {
            if (err) return res.json({Status:"Failed",Message:"Internal Server Error", Data : {},Code:500});
             res.json({Status:"Success",Message:"DiaGram Data  Updated", Data : UpdatedDetails ,Code:200});
        });
});
// // DELETES A USER FROM THE DATABASE
router.post('/delete', function (req, res) {
      diagram_dataModel.findByIdAndRemove(req.body.Activity_id, function (err, user) {
          if (err) return res.json({Status:"Failed",Message:"Internal Server Error", Data : {},Code:500});
          res.json({Status:"Success",Message:"DiaGram Data  Deleted successfully", Data : {} ,Code:200});
      });
});
module.exports = router;
