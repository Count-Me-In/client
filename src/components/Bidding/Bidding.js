import React, { useState } from 'react';
import classes from './Bidding.module.css';
import Paper from '@material-ui/core/Paper';
import { Alert, AlertTitle } from '@material-ui/lab';
import {
    Scheduler,
    WeekView,
    Appointments,
    Toolbar,
} from '@devexpress/dx-react-scheduler-material-ui';
import { TextField, IconButton } from '@material-ui/core';
import SaveIcon from '@material-ui/icons/Save';
import { ViewState } from '@devexpress/dx-react-scheduler';

function Bidding({ updatePercents }) {

    const getNextSunday = () => {
        var d = new Date();
        const diff = d.getDay();
        return new Date(d.setDate(d.getDate() - diff + 7));
    }

    let sunday = getNextSunday();
    const tempDate = new Date(sunday);
    let monday = new Date(tempDate.setDate(tempDate.getDate() + 1));
    let tuesday = new Date(tempDate.setDate(tempDate.getDate() + 1))
    let wednesday = new Date(tempDate.setDate(tempDate.getDate() + 1))
    let thursday = new Date(tempDate.setDate(tempDate.getDate() + 1))

    const schedulerData = [
        { id: 1, startDate: sunday, endDate: sunday, percents: 30 },
        { id: 2, startDate: monday, endDate: monday, percents: 40 },
        { id: 3, startDate: tuesday, endDate: tuesday, percents: 20 },
        { id: 4, startDate: wednesday, endDate: wednesday, percents: 5 },
        { id: 5, startDate: thursday, endDate: thursday, percents: 5 },
    ];

    const [appointments, setAppointments] = useState(schedulerData);
    const [showAlert, setAlert] = useState(false);

    const totalPercents = appointments.reduce((total, { percents }) => total + parseInt(percents), 0)
    updatePercents(totalPercents)

    const TimeTableCell = ({ onDoubleClick, ...restProps }) => {
        return <WeekView.TimeTableCell onDoubleClick={undefined} {...restProps} />;
    };

    const BiddingSlot = ({ style, ...restProps }) => {
        const startDate = new Date(restProps.data.startDate)
        const endDate = new Date(restProps.data.endDate)
        const [percents, setPercents] = useState(restProps.data.percents);

        return (
            <Appointments.AppointmentContent dir={'rtl'} {...restProps}>
                <div className={restProps.container}>
                    <div>
                        <strong>{restProps.data.title}</strong>
                    </div>
                    <div>
                        {startDate.getHours() + ':' + (startDate.getMinutes() < 10 ? '0' + startDate.getMinutes() : startDate.getMinutes())
                            + ' - ' + endDate.getHours() + ':' + (endDate.getMinutes() < 10 ? '0' + endDate.getMinutes() : endDate.getMinutes())}</div>
                    <TextField
                        type="number"
                        size="small"
                        className={classes.percent}
                        value={percents}
                        onChange={(ev) => {
                            setPercents(parseInt(ev.target.value))
                        }
                        } />
                    <IconButton onClick={() => {
                        let sum = 0;
                        appointments.forEach((appointment) => {
                            if (appointment.id != restProps.data.id)
                                sum += appointment.percents;
                            else
                                sum += percents;
                        })
                        if (sum > 100) {
                            setAlert(true)
                            setTimeout(() => {
                                setAlert(false)
                            }, 3000);
                        } else {
                            const data = appointments.map((appointment) => {
                                if (appointment.id === restProps.data.id)
                                    appointment.percents = percents;
                                return appointment;
                            })
                            setAppointments(data);
                            updatePercents(sum)
                        }
                    }}
                        aria-label="save" className={classes.margin} size="small">
                        <SaveIcon fontSize="inherit" />
                    </IconButton>
                </div>
            </Appointments.AppointmentContent >
        );
    };

    return (
        <div >
            <Paper dir={'ltr'}>
                {showAlert &&
                    <div className={classes.alert}>
                        <Alert className={classes.innerMessage} severity="warning">
                            <AlertTitle>Notice</AlertTitle>
                    You must fill 100%
                </Alert>
                    </div>
                }
                <Scheduler
                    data={appointments}
                    height={650}
                >
                    <ViewState
                        defaultCurrentDate={sunday}
                    />
                    <WeekView
                        startDayHour={9}
                        endDayHour={21}

                        excludedDays={[7, 6]}
                        timeTableCellComponent={TimeTableCell}
                        cellDuration={60}
                    />

                    <Appointments
                        appointmentContentComponent={BiddingSlot}
                    />
                </Scheduler>
            </Paper>
        </div>
    )
}

export default Bidding;