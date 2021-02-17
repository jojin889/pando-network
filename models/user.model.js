const mongoose = require('mongoose');
// npm i validator pour valider email
const { isEmail } = require('validator');
// npm i bcrypt pour cryptage password
const bcrypt = require('bcrypt');

const userSchema = new mongoose.Schema(
    {
        pseudo: {
            type: String,
            required: true,
            minlength: 3,
            maxlength: 20,
            unique: true,
            trim: true
        },
        email: {
            type: String,
            required: true,
            validate: [isEmail],
            lowercase: true,
            unique: true,
            trim: true
        },
        password: {
            type: String,
            required: true,
            maxlength: 1024,
            minlength: 6
        },
        picture: {
            type: String,
            default: './uploads/profil/random-user.png',
        },
        bio: {
            type: String,
            maxlength: 1024
        },
        followers: {
            type: [String],
        },
        following: {
            type: [String]
        },
        likes: {
            type: [String]
        }
    },
    {
        timestamps: true,
    }
);

// password encryptage avant de save (d'où le "pré" et "save")
userSchema.pre('save', async function(next) {
    const salt = await bcrypt.genSalt();
    this.password = await bcrypt.hash(this.password, salt);
    next();
});

userSchema.statics.login = async function(pseudo, password) {
    const user = await this.findOne({ pseudo })
    if (user) {
        const auth = await bcrypt.compare(password, user.password);
        if (auth) {
            return user;
        }
        throw Error('Password incorrect');
    } throw Error('Pseudo incorrect');
}


const UserModel = mongoose.model('user', userSchema)

module.exports = UserModel;