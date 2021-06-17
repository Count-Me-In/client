import React, { useContext, useEffect, useState } from 'react'
import { Layout } from 'antd'
import { Typography } from 'antd';
import EditableTable, { EditableContext } from './EditableTable/EditableTable';
import { columns } from './ManageUsersOptions'
import Axios from 'axios';
import { API_URL } from '../../Config/config';
import { Alert, AlertTitle } from '@material-ui/lab';
import classes from './ManageUsers.module.css'

const { Title } = Typography;

const ManageUsers = () => {
	const [dataSource, setDataSource] = useState([])
	const [count, setCount] = useState(0)
	const [successAlert, toggleSuccessAlert] = useState(false)
	const [errorAlert, toggleErrAlert] = useState(false)
	const [managerOptions, setManagerOptions] = useState([])
	const form = useContext(EditableContext);

	useEffect(() => {
		Axios.get(`${API_URL}/admin/getEmployees`)
			.then(({ data: employees }) => {
				setDataSource(employees.map((emp, i) => (
					{
						key: i,
						username: emp.username,
						name: emp.name,
						manager: emp.manager
					}
				)))
				setCount(employees.length);
			})
			.catch((err) => console.error(err))

		Axios.get(`${API_URL}/employees/all`)
			.then(({ data: employees }) => {
				setManagerOptions(employees.map((emp, i) => (
					{
						value: emp.username,
						label: emp.name
					}
				)))
			})
			.catch((err) => console.error(err))
	}, [])

	const handleDelete = (key) => {
		const rowToDelete = dataSource.find((item) => item.key == key);
		if (!rowToDelete.isNew) {
			Axios.delete(`${API_URL}/admin/deleteEmployee`, {}, {
				params: {
					username: rowToDelete.username
				}
			})
		}

		const newData = [...dataSource];
		setDataSource(newData.filter((item) => item.key != key))
	}

	const handleEdit = (row) => {
		const newData = [...dataSource];
		const index = newData.findIndex((item) => row.key == item.key);
		if (index < 0) {
			newData.push(row)
		} else {
			const item = newData[index];
			newData.splice(index, 1, { ...item, ...row });
		}

		if (!row.isNew) {
			Axios.put(`${API_URL}/admin/updateManager`, {}, {
				params: {
					employee_username: row.username,
					manager_username: row.manager
				}})
		}

		setDataSource(newData);
	}

	const handleAdd = () => {
		const newData = {
			key: count,
			name: ``,
			username: '',
			manager: '',
			password: ``,
			isNew: true
		};

		setDataSource([...dataSource, newData])
		setCount(count + 1)
	}

	const handleSave = async (values) => {
		Axios.post(`${API_URL}/admin/addEmployee`, {
			"name": values.name,
			"username": values.username,
			"password": values.password,
			"manager": values.manager
		})
			.then(() => {
				const newData = [...dataSource];
				const index = newData.findIndex((item) => values.key === item.key);
				const item = newData[index];
				newData.splice(index, 1, { ...item, ...values });
				setDataSource(newData);
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
					<Title style={{ marginTop: '10px' }} level={3}>Manage Users</Title>
					{dataSource.length > 0 && <EditableTable data={dataSource} onEdit={handleEdit} onSave={handleSave} onDelete={handleDelete} onAdd={handleAdd} columns={columns(handleDelete, handleSave, managerOptions)} />}
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

export default ManageUsers