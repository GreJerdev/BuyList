var Groups = require('../BLL/groupBLL');
var Lists = require('../models/listModel');
module.exports =  {

    
   saveList: function saveList(user, list, callback) {
        Groups.GetGroup(list.groupId, function (err, group) {
           console.log('list group was found id is '+group._id);
            haveError = false;
            error = null;
            result = null;
            console.log('list id '+list._id);
            if (list._id) {

                Lists.findByIdAndUpdate(list.id, {
                    groupId: list.groupId,
                    createDate: list.createDate,
                    about: list.about
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
                    createDate: list.createDate,
                    about: list.about
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
    }
    


}