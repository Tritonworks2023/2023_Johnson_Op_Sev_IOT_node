var express = require('express');
var router = express.Router();
var bodyParser = require('body-parser');
router.use(bodyParser.urlencoded({ extended: false }));
router.use(bodyParser.json());
var field_managementModel = require('./../models/field_managementModel');
var data_store_managementModel = require('./../models/data_store_managementModel');
var group_detailModel = require('./../models/group_detailModel');
var new_group_listModel = require('./../models/new_group_listModel');


var user_management = require('./../models/user_managementModel');

var oracledb = require('oracledb');


router.post('/create', async function(req, res) {
  try{

  await field_managementModel.create({
  cat_id :  req.body.cat_id || "",
  index : req.body.index || 0,
  group_id : req.body.group_id || "",
  sub_group_id : req.body.sub_group_id || "",
  field_name : req.body.field_name  || "",
  field_type : req.body.field_type  || "",
  field_value : "",
  drop_down : req.body.drop_down  || [],
  lift_list : req.body.lift_list  || [],
  field_length : req.body.field_length  || "",
  field_comments : req.body.field_comments || "",
  field_update_reason : req.body.field_update_reason  || "",
  date_of_create : req.body.date_of_create  || "",
  date_of_update : req.body.date_of_update  || "",
  created_by : req.body.created_by || "",
  updated_by : req.body.updated_by  || "",
  delete_status : false,
        }, 
        function (err, user) {
          // console.log(user)
          console.log(err)
        res.json({Status:"Success",Message:"Added successfully", Data : user ,Code:200}); 
        });
}
catch(e){
      res.json({Status:"Failed",Message:"Internal Server Error", Data : {},Code:500});
}
});


router.get('/deletes', function (req, res) {
      field_managementModel.remove({}, function (err, user) {
          if (err) return res.status(500).send("There was a problem deleting the user.");
             res.json({Status:"Success",Message:"field management Deleted", Data : {} ,Code:200});     
      });
});


