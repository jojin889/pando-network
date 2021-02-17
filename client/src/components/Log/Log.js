import React, { useState } from 'react';
import SignInForm from "./SignInForm";
import SignUpForm from "./SignUpForm";

const Log = ( props ) => {
    const [signUpModal, setSignUpModal] = useState(props.signUp);
    const [signInModal, setSignInModal] = useState(props.signIn);

    const handleModals = (e) => {
        if (e.target.id === 'register') {
            setSignInModal(false);
            setSignUpModal(true);
        } else if (e.target.id === 'login') {
            setSignInModal(true);
            setSignUpModal(false);
        }
    }


    return (
        <div className="connection-form">
            <div className="form-container">
                <ul>
                    <li onClick={handleModals} id="login" className={signInModal ? "active-btn" : ""}>Se connecter</li>
                    <li onClick={handleModals} id="register" className={signUpModal ? "active-btn" : ""}>S'inscrire</li>
                </ul>
                {signUpModal && <SignUpForm />}
                {signInModal && <SignInForm />}
            </div>
        </div>
    )
}

export default Log;
