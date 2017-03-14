var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var groupSchema = new Schema({
    name:String,
   
});

var Groups = mongoose.model('Groups', groupSchema);

module.exports = Groups;