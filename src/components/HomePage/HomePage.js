import React, { useState, useEffect } from 'react';
import classes from './HomePage.module.css';
import Paper from '@material-ui/core/Paper';
import TextField from '@material-ui/core/TextField';
import { ViewState } from '@devexpress/dx-react-scheduler';
import { Scheduler, MonthView, Appointments, AppointmentTooltip, Toolbar, DateNavigator, TodayButton, Resources } from '@devexpress/dx-react-scheduler-material-ui';
import { teal, grey } from '@material-ui/core/colors';
import { Button } from '@material-ui/core';
import { Autocomplete } from '@material-ui/lab';
import Axios from 'axios';
import { API_URL } from '../../Config/config';

const allocations = [
    { text: 'We will see you at the office!', id: 1, color: teal },
    { text: 'Maybe next time', id: 0, color: grey },
];

function HomePage({isManager, setIsManager}) {
    const [currentDate, setDate] = useState(Date.now);
    const [userScheduler, setUserScheduler] = useState([]);
    const [scheduler, setScheduler] = useState([]);
    const [employees, setEmployees] = useState([]);

    const resources = [{
        fieldName: 'isIn',
        title: 'כניסה לשיעור',
        instances: allocations,
    }]

    const datesToScheduler = (dateLst) => {
        return dateLst.map(dt => ({
            startDate: (new Date(dt * 1000)).toISOString(),
            endDate: (new Date((dt + 86400) * 1000)).toISOString(),
            title: 'Day In The Office'
        }));
    }

    const showEmployeeSched = () => {
        Axios.get(`${API_URL}/employees/getEmployeeAssigning`).then(({ data }) => {
            var app = datesToScheduler(data.assignedDays)
            console.log(app);
            setUserScheduler(app)
            setScheduler(app)
        }).catch((err) => console.log(err))
    }

    //triggered on page upload
    useEffect(() => {
        showEmployeeSched();

        Axios.get(`${API_URL}/managers/getEmployees`).then(({ data }) => {
            setEmployees(data);
            setIsManager(data.length > 0);
        }).catch((err) => console.log(err))
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
        <div className={classes.container}>
            {isManager &&
                <div className={classes.customActions}>
                    <Button onClick={() => setScheduler(userScheduler)}>My Schedule</Button>
                    <Autocomplete
                        id="employees"
                        size='small'
                        options={employees}
                        getOptionLabel={(option) => option.name}
                        style={{ width: 300 }}
                        renderInput={(params) => <TextField {...params} label="Emplyee name" variant="outlined" />}
                        onChange={(event, value) => {
                            if (value) {
                                getEmployeeScheduler(value.username)
                            }
                            else {
                                showEmployeeSched();
                            }
                        }}
                    />
                </div>
            }

            <Paper dir={'ltr'}>
                <Scheduler data-testid="arrivalScheduleCalander" data={scheduler}>
                    <ViewState currentDate={currentDate} onCurrentDateChange={(date) => setDate(date)} />
                    <MonthView onDoubleClick={undefined} />
                    <Toolbar />
                    <DateNavigator />
                    <TodayButton />
                    <Appointments dir={'rtl'} />
                    <Resources data={resources} />
                    <AppointmentTooltip showCloseButton />
                </Scheduler>
            </Paper>
        </div>
    )
}

export default HomePage;

