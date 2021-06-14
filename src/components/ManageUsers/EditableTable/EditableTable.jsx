import React, { useContext, useState, useEffect, useRef } from 'react';
import ReactDOM from 'react-dom';
import 'antd/dist/antd.css';
import './EditableTable.css'
import { Table, Popconfirm, Button, Form, Tooltip } from 'antd';
import { DeleteFilled, SaveFilled } from '@ant-design/icons';
export const EditableContext = React.createContext(null);

const EditableRow = ({ index, onSave, ...props }) => {
	const [form] = Form.useForm();
	return (
		<Form onFinish={onSave}
			form={form} component={false}>
			<EditableContext.Provider value={form}>
				<tr {...props} />
			</EditableContext.Provider>
		</Form>
	);
};

const EditableCell = ({
	title,
	editable,
	children,
	dataIndex,
	record,
	handleSave,
	onDelete,
	EditComponent,
	...restProps
}) => {
	const [editing, setEditing] = useState(false);
	const inputRef = useRef(null);
	const form = useContext(EditableContext);
	useEffect(() => {
		form.setFieldsValue({
			[dataIndex]: record[dataIndex],
		});
		// 	if (editing) {
		// 		inputRef.current.focus();
		// 	}
	}, []);

	const toggleEdit = () => {
		setEditing(!editing);
		// 	form.setFieldsValue({
		// 		[dataIndex]: record[dataIndex],
		// 	});
	};

	const save = async () => {
		try {
			const values = form.getFieldsValue(true);

			// const values = await form.validateFields();
			// toggleEdit();
			handleSave({ ...record, ...values });
			console.log({ ...record, ...values });
		} catch (errInfo) {
			console.log('Save failed:', errInfo);
		}
	};

	let childNode = children;

	if (editable) {
		childNode = dataIndex !== 'operations' ? (
			<Form.Item
				style={{
					margin: 0,
				}}
				name={dataIndex}
				rules={[
					{
						required: true,
						message: `${title} is required.`,
					},
				]}
			>
				<EditComponent ref={inputRef} onPressEnter={save} onBlur={save} />
			</Form.Item>
		) : (
			<>
				<Popconfirm title="Sure to delete?" onConfirm={() => onDelete(record.key)}>
					<Tooltip title="delete">
						<Button icon={<DeleteFilled />} />
					</Tooltip>
				</Popconfirm>
				<Tooltip title="save">
					<Button onClick={() => {
						form.submit()
						// form.setFieldsValue({ key: record.key })
						// setTimeout(form.submit, 0)
					}} icon={<SaveFilled />} />
				</Tooltip>
			</>

		);
	}

	return <td {...restProps}>{childNode}</td>;
};

const EditableTable = ({ onAdd, onEdit, onSave, onDelete, columns, data }) => {
	const components = {
		body: {
			row: EditableRow,
			cell: EditableCell,
		},
	};

	const mappedColumns = columns.map((col) => {
		return {
			...col,
			onCell: (record) => ({
				record,
				editable: record.isNew,
				dataIndex: col.dataIndex,
				title: col.title,
				handleSave: onEdit,
				onDelete: onDelete,
				EditComponent: col.editComponent
			}),
		};
	});

	return (
		<div>
			<Button
				onClick={onAdd}
				type="primary"
				style={{
					marginBottom: 16,
				}}
			>
				Add a new user
			</Button>
			<Table
				style={{ margin: '16px' }}
				pagination={false}
				onRow={(record, rowIndex) => {
					return {
						record,
						onSave
					}
				}}
				components={components}
				rowClassName={() => 'editable-row'}
				bordered
				dataSource={data}
				columns={mappedColumns}
			/>
		</div>
	);
}

export default EditableTable;