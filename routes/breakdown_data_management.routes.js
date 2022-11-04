var express = require('express');
var router = express.Router();
var bodyParser = require('body-parser');
router.use(bodyParser.urlencoded({ extended: false }));
router.use(bodyParser.json());
var breakdown_data_managementModel = require('./../models/breakdown_data_managementModel');
var breakdown_managementModel = require('./../models/breakdown_managementModel');

var breakdown_mr_data_managementModel = require('./../models/breakdown_mr_data_managementModel');

var oracledb = require('oracledb');
var request = require("request");



router.post('/create',async function(req, res) {

// console.log(req.body);

var job_details_two  =  await breakdown_managementModel.findOne({SMU_SCH_MECHCELL: req.body.user_mobile_no,SMU_SCH_JOBNO:req.body.job_id,SMU_SCH_COMPNO:req.body.SMU_SCH_COMPNO});
  try{
        await breakdown_data_managementModel.create({
  SMU_SCH_COMPNO  : req.body.SMU_SCH_COMPNO,
  SMU_SCH_SERTYPE  : req.body.SMU_SCH_SERTYPE,
  bd_details:  req.body.bd_details,
  breakdown_service : req.body.breakdown_service,
  customer_acknowledgemnet : req.body.customer_acknowledgemnet,
  customer_name : req.body.customer_name,
  customer_number : req.body.customer_number,
  date_of_submission : req.body.date_of_submission,
  feedback_details : req.body.feedback_details,
  feedback_remark_text : req.body.feedback_remark_text,
  job_id : req.body.job_id,
  mr_1 : req.body.mr_1,
  mr_2 : req.body.mr_2,
  mr_3 : req.body.mr_3,
  mr_4 : req.body.mr_4,
  mr_5 : req.body.mr_5,
  mr_6 : req.body.mr_6,
  mr_7 : req.body.mr_7,
  mr_8 : req.body.mr_8,
  mr_9 : req.body.mr_9,
  mr_10 : req.body.mr_10,
  tech_signature : req.body.tech_signature,
  user_mobile_no : req.body.user_mobile_no,
  eng_singature : ''
        },async function (err, user) {
          // console.log(user);
       let datas = {
            JOB_END_TIME : ""+new Date(),
            JOB_STATUS : "Job Submitted"
       }
        breakdown_managementModel.findByIdAndUpdate(job_details_two._id, datas, {new: true}, function (err, UpdatedDetails) {
            if (err) return res.json({Status:"Failed",Message:"Internal Server Error", Data : {},Code:500});
        });
        });
}
catch(e){
      console.log(e);
      res.json({Status:"Failed",Message:"Internal Server Error", Data : {},Code:500});
}
});






router.post('/pause_job_list',async function (req, res) {

var job_details  =  await breakdown_mr_data_managementModel.find({JLS_SCHM_ENGR_PHONE: req.body.user_mobile_no,JOB_STATUS:'Job Paused',JLS_SCHM_SERTYPE:'B'});

let a = [];
job_details.forEach(element => {
  a.push({
            job_id : element.JLS_SCHM_JOBNO,
            paused_time : '23-10-2022 11:00 AM',
            paused_at : 'Breakdown Serivce',
            SMU_SCH_COMPNO: element.JLS_SCHM_COMPNO,
            SMU_SCH_SERTYPE : element.JLS_SCHM_SERTYPE
        })
}); 

   res.json({Status:"Success",Message:"Pause job list", Data : a ,Code:200});
});








router.post('/service_mr_job_status_count',async function (req, res) {
    console.log(req.body);
      var bd_paused_count  =  await breakdown_mr_data_managementModel.count({JLS_SCHM_ENGR_PHONE: req.body.user_mobile_no,JOB_STATUS:'Job Paused',JLS_SCHM_SERTYPE : 'B'});
        let a  = {
            paused_count : bd_paused_count
        }
       res.json({Status:"Success",Message:"Job status count", Data : a ,Code:200});
});



