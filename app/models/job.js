var mongoose     = require('mongoose');
var Schema       = mongoose.Schema;

var JobSchema   = new Schema({
    customerId: String,
    shovelerId: String,
    latitude: String,
    longitude: String,
    address: String,
    city: String,
    state: String,
    zipCode: String,
    price: Number,
    notes: String,
    email: String,
    confirmationCode: String,
    creationTime: { type: Date, default: Date.now },
    completionTime: Date,
    jobStatus: String, //New, In Progress, Completed
    imgUrl: String,
    phoneNumber: String
});

module.exports = mongoose.model('Job', JobSchema);
