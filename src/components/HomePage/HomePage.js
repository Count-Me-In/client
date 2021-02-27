import React, { useState } from 'react';
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

const schedulerData = [
    { startDate: '2020-12-24T09:45', endDate: '2020-12-24T10:45', isIn: 0 },
    { startDate: '2020-12-25T09:45', endDate: '2020-12-25T10:45', isIn: 1 },
    { startDate: '2021-01-01T09:45', endDate: '2021-01-01T10:45', isIn: 1 },
    { startDate: '2020-12-01T09:45', endDate: '2020-12-01T10:45', isIn: 1 },
    { startDate: '2020-12-03T09:45', endDate: '2020-12-03T10:45', isIn: 0 },
    { startDate: '2020-12-16T09:45', endDate: '2020-12-16T10:45', isIn: 0 },
    { startDate: '2020-12-07T09:45', endDate: '2020-12-07T10:45', isIn: 1 },
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
    const [appointments, setData] = useState(schedulerData);
    const resources = [{
        fieldName: 'isIn',
        title: 'כניסה לשיעור',
        instances: allocations,
    }]

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
                    <Button onClick={()=> setData(schedulerData)}>My Schedule</Button>
                    <Autocomplete
                        id="employees"
                        size='small'
                        options={employees}
                        getOptionLabel={(option) => option}
                        style={{ width: 300 }}
                        renderInput={(params) => <TextField {...params} label="Emplyee name" variant="outlined" />}
                        onChange={(event, value) => {
                            if (value) {
                                setData(employeesSechudel.filter(emp => emp.name === value)[0].schedule)
                            }
                        }}
                    />
                </div>
            }

            <Paper dir={'ltr'}>
                <Scheduler
                    data={appointments}
                    height={650}
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

