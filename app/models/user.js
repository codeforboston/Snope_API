var mongoose     = require('mongoose');
var Schema       = mongoose.Schema;

var UserSchema   = new Schema({
    username: String,
    firstName: String,
    lastName: String,
    phoneNumber: String,
    address: String,
    type: String, //Shoveler or Customer
    password: String
});

module.exports = mongoose.model('User', UserSchema);
