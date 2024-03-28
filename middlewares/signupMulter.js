const multer = require('multer');
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, './uploads')
    },
    filename: function (req, file, cb) {
      cb(null, file.originalname);
    }
  });
  
  const uploadPicture = multer({ storage }).single('profilePicture');
  module.exports=uploadPicture;
