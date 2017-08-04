var express = require('express');
var router = express.Router();
var jwt = require('jsonwebtoken');
var db = require('../data/db');
var assert = require('assert');

router.use('/',function(req,res,next){
    jwt.verify(req.body.token,'secret',function(err,decoded){
        if(err){
            res.status(500).send();
        }else{
            next();
        }
    })
});

router.post('/get/message',function(req, res){
    db.find(
        {_id:req.body.message_id},
        "chat"
    ).then(
        function(result) {
            assert.notEqual(null, result);
            res.status(200).send({messages:result});
        }
    ).catch(
        function(err){
            res.status(500).send();
            console.log(err);
        });
});

router.post('/get/project',function(req, res){
    db.find(
        {receiver:req.body.project_id},
        "chat"
    ).then(
        function(result) {
            assert.notEqual(null, result);
            res.status(200).send({messages:result});
        }
    ).catch(
        function(err){
            res.status(500).send();
            console.log(err);
        });
});

router.post('/get',function(req, res){
    var decoded = jwt.decode(req.body.token);
    var email = decoded.info.email;
    db.find(
        { $or: [ {receiver:email}, {sender:email} ] },
        "tasks"
    ).then(
        function(result) {
            assert.notEqual(null, result);
            res.status(200).send({messages:result});
        }
    ).catch(
        function(err){
            res.status(500).send();
            console.log(err);
        });
});

router.post('/sent/project',function(req, res){
    var decoded = jwt.decode(req.body.token);
    var email = decoded.info.email;
    db.insertOne(
        {
            sender: email,
            receiver:req.body.receiver,
            message:req.body.message,
            date_created: new Date()
        },
        "chat"
    ).then(
        function(result) {
            assert.notEqual(null, result);
            res.status(200).send({message:result.ops[0]});
            require('../bin/www').io.sentMessageProject(req.body.receiver,result.ops[0]._id);
        }
    ).catch(
        function(err){
            res.status(500).send();
            console.log(err);
        }
    );
});

router.post('/sent',function(req, res){
    var decoded = jwt.decode(req.body.token);
    var email = decoded.info.email;
    db.insertOne(
        {
            sender_email: email,
            receiver:req.body.receiver,
            message:req.body.message,
            date_created: new Date()
        },
        "chat"
    ).then(
        function(result) {
            assert.notEqual(null, result);
            res.status(200).send({message:result.ops[0]});
            require('../bin/www').io.sentMessage(req.body.receiver,result.ops[0]._id);
        }
    ).catch(
        function(err){
            res.status(500).send();
            console.log(err);
        }
    );
});
module.exports = router;