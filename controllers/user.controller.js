const UserModel = require('../models/user.model.js');
const ObjectID = require('mongoose').Types.ObjectId;

module.exports.getAllUsers = async (req, res) => {
    // select tous les users mais sans les passwords
    const users = await UserModel.find().select('-password');
    res.status(200).json(users);
}

module.exports.getUser = async (req, res) => {

    if (!ObjectID.isValid(req.params.id)) {
        return res.status(400).send('Invalid ID : ' + req.params.id)
    }

    // SELECTIONNER un user avec l'ID
    // 1ere strat : const user = await UserModel.findById(req.params.id).select("-password")
    // ou 2eme :
    const user = await UserModel.findOne({ _id: req.params.id }).select("-password")
    if (user) {
        res.status(200).send(user);
    }
    else {
        res.status(400).send('Unknown ID : ' + req.params.id)
    }
}
// 3eme strat
//  UserModel.findById(req.params.id, (err, docs) => {
//     if (!err) res.send(docs);
//     else return res.status(400).send('Unknown ID : ' + err)
// }).select('-password')

module.exports.updateUser = async (req, res) => {
    if (!ObjectID.isValid(req.params.id)) {
        return res.status(400).send('Invalid ID : ' + req.params.id)
    }
    try {
        // findOneAndUpdate : 1er param on trouve celui à update, 2eme on change, 3eme params chiants obligatoires
        await UserModel.findOneAndUpdate({
            _id: req.params.id
        }, {
            $set: {
                bio: req.body.bio
            }
        },
            { new: true, upsert: true, setDefaultsOnInsert: true },
            (err, data) => {
                if (!err) return res.send(data);
                if (err) return res.status(500).send({ message: err });
            }
        )
    } catch (err) {
        return res.status(500).json({ message: err })
    }
}

module.exports.deleteUser = async (req, res) => {

    if (!ObjectID.isValid(req.params.id)) {
        return res.status(400).send('Invalid ID : ' + req.params.id)
    }
    const userToDelete = await UserModel.findOne({ _id: req.params.id })

    if (userToDelete) {
        await UserModel.deleteOne({ _id: req.params.id });
        res.status(200).json({ message: "User successfully deleted " });
    } else {
        return res.status(500).json({ message: "No user to delete" })
    }
}

module.exports.follow = async (req, res) => {
    if (!ObjectID.isValid(req.params.id) || !ObjectID.isValid(req.body.idToFollow)) {
        return res.status(400).send('Invalid ID : ' + req.params.id)
    }
    try {
        // add to the follower list
        await UserModel.findByIdAndUpdate(
            req.params.id, // ID de celui qui va follow
            { $addToSet: { following: req.body.idToFollow } }, // ID de celui qui va être follow
            { new: true, upsert: true}, // param chiants obligatoires
            (err, data) => {
                if (!err) {
                    res.status(201).json(data)
                } else {
                    return res.status(400).json(err)
                }
            }
        )

        // add to the following list
        await UserModel.findByIdAndUpdate(
            req.body.idToFollow, // ID de celui qui va être follow
            { $addToSet: { followers: req.params.id } }, // ID de celui qui va follow
            { new: true, upsert: true}, // param chiants obligatoires
            (err) => {
                //res.status(201).json(data) on peut pas renvoyer 2 fois une reponse on l'a déjà fait à l'étape du dessus
                if (err) return res.status(400).json(err)
            }
        )
    } catch (err) {
        res.status(400).json({ message: err })
    }
}

module.exports.unfollow = async (req, res) => {
    if (!ObjectID.isValid(req.params.id) || !ObjectID.isValid(req.body.idToUnfollow)) {
        return res.status(400).send('Invalid ID : ' + req.params.id)
    }
    try {
        // delete from the follower list
        await UserModel.findByIdAndUpdate(
            req.params.id, // ID de celui qui va stop de follow
            { $pull: { following: req.body.idToUnfollow } }, // ID à ne plus follow
            { new: true, upsert: true}, // param chiants obligatoires
            (err, data) => {
                if (!err) {
                    res.status(201).json(data)
                } else {
                    return res.status(400).json(err)
                }
            }
        )

        // delete from the following list
        await UserModel.findByIdAndUpdate(
            req.body.idToUnfollow, // ID de celui qui va plus être follow
            { $pull: { followers: req.params.id } }, // ID de celui qui va stop de follow
            { new: true, upsert: true}, // param chiants obligatoires
            (err) => {
                //res.status(201).json(data) on peut pas renvoyer 2 fois une reponse on l'a déjà fait à l'étape du dessus
                if (err) return res.status(400).json(err)
            }
        )
    } catch (err) {
        res.status(400).json({ message: err })
    }
}
