const validator = require('validator');
const bcrypt = require('bcrypt');
const SALT_WORK_FACTOR = 10;

userSchema = db.connection.Schema({
    firstName : String,
    lastName  : String,
    contactNumber: {
        type: Number,
        size: 10
    },
    picture: String,
    email:{
        type: String,
        unique: true,
        lowercase: true,
        required: true,
        validate: (email) => {
            validator.isEmail(email)
        }
    },
    password:{
        type: String,
        required: true,
    },
    activationToken: String,
    isActivated: Boolean,
    sessionToken: String,
    resetPasswordToken: String,
}, {
    timestamps: true,
})

userSchema.pre('save', function (next) {
    console.log('save executed');
    var user = this;

    //Use current time stamp for hash generation
    user.activationToken = utils.createHash(new Date().getTime().toString());

    // only hash the password if it has been modified (or is new)
    if (!user.isModified('password')) return next();

    // generate a salt
    bcrypt.genSalt(SALT_WORK_FACTOR, function (err, salt) {
        if (err) return next(err);

        // hash the password using our new salt
        bcrypt.hash(user.password, salt, function (err, hash) {
            if (err) return next(err);

            // override the cleartext password with the hashed one
            user.password = hash;
            next();
        });
    });
});

//To send email async 
// userSchema.post('save', function (next) {
//     require('../controllers/user').sendEmail(this);
// });

userSchema.pre('findOneAndUpdate', function (next) {
    var user = this;
    // only hash the password if it has been modified (or is new)
    if (!user._update.password) return next();
    
    // generate a salt
    bcrypt.genSalt(SALT_WORK_FACTOR, function (err, salt)  {
        if (err) return next(err);
        
        // hash the password using our new salt
        bcrypt.hash(user._update.password, salt, function (err, hash)  {
            if (err) return next(err);
            
            // override the cleartext password with the hashed one
             user._update.password = hash;
             next();
         });
     });
});

module.exports = db.connection.model('User', userSchema);