var express = require('express');
var router = express.Router();
var db = require('../data/db');
var jwt = require('jsonwebtoken');
var assert = require('assert');
//var bcrypt = require('bcryptjs');

router.post('/signin',function(req, res){
    //bcrypt.hashSync(password,10);
    //if( bcrypt.compareSync(password, db.user.password) ) {}
    //error status 500 and 401
    db.findOne(
        req.body.account,
        "accounts"
    ).then(
        function(result) {
            assert.notEqual(null, result);
            var tokenInfo = {
                email: result.email,
                _id:result._id,
                profile:result.profile
            };
            var token = jwt.sign({ info: tokenInfo},'secret', {expiresIn: 7200});
            res.status(200).send({
                token: token
            });
        }
    ).catch(
        function(err){
            res.status(500).send({
                title: 'Login Failed',
                error : {message: 'Invalid login credentials'}
            });
            console.log(err);
        }
    );
});

router.post('/signup',function(req, res){
    //Create account
    db.insertOne(
        req.body.account,
        "accounts"
    ).then(
        function(result) {
            assert.notEqual(null, result);
            createProfile(result.ops[0]);
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

    //Create profile
    function createProfile(accountCreated){
        var profile = {email:accountCreated.email};
        db.insertOne(
            profile,
            "profiles"
        ).then(
            function(result) {
                assert.notEqual(null, result);
                associateAccountWithProfile(result.ops[0]);
            }
        ).catch(
            function(err){
                res.status(204).send();
                console.log(err);
            }
        );
    }
    //Associate profile with Account
    function associateAccountWithProfile(profileCreated){
        db.updateOne(
            {email:profileCreated.email},
            {$set:{profile:profileCreated._id}},
            "accounts"
        ).then(
            function(result) {
                assert.equal(1, result.result.ok);
                res.status(200).send({
                    title: 'OK'
                });
            }
        ).catch(
            function(err){
                res.status(500).send();
                console.log(err);
            }
        )
    }
});


module.exports = router;

