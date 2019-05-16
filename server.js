const express    = require('express');
const bodyParser = require('body-parser');
const app        = express();
let multer       = require('multer');
global.upload    = multer({dest: 'uploads/'});

app.use('/uploads', express.static('uploads'));

app.set('view engine', 'pug')


global.config = require('./config');
global.db     = require('./libs/db').init();
global.utils  = require('./utils/common');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(require('./middleware/auth'));
app.use('/user/', require('./routers/user'));
app.use('/task/', require('./routers/task'));

app.listen(config.app.port, () => {
    console.log('Server started.. Port' , config.app.port);
})