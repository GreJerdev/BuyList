
var express = require('express');
var path = require('path')
var mongoose = require('mongoose');

var app = express();
var config = require('./config');

 
//var setupController = require('./controllers/setupController');
var apiGroupController = require('./controllers/apiGroupController');
var apiItemController = require('./controllers/apiItemController');
var apiListController = require('./controllers/apiListController');


var port = process.env.PORT || 3000;
app.disable('x-power-by')

app.use('/client', express.static(__dirname + '/client-ui'));
app.set('view',path.join(__dirname,'views'));
app.set('view engine', 'ejs');
app.engine('html', require('ejs').renderFile);

//Set static folder, for static content and angular 2 
app.use(express.static(path.join(__dirname,client)))

mongoose.connect(config.getDbConnectionString());
apiGroupController(app);
apiItemController(app);
apiListController(app);

app.use(function (err, req, res, next) {
    console.log('Error : ' + err.message);
    next();
});

app.listen(port);

//new line