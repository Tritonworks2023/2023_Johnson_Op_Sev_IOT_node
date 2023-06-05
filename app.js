var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var bodyParser = require('body-parser');	
var fileUpload = require('express-fileupload');
var pdf = require('html-pdf');
// const puppeteer = require('puppeteer');
// const { v4: uuidv4 } = require('uuid');
const moment = require('moment');
var fs = require('fs');
var pug = require ('pug');
var request = require("request");
const cron = require("node-cron");
const pm2 = require('pm2')








cron.schedule("*/10 * * * * *", function () {
  console.log("---------------------");
  console.log("running a task every 10 seconds");
  /////Insert Breakdown Value to Oracle Every 10 Sec/////////////

   request.get(
       'http://smart.johnsonliftsltd.com:3000/api/service_userdetails/breakdown_data_submit_test_2_resubmit',
       {},
       function (error, response, body) {
           if (!error && response.statusCode == 200) {
           }
       }
   );

/////Insert Preventive Value to Oracle Every 10 Sec/////////////

  request.get(
       'http://smart.johnsonliftsltd.com:3000/api/preventive_service_data_management/submit_data_test_2_resubmit',
       {},
       function (error, response, body) {
           if (!error && response.statusCode == 200) {
           }
       }
   );

/////Insert MR Value to Oracle Every 10 Sec/////////////

  request.get(
       'http://smart.johnsonliftsltd.com:3000/api/preventive_service_data_management/service_mr_eng_mrlist_submit_test_2_resubmit',
       {},
       function (error, response, body) {
           if (!error && response.statusCode == 200) {
           }
       }
   );


/////MR Breakdown Preventive Auto Pull Every 10 Sec/////////////

request.get(
'http://smart.johnsonliftsltd.com:3000/api/auto_pull/breakdown_preventive_mr/create',
{},
function (error, response, body) {
if (!error && response.statusCode == 200) {
}
}
);


/////LR Auto Pull Every 10 Sec/////////////

request.get(
'http://smart.johnsonliftsltd.com:3000/api/auto_pull/lr_record/create',
{},
function (error, response, body) {
if (!error && response.statusCode == 200) {
}
}
);


/////Audit Auto Pull Every 10 Sec/////////////

request.get(
'http://smart.johnsonliftsltd.com:3000/api/auto_pull/audit/create',
{},
function (error, response, body) {
if (!error && response.statusCode == 200) {
}
}
);



/////Audit Auto Pull Every 10 Sec/////////////

request.get(
'http://smart.johnsonliftsltd.com:3000/api/auto_pull/part_replacement/create',
{},
function (error, response, body) {
if (!error && response.statusCode == 200) {
}
}
);



/////Material Request Auto Pull Every 10 Sec/////////////

request.get(
' http://smart.johnsonliftsltd.com:3000/api/auto_pull/material_reqeust/create',
{},
function (error, response, body) {
if (!error && response.statusCode == 200) {
}
}
);



});



cron.schedule("*/30 * * * * *", function () {
  console.log("---------------------");
  console.log("running a task every 30 seconds for");

request.get(
'http://smart.johnsonliftsltd.com:3000/api/auto_pull/breakdown_preventive/create_final_insert',
{},
function (error, response, body) {
if (!error && response.statusCode == 200) {
}
}
);










});



cron.schedule("* * 23 * * *", function () {
  console.log("---------------------");
  console.log("running a task at 11:00 PM");
    request.get(
       'http://smart.johnsonliftsltd.com:3000/api/service_userdetails/fetch_login_details',
       {},
       function (error, response, body) {
           if (!error && response.statusCode == 200) {
           }
       }
   ); 
   
});



cron.schedule("* 30 23 * * *", function () {
  console.log("---------------------");
  console.log("running a task at 11:30 PM");
    request.get(
       'http://smart.johnsonliftsltd.com:3000/api/service_userdetails/fetch_login_details',
       {},
       function (error, response, body) {
           if (!error && response.statusCode == 200) {
           }
       }
   ); 

});




