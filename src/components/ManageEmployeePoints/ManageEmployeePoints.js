import React, { useState, useEffect } from 'react';
import classes from './ManageEmployeePoints.module.css'
import { Button, TextField } from '@material-ui/core';
import EmployeePoints from './EmployeePoints/EmployeePoints';
import Axios from 'axios';
import { API_URL } from '../../Config/config';
import { Alert, AlertTitle } from '@material-ui/lab';

function ManageEmployeePoints() {
    const [passedPointsLimit, setPassedPointsLimit] = useState(false);
    const [pointsUpdatedSuccessfuly, setPointsUpdatedSuccessfuly] = useState(false);
    const [totalPoints, setTotalPoints] = useState(0);
    const [leftToSplit, setPointsLeft] = useState(0);
    const [employees, updateEmpPoints] = useState([])

    useEffect(() => {
        Promise.all([Axios.get(`${API_URL}/managers/getTotalPoints`), Axios.get(`${API_URL}/managers/getEmployeesPoints`)])
            .then(([totalPointsData, epmPointsData]) => {
                setTotalPoints(totalPointsData.data);
                const result = epmPointsData.data.map(value => ({ name: value['_name'], username: value['_username'], points: value['_points'] }));
                const sum = result.reduce((lastPoints, emp) => emp.points + lastPoints, 0)
                updateEmpPoints(result)
                setPointsLeft(totalPointsData.data - sum)
            }).catch((err) => console.log(err))
    }, []);

    function handlePointsChange(empName, points) {
        const updatedEmp = employees.map((emp) => emp.username === empName ? { ...emp, points: parseInt(points) } : emp)
        const sum = updatedEmp.reduce((lastPoints, emp) => emp.points + lastPoints, 0)

        if (sum > totalPoints) {
            setPassedPointsLimit(true);
            setTimeout(() => {
                setPassedPointsLimit(false)
            }, 3000);
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

        Axios.post(`${API_URL}/managers/setEmployeePoints`, employeesPoints
        ).then(() => {
            setPointsUpdatedSuccessfuly(true);
            setTimeout(() => {
                setPointsUpdatedSuccessfuly(false)
            }, 3000);
        })
    }

    return (
        <div className={classes.container}>
            <h1 className={classes.header}><b>Manage Employees Points</b></h1>
            <div className={classes.empBox}>
                {employees.map((emp) => <EmployeePoints onPointsChanged={handlePointsChange} username={emp.username} name={emp.name} points={emp.points}></EmployeePoints>)}
            </div>
            <h1 className={classes.totalPoints}>Points left to split: {leftToSplit}/{totalPoints}</h1>
            <Button onClick={updatePoints} style={{ width: 'fit-content', margin: '5px' }} variant="contained" color="primary">
                Update points
            </Button>
            {pointsUpdatedSuccessfuly &&
                <Alert severity="success">Points updated successfuly</Alert>
            }
            {passedPointsLimit &&
                <Alert severity="error">
                        <AlertTitle>Error</AlertTitle>
                        You have reached your points limit!
                </Alert>           
            }
        </div>
    )
}

export default ManageEmployeePoints;