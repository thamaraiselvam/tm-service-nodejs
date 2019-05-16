var fs = require('fs');
const User  = require('../models/user');
const Email = require('../libs/email' );
class userController{

    async register(profilePicMeta, formData){

        let userExist = await User.findOne({email: decodeURIComponent(formData.email)});

        if(userExist){
            throw Error('Email ID already Exist');
        }

        //Async but we get the filepath as well.
        let filePath = profilePicMeta ? this.saveProfilePic(profilePicMeta) : '';

        let user = new User({
            firstName    : formData.firstName,
            lastName     : formData.lastName,
            contactNumber: formData.contactNumber,
            picture      : filePath,
            email        : formData.email,
            password     : formData.password,
        })

        let userDetails = await user.save();
        let url  = this.sendEmail(userDetails);
        return { status: 'success', activationUrl: url};
    }

    saveProfilePic(fileMeta){
        return fileMeta.path;
    }
    
    deleteOldProfilePic(){
        //No need to delete if there is no profile pic
        if(!userSession.picture){
            return;
        }

        fs.unlink(userSession.picture, function(err) {
            if(err && err.code == 'ENOENT') {
                // file doens't exist
                console.info("File doesn't exist, won't remove it.");
            } else if (err) {
                // other errors, e.g. maybe we don't have enough permission
                console.error("Error occurred while trying to remove file");
            } else {
                console.info(`old picture removed`);
            }
        });
    }

    //not async because request no need to wait until email sending
    sendEmail(userDetails){
        let url = utils.getUrl(userDetails, 'activation');
        Email.send(userDetails.email, 'Activate your account', `<a href="${url}">Click here</a> to activate your account, <br> ${url}`);
    }

    async activate(request){
        let user = await User.findOne({email: decodeURIComponent(request.email), 'activationToken': decodeURIComponent(request.token)});
        if(!user){
            throw Error('activation Failed.');
        }

        if(user.isActivated){
            throw Error('user activated already!');
        }

        let updateResponse = await User.findOneAndUpdate({email: decodeURIComponent(request.email)}, {isActivated: true});

        if(!updateResponse){
            throw Error('activation update Failed. try again');
        }

        return {status: 'success', 'message': user.email + ' Activated'};
    }

    async login(request){
        let response =  await User.findOne({ email: request.email });

        // console.log(response);

        if(!response){
            throw Error ( 'username or password Mismatch!' );
        }

        let isMatch = await require('bcrypt').compare(request.password, response.password);

        if(!isMatch){
            throw Error ( 'username or password mismatch!' );
        }
        
        if(!response.isActivated){
            throw Error ( 'user not activated yet!' );
        }

        
        //Create and replace new token for every login for security purpose
        let token = await this.createSessionToken(request.email);
        
        const userInfo = {
            firstName:response.firstName,
            lastName:response.lastName,
            contactNumber:response.contactNumber,
            picture: !response.picture ? '' : `${config.app.protocal}://${config.app.host}:${config.app.port}/${response.picture}`,
            email:response.email,
            createdAt:response.createdAt,
            updatedAt:response.updatedAt,
            token:token,
        };

        return {status:'success', userInfo: userInfo, message: 'Authenticated Successfully.'};
    }

    async createSessionToken(email){
        let sessionToken = utils.createHash(new Date().getTime().toString());
        let updateResponse = await User.findOneAndUpdate({email: email}, {sessionToken: sessionToken});

        if(!updateResponse){
            throw Error('sessionToken update Failed. try again');
        }

        return sessionToken;

    }

    async update(profilePicMeta, request){

        //Async but we get the filepath as well.
        let filePath = profilePicMeta ? this.saveProfilePic(profilePicMeta) : '';

        let updateParams = {};

        if(request.firstName){
            updateParams.firstName = request.firstName;
        }

        if(request.lastName){
            updateParams.lastName = request.lastName;
        }

        if(request.contactNumber){
            updateParams.contactNumber = request.contactNumber;
        }

        if(filePath){
            updateParams.picture = filePath;
            //If new profile got updated then should delete the old one from server.
            this.deleteOldProfilePic();
        }

        if(request.email){
            if(userSession.email !== request.email){
                let userExist = await User.findOne({email: request.email});
                if(userExist){
                    throw Error('Email ID already Exist');
                }
            }
            
            updateParams.email = request.email;
        }

        

        // console.log(request);

        let updateResponse = await User.findOneAndUpdate({email: userSession.email}, updateParams);

        if(!updateResponse){
            throw Error('update Failed. try again');
        }

        let email = updateParams.email ? updateParams.email : userSession.email;
        let userInfo = await User.findOne({email: email});
        // console.log('userImfo', userInfo);
        return {
            status:'success',
            message: 'Updated successfully!',
            userInfo: {
                firstName: userInfo.firstName,
                lastName: userInfo.lastName,
                contactNumber: userInfo.contactNumber,
                picture: !userInfo.picture ? '' : `${config.app.protocal}://${config.app.host}:${config.app.port}/${userInfo.picture}`,
                email: userInfo.email,
                createdAt: userInfo.createdAt,
                updatedAt: userInfo.updatedAt,
                token: userInfo.sessionToken,
            }
        };
    }

    async logout(){

        let updateResponse = await User.findOneAndUpdate({sessionToken: userSession.sessionToken}, {sessionToken: false});

        if(!updateResponse){
            throw Error('sessionToken update Failed. try again');
        }
        
        return {status:'success', message: 'user logged out successfuly!'};
    }

    async resetPassword(request){
        let user = await User.findOne({email: decodeURIComponent(request.email)});

        if(!user){
            throw Error('Account not found.');
        }

        let token = utils.createHash(new Date().getTime().toString());
        let updateToken = await User.findOneAndUpdate({email: request.email}, {resetPasswordToken: token});
        // console.log(user);
        if(!updateToken){
            throw Error('resetPasswordToken update Failed. try again');
        }

        user.resetPasswordToken = token;

        let url = utils.getUrl(user, 'resetPassword');
        // console.log(user.email);
        Email.send(user.email, 'Reset your password', `Hi There, <br> <a href="${url}">Change password</a>`);
        return {status:'success', 'message': `reset link sent to your email`, resetPasswordUrl: url};
    }
    
    async changePassword(request){
        let user = await User.findOne({email: decodeURIComponent(request.email), resetPasswordToken: decodeURIComponent(request.token)});
        if(!user){
            throw Error('invalid Token!');
        }
        
        let updateResult = await User.findOneAndUpdate({email: decodeURIComponent(request.email)}, {'password': request.password, resetPasswordToken: false});

        if(!updateResult){
            throw Error('password update Failed. try again');
        }

        return {status: 'success', 'message': 'new password changed successfully.'};
    }
   
}

module.exports = new userController;