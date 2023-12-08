const app = require('express');
const { model } = require("../model/data.model");
const { generateRhyme, generateBiasSummary } = require('../utils/generate');
const session = require('express-session');
const route = app.Router()

require('dotenv').config()

route.post('/', async (req, res) => {
    const { headline, content, url } = req.body;

    let data = await model.findOne({url});

    if(data != null) {
        console.log('Serving cache data...')
        res.status(200).json(data)
        return
    }

    try {
        console.log('Generating new data...')
        const rhyme = await generateRhyme(headline);
        const biasSummary = await generateBiasSummary(content);

        const data = new model({
            headline: rhyme,
            content: biasSummary,
            url: url
        });

        data.save();

        res.status(201).json(data);
    } catch (e) {
        res.status(500).json({ error: "Failed to generate news data" + e });
    }
});

route.get('/', async (req, res) => {
    try {
        const data = await model.find().sort({ createdAt: 1 });
        res.status(200).json(data);
    } catch (error) {
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

const sessionConfig = session({
    secret: process.env.session_secret_key,
    resave: false,
    saveUninitialized: true
})

route.all('/view', sessionConfig, async (req, res) => {
    let pageError = {
        error: null
    }

    let isAuthenticated = false;

    let authPasscode = process.env.auth_passcode
    let passcode = req.session.passcode
    if(req.method == 'GET'){
        isAuthenticated = authPasscode == passcode
    }
    else if(req.method == 'POST' && req.body.passcode){
        if(req.body.passcode == authPasscode){
            req.session.passcode = req.body.passcode
            isAuthenticated = true
        }
        else{
            pageError.error  = 'Invalid Passcode'
        }
    }
    if(isAuthenticated == false){
        res.render('login', pageError);
        return;
    }

    let { url } = req.query;

    if(!url) res.status(400).send();

    try {
        const data = await model.findOne({url});
        if(data == null) res.status(404).send()
        else {
            res.render('ndtv', data)
        }
    } catch (error) {
        res.status(500).json({ error: 'Internal Server Error' });
    }
})

module.exports = {route}