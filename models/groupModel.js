var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var groupSchema = new Schema({
    name:String,
    managerId:String,
    isDeleted:Boolean,
   
});

var Groups = mongoose.model('groups', groupSchema);

module.exports = Groups;