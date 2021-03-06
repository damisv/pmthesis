var express = require('express');
var router = express.Router();
var db = require('../data/db');
var ObjectID = require('mongodb').ObjectID;
var assert = require('assert');
var jwt = require('jsonwebtoken');

//invite/member
//invite/members
//invite/accept/projectID
//invite/search/projectID
//invite/search/email

router.use('/',function(req,res,next){
    jwt.verify(req.body.token,'secret',function(err){
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
            if(req.body.invites.invites.length > 0){
                req.body.invites.invites.forEach(function(email){
                    var notification = {
                        email:email,
                        type:"invite",
                        link:['app','invites'],
                        date:new Date(Date.now()),
                        status:"unseen"
                    };
                    db.insertOne(
                        notification,
                        "notification"
                    ).then(
                        function(result) {
                            assert.notEqual(null, result);
                            require('../bin/www').io.inviteMemberToProject(req.body.invites.project,result.ops[0]);
                        }
                    ).catch(
                        function(err){
                            console.log(err);
                        }
                    );
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
                require('../bin/www').io.memberJoinedProject(req.body.projectID,req.body.email);
            }
        ).catch(
            function(err){
                res.status(500).send();
                console.log(err);
            }
        )
    }
});

router.post('/search/projectID',function(req, res){
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

router.post('/search/email',function(req, res){
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


