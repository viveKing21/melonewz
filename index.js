const express = require("express");
const { connection } = require("./db");
const { route } = require("./routes/news.route");

const path = require('path')

const app = express();

app.set('view engine', 'ejs');

app.use(express.static(path.join(__dirname, 'public')));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
    res.header('Access-Control-Allow-Headers', 'Content-Type');
    next();
});

app.use('/ndtv', route)

app.listen(8080, async () => {
    try {
        await connection;
        console.log('Connected to DB!');
        console.log('Server is running at port number 8080');
    } catch (err) {
        console.log('Failed to connect to DB');
    }
});
