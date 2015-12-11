var Job = require('./../models/job');

module.exports = {

setupJobsAPI : function(router){
  // Jobs API ----------------------------------------------------
  router.route('/jobs')

      // create a job (accessed at POST /api/jobs)
      .post(function(req, res) {

          var job = new Job();
          job.customerId = req.body.customerId;
          job.address = req.body.address;
          job.city = req.body.city;
          job.state = req.body.state;
          job.zipCode = req.body.zipCode;
          job.price = req.body.price;
          job.notes = req.body.notes;
          job.phoneNumber = req.body.phoneNumber;

          // TODO: Generate this and send it in response
          // job.confirmationCode = req.body.confirmationCode;

          // TODO: Get Lat/Long from Google Maps?
          // job.latitude = req.body.latitude;
          // job.longitude = req.body.longitude;

          // save the job and check for errors
          job.save(function(err) {
              if (err){
                  res.send(err);
                }
                //TODO: Send newjobId back in response
              res.json({ message: 'Job successfully created!' });
          });

      })

      //Return all jobs
      .get(function(req, res) {
          Job.find(function(err, jobs) {
              if (err)
                  res.send(err);
              res.json(jobs);
          });
      });

      // on routes that end in /jobs/:job_id
      // ----------------------------------------------------
      router.route('/jobs/:job_id')

          // get the job with that id (accessed at GET /api/jobs/:job_id)
          .get(function(req, res) {
              Job.findById(req.params.job_id, function(err, job) {
                  if (err)
                      res.send(err);
                  res.json(job);
              });
          })

          // update the job with this id (accessed at PUT /api/jobs/:job_id)
          .put(function(req, res) {

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

                // save the job
                job.save(function(err) {
                    if (err){
                      res.send(err);
                    }

                    res.json({ message: 'Job successfully updated!' });
                });

            });
        })

        // delete the job with this id (accessed at DELETE /api/jobs/:job_id)
        .delete(function(req, res) {
            job.remove({
                _id: req.params.job_id
            }, function(err, job) {
                if (err){
                    res.send(err);
                }
                res.json({ message: 'Job successfully deleted' });
            });
        });

        //Get all jobs within a given distance of a given latlong.
        router.route('/jobsWithinDistance')
          .get(function(req, res) {

            var lat = req.body.latitude;
            var long = req.body.longitude;
            var maxDistance = req.body.radius; // In Miles

            // var lat1 = 42.359622;
            // var lon1 = -71.051481;
            // var maxDistance = 2;

            Job.find(function(err, jobs) {
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

          });

          //Find all jobs for a given user.
          router.route('/jobsForUser/:customerId')
            .get(function(req, res) {

              Job.find({customerId : req.params.customerId}).exec(function(err, jobs) {
                  if (err){
                    res.send(err);
                  }
                  res.json(jobs);
              });

            });

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
          }

          //Create ourselves a .toRadians() function for simplicty
          function toRadians(degrees){
            return degrees * Math.PI / 180;
          }

    }



  };
