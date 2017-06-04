var Groups = require('../models/groupModel');
var Items = require('../models/itemModel');
var Lists = require("../models/listModel")
var Errors = require("../controllers/errors")

module.exports = {

    saveItem: function saveItem(listid, item, callback) {
        console.log('list id : ' + listid);
        if (item._id != undefined) {
            console.log('update');
            Lists.update({ _id: listid, 'items._id': item._id }, { '$set': { 'items.$': item } }, callback);

        }
        else {
            console.log('add new ');
            var newItem = Items({
                listId: listid,
                name: item.name,
                quantity: item.quantity,
                isDone: item.isDone
            });
            Lists.update({ _id: listid }, { $push: { "items": newItem } }, callback);
        }

    },

    deleteItem: function deleteItem(listId, itemid, callback) {
        if (item._id != undefined) {
            console.log('delete');
            userAccounts.update(
                { _id: listid, 'items._id': item._id },
                { $pull: { items: { _id: itemid } } },
                { safe: true },
                callback);
        }
        else {
            callback({ 'error': Errors.failToDeleteitem, 'message': 'item id is undefined' })
        }
    }
}