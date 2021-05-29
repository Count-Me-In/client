import React, { useState, useEffect } from 'react';
import classes from './HomePage.module.css';
import Paper from '@material-ui/core/Paper';
import TextField from '@material-ui/core/TextField';
import { ViewState, EditingState, IntegratedEditing } from '@devexpress/dx-react-scheduler';
import {
    Scheduler,
    MonthView,
    Appointments,
    AppointmentTooltip,
    Toolbar,
    DateNavigator,
    TodayButton,
    Resources,
} from '@devexpress/dx-react-scheduler-material-ui';
import { teal, grey } from '@material-ui/core/colors';
import { Button } from '@material-ui/core';
import { Autocomplete } from '@material-ui/lab';
import Axios from 'axios';
import { API_URL, TOKEN } from '../../Config/config';



const allocations = [
    { text: 'We will see you at the office!', id: 1, color: teal },
    { text: 'Maybe next time', id: 0, color: grey },
];

function HomePage() {
    const [currentDate, setDate] = useState(Date.now);
    const [userScheduler, setUserScheduler] = useState([]);
    const [scheduler, setScheduler] = useState([]);
    const [employees, setEmployees] = useState([]);
    const [chosenEmployeeSched, setChosenEmployeeSched] = useState([]);//chosen employee to view

    const resources = [{
        fieldName: 'isIn',
        title: 'כניסה לשיעור',
        instances: allocations,
    }]


    const datesToScheduler = (dateLst) => {
        var sched = Array()
        for (var i = 0; i < dateLst.length; i++) {
            let startDate = (dateLst[i] || '').split(':')
            startDate[1] = "15"
            sched.push({ startDate: dateLst[i], endDate: startDate.join(':'), isIn: 1 })
        }
        console.log(sched)
        return sched
    }


    //triggered on page upload
    useEffect(() => {
        Axios.get(`${API_URL}/employees/getEmployeeAssigning`).then(({ data }) => {
            var app = datesToScheduler(data._assignedDays)
            setUserScheduler(app)
            setScheduler(app)
        }).catch((err) => console.log(err))

        if (localStorage.getItem('isManager')) {
            Axios.get(`${API_URL}/managers/getEmployees`).then(({ data }) => {
                setEmployees(data)
            }).catch((err) => console.log(err))
        }
    }, []);

    const getEmployeeScheduler = (employeeName) => {
        Axios.get(`${API_URL}/managers/getEmployeeAssigning`, {
            params: {
                'employeename': employeeName
            }
        }).then(({ data }) => {
            var dts = datesToScheduler(data._assignedDays)
            setScheduler(dts)
        }).catch((err) => {
            console.log(err)
            setScheduler([])
        })
    }

    const Appointment = ({ children }) => {
        return <div dir={'rtl'}>
            {children}
        </div>

    }
    const TimeTableCell = ({ onDoubleClick, ...restProps }) => {
        return <MonthView.TimeTable onDoubleClick={undefined} {...restProps} />;
    };



    return (
        <div>
            {localStorage.getItem('isManager') &&
                <div className={classes.customActions}>
                    <Button onClick={() => setScheduler(userScheduler)}>My Schedule</Button>
                    <Autocomplete
                        id="employees"
                        size='small'
                        options={employees}
                        getOptionLabel={(option) => option}
                        style={{ width: 300 }}
                        renderInput={(params) => <TextField {...params} label="Emplyee name" variant="outlined" />}
                        onChange={(event, value) => {
                            if (value) {
                                getEmployeeScheduler(value)
                                console.log(scheduler)
                                //setScheduler(employeesSechudel.filter(emp => emp.name === value)[0].schedule)
                            }
                        }}
                    />
                </div>
            }

            <Paper dir={'ltr'}>
                <Scheduler
                    data={scheduler}
                // height={650}
                >
                    <ViewState
                        currentDate={currentDate}
                        onCurrentDateChange={(date) => setDate(date)}

                    />
                    <MonthView
                        onDoubleClick={undefined}

                    />
                    <Toolbar />

                    <DateNavigator />
                    <TodayButton />
                    <Appointments dir={'rtl'} />
                    <Resources
                        data={resources}
                    />
                    <AppointmentTooltip
                        showCloseButton
                    />
                </Scheduler>
            </Paper>
        </div>
    )
}

export default HomePage;

