module.exports = {

  enableImageHosting : function(router){
    //Used to resolve path without introducing
    //potential security exploits with relative paths.
    var path = require('path');

    router.route('/:img_path')
      .get(serveImage);

    function serveImage(req, res){
      res.sendfile(path.resolve("uploadedImages/" + req.params.img_path + ".png"));
    }
  }



};
