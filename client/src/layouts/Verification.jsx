import React from 'react';
import { useForm } from 'react-hook-form';
import Login from '../views/Login'


// css
import '../assets/css/verification.css';

export default function Verification() {
        const { register, handleSubmit } = useForm();
        const onSubmit = data => {
            let params = new FormData();
            params.append('username', data.username);
            params.append('password', data.password);
            fetch('/login', {method: 'POST', body: params, credentials: 'include'});
        };
        return (
            <div id="login-form">
                <div id="card">
                    <h3 id="title"><strong>Sign-In</strong></h3>
                    <Login />
                </div>
            </div>
        );
}