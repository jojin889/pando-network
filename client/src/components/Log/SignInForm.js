import React, { useState } from 'react';
import axios from 'axios';

const SignInForm = () => {
    const [pseudo, setPseudo] = useState('');
    const [password, setPassword] = useState('');

    const handleLogin = (e) => {
        e.preventDefault();
        const pseudoError = document.querySelector('.email.error');
        const passwordError = document.querySelector('.password.error');

        axios({
            method: "post",
            url: `${process.env.REACT_APP_API_URL}api/user/login`,
            withCredentials: true,
            data: {
                pseudo: pseudo,
                password: password
            },
        })
            .then((res) => {
                if(res.data.errors) {
                    pseudoError.innerHTML = res.data.errors.pseudo;
                    passwordError.innerHTML = res.data.errors.password;
                } else {
                    window.location = '/';
                }
            })
            .catch((err) => {
                console.log("err from front", err)
            })
    }


    return (
        <form action="" onSubmit={handleLogin} id="sign-in-form">

            <label htmlFor="pseudo">pseudo</label>
            <br></br>
            <input
                type="text"
                name="pseudo"
                id="pseudo"
                onChange={(e) => setPseudo(e.target.value)}
                value={pseudo}
            ></input>
            <div className="email error"></div>
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

            <input type="submit" value="Se connecter" />
        </form>
    )
}

export default SignInForm
