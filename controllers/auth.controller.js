const UserModel = require('../models/user.model.js');
const jwt = require('jsonwebtoken');  // pour sécuriser l'authentification
const { signUpErrors, signInErrors } = require('../utils/errors.utils');

// creation de la fonction pour utiliser jwt et créer le token
// le TOKEN SECRET c'est dans le fichier .env

const max_age_token = 1223234230;

const createToken = (id) => {
    return jwt.sign({ id }, process.env.TOKEN_SECRET, {
        expiresIn: max_age_token
    })
}

module.exports.signUp = async (req, res) => {
    const { pseudo, email, password } = req.body;
    try {
        const user = await UserModel.create({ pseudo, email, password });
        res.status(201).json({ user: user._id })
        console.log("New user registered :", req.body.email, req.body.pseudo)
    }
    catch (err) {
        console.log("err", err);
        const errors = signUpErrors(err);
        res.status(200).send({ errors });
    }
}

module.exports.signIn = async (req, res) => {
    const { pseudo, password } = req.body;

    try {
        const user = await UserModel.login(pseudo, password);
        const token = createToken(user._id)
        //on envoie dans les cookies le token
        //1er param : nom du cookie, 2em le token, 3eme pour la sécurité
        res.cookie('jwt', token, { httpOnly: true })
        res.status(200).json({ user: user._id })
        console.log(`LOGGED IN : ${user.pseudo}`)
    } catch (err) {
        
        const errors = signInErrors(err);
        console.log("err", err.message)
        res.status(200).send({ errors, err });
    }
}

module.exports.signOut = (req, res) => {
    // on vire le cookie du jeton comme ça ça déco, puis redirect /
    console.log(`LOGGED OUT`)

    res.clearCookie('jwt')
    res.redirect('/');
}