router.post('/service_mr_new_job_list',async function (req, res) {
    console.log(req.body);
var job_details  =  await breakdown_mr_data_managementModel.find({JLS_SCHM_ENGR_PHONE: req.body.user_mobile_no,JLS_SCHM_SERTYPE:'B'});
let a = [];
job_details.forEach(element => {
    var dates = new Date(element.SMU_SCH_COMPDT).toISOString();
console.log(element.JOB_STATUS);
if(element.JOB_STATUS == "Job Started" || element.JOB_STATUS == "Job Stopped" || element.JOB_STATUS == "Not Started" ){
  a.push({
            job_id : element.JLS_SCHM_JOBNO,
            customer_name : element.JLS_SCHM_CUSTOMER_NAME,
            pm_date : dates.substring(0, 10),
            status : "Active",
            SMU_SCH_COMPNO: element.JLS_SCHM_COMPNO,
            SMU_SCH_SERTYPE : element.JLS_SCHM_SERTYPE,
  });
}
});
res.json({Status:"Success",Message:"New Job List", Data : a ,Code:200});
});




router.post('/job_work_status_update',async function (req, res) {
    console.log(req.body);
         var statuss = 0;
        var job_details  =  await breakdown_managementModel.findOne({SMU_SCH_JOBNO:req.body.job_id,SMU_SCH_COMPNO:req.body.SMU_SCH_COMPNO});
        if(req.body.Status == 'Job Started'){
            let da = {
            JOB_STATUS : req.body.Status,
            JOB_VIEW_STATUS : "Viewed",
            JOB_START_TIME : ""+new Date(),
            JOB_END_TIME : ""+new Date()
        }
                 statuss = 1;
         breakdown_managementModel.findByIdAndUpdate(job_details._id, da, {new: true}, function (err, UpdatedDetails) {
            if (err) return res.json({Status:"Failed",Message:"Internal Server Error", Data : {},Code:500});
            res.json({Status:"Success",Message:"Update successfully", Data : {} ,Code:200});
         }); 
        }else if(req.body.Status == 'Job Stopped'){
            let da = {
            JOB_STATUS : req.body.Status,
            JOB_END_TIME : ""+new Date()
        }
                 statuss = 4;
         breakdown_managementModel.findByIdAndUpdate(job_details._id, da, {new: true}, function (err, UpdatedDetails) {
            if (err) return res.json({Status:"Failed",Message:"Internal Server Error", Data : {},Code:500});
            res.json({Status:"Success",Message:"Update successfully", Data : {} ,Code:200});
         }); 
        }else if(req.body.Status == 'Job Paused'){
            let da = {
            JOB_STATUS : req.body.Status,
            JOB_END_TIME : ""+new Date()
        }
               statuss = 2;
         breakdown_managementModel.findByIdAndUpdate(job_details._id, da, {new: true}, function (err, UpdatedDetails) {
            if (err) return res.json({Status:"Failed",Message:"Internal Server Error", Data : {},Code:500});
            res.json({Status:"Success",Message:"Update successfully", Data : {} ,Code:200});
         }); 
        }    

let cc = {
    user_mobile_no : req.body.user_mobile_no,
    job_no : req.body.job_id,
    complaint_no : req.body.SMU_SCH_COMPNO,
    status : statuss,
    service_name : "BD"
}
request.post(
    'http://smart.johnsonliftsltd.com:3000/api/service_userdetails/update_pause_resume_time',
    { json: cc},
    function (error, response, body) {
        if (!error && response.statusCode == 200) {
        }
        // res.json({Status:"Success",Message:"Logout successfully", Data : {} ,Code:200});
    }
);


});





