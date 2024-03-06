import React, {useState} from 'react'
import {Modal, Form, Input, Button, Alert, Spin} from 'antd'
import {IssuesQueryInterface, ProjectRequestInterface} from '../../../server/types'

interface CreateProjectModalProps {
    isCreateProjectModalVisible: boolean
    onCreateProjectModalClose: () => void
    loadProjectsForFilter: () => void
    loadIssues: (issueSearchRequestBody?: IssuesQueryInterface) => void
    isLoading: boolean
    setIsLoading: (loading: boolean) => void
}

export const CreateProjectModal: React.FC<CreateProjectModalProps> = ({
    isCreateProjectModalVisible,
    onCreateProjectModalClose,
    loadProjectsForFilter,
    loadIssues,
    isLoading,
    setIsLoading
}) => {
    const [form] = Form.useForm()
    const [error, setError] = useState(undefined)

    const handleSubmit = async (values: ProjectRequestInterface) => {
        setIsLoading(true)

        await fetch(`${process.env.NODE_ENV === 'development' ? 'http://localhost:3001' : ''}/project/add`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(values)
        })
            .then(() => {
                form.resetFields()
                onCreateProjectModalClose()
                loadProjectsForFilter()
                loadIssues()
            })
            .catch(error => {
                setError(error)
                return
            })
            .finally(() => {
                setIsLoading(false)
            })
    }

    const handleCancel = () => {
        form.resetFields()
        onCreateProjectModalClose()
    }

    return (
        <Modal
            title={'Create an issue'}
            open={isCreateProjectModalVisible}
            onCancel={onCreateProjectModalClose}
            footer={null}
            width={800}
        >
            {isLoading ? (
                <Spin size='large' />
            ) : (
                <Form form={form} onFinish={handleSubmit} labelCol={{span: 4}}>
                    <Form.Item name='projectName' label='Project Name'>
                        <Input />
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

export default CreateProjectModal
