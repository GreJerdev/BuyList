var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var listSchema = new Schema({
    groupId: String,
    createDate: String,
    about: String   
});

var Lists = mongoose.model('Lists', listSchema);

module.exports = Lists;