var Groups = require('../BLL/groupBLL');
var Lists = require('../models/listModel');
module.exports = {

    getItems: function (listId, callback) {
        console.log('try to get list items '+ listId);
        Lists.find({ "_id": listId }, function (err, list) {
            if (err) {
                console.log(err);
                haveError = true;
                error = err;
                callback(err, list);
            }
            if (list.length > 0) {
                console.log(list.length);
                console.log(list);
                callback(err, list[0].items);
            }
        });



    },
    saveList: function saveList(user, list, callback) {
        console.log('try to save a new list');
        Groups.GetGroup(list.groupId, function (err, group) {
            haveError = false;
            error = null;
            result = null;
            console.log('list id ' + list._id);
            if (list._id) {

                Lists.findByIdAndUpdate(list._id, {
                    name: list.name,
                    description: list.description,
                    archiveDate: new Date().getTime() / 1000,
                }, function (err, list) {

                    if (err) {
                        console.log(err);
                        haveError = true;
                        error = err;
                    }
                    result = list;
                });
            }

            else {

                var newList = Lists({

                    groupId: list.groupId,
                    cloneFromListId: list.cloneFromListId,
                    createDate: new Date().getTime() / 1000,
                    name: list.name,
                    description: list.description,
                    archiveDate: new Date().getTime() / 1000,
                    items: []
                });
                newList.save(function (err) {
                    if (err) {
                        console.log(err);
                        haveError = true;
                        error = err;
                    }
                    result = list;
                });

            }
            callback(error, result);
        });
    },
    getListsByGroup: function getListsByGroup(user, groupId, callback) {
        Lists.find({ groupId: req.params.id }, callback);
    }


}