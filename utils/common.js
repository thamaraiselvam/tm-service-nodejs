const User = require('../models/user');

class commonUtils{

    getUrl(user, linkType){
        switch(linkType){
            case 'activation':
                return `${config.app.protocal}://${config.app.host}:${config.app.port}/user/activate?email=${encodeURIComponent(user.email)}&token=${encodeURIComponent(user.activationToken)}`;
                case 'resetPassword':
                return `${config.app.protocal}://${config.app.host}:${config.app.port}/user/change-password-form?email=${encodeURIComponent(user.email)}&token=${encodeURIComponent(user.resetPasswordToken)}`;
                case 'changePassword':
                return `${config.app.protocal}://${config.app.host}:${config.app.port}/user/change-password`;
        }
    }

    createHash(string) {
        return require('crypto').createHash('md5').update(string).digest('hex')
    }


    async ValidateToken(token){
        console.log('token', token);
        let response =  await User.findOne({ sessionToken: token });
        
        console.log('response', response);
        if(!response) throw Error ('Token verification failed!');

        global.userSession = response;

        return ;
    }
}

module.exports = new commonUtils();