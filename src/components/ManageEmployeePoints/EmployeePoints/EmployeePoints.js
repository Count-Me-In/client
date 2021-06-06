import React, { useState } from 'react';
import { TextField } from '@material-ui/core';
import classes from './EmployeePoints.module.css'
import { width } from '@material-ui/system';

function EmployeePoints({name, points, username, onPointsChanged}) {
    const [empPoints, setPoints] = useState(points);


    return (
        <div className={classes.employee}>
            <label>{name}</label>
            <TextField
                style={{width:'5vw'}}
                value={empPoints}
                type='number'
                onChange={(ev) => {
                    if (onPointsChanged(username, ev.target.value)) {
                        setPoints(ev.target.value)
                    } else {
                        alert("You have reached your total points");
                    }
                }
                }
                // label='points'
            />
        </div>)
}

export default EmployeePoints;