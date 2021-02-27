import React from 'react';
import { TextField, Checkbox, FormControlLabel } from '@material-ui/core';
import classes from './EmployeeDayList.module.css'
import { width } from '@material-ui/system';

function EmployeeDayList({name}) {

    return (
        <div className={classes.employee}>
            <label className={classes.checkbox}>{name}</label>
        </div>)
}

export default EmployeeDayList;