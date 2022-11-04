var express = require('express');
var router = express.Router();
var bodyParser = require('body-parser');
router.use(bodyParser.urlencoded({ extended: false }));
router.use(bodyParser.json());
var group_detailModel = require('./../models/group_detailModel');
var user_management = require('./../models/user_managementModel');
var new_group_listModel = require('./../models/new_group_listModel');
var oracledb = require('oracledb');



router.post('/create', async function(req, res) {
  try{

  await group_detailModel.create({
  activity_id : req.body.activity_id || "",
  job_detail_id : req.body.job_detail_id || "",
  index : req.body.index || 0,
  sub_group_status : req.body.sub_group_status || "",
  group_detail_name :  req.body.group_detail_name || "",
  group_detail_created_at : req.body.group_detail_created_at || "",
  group_detail_update_at : req.body.group_detail_update_at || "",
  group_detail_created_by : req.body.group_detail_created_by || "",
  group_detail_updated_by : req.body.group_detail_updated_by || "",
  form_type : req.body.form_type || "",
  delete_status : false,
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
      group_detailModel.remove({}, function (err, user) {
          if (err) return res.status(500).send("There was a problem deleting the user.");
             res.json({Status:"Success",Message:"group_detailModel Deleted", Data : {} ,Code:200});     
      });
});





// router.post('/getlist_id', function (req, res) {
//          let final_data = []; 
//          var keyword = req.body.search_string.toLowerCase();
         
//         group_detailModel.find({}, function (err, StateList) {
//             if(StateList.length == 0 || req.body.search_string == ""){
//             res.json({Status:"Success",Message:"group_detailModel List", Data : StateList ,Code:200});
//           }else {
//           for(let a = 0 ; a  < StateList.length; a ++){
//           var active_text = StateList[a].group_detail_name.toLowerCase();
//           if(active_text.indexOf(keyword) !== -1 == true){
//                final_data.push(StateList[a]);
//           }
//           if(a == StateList.length - 1){
//              res.json({Status:"Success",Message:"group_detailModel List", Data : final_data ,Code:200});
//           }
//           }
//           }
//         }).sort({index:1});
// });


router.post('/getlist_id',async function (req, res) {
    // console.log(req.body);
    // console.log(req.body);
         let final_data = []; 
         var keyword = req.body.search_string.toLowerCase();
         var user_management_detail = await user_management.findOne({_id:req.body.user_id});
         var group_details = await new_group_listModel.find({});
         // var group_details = await new_group_listModel.find({SMU_DEPT:user_management_detail.user_role});
         // console.log(group_details);
         let temp_datas = [];
         group_details.forEach(element => {
          let a  = {
  seqno :  element.SMU_SEQNO,
  _id : element._id,
  "activity_id": "61c55f858bc953743afdaa52",
  "job_detail_id": "61c561a83c5cfc7d49dfa1fc",
  index : 0,
  activity_no : element.SMU_ACTIVITYNO || "",
  activity_ukey :  element.SMU_UKEY || "",
  sub_group_status : false,
  group_detail_name :  element.SMU_UKEY_DESCRIPTION || "",
  group_detail_created_at :  "",
  group_detail_update_at : "",
  group_detail_created_by : "",
  group_detail_updated_by : "",
  form_type : element.SMU_FORMTYPE || "",
  delete_status : false,
  }
  temp_datas.push(a);
});

oracledb.getConnection({
      user: "JLSMART",
      password: "JLSMART",
      connectString: "(DESCRIPTION =(ADDRESS = (PROTOCOL = TCP)(HOST = 192.168.1.112)(PORT = 1521))(CONNECT_DATA =(SID = jlpl)))"
}, function(err, connection) {
if (err) {
    // console.error(err.message);
    return;
}    
 // console.log({fn: user_management_detail.user_id,jn:req.body.job_detail_id,status:'SUBMITTED'});
     // connection.execute("SELECT * FROM ESPD_OP_HDR",[], function
    // "SELECT *  FROM ESPD_OP_HDR WHERE SMU_TECHMOBNO=:fn and SMU_JOBNO=:jn AND SMU_ACTIVITY_STATUS<>:'SUBMITTED'",
      connection.execute(
            "SELECT *  FROM ESPD_OP_HDR WHERE SMU_TECHMOBNO=:fn and SMU_JOBNO=:jn and SMU_ACTIVITY_STATUS<>:status",
            {fn: user_management_detail.user_id,jn:req.body.job_detail_id,status:'SUBMITTED'},
            // "SELECT *  FROM ESPD_OP_HDR WHERE SMU_TECHMOBNO=:fn and SMU_JOBNO=:jn",
            // {fn: user_management_detail.user_id,jn:req.body.job_detail_id},
        {autoCommit: true},
        function (err, result) {
    if (err) { console.error(err.message);
          doRelease(connection);
          return;
     }
// console.log(result.rows);
 if(result.rows == 0){
res.json({Status:"Success",Message:"No Record Found", Data : [] ,Code:200});
 }else {
var ary = [];
for(let a = 0 ; a < result.rows.length;a++){
var temp_data = result.rows[a];
var results = {};
for (var i = 0; i < result.metaData.length; ++i){
results[result.metaData[i].name] = temp_data[i];
}
 ary.push(results);   
 if(a == result.rows.length - 1){
     // console.log(ary);
    // console.log(temp_datas.length);
     let final_datas = [];
    for(let l = 0 ; l < temp_datas.length ; l++){
     for(let p = 0 ; p < ary.length ; p++){
        if(ary[p].SMU_UKEY == temp_datas[l].activity_ukey){
            // console.log(req.body.job_detail_id,temp_datas[l].activity_ukey);
            final_datas.push(temp_datas[l]);

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
    "UPDATE ESPD_OP_HDR set SMU_ACTIVITY_STATUS=:ac,SMU_DWNFLAG='Y',SMU_DWNFLAGDATE=:dfd, SM_ACTIVITY_STATDATE=:dfd, SMU_UPFLAGDATE=:upd WHERE SMU_JOBNO=:jn and SMU_UKEY=:uk and SMU_ACTIVITY_STATUS=:acd",
            {
                ac: 'PUSHED TO MOBILE',
                dfd: new Date(),
                upd: new Date(),
                jn : req.body.job_detail_id,
                uk : temp_datas[l].activity_ukey,
                acd : 'START'
            },
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
    }
    } 
    if(l == temp_datas.length - 1){
          // console.log("***************");
             var StateList = final_datas;
          if(StateList.length == 0 || req.body.search_string == ""){
            StateList = StateList.sort((a, b) => a.seqno > b.seqno ? 1 : -1);
            res.json({Status:"Success",Message:"group_detailModel List", Data : StateList ,Code:200});
          }else {
            // console.log("tesing 2");
          for(let a = 0 ; a  < StateList.length; a ++){
          var active_text = StateList[a].group_detail_name.toLowerCase();
          if(active_text.indexOf(keyword) !== -1 == true){
               final_data.push(StateList[a]);
          }
          if(a == StateList.length - 1){
             final_data = final_data.sort((a, b) => a.seqno > b.seqno ? 1 : -1);
             res.json({Status:"Success",Message:"group_detailModel List", Data : final_data ,Code:200});
          }
          }
          }
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












         
        // }).sort({index:1});
});



router.get('/getlist', function (req, res) {
        group_detailModel.find({}, function (err, Functiondetails) {
          res.json({Status:"Success",Message:"group_detailModel", Data : Functiondetails ,Code:200});
        }).sort({index:1});
});




router.get('/groupdetail_list_subgroup', function (req, res) {
        group_detailModel.find({sub_group_status:'true'}, function (err, Functiondetails) {
          res.json({Status:"Success",Message:"group_detailModel", Data : Functiondetails ,Code:200});
        }).sort({index:1});
});



router.get('/groupdetail_list_subgroup1', function (req, res) {
        group_detailModel.find({form_type:4}, function (err, Functiondetails) {
          res.json({Status:"Success",Message:"group_detailModel", Data : Functiondetails ,Code:200});
        }).sort({index:1});
});


router.get('/reload_data',async function (req, res) {
        var ref_code_details  =  await group_detailModel.find({}).sort({index:1});
        for(let a  = 0; a < ref_code_details.length ; a ++){
         let d = {
            index : a + 1
         }
         group_detailModel.findByIdAndUpdate(ref_code_details[a]._id, d, {new: true}, function (err, UpdatedDetails) {
            if (err) return res.json({Status:"Failed",Message:"Internal Server Error", Data : {},Code:500});
        });
         if(a == ref_code_details.length - 1){
            res.json({Status:"Success",Message:"group_detailModel Updated", Data : {} ,Code:200});
         }
        }

});


router.get('/reload_data2',async function (req, res) {
        var ref_code_details  =  await group_detailModel.find({}).sort({index:1});
        for(let a  = 0; a < ref_code_details.length ; a ++){
         let d = {
            delete_status : false,
         }
         group_detailModel.findByIdAndUpdate(ref_code_details[a]._id, d, {new: true}, function (err, UpdatedDetails) {
            if (err) return res.json({Status:"Failed",Message:"Internal Server Error", Data : {},Code:500});
        });
         if(a == ref_code_details.length - 1){
            res.json({Status:"Success",Message:"group_detailModel Updated", Data : {} ,Code:200});
         }
        }

});

router.post('/edit', function (req, res) {
        group_detailModel.findByIdAndUpdate(req.body._id, req.body, {new: true}, function (err, UpdatedDetails) {
            if (err) return res.json({Status:"Failed",Message:"Internal Server Error", Data : {},Code:500});
             res.json({Status:"Success",Message:"group_detailModel Updated", Data : UpdatedDetails ,Code:200});
        });
});


// // DELETES A USER FROM THE DATABASE
router.post('/admin_delete', function (req, res) {
      group_detailModel.findByIdAndRemove(req.body._id, function (err, user) {
          if (err) return res.json({Status:"Failed",Message:"Internal Server Error", Data : {},Code:500});
          res.json({Status:"Success",Message:"Job_no_managment Deleted successfully", Data : {} ,Code:200});
      });
});


// // DELETES A USER FROM THE DATABASE
router.post('/delete', function (req, res) {
      group_detailModel.findByIdAndRemove(req.body._id, function (err, user) {
          if (err) return res.json({Status:"Failed",Message:"Internal Server Error", Data : {},Code:500});
          res.json({Status:"Success",Message:"group_detailModel Deleted successfully", Data : {} ,Code:200});
      });
});
module.exports = router;
