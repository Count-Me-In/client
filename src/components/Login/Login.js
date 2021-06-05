import React, { useState } from 'react'
import TextField from '@material-ui/core/TextField';
import classes from './Login.module.css';
import Button from '@material-ui/core/Button';
import { Alert, AlertTitle } from '@material-ui/lab';
import { useForm } from 'react-hook-form';
import HomePage from '../HomePage/HomePage'
import { useHistory } from 'react-router-dom';
import { Checkbox, FormControlLabel } from '@material-ui/core';
import Axios from 'axios';
import { API_URL } from '../../Config/config';

function Login({ onLogin }) {
    const history = useHistory();
    const [showAlert, setAlert] = useState(false);
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const validate = () => {
        if (username == "" || password == "") {
            setAlert(true)
            setTimeout(() => {
                setAlert(false)
            }, 3000);
        } else {
            Axios.post(`${API_URL}/authenticate`, {
                username,
                password
            }).then(({data}) => {
                Axios.defaults.headers.common["Authorization"] = `Bearer ${data.token}`
                localStorage.setItem('auth', `Bearer ${data.token}`)
                onLogin();
                history.replace("home");
            }).catch((err)=> console.log(err))
        }
    }

    

    return (
        <div className={classes.container}>
            <div className={classes.formLayout}>
                <h2 className={classes.title}>Login</h2>
                <form className={classes.loginBox}>
                    <TextField className={classes.loginInput} value={username} onChange={(event) => setUsername(event.target.value)} id="username" label="username" variant="filled" color="secondary" />
                    <TextField className={classes.loginInput} value={password} onChange={(event) => setPassword(event.target.value)} id="password" label="password" type="password" variant="filled" color="secondary" />
                    <Button className={classes.loginBtn} variant="outlined" size="medium" onClick={validate}>
                        Login
                </Button>
                </form>
                {showAlert &&
                    <Alert severity="error">
                        <AlertTitle>Error</AlertTitle>
                    Password and username are required
                </Alert>
                }
            </div>
        </div>
    )
}

export default Login;