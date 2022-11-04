var express = require('express');
var router = express.Router();
var bodyParser = require('body-parser');
router.use(bodyParser.urlencoded({ extended: false }));
router.use(bodyParser.json());
var joininspectionModel = require('./../models/joininspectionModel');
var group_detailModel = require('./../models/group_detailModel');
var field_managementModel = require('./../models/field_managementModel');
var user_management = require('./../models/user_managementModel');
var oracledb = require('oracledb');
var request = require("request");
var temp_data_storedataModel = require('./../models/temp_data_storedataModel');




router.post('/create', async function(req, res) {
var final_grouplist = [];
console.log(req.body.work_status);
console.log("***********YHUHY*******");
var user_detail = await user_management.findOne({_id:req.body.user_id});
req.body.user_id = user_detail._id;
// console.log("Normal Count",req.body.Data.length);
// console.log(req.body.work_status);
if(req.body.Data.length)
if(req.body.work_status == 'PENDING'){
var final_value = [];
var count_value = req.body.Data.length;
for(let c = 0;c < count_value; c++){
    if(req.body.Data[c].field_value !== 'OK'){
      final_value.push(req.body.Data[c]); 
    }
    if(c == count_value - 1){
      // console.log(final_value.length);
      req.body.Data == final_value;
      call_value(final_value);
    }
}
} else {
   call_value(req.body.Data);
}

// call_value();
async function call_value(datas) {
    // body...
// console.log('Tree 11')
req.body.Data = datas;
console.log(req.body.Data.length);
  try{
        await joininspectionModel.create({
              user_id :  req.body.user_id || "",
              activity_id : req.body.activity_id || "",
              job_id : req.body.job_id || "",
              group_id :'629ede01886f5404a75d4a91' || "",
              sub_group_id : req.body.sub_group_id || "",
              data_store : req.body.Data,
              work_status : req.body.work_status || "Not Started",
              work_time : [],
              start_time : req.body.start_time || "",
              pause_time : req.body.pause_time || "",
              stop_time : req.body.stop_time || "",
              storage_status : req.body.storage_status || "",
              date_of_create : req.body.date_of_create || "",
              date_of_update : req.body.date_of_update || "",
              created_by : req.body.created_by || "",
              updated_by : req.body.updated_by || "",
              update_reason : req.body.update_reason || "",
        }, 
        function (err, user) {
          console.log(err);
          if(req.body.work_status == 'PENDING' || req.body.work_status == 'SUBMITTED'){
              request.post(
              'http://smart.johnsonliftsltd.com:3000/api/activity/updatejointinspection_count',
              { json: {SMU_SERVJI_MOBNO : user_detail.user_id,SMU_JOBNO:req.body.job_id} },
              function (error, response, body) {
              if (!error && response.statusCode == 200) {
              }
              }
              );
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
    "UPDATE ESPD_OP_HDR set SMU_ACTIVITY_STATUS=:ac,SM_ACTIVITY_STATDATE=:dfd WHERE SMU_JOBNO=:jn and SMU_UKEY=:uk and SMU_TECHMOBNO=:SMU_TECHMOBNO",
            {
                ac: req.body.work_status,
                dfd: new Date(),
                jn : req.body.job_id,
                uk : 'OP-ACT8S',
                SMU_TECHMOBNO :  user_detail.user_id
            },
        {autoCommit: true},
        function (err, result) {
    if (err) { console.error(err.message);
          doRelease(connection);
          return;
     }

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
      "UPDATE ESPD_OP_HDR set SMU_ACTIVITY_STATUS=:ac,SM_ACTIVITY_STATDATE=:dfd WHERE SMU_JOBNO=:jn and SMU_UKEY=:uk",
            {
                ac: 'ESUBMITTED',
                dfd: new Date(),
                jn : req.body.job_id,
                uk : 'OP-ACT8',
            },
        {autoCommit: true},
        function (err, result) {
    if (err) { console.error(err.message);
          doRelease(connection);
          return;
     }
     // res.json({Status:"Success",Message:"Added successfully", Data : {} ,Code:200}); 
     // doRelease(connection);
   });
    });
     res.json({Status:"Success",Message:"Added successfully", Data : {} ,Code:200}); 
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
  } else {
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
    "UPDATE ESPD_OP_HDR set SMU_ACTIVITY_STATUS=:ac,SM_ACTIVITY_STATDATE=:dfd WHERE SMU_JOBNO=:jn and SMU_UKEY=:uk and SMU_TECHMOBNO=:SMU_TECHMOBNO",
            {
                ac: 'ESUBMITTED',
                dfd: new Date(),
                jn : req.body.job_id,
                uk : 'OP-ACT8',
                SMU_TECHMOBNO :  user_detail.user_id
            },
        {autoCommit: true},
        function (err, result) {
    if (err) { console.error(err.message);
          doRelease(connection);
          return;
     }
     res.json({Status:"Success",Message:"Added successfully", Data : {} ,Code:200}); 
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
}
catch(e){
      res.json({Status:"Failed",Message:"Internal Server Error", Data : {},Code:500});
}



}

});



router.post('/create_local_value',async function(req, res) {

   // console.log("*********** Joint Inspection ************");
   // console.log(req.body.Data.length);
var datas = await temp_data_storedataModel.findOne({job_id: req.body.job_id,group_id:req.body.group_id,user_id :req.body.user_id});
// console.log(datas);
if(datas == null){
    try{
  await temp_data_storedataModel.create({
  job_id: req.body.job_id || "",
  group_id : req.body.group_id || "",
  user_id :req.body.user_id || "",
  datas : [req.body]
        }, 
        function (err, user) {
        res.json({Status:"Success",Message:"Added successfully", Data : {} ,Code:200}); 
        });
}
catch(e){
      res.json({Status:"Failed",Message:"Internal Server Error", Data : {},Code:500});
}
}
else {
  let datasss = {
  job_id: req.body.job_id || "",
  group_id : req.body.group_id || "",
  user_id :req.body.user_id || "",
  datas : [req.body]
  }
  temp_data_storedataModel.findByIdAndUpdate(datas._id, datasss, {new: true}, function (err, UpdatedDetails) {
            if (err) return res.json({Status:"Failed",Message:"Internal Server Error", Data : {},Code:500});
             res.json({Status:"Success",Message:"Functiondetails Updated", Data : UpdatedDetails ,Code:200});
  });
}
});




router.get('/get_temp_store',async function(req, res) {
    var datas = await temp_data_storedataModel.findOne({});
    res.json({Status:"Success",Message:"Functiondetails Updated", Data : datas ,Code:200});
});



router.post('/fetch_saved_data',async function(req, res) {
    var datas = await temp_data_storedataModel.findOne({job_id: req.body.job_id,group_id:req.body.group_id,user_id :req.body.user_id});
    res.json({Status:"Success",Message:"Joininspection", Data : datas.datas[0].Data, work_status : "Not Submitted", Code:200}); 
});




router.post('/opactscreate', async function(req, res) {
          console.log('********************************');
          console.log('*',req.body);
var final_grouplist = [];
var group_list = await group_detailModel.find({});
  try{
        await joininspectionModel.create({
              user_id :  req.body.user_id || "",
              activity_id : req.body.activity_id || "",
              job_id : req.body.job_id || "",
              group_id :'629ede01886f5404a75d4a91' || "",
              sub_group_id : req.body.sub_group_id || "",
              data_store : req.body.Data,
              work_status : req.body.work_status || "Not Started",
              work_time : [],
              start_time : req.body.start_time || "",
              pause_time : req.body.pause_time || "",
              stop_time : req.body.stop_time || "",
              storage_status : req.body.storage_status || "",
              date_of_create : req.body.date_of_create || "",
              date_of_update : req.body.date_of_update || "",
              created_by : req.body.created_by || "",
              updated_by : req.body.updated_by || "",
              update_reason : req.body.update_reason || "",
        }, 
        function (err, user) {
          console.log(err);
          // console.log(user)
        res.json({Status:"Success",Message:"Added successfully", Data : {} ,Code:200}); 
        });
}
catch(e){
      res.json({Status:"Failed",Message:"Internal Server Error", Data : {},Code:500});
}
});





router.post('/delete_by_job_no',async function (req, res) {
    var group_list = await joininspectionModel.find({job_id:req.body.job_id});
    console.log(group_list.length);
    for(let a  = 0; a < group_list.length; a++){
      joininspectionModel.findByIdAndRemove(group_list[a]._id, function (err, user) {
           // console.log(user);
          if (err) return res.json({Status:"Failed",Message:"Internal Server Error", Data : {},Code:500});
      });
              if(a == group_list.length - 1){
                res.json({Status:"Success",Message:"Deleted successfully", Data : {} ,Code:200});
              }
    }
});







router.post('/form_5_create', async function(req, res) {
  var final_data = req.body.Data.material_details;
  let a = {"accepts":0,"demage":0,"desc_qty":0,"excess":0,"material_desc":""+req.body.Data.remarks,"part_no":"remarks","shortage":0};
  final_data.push(a);
  console.log("********* Final Data ********",final_data);
  req.body.Data = final_data;
var final_grouplist = [];
var group_list = await group_detailModel.find({});
console.log(group_list);
group_list.forEach(element => {
  let c = {
      "group_id":element._id,
      "group_name":"",
      "group_data":[]
     }
  final_grouplist.push(c)
});
  var data_store_detail = await joininspectionModel.findOne({
              user_id :  req.body.user_id,
              activity_id : req.body.activity_id,
              job_id : req.body.job_id,
  });
  console.log(data_store_detail,"Existing");
  if(data_store_detail == null){
  let data_stru = final_grouplist;
   data_stru.forEach(element => {
    if(element.group_id == req.body.group_id){
      element.group_data = req.body.Data;
    }
   });
  try{
        await joininspectionModel.create({
              user_id :  req.body.user_id || "",
              activity_id : req.body.activity_id || "",
              job_id : req.body.job_id || "",
              group_id : req.body.group_id || "",
              sub_group_id : req.body.sub_group_id || "",
              data_store : data_stru,
              work_status : req.body.work_status || "Not Started",
              work_time : [],
              start_time : req.body.start_time || "",
              pause_time : req.body.pause_time || "",
              stop_time : req.body.stop_time || "",
              storage_status : req.body.storage_status || "",
              date_of_create : req.body.date_of_create || "",
              date_of_update : req.body.date_of_update || "",
              created_by : req.body.created_by || "",
              updated_by : req.body.updated_by || "",
              update_reason : req.body.update_reason || "",
        }, 
        function (err, user) {
          console.log(err);
          console.log(user)
        res.json({Status:"Success",Message:"Added successfully", Data : {} ,Code:200}); 
        });
}
catch(e){
      res.json({Status:"Failed",Message:"Internal Server Error", Data : {},Code:500});
}
  }
  else{
    data_store_detail.data_store.forEach(element => {
    if(element.group_id == req.body.group_id){
      element.group_data = req.body.Data;
    }
   });
    let c = {
      data_store : data_store_detail.data_store
    }
     joininspectionModel.findByIdAndUpdate(data_store_detail._id, c, {new: true}, function (err, UpdatedDetails) {
            if (err) return res.json({Status:"Failed",Message:"Internal Server Error", Data : {},Code:500});
             res.json({Status:"Success",Message:"Functiondetails Updated", Data : {} ,Code:200});
    });
  }
});





router.post('/create_one', async function(req, res) {
  try{
        await joininspectionModel.create({
              user_id :  req.body.user_id || "",
              activity_id : req.body.activity_id || "",
              job_id : req.body.job_id || "",
              group_id : req.body.group_id || "",
              sub_group_id : req.body.sub_group_id || "",
              data_store : [],
              data_store_one : req.body.data_store_one || [],
              data_store_two : [],
              work_status : req.body.work_status || "Not Started",
              start_time : req.body.start_time || "",
              pause_time : req.body.pause_time || "",
              total_work_time : 0,
              stop_time : req.body.stop_time || "",
              storage_status : req.body.storage_status || "",
              date_of_create : req.body.date_of_create || "",
              date_of_update : req.body.date_of_update || "",
              created_by : req.body.created_by || "",
              updated_by : req.body.updated_by || "",
              update_reason : req.body.update_reason || "",
        }, 
        function (err, user) {
          console.log(err);
          console.log(user)
        res.json({Status:"Success",Message:"Added successfully", Data : user ,Code:200}); 
        });
}
catch(e){
      res.json({Status:"Failed",Message:"Internal Server Error", Data : {},Code:500});
}
});


router.post('/create_two', async function(req, res) {
  try{
        await joininspectionModel.create({
              user_id :  req.body.user_id || "",
              activity_id : req.body.activity_id || "",
              job_id : req.body.job_id || "",
              group_id : req.body.group_id || "",
              sub_group_id : req.body.sub_group_id || "",
              data_store : [],
              data_store_one : [],
              data_store_two : req.body.data_store_two ,
              work_status : req.body.work_status || "Not Started",
              start_time : req.body.start_time || "",
              pause_time : req.body.pause_time || "",
              stop_time : req.body.stop_time || "",
              storage_status : req.body.storage_status || "",
              date_of_create : req.body.date_of_create || "",
              date_of_update : req.body.date_of_update || "",
              created_by : req.body.created_by || "",
              updated_by : req.body.updated_by || "",
              update_reason : req.body.update_reason || "",
        }, 
        function (err, user) {
          console.log(err);
          console.log(user)
        res.json({Status:"Success",Message:"Added successfully", Data : user ,Code:200}); 
        });
}
catch(e){
      res.json({Status:"Failed",Message:"Internal Server Error", Data : {},Code:500});
}
});



router.post('/getlist_id',async function (req, res) {
 req.body.group_id = '629ede01886f5404a75d4a91';
  // group_id : req.body.group_id,
  // sub_group_id : req.body.sub_group_id,
 Final_datas = [];
 var data_store_detail = await joininspectionModel.findOne({
              group_id : req.body.group_id,
              // sub_group_id : req.body.sub_group_id,
              job_id : req.body.job_id
  }).sort({_id:-1});
 if(data_store_detail == null){
  console.log("NEW");
 field_managementModel.find({ 
          group_id : req.body.group_id,
          // sub_group_id : req.body.sub_group_id,
        }, function (err, StateList) {
         Final_datas = StateList;
         console.log(Final_datas.length);
         res.json({Status:"Success",Message:"Joininspection", Data : Final_datas, work_status : "Not Submitted", Code:200});
         // var temp_data = [];
         // for(let a  = 0 ; a < 15; a++){
         //    temp_data.push(Final_datas[a]);
         //    if(a == 14){
         //      res.json({Status:"Success",Message:"Joininspection", Data : temp_data, work_status : "Not Submitted", Code:200});
         //    }
         // }        
     });
 } else {
    console.log("OLD");
   Final_datas = data_store_detail.data_store;
   // Final_datas.sort((a, b) => a.field_value.localeCompare(b.field_value))
   res.json({Status:"Success",Message:"Joininspection", Data : Final_datas , work_status : data_store_detail.work_status, Code:200});
 }
});



router.post('/getlist_id_test',async function (req, res) {
 console.log(req.body);

 req.body.group_id = '629ede01886f5404a75d4a91';
  // group_id : req.body.group_id,
  // sub_group_id : req.body.sub_group_id,
 Final_datas = [];
 var data_store_detail = await joininspectionModel.findOne({
              group_id : req.body.group_id,
              // sub_group_id : req.body.sub_group_id,
              job_id : req.body.job_id
  }).sort({_id:-1});


 console.log(data_store_detail);
 if(data_store_detail == null){
  console.log("NEW");
 field_managementModel.find({ 
          group_id : req.body.group_id,
          // sub_group_id : req.body.sub_group_id,
        }, function (err, StateList) {
         Final_datas = StateList;
         console.log(Final_datas);
         Final_datas.forEach(element => {    
           if(element.index == 0){
            element.index = Final_datas.length;
           }
           element.field_comments = "S.No : " + element.index +" "+ element.field_comments;
         });
           Final_datas = Final_datas.sort((a, b) => a.index > b.index ? 1 : -1);
           


         //  var temp_data = [];
         // for(let a  = 0 ; a < 15; a++){
         //    temp_data.push(Final_datas[a]);
         //    if(a == 14){
         //      console.log(temp_data.length);
         //      res.json({Status:"Success",Message:"Joininspection", Data : temp_data, work_status : "Not Submitted", Code:200});
         //    }
         // }   
         res.json({Status:"Success",Message:"Joininspection", Data : Final_datas, work_status : "Not Submitted", Code:200});      
     });
 } else {
console.log("OLD");
var numberlist = [];
   Final_datas = data_store_detail.data_store;
 
   if (Final_datas.length % 6 == 0)
   {
    Final_datas.splice(Final_datas.length - 1);
   }
   if(Final_datas.length < 6 && Final_datas.length > 4){
    Final_datas.push(Final_datas[Final_datas.length - 1]);
   }
   // console.log(Final_datas.length);
    // var temp_data = [];
    //      for(let a  = 0 ; a < Final_datas.length; a++){
    //         temp_data.push(Final_datas[a]);
    //         if(a == Final_datas.length - 1){
    //           console.log(temp_data.length);
    //           res.json({Status:"Success",Message:"Joininspection", Data : temp_data, work_status : "Not Submitted", Code:200});
    //         }
    //      } 


      Final_datas.forEach(element => {    
           if(element.index == 0){
            element.index = Final_datas.length;
           }

           element.field_comments = "S.No : " + element.index +" "+ element.field_comments;
         });
           



   res.json({Status:"Success",Message:"Joininspection", Data : Final_datas , work_status : data_store_detail.work_status, Code:200});
 }
});


// router.get('/deletes', function (req, res) {
//       joininspectionModel.remove({}, function (err, user) {
//           if (err) return res.status(500).send("There was a problem deleting the user.");
//              res.json({Status:"Success",Message:"joininspectionModel Deleted", Data : {} ,Code:200});     
//       });
// });




router.post('/check_data_store', function (req, res) {
        joininspectionModel.findOne({
          user_id :  req.body.user_id,
          activity_id : req.body.activity_id,
          job_id : req.body.job_id,
        }, function (err, StateList) {
           if(StateList == null){
           let final_output = {
              work_status : "",
              start_time : "",
              pause_time :  "",
           }
           res.json({Status:"Success",Message:"Storage List", Data : final_output ,Code:200});
           }else{
            let final_output = {
              work_status :StateList.work_status,
              start_time : StateList.start_time || "",
              pause_time : StateList.pause_time || "",
           }
           res.json({Status:"Success",Message:"Storage List", Data : final_output ,Code:200});
           }
        });
});



router.post('/start_work',async function (req, res) {
  
var final_grouplist = [];
var group_list = await group_detailModel.find({});
group_list.forEach(element => {
  let c = {
      "group_id":element._id,
      "group_name":"",
      "group_data":[]
     }
  final_grouplist.push(c)
});
  let data_stru = final_grouplist;
   data_stru.forEach(element => {
    if(element.group_id == req.body.group_id){
      element.group_data = req.body.Data;
    }
   });
  try{
        await joininspectionModel.create({
              user_id :  req.body.user_id || "",
              activity_id : req.body.activity_id || "",
              job_id : req.body.job_id || "",
              group_id : req.body.group_id || "",
              sub_group_id : req.body.sub_group_id || "",
              data_store : data_stru,
              work_status : "Started",
              work_time : [],
              start_time : req.body.start_time || "",
              pause_time : req.body.pause_time || "",
              stop_time : req.body.stop_time || "",
              storage_status : req.body.storage_status || "",
              date_of_create : req.body.date_of_create || "",
              date_of_update : req.body.date_of_update || "",
              created_by : req.body.created_by || "",
              updated_by : req.body.updated_by || "",
              update_reason : req.body.update_reason || "",
        }, 
        function (err, user) {
          console.log(err);
          console.log(user)
        res.json({Status:"Success",Message:"Added successfully", Data : {} ,Code:200}); 
        });
}
catch(e){
      res.json({Status:"Failed",Message:"Internal Server Error", Data : {},Code:500});
}
});





router.post('/pause_job', function (req, res) {
        joininspectionModel.findOne({
          user_id :  req.body.user_id,
          activity_id : req.body.activity_id,
          job_id : req.body.job_id,
        },function (err, StateList){
          console.log(StateList.work_time);
          if(StateList.work_time.length == 0){
        let time_array = {
           start_time : StateList.start_time,
           end_time : req.body.pause_time,
           no_of_hrs_work : 0
         }
        StateList.work_time.push(time_array);
        let data = {
          work_time : StateList.work_time,
          pause_time : req.body.pause_time || "",
          work_status : "Paused",
        }
        joininspectionModel.findByIdAndUpdate(StateList._id, data, {new: true}, function (err, UpdatedDetails) {
            if (err) return res.json({Status:"Failed",Message:"Internal Server Error", Data : {},Code:500});
             res.json({Status:"Success",Message:"Functiondetails Updated", Data : UpdatedDetails ,Code:200});
        });
          }
        else {
        StateList.work_time[StateList.work_time.length - 1].end_time = req.body.pause_time;
        let data = {
          work_time : StateList.work_time,
          pause_time : req.body.pause_time || "",
          work_status : "Paused",
        }
        joininspectionModel.findByIdAndUpdate(StateList._id, data, {new: true}, function (err, UpdatedDetails) {
            if (err) return res.json({Status:"Failed",Message:"Internal Server Error", Data : {},Code:500});
             res.json({Status:"Success",Message:"Functiondetails Updated", Data : UpdatedDetails ,Code:200});
        });
          }
        });
});




router.post('/resume_job', function (req, res) {
        joininspectionModel.findOne({
          user_id :  req.body.user_id,
          activity_id : req.body.activity_id,
          job_id : req.body.job_id,
        },function (err, StateList){
          console.log(StateList.work_time);
        let time_array = {
           start_time : req.body.resume_time,
           end_time : '',
           no_of_hrs_work : 0
         }
        StateList.work_time.push(time_array);
        let data = {
          work_time : StateList.work_time,
          work_status : "Resumed",
        }
        joininspectionModel.findByIdAndUpdate(StateList._id, data, {new: true}, function (err, UpdatedDetails) {
            if (err) return res.json({Status:"Failed",Message:"Internal Server Error", Data : {},Code:500});
             res.json({Status:"Success",Message:"Functiondetails Updated", Data : UpdatedDetails ,Code:200});
        });
        });
});



router.post('/stop_job', function (req, res) {
        joininspectionModel.findOne({
          user_id :  req.body.user_id,
          activity_id : req.body.activity_id,
          job_id : req.body.job_id,
        },function (err, StateList){
        console.log(StateList.work_time);

        let total_work_time = 0;
        for(let a  = 0; a < StateList.work_time.length ; a++){
            var date1 = StateList.work_time[a].start_time;
            var date2 = StateList.work_time[a].end_time;
            console.log(StateList.work_time[a].start_time);
            console.log(StateList.work_time[a].end_time);
const convertTime = timeStr => {
   const [time, modifier] = timeStr.split(' ');
   let [hours, minutes] = time.split(':');
   if (hours === '12') {
      hours = '00';
   }
   if (modifier === 'PM') {
      hours = parseInt(hours, 10) + 12;
   }
   return `${hours}:${minutes}`;
};
            var date = StateList.work_time[a].start_time.split(' ');
            var splitdate = date[0].split('-');
            var convert_time = convertTime(date[1]);
            var final_date_start = splitdate[2]+"-"+splitdate[1]+"-"+splitdate[0]+"T"+convert_time+":00.000Z";
            console.log(final_date_start);
            var date1 = StateList.work_time[a].end_time.split(' ');
            var splitdate1 = date1[0].split('-');
            var convert_time1 = convertTime(date1[1]);
            var final_date_end = splitdate1[2]+"-"+splitdate1[1]+"-"+splitdate1[0]+"T"+convert_time1+":00.000Z";
            console.log(final_date_end);
            var date1 = new Date(final_date_start);
            var date2 = new Date(final_date_end);
            console.log(date1,date2);
            var diff = date2.valueOf() - date1.valueOf();
            var diffInHours = diff/1000/60/60; // Convert milliseconds to hours
            console.log(diffInHours);
            StateList.work_time[a].no_of_hrs_work = diffInHours;
            total_work_time = +total_work_time + +diffInHours;
            if(a == StateList.work_time.length - 1){
       let data = {
       work_time:StateList.work_time,
       stop_time:req.body.stop_time,
       work_status : "Stopped",
       total_work_time : total_work_time,
       }
        joininspectionModel.findByIdAndUpdate(StateList._id, data, {new: true}, function (err, UpdatedDetails) {
            if (err) return res.json({Status:"Failed",Message:"Internal Server Error", Data : {},Code:500});
             res.json({Status:"Success",Message:"Functiondetails Updated", Data : UpdatedDetails ,Code:200});
        });

            }
        }
        });
});






router.post('/fetch_record_byuserid', function (req, res) {
  console.log(req.body);
        var counts = 0;
           joininspectionModel.find({user_id:req.body.user_id,activity_id:req.body.activity_id}, function (err, StateList2) {
            counts = counts + StateList2.length;
          res.json({Status:"Success",Message:"Storage List", Data : {count : counts}  ,Code:200});
        });
});







router.post('/fetch_record_by_group', function (req, res) {
        joininspectionModel.findOne({
              user_id :  req.body.user_id ,
              activity_id : req.body.activity_id,
              job_id : req.body.job_id,
              group_id : req.body.group_id,
              sub_group_id : req.body.sub_group_id,
              start_time :  req.body.start_time,
             }, function (err, StateList) {
                let final_data = {
              user_id :  req.body.user_id ,
              activity_id : req.body.activity_id,
              job_id : req.body.job_id,
              group_id : req.body.group_id,
              sub_group_id : req.body.sub_group_id,
              start_time : req.body.start_time,
              data_store : []
                }
                if(StateList !== null){
                  final_data.data_store = StateList.data_store
                }
          res.json({Status:"Success",Message:"Storage List", Data : final_data  ,Code:200});
        });
});


router.post('/fetch_record_by_group_one', function (req, res) {
         joininspectionModel.findOne({
              user_id :  req.body.user_id ,
              activity_id : req.body.activity_id,
              job_id : req.body.job_id,
              group_id : req.body.group_id,
              sub_group_id : req.body.sub_group_id,
              start_time :  req.body.start_time,
             }, function (err, StateList) {
                let final_data = {
              user_id :  req.body.user_id ,
              activity_id : req.body.activity_id,
              job_id : req.body.job_id,
              group_id : req.body.group_id,
              sub_group_id : req.body.sub_group_id,
              start_time : req.body.start_time,
              data_store_one : []
                }
                if(StateList !== null){
                  final_data.data_store_one = StateList.data_store_one
                }
          res.json({Status:"Success",Message:"Storage List", Data : final_data   ,Code:200});
        });
});


router.post('/fetch_record_by_group_two', function (req, res) {
           joininspectionModel.findOne({
              user_id :  req.body.user_id ,
              activity_id : req.body.activity_id,
              job_id : req.body.job_id,
              group_id : req.body.group_id,
              sub_group_id : req.body.sub_group_id,
              start_time : req.body.start_time,
             }, function (err, StateList) {
                let final_data = {
              user_id :  req.body.user_id ,
              activity_id : req.body.activity_id,
              job_id : req.body.job_id,
              group_id : req.body.group_id,
              sub_group_id : req.body.sub_group_id,
              start_time :  req.body.start_time,
              data_store_two : []
                }
                if(StateList !== null){
                  final_data.data_store_two = StateList.data_store_two
                }
          res.json({Status:"Success",Message:"Storage List", Data : final_data  ,Code:200});
        });
});




router.get('/getlist', function (req, res) {
        joininspectionModel.find({}, function (err, Functiondetails) {
          res.json({Status:"Success",Message:"Functiondetails", Data : Functiondetails ,Code:200});
        });
});



router.get('/getlist_test', function (req, res) {
        field_managementModel.find({group_id:'629ede01886f5404a75d4a91'}, function (err, Functiondetails) {
          res.json({Status:"Success",Message:"Functiondetails", Data : Functiondetails ,Code:200});
        });
});


router.get('/getlist_two', function (req, res) {
   oracledb.getConnection({
      user: "JLSMART",
      password: "JLSMART",
      connectString: "(DESCRIPTION =(ADDRESS = (PROTOCOL = TCP)(HOST = 192.168.1.112)(PORT = 1521))(CONNECT_DATA =(SID = jlpl)))"
}, function(err, connection) {
if (err) {
    return;
}
connection.execute(
            "select * FROM ESPD_OP_HDR WHERE SMU_UKEY='OP-ACT8' and SMU_ACTIVITY_STATUS='SUBMITTED'",
            {},
        {autoCommit: true},
        function (err, result) {
    if (err) { console.error(err.message);
          doRelease(connection);
          return;
     }
var ary = [];
for(let a = 0 ; a < result.rows.length; a++){
var temp_data = result.rows[a];
var results = {}
for (var i = 0; i < result.metaData.length; ++i){
results[result.metaData[i].name] = temp_data[i];
}
 ary.push(results);   
 if(a == result.rows.length - 1){
    res.json({Status:"Success",Message:"Updated", Data : ary,Code:200}); 
    doRelease(connection);    
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





router.post('/fetch_data', function (req, res) {
        joininspectionModel.findOne({_id:req.body._id}, function (err, Functiondetails) {
          res.json({Status:"Success",Message:"Functiondetails", Data : Functiondetails ,Code:200});
        });
});



router.post('/fetch_data_mobile_no_job_id', function (req, res) {
        joininspectionModel.find({job_id:req.body.job_id}, function (err, Functiondetails) {
          res.json({Status:"Success",Message:"Functiondetails", Data : Functiondetails ,Code:200});
        });
});


router.post('/fetch_by_id', function (req, res) {
        joininspectionModel.find({job_id:req.body.job_id,group_id:req.body.group_id,sub_group_id:req.body.sub_group_id}, function (err, Functiondetails) {
          res.json({Status:"Success",Message:"Functiondetails", Data : Functiondetails ,Code:200});
        }).populate('user_id sub_group_id');
});


router.post('/getlist_subgroup_list', function (req, res) {
        joininspectionModel.find({group_id:req.body.group_id,job_id:req.body.job_id}, function (err, Functiondetails) {
          console.log("Sublist",Functiondetails);
          res.json({Status:"Success",Message:"Functiondetails", Data : Functiondetails ,Code:200});
        }).populate('sub_group_id');
});


router.post('/update_params',async function (req, res) {
      var user_detail = await joininspectionModel.find({});
      console.log(user_detail)
      for(let a = 0 ; user_detail.length ; a++){
        user_detail[a].data_store.push(
        {
                    "__v": 0,
                    "_id": "62bd75ab5cebf6a18ac94287",
                    "cat_id": "61a8b8752d9a15335c1e511f",
                    "created_by": "Admin",
                    "date_of_create": "6/30/2022, 3:36:35 PM",
                    "date_of_update": "6/30/2022, 3:36:35 PM",
                    "drop_down": [],
                    "field_comments": "ENTER YOUR REMARKS HERE......",
                    "field_length": "250",
                    "field_name": "REMARK 2",
                    "field_type": "Textarea",
                    "field_update_reason": "",
                    "field_value": "-",
                    "lift_list": [],
                    "updated_by": "Admin"
        }
        );
      let cc = {
        data_store : user_detail[a].data_store
       }
       joininspectionModel.findByIdAndUpdate(user_detail[a]._id, cc, {new: true}, function (err, UpdatedDetails) {
            if (err) return res.json({Status:"Failed",Message:"Internal Server Error", Data : {},Code:500});
            console.log('Done');
             // res.json({Status:"Success",Message:"Functiondetails Updated", Data : UpdatedDetails ,Code:200});
        });
       if(a == user_detail.length - 1){
        res.json({Status:"Success",Message:"Functiondetails Updated", Data : {} ,Code:200});
       }
      }  
});




router.post('/remove_update_params',async function (req, res) {
      var user_detail = await joininspectionModel.find({});
      // console.log(user_detail)
      for(let a = 0 ; user_detail.length ; a++){
        console.log(user_detail[a].data_store.length); 
        var index = user_detail[a].data_store.length - 1;
        user_detail[a].data_store.splice(-1,1);
        console.log(user_detail[a].data_store.length);
       let cc = {
        data_store : user_detail[a].data_store
       }
       joininspectionModel.findByIdAndUpdate(user_detail[a]._id, cc, {new: true}, function (err, UpdatedDetails) {
            if (err) return res.json({Status:"Failed",Message:"Internal Server Error", Data : {},Code:500});
            // console.log('Done');
             // res.json({Status:"Success",Message:"Functiondetails Updated", Data : UpdatedDetails ,Code:200});
        });
       if(a == user_detail.length - 1){
        res.json({Status:"Success",Message:"Functiondetails Updated", Data : {} ,Code:200});
       }
      }  
});




router.post('/update_status',async function (req, res) {
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
    "UPDATE ESPD_OP_HDR set SMU_ACTIVITY_STATUS=:SMU_ACTIVITY_STATUS WHERE SMU_JOBNO=:SMU_JOBNO and SMU_UKEY=:SMU_UKEY and SMU_TECHMOBNO=:SMU_TECHMOBNO",
            {
                SMU_JOBNO: req.body.SMU_JOBNO,
                SMU_TECHMOBNO : req.body.SMU_TECHMOBNO,
                SMU_UKEY : req.body.SMU_UKEY,
                SMU_ACTIVITY_STATUS : 'ESUBMITTED'
            },
        {autoCommit: true},
        function (err, result) {
    if (err) { console.error(err.message);
          doRelease(connection);
          return;
     }
     console.log(result);
     res.json({Status:"Success",Message:"Functiondetails Updated", Data : {} ,Code:200});
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
});







router.get('/get_temp_store',async function(req, res) {
    var datas = await temp_data_storedataModel.findOne({});
    res.json({Status:"Success",Message:"Functiondetails Updated", Data : datas ,Code:200});
});



router.get('/deletes_temp_store', function (req, res) {
      temp_data_storedataModel.remove({}, function (err, user) {
          if (err) return res.status(500).send("There was a problem deleting the user.");
             res.json({Status:"Success",Message:"temp_data_storedata joininspectionModel Deleted", Data : {} ,Code:200});     
      });
});

router.post('/admin_delete', function (req, res) {
      joininspectionModel.findByIdAndRemove(req.body._id, function (err, user) {
          if (err) return res.json({Status:"Failed",Message:"Internal Server Error", Data : {},Code:500});
          res.json({Status:"Success",Message:"SubFunction Deleted successfully", Data : {} ,Code:200});
      });
});


router.post('/edit', function (req, res) {
        joininspectionModel.findByIdAndUpdate(req.body._id, req.body, {new: true}, function (err, UpdatedDetails) {
            if (err) return res.json({Status:"Failed",Message:"Internal Server Error", Data : {},Code:500});
             res.json({Status:"Success",Message:"Functiondetails Updated", Data : UpdatedDetails ,Code:200});
        });
});
// // DELETES A USER FROM THE DATABASE
router.post('/delete', function (req, res) {
      joininspectionModel.findByIdAndRemove(req.body._id, function (err, user) {
          if (err) return res.json({Status:"Failed",Message:"Internal Server Error", Data : {},Code:500});
          res.json({Status:"Success",Message:"SubFunction Deleted successfully", Data : {} ,Code:200});
      });
});



module.exports = router;
