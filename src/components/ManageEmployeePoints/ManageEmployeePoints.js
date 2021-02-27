import React, { useState, Text} from 'react';
import classes from './ManageEmployeePoints.module.css'
import { TextField} from '@material-ui/core';
import EmployeePoints from './EmployeePoints/EmployeePoints';

function ManageEmployeePoints() {
    const [totalPoints, setTotalPoints] = useState(250);
    const [employees, updateEmpPoints] = useState([
        {
            id:1,
            name: "Shenhav",
            points: 40
        },
        {
            id:2,
            name: "Noy",
            points: 50
        },
        {
            id:3,
            name: "Nufar",
            points: 100
        },
        {
            id:4,
            name: "Shauli",
            points: 10
        }
    ])

    function handlePointsChange(empName, points) {
        const updatedEmp = employees.map((emp) => emp.name === empName ? {...emp, points:points} : emp)
        const sum = updatedEmp.reduce((lastPoints, emp) => +emp.points + +lastPoints, 0)
        
        if (sum > totalPoints)
            return false;

        updateEmpPoints(updatedEmp);
        return true;
    }

    return (
        <div>
            <h1 className={classes.header}>Manage Employees Points</h1>
            <div className={classes.empBox}>
                {employees.map((emp) => <EmployeePoints onPointsChanged={handlePointsChange} key={emp.id} name={emp.name} points={emp.points}></EmployeePoints>)}
            </div>  
            <h1 className={classes.totalPoints}>Total Points: {totalPoints}</h1>
        </div>)
}

export default ManageEmployeePoints;