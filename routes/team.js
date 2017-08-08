var express = require('express');
var router = express.Router();
var db = require('../data/db');
var assert = require('assert');

router.post('/create',function(req, res){
    db.insertOne(
        req.body.team,
        "team"
    ).then(
        function(result) {
            assert.notEqual(null, result);
            res.status(200).send({
                team: result.ops[0]
            });
        }
    ).catch(
        function(err){
            res.status(500).send({
                title: 'Create team Failed',
                error : err
            });
        }
    );
});

router.post('/get',function(req, res){
    db.findOne(
        {name:req.body.name},
        "team"
    ).then(
        function(result) {
            assert.notEqual(null, result);
            res.status(200).send({
                team: result
            });
        }
    ).catch(
        function(err){
            res.status(500).send({
                title: 'An error occurred',
                error : err
            });
        }
    );
});

router.post('/update',function(req, res){
    db.updateOne(
        { _id : req.body.team._id },
        { $set: req.body.team },
        "team"
    ).then(
        function(result) {
            assert.equal(1, result.result.ok);
            res.status(200).send(req.body.team);
        }
    ).catch(
        function(err){
            res.status(500).send();
            console.log(err);
        }
    );
});

module.exports = router;