// Operation Module
var responseMiddleware = require('./middlewares/response.middleware');
var ActivityRouter = require('./routes/Activity.routes');
var user_managementRouter = require('./routes/user_management.routes');
var roll_managementRouter = require('./routes/roll_management.routes');
var field_managementRouter = require('./routes/field_management.routes');
var data_store_managementRouter = require('./routes/data_store_management.routes');
var service_managementRouter = require('./routes/service_management.routes');
var activity_listRouter = require('./routes/activedetail_management.routes');
var activedetail_managementRouter = require('./routes/activedetail_management.routes');
var Job_no_managmentRouter = require('./routes/Job_no_managment.routes');
var group_detail_managmentRouter = require('./routes/group_detail.routes');
var sub_group_detail_managmentRouter = require('./routes/sub_group_detail.routes');
var diagram_data = require('./routes/diagram_data.routes');
var attendance = require('./routes/attendance.routes');
var audit_user_management = require('./routes/audit_user_managemnets.routes');
var scanned_qr_details = require('./routes/scanned_qr_details.routes');
var joininspectionRouter = require('./routes/joininspection.routes');
var new_group_detail_managment = require('./routes/new_group_detail.routes');






// Service Module 
var service_userdetails = require('./routes/service_userdetails.routes');
var service_attendance = require('./routes/service_attendance.routes');
var service_activity = require('./routes/service_activity.routes');
var service_employee_activity_allocation = require('./routes/service_employee_activity_allocation.routes');
var breakdown_management = require('./routes/breakdown_management.routes');
var breakdown_data_management = require('./routes/breakdown_data_management.routes');
var preventive_service_data_management = require('./routes/preventive_service_data_management.routes');
var preventive_data_management = require('./routes/preventive_data_management.routes');
var service_admin = require('./routes/service_admin.routes');
var lr_service_data_management = require('./routes/lr_service_data_management.routes');
var part_replacement = require('./routes/part_replacement_routes.routes');
var temp_data_storedata = require('./routes/temp_data_storedata.routes');
var service_temp_data = require('./routes/service_temp_data.routes');
var audit_data_management = require('./routes/audit_data_management.routes');
var service_sub_admin = require('./routes/service_sub_admin.routes');
var admin_access = require('./routes/admin_access.routes');
var notification = require('./routes/notification.routes');
var pop_notification = require('./routes/pop_notification.routes');
var location_tracking_job_wise = require('./routes/location_tracking_job_wise.routes');
var auto_pull = require('./routes/auto_pull.routes');
var iot_branch_code = require('./routes/iot_branch_code.routes');

var van = require('./routes/van.routes');


// tab User Manag
var tab_usermanager = require('./routes/tab_usermanager.routes');
var tab_form_three = require('./routes/tab_form3.routes');



//IOT
var iot_usermanagement = require('./routes/iot_usermanagement.routes');



////Additional Form Details//////

var additional_forms = require('./routes/additional_forms.routes');


/*Database connectivity*/
var BaseUrl = "http://smart.johnsonliftsltd.com:3000/api"; 
const mongoose = require('mongoose'); 
mongoose.connect('mongodb://0.0.0.0:27017/jhonsonapp'); 
var db = mongoose.connection; 
db.on('error', console.log.bind(console, "connection error")); 
db.once('open', function(callback){ 
    console.log("connection succeeded"); 
}) 




var app = express();

app.use(fileUpload());
app.use(responseMiddleware());

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');
app.set('view engine', 'pug');



app.use(express.json({limit: '50mb'}));
app.use(express.urlencoded({limit: '50mb',extended : true}));


/*Response settings*/

app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
  res.setHeader('Access-Control-Allow-Headers', 'Access-Control-Allow-Headers, Origin,Accept, X-Requested-With, Content-Type, Access-Control-Request-Method, Access-Control-Request-Headers,X-Access-Token,XKey,Authorization');
  next();
});






