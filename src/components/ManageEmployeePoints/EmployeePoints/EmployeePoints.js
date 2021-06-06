import React, { useState } from 'react';
import { TextField } from '@material-ui/core';
import classes from './EmployeePoints.module.css'

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
                    } 
                }}
            />
        </div>
    )
}

export default EmployeePoints;