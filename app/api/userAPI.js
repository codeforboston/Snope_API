var User     = require('./../../app/models/user');

module.exports = {

setupUsersAPI : function(router){

// Users ----------------------------------------------------
router.route('/users')

    // create a user (accessed at POST /api/users)
    .post(function(req, res) {

        var user = new User();      // create a new instance of the User model
        user.name = req.body.name;  // set the user's name (comes from the request)

        // save the user and check for errors
        user.save(function(err) {
            if (err){
                res.send(err);
              }
            res.json({ message: 'User successfully created!' });
        });

    })

    //Return all users
    .get(function(req, res) {
        User.find(function(err, users) {
            if (err)
                res.send(err);
            res.json(users);
        });
    });

    // on routes that end in /users/:user_id
    // ----------------------------------------------------
    router.route('/users/:user_id')

        // get the user with that id (accessed at GET /api/users/:user_id)
        .get(function(req, res) {
            User.findById(req.params.user_id, function(err, user) {
                if (err)
                    res.send(err);
                res.json(user);
            });
        })

        // update the user with this id (accessed at PUT /api/users/:user_id)
        .put(function(req, res) {

          // use our user model to find the user we want
          User.findById(req.params.user_id, function(err, user) {

              if (err)
                  res.send(err);

              user.name = req.body.name;  // update the users info

              // save the user
              user.save(function(err) {
                  if (err){
                    res.send(err);
                  }

                  res.json({ message: 'User successfully updated!' });
              });

          });
      })

      // delete the user with this id (accessed at DELETE /api/users/:user_id)
      .delete(function(req, res) {
          User.remove({
              _id: req.params.user_id
          }, function(err, user) {
              if (err){
                  res.send(err);
              }
              res.json({ message: 'User successfully deleted' });
          });
      });


    }

  };
