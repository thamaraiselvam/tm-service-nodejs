const mongoose = require('mongoose');
mongoose.set('useFindAndModify', false);

module.exports = {
    init(){
        let self = this;

        mongoose.Promise = require('bluebird');

        mongoose.connection.on('error', err => {
            console.error('Failed to connect to MongoDB instance.')
            return err
        })
        mongoose.connection.once('open', function () {
            console.log('Connected to MongoDB instance.')
        })

        self.connection = mongoose;

        self.onReady = mongoose.connect(`mongodb://${config.db.host}:${config.db.port}/${config.db.name}`,  { useNewUrlParser: true });

        return self;
    }
};