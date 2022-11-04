var express = require('express');
var router = express.Router();
var bodyParser = require('body-parser');
router.use(bodyParser.urlencoded({ extended: false }));
router.use(bodyParser.json());
var Job_no_managmentModel = require('./../models/Job_no_managmentModel');
var data_store_managementModel = require('./../models/data_store_managementModel');
var user_management = require('./../models/user_managementModel');

var oracledb = require('oracledb');





router.post('/create', async function(req, res) {
  try{
        await Job_no_managmentModel.create({
  activedetail__id : req.body.activedetail__id || "",
  activedetail_id : req.body.activedetail__id || "",
  job_detail_no : req.body.job_detail_no || "",
  job_detail_created_at : req.body.job_detail_created_at || "",
  job_detail_update_at : req.body.job_detail_update_at || "",
  job_detail_created_by : req.body.job_detail_created_by || "",
  job_detail_updated_by : req.body.job_detail_updated_by || "",
  update_reason : req.body.update_reason || "",        }, 
        function (err, user) {
          // console.log(user)
        res.json({Status:"Success",Message:"Added successfully", Data : user ,Code:200}); 
        });
}
catch(e){
      res.json({Status:"Failed",Message:"Internal Server Error", Data : {},Code:500});
}
});


router.get('/deletes', function (req, res) {
      Job_no_managmentModel.remove({}, function (err, user) {
          if (err) return res.status(500).send("There was a problem deleting the user.");
             res.json({Status:"Success",Message:"Job_no_managment Deleted", Data : {} ,Code:200});     
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
              // console.log(result.metaData);
              // console.log(result.rows);
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
         let final_data = []; 
         var keyword = req.body.search_string.toLowerCase();
        Job_no_managmentModel.find({activedetail__id:req.body.activedetail__id}, function (err, StateList) {
          if(StateList.length == 0 || req.body.search_string == ""){
            res.json({Status:"Success",Message:"Job_no_managment List", Data : StateList ,Code:200});
          }else {
          for(let a = 0 ; a  < StateList.length; a ++){
          var active_text = StateList[a].job_detail_no.toLowerCase();
          if(active_text.indexOf(keyword) !== -1 == true){
               final_data.push(StateList[a]);
          }
          if(a == StateList.length - 1){
             res.json({Status:"Success",Message:"Job_no_managment List", Data : final_data ,Code:200});
          }
          }
          }
        });
});




router.post('/getlist_id1', function (req, res) {
    // console.log(req.body);
if(req.body.request_type == 'New'){
        let final_data = []; 
         var keyword = req.body.search_string.toLowerCase();
        Job_no_managmentModel.find({activedetail__id:req.body.activedetail__id}, function (err, StateList) {
          if(StateList.length == 0 || req.body.search_string == ""){
            res.json({Status:"Success",Message:"Job_no_managment List", Data : StateList ,Code:200});
          }else {
          for(let a = 0 ; a  < StateList.length; a ++){
          var active_text = StateList[a].job_detail_no.toLowerCase();
          if(active_text.indexOf(keyword) !== -1 == true){
               final_data.push(StateList[a]);
          }
          if(a == StateList.length - 1){
             res.json({Status:"Success",Message:"Job_no_managment List", Data : final_data ,Code:200});
          }
          }
          }
        });
} else {
      data_store_managementModel.find({user_id:req.body.user_id}, function (err, store_data) {
      let final_data = []; 
         var keyword = req.body.search_string.toLowerCase();
        Job_no_managmentModel.find({activedetail__id:req.body.activedetail__id}, function (err, StateList) {
          if(StateList.length == 0 || req.body.search_string == ""){
            if(store_data.length == 0){
                   // console.log("Testing 1");
                // final_data.push(StateList[a]);
                 res.json({Status:"Success",Message:"Job_no_managment List", Data : StateList ,Code:200});
            }else{
                // console.log("Testing 2");           
            for(let a = 0 ; a  < StateList.length; a ++){  
              for(let c = 0; c < store_data.length ; c++){
                // console.log(store_data[c].job_id,StateList[a]._id);
                 if(""+store_data[c].job_id == ""+StateList[a]._id){
                     final_data.push(StateList[a]);
                     // console.log("testing 3");
                 }
              }
              if(a == StateList.length - 1){
                 res.json({Status:"Success",Message:"Job_no_managment List", Data : final_data ,Code:200});
             }
          }
            }
          }else {
          for(let a = 0 ; a  < StateList.length; a ++){
          var active_text = StateList[a].job_detail_no.toLowerCase();
          if(active_text.indexOf(keyword) !== -1 == true){
            if(store_data.length == 0){
                final_data.push(StateList[a]);
            }else{
              for(let c = 0; c < store_data.length ; c++){
                 if(""+store_data[c].job_id == ""+StateList[a]._id){
                     final_data.push(StateList[a]);
                 }
              }
            }
          }
          if(a == StateList.length - 1){
             res.json({Status:"Success",Message:"Job_no_managment List", Data : final_data ,Code:200});
          }
          }
          }
        });
        });
}        
});




// router.post('/getlist_all', function (req, res) {
//       console.log(req.body);
//       if(req.body.request_type == "New"){
//          let final_data = []; 
//          var keyword = req.body.search_string.toLowerCase();
//         Job_no_managmentModel.find({}, function (err, StateList) {
//           if(StateList.length == 0 && req.body.search_string == ""){
//             res.json({Status:"Success",Message:"Job_no_managment List", Data : StateList ,Code:200});
//           }else {
//           for(let a = 0 ; a  < StateList.length; a ++){
//           var active_text = StateList[a].job_detail_no.toLowerCase();
//           if(active_text.indexOf(keyword) !== -1 == true){
//                final_data.push(StateList[a]);
//           }
//           if(a == StateList.length - 1){
//              res.json({Status:"Success",Message:"Job_no_managment List", Data : final_data ,Code:200});
//           }
//           }
//           }
//         });
//       }
//       else{

//          let final_data = []; 
//          var keyword = req.body.search_string.toLowerCase();
//          data_store_managementModel.find({"user_id":req.body.user_id,"storage_status": "Pause"}, function (err, StateList) {
//           console.log(StateList.length);
//           if(StateList.length == 0 && req.body.search_string == ""){
//             res.json({Status:"Success",Message:"Job_no_managment List", Data : StateList ,Code:200});
//           }else {
//           console.log("Test1");
//           console.log(StateList);
//           for(let a = 0 ; a  < StateList.length; a ++){
//           var active_text = StateList[a].job_id.job_detail_no.toLowerCase();
//           if(active_text.indexOf(keyword) !== -1 == true){
//                final_data.push(StateList[a]);
//           }
//           if(a == final_data.length - 1){
//               let final_datas = [];
//                for(let c  = 0; c < final_data.length; c ++){
//                 let d = {
//             "_id": final_data[c].job_id._id,
//             "activedetail__id": final_data[c].job_id.activedetail__id,
//             "job_detail_no": final_data[c].job_id.job_detail_no,
//             "job_detail_created_at": final_data[c].job_id.job_detail_created_at,
//             "job_detail_update_at": final_data[c].job_id.job_detail_update_at,
//             "job_detail_created_by": final_data[c].job_id.job_detail_created_by,
//             "job_detail_updated_by": final_data[c].job_id.job_detail_updated_by,
//             "update_reason":final_data[c].job_id.update_reason,
//             "__v": final_data[c].job_id.__v,
//             }
//             final_datas.push(d)
//             if( c == final_data.length - 1){
//                 res.json({Status:"Success",Message:"Job_no_managment List", Data : final_datas ,Code:200});
//             }

//                }             
//           }
//           }
//           }
//         }).populate('job_id');
//       }
// });


router.get('/getlist_all_test',async function (req, res) {
oracledb.getConnection({
      user: "JLSMART",
      password: "JLSMART",
      connectString: "(DESCRIPTION =(ADDRESS = (PROTOCOL = TCP)(HOST = 192.168.1.112)(PORT = 1521))(CONNECT_DATA =(SID = jlpl)))"
}, function(err, connection) {
if (err) {
    // console.error(err.message);
    return;
}
      // console.log("SELECT * FROM ESPD_OP_HDR WHERE SMU_TECHMOBNO='5754180487962' and SMU_ACTIVITY_STATUS<>'SUBMITTED'");
      connection.execute(
            "SELECT * FROM ESPD_OP_HDR WHERE SMU_TECHMOBNO='5754180487962' and SMU_ACTIVITY_STATUS<>'SUBMITTED'",
            {},
        {autoCommit: true},
        function (err, result) {
    if (err) { console.error(err.message);
          doRelease(connection);
          return;
     }
     // console.log(result.rows);
if(result.rows.length == 0) {
    res.json({Status:"Success",Message:"Job_no_managment List", Data : [] ,Code:200});
}
else {
var ary = [];
for(let a = 0 ; a < result.rows.length;a++){
var temp_data = result.rows[a];
var results = {};
for (var i = 0; i < result.metaData.length; ++i){
results[result.metaData[i].name] = temp_data[i];
}
 // console.log(results);
 ary.push(results);   
 if(a == result.rows.length - 1){
    // console.log(ary);
var final_result = [];
function getUniqueListBy(arr, key) {
    return [...new Map(arr.map(item => [item[key], item])).values()]
}
const arr1  = getUniqueListBy(ary, 'SMU_JOBNO');
// console.log(arr1);
arr1.forEach(element => {
  // console.log(element);
  let tem  = { 
        _id: element.SMU_JOBNO,
        activedetail__id : '61c55f858bc953743afdaa52',
        job_detail_no : element.SMU_JOBNO,
        "job_detail_created_at": "23-10-2021 11:00 AM",
        "job_detail_update_at": "",
        "job_detail_created_by": "Admin",
        "job_detail_updated_by": "",
        "update_reason": "",
        "activedetail_id":'61c55f858bc953743afdaa52',
    }
    final_result.push(tem);
});

           var StateList = final_result;
           if(StateList.length == 0 && req.body.search_string == ""){
            res.json({Status:"Success",Message:"Job_no_managment List", Data : StateList ,Code:200});
          }else {
          for(let a = 0 ; a  < StateList.length; a ++){
          var active_text = StateList[a].job_detail_no.toLowerCase();
          if(active_text.indexOf(keyword) !== -1 == true){
               final_data.push(StateList[a]);
          }
          if(a == StateList.length - 1){
             res.json({Status:"Success",Message:"Job_no_managment List", Data : final_data ,Code:200});
          }
          }
          }


   // res.json({Status:"Success",Message:"Respose Data", Data : ary ,Code:200});
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






router.post('/getlist_all',async function (req, res) {
      var Final_Data = [];
      // console.log(req.body);
      var user_management_detail = await user_management.findOne({_id:req.body.user_id});
      // console.log(user_management_detail);
      if(req.body.request_type == "New"){
         let final_data = []; 
         var keyword = req.body.search_string.toLowerCase();
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
            "SELECT * FROM ESPD_OP_HDR WHERE SMU_TECHMOBNO=:fn and SMU_ACTIVITY_STATUS<>:status",
            {fn:""+user_management_detail.user_id,status:'SUBMITTED'},
        {autoCommit: true},
        function (err, result) {
    if (err) { console.error(err.message);
          doRelease(connection);
          return;
     }
     // console.log(result.rows);
if(result.rows.length == 0) {
    res.json({Status:"Success",Message:"Job_no_managment List", Data : [] ,Code:200});
}
else {
var ary = [];
for(let a = 0 ; a < result.rows.length;a++){
var temp_data = result.rows[a];
var results = {};
for (var i = 0; i < result.metaData.length; ++i){
results[result.metaData[i].name] = temp_data[i];
}
 // console.log(results);
 ary.push(results);   
 if(a == result.rows.length - 1){
    // console.log(ary);
var final_result = [];
function getUniqueListBy(arr, key) {
    return [...new Map(arr.map(item => [item[key], item])).values()]
}
const arr1  = getUniqueListBy(ary, 'SMU_JOBNO');
// console.log(arr1);
arr1.forEach(element => {
  // console.log(element);
  let tem  = { 
        _id: element.SMU_JOBNO,
        activedetail__id : '61c55f858bc953743afdaa52',
        job_detail_no : element.SMU_JOBNO,
        "job_detail_created_at": "23-10-2021 11:00 AM",
        "job_detail_update_at": "",
        "job_detail_created_by": "Admin",
        "job_detail_updated_by": "",
        "update_reason": "",
        "activedetail_id":'61c55f858bc953743afdaa52',
    }
    final_result.push(tem);
});

           var StateList = final_result;
           if(StateList.length == 0 && req.body.search_string == ""){
            res.json({Status:"Success",Message:"Job_no_managment List", Data : StateList ,Code:200});
          }else {
          for(let a = 0 ; a  < StateList.length; a ++){
          var active_text = StateList[a].job_detail_no.toLowerCase();
          if(active_text.indexOf(keyword) !== -1 == true){
               final_data.push(StateList[a]);
          }
          if(a == StateList.length - 1){
             res.json({Status:"Success",Message:"Job_no_managment List", Data : final_data ,Code:200});
          }
          }
          }


   // res.json({Status:"Success",Message:"Respose Data", Data : ary ,Code:200});
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
        
      }

      else{
         let final_data = []; 
         var keyword = req.body.search_string.toLowerCase();
         data_store_managementModel.find({"user_id":req.body.user_id,"storage_status": "Pause"}, function (err, StateList) {
          // console.log(StateList.length);
          if(StateList.length == 0 && req.body.search_string == ""){
            res.json({Status:"Success",Message:"Job_no_managment List", Data : StateList ,Code:200});
          }else {
          // console.log("Test1");
          // console.log(StateList);
          for(let a = 0 ; a  < StateList.length; a ++){
          var active_text = StateList[a].job_id.job_detail_no.toLowerCase();
          if(active_text.indexOf(keyword) !== -1 == true){
               final_data.push(StateList[a]);
          }
          if(a == final_data.length - 1){
              let final_datas = [];
               for(let c  = 0; c < final_data.length; c ++){
                let d = {
            "_id": final_data[c].job_id._id,
            "activedetail__id": final_data[c].job_id.activedetail__id,
            "job_detail_no": final_data[c].job_id.job_detail_no,
            "job_detail_created_at": final_data[c].job_id.job_detail_created_at,
            "job_detail_update_at": final_data[c].job_id.job_detail_update_at,
            "job_detail_created_by": final_data[c].job_id.job_detail_created_by,
            "job_detail_updated_by": final_data[c].job_id.job_detail_updated_by,
            "update_reason":final_data[c].job_id.update_reason,
            "__v": final_data[c].job_id.__v,
            }
            final_datas.push(d)
            if( c == final_data.length - 1){
                res.json({Status:"Success",Message:"Job_no_managment List", Data : final_datas ,Code:200});
            }

               }             
          }
          }
          }
        }).populate('job_id');
      }
});


router.post('/fetch_by_id', function (req, res) {
    // console.log(req.body.activedetail__id);
        Job_no_managmentModel.find({activedetail__id : req.body.activedetail__id}, function (err, Functiondetails) {
          res.json({Status:"Success",Message:"Job_no_managment", Data : Functiondetails ,Code:200});
        });
});




router.post('/fetch_address', function (req, res) {
    console.log(req.body);
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
            "SELECT DBSOM_GET_JLSMARTADDR(:ln,'OI') FROM ESPD_OP_HDR",
            {ln:req.body.job_no},
        {autoCommit: true},
        function (err, result) {
    if (err) { console.error(err.message);
          doRelease(connection);
          return;
     }
    const myArray = result.rows[0][0].split("\n");
    res.json({Status:"Success",Message:"Respose Data", Data : myArray ,Code:200});
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


router.post('/fetch_rm_info', function (req, res) {
    // console.log(req.body);
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
            "SELECT ST_MDH_SEQNO, ST_MDH_DCNO, ST_MDH_DCDT, ST_MDH_STATUS, ST_MDH_VEHICLENO, ST_MDH_GPNO, ST_MDH_GPDT, ST_MDH_BILLTO FROM ST_MATLDESPATCH_HDR WHERE ST_MDH_JOBNO=:ln",
            {ln:req.body.job_no},
        {autoCommit: true},
        function (err, reports) {
    if (err) { console.error(err.message);
          doRelease(connection);
          return;
     }
var ary = [];
for(let a = 0 ; a < reports.rows.length;a++){
var temp_data = reports.rows[a];
var results = {}
for (var i = 0; i < reports.metaData.length; ++i){
results[reports.metaData[i].name] = temp_data[i];
}
 // console.log(results);
 ary.push(results);   
 if(a == reports.rows.length - 1){
    // console.log(ary[0]);
    res.json({Status:"Success",Message:"Respose Data", Data : ary[0], Code:200});
 
 }
}
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



router.post('/fetch_rm_info_single', function (req, res) {
    // console.log("888888888888",req.body);
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
            "SELECT ST_MDH_SEQNO, ST_MDH_DCNO, ST_MDH_DCDT, ST_MDH_STATUS, ST_MDH_VEHICLENO, ST_MDH_GPNO, ST_MDH_GPDT, ST_MDH_BILLTO FROM ST_MATLDESPATCH_HDR WHERE ST_MDH_JOBNO=:ln and ST_MDH_SEQNO=:ST_MDH_SEQNO",
            {ln:req.body.job_no,
                ST_MDH_SEQNO : req.body.ST_MDH_SEQNO},
        {autoCommit: true},
        function (err, reports) {
    if (err) { console.error(err.message);
          doRelease(connection);
          return;
     }
var ary = [];
for(let a = 0 ; a < reports.rows.length;a++){
var temp_data = reports.rows[a];
var results = {}
for (var i = 0; i < reports.metaData.length; ++i){
results[reports.metaData[i].name] = temp_data[i];
}
 // console.log(results);
 ary.push(results);   
 if(a == reports.rows.length - 1){
    // console.log(ary[0]);
    res.json({Status:"Success",Message:"Respose Data", Data : ary[0], Code:200});
 
 }
}
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




router.post('/fetch_rm_info_list', function (req, res) {
    // console.log(req.body);
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
            "SELECT ST_MDH_SEQNO, ST_MDH_DCNO, ST_MDH_DCDT, ST_MDH_STATUS, ST_MDH_VEHICLENO, ST_MDH_GPNO, ST_MDH_GPDT, ST_MDH_BILLTO FROM ST_MATLDESPATCH_HDR WHERE ST_MDH_JOBNO=:ln",
            {ln:req.body.job_no},
        {autoCommit: true},
        function (err, reports) {
    if (err) { console.error(err.message);
          doRelease(connection);
          return;
     }
var ary = [];
for(let a = 0 ; a < reports.rows.length;a++){
var temp_data = reports.rows[a];
var results = {}
for (var i = 0; i < reports.metaData.length; ++i){
results[reports.metaData[i].name] = temp_data[i];
}
 // console.log(results);
 ary.push(results);   
 if(a == reports.rows.length - 1){
    // console.log(ary[0]);
    res.json({Status:"Success",Message:"Respose Data", Data : ary, Code:200});
 
 }
}
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





router.post('/get_jobdetail_by_activtiy',async function (req, res) {
 // console.log(req.body);
 // req.body.SMU_TECHMOBNO = '9043456963';
 // req.body.SMU_UKEY = "ESPD-ACT1";
 console.log(req.body);
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
            "SELECT * FROM ESPD_OP_HDR WHERE SMU_UKEY=:SMU_UKEY and SMU_TECHMOBNO=:SMU_TECHMOBNO and SMU_ACTIVITY_STATUS<>:SMU_ACTIVITY_STATUS",
            {
                SMU_TECHMOBNO:req.body.SMU_TECHMOBNO,
                SMU_UKEY:req.body.SMU_UKEY,
                SMU_ACTIVITY_STATUS : 'SUBMITTED'
            },
        {autoCommit: true},
        function (err, reports) {
    if (err) { console.error(err.message);
          doRelease(connection);
          return;
     }
var ary = [];

if(reports.rows.length == 0){

res.json({Status:"Success",Message:"No Record Found", Data : [], Code:200});

}
else{

for(let a = 0 ; a < reports.rows.length;a++){
var temp_data = reports.rows[a];
var results = {}
for (var i = 0; i < reports.metaData.length; ++i){
results[reports.metaData[i].name] = temp_data[i];
}
 // console.log(results);
 ary.push(results);  
 if(a == reports.rows.length - 1){
    let temp_data = [];
    ary.forEach(element => {
     let tem =  {
            "_id": "61c561a83c5cfc7d49dfa1fc",
            "activedetail__id": "61c55f858bc953743afdaa52",
            "job_detail_no": element.SMU_JOBNO,
            "job_detail_created_at": "23-10-2021 11:00 AM",
            "job_detail_update_at": "",
            "job_detail_created_by": "Admin",
            "job_detail_updated_by": "",
            "update_reason": "",
            "__v": 0,
            "activedetail_id": "61c55f858bc953743afdaa52"
    }
    temp_data.push(tem)
    });
    res.json({Status:"Success",Message:"Respose Data", Data : temp_data, Code:200});
 
 }
}
}
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








router.get('/getlist', function (req, res) {
        Job_no_managmentModel.find({}, function (err, Functiondetails) {
          res.json({Status:"Success",Message:"Job_no_managment", Data : Functiondetails ,Code:200});
        }).populate('activedetail_id');
});


router.post('/edit', function (req, res) {
        Job_no_managmentModel.findByIdAndUpdate(req.body._id, req.body, {new: true}, function (err, UpdatedDetails) {
            if (err) return res.json({Status:"Failed",Message:"Internal Server Error", Data : {},Code:500});
             res.json({Status:"Success",Message:"Job_no_managment Updated", Data : UpdatedDetails ,Code:200});
        });
});



// // DELETES A USER FROM THE DATABASE
router.post('/admin_delete', function (req, res) {
      Job_no_managmentModel.findByIdAndRemove(req.body._id, function (err, user) {
          if (err) return res.json({Status:"Failed",Message:"Internal Server Error", Data : {},Code:500});
          res.json({Status:"Success",Message:"Job_no_managment Deleted successfully", Data : {} ,Code:200});
      });
});


// // DELETES A USER FROM THE DATABASE
router.post('/delete', function (req, res) {
      Job_no_managmentModel.findByIdAndRemove(req.body._id, function (err, user) {
          if (err) return res.json({Status:"Failed",Message:"Internal Server Error", Data : {},Code:500});
          res.json({Status:"Success",Message:"Job_no_managment Deleted successfully", Data : {} ,Code:200});
      });
});



module.exports = router;
