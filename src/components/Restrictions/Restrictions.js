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
            for (const [key, value] of Object.entries(data)) {
                restrictions.push({ name: key, restrictions: createAllowedArr(value['_allowed_days'])})
            }
            updateRestrictions(restrictions)
            console.log(empRestrictions)
            if (empRestrictions.length > 0) {
                selectEmployee(empRestrictions[0])
            }
        }).catch((err) => console.log(err))
    }, []);


    const updateUserRestrictions = (restrictions) => {
        console.log("inside updateUserRest")
        const newEmpRestriction = empRestrictions.map((emp) => emp.name !== employee.name ? emp : { name: emp.name, restrictions });
        const updatedEmployee = newEmpRestriction.find((emp) => emp.name === employee.name)


        const name = updatedEmployee.name
        var allowed = []
        for(var i = 0; i < restrictions.length; i++){
            if(restrictions[i]){
                allowed.push(i + 1);
            }
        }
        console.log(allowed)
        console.log(name)

        Axios.post(`${API_URL}/managers/setRestrictions`, {'_allowed_days': allowed}, {
            params: {
                'employee_username': name,
            }
        }).then(() => {
            updateRestrictions(newEmpRestriction);
            selectEmployee(updatedEmployee);
        }).
        catch((err) => { console.log(err) })

        
    }

    const handleChange = (event) => {
        console.log(empRestrictions)
        console.log(typeof(empRestrictions))
        console.log(event.target.value)
        const employee = empRestrictions.find((emp) => emp.name === event.target.value)
        selectEmployee(employee);
    };


    return (
        <div>
            <h1 className={classes.header}>Day Restrictions</h1>
            <div className={classes.empBox}>
                <RadioGroup aria-label="employee" name="employees" value={(Object.keys(employee).length != 0)?employee.name:''} onChange={handleChange}>
                    {empRestrictions.map((emp) => <FormControlLabel value={emp.name} control={<Radio />} label={emp.name} />
                    )}
                </RadioGroup>
            </div>
            <div className={classes.empBox}>
                <DaysCheckBox className={classes.restrictions} updateUserRestrictions={updateUserRestrictions} restrictions={(Object.keys(employee).length != 0)?employee.restrictions:[]} />
            </div>
        </div>)
}

export default Restrictions;