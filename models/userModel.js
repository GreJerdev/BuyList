var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var userGroupsSchema = new Schema({
    groupId: String,
    userId: String,
});

var UserGroups = mongoose.model('UserGroups', userGroupsSchema);

module.exports = UserGroups;