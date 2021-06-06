import React, { useState } from 'react'
import TextField from '@material-ui/core/TextField';
import classes from './Login.module.css';
import Button from '@material-ui/core/Button';
import { Alert, AlertTitle } from '@material-ui/lab';
import { useHistory } from 'react-router-dom';
import Axios from 'axios';
import { API_URL } from '../../Config/config';

function Login({ onLogin }) {
    const history = useHistory();
    const [missingFieldsAlert, setMissingFieldsAlert] = useState(false);
    const [invalidFieldsAlert, setInvalidFieldsAlert] = useState(false);
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');

    const validate = () => {
        if (username == "" || password == "") {
            setMissingFieldsAlert(true)
            setTimeout(() => {
                setMissingFieldsAlert(false)
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
            }).catch((err)=> {
                console.log(err);
                setInvalidFieldsAlert(true);
                setTimeout(() => {
                    setInvalidFieldsAlert(false)
                }, 3000);
            })
        }
    }

    return (
        <div className={classes.container}>
            <div className={classes.formLayout}>
                <form className={classes.loginBox}>
                    <TextField className={classes.loginInput} data-testid="nameField" value={username} onChange={(event) => setUsername(event.target.value)} id="username" label="username" variant="filled" color="secondary" />
                    <TextField className={classes.loginInput} data-testid="passwordField" value={password} onChange={(event) => setPassword(event.target.value)} id="password" label="password" type="password" variant="filled" color="secondary" />
                    <Button className={classes.loginBtn} data-testid="loginBtn" variant="outlined" size="medium" onClick={validate}>
                        Login
                    </Button>
                </form>
                {missingFieldsAlert &&
                    <Alert severity="error">
                        <AlertTitle data-testid="loginAlert">Error</AlertTitle>
                        Password and username are required
                    </Alert>
                }
                {invalidFieldsAlert &&
                    <Alert severity="error">
                        <AlertTitle data-testid="loginAlert">Error</AlertTitle>
                        Username or password are incorect!
                    </Alert>
                }
            </div>
        </div>
    )
}

export default Login;