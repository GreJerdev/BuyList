var configValues = require('./config');

module.exports = {
 
    getDbConnectionString: function() {
        var userAndPassword = configValues.uname+':'+configValues.pwd;
        console.log('user and password --'+userAndPassword);
        var connectionString = 'mongodb://'+userAndPassword+'@ds117899.mlab.com:17899/buy_list'
        console.log(connectionString)
        return connectionString;
    }
   
}