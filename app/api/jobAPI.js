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
          job.zip = req.body.zip;
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
                if(req.body.state) job.state = req.body.state;
                if(req.body.zipCode) jobCode.zip = req.body.zipCode;
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


        router.route('/test')var maxDistance = 2;
          .get(function(req, res) {
            console.log('test');
            var lat1 = 42.359622;
            var lon1 = -71.051481;
            var maxDistance = 2;

            Job.find(function(err, jobs) {
                if (err)
                    res.send(err);
                // res.json(jobs);
                var n = 0;
                for (var i = 0; i < jobs.length; i++){
                  //Debug:
                  // console.log('jobs length: ' + jobs.length);
                  // console.log('lat1 : ' + lat1);
                  // console.log('lon1 : ' + lon1);
                  // console.log('job.latitude : ' + jobs[i].latitude);
                  // console.log('job.longitude : ' + jobs[i].longitude);
                  // console.log('distance: ' + calculateDistance(lat1, lon1, jobs[i].latitude, jobs[i].longitude));


                  if (calculateDistance(lat1, lon1, jobs[i].latitude, jobs[i].longitude) < maxDistance){
                    //This one's good, add to our list.
                  }

                }
            });

            // var dist = calculateDistance(lat1, lon1, lat2, lon2);

            // console.log('Distance is: ' + dist + ' miles!');
          });


          //Calculate distance using the haversine formula
          function calculateDistance (lat1, lon1, lat2, lon2){

            //Create ourselves a .toRadians() function for simplicty
            // if (Number.prototype.toRadians === undefined) {
            //     Number.prototype.toRadians = function() { return this * Math.PI / 180; };
            // }

            var R = 6371000; // Radius of earth
            // var φ1 = lat1.toRadians();
            // var φ2 = lat2.toRadians();
            // var Δφ = (lat2-lat1).toRadians();
            // var Δλ = (lon2-lon1).toRadians();
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

          function toRadians(degrees){
            return degrees * Math.PI / 180;
          }

    }



  };
