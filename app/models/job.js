var mongoose     = require('mongoose');
var Schema       = mongoose.Schema;

var JobSchema   = new Schema({
    customerId: String,
    shovelerId: String,
    latitude: String,
    longitude: String,
    address: String,
    price: Number,
    notes: String,
    confirmationCode: String,
    creationTime: { type: Date, default: Date.now },
    completionTime: Date,
    phoneNumber: String
});

module.exports = mongoose.model('Job', JobSchema);
