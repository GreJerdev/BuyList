var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var itemSchema = new Schema({
    listId: String,
    name:String,
    quantity: Number,
    isDone: Boolean,
    about: Boolean   
});

var Items = mongoose.model('Items', itemSchema);

module.exports = Items;