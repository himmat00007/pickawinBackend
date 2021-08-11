require('dotenv').config({ path: __dirname + '/.env' });
require('./server/connection');

const express = require('express')
const bodyParser = require('body-parser')
const path = require('path')
const cors = require('cors')
const port = process.env['PORT'];
const app = express()

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors({ origin: "*" }));

app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, 'server/views/'));
})

const user = require('./server/routes/users');
const admin = require('./server/routes/admin');

app.use(process.env['API_V1'] + "user", user);
app.use(process.env['API_V1'] + "admin", admin);



app.use('/', express.static(__dirname + '/public/index.html'));
app.use("/public", express.static('public'))

app.listen(port, () => {
    console.log(`server running on port ${port}`);
});