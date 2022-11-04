var express = require('express');
var router = express.Router();
var bodyParser = require('body-parser');
router.use(bodyParser.urlencoded({ extended: false }));
router.use(bodyParser.json());
var new_group_listModel = require('./../models/new_group_listModel');
var oracledb = require('oracledb');

router.post('/create', async function(req, res) {
  try{
  await new_group_listModel.create({
  SMU_SEQNO : req.body.SMU_SEQNO || "",
  SMU_ACTIVITYNO : req.body.SMU_ACTIVITYNO || "",
  SMU_UKEY : req.body.SMU_UKEY || "",
  SMU_UKEY_DESCRIPTION : req.body.SMU_UKEY_DESCRIPTION || "",
  SMU_DEPT : req.body.SMU_DEPT || "",
  SMU_FORMTYPE :  req.body.SMU_FORMTYPE || "",
  SMU_FORMTYPE_DESC :req.body.SMU_FORMTYPE_DESC || "",
  SMU_DWNFLAG : req.body.SMU_DWNFLAG || "",
  SMU_CHILD : req.body.SMU_CHILD || "",
  SMU_CANCFLAG : req.body.SMU_CANCFLAG || "",
  SMU_ROUTE : req.body.SMU_ROUTE || "",
  SMU_UPFLAGDATE : req.body.SMU_UPFLAGDATE || "",
  SMU_DWNFLAGDATE : req.body.SMU_DWNFLAGDATE || "",
  SMU_ERRDESC : req.body.SMU_ERRDESC || "",
        }, 
        function (err, user) {
          console.log(user)
        res.json({Status:"Success",Message:"Added successfully", Data : user ,Code:200}); 
        });
}
catch(e){
      res.json({Status:"Failed",Message:"Internal Server Error", Data : {},Code:500});
}
});


router.get('/deletes', function (req, res) {
      new_group_listModel.remove({}, function (err, user) {
          if (err) return res.status(500).send("There was a problem deleting the user.");
             res.json({Status:"Success",Message:"new_group_listModel Deleted", Data : {} ,Code:200});     
      });
});




