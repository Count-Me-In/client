import React from 'react';
import { DeleteFilled, SaveFilled } from "@ant-design/icons";
import { Button, Form, Input, Popconfirm, Select, Tooltip } from "antd";


export const columns = (handleDelete, handleSave, managerOptions) => [
	{
		key: 'name',
		title: 'Name',
		dataIndex: 'name',
		editComponent: (props) => <Input {...props} />
	},
	{
		key: 'usermame',
		title: 'Username',
		dataIndex: 'username',
		editComponent: (props) => <Input {...props} />

	},
	{
		key: 'manager',
		title: 'Manager',
		dataIndex: 'manager',
		editComponent: (props) => <Select options={managerOptions} {...props} />

	},
	{
		key: 'password',
		title: 'Password',
		dataIndex: 'password',
		editComponent: (props) => <Input.Password {...props} />,
		render: () => <Input.Password style={{ cursor: 'default' }} disabled defaultValue='password' visibilityToggle={false} bordered={false} />
	},
	{
		title: 'Operations',
		dataIndex: 'operations',
		render: (_, record) =>
			<>
				<Popconfirm title="Sure to delete?" onConfirm={() => handleDelete(record.key)}>
					<Tooltip title="delete">
						<Button icon={<DeleteFilled />} />
					</Tooltip>
				</Popconfirm>
				{ record.isNew ? <Tooltip title="save">
					<Form.Item>
						<Button htmlType='submit' icon={<SaveFilled />}
						// onClick={() => handleSave(record.key)} 
						/>
					</Form.Item>
				</Tooltip> : null}
			</>,
	},
]