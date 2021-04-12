const express = require('express');
const uuid = require('uuid');

const router = express.Router();

const User = require('../models/User');
const Image = require('../models/Image');

router.get('/exist', async (req, res) => {
  const email = req.query.email;

  User
    .find({email: email})
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

router.post('/:email/:pwd/:dob/:login', async (req, res) => {
  const data = {
    login: req.params.login,
    email: req.params.email,
    password: req.params.pwd,
    dateOfBirth: req.params.dob,
  };

  User
    .insertMany(data)
    .then((result) => {
      return res.send({
        user: data
      });
    })
    .catch((e) => {
      console.log(e.stact);
      return res.send(e.stack);
    });
});

router.get('/logIn', async (req, res) => {
  const email = req.query.email;
  const pwd = req.query.pwd;

  User
    .aggregate()
    .match({email: email, password: pwd})
    .lookup({ from: 'images', localField: '_id', foreignField: 'author', as: 'avatar' })
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

router.put('/:idUser', async (req, res) => {
  const idUser = req.params.idUser;

  let x = false;
  
  await User
  .find({_id: idUser})
  .then(async (result) => {
    const email = result[0].email;
    if(req.query){
      await User
      .find({email: req.query.email})
      .then(async (r) => {
        if(r.length === 0){
          await User
          .updateOne({_id: idUser}, req.query)
          .then(async (re) => {
            x = true;
          })
          .catch((e) => {
            console.log(e.stact);
            return res.send(e.stack);
          });
        }else{
          return res.send([])
        }
      })
      .catch((e) => {
        console.log(e.stact);
        return res.send(e.stack);
      });
    }else{
      await User
      .updateOne({_id: idUser}, req.query)
      .then(async (r) => {
        x = true;
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

  if(x){
    await User
    .find({_id: idUser})
    .then(async (result) => {
      if(result){
        await User
        .aggregate()
        .match({email: result[0].email})
        .lookup({ from: 'images', localField: '_id', foreignField: 'author', as: 'avatar' })
        .then((re) => {
          if(re){
            return res.send(re);
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
  }
});

router.delete('/:idUser', async (req, res) => {
  const idUser = req.params.idUser;

  User
    .deleteOne({_id: idUser})
    .then((result) => {
      return res.send(`Deleted user: ${idUser}`);
    })
    .catch((e) => {
      console.log(e.stact);
      return res.send(e.stack);
    });
});

router.patch('/:idUser', async (req, res) => {
  const idUser = req.params.idUser;

  User
    .updateOne({_id: idUser}, {$set: req.body})
    .then((result) => {
      return res.send({
        user: result
      });
    })
    .catch((e) => {
      console.log(e.stact);
      return res.send(e.stack);
    });
});

module.exports = router;