import React, { useState, useEffect } from 'react';
import classes from './ManageEmployeePoints.module.css'
import { Button, TextField } from '@material-ui/core';
import EmployeePoints from './EmployeePoints/EmployeePoints';
import Axios from 'axios';
import { API_URL, TOKEN } from '../../Config/config';

function ManageEmployeePoints() {
    const [totalPoints, setTotalPoints] = useState(0);
    const [leftToSplit, setPointsLeft] = useState(0);
    const [employees, updateEmpPoints] = useState([])

    useEffect(() => {
        Promise.all([Axios.get(`${API_URL}/managers/getTotalPoints`), Axios.get(`${API_URL}/managers/getEmployeesPoints`)])
            .then(([totalPointsData, epmPointsData]) => {
                setTotalPoints(totalPointsData.data);
                const result = epmPointsData.data.map(value => ({ name: value['name'], username: value['username'], points: value['points'] }));
                const sum = result.reduce((lastPoints, emp) => emp.points + lastPoints, 0)
                updateEmpPoints(result)
                setPointsLeft(totalPointsData.data - sum)
            }).catch((err) => console.log(err))
    }, []);

    function handlePointsChange(empName, points) {
        const updatedEmp = employees.map((emp) => emp.username === empName ? { ...emp, points: parseInt(points) } : emp)
        const sum = updatedEmp.reduce((lastPoints, emp) => emp.points + lastPoints, 0)

        if (sum > totalPoints) {
            return false;
        }

        setPointsLeft(totalPoints - sum);
        updateEmpPoints(updatedEmp);
        return true;
    }

    function updatePoints() {

        var employeesPoints = {};
        employees.forEach(element => {
            employeesPoints[element.username] = element.points
        })
        console.log(employees)
        console.log(employeesPoints)
        Axios.post(`${API_URL}/managers/setEmployeePoints`, employeesPoints
        ).then(() => {
            alert('Points update succesfully')
        })
    }

    return (
        <div className={classes.container}>
            <h1 className={classes.header}>Manage Employees Points</h1>
            <div className={classes.empBox}>
                {employees.map((emp) => <EmployeePoints onPointsChanged={handlePointsChange} username={emp.username} name={emp.name} points={emp.points}></EmployeePoints>)}
            </div>
            <Button onClick={updatePoints} style={{ width: 'fit-content', margin: '5px' }} variant="contained" color="primary">
                Update points
            </Button>
            <h1 className={classes.totalPoints}>Points left to split: {leftToSplit}/{totalPoints}</h1>
        </div>)
}

export default ManageEmployeePoints;