var express = require('express');
var app = express();
var mongoose = require('mongoose');
var config = require('./config');
//var setupController = require('./controllers/setupController');
var apiGroupController = require('./controllers/apiGroupController');
var apiItemController = require('./controllers/apiItemController');
var apiListController = require('./controllers/apiListController');


var port = process.env.PORT || 3000;
app.disable('x-power-by')

app.use('/assets', express.static(__dirname + '/public'));

app.set('view engine', 'ejs');

mongoose.connect(config.getDbConnectionString());
//setupController(app);
apiGroupController(app);
apiItemController(app);
apiListController(app);

app.use(function (err, req, res, next) {
    console.log('Error : ' + err.message);
    next();
});

app.listen(port);