const express = require('express');
const router = express.Router();
const userService = require('./user.service');

// routes
router.post('/authenticate', authenticate);
router.post('/createUserDetails', createUserDetails);
router.post('/updateUserDetails', updateUserDetails);
router.post('/findUserDetails', findUserDetails);
router.post('/deleteUser', deleteUser);
router.get('/getUserList', getUserList);
router.post('/deleteUserDetails', deleteUserDetails);


module.exports = router;

function authenticate(req, res, next) {
    userService.authenticate(req.body)
        .then(user =>{
          res.json(user );
        }).catch(next);
}



function createUserDetails(req, res, next) {
  userService.createUserDetails(req.body)
        .then(response =>{
          res.json(response);
        }).catch(next);
}

function updateUserDetails(req, res, next) {
  userService.updateUserDetails(req.body)
        .then(response =>{
          res.json(response);
        }).catch(next);
}

// function deletesalesPerson(req, res, next) {
//   userService.deletesalesPerson(req.body.recordId)
//         .then(response =>{
//           res.json(response);
//         }).catch(next);
// }

function getUserList(req, res, next) {
  userService.getUserList().then( response =>{
         res.json(response);
        }).catch(next);
}

function findUserDetails(req, res, next) {
  userService.findUserDetails(req.body).then( response =>{
         res.json(response);
        }).catch(next);
}


function deleteUser(req, res, next) {
  userService.deleteUser(req.body).then( response =>{
         res.json(response);
        }).catch(next);
}


function deleteUserDetails(req, res, next) {
  userService.deleteUserDetails(req.body).then( response =>{
         res.json(response);
        }).catch(next);
}

