var mongoose     = require('mongoose');
var Schema       = mongoose.Schema;

var JobSchema   = new Schema({
    customerId: String,
    shovelerId: String,
    latitude: String,
    longitude: String,
    confirmationCode: String,
    creationTime: { type: Date, default: Date.now },
    completionTime: Date
});

module.exports = mongoose.model('Job', JobSchema);
