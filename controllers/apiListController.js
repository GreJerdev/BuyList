var Lists = require('../models/listModel');
var bodyParser = require('body-parser');
var listBll = require('../BLL/listBLL');

module.exports = function (app) {

    app.use(bodyParser.json());
    app.use(bodyParser.urlencoded({ extended: true }));

    app.get('/api/grouplist/:id', function (req, res) {

        Lists.find({ groupId: req.params.id }, function (err, list) {
            if (err) throw err;

            res.send(list);
        });

    });

    app.get('/api/list/:id', function (req, res) {

        Lists.findById({ _id: req.params.id }, function (err, list) {
            if (err) throw err;

            res.send(list);
        });

    });

    app.post('/api/list', function (req, res) {

        var groupId = req.body.groupId;
        var cloneFromListId = req.body.cloneFromListId ? req.body.cloneFromListId : '';
        var name = req.body.name;
        var description = req.body.description;
        var _id = req.body._id ? req.body._id :''; 
        var list = {
            _id:_id,
            groupId: groupId,
            cloneFromListId: cloneFromListId,
            name: name,
            description: description


        };
           
            
        if (req.body._id) {
            list._id = req.body._id;
            console.log('list has a id ' + list._id);
        };
        
        listBll.saveList('fdshflk', list, function (err, newList) {
            if (err) throw err;
            res.send('Success');
        });
  
    });

    app.delete('/api/list', function (req, res) {

        Lists.findByIdAndRemove(req.body.id, function (err) {
            if (err) throw err;
            res.send('Success');
        })

    });

}