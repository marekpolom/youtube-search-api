const { Schema, model } = require('mongoose');

const imageSchema = new Schema({
    author: { type: Schema.Types.ObjectId, ref: 'User' },
    md5: String,
    img: {
        type: String
    }
});

module.exports = model('Image', imageSchema);