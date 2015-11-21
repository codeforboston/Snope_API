var mongoose     = require('mongoose');
var Schema       = mongoose.Schema;

var UserSchema   = new Schema({
    name: String,
    type: String //Shoveler or Customer
});

module.exports = mongoose.model('User', UserSchema);
