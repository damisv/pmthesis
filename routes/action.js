var express = require('express');
var router = express.Router();
var db = require('../data/db');
var assert = require('assert');
var jwt = require('jsonwebtoken');
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

router.post('/create',function(req, res){
    db.insertOne(
        req.body.action,
        "action"
    ).then(
        function(result) {
            assert.notEqual(null, result);
            res.status(200).send({
                action: result.ops[0]
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

router.post('/get/project',function(req, res){
    db.find(
        {project: ObjectID(req.body.projectID)},
        "action"
    ).then(
        function(result) {
            assert.notEqual(null, result);
            res.status(200).send({
                actions: result
            });
        }
    ).catch(
        function(err){
            res.status(500).send({
                title: 'get action log failed',
                error : err
            });
            console.log(err);
        }
    );
});


module.exports = router;