router.post('/mr_job_work_status_update',async function (req, res) {         
        console.log(req.body);
        var job_details  =  await breakdown_mr_data_managementModel.findOne({JLS_SCHM_ENGR_PHONE: req.body.user_mobile_no,JLS_SCHM_JOBNO:req.body.job_id,JLS_SCHM_SERTYPE:req.body.SMU_SCH_SERTYPE,JLS_SCHM_COMPNO:req.body.SMU_SCH_COMPNO});
        console.log(job_details);
        if(req.body.Status == 'Job Started'){
            let da = {
            JOB_STATUS : req.body.Status,
            JOB_VIEW_STATUS : "Viewed",
            JOB_START_TIME : ""+new Date(),
            JOB_END_TIME : ""+new Date()
        }
                console.log('True');
         breakdown_mr_data_managementModel.findByIdAndUpdate(job_details._id, da, {new: true}, function (err, UpdatedDetails) {
            if (err) return res.json({Status:"Failed",Message:"Internal Server Error", Data : {},Code:500});
            res.json({Status:"Success",Message:"Update successfully", Data : {} ,Code:200});
         }); 
        }else if(req.body.Status == 'Job Stopped'){
            let da = {
            JOB_STATUS : req.body.Status,
            JOB_END_TIME : ""+new Date()
        }
                console.log('True2');
         breakdown_mr_data_managementModel.findByIdAndUpdate(job_details._id, da, {new: true}, function (err, UpdatedDetails) {
            if (err) return res.json({Status:"Failed",Message:"Internal Server Error", Data : {},Code:500});
            res.json({Status:"Success",Message:"Update successfully", Data : {} ,Code:200});
         }); 
        }else if(req.body.Status == 'Job Paused'){
            let da = {
            JOB_STATUS : req.body.Status,
            JOB_END_TIME : ""+new Date()
        }
        console.log('True3');
         breakdown_mr_data_managementModel.findByIdAndUpdate(job_details._id, da, {new: true}, function (err, UpdatedDetails) {
            if (err) return res.json({Status:"Failed",Message:"Internal Server Error", Data : {},Code:500});
            res.json({Status:"Success",Message:"Update successfully", Data : {} ,Code:200});
         }); 
        }               
});








router.post('/service_mr_customer_details',async function (req, res) {
console.log(req.body);
var job_details  =  await breakdown_managementModel.findOne({SMU_SCH_COMPNO:req.body.SMU_SCH_COMPNO});
        console.log(job_details);
  if(job_details !== null){
        let a  = {
            customer_name: job_details.SMU_SCH_CUSNAME,
            job_id : job_details.SMU_SCH_JOBNO,
            address1 : job_details.SMU_SCH_CUSADD1,
            address2 : job_details.SMU_SCH_CUSADD2,
            address3 : job_details.SMU_SCH_CUSADD3,
            pin: job_details.SMU_SCH_CUSPIN,
            contract_type : job_details.SMU_SCH_AMCTYPE,
            contract_status : job_details.SMU_SCH_JOBCURSTATUS,
            bd_number : job_details.SMU_SCH_COMPNO,
            bd_date : job_details.SMU_SCH_COMPDT.substring(0, 10),
            breakdown_type : job_details.SMU_SCH_BRKDOWNTYPE,
        }
       res.json({Status:"Success",Message:"Customer Details", Data : a ,Code:200});
  }else {

oracledb.getConnection({
      user: "JLSMART",
      password: "JLSMART",
      connectString: "(DESCRIPTION =(ADDRESS = (PROTOCOL = TCP)(HOST = 192.168.1.112)(PORT = 1521))(CONNECT_DATA =(SID = jlpl)))"
}, function(err, connection) {
if (err) {
    return;
}
connection.execute(
            "select * from JLS_SERCALL_HDR_UPLOAD where SMU_SCH_COMPNO = :type",
            // "select * from FEEDBACK_DETAILS",
            {type:req.body.SMU_SCH_COMPNO},
        {autoCommit: true},
        function (err, result) {
    if (err) { console.error(err.message);
          doRelease(connection);
          return;
     }
// console.log(result.rows.length);
var ary = [];
for(let a = 0 ; a < result.rows.length; a++){
var temp_data = result.rows[a];
var results = {}
for (var i = 0; i < result.metaData.length; ++i){
results[result.metaData[i].name] = temp_data[i];
}
}
console.log('*******',results);  
job_details = results;
    var dates = new Date(job_details.SMU_SCH_COMPDT).toISOString();
    let a  = {
            customer_name: job_details.SMU_SCH_CUSNAME,
            job_id : job_details.SMU_SCH_JOBNO,
            address1 : job_details.SMU_SCH_CUSADD1,
            address2 : job_details.SMU_SCH_CUSADD2,
            address3 : job_details.SMU_SCH_CUSADD3,
            pin: job_details.SMU_SCH_CUSPIN,
            contract_type : job_details.SMU_SCH_AMCTYPE,
            contract_status : job_details.SMU_SCH_JOBCURSTATUS,
            bd_number : job_details.SMU_SCH_COMPNO,
            bd_date : dates.substring(0, 10),
            breakdown_type : job_details.SMU_SCH_BRKDOWNTYPE,
        }
       res.json({Status:"Success",Message:"Customer Details", Data : a ,Code:200});
});
});

  }













});




