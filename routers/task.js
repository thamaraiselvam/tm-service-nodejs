const express = require('express');
const app = express.Router();
const taskController = require('../controllers/task');

app.post('/add', async (req, res) => {
    try{
        console.log(req.body);
        let response = await taskController.add(req.body);
        res.send(response);
    } catch(err) {
        console.log(err);
        res.status(500).send(JSON.stringify({status:'error', 'message':err.message}));
    }
})

app.put('/update', async (req, res) => {
    try{
        let response = await taskController.update(req.body);
        res.send(response);
    } catch(err) {
        console.log(err);
        res.status(500).send(JSON.stringify({status:'error', 'message':err.message}));
    }
})

app.get('/list', async (req, res) => {
    try{
        let response = await taskController.list(req.query);
        res.send({status: 'success', result: response});
    } catch(err) {
        console.log(err);
        res.status(500).send(JSON.stringify({status:'error', 'message':err.message}));
    }
})

app.post('/delete', async (req, res) => {
    try{
        let response = await taskController.delete(req.body);
        res.send(response);
    } catch(err) {
        console.log(err);
        res.status(500).send(JSON.stringify({status:'error', 'message':err.message}));
    }
})

app.post('/import/:type', upload.single('file'), async (req, res) =>{
    try{
        let response = await taskController.import(req.file, res);
        // res.send(response);
    } catch(err) {
        console.log(err);
        res.status(401).send(JSON.stringify({status:'error', 'message':err.message}));
    }
})

module.exports = app;