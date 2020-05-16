const mongoose = require('mongoose');

const noteSchema = mongoose.Schema({
    noteHeading: {
        type: String,
    },
    noteBody: {
        type: String,
    },
    creationDate: {
        type: Date,
        default: Date.now,
    },
    user_id: {
        type: Number,
    },
});

module.exports = mongoose.model('Note', noteSchema);
