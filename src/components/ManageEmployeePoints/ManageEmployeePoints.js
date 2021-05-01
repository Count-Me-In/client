import React, { useState, useEffect} from 'react';
import classes from './ManageEmployeePoints.module.css'
import { TextField} from '@material-ui/core';
import EmployeePoints from './EmployeePoints/EmployeePoints';
import Axios from 'axios';
import { API_URL, TOKEN } from '../../Config/config';

function ManageEmployeePoints() {
    const [totalPoints, setTotalPoints] = useState(0);
    const [employees, updateEmpPoints] = useState([])

    useEffect(() => {
        Axios.get(`${API_URL}/managers/getEmployeesPoints`, {headers: {
            'Authorization': `Bearer ${TOKEN()}`,
          }}).then(({data}) => {
                var id = 1;
                var result = Array()
                var sum = 0
                for (const [key, value] of Object.entries(data)) {
                    result.push({id: id, name: key, points: value})
                    id++
                    sum += value
                }  
                updateEmpPoints(result)
                setTotalPoints(sum)
        }).catch((err)=> console.log(err))
    }, []);



    function handlePointsChange(empName, points) {
        const updatedEmp = employees.map((emp) => emp.name === empName ? {...emp, points:points} : emp)
        const sum = updatedEmp.reduce((lastPoints, emp) => +emp.points + +lastPoints, 0)
        
        if (sum > totalPoints){
            return false;
        }

        console.log(typeof(points))

        Axios.post(`${API_URL}/managers/setEmployeePoints`, { //TODO: not working. check why request failed with code 401
            headers: {
                'Authorization': `Bearer ${TOKEN()}`,
            },
            params: {
                'employeename': empName, 
                'points': points,
            }
        })
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