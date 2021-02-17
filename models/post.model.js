const mongoose = require('mongoose');

const postSchema = new mongoose.Schema(
    {
        posterId: {
            type: String,
            required: true
        },
        message: {
            type: String,
            minlength: 1,
            maxlength: 2000,
            trim: true   // trim : ça save sans les espaces 
        },
        picture: {
            type: String
        },
        video: {
            type: String
        },
        likers: {
            type: [String]
        },
        comments: {        // sous-catégorie
            type: [
                {
                    commenterId: String,
                    commenterPseudo: String,
                    text: String,
                    timestamp: Number
                }
            ],
        },
    },
    {
        timestamps: true,
    }
);


const PostModel = mongoose.model('post', postSchema)

module.exports = PostModel;