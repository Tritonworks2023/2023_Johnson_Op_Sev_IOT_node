var express = require('express');
var router = express.Router();
var bodyParser = require('body-parser');
router.use(bodyParser.urlencoded({ extended: false }));
router.use(bodyParser.json());
var service_adminModel = require('./../models/service_adminModel');
var service_user_management = require('./../models/service_userdetailsModel');


var service_sub_adminMdodel = require('./../models/service_sub_adminMdodel');

var breakdown_managementModel = require('./../models/breakdown_managementModel');
var lr_service_managementModel = require('./../models/lr_service_managementModel');
var part_reply_service_managementModel = require('./../models/part_reply_service_managementModel');
var breakdown_mr_data_managementModel = require('./../models/breakdown_mr_data_managementModel');
var audit_data_managementModel = require('./../models/audit_data_managementModel');




var oracledb = require('oracledb');





router.post('/create', async function(req, res) {
  try{
        await service_adminModel.create({
  first_name :  req.body.first_name || "",
  last_name : req.body.last_name || "",
  status : req.body.status || "",
  email_id : req.body.email_id || "",
  mobile_no : req.body.mobile_no || "",
  user_name : req.body.user_name || "",
  password : req.body.password || "",
  confirm_password : req.body.confirm_password || "",
  access_menu : req.body.access_menu || [],
  access_employee : req.body.access_employee || [],
  date_and_time : req.body.date_and_time || "",

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
      service_adminModel.remove({}, function (err, user) {
          if (err) return res.status(500).send("There was a problem deleting the user.");
             res.json({Status:"Success",Message:"Job_no_managment Deleted", Data : {} ,Code:200});     
      });
});

router.get('/getlist', function (req, res) {
        service_adminModel.find({}, function (err, Functiondetails) {
          res.json({Status:"Success",Message:"Job_no_managment", Data : Functiondetails ,Code:200});
        }).populate('activedetail_id');
});





router.post('/fetch_single_userstatus',async function (req, res) { 
    var user_detail_value = await service_user_management.findOne({user_mobile_no: req.body.user_mobile_no});
    var br_user_detail  =  await breakdown_managementModel.find({SMU_SCH_MECHCELL : req.body.user_mobile_no,SMU_SCH_SERTYPE : 'B'});
    var pm_user_detail  =  await breakdown_managementModel.find({SMU_SCH_MECHCELL : req.body.user_mobile_no,SMU_SCH_SERTYPE : 'P'});
    var br_mr_user_detail  =  await breakdown_mr_data_managementModel.find({JLS_SCHM_ENGR_PHONE : req.body.user_mobile_no,JLS_SCHM_SERTYPE : 'B'});
    var pm_mr_user_detail  =  await breakdown_mr_data_managementModel.find({JLS_SCHM_ENGR_PHONE : req.body.user_mobile_no,JLS_SCHM_SERTYPE : 'P'});
    var lr_user_detail  =  await lr_service_managementModel.find({SMU_SEN_MOBILENO : req.body.user_mobile_no});
    var pr_user_detail  =  await part_reply_service_managementModel.find({SMU_ACK_MOBILENO : req.body.user_mobile_no});
    var audit_user_detail  =  await audit_data_managementModel.find({OM_OSA_MOBILE : req.body.user_mobile_no});


                var final_value_data = [];


    step1();
     function step1(){
       if(br_user_detail.length == 0){ 
           step2();
       } else {
         var last_date_and_time = new Date(br_user_detail[0].LAST_UPDATED_TIME);
         for(let a = 0; a < br_user_detail.length ; a++){
                var  current_date_and_time = new Date(br_user_detail[a].LAST_UPDATED_TIME);
                   if(last_date_and_time > current_date_and_time){
                     last_date_and_time = current_date_and_time;
                   }
           if(a == br_user_detail.length - 1){

            final_value_data.push(
                 {
                   last_time : last_date_and_time,
                   serv_name : 'br_user_detail', 
                 }
                )
            step2();
           }
         }
       }
     }
    function step2(){
       if(pm_user_detail.length == 0){ 
           step3();
       } else {
         var last_date_and_time = new Date(pm_user_detail[0].LAST_UPDATED_TIME);
         for(let a = 0; a < pm_user_detail.length ; a++){
                var  current_date_and_time = new Date(pm_user_detail[a].LAST_UPDATED_TIME);
                   if(last_date_and_time > current_date_and_time){
                     last_date_and_time = current_date_and_time;
                   }
           if(a == pm_user_detail.length - 1){

            final_value_data.push(
                 {
                   last_time : last_date_and_time,
                   serv_name : 'pm_user_detail', 
                 }
                )
            step3();
           }
         }
       }
     }



    function step3(){
       if(br_mr_user_detail.length == 0){ 
           step4();
       } else {
         var last_date_and_time = new Date(br_mr_user_detail[0].LAST_UPDATED_TIME);
         for(let a = 0; a < br_mr_user_detail.length ; a++){
                var  current_date_and_time = new Date(br_mr_user_detail[a].LAST_UPDATED_TIME);
                   if(last_date_and_time > current_date_and_time){
                     last_date_and_time = current_date_and_time;
                   }
           if(a == br_mr_user_detail.length - 1){

            final_value_data.push(
                 {
                   last_time : last_date_and_time,
                   serv_name : 'br_mr_user_detail', 
                 }
                )
            step4();
           }
         }
       }
     }


    function step4(){
       if(pm_mr_user_detail.length == 0){ 
           step5();
       } else {
         var last_date_and_time = new Date(pm_mr_user_detail[0].LAST_UPDATED_TIME);
         for(let a = 0; a < pm_mr_user_detail.length ; a++){
                var  current_date_and_time = new Date(pm_mr_user_detail[a].LAST_UPDATED_TIME);
                   if(last_date_and_time > current_date_and_time){
                     last_date_and_time = current_date_and_time;
                   }
           if(a == pm_mr_user_detail.length - 1){

            final_value_data.push(
                 {
                   last_time : last_date_and_time,
                   serv_name : 'pm_mr_user_detail' 
               });
            step5();
           }
         }
       }
     }
    function step5(){
       if(lr_user_detail.length == 0){ 
           step6();
       } else {
         var last_date_and_time = new Date(lr_user_detail[0].LAST_UPDATED_TIME);
         for(let a = 0; a < lr_user_detail.length ; a++){
                var  current_date_and_time = new Date(lr_user_detail[a].LAST_UPDATED_TIME);
                   if(last_date_and_time > current_date_and_time){
                     last_date_and_time = current_date_and_time;
                   }
           if(a == lr_user_detail.length - 1){

            final_value_data.push(
                 {
                   last_time : last_date_and_time,
                   serv_name : 'lr_user_detail', 
                 }
                )
            step6();
           }
         }
       }
     }

     function step6(){
       if(pr_user_detail.length == 0){ 
           step7();
       } else {
         var last_date_and_time = new Date(pr_user_detail[0].LAST_UPDATED_TIME);
         for(let a = 0; a < pr_user_detail.length ; a++){
                var  current_date_and_time = new Date(pr_user_detail[a].LAST_UPDATED_TIME);
                   if(last_date_and_time > current_date_and_time){
                     last_date_and_time = current_date_and_time;
   
                   }
           if(a == pr_user_detail.length - 1){

            final_value_data.push(
                 {
                   last_time : last_date_and_time,
                   serv_name : 'pr_user_detail', 
                 }
                )
   
            step7();
           }
         }
       }
     }

        function step7(){
       if(audit_user_detail.length == 0){ 
           step8();
       } else {
         var last_date_and_time = new Date(audit_user_detail[0].LAST_UPDATED_TIME);
         for(let a = 0; a < audit_user_detail.length ; a++){
                var  current_date_and_time = new Date(audit_user_detail[a].LAST_UPDATED_TIME);
                   if(last_date_and_time > current_date_and_time){
                     last_date_and_time = current_date_and_time;
   
                   }
           if(a == audit_user_detail.length - 1){

            final_value_data.push(
                 {
                   last_time : last_date_and_time,
                   serv_name : 'audit_user_detail', 
                 }
                )
   
            step8();
           }
         }
       }
     }

function step8(){
         var last_date_and_time = new Date(final_value_data[0].last_time);
         for(let a = 0; a < final_value_data.length ; a++){
                var  current_date_and_time = new Date(final_value_data[a].last_time);
                   if(last_date_and_time > current_date_and_time){
                     last_date_and_time = current_date_and_time;
   
                   }
           if(a == final_value_data.length - 1){
                step9(last_date_and_time);
           }
         }
       






 
}

function step9(last_date){
 
 console.log(last_date);



    let a = {
        last_login : user_detail_value.last_login_time,
        last_job_act : last_date,
        pending_job_today : 1,
        pending_job_total : 10,
        completed_job_today : 20,
        completed_job_monthly : 50
     }
     res.json({Status:"Success",Message:"single_userstatus", Data : a ,Code:200});

}


});



router.post('/service_list',async function (req, res) {

      var user_detail = await service_sub_adminMdodel.findOne({mobile_no:req.body.user_mobile_no});
      let a = [];
                user_detail.access_live.forEach(element => {
                    a.push({
            service_name : element.menu_name,
        });
                });
      res.json({Status:"Success",Message:"service_list", Data : a ,Code:200});
});




router.post('/job_list',async function (req, res) {
    // req.body.user_mobile_no = '7358780824';
      let a = [];
    if(req.body.service_name == 'Breakdown Serivce'){
    var user_detail  =  await breakdown_managementModel.find({SMU_SCH_MECHCELL : req.body.user_mobile_no,SMU_SCH_SERTYPE : 'B',"JOB_STATUS": "Not Started"});
        user_detail.forEach(element => {
        a.push({
            job_no : element.SMU_SCH_JOBNO,
            key_value : element.SMU_SCH_COMPNO
        });
        });
    }

    if(req.body.service_name == 'Preventive Maintenance'){
    var user_detail  =  await breakdown_managementModel.find({SMU_SCH_MECHCELL : req.body.user_mobile_no,SMU_SCH_SERTYPE : 'P',"JOB_STATUS": "Not Started"});
        user_detail.forEach(element => {
        a.push({
            job_no : element.SMU_SCH_JOBNO,
            key_value : element.SMU_SCH_COMPNO
        });
        });
    }

     if(req.body.service_name == 'Breakdown MR Approval'){
    var user_detail  =  await breakdown_mr_data_managementModel.find({JLS_SCHM_ENGR_PHONE : req.body.user_mobile_no,JLS_SCHM_SERTYPE : 'B',"JOB_STATUS": "Not Started"});
        user_detail.forEach(element => {
        a.push({
            job_no : element.JLS_SCHM_JOBNO,
            key_value : element.JLS_SCHM_COMPNO
        });
        });
    }


     if(req.body.service_name == 'Preventive MR Approval'){
    var user_detail  =  await breakdown_mr_data_managementModel.find({JLS_SCHM_ENGR_PHONE : req.body.user_mobile_no,JLS_SCHM_SERTYPE : 'P',"JOB_STATUS": "Not Started"});
        user_detail.forEach(element => {
        a.push({
            job_no : element.SMU_SCH_JOBNO,
            key_value : element.SMU_SCH_COMPNO
        });
        });
    }


     if(req.body.service_name == 'LR SERVICE'){
    var user_detail  =  await lr_service_managementModel.find({SMU_SEN_MOBILENO : req.body.user_mobile_no,"JOB_STATUS": "Not Started"});
        user_detail.forEach(element => {
        a.push({
            job_no : element.SMU_SCQH_JOBNO,
            key_value : element.SMU_SCQH_QUOTENO
        });
        });
    }


     if(req.body.service_name == 'Parts Replacement ACK'){
    var user_detail  =  await part_reply_service_managementModel.find({SMU_ACK_MOBILENO : req.body.user_mobile_no,"JOB_STATUS": "Not Started"});
        user_detail.forEach(element => {
        a.push({
            job_no : element.SMU_ACK_JOBNO,
            key_value : element.SMU_ACK_COMPNO
        });
        });
    }

    if(req.body.service_name == 'AUDIT'){
    var user_detail  =  await audit_data_managementModel.find({OM_OSA_MOBILE : req.body.user_mobile_no,"JOB_STATUS": "Not Started"});
        user_detail.forEach(element => {
        a.push({
            job_no : element.OM_OSA_JOBNO,
            key_value : element.OM_OSA_COMPNO
        });
        });
    }
      res.json({Status:"Success",Message:"job_list", Data : a ,Code:200});
});




router.post('/customer_details',async function (req, res) {
    // req.body.service_name = 'Preventive Maintenance';
   if(req.body.service_name == 'Breakdown Serivce'){
    var user_detail  =  await breakdown_managementModel.findOne({SMU_SCH_COMPNO:req.body.key_value});
           let a = {
    job_id : user_detail.SMU_SCH_JOBNO,
    customer_name : user_detail.SMU_SCH_CUSNAME,
    address_one : user_detail.SMU_SCH_CUSADD1,
    address_two : user_detail.SMU_SCH_CUSADD2,
    address_three : user_detail.SMU_SCH_CUSADD3,
    pin_code : user_detail.SMU_SCH_CUSPIN,
    contract_type : user_detail.SMU_SCH_AMCTYPE,
    contract_status : user_detail.SMU_SCH_JOBCURSTARTUS,
    number :user_detail.SMU_SCH_COMPNO,
    data_and_time: user_detail.SMU_SCH_CRTDT,
    type : user_detail.SMU_SCH_AMCTYPE,
    mech_name :''
   }
   res.json({Status:"Success",Message:"getlist_userlist", Data : a ,Code:200});
    }

    if(req.body.service_name == 'Preventive Maintenance'){
    var user_detail  =  await breakdown_managementModel.findOne({SMU_SCH_COMPNO:req.body.key_value});
                 let a = {
    job_id : user_detail.SMU_SCH_JOBNO,
    customer_name : user_detail.SMU_SCH_CUSNAME,
    address_one : user_detail.SMU_SCH_CUSADD1,
    address_two : user_detail.SMU_SCH_CUSADD2,
    address_three : user_detail.SMU_SCH_CUSADD3,
    pin_code : user_detail.SMU_SCH_CUSPIN,
    contract_type : user_detail.SMU_SCH_AMCTYPE,
    contract_status : user_detail.SMU_SCH_JOBCURSTARTUS,
    number :user_detail.SMU_SCH_COMPNO,
    data_and_time: user_detail.SMU_SCH_CRTDT,
    type : user_detail.SMU_SCH_AMCTYPE,
    mech_name :''
   }

   res.json({Status:"Success",Message:"getlist_userlist", Data : a ,Code:200});
    }

     if(req.body.service_name == 'Breakdown MR Approval'){
    var user_detail  =  await breakdown_managementModel.findOne({SMU_SCH_COMPNO:req.body.key_value});
                 let a = {
    job_id : user_detail.SMU_SCH_JOBNO,
    customer_name : user_detail.SMU_SCH_CUSNAME,
    address_one : user_detail.SMU_SCH_CUSADD1,
    address_two : user_detail.SMU_SCH_CUSADD2,
    address_three : user_detail.SMU_SCH_CUSADD3,
    pin_code : user_detail.SMU_SCH_CUSPIN,
    contract_type : user_detail.SMU_SCH_AMCTYPE,
    contract_status : user_detail.SMU_SCH_JOBCURSTARTUS,
    number :user_detail.SMU_SCH_COMPNO,
    data_and_time: user_detail.SMU_SCH_CRTDT,
    type : user_detail.SMU_SCH_AMCTYPE,
    mech_name :''
   }

   res.json({Status:"Success",Message:"getlist_userlist", Data : a ,Code:200});
    }
     if(req.body.service_name == 'Preventive MR Approval'){
    var user_detail  =  await breakdown_managementModel.findOne({SMU_SCH_COMPNO:req.body.key_value});
                 let a = {
    job_id : user_detail.SMU_SCH_JOBNO,
    customer_name : user_detail.SMU_SCH_CUSNAME,
    address_one : user_detail.SMU_SCH_CUSADD1,
    address_two : user_detail.SMU_SCH_CUSADD2,
    address_three : user_detail.SMU_SCH_CUSADD3,
    pin_code : user_detail.SMU_SCH_CUSPIN,
    contract_type : user_detail.SMU_SCH_AMCTYPE,
    contract_status : user_detail.SMU_SCH_JOBCURSTARTUS,
    number :user_detail.SMU_SCH_COMPNO,
    data_and_time: user_detail.SMU_SCH_CRTDT,
    type : user_detail.SMU_SCH_AMCTYPE,
    mech_name :''
   }

   res.json({Status:"Success",Message:"getlist_userlist", Data : a ,Code:200});
    }
     if(req.body.service_name == 'LR SERVICE'){
    var user_detail  =  await lr_service_managementModel.findOne({SMU_SCQH_QUOTENO : req.body.key_value});
                 let a = {
    job_id : user_detail.SMU_SCQH_JOBNO,
    customer_name : user_detail.SMU_SED_NAME,
    address_one : user_detail.SMU_SED_ADDRESS1,
    address_two : user_detail.SMU_SED_ADDRESS2,
    address_three : user_detail.SMU_SED_ADDRESS3,
    pin_code : user_detail.SMU_SED_PINCODE,
    contract_type : '',
    contract_status : '',
    number : user_detail.SMU_SCQH_QUOTENO,
    data_and_time: user_detail.SMU_SCQH_LRDT,
    type : user_detail.SMU_SED_SERTYPE,
    mech_name :''
   }
   res.json({Status:"Success",Message:"getlist_userlist", Data : a ,Code:200});
    }


     if(req.body.service_name == 'Parts Replacement ACK'){
    var user_detail  =  await part_reply_service_managementModel.findOne({SMU_ACK_COMPNO : req.body.key_value});
                 let a = {
    job_id : user_detail.SMU_ACK_JOBNO,
    customer_name : user_detail.SMU_ACK_ENGRNAME,
    address_one : user_detail.SMU_ACK_ADDRESS1,
    address_two : user_detail.SMU_ACK_ADDRESS2,
    address_three : user_detail.SMU_ACK_ADDRESS3,
    pin_code : user_detail.SMU_ACK_APINCODE,
    contract_type : user_detail.SMU_ACK_SERTYPE,
    contract_status : '',
    number : user_detail.SMU_ACK_COMPNO,
    data_and_time: user_detail.SMU_ACK_DCDT,
    type : '',
    mech_name :'',
   }

   res.json({Status:"Success",Message:"getlist_userlist", Data : a ,Code:200});
    }

    if(req.body.service_name == 'AUDIT'){
    var user_detail  =  await audit_data_managementModel.findOne({OM_OSA_COMPNO : req.body.key_value});
 let a = {
    job_id : user_detail.OM_OSA_JOBNO,
    customer_name : user_detail.OM_OSA_CUSNAME,
    address_one : '',
    address_two : '',
    address_three : '',
    pin_code : '',
    contract_type : '',
    contract_status : '',
    number : user_detail.OM_OSA_COMPNO,
    data_and_time: user_detail.OM_OSA_PREPDT,
    type : '',
    mech_name :''
   }

   res.json({Status:"Success",Message:"getlist_userlist", Data : a ,Code:200});
    }
      // res.json({Status:"Success",Message:"job_list", Data : a ,Code:200});



   

});




router.post('/getlist_userlist',async function (req, res) {
      var user_detail = await service_sub_adminMdodel.findOne({mobile_no:req.body.user_mobile_no});
      
      if(user_detail == null){
          res.json({Status:"Failed",Message:"Contact Admin", Data : [] ,Code:404});
      } else{
      recall(0);
      var a = [];
     async function recall(index_value) {
           if(index_value < user_detail.employee_detail.length){
            var user_detail_value  =  await service_user_management.findOne({user_mobile_no: user_detail.employee_detail[index_value].user_mobile_no});
            if(user_detail_value !== null){
            var status = 'Admin';
            if(user_detail_value.user_type == 'Log In'){
                status = 'USER';
            }
            if(user_detail_value.user_type == ''){
                status = 'Admin';
            }
            a.push(
            {
            user_type : status,
            user_name : user_detail.employee_detail[index_value].user_name,
            user_phone_no: user_detail.employee_detail[index_value].user_mobile_no
            }
            );
            }         
            var count = index_value + 1;
            recall(count);
           }else{
            res.json({Status:"Success",Message:"getlist_userlist", Data : a ,Code:200});
           }
       }   
      }

    
});





router.post('/edit', function (req, res) {
        service_adminModel.findByIdAndUpdate(req.body._id, req.body, {new: true}, function (err, UpdatedDetails) {
            if (err) return res.json({Status:"Failed",Message:"Internal Server Error", Data : {},Code:500});
             res.json({Status:"Success",Message:"Job_no_managment Updated", Data : UpdatedDetails ,Code:200});
        });
});



// // DELETES A USER FROM THE DATABASE
router.post('/admin_delete', function (req, res) {
      service_adminModel.findByIdAndRemove(req.body._id, function (err, user) {
          if (err) return res.json({Status:"Failed",Message:"Internal Server Error", Data : {},Code:500});
          res.json({Status:"Success",Message:"Job_no_managment Deleted successfully", Data : {} ,Code:200});
      });
});


// // DELETES A USER FROM THE DATABASE
router.post('/delete', function (req, res) {
      service_adminModel.findByIdAndRemove(req.body._id, function (err, user) {
          if (err) return res.json({Status:"Failed",Message:"Internal Server Error", Data : {},Code:500});
          res.json({Status:"Success",Message:"Job_no_managment Deleted successfully", Data : {} ,Code:200});
      });
});



module.exports = router;
