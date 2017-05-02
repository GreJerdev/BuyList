var Groups = require('../models/groupModel');
module.exports = {

 

   GetGroup: function GetGroup(groupId, callback) {
        Groups.findById({ _id: groupId }, function (err, group) {
            callback(err, group)
        });
    },

   GetGroupLists: function GetGroupLists(groupId, callback) {
        Lists.find({ groupId: groupId }, function (err, group) {
            callback(err, group)
        });
    }

}