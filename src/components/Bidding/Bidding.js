import React, { useState, useEffect } from 'react';
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
import Axios from 'axios';
import { API_URL, TOKEN } from '../../Config/config';

function Bidding({ updatePercents }) {

    //triggered onpage load
    useEffect(() => {
        Axios.get(`${API_URL}/employees/bids_collection`).then(({ data }) => {
            console.log(data)
            if (data.length === 5) {
                updateAppointments(data)
            }
        }).catch((err) => console.log(err))
    }, []);


    const getNextSunday = () => {
        var d = new Date();
        const diff = d.getDay();
        const sunday = new Date(d.setDate(d.getDate() - diff + 7));
        sunday.setHours(9);
        sunday.setMinutes(0);
        return sunday;
    }

    let sunday = getNextSunday();
    const tempDate = new Date(sunday);
    let monday = new Date(tempDate.setDate(tempDate.getDate() + 1));
    let tuesday = new Date(tempDate.setDate(tempDate.getDate() + 1))
    let wednesday = new Date(tempDate.setDate(tempDate.getDate() + 1))
    let thursday = new Date(tempDate.setDate(tempDate.getDate() + 1))

    //initialize appointments
    const getEndDate = (date) => {
        const endDate = new Date(date)
        endDate.setHours(18)
        return endDate;
    }

    const schedulerData = [
        { id: 1, startDate: sunday.toISOString(), endDate: getEndDate(sunday).toISOString(), percents: 0 },
        { id: 2, startDate: monday.toISOString(), endDate: getEndDate(monday).toISOString(), percents: 0 },
        { id: 3, startDate: tuesday.toISOString(), endDate: getEndDate(tuesday).toISOString(), percents: 0 },
        { id: 4, startDate: wednesday.toISOString(), endDate: getEndDate(wednesday).toISOString(), percents: 0 },
        { id: 5, startDate: thursday.toISOString(), endDate: getEndDate(thursday).toISOString(), percents: 0 },
    ]

    const [appointments, setAppointments] = useState(schedulerData);
    const [originalBidsObj, setoriginalBidsObj] = useState([]);
    const [showAlert, setAlert] = useState(false);

    //update appointments on first upload and on every change
    const updateAppointments = (data) => {
        const newAppontments = appointments.map((appointment) => {
            appointment.percents = data[appointment.id - 1]._percentage;
            return appointment;
        })
        setAppointments(newAppontments)
        setoriginalBidsObj(data)

        let sum = 0;//TODO: need this?
        appointments.forEach((appointment) => {
            sum += appointment.percents;
        })
        updatePercents(sum)
    }






    const updateAppointmentsOnServer = (newAppointments) => {

        //first - update original bids object
        var new_origin = originalBidsObj
        for (var i = 0; i < newAppointments.length; i++) {
            new_origin[i]['_percentage'] = newAppointments[i]['percents']
        }
        setoriginalBidsObj(new_origin)
        console.log(originalBidsObj)
        Axios.put(`${API_URL}/employees/updateBids`, {}, {
            params: {
                'bids': originalBidsObj,
            }
        }).catch((err) => { console.log(err) })
    }

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
                            if (appointment.id !== restProps.data.id)
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
                            updateAppointmentsOnServer(data) //TODO: CHECK THIS
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
                // height={650}
                >
                    <ViewState
                        defaultCurrentDate={sunday}
                    />
                    <WeekView
                        startDayHour={8}
                        endDayHour={19}

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