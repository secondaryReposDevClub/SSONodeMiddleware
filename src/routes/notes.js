const express = require('express');
const Note = require('../models/note');
const auth = require('../middleware/auth');

const router = express.Router();

// homepage for notes
router.get('/', auth, async (req, res) => {
    const user_id = req.user.id;
    try {
        const notes = await Note.findOne({ user_id: user_id });
        return res.render('notes', { notes: notes });
    } catch (err) {
        next(err);
    }
});

// post route to add a new note
router.post('/add', auth,(req, res) => {
    const user_id = req.user.id;
    try {
        const foundnotes = await Note.findOne({ user_id: user_id });
        const newNote = req.body.note;
        foundnotes.notes.push(newNote);
        await notes.save();
        return res.redirect('/notes');
    } catch (err) {
        next(err);
    }
});

module.exports = router;
