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
import { Button, Form, Input, InputNumber, Select } from 'antd';
import { SaveOutlined } from '@ant-design/icons';
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
    const [form] = Form.useForm();

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
    const [employees, setEmployees] = useState([]);
    const [originalBidsObj, setoriginalBidsObj] = useState([]);
    const [showAlert, setAlert] = useState(false);

    //triggered onpage load
    useEffect(() => {
        Axios.get(`${API_URL}/employees/all`).then(({ data: employees }) => {

            if (employees?.length > 0) {
                setEmployees(employees)
            }
        }).catch((err) => console.log(err))

        Axios.get(`${API_URL}/employees/bids_collection`).then(({ data: BidCollection }) => {
            if (BidCollection.length === 5) {
                updateAppointments(BidCollection)
            }
        }).catch((err) => console.log(err))
    }, []);

    //update appointments on first upload and on every change
    const updateAppointments = (data) => {
        const newAppointments = appointments.map((appointment) => {
            appointment.percents = data[appointment.id - 1].percentage;
            return appointment;
        })
        setAppointments(newAppointments)
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
            .then((response) => {
                setoriginalBidsObj(new_origin);
            })
            .catch((err) => { console.log(err) })
    }

    const sendInvites = (invites) => {
        console.log(invites)
        Axios.post(`${API_URL}/employees/invites`, invites, {}).then((response)=>{
            setInvites(invites);
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

        const handlePercentsChange = (value) => {
            let sum = 0
            const newAppointments = appointments.map((item) => {
                if (restProps.data.id === item.id) {
                    sum += value;
                    return {
                        ...item,
                        percents: value
                    }
                }

                sum += item.percents;

                return item
            })

            if (sum <= 100) {
                setPercents(parseInt(value))
                setAppointments(newAppointments)
            } else {
                setAlert(true)
                setTimeout(() => {
                    setAlert(false)
                }, 3000)
            }
        }

        return (
            <Appointments.AppointmentContent  {...restProps}>
                <div className={classes.container} data-testid="biddingSlots">
                    <div data-testid="biddingCalendar">
                        {startDate.getHours() + ':' + (startDate.getMinutes() < 10 ? '0' + startDate.getMinutes() : startDate.getMinutes())
                            + ' - ' + endDate.getHours() + ':' + (endDate.getMinutes() < 10 ? '0' + endDate.getMinutes() : endDate.getMinutes())}</div>
                    <Form.Item name={['invites', restProps.data.id - 1]}>
                        <Select
                            data-testid="inviteFriend"
                            mode="multiple"
                            allowClear
                            showSearch
                            style={{ width: '100%' }}
                            placeholder="Invite a friend"


                            filterOption={(input, option) => {
                                return option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                            }}
                        >
                            {employees.map((emp, i) => (
                                <Option key={i} value={emp.username}>{emp.name}</Option>
                            ))}
                        </Select>
                    </Form.Item>
                    <Form.Item label='Percents' name={['bids', restProps.data.id]} style={{ display: 'flex', flexDirection: 'row', alignItems: 'center' }}>
                        <InputNumber
                            data-testid="percentsSlots"
                            // className={classes.percent}
                            defaultValue={percents}
                            onChange={handlePercentsChange} />
                    </Form.Item>
                </div>
            </Appointments.AppointmentContent >
        );
    };

    return (
        <div >
            <Form
                form={form}
                onFinish={({ invites }) => {
                    updateAppointmentsOnServer();
                    sendInvites(invites);
                }}
            >
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
                <Button
                    data-testid="saveBiddingBtn"
                    type='primary'
                    shape='round'
                    size='large'
                    htmlType='submit'
                    style={{ position: 'fixed', bottom: '12vh', left: 'calc(100% - 200px)' }}
                    icon={<SaveOutlined />}
                >
                    Save Biddings
                </Button>
            </Form>
        </div>
    )
}

export default Bidding;