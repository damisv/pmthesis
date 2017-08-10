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


module.exports = router;