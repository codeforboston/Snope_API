var Job = require('./../models/job');

module.exports = {

setupJobsAPI : function(router){
  // Jobs API ----------------------------------------------------
  router.route('/jobs')

      // create a job (accessed at POST /api/jobs)
      .post(function(req, res) {

          var job = new Job();
          job.customerId = req.body.customerId;
          job.latitude = req.body.latitude;
          job.longitude = req.body.longitude;
          job.confirmationCode = req.body.confirmationCode;

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

                job.customerId = req.body.customerId;
                job.shovelerId = req.body.shovelerId;
                job.latitude = req.body.latitude;
                job.longitude = req.body.longitude;
                job.confirmationCode = req.body.confirmationCode;
                job.creationTime = req.body.creationTime;
                job.completionTime = req.body.completionTime;

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