app.post('/upload', function(req, res) {
  var sampleFile;
  var uploadPath;
  if (!req.files || Object.keys(req.files).length === 0) {
    res.json({Status:"Failed",Message:"No File Found", Data :{},Code:404});
    return;
  } else {
  var temp_data
  sampleFile = req.files.sampleFile;
  var exten = sampleFile.name.split('.');
  var filetype = exten[exten.length - 1];
  var name = ""+new Date().getTime() + "." + filetype;
  uploadPath = __dirname + '/public/uploads/' + name;
  var Finalpath =  BaseUrl +'/uploads/' + name;
  sampleFile.mv(uploadPath, function(err) {
    if (err) {
   console.log(err)
   return res.error(500, "Internal server error");
    }
   res.json({Status:"Success",Message:"file upload success", Data :Finalpath,Code:200});
  });
  }
});




app.post('/upload2', function(req, res) {
  let sampleFile;
  let uploadPath;
  if (!req.files || Object.keys(req.files).length === 0) {
    res.json({Status:"Failed",Message:"No File Found", Data :{},Code:404});
    return;
  } else {
  var temp_data
  sampleFile = req.files.sampleFile;
  var exten = sampleFile.name.split('.');
  var filetype = exten[exten.length - 1];
  var name = ""+new Date().getTime() + "." + filetype;
  uploadPath = __dirname + '/public/uploads/' + name;
  var Finalpath =  BaseUrl +'/uploads/' + name;
  sampleFile.mv(uploadPath, function(err) {
    if (err) {
   console.log(err)
   return res.error(500, "Internal server error");
    }
   res.json({Status:"Success",Message:"file upload success", Data :Finalpath,Code:200});
  });

  }
});




app.post('/service_visiblity_upload', function(req, res) {
  let sampleFile;
  let uploadPath;
  if (!req.files || Object.keys(req.files).length === 0) {
    res.json({Status:"Failed",Message:"No File Found", Data :{},Code:404});
    return;
  }else {
  var temp_data
  sampleFile = req.files.sampleFile;
  var exten = sampleFile.name.split('.');
  var filetype = exten[exten.length - 1];
  const dates = require('date-and-time');
  const now1  =  new Date(req.body.program_date);
  const value1 = dates.format(now1,'YYYYMMDD');
  var name = ""+req.body.cat_type+"_"+req.body.job_id+"_"+value1+"_"+new Date().getTime()+ "." + filetype;
  console.log("File Name",name);
  uploadPath = __dirname + '/public/SERVPRO' + new Date().getFullYear() +'/' + name;
  var Finalpath =  BaseUrl +'/SERVPRO' + new Date().getFullYear() +'/' + name;
  console.log("uploaded path",uploadPath )
  sampleFile.mv(uploadPath, function(err) {
    if (err) {
   console.log(err)
   return res.error(500, "Internal server error");
    }
   res.json({Status:"Success",Message:"file upload success", Data :Finalpath,Code:200});
  });
}
});



app.post('/failure_report_upload', function(req, res) {
  console.log(req.body);
  let sampleFile;
  let uploadPath;
  if (!req.files || Object.keys(req.files).length === 0) {
    res.json({Status:"Failed",Message:"No File Found", Data :{},Code:404});
    return;
  }else {
  var temp_data
  sampleFile = req.files.sampleFile;
  var exten = sampleFile.name.split('.');
  var filetype = exten[exten.length - 1];
  fs.exists(path.join(__dirname + '/public/CVRPHOTOS', req.body.seq_no), (exists) => {
  // console.log(exists);
  if(exists == true){
  var name = "FR"+"_"+req.body.job_id+"_"+new Date().getTime()+ "." + filetype;
  console.log("File Name",name);
  uploadPath = __dirname + '/public/CVRPHOTOS/'+req.body.seq_no+'/'+ name;
  var Finalpath =  BaseUrl +'/CVRPHOTOS/' +req.body.seq_no+ '/' + name;
  console.log("uploaded path",uploadPath )
  sampleFile.mv(uploadPath, function(err) {
    if (err) {
   console.log(err)
   return res.error(500, "Internal server error");
    }
   res.json({Status:"Success",Message:"file upload success", Data :Finalpath,Code:200});
  });
  } else {
  fs.mkdirSync(path.join(__dirname + '/public/CVRPHOTOS', req.body.seq_no), true);
  var name = "FR"+"_"+req.body.job_id+"_"+new Date().getTime()+ "." + filetype;
  console.log("File Name",name);
  uploadPath = __dirname + '/public/CVRPHOTOS/'+req.body.seq_no+'/'+ name;
  var Finalpath =  BaseUrl +'/CVRPHOTOS/' +req.body.seq_no+ '/' + name;
  console.log("uploaded path",uploadPath )
  sampleFile.mv(uploadPath, function(err) {
    if (err) {
   console.log(err)
   return res.error(500, "Internal server error");
    }
   res.json({Status:"Success",Message:"file upload success", Data :Finalpath,Code:200});
  });
  }
  });
}
});


