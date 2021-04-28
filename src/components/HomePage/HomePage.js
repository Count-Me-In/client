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


const schedulerData = [
    { startDate: '2021-04-25T09:00', endDate: '2021-04-25T09:15', isIn: 0 },
    { startDate: '2021-04-26T09:45', endDate: '2021-04-26T09:45', isIn: 1 },
    { startDate: '2021-04-27T09:45', endDate: '2021-04-27T09:45', isIn: 1 },
    { startDate: '2021-04-28T09:45', endDate: '2021-04-28T09:45', isIn: 1 },
    { startDate: '2021-04-29T09:45', endDate: '2021-04-29T09:45', isIn: 0 },
    { startDate: '2021-04-30T09:45', endDate: '2021-04-30T09:45', isIn: 0 },
    { startDate: '2021-05-01T09:45', endDate: '2021-05-01T09:45', isIn: 1 },
];

const employeesSechudel = [
    {
        name: "Shenhav",
        schedule: [{ startDate: '2020-12-24T09:45', endDate: '2020-12-24T10:45', isIn: 0 },
        { startDate: '2020-12-25T09:45', endDate: '2020-12-25T10:45', isIn: 1 }]
    },
    {
        name: "Noy",
        schedule: [{ startDate: '2020-12-26T09:45', endDate: '2020-12-26T10:45', isIn: 0 },
        { startDate: '2020-12-25T09:45', endDate: '2020-12-25T10:45', isIn: 1 }]
    },
    {
        name: "Nufar",
        schedule: [{ startDate: '2020-12-30T09:45', endDate: '2020-12-30T10:45', isIn: 0 },
        { startDate: '2020-12-27T09:45', endDate: '2020-12-27T10:45', isIn: 1 }]
    },
    {
        name: "Shauli",
        schedule: [{ startDate: '2020-12-24T11:45', endDate: '2020-12-24T14:30', isIn: 0 },
        { startDate: '2020-12-25T10:15', endDate: '2020-12-25T11:45', isIn: 1 },
        { startDate: '2020-12-27T09:45', endDate: '2020-12-27T10:45', isIn: 1 }]
    }
]


const allocations = [
    { text: 'We will see you at the office!', id: 1, color: teal },
    { text: 'Maybe next time', id: 0, color: grey },
];

function HomePage({ loggedUser }) {
    const [currentDate, setDate] = useState(Date.now);
    const [appointments, setAppointments] = useState([]);
    const resources = [{
        fieldName: 'isIn',
        title: 'כניסה לשיעור',
        instances: allocations,
    }]


    const datesToAppointments = (dateLst) => {
        var appLst = Array()
        for(var i = 0; i < dateLst.length; i++){
            let startDate = (dateLst[i] || '').split(':')
            startDate[1] = "15"
            appLst.push({startDate: dateLst[i], endDate: startDate.join(':'), isIn: 1})
        }
        console.log(appLst)
        return appLst
    }


    //triggered on page upload
    useEffect(() => {
        Axios.get(`${API_URL}/employees/getEmployeeAssigning`, {headers: {
            'Authorization': `Bearer ${TOKEN()}`,
        }}).then(({data}) => {
            var app = datesToAppointments(data._assignedDays)
            setAppointments(app)
        }).catch((err)=> console.log(err))
    }, []);


    const Appointment = ({ children }) => {
        return <div dir={'rtl'}>
            {children}
        </div>

    }
    const TimeTableCell = ({ onDoubleClick, ...restProps }) => {
        return <MonthView.TimeTable onDoubleClick={undefined} {...restProps} />;
    };

    const employees = ["Shenhav", "Noy", "Nufar", "Shauli"];
    const [employeeID, setEmployeeID] = useState('');

    return (
        <div>
            {loggedUser.isManager &&
                <div className={classes.customActions}>
                    <Button onClick={()=> setAppointments(schedulerData)}>My Schedule</Button>
                    <Autocomplete
                        id="employees"
                        size='small'
                        options={employees}
                        getOptionLabel={(option) => option}
                        style={{ width: 300 }}
                        renderInput={(params) => <TextField {...params} label="Emplyee name" variant="outlined" />}
                        onChange={(event, value) => {
                            if (value) {
                                setAppointments(employeesSechudel.filter(emp => emp.name === value)[0].schedule)
                            }
                        }}
                    />
                </div>
            }

            <Paper dir={'ltr'}>
                <Scheduler
                    data={appointments}
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

