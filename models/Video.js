const { Schema, model } = require('mongoose');

const postSchema = new Schema({
    id: String,
    thumbnail: String,
    title: String,
    author: { type: Schema.Types.ObjectId, ref: 'User' },
});

module.exports = model('Video', postSchema);