var express = require('express');
var router = express.Router();
var db = require('../data/db');
var ObjectID = require('mongodb').ObjectID;
var assert = require('assert');
var jwt = require('jsonwebtoken');

//project/search/member/email ?not exist at the moment
//project/create
//project/edit
//project/search/id

router.use('/',function(req,res,next){
    jwt.verify(req.body.token,'secret',function(err,decoded){
        if(err){
            res.status(500).send();
        }else{
            next();
        }
    })
});

router.post('/create',function(req, res){
    db.insertOne(
        req.body.project,
        "projects"
    ).then(function(result) {
        if(result!==null){
            res.status(200).send({project:result.ops[0]});
        }else{
            res.status(204).send();
        }
    })
});

router.post('/edit',function(req, res){
    var tempId = req.body.project._id;
    req.body.project._id = ObjectID(req.body.project._id);
    db.save(
        req.body.project,
        "projects"
    ).then(
        function(result) {
            assert.equal(1, result.result.ok);
            req.body.project._id = tempId;
            res.status(200).send({project:req.body.project});
    }).catch(
        function(err){
            res.status(500).send();
            console.log(err);
    })
});

router.post('/search/id',function(req, res){
    console.log(req.body.id);
    db.findOne(
        {_id:ObjectID(req.body.id)},
        "projects"
    ).then(function(result) {
        assert.notEqual(null, result);
        console.log(result);
        res.status(200).send({project:result});
    }).catch(
        function(err){
            res.status(500).send();
            console.log(err);
        }
    );
});

router.post('/get',function(req, res){
    var decoded = jwt.decode(req.body.token);
    var email = decoded.info.email;
    db.find(
        {"team.email":email},
        "projects"
    ).then(function(result) {
        if(result!==null){
            res.status(200).send({projects:result});
        }else{
            res.status(500).send();
        }
    })
});

module.exports = router;
