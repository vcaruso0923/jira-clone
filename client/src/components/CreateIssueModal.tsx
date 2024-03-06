import React, {useState} from 'react'
import {Modal, Form, Input, Button, Select, InputNumber, DatePicker, Alert} from 'antd'
import {IssueRequestInterface} from '../../../server/types'

interface CreateIssueModalProps {
    isCreateIssueModalVisible: boolean
    onCreateIssueModalClose: () => void
    loadIssues: () => void
}

export const CreateIssueModal: React.FC<CreateIssueModalProps> = ({
    isCreateIssueModalVisible,
    onCreateIssueModalClose,
    loadIssues
}) => {
    const [form] = Form.useForm()
    const [error, setError] = useState(undefined)

    console.log(process.env.NODE_ENV)

    const handleSubmit = async (values: IssueRequestInterface) => {
        await fetch(`${process.env.NODE_ENV === 'development' ? 'http://localhost:3001' : ''}/issue/add`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(values)
        })
            .then(() => {
                form.resetFields()
                onCreateIssueModalClose()
                loadIssues()
            })
            .catch(error => {
                setError(error)
                return
            })
    }

    const handleCancel = () => {
        form.resetFields()
        onCreateIssueModalClose()
    }

    return (
        <Modal
            title={'Create an issue'}
            visible={isCreateIssueModalVisible}
            onCancel={onCreateIssueModalClose}
            footer={null}
            width={800}
        >
            <Form form={form} onFinish={handleSubmit} labelCol={{span: 4}}>
                <Form.Item name='title' label='Title'>
                    <Input />
                </Form.Item>

                <Form.Item name='project' label='Project'>
                    <Select
                        options={[
                            {value: 'project1', label: 'Project 1'},
                            {value: 'project2', label: 'Project 2'}
                        ]}
                    />
                </Form.Item>

                <Form.Item name='sprint' label='Sprint'>
                    <Select
                        options={[
                            {value: 'Sprint 1', label: 'Sprint 1'},
                            {value: 'Sprint 2', label: 'Sprint 2'},
                            {value: 'Sprint 3', label: 'Sprint 3'}
                        ]}
                    />
                </Form.Item>

                <Form.Item name='issueStatus' label='Initial Status'>
                    <Select
                        options={[
                            {value: 'Planned', label: 'Planned'},
                            {value: 'In Development', label: 'In Development'},
                            {value: 'In Clarification', label: 'In Clarification'},
                            {value: 'In QA', label: 'In QA'},
                            {value: 'Closed', label: 'Closed'}
                        ]}
                    />
                </Form.Item>

                <Form.Item name='issueType' label='Type'>
                    <Select
                        options={[
                            {value: 'Bug', label: 'Bug'},
                            {value: 'Feature', label: 'Feature'},
                            {value: 'Task', label: 'Task'}
                        ]}
                    />
                </Form.Item>

                <Form.Item name='issuePriority' label='Priority'>
                    <Select
                        options={[
                            {value: 'Low', label: 'Low'},
                            {value: 'Medium', label: 'Medium'},
                            {value: 'High', label: 'High'}
                        ]}
                    />
                </Form.Item>

                <Form.Item name='assignee' label='Assignee'>
                    <Select
                        options={[
                            {value: 'user1', label: 'user1'},
                            {value: 'user2', label: 'user2'}
                        ]}
                    />
                </Form.Item>

                <Form.Item name='workPointEstimate' label='W.P. Estimate'>
                    <InputNumber />
                </Form.Item>

                <Form.Item name='description' label='Description'>
                    <Input.TextArea />
                </Form.Item>

                <Form.Item name='dueDate' label='Due Date'>
                    <DatePicker />
                </Form.Item>

                {error && <Alert message='Error Text' type='error' />}

                {/* Add more form fields for other properties in IssueRequestInterface */}
                <Form.Item>
                    <Button type='primary' htmlType='submit'>
                        Submit
                    </Button>

                    <Button type='default' onClick={handleCancel}>
                        Cancel
                    </Button>
                </Form.Item>
            </Form>
        </Modal>
    )
}

export default CreateIssueModal
