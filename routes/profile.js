var express = require('express');
var router = express.Router();
var db = require('../data/db');
var ObjectID = require('mongodb').ObjectID;
var jwt = require('jsonwebtoken');
var assert = require('assert');

//profile/edit
//profile/search/email/
//profile/search/id/
//profile/isRegistered/email
//profile/filter/email
//profile/isAlreadyInvited/email

router.use('/',function(req,res,next){
    jwt.verify(req.body.token,'secret',function(err,decoded){
        if(err){
            res.status(500).send();
        }else{
            next();
        }
    })
});

router.post('/edit',function(req, res){
    var decoded = jwt.decode(req.body.token);
    var email = decoded.info.email;
    db.updateOne(
        { email : email },
        { $set: req.body.profile },
        "profiles"
    ).then(
        function(result) {
            assert.equal(1, result.result.ok);
            res.status(200).send(req.body.profile);
        }
    ).catch(
        function(err){
            res.status(500).send();
            console.log(err);
        }
    );
});

router.post('/isRegistered/email',function(req, res){
    db.findOne(
        {email:req.body.email},
        "profiles"
    ).then(function(result) {
            assert.notEqual(null, result);
            res.status(200).send({email:req.body.email,isRegistered:true});
    }).catch(
        function(err){
            res.status(200).send({email:req.body.email,isRegistered:false});
            console.log(err);
        }
    )
});
//todo too many calls
router.post('/filter/email',function(req, res){
    db.find(
        { email: { $regex: new RegExp("^"+req.body.email,"i") }},
        "profiles",
        { email:1,_id:0}
    ).then(
        function(result) {
            assert.notEqual(null, result);
            res.status(200).send(result);
    }).catch(
        function(err){
            res.status(500).send();
            console.log(err);
        }
    )
});

router.post('/isAlreadyInvited/email',function(req, res){
    db.findOne(
        {project:req.body.projectID,invited:req.body.email},
        "invites"
    ).then(
        function(result) {
            assert.notEqual(null, result);
            res.status(200).send({email:req.body.email,exist:true});
    }).catch(
        function(err){
            res.status(200).send({email:req.body.email,exist:false});
            console.log(err);
        }
    )
});

router.post('/get',function(req, res){
    var decoded = jwt.decode(req.body.token);
    var email = decoded.info.email;
    db.findOne(
        {email:email},
        "profiles"
    ).then(
        function(result) {
            assert.notEqual(null, result);
            res.status(200).send({profile:result});
        }
    ).catch(
        function(err){
            res.status(500).send();
            console.log(err);
        }
    )
});

router.post('/search/email',function(req, res){
    db.findOne(
        {email:req.body.email},
        "profiles"
    ).then(
        function(result) {
            assert.notEqual(null, result);
            res.status(200).send({profile:result});
        }
    ).catch(
        function(err){
            res.status(500).send();
            console.log(err);
        }
    )
});

module.exports = router;