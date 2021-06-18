import React, { useState, Text, useEffect } from 'react';
import classes from './Restrictions.module.css'
import { FormControlLabel, Radio, RadioGroup, TextField } from '@material-ui/core';
import DaysCheckBox from '../DaysCheckBox/DaysCheckBox';
import Axios from 'axios';
import { API_URL, TOKEN } from '../../Config/config';

function Restrictions() {
    const [empRestrictions, updateRestrictions] = useState([])
    const [employee, selectEmployee] = useState({});

    const createAllowedArr = (allowedDays) => {
        var allowed = [false, false, false, false, false]
        for (var i = 0; i < allowedDays.length; i++) {
            var day = allowedDays[i] - 1
            if (day >= 0 && day < 5) {
                allowed[day] = true
            }
        }
        console.log(allowed)
        return allowed
    }

    //triggered onpage load
    useEffect(() => {
        Axios.get(`${API_URL}/managers/getEmployeesRestrictions`).then(({ data }) => {
            console.log(data)
            var restrictions = []
            for (const value of data) {
                restrictions.push({ name: value['_name'], username: value['_username'], restrictions: createAllowedArr(value['_restriction']['_allowed_days'])})
            }
            updateRestrictions(restrictions)
            console.log(empRestrictions)
            if (empRestrictions.length > 0) {
                selectEmployee(empRestrictions[0].username)
            }
        }).catch((err) => console.log(err))
    }, []);

    const updateUserRestrictions = (restrictions) => {
        const newEmpRestriction = empRestrictions.map((emp) => emp.username !== employee.username ? emp : { ...emp, restrictions });

        var allowed = []
        for(var i = 0; i < restrictions.length; i++){
            if(restrictions[i]){
                allowed.push(i + 1);
            }
        }

        Axios.post(`${API_URL}/managers/setRestrictions`, {'_allowed_days': allowed}, {
            params: {
                'employee_username': employee.username,
            }
        }).then(() => {
            updateRestrictions(newEmpRestriction);
            selectEmployee(newEmpRestriction.find(emp => employee.username === emp.username));
        }).catch((err) => { console.log(err) })
    }

    const handleChange = (event) => {
        selectEmployee(empRestrictions.find(emp=>emp.username === event.target.value));
    };

    return (
        <div className={classes.container}>
            <h1 className={classes.header}><b>Days Restrictions</b></h1>
            <div className={classes.empBox}>
                <RadioGroup aria-label="employee" name="employees" value={(Object.keys(employee).length !== 0)?employee.username:''} onChange={handleChange}>
                    {empRestrictions.map((emp) => <FormControlLabel value={emp.username} control={<Radio />} label={emp.name} />
                    )}
                </RadioGroup>
            </div>
            <div className={classes.empBox}>
                <DaysCheckBox className={classes.restrictions} updateUserRestrictions={updateUserRestrictions} restrictions={(Object.keys(employee).length !== 0)?employee.restrictions:[]} />
            </div>
        </div>
    )
}

export default Restrictions;