var Items = require('../models/itemModel');
var bodyParser = require('body-parser');

module.exports = function(app) {
    
    app.use(bodyParser.json());
    app.use(bodyParser.urlencoded({ extended: true }));
    
    app.get('/api/item/:listid', function(req, res) {
        
        Items.find({ listId: req.params.listId }, function(err, items) {
            if (err) throw err;
            
            res.send(items);
        });
        
    });
    
    app.get('/api/item/:id', function(req, res) {
       
       Items.findById({ _id: req.params.id }, function(err, item) {
           if (err) throw err;
           
           res.send(item);
       });
        
    });
    
    app.post('/api/item', function(req, res) {
        
        if (req.body.id) {
            Items.findByIdAndUpdate(req.body.id, {  listId: req.body.listId,
                name: req.body.name,
                quantity: req.body.quantity,
                isDone: req.body.isDone }, function(err, item) {
                if (err) throw err;
                
                res.send('Success');
            });
        }
        
        else {
           
           var newItem = Item({
               istId: req.body.listId,
               name: req.body.name,
               quantity: req.body.quantity,
               isDone: req.body.isDone 
           });
           newItem.save(function(err) {
               if (err) throw err;
               res.send('Success');
           });
            
        }
        
    });
    
    app.delete('/api/item', function(req, res) {
        
        Items.findByIdAndRemove(req.body.id, function(err) {
            if (err) throw err;
            res.send('Success');
        })
        
    });
    
}