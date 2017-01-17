var Items = require('../models/itemModel');
var bodyParser = require('body-parser');

module.exports = function(app) {
    
    app.use(bodyParser.json());
    app.use(bodyParser.urlencoded({ extended: true }));
    
    app.get('/api/item/:uname', function(req, res) {
        
        Items.find({ username: req.params.uname }, function(err, todos) {
            if (err) throw err;
            
            res.send(todos);
        });
        
    });
    
    app.get('/api/item/:id', function(req, res) {
       
       Items.findById({ _id: req.params.id }, function(err, todo) {
           if (err) throw err;
           
           res.send(todo);
       });
        
    });
    
    app.post('/api/item', function(req, res) {
        
        if (req.body.id) {
            Items.findByIdAndUpdate(req.body.id, { todo: req.body.todo, isDone: req.body.isDone, hasAttachment: req.body.hasAttachment }, function(err, todo) {
                if (err) throw err;
                
                res.send('Success');
            });
        }
        
        else {
           
           var newItem = Item({
               username: 'test',
               todo: req.body.todo,
               isDone: req.body.isDone,
               hasAttachment: req.body.hasAttachment
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