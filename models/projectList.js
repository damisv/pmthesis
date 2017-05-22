var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var schema = new Schema({
    profile: {type: String, required: true},
    project: {type: String, required: true},
});

module.exports = mongoose.model('ProjectList', schema);