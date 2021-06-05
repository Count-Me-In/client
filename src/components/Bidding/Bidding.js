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
import { Button, Select } from 'antd';
import { SaveOutlined } from '@ant-design/icons';
import { TextField, IconButton, FormControl, InputLabel, Input, MenuItem, Checkbox, ListItemText } from '@material-ui/core';
import SaveIcon from '@material-ui/icons/Save';
import { ViewState } from '@devexpress/dx-react-scheduler';
import Axios from 'axios';
import { API_URL, TOKEN } from '../../Config/config';
const { Option } = Select;

const getNextSunday = () => {
    var d = new Date();
    const diff = d.getDay();
    const sunday = new Date(d.setDate(d.getDate() - diff + 7));
    sunday.setHours(9);
    sunday.setMinutes(0);
    return sunday;
}

function Bidding({ updatePercents }) {
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
    const [invites, setInvites] = useState([[], [], [], [], []])
    const [employees, setEmployees] = useState([]);
    const [originalBidsObj, setoriginalBidsObj] = useState([]);
    const [showAlert, setAlert] = useState(false);

    //triggered onpage load
    useEffect(() => {
        Promise.all([Axios.get(`${API_URL}/employees/all`), Axios.get(`${API_URL}/employees/bids_collection`)]).then(([employees, BidCollection]) => {
            console.log(BidCollection.data)
            console.log(employees.data);
            if (BidCollection.data.length === 5) {
                updateAppointments(BidCollection.data)
            }
            if (employees?.data?.length > 0) {
                setEmployees(employees?.data)
            }
        }).catch((err) => console.log(err))
    }, []);

    //update appointments on first upload and on every change
    const updateAppointments = (data) => {
        const newAppontments = appointments.map((appointment) => {
            appointment.percents = data[appointment.id - 1].percentage;
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

    const updateAppointmentsOnServer = () => {
        //first - update original bids object
        var new_origin = originalBidsObj
        console.log(new_origin);
        console.log(appointments);
        for (var i = 0; i < new_origin.length; i++) {
            new_origin[i]['percentage'] = appointments[new_origin[i]['day'] - 1]['percents'];
        }

        Axios.put(`${API_URL}/employees/updateBids`, new_origin, {})
        .then((response)=>{
            setoriginalBidsObj(new_origin);
        })
        .catch((err) => { console.log(err) })
    }

    const sendInvites = () => {
        // Axios.put(`${API_URL}/employees/invites`, {}, {
        //     params: {
        //         'invites': invites,
        //     }
        // }).catch((err) => { console.log(err) })
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

        const handleChangeMultiple = (selectedList) => {
            const newInvites = invites.map((item, index) => index === restProps.data.id ? selectedList : item)

            setInvites(newInvites);
        };

        return (
            <Appointments.AppointmentContent  {...restProps}>
                <div className={classes.container} data-testid="biddingSlots">
                    <div data-testid="biddingCalendar">
                        {startDate.getHours() + ':' + (startDate.getMinutes() < 10 ? '0' + startDate.getMinutes() : startDate.getMinutes())
                            + ' - ' + endDate.getHours() + ':' + (endDate.getMinutes() < 10 ? '0' + endDate.getMinutes() : endDate.getMinutes())}</div>
                    <Select data-testid="inviteFriend"
                        mode="multiple"
                        allowClear
                        showSearch
                        style={{ width: '100%' }}
                        placeholder="Invite a friend"
                        onChange={handleChangeMultiple}

                        filterOption={(input, option) => {
                            return option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                        }}
                    >
                        {employees.map((emp, i) => (
                            <Option key={i} value={emp._username}>{emp._name}</Option>
                        ))}
                    </Select>
                    <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center' }}>
                        <TextField data-testid="percentsSlots"
                            type="number"
                            size="small"
                            label="Percents"
                            className={classes.percent}
                            value={percents}
                            onChange={(ev) => {
                                setPercents(parseInt(ev.target.value))
                            }
                            } />
                    </div>
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
            <Button data-testid="saveBiddingBtn"
                type='primary'
                shape='round'
                size='large'
                style={{ position: 'fixed', bottom: '12vh', left: 'calc(100% - 200px)' }}
                icon={<SaveOutlined />}
                onClick={() => {
                    updateAppointmentsOnServer();
                    sendInvites(invites);
                }}>
                Save Biddings
            </Button>
        </div>
    )
}

export default Bidding;