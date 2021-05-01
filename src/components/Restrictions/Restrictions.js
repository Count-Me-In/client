import React, { useState, Text, useEffect } from 'react';
import classes from './Restrictions.module.css'
import { FormControlLabel, Radio, RadioGroup, TextField } from '@material-ui/core';
import DaysCheckBox from '../DaysCheckBox/DaysCheckBox';
import Axios from 'axios';
import { API_URL, TOKEN } from '../../Config/config';

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




    const addEmpRestriction = (employeeName, allowedDays) => {
        console.log(employeeName)
        console.log(allowedDays)
        var allowed = [false, false, false, false, false]
        for(var i = 0; i < allowedDays.length; i++){
            var day = allowedDays[i]
            if(day >= 0 && day < 5){
                allowed[day] = true 
            }
        }
        console.log(allowed)

        updateRestrictions(empRestrictions.push({name: employeeName, restrictions: allowed}))
    } 

    //triggered onpage load
    useEffect(() => {
        Axios.get(`${API_URL}/managers/getEmployeesRestrictions`, {headers: {
            'Authorization': `Bearer ${TOKEN()}`,
          }}).then(({data}) => {
              console.log(data)
            
            for (const [key, value] of Object.entries(data)) {
                addEmpRestriction(key, value['_allowed_days'])
            } 
            console.log(empRestrictions)
            if(empRestrictions.lengh > 0){
                selectEmployee(empRestrictions[0])
            }
        }).catch((err)=> console.log(err))
    }, []);


    const updateUserRestrictions = (restrictions) => {
        const newEmpRestriction = empRestrictions.map((emp) => emp.name !== employee.name ? emp : { name: emp.name, restrictions });
        const updatedEmployee = newEmpRestriction.find((emp) => emp.name === employee.name)
        updateRestrictions(newEmpRestriction);
        selectEmployee(updatedEmployee);
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