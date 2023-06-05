var express = require('express');
var router = express.Router();
var bodyParser = require('body-parser');
router.use(bodyParser.urlencoded({ extended: false }));
router.use(bodyParser.json());
var material_requestModel = require('./../models/material_requestModel');
var van_dataModel = require('./../models/van_dataModel');
var oracledb = require('oracledb');
var request = require("request");


router.post('/job_list_by_mobile_no',async function (req, res) {
  var user_detail  =  await material_requestModel.find({SMU_VANID: req.body.user_mobile_no});

   var unique2 = user_detail.filter((obj, index) => {
   return index === user_detail.findIndex(o => obj.SMU_JOBNO === o.SMU_JOBNO);
   });
   unique2 = unique2.sort((a, b) => a.SMU_JOBNO > b.SMU_JOBNO ? 1 : -1);

  res.json({Status:"Success",Message:"Respose Data", Data : unique2 ,Code:200});
});



router.post('/route_list_by_mobile_no',async function (req, res) {
  var user_detail  =  await material_requestModel.find({SMU_VANID: req.body.user_mobile_no});
   var unique2 = user_detail.filter((obj, index) => {
   return index === user_detail.findIndex(o => obj.SMU_ROUTE === o.SMU_ROUTE);
   });
      unique2 = unique2.sort((a, b) => a.SMU_ROUTE > b.SMU_ROUTE ? 1 : -1);

  res.json({Status:"Success",Message:"Respose Data", Data : unique2 ,Code:200});
});




router.get('/admin_list',async function (req, res) {
 var user_detail  =  await material_requestModel.find({});
   var unique2 = user_detail.filter((obj, index) => {
   return index === user_detail.findIndex(o => obj.SMU_JOBNO === o.SMU_JOBNO);
   });
   unique2 = unique2.sort((a, b) => a.SMU_JOBNO > b.SMU_JOBNO ? 1 : -1);
  res.json({Status:"Success",Message:"Respose Data", Data : unique2 ,Code:200});
})



router.post('/job_list_by_route',async function (req, res) {
 var user_detail  =  await material_requestModel.find({SMU_VANID: req.body.user_mobile_no,SMU_ROUTE:req.body.route_id});
   var unique2 = user_detail.filter((obj, index) => {
   return index === user_detail.findIndex(o => obj.SMU_JOBNO === o.SMU_JOBNO);
   });
   unique2 = unique2.sort((a, b) => a.SMU_JOBNO > b.SMU_JOBNO ? 1 : -1);
  res.json({Status:"Success",Message:"Respose Data", Data : unique2 ,Code:200});
});


router.post('/customer_details_by_job_no',async function (req, res) {
 var user_detail  =  await material_requestModel.findOne({SMU_JOBNO: req.body.job_id});
 res.json({Status:"Success",Message:"Respose Data", Data : user_detail ,Code:200});
});



router.post('/van_details',async function (req, res) {
    console.log(req.body);
 var user_detail  =  await material_requestModel.find({SMU_MRSEQNO: req.body.key_value});
 res.json({Status:"Success",Message:"Respose Data", Data : user_detail ,Code:200});
});




router.post('/material_mongo',async function (req, res) {
    console.log(req.body);
 var user_detail  =  await van_dataModel.find({JLS_MRD_MRSEQNO: req.body.key_value});
 res.json({Status:"Success",Message:"Respose Data", Data : user_detail ,Code:200});
});






router.post('/material_list_by_job_no',async function (req, res) {
 var user_detail  =  await material_requestModel.find({SMU_JOBNO: req.body.job_id});

   var unique2 = user_detail.filter((obj, index) => {
   return index === user_detail.findIndex(o => obj.SMU_MATLID === o.SMU_MATLID);
   });

  res.json({Status:"Success",Message:"Respose Data", Data : unique2 ,Code:200});

});



