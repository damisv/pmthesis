var db = require('../data/db');
var jwt = require('jsonwebtoken');

var clients = {};
var projects = {};
module.exports = {
    connection: function (socket) {
        /*socket.emit('priceUpdate',55);
        socket.on('bid', function (data) {
          socket.emit('priceUpdate',parseInt(data));
          socket.broadcast.emit('priceUpdate',parseInt(data));
        });*/

        console.log("connected "+socket.id);
        socket.on('register', function (data) {
            console.log("register "+socket.id);
            jwt.verify(data,'secret',function(err,decoded){
                if(err){
                    console.log("jwt error");
                    socket.emit("loginError");
                }else{
                    var email = decoded.info.email;
                    console.log("jwt decoded. Email is "+email);
                    clients[email] = socket.id;
                    socket.emit("loginSuccessful");
                    /*for(var client in clients){
                        console.log(client + " corresponds to " + clients[client]);
                    }*/
                    db.find(
                        {"team.email":email},
                        "projects",
                        {_id:1,name:1}
                    ).then(function(result) {
                        if(result!==null){
                            result.forEach(function(project) {
                                socket.join(project._id);
                                projects[project._id] = project.name;
                            });
                            console.log(email +" joined "+result.length + " rooms.");
                            /*for(var project in projects){
                                console.log(project + "-> id corresponds to name " + projects[project]);
                            }*/
                        }else{
                            console.log("DB find error/null.");
                        }
                    })
                }
            });
        });

        socket.emit("connected");
    },
    getClient:function (email) {
        return clients[email];
    },
    getProjectName:function (id) {
        return projects[id];
    },
    addProject:function(id,name){
        projects[id] = name;
    }
};
