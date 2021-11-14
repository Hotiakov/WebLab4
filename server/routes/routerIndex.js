// @flow

const router = require('express').Router();
const path = require("path");
const jsonParser = require('express').json();
const participantList = require('../json/participants.json');
const { findNameItem } = require("./secondaryFunction");

router.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '../public', 'index.html'));
});

router.post('/', (req, res) => {
    const obj = req.body;
    const item = findNameItem(participantList, obj.name);
    res.json(item);
});

module.exports = router;