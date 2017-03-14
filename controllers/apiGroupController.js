var Groups = require('../models/groupModel');
var bodyParser = require('body-parser');


module.exports = function(app) {
    
    app.use(bodyParser.json());
    app.use(bodyParser.urlencoded({ extended: true }));
    
    app.get('/api/groups/:uname', function(req, res) {
        
     /*  Groups.find({ username: req.params.uname }, function(err, groups)*/
       Groups.find({ }, function(err, groups)
     
      {
            if (err) throw err;
            
            res.send(groups);
        });
        
    });
    
    app.get('/api/group/:id', function(req, res) {
       
       Groups.findById({ _id: req.params.id }, function(err, group) {
           if (err) throw err;
           
           res.send(group);
       });
        
    });
    
   
    app.post('/api/group', function(req, res) {
        
        console.log(req.body);
        if (req.body._id) {
            Groups.findByIdAndUpdate(req.body._id, { groupid: req.body._id, name: req.body.name }, function(err, group) {
                if (err) throw err;
                
                res.send('Success');
            });
        }
        
        else {
           console.log('adding new group :'+ req.body.name);
           var newGroup = new Groups({
              name: req.body.name
           });
           console.log(newGroup);
           newGroup.save(function(err) {
               if (err) throw err;
               res.send('Success');
           });
            
        }
        
    });
    
    app.delete('/api/group', function(req, res) {
        
        Groups.findByIdAndRemove(req.body.id, function(err) {
            if (err) throw err;
            res.send('Success');
        })
        
    });
    
}