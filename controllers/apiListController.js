var Lists = require('../models/listModel');
var bodyParser = require('body-parser');

module.exports = function(app) {
    
    app.use(bodyParser.json());
    app.use(bodyParser.urlencoded({ extended: true }));
    
    app.get('/api/list/:id', function(req, res) {
        
        Lists.find({ groupId: req.params.id }, function(err, list) {
            if (err) throw err;
            
            res.send(list);
        });
        
    });
    
    app.get('/api/list/:id', function(req, res) {
       
       Lists.findById({ _id: req.params.id }, function(err, list) {
           if (err) throw err;
           
           res.send(list);
       });
        
    });
    
    app.post('/api/list', function(req, res) {
        
        if (req.body.id) {
            Lists.findByIdAndUpdate(req.body.id, { groupId: req.body.groupId, createDate: req.body.createDate, about: req.body.about }, function(err, list) {
                if (err) throw err;
                
                res.send('Success');
            });
        }
        
        else {
           
           var newList = Lists({
              
               groupId: req.body.groupId, 
               createDate: req.body.createDate,
               about: req.body.about
           });
           newList.save(function(err) {
               if (err) throw err;
               res.send('Success');
           });
            
        }
        
    });
    
    app.delete('/api/list', function(req, res) {
        
        Lists.findByIdAndRemove(req.body.id, function(err) {
            if (err) throw err;
            res.send('Success');
        })
        
    });
    
}