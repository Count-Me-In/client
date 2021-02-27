import React, { useState } from 'react'
import TextField from '@material-ui/core/TextField';
import classes from './Login.module.css';
import Button from '@material-ui/core/Button';
import { Alert, AlertTitle } from '@material-ui/lab';
import { useForm } from 'react-hook-form';
import HomePage from '../HomePage/HomePage'
import { useHistory } from 'react-router-dom';
import { Checkbox, FormControlLabel } from '@material-ui/core';


function Login({ onLogin }) {
    const history = useHistory();
    const [showAlert, setAlert] = useState(false);
    const [id, setId] = useState('');
    const [isManager, setIsManager] = useState(false);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const validate = () => {
        if (email == "" || password == "" || id == "") {
            setAlert(true)
            setTimeout(() => {
                setAlert(false)
            }, 3000);
        } else {
            onLogin({ email: email, isManager: true})
            history.replace("home");
        }
    }

    return (
        <div className={classes.container}>
            <div className={classes.formLayout}>
                <h2 className={classes.title}>Login</h2>
                <form className={classes.loginBox}>
                    <TextField className={classes.loginInput} value={id} onChange={(event) => setId(event.target.value)} id="id" label="id" variant="filled" color="secondary"/>
                    <TextField className={classes.loginInput} value={email} onChange={(event) => setEmail(event.target.value)} id="email" label="email" variant="filled" color="secondary"/>
                    <TextField className={classes.loginInput} value={password} onChange={(event) => setPassword(event.target.value)} id="password" label="password" type="password" variant="filled" color="secondary" />
                    <Button className={classes.loginBtn} variant="outlined" size="medium" onClick={validate}>
                        Login
                </Button>
                </form>
                {showAlert &&
                <Alert severity="error">
                    <AlertTitle>Error</AlertTitle>
                    Password and email are required
                </Alert>
            }
            </div>
        </div>
    )
}

export default Login;