var express = require('express');
var router = express.Router();
var db = require('../data/db');
var ObjectID = require('mongodb').ObjectID;
var assert = require('assert');
var jwt = require('jsonwebtoken');

function to(id){
    return require('../bin/www').to(id);
}

function getClient(email){
    return require('../bin/socket').getClient(email);
}

function getProjectName(id){
    return require('../bin/socket').getProjectName(id);
}

//invite/member
//invite/members
//invite/accept/projectID
//invite/search/projectID
//invite/search/email

router.use('/',function(req,res,next){
    jwt.verify(req.body.token,'secret',function(err,decoded){
        if(err){
            res.status(500).send();
        }else{
            next();
        }
    })
});

//todo check if user is registered from angular
router.post('/member',function(req, res){
    db.findOne(
        {email:req.body.email},
        "profiles"
    ).then(
        function(result) {
            assert.notEqual(null, result);
            inviteMember();
        }
    ).catch(
        function(err){
            res.status(500).send();
            console.log(err);
        }
    );

    function inviteMember(){
        db.updateOne(
            { project : req.body.projectID },
            { $addToSet: {invites:req.body.email} },
            "invites"
        ).then(
            function(result) {
                assert.equal(1, result.result.ok);
                res.status(200).send({email:req.body.email});
            }
        ).catch(
            function(err){
                res.status(500).send();
                console.log(err);
            }
        );
    }
});

router.post('/members',function(req, res){
    db.insertOne(
        req.body.invites,
        "invites"
    ).then(
        function(result) {
            assert.equal(1,result.result.ok);
            res.status(200).send({ok:"ok"});
            console.log("invite length "+req.body.invites.invites.length);
            if(req.body.invites.invites.length > 0){
                console.log("invites "+req.body.invites.invites);
                console.log("project id is "+req.body.invites.project);
                var projectName = getProjectName(req.body.invites.project);
                console.log("project name  "+projectName);
                req.body.invites.invites.forEach(function(member) {
                    console.log("invite "+member);
                    var id = getClient(member);
                    to(id).emit("Invitation",projectName);
                });
            }
        }
    ).catch(
        function(err){
            res.status(500).send();
            console.log(err);
    });
});

router.post('/accept/projectID',function(req, res){
    db.updateOne(
        { _id : ObjectID(req.body.projectID) },
        { $addToSet: {team:{position:"member",email:req.body.email}} },
        "projects"
    ).then(
        function(result) {
            assert.equal(1, result.result.ok);
            removeInvite();
        }
    ).catch(
        function(err){
            res.status(500).send();
            console.log(err);
        }
    );

    function removeInvite(){
        db.updateOne(
            { project : req.body.projectID },
            { $pull: { invites: { $in: [ req.body.email ] }}},
            "invites"
        ).then(
            function(result) {
                assert.equal(1, result.result.ok);
                res.status(200).send({id:req.body.projectID});
            }
        ).catch(
            function(err){
                res.status(500).send();
                console.log(err);
            }
        )
    }
});

router.post('/search/projectID',function(req, res, next){
    db.findOne(
        { project : req.body.projectID },
        "invites"
    ).then(
        function(result) {
            assert.notEqual(null, result);
            res.status(200).send({invites:result.invites});
        }
    ).catch(
        function(err){
            res.status(500).send();
            console.log(err);
        }
    );
});

router.post('/search/email',function(req, res, next){
    var transformedIds = [];
    db.find(
        { invites:  req.body.email} ,
        "invites",
        { project:1, _id:0}
    ).then(
        function(result) {
            assert.notEqual(null,result);
            for(var i=0;i<result.length;i++){
                transformedIds.push(ObjectID(result[i].project));
            }
            findProjects();
        }
    ).catch(
        function(err){
            res.status(500).send();
            console.log(err);
    });

    function findProjects(){
        db.find(
            {_id:{$in:transformedIds}},
            "projects"
        ).then(
            function(result) {
                assert.notEqual(null, result);
                res.status(200).send({projects:result});
            }
        ).catch(
            function(err){
                res.status(500).send();
                console.log(err);
            }
        );
    }
});

module.exports = router;


