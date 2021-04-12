const { Schema, model } = require('mongoose');

// Schema domyślnie dodaje unikalne pole _id, dlatego pomijamy je w deklaracji
const userSchema = new Schema({
    login: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
    },
    password: {
        type: String,
        require: true,
    },
    dateOfBirth: Date,
    favorites: [{ type: Schema.Types.ObjectId, ref: 'Video' }],
    playlists: [{ type: Schema.Types.ObjectId, ref: 'Playlist' }],
    avatar: { type: Schema.Types.ObjectId, ref: 'Image' }
});

module.exports = model('User', userSchema);