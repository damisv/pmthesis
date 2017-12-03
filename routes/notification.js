var express = require('express');
var router = express.Router();
var db = require('../data/db');
var assert = require('assert');
var jwt = require('jsonwebtoken');

router.use('/',function(req,res,next){
    jwt.verify(req.body.token,'secret',function(err){
        if(err){
            res.status(500).send();
        }else{
            next();
        }
    })
});

router.post('/create',function(req, res){
    db.insertOne(
        req.body.notification,
        "notification"
    ).then(
        function(result) {
            assert.notEqual(null, result);
            res.status(200).send({
                notification: result.ops[0]
            });
        }
    ).catch(
        function(err){
            res.status(500).send({
                title: 'An error occurred',
                error : err
            });
            console.log(err);
        }
    );
});

router.post('/get',function(req, res){
    var decoded = jwt.decode(req.body.token);
    var email = decoded.info.email;
    db.find(
        {email: email},
        "notification"
    ).then(
        function(result) {
            assert.notEqual(null, result);
            res.status(200).send({
                notifications: result
            });
        }
    ).catch(
        function(err){
            res.status(500).send({
                title: 'get notifications failed',
                error : err
            });
            console.log(err);
        }
    );
});

router.post('/save',function(req, res){
    //var decoded = jwt.decode(req.body.token);
    db.save(
        req.body.notification,
        "notification"
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

router.post('/settings/get',function(req, res){
    var decoded = jwt.decode(req.body.token);
    var email = decoded.info.email;
    db.findOne(
        {email:email},
        "settings"
    ).then(
        function(result) {
            assert.notEqual(null, result);
            res.status(200).send({settings:result});
        }
    ).catch(
        function(err){
            res.status(500).send();
            console.log(err);
        }
    )
});

router.post('/settings/update',function(req, res){
    var decoded = jwt.decode(req.body.token);
    var email = decoded.info.email;
    req.body.settings.email = decoded.info.email;
    db.updateOne(
        { email : email },
        { $set: req.body.settings },
        "settings"
    ).then(
        function(result) {
            assert.equal(1, result.result.ok);
            res.status(200).send(req.body.settings);
        }
    ).catch(
        function(err){
            res.status(500).send();
            console.log(err);
        }
    );
});

module.exports = router;