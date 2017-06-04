var Items = require('../models/itemModel');
var bodyParser = require('body-parser');
var itemBll = require('../BLL/itemBLL')
module.exports = function (app) {

    app.use(bodyParser.json());
    app.use(bodyParser.urlencoded({ extended: true }));

    app.get('/api/item/:listid', function (req, res) {

        Items.find({ listId: req.params.listId }, function (err, items) {
            if (err) throw err;

            res.send(items);
        });

    });

    app.get('/api/item/:id', function (req, res) {

        Items.findById({ _id: req.params.id }, function (err, item) {
            if (err) throw err;

            res.send(item);
        });

    });

    app.post('/api/item', function (req, res) {

        var item = Items({
            name: req.body.name,
            quantity: req.body.quantity,
            isDone: req.body.isDone
        });
        if (req.body.id) {
            item._id = req.body.id
        }
        else {
            item._id = undefined;
        }

        var listid = req.body.listid
        console.log('333');
        itemBll.saveItem(listid, item, function (err) {
            if (err) throw err;
            res.send('Success');
        });

        /*
        
         if (req.body.id) {
             Items.findByIdAndUpdate(req.body.id, {  
                 listId: req.body.listId,
                 name: req.body.name,
                 quantity: req.body.quantity,
                 isDone: req.body.isDone }, function(err, item) {
                 if (err) throw err;
                 
                 res.send('Success');
             });
         }
         
         else {
            
            var newItem = Items({
                listId: req.body.listId,
                name: req.body.name,
                quantity: req.body.quantity,
                isDone: req.body.isDone 
            });
            newItem.save(function(err) {
                if (err) throw err;
                res.send('Success');
            });
             
         }*/

    });

    app.delete('/api/item', function (req, res) {

        var listId = req.body.listid;
        var itemId = req.body.itemid;

        itemBll.deleteItem(listId, itemId, function (err) {
            if (err) throw err;
            res.send('Success');
        });


    });

}