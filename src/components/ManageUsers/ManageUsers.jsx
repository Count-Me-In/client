import React, { useContext, useEffect, useState } from 'react'
import { Layout } from 'antd'
import { Typography } from 'antd';
import EditableTable, { EditableContext } from './EditableTable/EditableTable';
import { columns } from './ManageUsersOptions'
import Axios from 'axios';
import { API_URL } from '../../Config/config';

const { Title } = Typography;

const ManageUsers = () => {
	const [dataSource, setDataSource] = useState([])
	const [count, setCount] = useState(0)

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
			// TODO delete on server
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

	const handleSave = async (row) => {
		try {
			const newData = [...dataSource];
			const index = newData.findIndex((item) => row.key === item.key);
			const item = newData[index];
			newData.splice(index, 1, { ...item, ...row });
			setDataSource(newData);
		} catch (errInfo) {
			console.error('Save failed:', errInfo);
		}
	}

	return (
		<>
			<Layout>
				<Layout.Content style={{ padding: '0 50px' }}>
					<Title style={{ marginTop: '10px' }} level={3}>Manage Users</Title>
					{dataSource.length > 0 && <EditableTable data={dataSource} onEdit={handleEdit} onSave={handleSave} onDelete={handleDelete} onAdd={handleAdd} columns={columns(handleDelete, handleSave, managerOptions)} />}
				</Layout.Content>
			</Layout>
		</>
	)
}

export default ManageUsers