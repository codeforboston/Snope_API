var Job  = require('./../models/job');
var User = require('./../models/user');

module.exports = {

  setupJobsAPI : function(router){
    // Setup the Routes / Endpoints for the jobs API
    router.route('/jobs')
      .post(postJob) //Create a new Job
      .get(getJobs); //Return all jobs

    // Endpoints for a specific Job
    router.route('/jobs/:job_id')
      .get(getSpecificJob) //Gets the job with this ID
      .put(updateJob) //Update the job with this ID
      .delete(deleteJob); // delete the job with this id

    //Get all jobs within a given distance of a given latlong.
    router.route('/jobsWithinDistance')
      .get(getJobsWithinDistance);

    //TODO: URL to get open jobs only.
    //Find all jobs created by a given customer.
    router.route('/jobsForCustomer/:customerId')
      .get(getAllJobsForCustomer);

    //Find all jobs accepted by a given shoveler.
    router.route('/jobsForShoveler/:shovelerId')
      .get(getAllJobsForShoveler);

    //These are open jobs for shovelers
    router.route('/openJobsForShoveler')
      .get(getOpenJobsForShoveler);

    //These are previously completed jobs for shovelers
    router.route('/completedJobsForShoveler/:shovelerId')
      .get(getCompletedJobsForShoveler);

    //These are previously completed jobs for shovelers
    router.route('/completedJobsForCustomer/:customerId')
      .get(getCompletedJobsForCustomer);

    router.route('/inProgressJobsForCustomer/:customerId')
      .get(getInProgressJobsForCustomer);

    router.route('/inProgressJobsForShoveler/:shovelerId')
      .get(getInProgressJobsForShoveler);


    //Functions to handle the above API Routes:

    function getJobs(req, res){
      findJobMatchingParams(req, res, {}); //Empty Json selects all.
    } //End getJobs

    function postJob(req, res){
      var job = new Job();
      job.customerId = req.body.customerId;
      job.address = req.body.address;
      job.city = req.body.city;
      job.state = req.body.state;
      job.zipCode = req.body.zipCode;
      job.price = req.body.price;
      job.notes = req.body.notes;
      job.phoneNumber = req.body.phoneNumber;

      job.confirmationCode = generateConfirmationCode();
      job.jobStatus = 'open';

      //Save image to filesystem:
      var base64Data = req.body.img;
      require("fs").writeFile("uploadedImages/" + job._id + ".png", base64Data, 'base64', function(err) {
        console.log(err);
      });


      // TODO: Get Lat/Long from Google Maps?
      // job.latitude = req.body.latitude;
      // job.longitude = req.body.longitude;

      // save the job and check for errors
      job.save(function(err) {
        if (err){
            res.send(err);
          }
        res.json({ message: 'Job successfully created!', jobId : job._id });
      });

    } // End postJob

    function getSpecificJob(req, res){
      Job.findById(req.params.job_id, function(err, job) {
        if(err){
          res.send(err);
        }else{
          embedUserDetailsToJob(req, res, job);
        }
      });
    } // End getSpecificJob

    function updateJob(req, res){
      // use our job model to find the job we want
      Job.findById(req.params.job_id, function(err, job) {

          if (err){
              res.send(err);
          }

          if(req.body.customerId) job.customerId = req.body.customerId;
          if(req.body.shovelerId) job.shovelerId = req.body.shovelerId;
          if(req.body.latitude) job.latitude = req.body.latitude;
          if(req.body.longitude) job.longitude = req.body.longitude;
          if(req.body.address) job.address = req.body.address;
          if(req.body.city) job.city = req.body.city;
          if(req.body.state) job.city = req.body.state;
          if(req.body.zipCode) job.city = req.body.zipCode;
          if(req.body.price) job.price = req.body.price;
          if(req.body.notes) job.notes = req.body.notes;
          if(req.body.confirmationCode) job.confirmationCode = req.body.confirmationCode;
          if(req.body.creationTime) job.creationTime = req.body.creationTime;
          if(req.body.completionTime) job.completionTime = req.body.completionTime;
          if(req.body.phoneNumber) job.phoneNumber = req.body.phoneNumber;
          if(req.body.imgUrl) job.imgUrl = req.body.imgUrl;
          if(req.body.jobStatus) job.jobStatus = req.body.jobStatus;

          // save the job
          job.save(function(err) {
              if (err){
                res.send(err);
              }

              res.json({ message: 'Job successfully updated!' });
          });
      });
    } //End updateJob

    function deleteJob(req, res){
      job.remove({
          _id: req.params.job_id
      }, function(err, job) {
          if (err){
              res.send(err);
          }
          res.json({ message: 'Job successfully deleted' });
      });
    } //End deleteJob


    function getJobsWithinDistance(req, res){
      var lat = req.body.latitude;
      var long = req.body.longitude;
      var maxDistance = req.body.radius; // In Miles

      // var lat1 = 42.359622;
      // var lon1 = -71.051481;
      // var maxDistance = 2;

      Job.find({jobStatus: 'open'}, function(err, jobs) {
        if (err){
          res.send(err);
        }
        var n = 0;
        var goodJobs = [];
        for (var i = 0; i < jobs.length; i++){
          if (calculateDistance(lat, long, jobs[i].latitude, jobs[i].longitude) < maxDistance){
            //This one's good, add to our list.
            goodJobs[n] = jobs[i];
            n++;
          }
        }
        res.json(goodJobs);
      });
    } //End getJobsWithinDistance

    function getAllJobsForCustomer(req, res){
      var jsonParams = {
        customerId : req.params.customerId
      };
      findJobMatchingParams(req, res, jsonParams);
    }// End getAllJobsForCustomer

    function getAllJobsForShoveler(req, res){
      var jsonParams = {
        shovelerId : req.params.shovelerId
      };
      findJobMatchingParams(req, res, jsonParams);
    } //End getAllJobsForShoveler

    function getOpenJobsForShoveler(req, res){
      var jsonParams = {
        jobStatus: 'open'
      };
      findJobMatchingParams(req, res, jsonParams);
    }//End getOpenJobsForShoveler

    function getCompletedJobsForShoveler(req, res){
      var jsonParams = {
        shovelerId : req.params.shovelerId,
        jobStatus: 'completed'
      };

      findJobMatchingParams(req, res, jsonParams);
    } //End getCompletedJobsForShoveler

    function getCompletedJobsForCustomer(req, res) {
      var jsonParams = {
        customerId : req.params.customerId,
        jobStatus: 'completed'
      };

      findJobMatchingParams(req, res, jsonParams);
    } //End getCompletedJobsForCustomer

    function getInProgressJobsForCustomer(req, res) {
        var jsonParams = {
          customerId : req.params.customerId,
          jobStatus: 'inProgress'
        };
        findJobMatchingParams(req, res, jsonParams);
    }


    function getInProgressJobsForShoveler(req, res) {
        var jsonParams = {
          shovelerId : req.params.shovelerId,
          jobStatus: 'inProgress'
        };
        findJobMatchingParams(req, res, jsonParams);
    }

    //Utility Methods:

    function findJobMatchingParams(req, res, jsonParams){
      Job.find(jsonParams).exec(function(err, jobs) {
        if (err){
          res.send(err);
        }else{
          res.json(jobs);
        }
      });
    } //End findJobMatchingParams

    //Calculate distance using the haversine formula
    function calculateDistance (lat1, lon1, lat2, lon2){

      var R = 6371000; // Radius of earth
      var φ1 = toRadians(lat1);
      var φ2 = toRadians(lat2);
      var Δφ = toRadians(lat2-lat1);
      var Δλ = toRadians(lon2-lon1);

      var a = Math.sin(Δφ/2) * Math.sin(Δφ/2) +
              Math.cos(φ1) * Math.cos(φ2) *
              Math.sin(Δλ/2) * Math.sin(Δλ/2);
      var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));

      var d = R * c;

      //Result is currently in metres, convert to miles and return:
      return (d * 0.000621371).toFixed(1);
    } // End calculateDistance

    //Create ourselves a .toRadians() function for simplicty
    function toRadians(degrees){
      return degrees * Math.PI / 180;
    } //End toRadians

    //Create ourselves a .toRadians() function for simplicty
    function generateConfirmationCode(){
        var text = "";
        var possibleChars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz";
        var possibleNums  = "0123456789";

        text += possibleChars.charAt(Math.floor(Math.random() * possibleChars.length));
        for( var i=0; i < 3; i++ ){
          text += possibleNums.charAt(Math.floor(Math.random() * possibleNums.length));
        }

        return text;
    } //End generateConfirmationCode

    function embedUserDetailsToJob(req, res, job){

      //Find Customer details:
      User.findById(job.customerId, function(err, user) {
        if (err){
          console.log('Error getting a customer for this job');
        }else if(user){
          var jobWithUserDetails = JSON.parse(JSON.stringify(job));
          jobWithUserDetails.customerFirstName = user.firstName;
          jobWithUserDetails.customerLastName = user.lastName;

          User.findById(job.shovelerId, function(err, user) {
              if (err){
                console.log('Error getting a shoveler for this job');
              }else if(user){
                jobWithUserDetails.shovelerFirstName = user.firstName;
                jobWithUserDetails.shovelerLastName = user.lastName;
              }

              res.json(jobWithUserDetails);
          });
        }

      });
    } //End embedUserDetailsToJob

  } //End setupJobsAPI

}; //End Exports
