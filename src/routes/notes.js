const express = require('express');
const Note = require('../models/note');

const router = express.Router();

// get a list of all existing notes
router.get('/', (req, res) => {
    Note.find((err, notes) => {
        if (err) {
            res.status(500).send('Oops! An error occured');
        }
        res.render('notes', { notes: notes });
    });
});

// render the form for creating a new note
router.get('/add', (req, res) => {
    res.render('addNote');
});

// add a new note
router.post('/add', (req, res) => {
    const note = new Note({
        noteHeading: req.body.noteHeading,
        noteBody: req.body.noteBody,
        user_id: req.body.user_id,
    });

    note.save();

    res.redirect('/notes');
});

// delete an existing note using its id
router.post('/delete/:id', (req, res) => {
    // try to find and delete a note using its id
    Note.findByIdAndDelete({ _id: req.params.id }, (err, doc) => {
        if (err) {
            return res.status(500).send('Oops an error occured');
        }

        // if succesfull, redirect to the notes homepage
        res.redirect('/notes');
    });
});

module.exports = router;
