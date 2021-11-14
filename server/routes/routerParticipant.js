// @flow

const router = require('express').Router();
const path = require("path");
const jsonParser = require('express').json();
const participantList = require('../json/participants.json');
const owners = require('../json/owners.json');
const { findNameItem } = require("./secondaryFunction");

router.get('/:name', (req, res) => {
    res.sendFile(path.join(__dirname, '../public', 'participant.html'));
});

router.get('/:name/gallery', (req, res) => {
    res.sendFile(path.join(__dirname, '../public', 'participantGallery.html'));
});

router.get('/:name/gallery/data', (req, res) => {
    res.json(owners[req.params.name]);
});

router.get('/:name/data', (req, res) => {
    const item = findNameItem(participantList, req.params.name);
    res.json(item);
});

module.exports = router;