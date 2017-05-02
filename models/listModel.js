var mongoose = require('mongoose');
var itemSchema = require('../models/itemModel')
var Schema = mongoose.Schema;  


var listSchema = new Schema({
    groupId: String,
    cloneFromListId: String,
    createDate: String,
    name: String,
    description: String,
    archiveDate: String,
    items:[itemSchema.model('Items').schema]
});

var Lists = mongoose.model('Lists', listSchema);

module.exports = Lists;