router.get('/fetch_data_activity', function (req, res) {
oracledb.getConnection({
      user: "JLSMART",
      password: "JLSMART",
      connectString: "(DESCRIPTION =(ADDRESS = (PROTOCOL = TCP)(HOST = 192.168.1.112)(PORT = 1521))(CONNECT_DATA =(SID = jlpl)))"
}, function(err, connection) {
if (err) {
    console.error(err.message);
    return;
}
     var ary = [];
     connection.execute(
            "SELECT *  FROM TEMPLATE_MASTER WHERE SMU_DWNFLAG=:fn",
            {fn: 'N'},
        {autoCommit: true},
        function (err, result) {
    if (err) { console.error(err.message);
          doRelease(connection);
          return;
     }
     if(result.rows.length == 0){
      res.json({Status:"Success",Message:"Respose Data", Data : ary ,Code:200});  
     }
     else {

// console.log("record Count",result.rows.length);   
// console.log("Row Count",result.metaData.length);        
for(let a = 0 ; a < result.rows.length;a++){
var temp_data = result.rows[a];
var results = {};
for (var i = 0; i < result.metaData.length; ++i){
results[result.metaData[i].name] = temp_data[i];
}
 // console.log(results);
 ary.push(results);   
 if(a == result.rows.length - 1){
    var total_count = ary.length + 1;
    var temp_count = 0;
    recall();
     function recall() {

        if(temp_count == total_count){
        res.json({Status:"Success",Message:"Respose Data", Data : ary ,Code:200});    
        } else {
        // console.log(temp_count,total_count);
     var response =  ary[temp_count];
try{
  new_group_listModel.create({
  SMU_SEQNO : response.SMU_SEQNO || "",
  SMU_ACTIVITYNO : response.SMU_ACTIVITYNO || "",
  SMU_UKEY : response.SMU_UKEY || "",
  SMU_UKEY_DESCRIPTION : response.SMU_UKEY_DESCRIPTION || "",
  SMU_DEPT : response.SMU_DEPT || "",
  SMU_FORMTYPE :  response.SMU_FORMTYPE || "",
  SMU_FORMTYPE_DESC :response.SMU_FORMTYPE_DESC || "",
  SMU_DWNFLAG : "Y",
  SMU_CHILD : response.SMU_CHILD || "",
  SMU_CANCFLAG : response.SMU_CANCFLAG || "",
  SMU_ROUTE : response.SMU_ROUTE || "",
  SMU_UPFLAGDATE : response.SMU_UPFLAGDATE || "",
  SMU_DWNFLAGDATE : response.SMU_DWNFLAGDATE || "",
  SMU_ERRDESC : response.SMU_ERRDESC || "",
  DATEOFFETCH : new Date()
        }, 
        function (err, user) {
          // console.log(user)
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
            "UPDATE TEMPLATE_MASTER set SMU_DWNFLAG=:fn, SMU_DWNFLAGDATE=:dfd WHERE SMU_SEQNO=:id",
            {fn: 'Y', id: response.SMU_SEQNO,dfd: new Date()},
        {autoCommit: true},
        function (err, result) {
    if (err) { console.error(err.message);
          doRelease(connection);
          return;
     }
     // res.json({Status:"Success",Message:"Updated", Data : result ,Code:200});     
     doRelease(connection);
   });
});
        // res.json({Status:"Success",Message:"Added successfully", Data : user ,Code:200}); 
        });
}
catch(e){
      res.json({Status:"Failed",Message:"Internal Server Error", Data : {},Code:500});
}
           temp_count = temp_count + 1;
           recall();
        }
        
    }
 }
}
     }
     doRelease(connection);
   });
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



router.get('/update_data_activity/:id', function (req, res) {
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
            "UPDATE TEMPLATE_MASTER set SMU_DWNFLAG=:fn  WHERE SMU_SEQNO=:id ",
            {fn: 'N', id: req.params.id},
        {autoCommit: true},
        function (err, result) {
    if (err) { console.error(err.message);
          doRelease(connection);
          return;
     }
     res.json({Status:"Success",Message:"Updated", Data : result ,Code:200});     
     doRelease(connection);
   });
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


router.get('/update_data_activity', function (req, res) {

for(let a  = 0 ; a < 16 ; a ++){
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
            "UPDATE TEMPLATE_MASTER set SMU_DWNFLAG=:fn  WHERE SMU_SEQNO=:id ",
            {fn: 'N', id: a},
        {autoCommit: true},
        function (err, result) {
    if (err) { console.error(err.message);
          doRelease(connection);
          return;
     }
     // res.json({Status:"Success",Message:"Updated", Data : result ,Code:200});     
     doRelease(connection);
   });
});
function doRelease(connection) {
       connection.release(function(err) {
         if (err) {
          console.error(err.message);
        }
      }
   );
}
}
});


