import React, { useState } from 'react';
import axios from 'axios';
import SignInForm from './SignInForm';


const SignUpForm = () => {

    const [formSubmit, setFormSubmit] = useState(false);
    const [pseudo, setPseudo] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [controlPassword, setControlPassword] = useState('');


    const handleRegister = async (e) => {
        e.preventDefault();

        const terms = document.getElementById('terms');
        const termsError = document.querySelector('.terms.error');
        const pseudoError = document.querySelector('.pseudo.error');
        const emailError = document.querySelector('.email.error');
        const passwordError = document.querySelector('.password.error');
        const passwordConfirmError = document.querySelector('.password-confirm.error');

        passwordConfirmError.innerHTML = '';
        termsError.innerHTML = '';


        if (password !== controlPassword || !terms.checked) {
            if (password !== controlPassword)
                passwordConfirmError.innerHTML = 'Les mots de passe ne correspondent pas'
            if (!terms.checked)
                termsError.innerHTML = 'Veuillez accepter les conditions générales'
        }
        else {
            axios({
                method: "post",
                url: `${process.env.REACT_APP_API_URL}api/user/register`,
                withCredentials: true,
                data: {
                    pseudo: pseudo,
                    email: email,
                    password: password
                },
            })
                .then((res) => {
                    if (res.data.errors) {
                        pseudoError.innerHTML = res.data.errors.pseudo;
                        emailError.innerHTML = res.data.errors.email;
                        passwordError.innerHTML = res.data.errors.password;
                    } else {
                        setFormSubmit(true);
                    }
                })
                .catch((err) => {
                    console.log("err from front", err)
                })
        }
    }


    return (

        <>
            {formSubmit ? (
                <>
                    <SignInForm />
                    <h4 className="success">Enregistrement réussi, veuillez vous connecter</h4>
                </>
            ) : (


                    <form action="" onSubmit={handleRegister} id="sign-up-form">

                        <label htmlFor="email">Email</label>
                        <br></br>
                        <input
                            type="text"
                            name="email"
                            id="email"
                            onChange={(e) => setEmail(e.target.value)}
                            value={email}
                        ></input>
                        <div className="email error"></div>
                        <br></br>

                        <label htmlFor="pseudo">Pseudo</label>
                        <br></br>
                        <input
                            type="text"
                            name="pseudo"
                            id="pseudo"
                            onChange={(e) => setPseudo(e.target.value)}
                            value={pseudo}
                        ></input>
                        <div className="pseudo error"></div>
                        <br></br>

                        <label htmlFor="password">Password</label>
                        <br></br>
                        <input
                            type="password"
                            name="password"
                            id="password"
                            onChange={(e) => setPassword(e.target.value)}
                            value={password}
                        ></input>
                        <div className="password error"></div>
                        <br></br>

                        <label htmlFor="password">Password confirmation</label>
                        <input
                            type="password"
                            name="password"
                            id="password-conf"
                            onChange={(e) => setControlPassword(e.target.value)}
                            value={controlPassword}
                        ></input>
                        <div className="password-confirm error"></div>
                        <br></br>

                        <label htmlFor="terms">J'accepte les <a href="/" target="_blank" rel="noopener noreferrer">conditions générales</a> </label>
                        <input type="checkbox" id="terms" />
                        <div className="terms error"></div>

                        <input type="submit" value="S'inscrire" />
                    </form>
                )}
        </>
    )
}

export default SignUpForm;
