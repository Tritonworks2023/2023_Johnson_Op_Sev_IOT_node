var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var bodyParser = require('body-parser');	
var fileUpload = require('express-fileupload');
var pdf = require('html-pdf');
const puppeteer = require('puppeteer');
const { v4: uuidv4 } = require('uuid');
const moment = require('moment');
var fs = require('fs');
var pug = require ('pug');

/*Routing*/
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





var joininspectionRouter = require('./routes/joininspection.routes');
var new_group_detail_managment = require('./routes/new_group_detail.routes');
var iot_branch_code = require('./routes/iot_branch_code.routes');






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




// API DOC ///
var Usertype = require('./routes/document/Usertype.routes');

// var jobdetails = require('./routes/document/jobdetails.routes')
var companytype = require('./routes/document/companytype.routes');
var subscribertype = require('./routes/document/subscribertype.routes');
var companydetails = require('./routes/document/companydetails.routes');
var employeedetails = require('./routes/document/employeedetails.routes');
var projectdetails = require('./routes/document/projectdetails.routes');
var NotificationRouter = require('./routes/document/Notification.routes');
var contactusdetails = require('./routes/document/contactusdetails.routes');
var docdetails = require('./routes/document/docdetails.routes');
var apidocdetails = require('./routes/document/apidocdetails.routes');
var taskcatdetails = require('./routes/document/taskcatdetails.routes');
var taskitemdetails = require('./routes/document/taskitemdetails.routes');
var iosscreendetails = require('./routes/document/iosscreendetails.routes');
var webscreendetails = require('./routes/document/webscreendetails.routes');
var andoridscreendetails = require('./routes/document/andoridscreendetails.routes');
var livedetails = require('./routes/document/livedetails.routes');
var emaildetails = require('./routes/document/emaildetails.routes');
var catagroiesemail = require('./routes/document/catagroiesemail.routes');




// tab User Manag
var tab_usermanager = require('./routes/tab_usermanager.routes');
var tab_form_three = require('./routes/tab_form3.routes');



//IOT
var iot_usermanagement = require('./routes/iot_usermanagement.routes');


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
  let sampleFile;
  let uploadPath;


  if (!req.files || Object.keys(req.files).length === 0) {
    res.error(300,'No files were uploaded.');
    return;
  }


  console.log('req.files >>>', req.files); // eslint-disable-line
   console.log(sampleFile);
  var temp_data




  sampleFile = req.files.sampleFile;

   var exten = sampleFile.name.split('.');
  console.log(exten[exten.length - 1]);
  var filetype = exten[exten.length - 1];


  
  uploadPath = __dirname + '/public/uploads/' + new Date().getTime() + "." + filetype;

  var Finalpath =  BaseUrl +'/uploads/' + new Date().getTime() + "." + filetype;
   console.log("uploaded path",uploadPath )


  sampleFile.mv(uploadPath, function(err) {
    if (err) {
   console.log(err)
   return res.error(500, "Internal server error");
    }
   res.json({Status:"Success",Message:"file upload success", Data :Finalpath,Code:200});
  });
});




app.post('/upload2', function(req, res) {
  let sampleFile;
  let uploadPath;


  if (!req.files || Object.keys(req.files).length === 0) {
    res.error(300,'No files were uploaded.');
    return;
  }


  console.log('req.files >>>', req.files); // eslint-disable-line
   console.log(sampleFile);
  var temp_data




  sampleFile = req.files.sampleFile;

   var exten = sampleFile.name.split('.');
  console.log(exten[exten.length - 1]);
  var filetype = exten[exten.length - 1];


  
  uploadPath = __dirname + '/public/uploads/' + new Date().getTime() + "." + filetype;

  var Finalpath =  BaseUrl +'/uploads/' + new Date().getTime() + "." + filetype;
   console.log("uploaded path",uploadPath )


  sampleFile.mv(uploadPath, function(err) {
    if (err) {
   console.log(err)
   return res.error(500, "Internal server error");
    }
   res.json({Status:"Success",Message:"file upload success", Data :Finalpath,Code:200});
  });
});



app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use('/api/', express.static(path.join(__dirname, 'public')));
app.use('/api/', express.static(path.join(__dirname, 'routes')));


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






app.use ('/api/tab_usermanager', tab_usermanager);

app.use ('/api/iot_usermanagement', iot_usermanagement);
app.use ('/api/tab_form_three', tab_form_three);

app.use ('/api/iot_branch_code', iot_branch_code);









////API DOC/////

app.use('/api/usertype', Usertype);
app.use('/api/companytype', companytype);
app.use('/api/subscribertype', subscribertype);
app.use('/api/companydetails', companydetails);
app.use('/api/employeedetails', employeedetails);
app.use('/api/projectdetails', projectdetails);
app.use('/api/docdetails', docdetails);
app.use('/api/apidocdetails', apidocdetails);
app.use('/api/iosscreendetails', iosscreendetails);
app.use('/api/webscreendetails', webscreendetails);
app.use('/api/andoridscreendetails', andoridscreendetails);
app.use('/api/taskcatdetails', taskcatdetails);
app.use('/api/taskitemdetails', taskitemdetails);
app.use('/api/livedetails', livedetails);
app.use('/api/notifications',NotificationRouter);
app.use('/api/emaildetails',emaildetails);
app.use('/api/catagroiesemail',catagroiesemail);

app.use('/api/contactus',contactusdetails);
// app.use('/api/jobdetails',jobdetails);












// var user_managementRouter = require('./routes/user_management.routes');
// var roll_managementRouter = require('./routes/roll_management.routes');
// var categories_managementRouter = require('./routes/categories_management.routes');
// var field_managementRouter = require('./routes/field_management.routes');
// var data_store_managementRouter = require('./routes/data_store_management.routes');


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





//////IOT LIFT DATA (Develop By New person)//////////

app.use('/api/users', require('./users/users.controller'));








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
