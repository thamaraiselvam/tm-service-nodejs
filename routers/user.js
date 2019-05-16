const express = require('express');
const app = express.Router();

const userController = require('../controllers/user');

app.post('/register', upload.single('file'), async (req, res) => {
    try{
        let response = await userController.register(req.file, req.body);
        res.send(response);
    } catch(err) {
        console.log(err);
        res.status(500).send(JSON.stringify({status:'error', 'message':err.message}));
    }
})

app.get('/activate', async (req, res) =>{
    try{
        let response = await userController.activate(req.query);
        console.log(response);
        res.send(response);
    } catch(err) {
        console.log(err);
        res.status(401).send(JSON.stringify({status:'error', 'message':err.message}));
    }
})

app.post('/login', async (req, res) =>{
    console.log(req.query);
    try{
        let response = await userController.login(req.body);
        console.log(response);
        res.send(response);
    } catch(err) {
        console.log(err);
        res.status(401).send(JSON.stringify({status:'error', 'message':err.message}));
    }
})

app.put('/update', upload.single('file'), async (req, res) =>{
    try{
        let response = await userController.update(req.file, req.body);
        res.send(response);
    } catch(err) {
        console.log(err);
        res.status(401).send(JSON.stringify({status:'error', 'message':err.message}));
    }
})

app.post('/logout', async (req, res) =>{
    try{
        let response = await userController.logout();
        console.log(response);
        res.send(response);
    } catch(err) {
        console.log(err);
        res.status(401).send(JSON.stringify({status:'error', 'message':err.message}));
    }
})

app.post('/reset-password', async (req, res) =>{
    try{
        let response = await userController.resetPassword(req.body);
        // console.log(response);
        res.send(response);
    } catch(err) {
        console.log(err);
        res.status(401).send(JSON.stringify({status:'error', 'message':err.message}));
    }
})

app.post('/change-password', async (req, res) =>{
    try{
        let response = await userController.changePassword(req.body);
        console.log(response);
        res.send(response);
    } catch(err) {
        console.log(err);
        res.status(401).send(JSON.stringify({status:'error', 'message':err.message}));
    }
})

app.get('/change-password-form', async (req, res) =>{
    res.render('change-password', { url: utils.getUrl({}, 'changePassword'), token:req.query.token, email:req.query.email})
})

module.exports = app;