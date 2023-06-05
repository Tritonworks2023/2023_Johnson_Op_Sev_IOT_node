


// import hex2Bin from 'hex-to-bin';
var express = require('express');
var router = express.Router();
var bodyParser = require('body-parser');
router.use(bodyParser.urlencoded({ extended: false }));
router.use(bodyParser.json());
var tab_user_management = require('./../models/tab_usermanagerModel');

const DevicescheduleServiceModelSchema = require('./../models/devicescheduletableschemas.model');
var ObjectId = require('mongoose').mongo.ObjectId;
const TemIDSchema = require('./../models/temp-id');




router.post('/getlist_status_by_liftid', async function (req, res) {
 

 var liftId = req.body && req.body.liftId ? req.body.liftId : "L-G8884"; 
 var limit = req.body && req.body.limit ? parseInt(req.body.limit):50;
  // var liftId = req.body.liftId; 
 
  var tempObj = {};
  var tempAryy = [];


  var tempObj1 = {};
  var tempAryy1 = [];


////fetch one value;
let List = await DevicescheduleServiceModelSchema.find({liftId: liftId}).sort({_id:-1}).limit(1);


let tempIdList = await TemIDSchema.find({_id: new ObjectId("63bbe41c83f55d83168b22b7")}).sort({_id:-1}).limit(1);
var ids = tempIdList[0] && tempIdList[0].temp_id ? tempIdList[0].temp_id:'6388803406b642432fc3fdad';
var objID = ObjectId(ids);

(objID);

////last 100
let Lists = await DevicescheduleServiceModelSchema.find({_id:{ $gt: objID}, liftId:liftId}).sort({_id:-1}).limit(20);


  await List && List.forEach(ele => {   
        
      
      



      if (ele.floorAndDoorStatusValue) {
          var binaryValue = hexToBinary(ele.floorAndDoorStatusValue);
          let tempfloor_no = binaryValue.substr(binaryValue.length - 5); //.substr(id.length - 5);
            
          // ------   BIT POS   15  14  13  12  11  10   9   8   7    6    5    4    3    2    1    0
          // ------   BYTE POS   1   2   3   4   5   6   7   8   9   10   11   12   13   14   15   16   
          
       
          let El_up_direction = binaryValue[5 - 1];  // BYTE POS - 1 to find the binaryValue
          let El_down_direction = binaryValue[5 - 1];   // BYTE POS - 1 to find the binaryValue
          let El_run  = binaryValue[4 - 1]; // BYTE POS - 1 to find the binaryValue
          let Door_Full_Open  = binaryValue[7 - 1]; // BYTE POS - 1 to find the binaryValue
          let Door_Full_close = binaryValue[6 - 1]; // BYTE POS - 1 to find the binaryValue
          let Door_parti_Open =  binaryValue[8 - 1];  // BYTE POS - 1 to find the binaryValue


         
         
  
          tempObj = {
              Floor_position : binToDec(tempfloor_no),
              El_up_direction : El_up_direction[0],
              El_down_direction :  El_up_direction[0],
              El_run :  El_run[0],
              Door_Full_Open :  Door_Full_Open[0],
              Door_Full_close : Door_Full_close[0],
              Door_parti_Open : Door_parti_Open[0],
              Car_auto : "",
              Car_attd_mode : "" ,
              FireMan : "",
              EL_maintain_mode : "" ,
              Power_fail : "",

              park_mode : "",
              full_load : "",
              over_load : "",
              error : "",


              Code : "40002",
              id: ele._id,
              deviceId: ele.deviceId,
              liftId: ele.liftId,
              getTimestamp:ObjectId(ele._id).getTimestamp(),
              scheduleServerTimestamp : ""+new Date(ele.scheduleServerTimestamp).toLocaleDateString('en-US')+" "+new Date(ele.scheduleServerTimestamp).toLocaleTimeString('en-US'),
              schedulePacketTimestamp : ""+new Date(ele.schedulePacketTimestamp).toLocaleDateString('en-US')+" "+new Date(ele.schedulePacketTimestamp).toLocaleTimeString('en-US'),
              scheduleDeviceTimestamp : ""+new Date(ele.scheduleDeviceTimestamp).toLocaleDateString('en-US')+" "+new Date(ele.scheduleDeviceTimestamp).toLocaleTimeString('en-US'),
              processorOutputStatusValue:ele.floorAndDoorStatusValue
          }

          tempAryy.push(tempObj);
      } else if (ele.modesAndEventsValue) {

         // ------   BIT POS   15  14  13  12  11  10   9   8   7    6    5    4    3    2    1    0  
         // ------   BYTE POS   1   2   3   4   5   6   7   8   9   10   11   12   13   14   15   16   



          var binaryValue = hexToBinary(ele.modesAndEventsValue);


          let Car_auto =  binaryValue[16  - 1];
          let Car_attd_mode =  binaryValue[16  - 1];
          let FireMan =  binaryValue[13 - 1];
          let EL_maintain_mode = binaryValue[12 - 1];
          let Power_fail = binaryValue[11 - 1];

          let Park_mode = binaryValue[14 - 1];
          let Full_load = binaryValue[7 - 1];
          let Over_load = binaryValue[8 - 1];
          let Errors = binaryValue[6  - 1];

          tempObj = {
              Floor_position : 0,
              El_up_direction : "",
              El_down_direction :  "",
              El_run :  "",
              Door_Full_Open :  "",
              Door_Full_close : "",
              Door_parti_Open : "",
              Car_auto : Car_auto[0],
              Car_attd_mode : Car_attd_mode[0],
              FireMan : FireMan[0],
              EL_maintain_mode : EL_maintain_mode[0],
              Power_fail : Power_fail[0],

              park_mode : Park_mode[0],
              full_load : Full_load[0],
              over_load : Over_load[0],
              error : Errors[0],

              Code : "40005",
              id: ele._id,
              deviceId: ele.deviceId,
              liftId: ele.liftId,
              scheduleServerTimestamp : ""+new Date(ele.scheduleServerTimestamp).toLocaleDateString('en-US')+" "+new Date(ele.scheduleServerTimestamp).toLocaleTimeString('en-US'),
              schedulePacketTimestamp : ""+new Date(ele.schedulePacketTimestamp).toLocaleDateString('en-US')+" "+new Date(ele.schedulePacketTimestamp).toLocaleTimeString('en-US'),
              scheduleDeviceTimestamp : ""+new Date(ele.scheduleDeviceTimestamp).toLocaleDateString('en-US')+" "+new Date(ele.scheduleDeviceTimestamp).toLocaleTimeString('en-US'),
              getTimestamp:ObjectId(ele._id).getTimestamp(),
              processorOutputStatusValue:ele.modesAndEventsValue
          }

          tempAryy.push(tempObj);
      }
  });

await Lists && Lists.forEach ( ele => {

 if (ele.floorAndDoorStatusValue) {
         
         // ------   BIT POS   15  14  13  12  11  10   9   8   7    6    5    4    3    2    1    0  
         // ------   BYTE POS   1   2   3   4   5   6   7   8   9   10   11   12   13   14   15   16  

          var binaryValue = hexToBinary(ele.floorAndDoorStatusValue);
          let tempfloor_no = binaryValue.substr(binaryValue.length - 5); //.substr(id.length - 5);

          let El_up_direction = binaryValue[5 - 1];  // BYTE POS - 1 to find the binaryValue
          let El_down_direction = binaryValue[5 - 1];   // BYTE POS - 1 to find the binaryValue
          let El_run  = binaryValue[4 - 1]; // BYTE POS - 1 to find the binaryValue
          let Door_Full_Open  = binaryValue[7 - 1]; // BYTE POS - 1 to find the binaryValue
          let Door_Full_close = binaryValue[6 - 1]; // BYTE POS - 1 to find the binaryValue
          let Door_parti_Open =  binaryValue[8 - 1];  // BYTE POS - 1 to find the binaryValue


          tempObj = {
              Floor_position : binToDec(tempfloor_no),
              El_up_direction : El_up_direction,
              El_down_direction :  El_up_direction,
              El_run :  El_run,
              Door_Full_Open :  Door_Full_Open,
              Door_Full_close : Door_Full_close,
              Door_parti_Open : Door_parti_Open,
              Car_auto : "",
              Car_attd_mode : "" ,
              FireMan : "",
              EL_maintain_mode : "" ,
              Power_fail : "",
              park_mode : "",
              full_load : "",
              over_load : "",
              error : "",
              Code : "40002",
              id: ele._id,
              deviceId: ele.deviceId,
              liftId: ele.liftId,
              getTimestamp:ObjectId(ele._id).getTimestamp(),
              scheduleServerTimestamp : ""+new Date(ele.scheduleServerTimestamp).toLocaleDateString('en-US')+" "+new Date(ele.scheduleServerTimestamp).toLocaleTimeString('en-US'),
              schedulePacketTimestamp : ""+new Date(ele.schedulePacketTimestamp).toLocaleDateString('en-US')+" "+new Date(ele.schedulePacketTimestamp).toLocaleTimeString('en-US'),
              scheduleDeviceTimestamp : ""+new Date(ele.scheduleDeviceTimestamp).toLocaleDateString('en-US')+" "+new Date(ele.scheduleDeviceTimestamp).toLocaleTimeString('en-US'),
              processorOutputStatusValue:ele.floorAndDoorStatusValue
          }


          tempAryy1.push(tempObj);
      } else if (ele.modesAndEventsValue) {
          var binaryValue = hexToBinary(ele.modesAndEventsValue);


        // ------   BIT POS   15  14  13  12  11  10   9   8   7    6    5    4    3    2    1    0  
         // ------   BYTE POS   1   2   3   4   5   6   7   8   9   10   11   12   13   14   15   16  

          let Car_auto =  binaryValue[16  - 1];
          let Car_attd_mode =  binaryValue[16  - 1];
          let FireMan =  binaryValue[13 - 1];
          let EL_maintain_mode = binaryValue[12 - 1];
          let Power_fail = binaryValue[11 - 1];

          let Park_mode = binaryValue[14 - 1];
          let Full_load = binaryValue[7 - 1];
          let Over_load = binaryValue[8 - 1];
          let Errors = binaryValue[6  - 1];


          tempObj = {
              Floor_position : 0,
              El_up_direction : "",
              El_down_direction :  "",
              El_run :  "",
              Door_Full_Open :  "",
              Door_Full_close : "",
              Door_parti_Open : "",
              Car_auto : Car_auto,
              Car_attd_mode : Car_attd_mode,
              FireMan : FireMan,
              EL_maintain_mode : EL_maintain_mode,
              Power_fail : Power_fail,
              park_mode : Park_mode[0],
              full_load : Full_load[0],
              over_load : Over_load[0],
              error : Errors[0],
              Code : "40005",
              id: ele._id,
              deviceId: ele.deviceId,
              liftId: ele.liftId,
              getTimestamp:ObjectId(ele._id).getTimestamp(),
              scheduleServerTimestamp : ""+new Date(ele.scheduleServerTimestamp).toLocaleDateString('en-US')+" "+new Date(ele.scheduleServerTimestamp).toLocaleTimeString('en-US'),
              schedulePacketTimestamp : ""+new Date(ele.schedulePacketTimestamp).toLocaleDateString('en-US')+" "+new Date(ele.schedulePacketTimestamp).toLocaleTimeString('en-US'),
              scheduleDeviceTimestamp : ""+new Date(ele.scheduleDeviceTimestamp).toLocaleDateString('en-US')+" "+new Date(ele.scheduleDeviceTimestamp).toLocaleTimeString('en-US'),
              processorOutputStatusValue:ele.modesAndEventsValue
          }
          tempAryy1.push(tempObj);
      }

  });







  if (List) {
     var id = tempAryy1[0] && tempAryy1[0].id ? tempAryy1[0].id :'6388803406b642432fc3fdad';
     await createID(id);
      var obj ={
   
     "One": tempAryy,
     "Multiple": tempAryy1,
     }

     var final_data = [];


     res.json({Status:"Success",Message:"successfully", Data : obj, objID : objID, Code:200}); 


    //   return obj;
  } else {
      throw "Get Lift List give error"
  }



 function binToDec(num) {
var inp =num;
var len = inp.length;
var string = inp.split("");
var counter = string.map(function(val, i) {
  return i;
}).reverse();

var storeBin = string.map(function(val, i) {
  return val * Math.pow(2, counter[i]);
});

var dec = 0; /* output */
for (i = 0; i < len; i++) {
  dec += storeBin[i]
}

return dec;
}


function hexToBinary(hex) {
    var binary = "";
    var remainingSize = hex.length;
    for (var p = 0; p < hex.length / 8; p++) {
        //In case remaining hex length (or initial) is not multiple of 8
        var blockSize = remainingSize < 8 ? remainingSize : 8;

        binary += parseInt(hex.substr(p * 8, blockSize), 16).toString(2).padStart(blockSize * 4, "0");

        remainingSize -= blockSize;
    }
    return binary;
   
}




async function createID(temp_id) {
    await TemIDSchema.findOneAndUpdate({ _id: new ObjectId("63bbe41c83f55d83168b22b7")},
        {
            $set: {
                temp_id: temp_id,
            },
        });
}






});


module.exports = router;