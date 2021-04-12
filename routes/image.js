const express = require('express');
const multer = require('multer');
const uuid = require('uuid');
const fs = require('fs');

const router = express.Router();

const Image = require('../models/Image');

const DIR = './public/';

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, DIR);
    },
    filename: (req, file, cb) => {
        const fileName = file.originalname.toLowerCase().split(' ').join('-');
        cb(null, uuid.v4() + '-' + fileName)
    }
});

var upload = multer({
    storage: storage,
    fileFilter: (req, file, cb) => {
        if (file.mimetype == "image/png" || file.mimetype == "image/jpg" || file.mimetype == "image/jpeg") {
            cb(null, true);
        } else {
            cb(null, false);
            return cb(new Error('Only .png, .jpg and .jpeg format allowed!'));
        }
    }
});

// router.post('/avatar/:userId', upload.single('img'), async (req, res) => {
//   const userId = req.params.userId;
//   const url = req.protocol + '://' + req.get('host')
//   console.log(req.file)
//   Image
//     .find({author: userId})
//     .then((result) => {
//       if(result.length === 1){
//         Image
//           .updateOne({_id: result[0]._id}, {img: req.file.filename})
//           .then(r => {
//             return res.send({
//               img: req.file.filename
//             })
//           })
//           .catch((e) => {
//             console.log(e);
//             return res.send(e.stack);
//           });
//       }else{
//         Image
//           .insertMany({author: userId, name: req.body.name, img: req.file.filename})
//           .then(r => {
//             return res.send({
//               img: req.file.filename
//             })
//           })
//           .catch((e) => {
//             console.log(e);
//             return res.send(e.stack);
//           });
//       }
//     })
//     .catch((e) => {
//       console.log(e);
//       return res.send(e.stack);
//     });
// });

router.post('/avatar/:userId', async (req, res) => {
  const userId = req.params.userId;

  let base64 = req.body.img;

  let fType = req.body.img.split('/');
  fType = fType[1].split(';');

  base64 = base64.split(';base64,').pop();

  const filename = `${uuid.v4()}.${fType[0]}`;

  fs.writeFile(`public/${filename}`, base64, {encoding: 'base64'}, function(err) {
    console.log('File created');
  });

  Image
    .find({author: userId})
    .then((result) => {
      if(result.length === 1){
        Image
          .updateOne({_id: result[0]._id}, {img: filename})
          .then(r => {
            return res.send({
              img: filename
            })
          })
          .catch((e) => {
            console.log(e);
            return res.send(e.stack);
          });
      }else{
        Image
          .insertMany({author: userId, img: filename})
          .then(r => {
            return res.send({
              img: filename
            })
          })
          .catch((e) => {
            console.log(e);
            return res.send(e.stack);
          });
      }
    })
    .catch((e) => {
      console.log(e);
      return res.send(e.stack);
    });
});

router.get('/avatar/:userId', async (req, res) => {
  const userId = req.params.userId;

  Image
    .find({author: userId})
    .then((result) => {
      if(result){
        return res.send(result);
      }
    })
    .catch((e) => {
      console.log(e.stact);
      return res.send(e.stack);
    });
});

module.exports = router;
