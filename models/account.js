var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var schema = new Schema({
    password: {type: String, required: true},
    email: {type: String, required: true, unique: true}
});
module.exports = mongoose.model('Account', schema);