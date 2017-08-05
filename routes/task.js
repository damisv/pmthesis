var express = require('express');
var router = express.Router();
var db = require('../data/db');
var ObjectID = require('mongodb').ObjectID;
var assert = require('assert');
var jwt = require('jsonwebtoken');

//task/search/projectID
//task/create

router.use('/',function(req,res,next){
    jwt.verify(req.body.token,'secret',function(err,decoded){
        if(err){
            res.status(500).send();
        }else{
            next();
        }
    })
});

router.post('/search/projectID',function(req, res){
    db.find(
        {project_id:req.body.projectID},
        "tasks"
    ).then(
        function(result) {
            assert.notEqual(null, result);
            res.status(200).send(result);
        }
    ).catch(
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
        {assignee_email:{$in:[email]}},
        "tasks"
    ).then(
        function(result) {
            assert.notEqual(null, result);
            res.status(200).send({tasks:result});
        }
    ).catch(
        function(err){
            res.status(500).send();
            console.log(err);
        });
});

router.post('/complete',function(req, res){
    var decoded = jwt.decode(req.body.token);
    var email = decoded.info.email;
    if(req.body.task.assignee_email.indexOf(email)>-1){
        db.updateOne(
            {_id:ObjectID(req.body.task._id)},
            {$set:{
                date_created: new Date(),
                completed: !req.body.task.completed
            }},
            "tasks"
        ).then(
            function(result) {
                assert.equal(1, result.result.ok);
                res.status(200).send({tasks:result});
            }
        ).catch(
            function(err){
                res.status(500).send();
                console.log(err);
            });
    }else{
        res.status(200).send({tasks:req.body.task});
    }
});

router.post('/create',function(req, res){
    var decoded = jwt.decode(req.body.token);
    var email = decoded.info.email;
    db.insertOne(
        {
            project_id:req.body.task.project_id,
            project_name:req.body.task.project_name,
            assigner_email:email,
            name:req.body.task.name,
            description:req.body.task.description,
            assignee_email:req.body.task.assignee_email,
            dependencies:req.body.task.dependencies,
            date_created: new Date(),
            date_start: req.body.task.date_start,
            date_end: req.body.task.date_end,
            completed:false
        },
        "tasks"
    ).then(
        function(result) {
            assert.notEqual(null, result);
            res.status(200).send({task:result.ops[0]});
            require('../bin/www').io.taskAssignedToMembers(req.body.task.project_id,req.body.task);
        }
    ).catch(
        function(err){
            res.status(500).send();
            console.log(err);
        }
    );

});

module.exports = router;
