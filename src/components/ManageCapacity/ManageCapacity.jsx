import React, { useContext, useEffect, useState } from 'react'
import { Button, Col, Form, InputNumber, Layout, Row, Table } from 'antd'
import { Typography } from 'antd';
import Axios from 'axios';
import { API_URL } from '../../Config/config';
const { Title } = Typography;

const ManageCapacity = () => {
    const [form] = Form.useForm();
    const [capacity, setCapacity] = useState([20, 20, 20, 20, 10])

    useEffect(() => {
        Axios.get(`${API_URL}/admin/getDays`).then(({ data: days }) => {
            form.setFieldsValue({ capacity: days })
        })
            .catch((err) => console.error(err))
    }, [])

    const upadteCapacity = ({ capacity }) => {
        Axios.put(`${API_URL}/admin/editDays`, { days: capacity }, {}).then(() => alert('success')).catch((err) => {
            alert(err)
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
            </Layout>
        </>
    )
}

export default ManageCapacity