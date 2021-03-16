const UserModel = require("../models/user.model");
// const fs = require('fs');  // truc de base de node
// const { promisify } = require('util');
// const { uploadErrors } = require('../utils/errors.utils');


module.exports.uploadProfil = async (req, res) => {
  // try {
  //     if (
  //         req.file.detectedMimeType !== 'image/jpg' &&
  //         req.file.detectedMimeType !== 'image/jpeg' &&
  //         req.file.detectedMimeType !== 'image/png'
  //     ) {
  //         throw Error('Invalid file');
  //     }
  //     if (req.file.size > 500000) throw Error('Max size');
  // } catch (err) {
  //     const errors = uploadErrors(err)
  //     return res.status(201).json({ errors });
  // }

  // const fileName = req.body.name + '.jpg';
  console.log("req.body", req.body.url);

  try {
    await UserModel.findByIdAndUpdate(
      req.body.id,
      { $set: { picture: req.body.url } },
      { new: true },
      (err, data) => {
        if (!err) return res.send(data);
        else return res.status(500).send({ message: err });
      }
    );
  } catch (err) {
    return res.status(500).send({ message: err });
  }
};
