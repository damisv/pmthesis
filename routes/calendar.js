var express = require('express');
var router = express.Router();
var jwt = require('jsonwebtoken');
var db = require('../data/db');
var assert = require('assert');
var ObjectID = require('mongodb').ObjectID;

router.use('/',function(req,res,next){
    jwt.verify(req.body.token,'secret',function(err){
        if(err){
            res.status(500).send();
        }else{
            next();
        }
    })
});

router.post('/myEvents',function(req, res){
    var decoded = jwt.decode(req.body.token);
    var email = decoded.info.email;
    //var user_id = decoded.info._id;
    db.find(
        {email: email},
        "events"
    ).then(
        function(result) {
            assert.notEqual(null, result);
            res.status(200).send({events:result});
        }
    ).catch(
        function(err){
            res.status(500).send();
            console.log(err);
        });
});

router.post('/projectEvents',function(req, res){
    db.find(
        {project_id: req.body.id},
        "events"
    ).then(
        function(result) {
            assert.notEqual(null, result);
            res.status(200).send({events:result});
        }
    ).catch(
        function(err){
            res.status(500).send();
            console.log(err);
        });
});

router.post('/teamEvents',function(req, res){
    console.log("Get teamEvent",req.body.id);
    db.find(
        {team_id: req.body.id},
        "events"
    ).then(
        function(result) {
            assert.notEqual(null, result);
            res.status(200).send({events:result});
        }
    ).catch(
        function(err){
            res.status(500).send();
            console.log(err);
        });
});

router.post('/myEvents/schedule',function(req, res){
    var decoded = jwt.decode(req.body.token);
    var email = decoded.info.email;
    req.body.event.email = email;
    db.insertOne(
        req.body.event,
        "events"
    ).then(
        function(result) {
            assert.notEqual(null, result);
            console.log(result.ops[0]);
            res.status(200).send({event:result.ops[0]});
        }).catch(
        function(err){
            res.status(500).send();
            console.log(err);
        })
});

router.post('/myEvents/delete',function(req, res){
    var decoded = jwt.decode(req.body.token);
    req.body.event._id = ObjectID(req.body.event._id);
    db.deleteOne(
        {_id:req.body.event._id},
        "events"
    ).then(
        function(result) {
            assert.equal(1, result.result.ok);
            res.status(200).send({event:req.body.event});
        }).catch(
        function(err){
            res.status(500).send();
            console.log(err);
        })
});

router.post('/myEvents/update',function(req, res){
    var decoded = jwt.decode(req.body.token);
    tempID = req.body.event._id;
    console.log(req.body.event.end);
    req.body.event._id = ObjectID(req.body.event._id);
    db.updateOne(
        {_id:req.body.event._id},
        req.body.event,
        "events"
    ).then(
        function(result) {
            assert.equal(1, result.result.ok);
            req.body.event._id = tempID;
            res.status(200).send({event:req.body.event});
        }).catch(
        function(err){
            res.status(500).send();
            console.log(err);
        })
});

router.post('/projectEvents/schedule',function(req, res){
    //var decoded = jwt.decode(req.body.token);
    //req.body.event.email = decoded.info.email;
    req.body.event.project_id = req.body.id;
    db.save(
        req.body.event,
        "events"
    ).then(
        function(result) {
            assert.equal(1, result.result.ok);
            res.status(200).send({event:req.body.event});
        }).catch(
        function(err){
            res.status(500).send();
            console.log(err);
        })
});

router.post('/teamEvents/schedule',function(req, res){
    console.log("Scheduled an teamEvent",req.body.id);
    req.body.event.team_id = req.body.id;
    db.save(
        req.body.event,
        "events"
    ).then(
        function(result) {
            assert.equal(1, result.result.ok);
            res.status(200).send({event:req.body.event});
        }).catch(
        function(err){
            res.status(500).send();
            console.log(err);
        })
});
module.exports = router;