router.post('/service_mr_check_work_status',async function (req, res) {
 console.log(req.body);
var job_details  =  await breakdown_mr_data_managementModel.findOne({JLS_SCHM_ENGR_PHONE: req.body.user_mobile_no,JLS_SCHM_JOBNO:req.body.job_id});
       res.json({Status:"Success",Message:job_details.JOB_STATUS, Data : {} ,Code:200});
});





router.post('/service_mr_eng_mrlist', function (req, res) {
console.log('****************Job Id***********',req.body);  
req.body.job_id = req.body.job_id;
 let final_data = [
          {
            title : 'Mr1',
            value : ''
          },
          {
            title : 'Mr2',
            value : ''
          },{
            title : 'Mr3',
            value : ''
          },{
            title : 'Mr4',
            value : ''
          },{
            title : 'Mr5',
            value : ''
          },{
            title : 'Mr6',
            value : ''
          },{
            title : 'Mr7',
            value : ''
          },{
            title : 'Mr8',
            value : ''
          },{
            title : 'Mr9',
            value : ''
          },{
            title : 'Mr10',
            value : ''
          }
       ];
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
            "select * from JLS_SERCALL_DTL_MR where JLS_SCDM_JOBNO =:job_id and JLS_SCDM_SERTYPE = 'B' and JLS_SCDM_COMPNO=:SMU_SCH_COMPNO",
            {
              job_id : req.body.job_id,
              SMU_SCH_COMPNO : req.body.SMU_SCH_COMPNO
            },
        {autoCommit: true},
        function (err, result) {
    if (err) { console.error(err.message);
          doRelease(connection);
          return;
     }
var ary = [];
console.log(result.rows.length);
for(let a = 0 ; a < result.rows.length; a++){
var temp_data = result.rows[a];
var results = {}
for (var i = 0; i < result.metaData.length; ++i){
results[result.metaData[i].name] = temp_data[i];
}
 // ary.push(results);
   if(results.JLS_SCDM_SLNO == 1){
    final_data[0].value = results.JLS_SCDM_DESC
   }
   if(results.JLS_SCDM_SLNO == 2){
    final_data[1].value = results.JLS_SCDM_DESC
   }
   if(results.JLS_SCDM_SLNO == 3){
    final_data[2].value = results.JLS_SCDM_DESC
   }
   if(results.JLS_SCDM_SLNO == 4){
    final_data[3].value = results.JLS_SCDM_DESC
   }
   if(results.JLS_SCDM_SLNO == 5){
    final_data[4].value = results.JLS_SCDM_DESC
   }
   if(results.JLS_SCDM_SLNO == 6){
    final_data[5].value = results.JLS_SCDM_DESC
   }
   if(results.JLS_SCDM_SLNO == 7){
    final_data[6].value = results.JLS_SCDM_DESC
   }
   if(results.JLS_SCDM_SLNO == 8){
    final_data[7].value = results.JLS_SCDM_DESC
   }
   if(results.JLS_SCDM_SLNO == 9){
    final_data[8].value = results.JLS_SCDM_DESC
   }
   if(results.JLS_SCDM_SLNO == 10){
    final_data[9].value = results.JLS_SCDM_DESC
   }
  if(a == result.rows.length - 1){
  res.json({Status:"Success",Message:"Service Report", Data : final_data ,Code:200});
}
}
    });
});
});





