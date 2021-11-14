const express = require("express");
const path = require("path");
const routerIndex = require("./routes/routerIndex");
const routerParticipant = require("./routes/routerParticipant");
const routerAdmin = require('./routes/routerAdmin');
const { startAuction} = require('./routes/startAuction');

const app = express();
app.use('/public', express.static(__dirname + '/public'));
app.use(express.json());

app.use('/', routerIndex);
app.use('/participant', routerParticipant);
app.use('/admin', routerAdmin);

startAuction();
app.listen(3000);