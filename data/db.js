var MongoClient = require('mongodb').MongoClient;
var assert = require('assert');
/* For local
var url = 'mongodb://localhost:27017/project';
 */
var url = 'mongodb://localhost:27017/project';
/* For mLab
var url = 'mongodb://admin:admin@ds135820.mlab.com:35820/pmthesis';
 */
var db;

// Use connect method to connect to the server
MongoClient.connect(url, function(err, db) {
    if(err) {
        console.log("\033[31mMongoDB is closed. Please open it!\x1b[0m");
    }else{
        console.log("Connected successfully to database");
        initializeDatabase(db);
    }
});


module.exports = {
    findOne:function(query,collection){
        return db.collection(collection).findOne(query);
    },
    find: function(query,collection,projection){
        if(projection===undefined)projection={};
        return db.collection(collection).find(query,projection).toArray();
    },
    insertOne: function (data,collection) {
        return db.collection(collection).insertOne(data);
    },
    insertMany: function(array,collection){
        return db.collection(collection).insertMany(array);
    },
    update:function(query,set,collection){
        return db.collection(collection).update(query,set);
    },
    updateOne:function(query,set,collection){
        return db.collection(collection).updateOne(query,set);
    },
    save: function(data,collection){
        return db.collection(collection).save(data);
    },
    deleteOne: function(data,collection){
        return db.collection(collection).deleteOne(data);
    }
};

function initializeDatabase(databaseConnection){
    db = databaseConnection;
    db.createCollection( "accounts",
        { validator: { $and:
            [
                { password: { $exists:true} },
                { email: { $exists:true } }
            ]
        }
        } ).catch(error);
    db.collection('accounts').createIndex({email:1},{unique:true}).catch(error);
    db.createCollection( "profiles",
        { validator: { $and:
            [
                { email: { $exists:true } }
            ]
        }
        } ).catch(error);
    db.collection('profiles').createIndex({email:1},{unique:true}).catch(error);
    db.createCollection( "projects",
        { validator: { $and:
            [
                { team: { $exists:true }},
                { name: {$exists:true }}
            ]
        }
        } ).catch(error);
    db.createCollection( "invites",
        { validator: { $and:
            [
                { project: { $exists:true }},
                { invites: {$exists:true }}
            ]
        }
        } ).catch(error);
    db.collection('invites').createIndex({project:1,invites:1},{unique:true}).catch(error);
    db.createCollection( "tasks",
        { validator: { $and:
            [
                { project_id: { $exists:true }},
                { assigner_email: { $exists:true }},
                { assignee_email: {$exists:true }},
                { name: { $exists:true }},
                { description: { $exists:true }},
                { date_created: {$exists:true }},
                { date_start: {$exists:true }},
                { date_end: {$exists:true }},
                { completed: {$exists:true }}
            ]
        }
        } ).catch(error);
    db.createCollection( "chat",
        { validator: { $and:
            [
                { sender: { $exists:true }},
                { receiver: {$exists:true }},
                { date_sent: {$exists:true }},
                { message: {$exists:true }}
            ]
        }
        } ).catch(error);
    db.createCollection( "team",
        { validator: { $and:
            [
                { name: { $exists:true }},
                { members: {$exists:true }}
            ]
        }
        } ).catch(error);
    db.createCollection( "action").catch(error);
    db.createCollection( "notification",
        { validator: { $and:
            [
                { email: { $exists:true }},
                { type: { $exists:true }},
                { link: {$exists:true }},
                { date: {$exists:true }},
                { status: {$exists:true }}
            ]
        }
        } ).catch(error);
    db.createCollection( "events",
        { validator: { $and:
            [
                { title: { $exists:true }}
            ]
        }
        } ).catch(error);
    db.createCollection( "settings",
        { validator: { $and:
            [
                { email: { $exists:true }}
            ]
        }
        } ).catch(error);
    db.collection('settings').createIndex({email:1},{unique:true}).catch(error);
}

function error(err){
    console.log(err);
}