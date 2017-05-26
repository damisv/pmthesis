var db = require('../data/db');
var jwt = require('jsonwebtoken');

var clients = {};
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
                console.log("jwt verify "+socket.id);
                if(err){
                    console.log("jwt error");
                    socket.emit("loginError");
                }else{
                    var email = decoded.info.email;
                    console.log("jwt decoded. Email is "+email);
                    clients[email] = socket.id;
                    socket.emit("loginSuccessful");
                    for(var client in clients){
                        console.log(client + " corresponds to " + email);
                    }
                    db.find(
                        {"team.email":email},
                        "projects",
                        {_id:1}
                    ).then(function(result) {
                        if(result!==null){
                            result.forEach(function(project) {
                                socket.join(project._id);
                                console.log(email +" is connected in "+project._id);
                            });
                        }else{
                            console.log("DB find error/null.");
                        }
                    })
                }
            });
        });
    },
    getClient:function (email) {
        console.log("get clinet "+ email);
        console.log("id is "+ clients[email]);
        return clients[email];
    }
};
