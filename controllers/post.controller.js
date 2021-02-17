const PostModel = require('../models/post.model.js');
const UserModel = require('../models/user.model.js');
const { uploadErrors } = require('../utils/errors.utils');
const fs = require('fs');  // truc de base de node
const { promisify } = require('util');
const pipeline = promisify(require('stream').pipeline);
const ObjectID = require('mongoose').Types.ObjectId;  // utile pour vérifier dans la bdd


module.exports.readPost = async (req, res) => {
    PostModel.find((err, data) => {
        if (!err) res.send(data)
        else console.log("Error to get data ->", err)
    }).sort({ createdAt: -1 });
}

module.exports.createPost = async (req, res) => {

    let fileName;

    if (req.file !== null) {
        try {
            if (
                req.file.detectedMimeType !== 'image/jpg' &&
                req.file.detectedMimeType !== 'image/jpeg' &&
                req.file.detectedMimeType !== 'image/png'
            ) {
                throw Error('Invalid file');
            }
            if (req.file.size > 500000) throw Error('Max size');
        } catch (err) {
            const errors = uploadErrors(err)
            return res.status(201).json({ errors });
        }

        fileName = req.body.posterId + Date.now() + '.jpg';

        await pipeline(
            req.file.stream,
            fs.createWriteStream(
                `../client/public/uploads/posts/${fileName}`
            )
        );
    }
    //1ere methode pour add new post
    // const { posterId, message, picture, video } = req.body;
    // try {
    //     const post = await PostModel.create({ posterId, message, picture, video });
    //     res.status(201).json({ post })
    //     console.log("New post :", req.body)
    // }
    // catch (err) {
    //     console.log("err", err);
    //     res.status(400).send({ err });
    // }

    //2eme methode
    const newPost = new PostModel({
        posterId: req.body.posterId,
        message: req.body.message !== null ? req.body.message : "",
        picture: req.file !== null ? './uploads/posts/' + fileName : "",
        video: req.body.video,
        likers: [],
        comments: [],
    })

    try {
        const post = await newPost.save();
        console.log("BRAVO POST UPLOADED", newPost)
        return res.status(201).json(post);
    } catch (err) {
        return res.status(400).send(err);
    }
}

module.exports.updatePost = async (req, res) => {
    if (!ObjectID.isValid(req.params.id)) {
        return res.status(400).send('Invalid ID : ' + req.params.id)
    }

    try {
        // findOneAndUpdate : 1er param on trouve celui à update, 2eme on change, 3eme params chiants obligatoires
        await PostModel.findOneAndUpdate({
            _id: req.params.id
        }, {
            $set: {
                message: req.body.message
            }
        },
            { new: true },
            (err, data) => {
                if (!err) return res.send(data);
                if (err) console.log(err)
                if (err) return res.status(500).send({ message: err });
            }
        )
    } catch (err) {
        return res.status(500).json({ message: err })
    }
}

module.exports.deletePost = async (req, res) => {
    if (!ObjectID.isValid(req.params.id)) {
        return res.status(400).send('Invalid ID : ' + req.params.id)
    }

    const postToDelete = await PostModel.findOne({ _id: req.params.id })

    if (postToDelete) {
        await PostModel.deleteOne({ _id: req.params.id });
        res.status(200).json({ message: "Post successfully deleted " });
    } else {
        return res.status(500).json({ message: "No post to delete" })
    }
}

module.exports.likePost = async (req, res) => {
    if (!ObjectID.isValid(req.params.id) || !ObjectID.isValid(req.body.idLiker)) {
        return res.status(400).send('Invalid ID : ' + req.params.id)
    }
    try {
        // add to the post likes list
        await PostModel.findByIdAndUpdate(
            req.params.id, // ID du post liké
            { $addToSet: { likers: req.body.idLiker } }, // ID de celui qui va like le post
            { new: true }, // param chiants obligatoires
            (err, data) => {
                if (!err) {
                    res.status(201).json(data)
                } else {
                    return res.status(400).send(err)
                }
            }
        )

        // add to the user likes list
        await UserModel.findByIdAndUpdate(
            req.body.idLiker, // ID de celui qui va like
            { $addToSet: { likes: req.params.id } }, // ID du post à like
            { new: true }, // param chiants obligatoires
            (err) => {
                //res.status(201).json(data) on peut pas renvoyer 2 fois une reponse on l'a déjà fait à l'étape du dessus
                if (err) return res.status(400).send(err)
            }
        )
    } catch (err) {
        res.status(400).json({ message: err })
    }
}

module.exports.unlikePost = async (req, res) => {
    if (!ObjectID.isValid(req.params.id) || !ObjectID.isValid(req.body.idLiker)) {
        return res.status(400).send('Invalid ID : ' + req.params.id)
    }
    try {
        // delete from the post likes list
        await PostModel.findByIdAndUpdate(
            req.params.id, //
            { $pull: { likers: req.body.idLiker } }, // ID du user qui ne like plus
            { new: true }, // param chiants obligatoires
            (err, data) => {
                if (!err) {
                    res.status(201).json(data)
                } else {
                    return res.status(400).send(err)
                }
            }
        )

        // delete to the user likes list
        await UserModel.findByIdAndUpdate(
            req.body.idLiker, // ID de celui qui ne va plus like
            { $pull: { likes: req.params.id } }, // ID du post qui ne va plus être liké
            { new: true }, // param chiants obligatoires
            (err) => {
                //res.status(201).json(data) on peut pas renvoyer 2 fois une reponse on l'a déjà fait à l'étape du dessus
                if (err) return res.status(400).json(err)
            }
        )
    } catch (err) {
        res.status(400).json({ message: err })
    }

}

module.exports.commentPost = async (req, res) => {
    if (!ObjectID.isValid(req.params.id) || !ObjectID.isValid(req.body.commenterId)) {
        return res.status(400).send('Invalid ID : ' + req.params.id)
    }
    try {
        PostModel.findByIdAndUpdate(
            req.params.id,
            {
                $push: {
                    comments: {
                        commenterId: req.body.commenterId,
                        commenterPseudo: req.body.commenterPseudo,
                        text: req.body.text,
                        timestamp: new Date().getTime()
                    }
                }
            },
            { new: true },
            (err, data) => {
                if (!err) return res.send(data);
                if (err) return res.status(400).send(err);
            })
    }
    catch (err) {
        return res.status(400).send(err);
    }
}

module.exports.editCommentPost = async (req, res) => {
    if (!ObjectID.isValid(req.params.id)) {
        return res.status(400).send('Invalid ID : ' + req.params.id)
    }

    try {
        PostModel.findById(req.params.id,
            (err, data) => {
                for (i = 0; i < data.comments.length; i++) {
                    if (data.comments[i]._id == req.body.commentId) {
                        data.comments[i].text = req.body.text
                    }
                }
                data.save()
            }
        )
        res.send('comment edited successfully')
    }
    catch {
        return res.status(400).send(err);
    }
}

module.exports.deleteCommentPost = async (req, res) => {
    if (!ObjectID.isValid(req.params.id) || !ObjectID.isValid(req.body.commentId)) {
        return res.status(400).send('Invalid ID : ' + req.params.id)
    }

    try {
        return PostModel.findByIdAndUpdate(
            req.params.id,
            {
                $pull: {
                    comments: {
                        _id: req.body.commentId,
                    }
                }
            },
            { new: true },
            (err, data) => {
                if (!err) return res.send(data);
                else return res.status(400).send(err)
            }
        )
    } catch (err) {
        return res.status(400).send(err);
    }
}