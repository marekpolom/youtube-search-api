const { Schema, model } = require('mongoose');

const postSchema = new Schema({
    id: String,
    name: String,
    author: { type: Schema.Types.ObjectId, ref: 'User' },
    videos: [{ type: Schema.Types.ObjectId, ref: 'Video' }]
});

module.exports = model('Playlist', postSchema);