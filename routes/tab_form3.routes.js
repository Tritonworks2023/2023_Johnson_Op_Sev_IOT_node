var express = require('express');
var router = express.Router();
var bodyParser = require('body-parser');
router.use(bodyParser.urlencoded({ extended: false }));
router.use(bodyParser.json());
var tab_form3Model = require('./../models/tab_form3Model');
var oracledb = require('oracledb');

router.post('/create', async function(req, res) {
  try{
        await tab_form3Model.create({
             collection_type : req.body.collection_type,
             current_date : req.body.current_date,
             uploaded_file : req.body.uploaded_file,
             Agent_code : req.body.Agent_code.replaceAll('-',''),
             cheq_no : req.body.cheq_no,
             rtgs_no : req.body.rtgs_no,
             cheq_amount : req.body.cheq_amount,
             cheq_date : req.body.cheq_date,
             bank_name : req.body.bank_name,
             ifsc_code : req.body.ifsc_code,
             third_party_chq : req.body.third_party_chq,
             ded_it : req.body.ded_it,
             ded_gst : req.body.ded_gst,
             ded_other_one_type : req.body.ded_other_one_type,
             ded_other_one_value : req.body.ded_other_one_value,
             ded_other_two_type :  req.body.ded_other_two_type,
             ded_other_two_value : req.body.ded_other_two_value,
             total : req.body.total,
             job_details : req.body.job_details,
             remarks : req.body.remarks,
             created_by : req.body.created_by,
        }, 
        function (err, user) {


if(req.body.rtgs_no == ''){
    req.body.rtgs_no = req.body.cheq_no;
}




oracledb.getConnection({
      user: "JLSMART",
      password: "JLSMART",
      connectString: "(DESCRIPTION =(ADDRESS = (PROTOCOL = TCP)(HOST = 192.168.1.112)(PORT = 1521))(CONNECT_DATA =(SID = jlpl)))"
}, function(err, connection) {
if (err) {
    console.error(err.message);
    return;
}
if(req.body.rtgs_no == ''){
    req.body.rtgs_no = req.body.cheq_no;
}

res.json({Status:"Success",Message:"Added successfully", Data : user ,Code:200}); 

var todayDate = new Date().toISOString().slice(0, 10);


const myArray1 = todayDate.split("-");
var month_list = ["", "Jan", "Feb", "Mar", "Apr", "May", "Jun" ,"Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

const myArray2 = req.body.cheq_date.split("/");
var month_list = ["", "Jan", "Feb", "Mar", "Apr", "May", "Jun" ,"Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

var details = {
    JLS_ENTRY_DATE : ""+myArray1[2]+"-"+month_list[+myArray1[1]]+"-"+myArray1[0],
    JLS_AGCODE : req.body.Agent_code.replaceAll('-',''),
    JLS_CHQ_UTR_NO : req.body.rtgs_no,
    JLS_CHQ_DATE : ""+myArray2[0]+"-"+month_list[+myArray2[1]]+"-"+myArray2[2],
    JLS_BANK_IFSC : req.body.bank_name,
    JLS_CHQ_AMT : req.body.cheq_amount,
    JLS_THIRDPARTY :  req.body.third_party_chq.substring(0, 1),
    JLS_TDS : req.body.ded_it,
    JLS_GST : req.body.ded_gst,
    JLS_OTHER1 : req.body.ded_other_one_type,
    JLS_OTHER1_AMT : req.body.ded_other_one_value,
    JLS_OTHER2 : req.body.ded_other_two_type,
    JLS_OTHER2_AMT : req.body.ded_other_two_value,
    JLS_REMARKS : req.body.remarks,
    JLS_MOBILE : req.body.created_by,
    JLS_JOBTYPE : req.body.collection_value.substring(0, 1),
    JLS_TRANS_TYPE : req.body.collection_type.substring(0, 1),
};


     connection.execute(
             `INSERT INTO JLSMART_DAILY_COLL_HDR (JLS_ENTRY_DATE, JLS_AGCODE, JLS_CHQ_UTR_NO, JLS_CHQ_DATE, JLS_BANK_IFSC, JLS_CHQ_AMT,
JLS_THIRDPARTY, JLS_TDS, JLS_GST, JLS_OTHER1, JLS_OTHER1_AMT, JLS_OTHER2, JLS_OTHER2_AMT, JLS_REMARKS,JLS_MOBILE , JLS_JOBTYPE,JLS_TRANS_TYPE) VALUES (:JLS_ENTRY_DATE, :JLS_AGCODE, :JLS_CHQ_UTR_NO, :JLS_CHQ_DATE, :JLS_BANK_IFSC, :JLS_CHQ_AMT,
:JLS_THIRDPARTY, :JLS_TDS, :JLS_GST, :JLS_OTHER1, :JLS_OTHER1_AMT, :JLS_OTHER2, :JLS_OTHER2_AMT, :JLS_REMARKS, :JLS_MOBILE, :JLS_JOBTYPE, :JLS_TRANS_TYPE)`,
                details,
        {autoCommit: true},
        function (err, result1) {
    if (err) { console.error(err.message);
          doRelease(connection);
          return;
     }
     doRelease(connection);
   });
function doRelease(connection) {
       connection.release(function(err) {
         if (err) {
          console.error(err.message);
        }
      }
   );
}
});

req.body.job_details.forEach(element => {
 if(element.contract_no !== ''){
oracledb.getConnection({
      user: "JLSMART",
      password: "JLSMART",
      connectString: "(DESCRIPTION =(ADDRESS = (PROTOCOL = TCP)(HOST = 192.168.1.112)(PORT = 1521))(CONNECT_DATA =(SID = jlpl)))"
}, function(err, connection) {
if (err) {
    console.error(err.message);
    return;
}
var todayDate = new Date().toISOString().slice(0, 10);
const myArray1 = todayDate.split("-");
var month_list = ["", "Jan", "Feb", "Mar", "Apr", "May", "Jun" ,"Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

var from_date = '';
var end_date = '';

if(element.frm == ''){
    from_date = "";
} else {
const myArray3 = element.frm.split("/");
from_date = ""+myArray3[0]+"-"+month_list[+myArray3[1]]+"-"+myArray3[2];
}

if(element.to == ''){
end_date = "";
} else {
const myArray4 = element.frm.split("/");
end_date = ""+myArray4[0]+"-"+month_list[+myArray4[1]]+"-"+myArray4[2];
}

const myArray2 = req.body.cheq_date.split("/");

var month_list = ["", "Jan", "Feb", "Mar", "Apr", "May", "Jun" ,"Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

var detailss = {
    JLSD_ENTRY_DATE : ""+myArray1[2]+"-"+month_list[+myArray1[1]]+"-"+myArray1[0],
    JLSD_AGCODE : req.body.Agent_code.replaceAll('-',''),
    JLSD_CHQ_UTR_NO : req.body.rtgs_no,
    JLSD_CHQ_DATE : ""+myArray2[0]+"-"+month_list[+myArray2[1]]+"-"+myArray2[2],
    JLSD_JOBNO : element.job_no,
    JLSD_PAYTYPE : element.pay_type,
    JLSD_FROM :  from_date,
    JLSD_TO : end_date,
    JLSD_AMT : element.pay_amount,
    JLSD_CONTRACTNO : element.contract_no,
};

     connection.execute(
             `INSERT INTO JLSMART_DAILY_COLL_DTL (JLSD_ENTRY_DATE, JLSD_AGCODE, JLSD_CHQ_UTR_NO, JLSD_CHQ_DATE, JLSD_JOBNO, JLSD_PAYTYPE, JLSD_FROM, JLSD_TO, JLSD_AMT, JLSD_CONTRACTNO) VALUES (:JLSD_ENTRY_DATE, :JLSD_AGCODE, :JLSD_CHQ_UTR_NO, :JLSD_CHQ_DATE, :JLSD_JOBNO, :JLSD_PAYTYPE, :JLSD_FROM, :JLSD_TO, :JLSD_AMT, :JLSD_CONTRACTNO)`,
                detailss,
        {autoCommit: true},
        function (err, result1) {
    if (err) { console.error(err.message);
          doRelease(connection);
          return;
     }
     doRelease(connection);
   });

function doRelease(connection) {
       connection.release(function(err) {
         if (err) {
          console.error(err.message);
        }
      }
   );
}
});
}
});
        });
}
catch(e){
      res.json({Status:"Failed",Message:"Internal Server Error", Data : {},Code:500});
}



});


router.get('/deletes', function (req, res) {
      tab_form3Model.remove({}, function (err, user) {
          if (err) return res.status(500).send("There was a problem deleting the user.");
             res.json({Status:"Success",Message:"tab_form3Model Deleted", Data : {} ,Code:200});     
      });
});


router.post('/getlist_id', function (req, res) {
        tab_form3Model.find({Person_id:req.body.Person_id}, function (err, StateList) {
          res.json({Status:"Success",Message:"State List", Data : StateList ,Code:200});
        });
});



router.get('/getlist', function (req, res) {
        tab_form3Model.find({}, function (err, Functiondetails) {
          res.json({Status:"Success",Message:"Functiondetails", Data : Functiondetails ,Code:200});
        });
});


router.post('/edit', function (req, res) {
        tab_form3Model.findByIdAndUpdate(req.body.Activity_id, req.body, {new: true}, function (err, UpdatedDetails) {
            if (err) return res.json({Status:"Failed",Message:"Internal Server Error", Data : {},Code:500});
             res.json({Status:"Success",Message:"Functiondetails Updated", Data : UpdatedDetails ,Code:200});
        });
});
// // DELETES A USER FROM THE DATABASE
router.post('/delete', function (req, res) {
      tab_form3Model.findByIdAndRemove(req.body.Activity_id, function (err, user) {
          if (err) return res.json({Status:"Failed",Message:"Internal Server Error", Data : {},Code:500});
          res.json({Status:"Success",Message:"SubFunction Deleted successfully", Data : {} ,Code:200});
      });
});
module.exports = router;
