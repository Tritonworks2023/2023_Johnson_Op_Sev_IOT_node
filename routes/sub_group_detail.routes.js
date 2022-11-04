var express = require('express');
var router = express.Router();
var bodyParser = require('body-parser');
router.use(bodyParser.urlencoded({ extended: false }));
router.use(bodyParser.json());
var sub_group_detailModel = require('./../models/sub_group_detailModel');


router.post('/create', async function(req, res) {
  try{

  await sub_group_detailModel.create({
  group_id : req.body.group_id || "",
  sub_group_detail_name :  req.body.sub_group_detail_name || "",
  sub_group_detail_created_at : req.body.sub_group_detail_created_at || "",
  sub_group_detail_update_at : req.body.sub_group_detail_update_at || "",
  sub_group_detail_created_by : req.body.sub_group_detail_created_by || "",
  sub_group_detail_updated_by : req.body.sub_group_detail_updated_by || "",
  form_type : req.body.form_type || "",
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
      sub_group_detailModel.remove({}, function (err, user) {
          if (err) return res.status(500).send("There was a problem deleting the user.");
             res.json({Status:"Success",Message:"sub_group_detailModel Deleted", Data : {} ,Code:200});     
      });
});


router.post('/getlist_id', function (req, res) {
     // req.body.group_id = '629ede01886f5404a75d4a91';
let datas = [{
form_type: "1",
group_id: "629ede01886f5404a75d4a91",
sub_group_detail_created_at: "3/8/2022, 3:35:28 PM",
sub_group_detail_created_by: "3/8/2022, 3:35:28 PM",
sub_group_detail_name: "Joint Insepection",
sub_group_detail_update_at: "",
sub_group_detail_updated_by: "",
__v: 0,
_id: "62272a6927c1eb17e6365877",
}];
res.json({Status:"Success",Message:"Sub_group_detailModel List", Data : datas ,Code:200});     

     // let final_data = []; 
     // var keyword = req.body.search_string.toLowerCase();
     //    sub_group_detailModel.find({group_id:req.body.group_id}, function (err, StateList) {
     //      if(StateList.length == 0 || req.body.search_string == ""){
     //        res.json({Status:"Success",Message:"Sub_group_detailModel List", Data : StateList ,Code:200});
     //      }else {
     //      for(let a = 0 ; a  < StateList.length; a ++){
     //      var active_text = StateList[a].sub_group_detail_name.toLowerCase();
     //      if(active_text.indexOf(keyword) !== -1 == true){
     //           final_data.push(StateList[a]);
     //      }
     //      if(a == StateList.length - 1){
     //         res.json({Status:"Success",Message:"Sub_group_detailModel List", Data : final_data ,Code:200});
     //      }
     //      }
     //      }
     //      // res.json({Status:"Success",Message:"State List", Data : StateList ,Code:200});
     //    });
});



router.get('/getlist', function (req, res) {
        sub_group_detailModel.find({}, function (err, Functiondetails) {
          res.json({Status:"Success",Message:"Functiondetails", Data : Functiondetails ,Code:200});
        });
});


router.post('/admin_delete', function (req, res) {
      sub_group_detailModel.findByIdAndRemove(req.body._id, function (err, user) {
          if (err) return res.json({Status:"Failed",Message:"Internal Server Error", Data : {},Code:500});
          res.json({Status:"Success",Message:"SubFunction Deleted successfully", Data : {} ,Code:200});
      });
});


router.get('/update_gorup_id',async function (req, res) {
    var sub_group_detail  =  await sub_group_detailModel.find({});
    let c = {
        "group_id": "629ede01886f5404a75d4a91",
    }
    for(let a  = 0 ; a < sub_group_detail.length ; a++){
        sub_group_detailModel.findByIdAndUpdate(sub_group_detail[a]._id, c, {new: true}, function (err, UpdatedDetails) {
            if (err) return res.json({Status:"Failed",Message:"Internal Server Error", Data : {},Code:500});
            console.log(UpdatedDetails);
             
        });
        if(a == sub_group_detail.length - 1){
            res.json({Status:"Success",Message:"Functiondetails Updated", Data : {} ,Code:200});
        }
    }
});


router.post('/edit', function (req, res) {
        sub_group_detailModel.findByIdAndUpdate(req.body.Activity_id, req.body, {new: true}, function (err, UpdatedDetails) {
            if (err) return res.json({Status:"Failed",Message:"Internal Server Error", Data : {},Code:500});
             res.json({Status:"Success",Message:"Functiondetails Updated", Data : UpdatedDetails ,Code:200});
        });
});



// // DELETES A USER FROM THE DATABASE
router.post('/delete', function (req, res) {
      sub_group_detailModel.findByIdAndRemove(req.body.Activity_id, function (err, user) {
          if (err) return res.json({Status:"Failed",Message:"Internal Server Error", Data : {},Code:500});
          res.json({Status:"Success",Message:"SubFunction Deleted successfully", Data : {} ,Code:200});
      });
});
module.exports = router;
