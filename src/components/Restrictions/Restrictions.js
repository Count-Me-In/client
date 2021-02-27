import React, { useState, Text } from 'react';
import classes from './Restrictions.module.css'
import { FormControlLabel, Radio, RadioGroup, TextField } from '@material-ui/core';
import DaysCheckBox from '../DaysCheckBox/DaysCheckBox';

const employees = [
    {
        name: "Shenhav",
        restrictions: [
            true,
            true,
            true,
            true,
            true
        ]
    },
    {
        name: "Noy",
        restrictions: [
            true,
            false,
            true,
            false,
            false
        ]
    },
    {
        name: "Nufar",
        restrictions: [
            true,
            false,
            false,
            false,
            true
        ]
    },
    {
        name: "Shauli",
        restrictions: [
            false,
            false,
            false,
            false,
            false
        ]
    }
];


function Restrictions() {
    const [empRestrictions, updateRestrictions] = useState(employees)
    const [employee, selectEmployee] = useState(empRestrictions[0]);

    const updateUserRestrictions = (restrictions) => {
        const newEmpRestriction = empRestrictions.map((emp) => emp.name !== employee.name ? emp : { name: emp.name, restrictions });
        updateRestrictions(newEmpRestriction);
    }

    const handleChange = (event) => {
        const employee = empRestrictions.find((emp) => emp.name === event.target.value)
        selectEmployee(employee);
    };
    return (
        <div>
            <h1 className={classes.header}>Day Restrictions</h1>
            <div className={classes.empBox}>
                <RadioGroup aria-label="employee" name="employees" value={employee.name} onChange={handleChange}>
                    {employees.map((emp) => <FormControlLabel value={emp.name} control={<Radio />} label={emp.name} />
                    )}
                </RadioGroup>
            </div>
            <div className={classes.empBox}>
                <DaysCheckBox className={classes.restrictions} updateUserRestrictions={updateUserRestrictions} restrictions={employee.restrictions} />
            </div>
        </div>)
}

export default Restrictions;