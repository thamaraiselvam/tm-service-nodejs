const express = require('express');
const app = express();
const bearerToken = require('express-bearer-token');
var cors = require('cors')

app.use(bearerToken());


app.use(cors({// Website you wish to allow to connect
    // 'Access-Control-Allow-Origin': 'http://localhost',
    
    
    // // Request methods you wish to allow
    // 'Access-Control-Allow-Methods': 'GET, POST, OPTIONS, PUT, PATCH, DELETE',
    
    // // Request headers you wish to allow
    // 'Access-Control-Allow-Headers': 'Access-Control-Allow-Headers: X-Requested-With, Content-Type, Origin, Cache-Control, Pragma, Authorization, Accept, Accept-Encoding',
    
    
    // // Set to true if you need the website to include cookies in the requests sent
    // // to the API (e.g. in case you use sessions)
    // 'Access-Control-Allow-Credentials': true,
    
    // 'Access-Control-Max-Age': '1000',
    origin: 'http://localhost:4200',
    credentials: true
}));

app.use([
    '/user/logout','/user/update',
    '/task/add','/task/update','/task/list','/task/delete'
    ], async (req, res, next) => {
        console.log("Requesting Token", req.    token);
    if(!req.token)  res.status(401).send(JSON.stringify({status:'error', 'message':'Token is missing'}));;
    try{
        await utils.ValidateToken(req.token)
        next();
    } catch(err){
        res.status(401).send({status:'error', 'message':err.message});
    }
})

app.get('/', (req, res) => {
    res.status(400).send({status:'error', 'message':'Invalid endpoint'});;
})

module.exports = app;