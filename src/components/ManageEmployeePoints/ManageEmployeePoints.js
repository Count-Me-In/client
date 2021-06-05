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
                var id = 1;
                var result = Array()
                for (const [key, value] of Object.entries(epmPointsData.data)) {
                    result.push({ id: id, name: key, points: value })
                    id++
                }


                const sum = result.reduce((lastPoints, emp) => emp.points + lastPoints, 0)
                updateEmpPoints(result)
                setPointsLeft(totalPointsData.data - sum)
            }).catch((err) => console.log(err))
    }, []);

    function handlePointsChange(empName, points) {
        const updatedEmp = employees.map((emp) => emp.name === empName ? { ...emp, points: parseInt(points) } : emp)
        const sum = updatedEmp.reduce((lastPoints, emp) => emp.points + lastPoints, 0)

        if (sum > totalPoints) {
            return false;
        }

        setPointsLeft(totalPoints - sum);
        updateEmpPoints(updatedEmp);
        return true;
    }

    function updatePoints() {

        // const employeesPoints = {}
        const employeesPoints = employees.map(element => {
            return {
                name: element.name,
                points: element.points
            }
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
                {employees.map((emp) => <EmployeePoints onPointsChanged={handlePointsChange} key={emp.id} name={emp.name} points={emp.points}></EmployeePoints>)}
            </div>
            <Button onClick={updatePoints} style={{ width: 'fit-content', margin: '5px' }} variant="contained" color="primary">
                Update points
            </Button>
            <h1 className={classes.totalPoints}>Points left to split: {leftToSplit}/{totalPoints}</h1>
        </div>)
}

export default ManageEmployeePoints;