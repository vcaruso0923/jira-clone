import React, {useEffect, useState} from 'react'
import {IssueInterface, IssuesQueryInterface} from '../../../server/types'
import {Button, Form, Select} from 'antd'
import {BugOutlined, CheckSquareOutlined, PlusSquareOutlined} from '@ant-design/icons'
import CreateIssueModal from './CreateIssueModal'
import {loadProjects, loadUsers} from '../common/api'

interface IssuesProps {
    issues: IssueInterface[]
    loadIssues: (issueSearchRequestBody?: IssuesQueryInterface) => void
    isIssuesLoading: boolean
    setIsIssuesLoading: (loading: boolean) => void
}

interface ProjectSelectionInterface {
    value: string
    label: string
}

export const Issues: React.FC<IssuesProps> = ({issues, loadIssues, isIssuesLoading, setIsIssuesLoading}) => {
    useEffect(() => {
        loadIssues()
        loadProjectsForSelect()
        loadUsersForSelect()
    }, [])

    // Edit issue modal
    const [isCreateIssueModalVisible, setIsCreateIssueModalVisible] = useState(false)

    const onCreateIssueModalOpen = () => {
        setIsCreateIssueModalVisible(true)
    }

    const onCreateIssueModalClose = () => {
        setIsCreateIssueModalVisible(false)
        loadIssues()
    }

    // Filter form
    const [issuesForm] = Form.useForm()
    const projVal = Form.useWatch('project', issuesForm)
    const sprintVal = Form.useWatch('sprint', issuesForm)
    const assigneeVal = Form.useWatch('assigneeName', issuesForm)
    // const textVal = Form.useWatch('name', issuesForm);
    const [isSprintFilterDisabled, setIsSprintFilterDisabled] = useState(true)
    const [projects, setProjects] = useState<ProjectSelectionInterface[] | undefined>([])
    const [users, setUsers] = useState<any[] | undefined>([])
    const [isApplyButtonDisabled, setIsApplyButtonDisabled] = useState(true)

    const loadProjectsForSelect = async () => {
        const loadedProjects = await loadProjects()

        setProjects(loadedProjects?.map(project => ({value: project?._id.toString(), label: project.projectName})))
    }

    const loadUsersForSelect = async () => {
        const data = await loadUsers()

        setUsers(data?.map(user => ({value: user, label: user})))
    }

    const handleSubmit = async (values: IssuesQueryInterface) => {
        setIsApplyButtonDisabled(true)
        Object.keys(values).forEach(key => (values[key] === undefined ? delete values[key] : {}))
        console.log(values)

        await loadIssues(values)
    }

    useEffect(() => {
        setIsApplyButtonDisabled(false)
    }, [projVal, sprintVal, assigneeVal])

    // Issue details
    const [selectedIssue, setSelectedIssue] = useState<IssueInterface | undefined>(undefined)

    useEffect(() => {
        if (issues.length > 0) {
            if (window.location.pathname === '/issues/browse') {
                setSelectedIssue(issues[0])
            } else {
                setSelectedIssue(issues.find(issue => issue._id === window.location.pathname.split('/').pop()))
            }
        }
    }, [issues])

    return (
        <div className='issues-wrapper'>
            <CreateIssueModal
                isCreateIssueModalVisible={isCreateIssueModalVisible}
                onCreateIssueModalClose={onCreateIssueModalClose}
                loadIssues={loadIssues}
                isIssuesLoading={isIssuesLoading}
                setIsIssuesLoading={setIsIssuesLoading}
                isEditMode={true}
                issueToEdit={selectedIssue}
            />
            <div className='project-filters'>
                <Form form={issuesForm} onFinish={handleSubmit} layout='inline' style={{maxWidth: 'none'}}>
                    <Form.Item name='project' label='Project'>
                        <Select
                            onChange={val => {
                                if (val) setIsSprintFilterDisabled(false)
                            }}
                            options={projects}
                            style={{width: 150}}
                            placeholder='Select a project'
                            allowClear
                        />
                    </Form.Item>

                    <Form.Item name='sprint' label='Sprint'>
                        <Select
                            options={[
                                {value: 'Sprint 1', label: 'Sprint 1'},
                                {value: 'Sprint 2', label: 'Sprint 2'},
                                {value: 'Sprint 3', label: 'Sprint 3'}
                            ]}
                            style={{width: 150}}
                            placeholder='Select a sprint'
                            disabled={isSprintFilterDisabled} // Disable the sprint select until a project is selected
                            allowClear
                        />
                    </Form.Item>

                    <Form.Item name='assigneeName' label='Assignee'>
                        <Select
                            onChange={val => {
                                if (val) setIsSprintFilterDisabled(false)
                            }}
                            options={users}
                            style={{width: 150}}
                            placeholder='Select a project'
                            allowClear
                        />
                    </Form.Item>

                    <Form.Item>
                        <Button htmlType='submit' type='primary' disabled={isApplyButtonDisabled}>
                            Apply
                        </Button>
                    </Form.Item>
                </Form>
            </div>

            <div className='issues-lower-section-outer-wrapper'>
                <div className='issues-lower-section-inner-wrapper'>
                    <div className='issues-list-wrapper'>
                        <ul className='issues-list'>
                            {issues.map(issue => (
                                <li
                                    key={issue._id?.toString()}
                                    className='issue-list-item'
                                    onClick={() => setSelectedIssue(issue)}
                                >
                                    {issue.issueType === 'Bug' && <BugOutlined className='issue-list-item-icon' />}
                                    {issue.issueType === 'Task' && (
                                        <CheckSquareOutlined className='issue-list-item-icon' />
                                    )}
                                    {issue.issueType === 'Feature' && (
                                        <PlusSquareOutlined className='issue-list-item-icon' />
                                    )}
                                    <h2 className='issue-list-item-title'>{issue.title}</h2>
                                </li>
                            ))}
                        </ul>
                    </div>

                    <div className='issues-details-wrapper'>
                        <div className='issues-details-wrapper-inner'>
                            <Button className='edit-issue-button' size='large' onClick={onCreateIssueModalOpen}>
                                Edit
                            </Button>
                            <p className='issue-details-line-label'>Title:</p>
                            <h1>{selectedIssue?.title || 'N/A'}</h1>
                            <p className='issue-details-line-label'>Project:</p>
                            <p>{selectedIssue?.parentProject?.toString() || 'N/A'}</p>
                            <p className='issue-details-line-label'>Sprint:</p>
                            <p>{selectedIssue?.sprint || 'N/A'}</p>
                            <p className='issue-details-line-label'>Status:</p>
                            <p>{selectedIssue?.issueStatus || 'N/A'}</p>
                            <p className='issue-details-line-label'>Type:</p>
                            <p>{selectedIssue?.issueType || 'N/A'}</p>
                            <p className='issue-details-line-label'>Priority:</p>
                            <p>{selectedIssue?.issuePriority || 'N/A'}</p>
                            <p className='issue-details-line-label'>Assignee:</p>
                            <p>{selectedIssue?.assigneeName || 'N/A'}</p>
                            <p className='issue-details-line-label'>W.P. Estimate:</p>
                            <p>{selectedIssue?.workPointEstimate || 'N/A'}</p>
                            <p className='issue-details-line-label'>Description:</p>
                            <p>{selectedIssue?.description || 'N/A'}</p>
                            <p className='issue-details-line-label'>Due Date:</p>
                            <p>
                                {selectedIssue?.dueDate ? new Date(selectedIssue?.dueDate).toLocaleDateString() : 'N/A'}
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
