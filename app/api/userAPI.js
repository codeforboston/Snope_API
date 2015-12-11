var User     = require('./../models/user');

module.exports = {

setupUsersAPI : function(router){

// Users ----------------------------------------------------
router.route('/users')

    // create a user (accessed at POST /api/users)
    .post(function(req, res) {

        var user = new User(); // create a new instance of the User model

        //Map all of the user properties from the request to our user object:
        user.username    = req.body.username;
        user.email       = req.body.email;
        user.firstName   = req.body.firstName;
        user.lastName    = req.body.lastName;
        user.phoneNumber = req.body.phoneNumber;
        user.address     = req.body.address;
        user.type        = req.body.type;
        user.password    = req.body.password;

        // save the user and check for errors
        user.save(function(err) {
            if (err){
                res.json({
                  statusCode : 500,
                  message    : 'There was a problem creating a new user Account.'
                });
              }
            res.json({
              statusCode : 200,
              message: 'User Account Successfully created!'
            });
        });

    })

    //Return all users//Shoveler or Customer
    .get(function(req, res) {
        User.find(function(err, users) {
            if (err){
              res.send(err);
            }
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

            if (err){
                res.send(err);
              }

            //Grab all fields from the request and if present, update our user.
            if(req.body.username) user.username = req.body.username;
            if(req.body.firstName) user.firstName = req.body.firstName;
            if(req.body.lastName) user.lastName = req.body.lastName;
            if(req.body.phoneNumber) user.phoneNumber = req.body.phoneNumber;
            if(req.body.address) user.address = req.body.address;
            if(req.body.type) user.type = req.body.type;
            if(req.body.password) user.password = req.body.password;

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

      //Temporary login until we have auth properly built out.
      router.route('/login')
        .post(function(req, res) {

          var email = req.body.email;
          var password = req.body.password;

          User.findOne({email : req.body.email}).exec(function(err, user) {
              if (err || user == null){
                res.json({statusCode:500, message: "User Not found"});
              }

              if(password == user.password){
                res.json(
                  {
                    statusCode: 200,
                    message: 'successfully logged in',
                    customerId: user._id,
                    type: user.type
                  }
                );
              }else{
                res.json({statusCode:401, message: "Password incorrect. Login unsuccessful."});
              }
          });

        });

    }

  };
