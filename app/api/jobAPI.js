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

    }



  };
