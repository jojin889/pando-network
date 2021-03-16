import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { uploadPicture } from '../../actions/user.action';

const UploadImg = () => {
    const [file, setFile] = useState();
    const dispatch = useDispatch();
    const userData = useSelector((state) => state.userReducer);

    const handlePicture = (e) => {
        e.preventDefault();
        const data = new FormData();
        data.append('upload_preset', "lnyo1emx");
        data.append("file", file);
        data.append("public_id", file.name)

        dispatch(uploadPicture(data, userData._id));
    }

    return (
        <form action="" onSubmit={handlePicture} className="upload-pic">
            <label htmlFor="file">Changer de photo de profil</label>
            <input type="file" id="file" name="file" accept=".jpg, .jpeg, png" onChange={(e) => setFile(e.target.files[0])} />
            <br />
            <input type="submit" value="Envoyer"></input>
        </form>
    )
}

export default UploadImg;