router.post('/service_mr_eng_mrlist_submit',async function (req, res) {

console.log(req.body);


   var job_details  =  await breakdown_mr_data_managementModel.findOne({JLS_SCHM_COMPNO:req.body.SMU_SCH_COMPNO});
     let datas = {
            JOB_END_TIME : ""+new Date(),
            JOB_STATUS : "Job Submitted"
       }
        breakdown_mr_data_managementModel.findByIdAndUpdate(job_details._id, datas, {new: true}, function (err, UpdatedDetails) {
            if (err) return res.json({Status:"Failed",Message:"Internal Server Error", Data : {},Code:500});
     });

        



oracledb.getConnection({
      user: "JLSMART",
      password: "JLSMART",
      connectString: "(DESCRIPTION =(ADDRESS = (PROTOCOL = TCP)(HOST = 192.168.1.112)(PORT = 1521))(CONNECT_DATA =(SID = jlpl)))"
}, function(err, connection) {
if (err) {
    return;
}
connection.execute(
            "SELECT * from JLS_SERCALL_HDR_UPLOAD where SMU_SCH_SERTYPE = 'B' and SMU_SCH_COMPNO=:SMU_SCH_COMPNO",
            {
                SMU_SCH_COMPNO : req.body.SMU_SCH_COMPNO
             },
        {autoCommit: true},
        function (err, result) {
    if (err) { console.error(err.message);
          doRelease(connection);
          return;
     }
     console.log(result.rows.length);
var ary = [];
for(let a = 0 ; a < result.rows.length; a++){
var temp_data = result.rows[a];
var results = {}
for (var i = 0; i < result.metaData.length; ++i){
results[result.metaData[i].name] = temp_data[i];
}
ary.push(results);   
if(a == result.rows.length - 1){
var job_details = ary[0]; 
 recall(0);
 function recall(index){
   console.log("data in");
   if(index < req.body.mr_data.length){
    console.log(index+1,""+req.body.mr_data[index].value,""+req.body.mr_data[index].partno,""+req.body.mr_data[index].req,index);
      oracledb.getConnection({
      user: "JLSMART",
      password: "JLSMART",
      connectString: "(DESCRIPTION =(ADDRESS = (PROTOCOL = TCP)(HOST = 192.168.1.112)(PORT = 1521))(CONNECT_DATA =(SID = jlpl)))"
}, function(err, connection) {
if (err) {
    console.error(err.message);
    return;
}
 let dass =
     {
            "JLS_SCCM_COMPNO": ""+job_details.SMU_SCH_COMPNO,
            "JLS_SCCM_JOBNO": ""+job_details.SMU_SCH_JOBNO,
            "JLS_SCCM_SERTYPE" : "B",
            "JLS_SCCM_SEQNO": index+1,
            "JLS_SCCM_MATLID": ""+req.body.mr_data[index].partno,
            "JLS_SCCM_QTY": ""+req.body.mr_data[index].req,
            "JLS_SCCM_MRSEQNO" : ""
    }
      connection.execute(
        "INSERT INTO JLS_SERCALL_CHILD_MR VALUES (:JLS_SCCM_COMPNO, :JLS_SCCM_JOBNO, :JLS_SCCM_SERTYPE, :JLS_SCCM_SEQNO, :JLS_SCCM_MATLID, :JLS_SCCM_QTY, :JLS_SCCM_MRSEQNO)",
              dass, // Bind values
              { autoCommit: true}, 
        function (err, result) {
    if (err) { console.error(err.message);
          doRelease(connection);
          return;
     }
       index = index + 1;
       console.log(index);
       console.log(result);
       recall(index);
   });
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
            "UPDATE JLS_SERCALL_HDR_DNLOAD set JLS_SCH_MRTAG='M' WHERE JLS_SCH_COMPNO=:JLS_SCH_COMPNO",
            {
                JLS_SCH_COMPNO : ""+job_details.SMU_SCH_COMPNO
            },
        {autoCommit: true},
        function (err, result_one) {
    if (err) { console.error(err.message);
          doRelease(connection);
          return;
     }

let request_value = {
     JLS_SCH_COMPNO : ""+job_details.SMU_SCH_COMPNO,
     JLS_SCCM_JOBNO : ""+job_details.SMU_SCH_JOBNO,
}
request.post(
    'http://smart.johnsonliftsltd.com:3000/api/breakdown_data_management/update_oracle_status',
    { json: request_value},
    function (error, response, body) {
        if (!error && response.statusCode == 200) {
        }
    }
);




     res.json({Status:"Success",Message:"breakdown data submit successfully", Data : {} ,Code:200});  
    });
});

    }
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




router.post('/update_oracle_status',async function (req, res) {
var job_details  =  await breakdown_mr_data_managementModel.findOne({JLS_SCHM_COMPNO: req.body.JLS_SCH_COMPNO,JLS_SCHM_JOBNO: req.body.JLS_SCCM_JOBNO});
let datas = {
            JOB_END_TIME : ""+new Date(),
            JOB_STATUS : "Job Submitted"
       }
       // console.log(req.body)
        breakdown_mr_data_managementModel.findByIdAndUpdate(job_details._id, datas, {new: true}, function (err, UpdatedDetails) {
            if (err) return res.json({Status:"Failed",Message:"Internal Server Error", Data : {},Code:500});
                   res.json({Status:"Success",Message:"fetch_mr_list", Data : {} ,Code:200});

});
});





router.post('/fetch_mr_submit', function (req, res) {
       res.json({Status:"Success",Message:"fetch_mr_list", Data : a ,Code:200});
});



router.post('/local_service_mr_eng_mrlist_submit',async function (req, res) {
     res.json({Status:"Success",Message:"breakdown data submit successfully", Data : {} ,Code:200});  
});



router.post('/fetch_mr_list',async function (req, res) {
console.log(req.body);
var jobdetails  =  await breakdown_managementModel.findOne({SMU_SCH_COMPNO:req.body.SMU_SCH_COMPNO});
console.log(jobdetails);
if(jobdetails == null){
   res.json({Status:"Failed",Message:"No Data Found", Data : [] ,Code:404});
}else {
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
             `SELECT PARTNAME, COMPART, PARTNO FROM JLS_SERVMATL_VIEW WHERE SERTYPE=:SMU_SCH_SERTYPE`,
             {SMU_SCH_SERTYPE : jobdetails.SMU_SCH_AMCTYPE},
        {autoCommit: true},
        function (err, result) {
    if (err) { console.error(err.message);
          doRelease(connection);
          return;
     }
var ary = [];
for(let a = 0 ; a < result.rows.length ; a++){
var temp_data = result.rows[a];
var results = {}
for (var i = 0; i < result.metaData.length; ++i){
results[result.metaData[i].name] = temp_data[i];
}
 ary.push(
    {
            "partname":results.PARTNAME,
            "partno": results.PARTNO,
            "partcompart": results.COMPART,
    });   
 if(a == result.rows.length - 1){  
  res.json({Status:"Success",Message:"fetch_mr_list", Data : ary ,Code:200});
     }
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



router.get('/deletes', function (req, res) {
      breakdown_data_managementModel.remove({}, function (err, user) {
          if (err) return res.status(500).send("There was a problem deleting the user.");
             res.json({Status:"Success",Message:"breakdown_data_managementModel Deleted", Data : {} ,Code:200});     
      });
});


router.post('/fetch_job_id', function (req, res) {
        breakdown_data_managementModel.findOne({job_id:req.body.job_id}, function (err, StateList) {
          res.json({Status:"Success",Message:"Break Down Data Detail", Data : StateList ,Code:200});
        });
});



router.get('/getlist', function (req, res) {
        breakdown_data_managementModel.find({}, function (err, Functiondetails) {
          res.json({Status:"Success",Message:"Functiondetails", Data : Functiondetails ,Code:200});
        });
});



router.get('/mr_getlist', function (req, res) {
        breakdown_mr_data_managementModel.find({}, function (err, Functiondetails) {
          res.json({Status:"Success",Message:"Functiondetails", Data : Functiondetails ,Code:200});
        });
});


router.post('/mr_getlist_update', function (req, res) {
        breakdown_mr_data_managementModel.findByIdAndUpdate(req.body._id, req.body, {new: true}, function (err, UpdatedDetails) {
            if (err) return res.json({Status:"Failed",Message:"Internal Server Error", Data : {},Code:500});
             res.json({Status:"Success",Message:"Functiondetails Updated", Data : UpdatedDetails ,Code:200});
        });
});




router.post('/edit', function (req, res) {
        breakdown_data_managementModel.findByIdAndUpdate(req.body.Activity_id, req.body, {new: true}, function (err, UpdatedDetails) {
            if (err) return res.json({Status:"Failed",Message:"Internal Server Error", Data : {},Code:500});
             res.json({Status:"Success",Message:"Functiondetails Updated", Data : UpdatedDetails ,Code:200});
        });
});
// // DELETES A USER FROM THE DATABASE
router.post('/delete', function (req, res) {
      breakdown_data_managementModel.findByIdAndRemove(req.body.Activity_id, function (err, user) {
          if (err) return res.json({Status:"Failed",Message:"Internal Server Error", Data : {},Code:500});
          res.json({Status:"Success",Message:"SubFunction Deleted successfully", Data : {} ,Code:200});
      });
});
module.exports = router;
