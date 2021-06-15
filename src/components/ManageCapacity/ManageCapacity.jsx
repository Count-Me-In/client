import React, { useContext, useEffect, useState } from 'react'
import { Button, Col, Form, InputNumber, Layout, Row, Table } from 'antd'
import { Typography } from 'antd';
import Axios from 'axios';
import { API_URL } from '../../Config/config';
import { Alert, AlertTitle } from '@material-ui/lab';
import classes from './ManageCapacity.module.css'

const { Title } = Typography;

const ManageCapacity = () => {
	const [form] = Form.useForm();
	const [successAlert, toggleSuccessAlert] = useState(false)
	const [errorAlert, toggleErrAlert] = useState(false)

	useEffect(() => {
		Axios.get(`${API_URL}/admin/getDays`)
			.then(({ data: days }) => {
				form.setFieldsValue({ capacity: days })
			})
			.catch((err) => console.error(err))
	}, [])

	const upadteCapacity = ({ capacity }) => {
		Axios.put(`${API_URL}/admin/editDays`, { days: capacity })
			.then(() => {
				toggleSuccessAlert(true);
				setTimeout(() => toggleSuccessAlert(false), 3000)
			})
			.catch((err) => {
				toggleErrAlert(true);
				setTimeout(() => toggleErrAlert(false), 3000)
				console.error(err)
			})
	}

	return (
		<>
			<Layout>
				<Layout.Content style={{ padding: '0 50px' }}>
					<Title style={{ marginTop: '10px' }} level={3}>Manage Capacity</Title>
					<Row align='middle' justify='center' style={{ width: '100%' }} >
						<Col span={4} style={{ textAlign: 'center', backgroundColor: '#fafafa', alignContent: 'center', padding: '20px', border: '1px solid #f0f0f0' }} >Sunday</Col>
						<Col span={4} style={{ textAlign: 'center', backgroundColor: '#fafafa', alignContent: 'center', padding: '20px', border: '1px solid #f0f0f0' }} >Monday</Col>
						<Col span={4} style={{ textAlign: 'center', backgroundColor: '#fafafa', alignContent: 'center', padding: '20px', border: '1px solid #f0f0f0' }} >Tuesday</Col>
						<Col span={4} style={{ textAlign: 'center', backgroundColor: '#fafafa', alignContent: 'center', padding: '20px', border: '1px solid #f0f0f0' }} >Wednesday</Col>
						<Col span={4} style={{ textAlign: 'center', backgroundColor: '#fafafa', alignContent: 'center', padding: '20px', border: '1px solid #f0f0f0' }} >Thursday</Col>
					</Row>
					<Form form={form} onFinish={upadteCapacity} >
						<Row align='middle' justify='center' style={{ width: '100%' }} >
							{[0, 0, 0, 0, 0].map((dayCapacity, index) => <Col span={4}>
								<Form.Item name={['capacity', index]} >
									<InputNumber style={{ width: '100%' }} min={0} />
								</Form.Item>
							</Col>)}
						</Row>
						<Row justify='center'>
							<Form.Item>
								<Button type='primary' htmlType='submit'>Save</Button>
							</Form.Item>
						</Row>
					</Form>
				</Layout.Content>
				{successAlert &&
					<div className={classes.alert}>
						<Alert className={classes.innerMessage} severity="success">
							<AlertTitle>Capacity were saved successfully</AlertTitle>
						</Alert>
					</div>
				}
					{errorAlert &&
					<div className={classes.alert}>
						<Alert className={classes.innerMessage} severity="error">
							<AlertTitle>Error saving capacity</AlertTitle>
						</Alert>
					</div>
				}
			</Layout>
		</>
	)
}

export default ManageCapacity