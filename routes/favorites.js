const express = require("express");
const router = express.Router();

const Video = require("../models/Video");

router.post("/:videoId/:userId/:title/:url", async (req, res) => {
  const data = {
    author: req.params.userId,
    id: req.params.videoId,
    title: req.params.title,
    thumbnail: req.params.url
  };

  Video.find({ id: req.params.videoId, author: req.params.userId })
    .then((result) => {
      if (result.length === 0) {
        Video.insertMany(data)
          .then((result) => {
            if (result) {
              return res.send(result);
            }
          })
          .catch((e) => {
            console.log(e.stact);
            return res.send(e.stack);
          });
      }
    })
    .catch((e) => {
      console.log(e.stact);
      return res.send(e.stack);
    });
});

router.get("/", async (req, res) => {
  const user = req.query.userId;
  const video = req.query.videoId;

  Video.find({ id: video, author: user })
    .then((result) => {
      if (result) {
        return res.send(result);
      }
    })
    .catch((e) => {
      console.log(e.stact);
      return res.send(e.stack);
    });
});

router.delete("/", async (req, res) => {
  const data = {
    author: req.query.userId,
    id: req.query.videoId,
  };

  Video.find({ id: req.query.videoId, author: req.query.userId })
    .then((result) => {
      if (result.length > 0) {
        Video.deleteOne({_id: result[0]._id})
          .then((r) => {
            Video.find({ author: req.query.userId })
            .then((result) => {
              if (result) {
                return res.send(result);
              }
            })
            .catch((e) => {
              console.log(e.stact);
              return res.send(e.stack);
            });
              // return res.send(r);
          })
          .catch((e) => {
            console.log(e.stact);
            return res.send(e.stack);
          });
      }
    })
    .catch((e) => {
      console.log(e.stact);
      return res.send(e.stack);
    });
});

router.get("/user", async (req, res) => {
    const user = req.query.userId;
  
    Video.find({ author: user })
      .then((result) => {
        if (result) {
          return res.send(result);
        }
      })
      .catch((e) => {
        console.log(e.stact);
        return res.send(e.stack);
      });
  });

module.exports = router;
