// @flow

const router = require('express').Router();
const path = require("path");
const jsonParser = require('express').json();
let participantsList = require('../json/participants.json');
let paintingsList = require('../json/db.json');

participantsList = participantsList.map(item => {return {name: item.name, capital: item.capital} } );
paintingsList = paintingsList.filter(item => item.isInAuction).map(item => { return { name: item.name, author: item.author, startPrice: item.startPrice, owner: '-', salePrice: '-'}});

router.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '../public', 'admin.html'));
});

router.get('/participants', (req, res) => {
    res.json(participantsList);
});

router.get('/paintings', (req, res) => {
    res.json(paintingsList);
});

module.exports = router;