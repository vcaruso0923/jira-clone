import React, {useEffect, useState} from 'react'
import {Modal, Form, Input, Button, Select, InputNumber, DatePicker, Alert, Spin} from 'antd'
import {IssueRequestInterface, IssuesQueryInterface} from '../../../server/types'
import {loadProjects, loadUsers} from '../common/api'
import { IssueStatuses } from '../common/constants'

interface CreateIssueModalProps {
    isCreateIssueModalVisible: boolean
    onCreateIssueModalClose: () => void
    loadIssues: (issueSearchRequestBody?: IssuesQueryInterface) => void
    isIssuesLoading: boolean
    setIsIssuesLoading: (loading: boolean) => void
}

interface ProjectSelectionInterface {
    value: string
    label: string
}

export const CreateIssueModal: React.FC<CreateIssueModalProps> = ({
    isCreateIssueModalVisible,
    onCreateIssueModalClose,
    loadIssues,
    isIssuesLoading,
    setIsIssuesLoading
}) => {
    const [form] = Form.useForm()
    const [error, setError] = useState(undefined)
    const [projects, setProjects] = useState<ProjectSelectionInterface[] | undefined>([])
    const [users, setUsers] = useState<any[] | undefined>([])

    useEffect(() => {
        loadProjectsForSelect()
        loadUsersForSelect()
    }, [])

    const loadProjectsForSelect = async () => {
        const loadedProjects = await loadProjects()

        setProjects(loadedProjects?.map(project => ({value: project?._id.toString(), label: project.projectName})))
    }

    const loadUsersForSelect = async () => {
        const data = await loadUsers()

        setUsers(data?.map(user => ({value: user, label: user})))
    }

    const handleSubmit = async (values: IssueRequestInterface) => {
        setIsIssuesLoading(true)

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
            .finally(() => {
                setIsIssuesLoading(false)
            })
    }

    const handleCancel = () => {
        form.resetFields()
        onCreateIssueModalClose()
    }

    return (
        <Modal
            title={'Create an issue'}
            open={isCreateIssueModalVisible}
            onCancel={onCreateIssueModalClose}
            footer={null}
            width={800}
        >
            {isIssuesLoading ? (
                <Spin size='large' />
            ) : (
                <Form form={form} onFinish={handleSubmit} labelCol={{span: 4}}>
                    <Form.Item name='title' label='Title'>
                        <Input />
                    </Form.Item>

                    <Form.Item name='project' label='Project'>
                        <Select options={projects} />
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
                                {value: IssueStatuses.PLANNED, label: IssueStatuses.PLANNED},
                                {value: IssueStatuses.IN_DEVELOPMENT, label: IssueStatuses.IN_DEVELOPMENT},
                                {value: IssueStatuses.IN_CLARIFICATION, label: IssueStatuses.IN_CLARIFICATION},
                                {value: IssueStatuses.IN_QA, label: IssueStatuses.IN_QA},
                                {value: IssueStatuses.CLOSED, label: IssueStatuses.CLOSED}
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

                    <Form.Item name='assigneeName' label='Assignee'>
                        <Select
                            options={users}
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
                        <Button type='primary' htmlType='submit' className='modal-submit-button'>
                            Submit
                        </Button>

                        <Button type='default' onClick={handleCancel}>
                            Cancel
                        </Button>
                    </Form.Item>
                </Form>
            )}
        </Modal>
    )
}

export default CreateIssueModal
