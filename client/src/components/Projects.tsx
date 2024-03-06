import React, {useEffect, useState} from 'react'
import {Button, Card, Col, Form, Row, Select, Spin} from 'antd'
import {LeftOutlined, RightOutlined} from '@ant-design/icons'
import {IssueInterface, IssuesQueryInterface, ProjectInterface} from '../../../server/types'
import CreateProjectModal from './CreateProjectModal'
import {loadProjects} from '../common/api'

interface ProjectsProps {
    issues: IssueInterface[]
    loadIssues: (issueSearchRequestBody?: IssuesQueryInterface) => void
    isIssuesLoading: boolean
    setIsIssuesLoading: (loading: boolean) => void
}

export const Projects: React.FC<ProjectsProps> = ({issues, loadIssues, isIssuesLoading, setIsIssuesLoading}) => {
    // General
    const [isLoading, setIsLoading] = useState(false)

    useEffect(() => {
        loadProjectsForFilter()
        loadIssues()
    }, [])

    // Modal
    interface ProjectSelectionInterface {
        value: string
        label: string
    }

    const [isCreateProjectModalVisible, setIsCreateProjectModalVisible] = useState(false)
    const [projects, setProjects] = useState<ProjectSelectionInterface[] | undefined>([])

    const onCreateProjectModalOpen = () => {
        setIsCreateProjectModalVisible(true)
    }

    const onCreateProjectModalClose = () => {
        setIsCreateProjectModalVisible(false)
    }

    const loadProjectsForFilter = async () => {
        const loadedProjects = await loadProjects()

        setProjects(loadedProjects?.map(project => ({value: project._id.toString(), label: project.projectName})))
    }

    // Filter form
    const [form] = Form.useForm()

    const [isSprintFilterDisabled, setIsSprintFilterDisabled] = useState(true)

    const handleSubmit = async (values: IssuesQueryInterface) => {
        await loadIssues(values)
    }

    // Kanban Board
    const [plannedCards, setPlannedCards] = useState<IssueInterface[]>([])
    const [developmentCards, setDevelopmentCards] = useState<IssueInterface[]>([])
    const [clarificationCards, setClarificationCards] = useState<IssueInterface[]>([])
    const [qaCards, setQaCards] = useState<IssueInterface[]>([])
    const [closedCards, setClosedCards] = useState<IssueInterface[]>([])

    useEffect(() => {
        setPlannedCards(issues.filter(issues => issues.issueStatus === 'Planned'))
        setDevelopmentCards(issues.filter(issues => issues.issueStatus === 'In Development'))
        setClarificationCards(issues.filter(issues => issues.issueStatus === 'In Clarification'))
        setQaCards(issues.filter(issues => issues.issueStatus === 'In QA'))
        setClosedCards(issues.filter(issues => issues.issueStatus === 'Closed'))
    }, [issues])

    const handleMoveLeft = () => {
        // This is where the logic for moving the cards to the left would go
    }
    const handleMoveRight = () => {
        // This is where the logic for moving the cards to the right would go
    }

    return (
        <div className='projects-wrapper'>
            <CreateProjectModal
                isCreateProjectModalVisible={isCreateProjectModalVisible}
                onCreateProjectModalClose={onCreateProjectModalClose}
                loadProjectsForFilter={loadProjectsForFilter}
                loadIssues={loadIssues}
                isLoading={isLoading}
                setIsLoading={setIsLoading}
            />

            <div className='project-filters'>
                {isLoading ? (
                    <Spin size='large' />
                ) : (
                    <>
                        <Form form={form} onFinish={handleSubmit} layout='inline' style={{maxWidth: 'none'}}>
                            <Form.Item name='project' label='Project'>
                                <Select
                                    onChange={val => {
                                        if (val) setIsSprintFilterDisabled(false)
                                    }}
                                    options={projects}
                                    style={{width: 150}}
                                    placeholder='Select a project'
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
                                />
                            </Form.Item>

                            <Form.Item>
                                <Button htmlType='submit' type='primary'>
                                    Apply
                                </Button>
                            </Form.Item>
                        </Form>

                        <Button type='default' onClick={onCreateProjectModalOpen}>
                            Create Project
                        </Button>
                    </>
                )}
            </div>

            <Row className='kanban-board' gutter={[16, 16]}>
                {isLoading ? (
                    <Spin size='large' />
                ) : (
                    <>
                        <Col span={4}>
                            <Card className='issue-card' title='Planned' style={{minHeight: '300px'}}>
                                {plannedCards?.map(card => (
                                    <Card key={card._id.toString()} title={card.title} style={{marginBottom: '8px'}}>
                                        <div className='issue-card-text-wrapper'>
                                            <p className='issue-card-text'>{card.assigneeName}</p>
                                            <p className='issue-card-text'>{card.issuePriority}</p>
                                        </div>

                                        <div className='card-moving-buttons'>
                                            <Button className='move-left' onClick={handleMoveLeft}>
                                                <LeftOutlined />
                                            </Button>
                                            <Button className='move-right' onClick={handleMoveRight}>
                                                <RightOutlined />
                                            </Button>
                                        </div>
                                    </Card>
                                ))}
                            </Card>
                        </Col>
                        <Col span={4}>
                            <Card className='issue-card' title='In Development' style={{minHeight: '300px'}}>
                                {developmentCards?.map(card => (
                                    <Card key={card._id.toString()} title={card.title} style={{marginBottom: '8px'}}>
                                        <div className='issue-card-text-wrapper'>
                                            <p className='issue-card-text'>{card.assigneeName}</p>
                                            <p className='issue-card-text'>{card.issuePriority}</p>
                                        </div>

                                        <div className='card-moving-buttons'>
                                            <Button className='move-left' onClick={handleMoveLeft}>
                                                <LeftOutlined />
                                            </Button>
                                            <Button className='move-right' onClick={handleMoveRight}>
                                                <RightOutlined />
                                            </Button>
                                        </div>
                                    </Card>
                                ))}
                            </Card>
                        </Col>
                        <Col span={4}>
                            <Card className='issue-card' title='In Clarification' style={{minHeight: '300px'}}>
                                {clarificationCards?.map(card => (
                                    <Card key={card._id.toString()} title={card.title} style={{marginBottom: '8px'}}>
                                        <div className='issue-card-text-wrapper'>
                                            <p className='issue-card-text'>{card.assigneeName}</p>
                                            <p className='issue-card-text'>{card.issuePriority}</p>
                                        </div>

                                        <div className='card-moving-buttons'>
                                            <Button className='move-left' onClick={handleMoveLeft}>
                                                <LeftOutlined />
                                            </Button>
                                            <Button className='move-right' onClick={handleMoveRight}>
                                                <RightOutlined />
                                            </Button>
                                        </div>
                                    </Card>
                                ))}
                            </Card>
                        </Col>
                        <Col span={4}>
                            <Card className='issue-card' title='In QA' style={{minHeight: '300px'}}>
                                {qaCards?.map(card => (
                                    <Card key={card._id.toString()} title={card.title} style={{marginBottom: '8px'}}>
                                        <div className='issue-card-text-wrapper'>
                                            <p className='issue-card-text'>{card.assigneeName}</p>
                                            <p className='issue-card-text'>{card.issuePriority}</p>
                                        </div>

                                        <div className='card-moving-buttons'>
                                            <Button className='move-left' onClick={handleMoveLeft}>
                                                <LeftOutlined />
                                            </Button>
                                            <Button className='move-right' onClick={handleMoveRight}>
                                                <RightOutlined />
                                            </Button>
                                        </div>
                                    </Card>
                                ))}
                            </Card>
                        </Col>
                        <Col span={4}>
                            <Card className='issue-card' title='Closed' style={{minHeight: '300px'}}>
                                {closedCards?.map(card => (
                                    <Card key={card._id.toString()} title={card.title} style={{marginBottom: '8px'}}>
                                        <div className='issue-card-text-wrapper'>
                                            <p className='issue-card-text'>{card.assigneeName}</p>
                                            <p className='issue-card-text'>{card.issuePriority}</p>
                                        </div>

                                        <div className='card-moving-buttons'>
                                            <Button className='move-left' onClick={handleMoveLeft}>
                                                <LeftOutlined />
                                            </Button>
                                            <Button className='move-right' onClick={handleMoveRight}>
                                                <RightOutlined />
                                            </Button>
                                        </div>
                                    </Card>
                                ))}
                            </Card>
                        </Col>
                    </>
                )}
            </Row>
        </div>
    )
}
