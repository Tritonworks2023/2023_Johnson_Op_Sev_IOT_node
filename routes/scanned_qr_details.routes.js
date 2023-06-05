var express = require('express');
var router = express.Router();
var bodyParser = require('body-parser');
router.use(bodyParser.urlencoded({ extended: false }));
router.use(bodyParser.json());
var scanned_qr_detailsModel = require('./../models/scanned_qr_detailsModel');

var oracledb = require('oracledb');


router.post('/create', async function(req, res) {
  try{
        await scanned_qr_detailsModel.create({
  JOBNO : req.body.JOBNO || "",
  MATL_ID : req.body.MATL_ID || "",
  QRCODE : req.body.QRCODE || "",
  SCANNEDBY : req.body.SCANNEDBY || "",
  SCANNED_ON :  req.body.SCANNED_ON || "",
  SUBMITTTED_STATUS : req.body.SUBMITTTED_STATUS || "",
  REMARKSTATUS : req.body.REMARKSTATUS || "",
  delete_status : false,

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
      scanned_qr_detailsModel.remove({}, function (err, user) {
          if (err) return res.status(500).send("There was a problem deleting the user.");
             res.json({Status:"Success",Message:"Job_no_managment Deleted", Data : {} ,Code:200});     
      });
});



router.post('/getlist_id', function (req, res) {
        scanned_qr_detailsModel.find({activedetail_id:req.body.activedetail_id,job_no_id:req.body.job_no_id}, function (err, StateList) {
          res.json({Status:"Success",Message:"DiaGram Data List", Data : StateList ,Code:200});
        });
});


router.post('/check_diagram_id', function (req, res) {
        scanned_qr_detailsModel.findOne({activedetail_id:req.body.activedetail_id,job_no_id:req.body.job_no_id}, function (err, StateList) {
        if(StateList == null){
           res.json({Status:"Failed",Message:"DiaGram Data Not Found", Data : "" ,Code:404});
        }else{
          res.json({Status:"Success",Message:"DiaGram Data Found", Data : StateList.diagram_id ,Code:200});  
        }          
        });
});


router.post('/getlist_id', function (req, res) {
        scanned_qr_detailsModel.find({activedetail__id:req.body.activedetail__id}, function (err, StateList) {
          res.json({Status:"Success",Message:"DiaGram Data  List", Data : StateList ,Code:200});
        });
});

// router.post('/submit_scanned_qr', function (req, res) {
//     res.json({Status:"Success",Message:"Qr Code Submitted", Data : {} ,Code:200});
// });

router.post('/submit_scanned_qr', function (req, res) {

   
   if(""+req.body.validation_status == 'Y'){

     oracledb.getConnection({
          user: "JLSMART",
          password: "JLSMART",
          connectString: "(DESCRIPTION =(ADDRESS = (PROTOCOL = TCP)(HOST = 192.168.1.112)(PORT = 1521))(CONNECT_DATA =(SID = jlpl)))"
    }, function(err, connection) {
    if (err) {
        console.error(err.message);
        return;
    }
     let da =
         {
                "JLS_QRD_QRCODENO": ""+req.body.qrcode,
                "JLS_QRD_SCANBY_NAME": ""+req.body.user_name,
                "JLS_QRD_SCANBY_MOBNO": ""+req.body.user_mobile_no
        }
          connection.execute(
                "UPDATE JLS_QRCODE_DTL SET JLS_QRD_SCANDATE = SYSDATE, JLS_QRD_SCANBY_NAME = :JLS_QRD_SCANBY_NAME, JLS_QRD_SCANBY_MOBNO = :JLS_QRD_SCANBY_MOBNO, JLS_QRD_MATCHED_FLAG = 'Y' WHERE JLS_QRD_QRCODENO =:JLS_QRD_QRCODENO",
                  da, // Bind values
                  { autoCommit: true}, 
            function (err, result) {
        if (err) { console.error(err.message);
              doRelease(connection);
              return;
         }
         res.json({Status:"Success",Message:"Qr Code Submitted", Data : {} ,Code:200});
         // res.json({Status:"Success",Message:"Request Send Successfully", Data : {},Code:200});
         doRelease(connection);
       });
       });
   } else {
     oracledb.getConnection({
          user: "JLSMART",
          password: "JLSMART",
          connectString: "(DESCRIPTION =(ADDRESS = (PROTOCOL = TCP)(HOST = 192.168.1.112)(PORT = 1521))(CONNECT_DATA =(SID = jlpl)))"
    }, function(err, connection) {
    if (err) {
        console.error(err.message);
        return;
    }
     let da =
         {
                "JLS_QRD_JOBNO": ""+req.body.job_id,
                "JLS_QRD_MATLID": ""+req.body.mat_id,
                "JLS_QRD_QRCODENO": ""+req.body.qrcode,
                "JLS_QRD_SCANBY_NAME": ""+req.body.user_name,
                "JLS_QRD_SCANBY_MOBNO": ""+req.body.user_mobile_no,
                "JLS_QRD_MATCHED_FLAG": ""+req.body.validation_status,
        }
          connection.execute(
                "INSERT INTO JLS_QRCODE_DTL (JLS_QRD_JOBNO, JLS_QRD_MATLID, JLS_QRD_QRCODENO, JLS_QRD_SCANDATE, JLS_QRD_SCANBY_NAME, JLS_QRD_SCANBY_MOBNO, JLS_QRD_MATCHED_FLAG) VALUES (:JLS_QRD_JOBNO, :JLS_QRD_MATLID, :JLS_QRD_QRCODENO, SYSDATE,:JLS_QRD_SCANBY_NAME,:JLS_QRD_SCANBY_MOBNO,:JLS_QRD_MATCHED_FLAG)",
                  da, // Bind values
                  { autoCommit: true}, 
            function (err, result) {
        if (err) { console.error(err.message);
              doRelease(connection);
              return;
         }
         res.json({Status:"Success",Message:"Qr Code Submitted", Data : {} ,Code:200});
         // res.json({Status:"Success",Message:"Request Send Successfully", Data : {},Code:200});
         doRelease(connection);
       });
       });
   }
          function doRelease(connection) {
           connection.release(function(err) {
             if (err) {
              console.error(err.message);
            }
          }
       );
    } 
});



router.get('/getlist', function (req, res) {
        scanned_qr_detailsModel.find({}, function (err, Functiondetails) {
          res.json({Status:"Success",Message:"DiaGram Data ", Data : Functiondetails ,Code:200});
        });
});


router.post('/edit', function (req, res) {
        scanned_qr_detailsModel.findByIdAndUpdate(req.body._id, req.body, {new: true}, function (err, UpdatedDetails) {
            if (err) return res.json({Status:"Failed",Message:"Internal Server Error", Data : {},Code:500});
             res.json({Status:"Success",Message:"DiaGram Data  Updated", Data : UpdatedDetails ,Code:200});
        });
});
// // DELETES A USER FROM THE DATABASE
router.post('/delete', function (req, res) {
      scanned_qr_detailsModel.findByIdAndRemove(req.body.Activity_id, function (err, user) {
          if (err) return res.json({Status:"Failed",Message:"Internal Server Error", Data : {},Code:500});
          res.json({Status:"Success",Message:"DiaGram Data  Deleted successfully", Data : {} ,Code:200});
      });
});
module.exports = router;