app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use('/api/', express.static(path.join(__dirname, 'public')));
app.use('/api/', express.static(path.join(__dirname, 'routes')));
app.use('/api/', express.static(path.join(__dirname, 'Gad_Drawing')));


///////Operation Module///////////////

app.use ('/api/activity', ActivityRouter);
app.use ('/api/user_management', user_managementRouter);
app.use ('/api/roll_management', roll_managementRouter);
app.use ('/api/activedetail_management', activedetail_managementRouter);
app.use ('/api/field_management', field_managementRouter);
app.use ('/api/service_management', service_managementRouter);
app.use ('/api/attendance', attendance);
app.use ('/api/job_no_managment', Job_no_managmentRouter);
app.use ('/api/activity_list_management', activity_listRouter);
app.use ('/api/group_detail_managment', group_detail_managmentRouter);
app.use ('/api/sub_group_detail_managment', sub_group_detail_managmentRouter);
app.use ('/api/diagram_data', diagram_data);
app.use ('/api/data_store_management', data_store_managementRouter);
app.use ('/api/joininspection', joininspectionRouter);
app.use ('/api/new_group_detail_managment', new_group_detail_managment);
app.use ('/api/audit_user_management', audit_user_management);
app.use ('/api/admin_access', admin_access);
app.use ('/api/scanned_qr_details', scanned_qr_details);
app.use ('/api/tab_usermanager', tab_usermanager);
app.use ('/api/iot_usermanagement', iot_usermanagement);
app.use ('/api/tab_form_three', tab_form_three);
app.use ('/api/iot_branch_code', iot_branch_code);





///////Serive Moduel///////////////

app.use('/api/service_userdetails',service_userdetails);
app.use('/api/service_attendance',service_attendance);
app.use('/api/service_activity',service_activity);
app.use('/api/breakdown_management',breakdown_management);
app.use('/api/service_employee_activity_allocation',service_employee_activity_allocation);
app.use('/api/breakdown_data_management',breakdown_data_management);
app.use('/api/preventive_service_data_management',preventive_service_data_management);
app.use('/api/preventive_data_management',preventive_data_management);
app.use('/api/service_admin',service_admin);
app.use('/api/lr_service_data_management',lr_service_data_management);
app.use('/api/part_replacement',part_replacement);
app.use('/api/temp_data_storedata',temp_data_storedata);
app.use('/api/service_temp_data',service_temp_data);
app.use('/api/audit_data_management',audit_data_management);
app.use ('/api/service_sub_admin', service_sub_admin);
app.use ('/api/notification', notification);
app.use ('/api/pop_notification', pop_notification);
app.use ('/api/location_tracking_job_wise', location_tracking_job_wise);
app.use ('/api/auto_pull', auto_pull);
app.use ('/api/van', van);



//////IOT LIFT DATA (Develop By New person)//////////

app.use('/api/users', require('./users/users.controller'));
app.use('/api/devicescheduletableschemas', require('./routes/iotlift.routes'));




///// Additional Forms //////////
app.use ('/api/additional_forms', additional_forms);












// catch 404 and forward to error handler
app.use(function(req, res, next) {
  // next(createError(404));
 res.status(404).end('Page Not Found');
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
