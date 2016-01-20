var User     = require('./../models/user');

module.exports = {

  setupUsersAPI : function(router){
    //Setup routes (Endpoints for the API)
    router.route('/users')
      .post(createUser) //Create a user
      .get(getAllUsers); //Returns all users

      // Accessing a specific user:
    router.route('/users/:user_id')
      .get(getSpecificUser) //Gets the user whose ID was in the URL after /
      .put(updateUser) // Updates user with this ID
      .delete(deleteUser); //Deletes the user with this ID

    //Temporary login until we have auth properly built out.
    router.route('/login')
      .post(handleLogin);

    //Functions to handle the routes' logic:

    function createUser(req, res) {

      var user = new User(); // create a new instance of the User model

      //TODO: Backend validation before blindly persisting to DB.
      //Map all of the user properties from the request to our user object:
      user.username    = req.body.username;
      user.email       = req.body.email;
      user.firstName   = req.body.firstName;
      user.lastName    = req.body.lastName;
      user.phoneNumber = req.body.phoneNumber;
      user.address     = req.body.address;
      user.type        = req.body.type;
      user.password    = req.body.password;

      //Make sure we don't add the user to the DB if e-mail is a duplicate:
      User.findOne({email : req.body.email}).exec(function(err, existingUser) {
        if (existingUser != null){
          res.json({statusCode:500, message: "User with this e-mail already exists."});
        }else{
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
              message: 'User Account Successfully created!',
              userId: user._id,
              userType: user.type
            });
          });
        }
      });

    } //End createUser

    function getAllUsers(req, res) {
      User.find(function(err, users) {
        if (err){
          res.send(err);
        }else{
          res.json(users);
        }
      });
    } //End getAllUsers

    function getSpecificUser(req, res) {
      User.findById(req.params.user_id, function(err, user) {
        if (err){
          res.send(err);
        }else{
          res.json(user);
        }
      });
    } //End getSpecificUser

    function updateUser(req, res) {
      User.findById(req.params.user_id, function(err, user) {
        if (err){
            res.send(err);
        }else{
          //Grab all fields from the request and if present, update our user.
          if(req.body.username) user.username = req.body.username;
          if(req.body.email) user.email = req.body.email;
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

        }

      });
    } //End updateUser

    function deleteUser(req, res) {
      User.remove({_id: req.params.user_id}, function(err, user) {
        if (err){
            res.send(err);
        }else{
          res.json({ message: 'User successfully deleted' });
        }
      });
    } //End deleteUser

    function handleLogin(req, res) {
      var email = req.body.email;
      var password = req.body.password;

      User.findOne({email : req.body.email}).exec(function(err, user) {
        if (err || user == null){
          res.json({statusCode:500, message: "User Not found"});
        } else if(password == user.password){
          res.json(
            {
              statusCode: 200,
              message: 'successfully logged in',
              userId: user._id,
              userType: user.type
            }
          );
        }else{
          res.json({statusCode:401, message: "Password incorrect. Login unsuccessful."});
        }
      });

    }//End handleLogin

  } //End setupUsersAPI

}; //End module exports