router.post('/qrcode_list_by_material_id', function (req, res) {

  console.log(req.body);
// req.body.user_mobile_no = "51039";
  oracledb.getConnection({
      user: "JLSMART",
      password: "JLSMART",
      connectString: "(DESCRIPTION =(ADDRESS = (PROTOCOL = TCP)(HOST = 192.168.1.112)(PORT = 1521))(CONNECT_DATA =(SID = jlpl)))"
}, function(err, connection) {
if (err) {
    // console.error(err.message);
    return;
}
connection.execute(
"SELECT * FROM jlsmart.jls_barcode_van WHERE ST_GRID_MATLID=:ST_GRID_MATLID and VANID =:VANID",
        {  VANID :req.body.user_mobile_no,
           ST_GRID_MATLID : req.body.mat_id
         },
        {autoCommit: true},
        function (err, result) {
    if (err) { console.error(err.message);
          doRelease(connection);
          return;
     }
  
 doRelease(connection);
if(result.rows.length == 0){
     res.json({Status:"Success",Message:"No Data Found", Data : [] ,Code:404});
} else {
var ary = [];
for(let a = 0 ; a < result.rows.length ; a++){
var temp_data = result.rows[a];
var results = {}
for (var i = 0; i < result.metaData.length; ++i){
results[result.metaData[i].name] = temp_data[i];
}
 ary.push(results);   
 if(a == result.rows.length - 1){
    res.json({Status:"Success",Message:"jopazh Detail List", Data : ary,Code:200});
    }
} 
}
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


  

});


router.post('/add_bar_qr_code', function (req, res) {

var JLS_BCD_ISSUENO = req.body.job_id + "_" +req.body.JLS_BCD_MRSEQNO;

oracledb.getConnection({
      user: "JLSMART",
      password: "JLSMART",
      connectString: "(DESCRIPTION =(ADDRESS = (PROTOCOL = TCP)(HOST = 192.168.1.112)(PORT = 1521))(CONNECT_DATA =(SID = jlpl)))"
}, function(err, connection) {
if (err) {
    // console.error(err.message);
    return;
}
connection.execute(
  "Insert into JLS_BARCODE_DNLOAD (JLS_BCD_ISSUENO, JLS_BCD_MRSEQNO, JLS_BCD_MRSLNO, JLS_BCD_MATLID, JLS_BCD_BARCODENO, JLS_BCD_JOBNO, JLS_BCD_CODETYPE) values (:JLS_BCD_ISSUENO, :JLS_BCD_MRSEQNO, :JLS_BCD_MRSLNO, :JLS_BCD_MATLID, :JLS_BCD_BARCODENO, :JLS_BCD_JOBNO, :JLS_BCD_CODETYPE)",
          {
            JLS_BCD_ISSUENO : JLS_BCD_ISSUENO,
            JLS_BCD_MRSEQNO : req.body.JLS_BCD_MRSEQNO,
            JLS_BCD_MRSLNO : req.body.JLS_BCD_MRSLNO,
            JLS_BCD_MATLID : req.body.JLS_BCD_MATLID,
            JLS_BCD_BARCODENO : req.body.JLS_BCD_BARCODENO,
            JLS_BCD_JOBNO :  req.body.JLS_BCD_JOBNO,
            JLS_BCD_CODETYPE : 'Q'
          },
        {autoCommit: true},
        function (err, result) {
    if (err) { console.error(err.message);
          doRelease(connection);
          return;
          res.json({Status:"Failed",Message:""+err.message, Data : {},Code:404});
     }
 doRelease(connection);
res.json({Status:"Success",Message:"Inserted", Data : {},Code:200});
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
});




router.post('/final_submit_data',async function (req, res) {   
   ///material_insert


var JLS_BCD_ISSUENO = req.body.job_id + "_" +req.body.JLS_MRD_MRSEQNO;
var JLS_MRD_MRSEQNO = req.body.JLS_MRD_MRSEQNO;


let a = {
"issue_Number": JLS_BCD_ISSUENO,   
"job_id" : req.body.job_id,
"user_mobile_no" : req.body.user_mobile_no,
"material_id" : req.body.material_id,
"qr_bar_code" : req.body.qr_bar_code,
"mat_list" : req.body.mat_list,
"JLS_MRD_MRSEQNO": req.body.JLS_MRD_MRSEQNO,
"signature":req.body.signature,
"emp_no":req.body.emp_no,
"submitted_on":req.body.submitted_on,
"actual_qty":req.body.actual_qty,
}   
var submitted = await van_dataModel.create(a);

console.log(submitted);




console.log(req.body);


  
console.log(JLS_BCD_ISSUENO,JLS_MRD_MRSEQNO);


barcode_insert();

function barcode_insert(){
var index = 0
recall(index,req);


function recall(index,req){
  if(index < req.body.qr_bar_code.length){
oracledb.getConnection({
      user: "JLSMART",
      password: "JLSMART",
      connectString: "(DESCRIPTION =(ADDRESS = (PROTOCOL = TCP)(HOST = 192.168.1.112)(PORT = 1521))(CONNECT_DATA =(SID = jlpl)))"
}, function(err, connection) {
if (err) {
    // console.error(err.message);
    return;
}

// doRelease(connection);
console.log({
          JLS_BCD_ISSUENO : JLS_BCD_ISSUENO,
          JLS_BCD_MRSEQNO : JLS_MRD_MRSEQNO,
          JLS_BCD_MRSLNO : index,
          JLS_BCD_MATLID : req.body.qr_bar_code[index].ST_GRID_MATLID,
          JLS_BCD_BARCODENO : req.body.qr_bar_code[index].ST_GRID_BARCODENO,
          JLS_BCD_JOBNO :  req.body.job_id,
          JLS_BCD_CODETYPE : 'B'
        });

connection.execute(
"Insert into JLS_BARCODE_DNLOAD (JLS_BCD_ISSUENO, JLS_BCD_MRSEQNO, JLS_BCD_MRSLNO, JLS_BCD_MATLID, JLS_BCD_BARCODENO, JLS_BCD_JOBNO, JLS_BCD_CODETYPE) values (:JLS_BCD_ISSUENO, :JLS_BCD_MRSEQNO, :JLS_BCD_MRSLNO, :JLS_BCD_MATLID, :JLS_BCD_BARCODENO, :JLS_BCD_JOBNO, :JLS_BCD_CODETYPE)",
        {
          JLS_BCD_ISSUENO : JLS_BCD_ISSUENO,
          JLS_BCD_MRSEQNO : JLS_MRD_MRSEQNO,
          JLS_BCD_MRSLNO : index,
          JLS_BCD_MATLID : req.body.qr_bar_code[index].ST_GRID_MATLID,
          JLS_BCD_BARCODENO : req.body.qr_bar_code[index].ST_GRID_BARCODENO,
          JLS_BCD_JOBNO :  req.body.job_id,
          JLS_BCD_CODETYPE : 'B'
        },
        {autoCommit: true},
        function (err, result) {
    if (err) { console.error(err.message);
          doRelease(connection);
          return;
          // res.json({Status:"Failed",Message:""+err.message, Data : {},Code:404});
     }
 doRelease(connection);
     index = index + 1;
     recall(index,req);
// res.json({Status:"Success",Message:"Inserted", Data : {},Code:200});
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
  } else {
   
   if(req.body.mat_list.length == 0){
     signature_insert(req, JLS_BCD_ISSUENO, JLS_MRD_MRSEQNO);
   } else {
     material_insert(req, JLS_BCD_ISSUENO, JLS_MRD_MRSEQNO);
   }

   

  }
} 

}


function material_insert(req,  JLS_BCD_ISSUENO, JLS_MRD_MRSEQNO) {
var index = 0
recall(index,req);
function recall(index,req){
  if(index < req.body.mat_list.length){
oracledb.getConnection({
      user: "JLSMART",
      password: "JLSMART",
      connectString: "(DESCRIPTION =(ADDRESS = (PROTOCOL = TCP)(HOST = 192.168.1.112)(PORT = 1521))(CONNECT_DATA =(SID = jlpl)))"
}, function(err, connection) {
if (err) {
    // console.error(err.message);
    return;
}

// doRelease(connection);
console.log({
          JLS_MRD_ISSUENO : JLS_BCD_ISSUENO,
          JLS_MRD_MRSEQNO : JLS_MRD_MRSEQNO,
          JLS_MRD_MRSLNO : index,
          JLS_MRD_MATLID : req.body.mat_list[index].SVS_MATLID,
          JLS_MRD_ISTAT : "N",
          JLS_MRD_PREPDT :  req.body.submitted_on,
          JLS_MRD_QTY : req.body.mat_list[index].qty,
        });

connection.execute(
"Insert into JLS_MATREQ_DNLOAD (JLS_MRD_ISSUENO, JLS_MRD_MRSEQNO, JLS_MRD_MRSLNO, JLS_MRD_MATLID, JLS_MRD_ISTAT, JLS_MRD_PREPDT, JLS_MRD_QTY) values (:JLS_MRD_ISSUENO, :JLS_MRD_MRSEQNO, :JLS_MRD_MRSLNO, :JLS_MRD_MATLID, :JLS_MRD_ISTAT, :JLS_MRD_PREPDT, :JLS_MRD_QTY)",
        {
          JLS_MRD_ISSUENO : JLS_BCD_ISSUENO,
          JLS_MRD_MRSEQNO : JLS_MRD_MRSEQNO,
          JLS_MRD_MRSLNO : index,
          JLS_MRD_MATLID : req.body.mat_list[index].SVS_MATLID,
          JLS_MRD_ISTAT : "N",
          JLS_MRD_PREPDT :  req.body.submitted_on,
          JLS_MRD_QTY :req.body.mat_list[index].qty,
        },
        {autoCommit: true},
        function (err, result) {
    if (err) { console.error(err.message);
          doRelease(connection);
          return;
          // res.json({Status:"Failed",Message:""+err.message, Data : {},Code:404});
     }
 doRelease(connection);
      index = index + 1;
     recall(index,req);
           // res.json({Status:"Success",Message:"Inserted", Data : {},Code:200});
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
  } else {

   signature_insert(req,  JLS_BCD_ISSUENO, JLS_MRD_MRSEQNO);

  }
} 

}



function signature_insert(req,  JLS_BCD_ISSUENO, JLS_MRD_MRSEQNO) {


oracledb.getConnection({
      user: "JLSMART",
      password: "JLSMART",
      connectString: "(DESCRIPTION =(ADDRESS = (PROTOCOL = TCP)(HOST = 192.168.1.112)(PORT = 1521))(CONNECT_DATA =(SID = jlpl)))"
}, function(err, connection) {
if (err) {
    // console.error(err.message);
    return;
}

var photo1 = (""+req.body.signature).slice(50);
var blog1 = fetchblog(photo1);
function fetchblog(filepath) {
var path = require('path');       
var fs = require('fs');
var source = fs.readFileSync('/home/smart/johnson_application/public/uploads/'+filepath);
return source;
}

// doRelease(connection);
console.log({
          JID_ISSUENO : JLS_BCD_ISSUENO,
          JID_ISSUEDATE : req.body.submitted_on,
          JID_SIGNATURE : blog1
        });


connection.execute(
"Insert into JLS_ISSUEHDR_DNLOAD ( JID_ISSUENO, JID_ISSUEDATE, JID_SIGNATURE ) values (:JID_ISSUENO, :JID_ISSUEDATE, :JID_SIGNATURE)",
        {
          JID_ISSUENO : JLS_BCD_ISSUENO,
          JID_ISSUEDATE : req.body.submitted_on,
          JID_SIGNATURE : blog1
        },
        {autoCommit: true},
        function (err, result) {
    if (err) { console.error(err.message);
          doRelease(connection);
          return;
          // res.json({Status:"Failed",Message:""+err.message, Data : {},Code:404});
     }
 doRelease(connection);
   res.json({Status:"Success",Message:"Submitted Successfully", Data : {},Code:200});
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

router.post('/material_list_based_on_nobarcodes', function (req, res) {
  oracledb.getConnection({
      user: "JLSMART",
      password: "JLSMART",
      connectString: "(DESCRIPTION =(ADDRESS = (PROTOCOL = TCP)(HOST = 192.168.1.112)(PORT = 1521))(CONNECT_DATA =(SID = jlpl)))"
}, function(err, connection) {
if (err) {
    console.error(err.message);
    return;
}
connection.execute(
"SELECT * FROM JLS_VANSTOCK WHERE SVS_VANID =:SVS_VANID AND SVS_CURSTK > 0",
        {
          SVS_VANID : req.body.user_mobile_no
        },
        {autoCommit: true},
        function (err, result) {
          console.log(err);
    if (err) { console.error(err.message);
          doRelease(connection);
          return;
     }
 doRelease(connection);

if(result.rows.length == 0){
     res.json({Status:"Success",Message:"No Data Found", Data : [] ,Code:200});
} else {
var ary = [];
for(let a = 0 ; a < result.rows.length ; a++){
var temp_data = result.rows[a];
var results = {}
for (var i = 0; i < result.metaData.length; ++i){
results[result.metaData[i].name] = temp_data[i];
}
 ary.push(results);   
 if(a == result.rows.length - 1){
    res.json({Status:"Success",Message:"jopazh Detail List", Data : ary,Code:200});
    }
} 
}
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

});


module.exports = router;
