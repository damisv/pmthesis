var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var schema = new Schema({
    name: {type: String, required: true},
    project: {type: String, required: true},
    profile: {type: String, required: true}
});
module.exports = mongoose.model('Task', schema);

