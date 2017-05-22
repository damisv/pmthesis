var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var schema = new Schema({
    username: {type: String, required: true},
    firstName: {type: String},
    lastName: {type: String},
    email:{type:String}
});
module.exports = mongoose.model('Profile', schema);