router.get('/all_fetch_data_activity', function (req, res) {
oracledb.getConnection({
      user: "JLSMART",
      password: "JLSMART",
      connectString: "(DESCRIPTION =(ADDRESS = (PROTOCOL = TCP)(HOST = 192.168.1.112)(PORT = 1521))(CONNECT_DATA =(SID = jlpl)))"
}, function(err, connection) {
if (err) {
    console.error(err.message);
    return;
}
     var ary = [];
     connection.execute(
            "SELECT *  FROM TEMPLATE_MASTER WHERE SMU_DWNFLAG=:fn",
            {fn: 'N'},
        {autoCommit: true},
        function (err, result) {
    if (err) { console.error(err.message);
          doRelease(connection);
          return;
     }
     if(result.rows.length == 0){
      res.json({Status:"Success",Message:"Respose Data", Data : ary ,Code:200});  
     }
     else {
// console.log(result.rows);
for(let a = 0 ; a < result.rows.length;a++){
var temp_data = result.rows[a];
var results = {};
for (var i = 0; i < result.metaData.length; ++i){
results[result.metaData[i].name] = temp_data[i];
}
 // console.log(results);
 ary.push(results);   
 if(a == result.rows.length - 1){
 res.json({Status:"Success",Message:"Response", Data : ary ,Code:200});
 }
}
     }
     doRelease(connection);
   });
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


router.get('/all_fetch_data_activity2', function (req, res) {
oracledb.getConnection({
      user: "JLSMART",
      password: "JLSMART",
      connectString: "(DESCRIPTION =(ADDRESS = (PROTOCOL = TCP)(HOST = 192.168.1.112)(PORT = 1521))(CONNECT_DATA =(SID = jlpl)))"
}, function(err, connection) {
if (err) {
    console.error(err.message);
    return;
}
     var ary = [];
   connection.execute("SELECT * FROM ESPD_OP_HDR",[], function (err, result) {
    if (err) { console.error(err.message);
          doRelease(connection);
          return;
     }
     if(result.rows.length == 0){
      res.json({Status:"Success",Message:"Respose Data", Data : ary ,Code:200});  
     }
     else {
// console.log(result.rows);
for(let a = 0 ; a < result.rows.length;a++){
var temp_data = result.rows[a];
var results = {};
for (var i = 0; i < result.metaData.length; ++i){
results[result.metaData[i].name] = temp_data[i];
}
 // console.log(results);
 ary.push(results);   
 if(a == result.rows.length - 1){
 res.json({Status:"Success",Message:"Response", Data : ary ,Code:200});
 }
}
     }
     doRelease(connection);
   });
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



router.post('/pull_and_upload_datas', function (req, res) {
oracledb.getConnection({
      user: "JLSMART",
      password: "JLSMART",
      connectString: "(DESCRIPTION =(ADDRESS = (PROTOCOL = TCP)(HOST = 192.168.1.112)(PORT = 1521))(CONNECT_DATA =(SID = jlpl)))"
}, function(err, connection) {
if (err) {
    console.error(err.message);
    return;
}
     var ary = [];
     connection.execute(
            "SELECT *  FROM TEMPLATE_MASTER WHERE SMU_SEQNO=:fn",
            {fn: req.body.seq_no},
        {autoCommit: true},
        function (err, result) {
    if (err) { console.error(err.message);
          doRelease(connection);
          return;
     }
     if(result.rows.length == 0){
      res.json({Status:"Success",Message:"Respose Data", Data : ary ,Code:200});  
     }
     else {
for(let a = 0 ; a < result.rows.length;a++){
var temp_data = result.rows[a];
var results = {};
for (var i = 0; i < result.metaData.length; ++i){
results[result.metaData[i].name] = temp_data[i];
}
 ary.push(results);   
 // console.log("Resutl Data",ary);
 if(a == result.rows.length - 1){
    var total_count = ary.length;
    var temp_count = 0;
    recall();
     function recall() {
        // console.log("Test  1",ary[temp_count]);
        // console.log("Test  2",temp_count,total_count);
        if(temp_count == total_count){
     res.json({Status:"Success",Message:"Update Successfully", Data : {} ,Code:200});
        } else {
     var response =  ary[temp_count];
     // console.log(response.SMU_SEQNO);
     // console.log(response);
    new_group_listModel.findOneAndUpdate({SMU_SEQNO: response.SMU_SEQNO}, {$set:response}, {new: true}, (err, doc) => {
    if (err) {
        // console.log("Something wrong when updating data!");
    }else{
     // res.json({Status:"Success",Message:"Update Successfully", Data : {} ,Code:200});
    }
});
           temp_count = temp_count + 1;
           recall();
        }
    }
 }
}
     }
     doRelease(connection);
   });
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






router.post('/getlist_id', function (req, res) {
         let final_data = []; 
         var keyword = req.body.search_string.toLowerCase();
         // job_detail_id:req.body.job_detail_id
        new_group_listModel.find({}, function (err, StateList) {
            if(StateList.length == 0 || req.body.search_string == ""){
            res.json({Status:"Success",Message:"new_group_listModel List", Data : StateList ,Code:200});
          }else {
          for(let a = 0 ; a  < StateList.length; a ++){
          var active_text = StateList[a].group_detail_name.toLowerCase();
          if(active_text.indexOf(keyword) !== -1 == true){
               final_data.push(StateList[a]);
          }
          if(a == StateList.length - 1){
             res.json({Status:"Success",Message:"new_group_listModel List", Data : final_data ,Code:200});
          }
          }
          }
        }).sort({index:1});
});



router.get('/getlist', function (req, res) {
        new_group_listModel.find({}, function (err, Functiondetails) {
          res.json({Status:"Success",Message:"new_group_listModel", Data : Functiondetails ,Code:200});
        }).sort({index:1});
});




router.get('/groupdetail_list_subgroup', function (req, res) {
        new_group_listModel.find({sub_group_status:'true'}, function (err, Functiondetails) {
          res.json({Status:"Success",Message:"new_group_listModel", Data : Functiondetails ,Code:200});
        }).sort({index:1});
});



router.get('/reload_data',async function (req, res) {
        var ref_code_details  =  await new_group_listModel.find({}).sort({index:1});
        for(let a  = 0; a < ref_code_details.length ; a ++){
         let d = {
            index : a + 1
         }
         new_group_listModel.findByIdAndUpdate(ref_code_details[a]._id, d, {new: true}, function (err, UpdatedDetails) {
            if (err) return res.json({Status:"Failed",Message:"Internal Server Error", Data : {},Code:500});
        });
         if(a == ref_code_details.length - 1){
            res.json({Status:"Success",Message:"new_group_listModel Updated", Data : {} ,Code:200});
         }
        }

});


router.get('/reload_data2',async function (req, res) {
        var ref_code_details  =  await new_group_listModel.find({}).sort({index:1});
        for(let a  = 0; a < ref_code_details.length ; a ++){
         let d = {
            delete_status : false,
         }
         new_group_listModel.findByIdAndUpdate(ref_code_details[a]._id, d, {new: true}, function (err, UpdatedDetails) {
            if (err) return res.json({Status:"Failed",Message:"Internal Server Error", Data : {},Code:500});
        });
         if(a == ref_code_details.length - 1){
            res.json({Status:"Success",Message:"new_group_listModel Updated", Data : {} ,Code:200});
         }
        }

});



router.get('/groupdetail_list_subgroup1', function (req, res) {
        new_group_listModel.find({SMU_FORMTYPE:4}, function (err, Functiondetails) {
          res.json({Status:"Success",Message:"group_detailModel", Data : Functiondetails ,Code:200});
        }).sort({index:1});
});




router.post('/edit', function (req, res) {
        new_group_listModel.findByIdAndUpdate(req.body._id, req.body, {new: true}, function (err, UpdatedDetails) {
            if (err) return res.json({Status:"Failed",Message:"Internal Server Error", Data : {},Code:500});
             res.json({Status:"Success",Message:"new_group_listModel Updated", Data : UpdatedDetails ,Code:200});
        });
});


// // DELETES A USER FROM THE DATABASE
router.post('/admin_delete', function (req, res) {
      new_group_listModel.findByIdAndRemove(req.body._id, function (err, user) {
          if (err) return res.json({Status:"Failed",Message:"Internal Server Error", Data : {},Code:500});
          res.json({Status:"Success",Message:"Job_no_managment Deleted successfully", Data : {} ,Code:200});
      });
});


// // DELETES A USER FROM THE DATABASE
router.post('/delete', function (req, res) {
      new_group_listModel.findByIdAndRemove(req.body._id, function (err, user) {
          if (err) return res.json({Status:"Failed",Message:"Internal Server Error", Data : {},Code:500});
          res.json({Status:"Success",Message:"new_group_listModel Deleted successfully", Data : {} ,Code:200});
      });
});
module.exports = router;
