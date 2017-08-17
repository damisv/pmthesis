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
    //TODO: myEvents from db
    var decoded = jwt.decode(req.body.token);
    var email = decoded.info.email;
    console.log("Get myEvent",email);
    /*
    db.findOne(
        {_id: new ObjectID(req.body.id)},
        "projects",
        {}
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
      */
});

router.post('/projectEvents',function(req, res){
    console.log("Get projectEvent",req.body.id);
    //TODO: projectEvents from db
    /*db.findOne(
        {_id: new ObjectID(req.body.id)},
        "projects",
        {}
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
      */
});

router.post('/teamEvents',function(req, res){
    console.log("Get teamEvent",req.body.id);
    //TODO: teamEvents from db
    /*db.findOne(
         {_id: new ObjectID(req.body.id)},
         "teams",
         {}
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
       */
});

router.post('/myEvents/schedule',function(req, res){
    //TODO: myEvents to db
    var decoded = jwt.decode(req.body.token);
    var email = decoded.info.email;
    console.log("Scheduled an myEvent",email);
    /*
    db.updateOne(
        { email : email },
        { $addToSet: {events: req.body.event} },
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
    */
});

router.post('/projectEvents/schedule',function(req, res){
    console.log("Scheduled an projectEvent",req.body.id);
    //TODO: projectEvents to db
    /*
    db.updateOne(
        {
            _id: new ObjectID
        },
        {
            $addToSet: { events: req.body.event}
        },
        "project"
    ).then(
        function(result) {
            assert.notEqual(null, result);
            res.status(200).send({events:result.ops[0]});
            require('../bin/www').io.projectEventScheduled(req.body.id,result.ops[0]._id);
        }
    ).catch(
        function(err){
            res.status(500).send();
            console.log(err);
        }
    );
    */
});

router.post('/teamEvents/schedule',function(req, res){
    console.log("Scheduled an teamEvent",req.body.id);
    //TODO: teamEvents to db
    /*
    db.updateOne(
        {
            _id: new ObjectID
        },
        {
            $addToSet: { events: req.body.event}
        },
        "team"
    ).then(
        function(result) {
            assert.notEqual(null, result);
            res.status(200).send({events:result.ops[0]});
            require('../bin/www').io.teamEventScheduled(req.body.id,result.ops[0]._id);
        }
    ).catch(
        function(err){
            res.status(500).send();
            console.log(err);
        }
    );
    */
});
module.exports = router;