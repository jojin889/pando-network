import React, { useContext } from 'react'
import Log from '../components/Log/Log';
import { UidContext } from '../components/AppContext';
import UpdateProfil from '../components/Profil/UpdateProfil';

const Profil = () => {
    const uid = useContext(UidContext);
    console.log("uid", uid)

    return (
        <div className="profil-page">
            { uid ? (
                <UpdateProfil/>
            ) : (
                    <div className="log-container">
                        <Log signIn={true} signUp={false} />
                        <div className="img-container">
                            <img src='./img/log.svg' alt="img-log" />
                        </div>
                    </div>
                )}
        </div>
    )
}

export default Profil;