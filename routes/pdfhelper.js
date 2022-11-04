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
var fs = require('fs');
var pug = require ('pug');
var BaseUrl = "http://smart.johnsonliftsltd.com:3000";
var app = express();
app.use('/api/', express.static(path.join(__dirname, 'routes')));




exports.pdfgenerator = async function (datas) {
   try{
    //console.log(Prescription_data);
    console.log("image path");
       var source = fs.readFileSync(path.resolve(__dirname, "./views/onepage.pug"),'utf-8');
     var Specilization = "";
     let template = pug.compile(source);
     let data = datas;
     // console.log(data);
     let html = template(data);
     //console.log(html)
     // console.log("What is the path" , __dirname)
        var options = { format: 'Letter', height: "20.5in",
  width: "18in"};
        var filepath = __dirname + '/public/prescriptions/' + uuidv4() + '.pdf' ;
        var filepart = filepath.slice(60,100);
        // console.log("filepart",filepath)
        var Finalpath = BaseUrl +'/api/public/prescriptions/' + filepart;
        // console.log("Finalpath",Finalpath)
         return new Promise(async function (resolve, reject) {
                 await pdf.create(html, options).toFile(filepath, function(err, response) {
                    if (err){
                        console.log(err)
                        reject( false);
                    }
                    resolve(Finalpath);
                });
            });
         return Finalpath;
        //var html = pug.compileFile(layout, { pretty: true })(locals);
      }
      catch(e){
        console.log(e)
       return false;
      }
}
