const express = require('express');
const app = express();
const users = require('./routes/users');
const favorites = require('./routes/favorites');
const image = require('./routes/image');
const cors = require('cors');
const bodyParser = require("body-parser");

app.use(cors());
app.set('trust proxy', true);

app.use(bodyParser.json({limit: '25mb'}));

app.use('/users', users);
app.use('/favorites', favorites);
app.use('/image', image);

app.use('/public', express.static('public'));

require('dotenv').config();
const dbConnData = {
    host: process.env.MONGO_HOST || '127.0.0.1',
    port: process.env.MONGO_PORT || 27017,
    database: process.env.MONGO_DATABASE || 'projekt'
};
// Łączymy się z bazą i „stawiamy” serwer API
// Do kontaktu z serwerem MongoDB wykorzystamy bibliotekę Mongoose

const mongoose = require('mongoose');

mongoose
  .connect(`mongodb://${dbConnData.host}:${dbConnData.port}/${dbConnData.database}`, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false
  })
  .then(response => {
    console.log(`Connected to MongoDB. Database name: "${response.connections[0].name}"`)
    const port = process.env.PORT || 5000
    app.listen(port, () => {
      console.log(`API server listening at http://localhost:${port}`);
    });
  })
  .catch(error => console.error('Error connecting to MongoDB', error));