router.post('/getlist_id',async function (req, res) {
console.log("888888888888",req.body);
 var group_detail  =  await new_group_listModel.findOne({_id:req.body.group_id});
 // console.log(group_detail);
 if(group_detail.SMU_UKEY == 'ESPD-ACT3')
 {
oracledb.getConnection({
      user: "JLSMART",
      password: "JLSMART",
      connectString: "(DESCRIPTION =(ADDRESS = (PROTOCOL = TCP)(HOST = 192.168.1.112)(PORT = 1521))(CONNECT_DATA =(SID = jlpl)))"
}, function(err, connection) {
if (err) {
    console.error(err.message);
    return;
}
    // {fn: 'L-N9226'},
      connection.execute(
      `SELECT OM_GSPA_JOBNO, OM_GSPA_SLNO, OM_GSPA_LCODE, OM_GSPA_LPCODE, OM_GSPA_LCSLNO,
OM_GSPA_SPLDESC,
OM_GSPA_VALUE, OM_GSPA_REVNO, OM_GSPA_REVDT, OM_GSPA_STATUS
FROM OM_GADSPECADL_dTL
WHERE om_gspa_jobno = :fn
and  OM_GSPA_LCODE in (select cam_aty_code from com_activity_mst where cam_aty_type = 'LMSPEC'
and cam_aty_pcode = 'OESPD'
union all
select cam_aty_code from com_activity_mst where cam_aty_type = 'LCSPEC'
and cam_aty_pcode in ( select cam_aty_code from com_activity_mst where cam_aty_type = 'LMSPEC'
and cam_aty_pcode = 'OESPD')
)
order by 2`,
        {fn: req.body.job_id},
        {autoCommit: true},
     function(err, result) {
    if (err) { console.error(err.message);
          doRelease(connection);
          return;
     }
     // console.log(result.rows.length);
 if(result.rows.length == 0){
    // console.log("response Send");
    res.json({Status:"Success",Message:"Respose Data", Data : [] ,Code:200}); 
} else
{
var ary = [];
for(let a = 0 ; a < result.rows.length; a++){
var temp_data = result.rows[a];
var results = {}
for (var i = 0; i < result.metaData.length; ++i){
results[result.metaData[i].name] = temp_data[i];
}
 // console.log(results);
 ary.push(results);   
 if(a == result.rows.length - 1){
     // console.log(ary);
     var temp_data = [];
     for(let a  = 0 ; a < ary.length; a++){
        let temp = 
        {
            "drop_down": [
                "OK"
            ],
            "lift_list": [],
            "_id":""+ary[a].OM_GSPA_JOBNO+","+ary[a].OM_GSPA_SLNO+","+ary[a].OM_GSPA_LCODE+","+ary[a].OM_GSPA_LPCODE+","+ary[a].OM_GSPA_LCSLNO+","+ary[a].OM_GSPA_SPLDESC+","+ary[a].OM_GSPA_VALUE+","+ary[a].OM_GSPA_REVNO+","+ary[a].OM_GSPA_REVDT+","+ary[a].OM_GSPA_STATUS,
            "cat_id": "61a8b8752d9a15335c1e511f",
            "group_id": req.body.group_id,
            "sub_group_id": "",
            "field_name": ary[a].OM_GSPA_SPLDESC,
            "field_type": "Dropdown",
            "field_value": "",
            "field_length": ary[a].OM_GSPA_REVNO,
            "field_comments": ary[a].OM_GSPA_SPLDESC+" - "+ary[a].OM_GSPA_VALUE,
            "field_update_reason": "",
            "date_of_create": "3/17/2022, 12:51:50 PM",
            "date_of_update": "3/17/2022, 12:51:50 PM",
            "created_by": "Admin",
            "updated_by": "Admin",
            "delete_status": false,
            "__v": 0
        }
        temp_data.push(temp);
        if(a == ary.length - 1){
            // console.log( "1",temp_data.length);
             if (temp_data.length % 6 == 0)
             {
             temp_data.splice(temp_data.length - 1);
             } 
            // console.log("Data Existing");
           res.json({Status:"Success",Message:"Respose Data", Data : temp_data ,Submitted_status :"Not Submitted",Code:200}); 
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
} 
else if(group_detail.SMU_UKEY == 'ESPD-ACT1')
{
 var user_detail = await user_management.findOne({_id:req.body.user_id});
// console.log("Form 1");
// console.log("req",req.body);
if(user_detail == null){
    user_detail = await user_management.findOne({_id:req.body.user_id});
}
// console.log("user_detail",user_detail);
oracledb.getConnection({
      user: "JLSMART",
      password: "JLSMART",
      connectString: "(DESCRIPTION =(ADDRESS = (PROTOCOL = TCP)(HOST = 192.168.1.112)(PORT = 1521))(CONNECT_DATA =(SID = jlpl)))"
},async function(err, connection) {
if (err) {
    // console.error(err.message);
    return;
}

// console.log(user_detail.user_id,req.body.job_id);
connection.execute(
            "SELECT *  FROM ESPD_OP_HDR WHERE SMU_TECHMOBNO=:fn and SMU_UKEY=:uk and SMU_JOBNO=:jn",
            {fn: user_detail.user_id,uk:'ESPD-ACT1',jn:req.body.job_id},
        {autoCommit: true},
        async function (err, result) {
    if (err) { console.error(err.message);
          doRelease(connection);
          return;
     }

// console.log(result.rows);
// console.log(result.metaData);

var ary = [];
for(let a = 0 ; a < result.rows.length; a++){
var temp_data = result.rows[a];
var results = {}
for (var i = 0; i < result.metaData.length; ++i){
results[result.metaData[i].name] = temp_data[i];
}
 // console.log(results);
 ary.push(results);   
 // console.log(a,result.rows.length - 1);
 if(a == result.rows.length - 1){
    // res.json({Status:"Success",Message:"Updated", Data : ary[0],Code:200}); 

 if(ary[0].SMU_NOOF_FLOORS == null){
    ary[0].SMU_NOOF_FLOORS = 0;
 }else{
  ary[0].SMU_NOOF_FLOORS =  ary[0].SMU_NOOF_FLOORS - 1;
 }
 // console.log(ary[0].SMU_NOOF_FLOORS);
 let temp_val = [];
 for(let c = 0; c < +ary[0].SMU_NOOF_FLOORS; c++){
    let end_count = c+1;
    // console.log(end_count); 
    temp_val.push(
    { 
      "left": "",
      "title": ""+c +" - "+ end_count
    }
    );
 }
let left_temp = {
            "drop_down": [],
            "lift_list": temp_val,
            "_id": "6246da789df6e7034df274f8",
            "cat_id": "61a8b8752d9a15335c1e511f",
            "group_id": req.body.group_id,
            "sub_group_id": req.body.sub_group_id,
            "field_name": "LIFT DETAILS",
            "field_type": "Lift",
            "field_value": "",
            "field_length": ""+ary[0].SMU_NOOF_FLOORS,
            "field_comments": "LIFT VALUE",
            "field_update_reason": "",
            "date_of_create": "4/1/2022, 4:26:56 PM",
            "date_of_update": "4/1/2022, 4:26:56 PM",
            "created_by": "Admin",
            "updated_by": "Admin",
            "delete_status": false,
            "__v": 0
}
// console.log(left_temp);
 var data_store_detail = await data_store_managementModel.findOne({
              user_id :  req.body.user_id,
              job_id : req.body.job_id,
              group_id : req.body.group_id
  });
 // console.log(data_store_detail,"Existing");
 let Final_datas = [];
 field_managementModel.find({ 
          group_id : req.body.group_id,
          sub_group_id : req.body.sub_group_id
        }, function (err, StateList) {
          Final_datas = StateList;
  if(data_store_detail == null){
      // console.log(Final_datas[Final_datas.length - 1]);
      // Final_datas.push(left_temp);
      Final_datas.splice(14, 0,left_temp);
       // console.log( "2",Final_datas.length);
             if (Final_datas.length % 6 == 0)
             {
             Final_datas.splice(Final_datas.length - 1);
             } 
             if(Final_datas[Final_datas.length - 1].field_comments == 'Additional Remarks'){
                Final_datas[Final_datas.length - 1].field_value = 'No Additional Remarks';
             }
             // console.log(Final_datas[Final_datas.length - 1]);
     res.json({Status:"Success",Message:"field management List", Data : Final_datas ,Submitted_status :"Not Submitted",Code:200});
   }else{
    // console.log("testing1");
       let data_store = data_store_detail.data_store; 
       for(let a = 0; a < data_store.length; a++){
        if(data_store[a].group_id == req.body.group_id){
          //       console.log("testing2");
          // console.log(data_store[a].group_data);
          //  console.log(data_store[a].group_data.length);
           if(data_store[a].group_data.length == 0){
            Final_datas = Final_datas;
            // res.json({Status:"Success",Message:"field management List", Data : Final_datas ,Code:200});
           }else{
            Final_datas = data_store[a].group_data;
            // res.json({Status:"Success",Message:"field management List", Data : data_store[a].group_data ,Code:200});
           } 
        }
        if(a == data_store.length - 1){
        // console.log("testing3");
        // console.log(Final_datas[Final_datas.length - 1]);
        // Final_datas.push(left_temp);
              Final_datas.splice(14, 0,left_temp);
              // console.log( "3",Final_datas.length);
             if (Final_datas.length % 6 == 0)
             {
             Final_datas.splice(Final_datas.length - 1);
             } 
            if(Final_datas[Final_datas.length - 1].field_comments == 'Additional Remarks'){
                Final_datas[Final_datas.length - 1].field_value = 'No Additional Remarks';
             }
             // console.log(Final_datas[Final_datas.length - 1]);
          res.json({Status:"Success",Message:"field management List", Data : Final_datas, Submitted_status :"Not Submitted",Code:200});
        }
       }   
   }
        });



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





 }


 else{


 var data_store_detail = await data_store_managementModel.findOne({
              user_id :  req.body.user_id,
              job_id : req.body.job_id,
              group_id : req.body.group_id
  });
 // console.log(data_store_detail,"Existing");
 let Final_datas = [];
 field_managementModel.find({ 
          group_id : req.body.group_id,
          sub_group_id : req.body.sub_group_id
        }, function (err, StateList) {
          Final_datas = StateList;
  if(data_store_detail == null){
             // console.log( "4",Final_datas.length);
             if (Final_datas.length % 6 == 0)
             {
             Final_datas.splice(Final_datas.length - 1);
             } 
             
             // console.log(Final_datas[Final_datas.length - 1]);
     res.json({Status:"Success",Message:"field management List", Data : Final_datas ,Submitted_status :"Not Submitted",Code:200});
   }else{
    // console.log("testing1");
       let data_store = data_store_detail.data_store; 
       for(let a = 0; a < data_store.length; a++){
        if(data_store[a].group_id == req.body.group_id){
          //       console.log("testing2");
          // console.log(data_store[a].group_data);
          //  console.log(data_store[a].group_data.length);
           if(data_store[a].group_data.length == 0){
            Final_datas = Final_datas;
            // res.json({Status:"Success",Message:"field management List", Data : Final_datas ,Code:200});
           }else{
            Final_datas = data_store[a].group_data;
            // res.json({Status:"Success",Message:"field management List", Data : data_store[a].group_data ,Code:200});
           } 
        }
        if(a == data_store.length - 1){
                // console.log("testing3");
                // console.log( "5",Final_datas.length);
             if (Final_datas.length % 6 == 0)
             {
             Final_datas.splice(Final_datas.length - 1);
             } 
                 if(Final_datas[Final_datas.length - 1].field_comments == 'Additional Remarks'){
                Final_datas[Final_datas.length - 1].field_value = 'No Additional Remarks';
             }
             // console.log(Final_datas[Final_datas.length - 1]);
          res.json({Status:"Success",Message:"field management List", Data : Final_datas, Submitted_status :"Not Submitted",Code:200});
        }
       }   
   }
        });


 }







});




router.post('/getlist_datas_test',async function (req, res) {
 console.log(req.body);
  // {fn: '427867'},
  // req.body.ST_MDH_SEQNO = '427867';
  // console.log(req.body);  

 var data_store_detail = await data_store_managementModel.findOne({
              user_id :  req.body.user_id,
              job_id : req.body.job_id,
              group_id : req.body.group_id
  });
 // console.log(data_store_detail,"Existing");

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
            "SELECT * FROM ST_MATLDESPATCH_DTL WHERE ST_MDD_SEQNO=:fn",
            {fn: ''+req.body.ST_MDH_SEQNO},
        {autoCommit: true},
        function (err, result) {
    if (err) { console.error(err.message);
          doRelease(connection);
          return;
     }
     // console.log(result.rows);
     // console.log(result.metaData);
var ary = [];
for(let a = 0 ; a < result.rows.length;a++){
var temp_data = result.rows[a];
var results = {}
for (var i = 0; i < result.metaData.length; ++i){
results[result.metaData[i].name] = temp_data[i];
}
 ary.push(results);   
 if(a == result.rows.length - 1){
   var final_datas = []
    ary.forEach(element => {
        // console.log(+element.ST_MDD_QTY);
    let dt = 
    {
            "ST_MDD_SEQNO": element.ST_MDD_SEQNO,
            "ST_MDD_SLNO":element.ST_MDD_SLNO,
            "ST_MDD_MATLID":element.ST_MDD_MATLID,
            "part_no": ""+element.ST_MDD_PARTNO,
            "desc_qty":+element.ST_MDD_QTY,
            "ST_MDD_UOM": element.ST_MDD_UOM,
            "ST_MDD_STATUS":element.ST_MDD_STATUS,
            "ST_MDD_SSID" : element.ST_MDD_SSID || "",
            "ST_MDD_BOMQTY" : element.ST_MDD_BOMQTY,
            "material_desc":element.ST_MDD_PARTDESC, 
            "accepts":+element.ST_MDD_QTY,
            "demage":0,
            "shortage": 0,
            "excess" : 0,
            "ST_MDD_RCREMARKS" : "",
    }
    final_datas.push(dt);
    });

    // final_datas.sort(function(a, b) {
    // return parseFloat(a.price) - parseFloat(b.price);
    // });
    
        final_datas.sort(function(a, b) {
        return a.ST_MDD_SLNO - b.ST_MDD_SLNO;
        });
    let final  = 
       {
         material_details : final_datas,
         "remarks" : ""
       }
       res.json({Status:"Success",Message:"Respose Data", Data :final,Submitted_status :"Not Submitted", Code:200});
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




router.post('/getlist_datas', function (req, res) {
//     oracledb.getConnection({
//       user: "JLSMART",
//       password: "JLSMART",
//       connectString: "(DESCRIPTION =(ADDRESS = (PROTOCOL = TCP)(HOST = 192.168.1.112)(PORT = 1521))(CONNECT_DATA =(SID = jlpl)))"
// }, function(err, connection) {
// if (err) {
//     console.error(err.message);
//     return;
// }
//       connection.execute(
//             "SELECT * FROM ST_MATLDESPATCH_DTL WHERE ST_MDD_SEQNO=:fn",
//             {fn: '427867'},
//         {autoCommit: true},
//         function (err, result) {
//     if (err) { console.error(err.message);
//           doRelease(connection);
//           return;
//      }
//      // console.log(result.rows);
//      // console.log(result.metaData);
// var ary = [];
// for(let a = 0 ; a < result.rows.length;a++){
// var temp_data = result.rows[a];
// var results = {}
// for (var i = 0; i < result.metaData.length; ++i){
// results[result.metaData[i].name] = temp_data[i];
// }
//  ary.push(results);   
//  if(a == result.rows.length - 1){
//    var final_datas = []
//     ary.forEach(element => {
//         // console.log(+element.ST_MDD_QTY);
//     let dt = 
//     {
//             // "serial_no":element.ST_MDD_SLNO,
//             // "material_id":element.ST_MDD_MATLID,
//             // "seq_no": element.ST_MDD_SEQNO,
//             "part_no": ""+element.ST_MDD_PARTNO,
//             "material_desc":element.ST_MDD_PARTDESC,
//             "desc_qty":Math.round(+element.ST_MDD_QTY),
//             "accepts":Math.round(+element.ST_MDD_QTY),
//             "demage":0,
//             "shortage": 0,
//             "excess" : 0
//     }
//     final_datas.push(dt);
//     });
//     let final  = 
//        {
//          material_details : final_datas,
//          "remarks" : ""
//        }
//    res.json({Status:"Success",Message:"Respose Data", Data :final, Code:200});
//  }
// }
//      doRelease(connection);
//    });
// });
// function doRelease(connection) {
//        connection.release(function(err) {
//          if (err) {
//           console.error(err.message);
//         }
//       }
//    );
// }

     let a  = 
       {
        "material_details":[
           {
            "part_no":"No1",
            "material_desc":"this is the material for all data 01",
            "desc_qty":10,
            "accepts":10,
            "demage":0,
            "shortage": 0,
            "excess" : 0
           },
           {
            "part_no":"No2",
            "material_desc":"this is the material for all data 02",
            "desc_qty":10,
            "accepts":10,
            "demage":0,
            "shortage": 0,
            "excess" : 0
           },
           {
            "part_no":"No3",
            "material_desc":"this is the material for all data 03",
            "desc_qty":10,
            "accepts":10,
            "demage":0,
            "shortage": 0,
            "excess" : 0
           },
           {
            "part_no":"No4",
            "material_desc":"this is the material for all data 04",
            "desc_qty":10,
            "accepts":10,
            "demage":0,
            "shortage": 0,
            "excess" : 0
           }
        ],
        "remarks" : ""
       }
     res.json({Status:"Success",Message:"field management", Data : a ,Code:200});
});


router.get('/getlist', function (req, res) {
        field_managementModel.find({}, function (err, Functiondetails) {
          res.json({Status:"Success",Message:"field management", Data : Functiondetails ,Code:200});
        }).sort({index:1});
});


router.post('/getlist_by_group_id', function (req, res) {
        field_managementModel.find({group_id : req.body.group_id}, function (err, Functiondetails) {
          res.json({Status:"Success",Message:"field management", Data : Functiondetails ,Code:200});
        }).sort({index:1});
});






router.post('/getlist_by_sub_group_id', function (req, res) {
        field_managementModel.find({sub_group_id : req.body.sub_group_id}, function (err, Functiondetails) {
          res.json({Status:"Success",Message:"field management", Data : Functiondetails ,Code:200});
        }).sort({_id:-1});
});


router.post('/edit', function (req, res) {
        field_managementModel.findByIdAndUpdate(req.body._id, req.body, {new: true}, function (err, UpdatedDetails) {
            if (err) return res.json({Status:"Failed",Message:"Internal Server Error", Data : {},Code:500});
             res.json({Status:"Success",Message:"field management Updated", Data : UpdatedDetails ,Code:200});
        });
});


router.get('/reload_data2',async function (req, res) {
        var ref_code_details  =  await field_managementModel.find({}).sort({index:1});
        for(let a  = 0; a < ref_code_details.length ; a ++){
         let d = {
            delete_status : false,
         }
         field_managementModel.findByIdAndUpdate(ref_code_details[a]._id, d, {new: true}, function (err, UpdatedDetails) {
            if (err) return res.json({Status:"Failed",Message:"Internal Server Error", Data : {},Code:500});
        });
         if(a == ref_code_details.length - 1){
            res.json({Status:"Success",Message:"group_detailModel Updated", Data : {} ,Code:200});
         }
        }

});



router.post('/reload_data',async function (req, res) {
        var ref_code_details  =  await field_managementModel.find({group_id : req.body.group_id}).sort({index:1});
        for(let a  = 0; a < ref_code_details.length ; a ++){
         let d = {
            index : a + 1
         }
         field_managementModel.findByIdAndUpdate(ref_code_details[a]._id, d, {new: true}, function (err, UpdatedDetails) {
            if (err) return res.json({Status:"Failed",Message:"Internal Server Error", Data : {},Code:500});
        });
         if(a == ref_code_details.length - 1){
            res.json({Status:"Success",Message:"field_managementModel Updated", Data : {} ,Code:200});
         }
        }

});



router.get('/update_gorup_id',async function (req, res) {
var sub_group_detail  =  await field_managementModel.find({group_id : "61e93852f5b6e53ca97b7a11"});
    // console.log(sub_group_detail.length);
    let c = {
        "group_id": "629ede01886f5404a75d4a8f",
    }
    for(let a  = 0 ; a < sub_group_detail.length ; a++){
        field_managementModel.findByIdAndUpdate(sub_group_detail[a]._id, c, {new: true}, function (err, UpdatedDetails) {
            if (err) return res.json({Status:"Failed",Message:"Internal Server Error", Data : {},Code:500});
            // console.log(UpdatedDetails);
             
        });
        if(a == sub_group_detail.length - 1){
            res.json({Status:"Success",Message:"Functiondetails Updated", Data : {} ,Code:200});
        }
    }
});






router.post('/admin_delete', function (req, res) {
      field_managementModel.findByIdAndRemove(req.body._id, function (err, user) {
          if (err) return res.json({Status:"Failed",Message:"Internal Server Error", Data : {},Code:500});
          res.json({Status:"Success",Message:"field management Deleted successfully", Data : {} ,Code:200});
      });
});


// // DELETES A USER FROM THE DATABASE
router.post('/delete', function (req, res) {
      field_managementModel.findByIdAndRemove(req.body._id, function (err, user) {
          if (err) return res.json({Status:"Failed",Message:"Internal Server Error", Data : {},Code:500});
          res.json({Status:"Success",Message:"field management Deleted successfully", Data : {} ,Code:200});
      });
});


module.exports = router;
