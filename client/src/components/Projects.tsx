import React, {useEffect, useState} from 'react'
import {Button, Card, Col, Form, Row, Select, Spin} from 'antd'
import {LeftOutlined, RightOutlined} from '@ant-design/icons'
import {IssueInterface, IssuesQueryInterface} from '../../../server/types'
import CreateProjectModal from './CreateProjectModal'
import {loadAndUpdateIssuesStatus, loadProjects} from '../common/api'
import {IssueStatuses} from '../common/constants'
import {useNavigate} from 'react-router-dom'

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

        setProjects(loadedProjects?.map(project => ({value: project?._id.toString(), label: project.projectName})))
    }

    // Filter form
    const [projectsForm] = Form.useForm()

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
        setPlannedCards(issues.filter(issues => issues.issueStatus === IssueStatuses.PLANNED))
        setDevelopmentCards(issues.filter(issues => issues.issueStatus === IssueStatuses.IN_DEVELOPMENT))
        setClarificationCards(issues.filter(issues => issues.issueStatus === IssueStatuses.IN_CLARIFICATION))
        setQaCards(issues.filter(issues => issues.issueStatus === IssueStatuses.IN_QA))
        setClosedCards(issues.filter(issues => issues.issueStatus === IssueStatuses.CLOSED))
    }, [issues])

    const navigate = useNavigate()

    const handleMoveLeft = async (issueId: string) => {
        setIsLoading(true)

        await loadAndUpdateIssuesStatus(issueId, 'left')

        await loadIssues()

        setIsLoading(false)
    }

    const handleMoveRight = async (issueId: string) => {
        setIsLoading(true)

        await loadAndUpdateIssuesStatus(issueId, 'right')

        await loadIssues()

        setIsLoading(false)
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
                <Form form={projectsForm} onFinish={handleSubmit} layout='inline' style={{maxWidth: 'none'}}>
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
                            allowClear
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
            </div>

            <Row className='kanban-board' gutter={[16, 16]}>
                <Col span={4}>
                    <Card className='issue-card-column' title={IssueStatuses.PLANNED} style={{minHeight: '300px'}}>
                        {isLoading ? (
                            <Spin size='large' />
                        ) : (
                            <>
                                {plannedCards?.map(card => (
                                    <Card
                                        key={card?._id?.toString() || ''}
                                        title={
                                            <Button onClick={() => navigate(`/issues/${card._id}`)}>
                                                {card.title}
                                            </Button>
                                        }
                                        style={{marginBottom: '8px'}}
                                        className='issue-card'
                                    >
                                        <div className='issue-card-text-wrapper'>
                                            <p className='issue-card-text'>{card.assigneeName}</p>
                                            <p className='issue-card-text'>{card.issuePriority}</p>
                                        </div>

                                        <div className='card-moving-buttons'>
                                            <Button
                                                className='move-left'
                                                onClick={() => handleMoveLeft(card?._id?.toString() || '')}
                                                disabled
                                            >
                                                <LeftOutlined />
                                            </Button>
                                            <Button
                                                className='move-right'
                                                onClick={() => handleMoveRight(card?._id?.toString() || '')}
                                            >
                                                <RightOutlined />
                                            </Button>
                                        </div>
                                    </Card>
                                ))}
                            </>
                        )}
                    </Card>
                </Col>
                <Col span={4}>
                    <Card
                        className='issue-card-column'
                        title={IssueStatuses.IN_DEVELOPMENT}
                        style={{minHeight: '300px'}}
                    >
                        {isLoading ? (
                            <Spin size='large' />
                        ) : (
                            <>
                                {developmentCards?.map(card => (
                                    <Card
                                        key={card?._id?.toString() || ''}
                                        title={
                                            <Button onClick={() => navigate(`/issues/${card._id}`)}>
                                                {card.title}
                                            </Button>
                                        }
                                        style={{marginBottom: '8px'}}
                                        className='issue-card'
                                    >
                                        <div className='issue-card-text-wrapper'>
                                            <p className='issue-card-text'>{card.assigneeName}</p>
                                            <p className='issue-card-text'>{card.issuePriority}</p>
                                        </div>

                                        <div className='card-moving-buttons'>
                                            <Button
                                                className='move-left'
                                                onClick={() => handleMoveLeft(card?._id?.toString() || '')}
                                            >
                                                <LeftOutlined />
                                            </Button>
                                            <Button
                                                className='move-right'
                                                onClick={() => handleMoveRight(card?._id?.toString() || '')}
                                            >
                                                <RightOutlined />
                                            </Button>
                                        </div>
                                    </Card>
                                ))}
                            </>
                        )}
                    </Card>
                </Col>
                <Col span={4}>
                    <Card
                        className='issue-card-column'
                        title={IssueStatuses.IN_CLARIFICATION}
                        style={{minHeight: '300px'}}
                    >
                        {isLoading ? (
                            <Spin size='large' />
                        ) : (
                            <>
                                {clarificationCards?.map(card => (
                                    <Card
                                        key={card?._id?.toString() || ''}
                                        title={
                                            <Button onClick={() => navigate(`/issues/${card._id}`)}>
                                                {card.title}
                                            </Button>
                                        }
                                        style={{marginBottom: '8px'}}
                                        className='issue-card'
                                    >
                                        <div className='issue-card-text-wrapper'>
                                            <p className='issue-card-text'>{card.assigneeName}</p>
                                            <p className='issue-card-text'>{card.issuePriority}</p>
                                        </div>

                                        <div className='card-moving-buttons'>
                                            <Button
                                                className='move-left'
                                                onClick={() => handleMoveLeft(card?._id?.toString() || '')}
                                            >
                                                <LeftOutlined />
                                            </Button>
                                            <Button
                                                className='move-right'
                                                onClick={() => handleMoveRight(card?._id?.toString() || '')}
                                            >
                                                <RightOutlined />
                                            </Button>
                                        </div>
                                    </Card>
                                ))}
                            </>
                        )}
                    </Card>
                </Col>
                <Col span={4}>
                    <Card className='issue-card-column' title={IssueStatuses.IN_QA} style={{minHeight: '300px'}}>
                        {isLoading ? (
                            <Spin size='large' />
                        ) : (
                            <>
                                {qaCards?.map(card => (
                                    <Card
                                        key={card?._id?.toString() || ''}
                                        title={
                                            <Button onClick={() => navigate(`/issues/${card._id}`)}>
                                                {card.title}
                                            </Button>
                                        }
                                        style={{marginBottom: '8px'}}
                                        className='issue-card'
                                    >
                                        <div className='issue-card-text-wrapper'>
                                            <p className='issue-card-text'>{card.assigneeName}</p>
                                            <p className='issue-card-text'>{card.issuePriority}</p>
                                        </div>

                                        <div className='card-moving-buttons'>
                                            <Button
                                                className='move-left'
                                                onClick={() => handleMoveLeft(card?._id?.toString() || '')}
                                            >
                                                <LeftOutlined />
                                            </Button>
                                            <Button
                                                className='move-right'
                                                onClick={() => handleMoveRight(card?._id?.toString() || '')}
                                            >
                                                <RightOutlined />
                                            </Button>
                                        </div>
                                    </Card>
                                ))}
                            </>
                        )}
                    </Card>
                </Col>
                <Col span={4}>
                    <Card className='issue-card-column' title={IssueStatuses.CLOSED} style={{minHeight: '300px'}}>
                        {isLoading ? (
                            <Spin size='large' />
                        ) : (
                            <>
                                {closedCards?.map(card => (
                                    <Card
                                        key={card?._id?.toString() || ''}
                                        title={
                                            <Button onClick={() => navigate(`/issues/${card._id}`)}>
                                                {card.title}
                                            </Button>
                                        }
                                        style={{marginBottom: '8px'}}
                                        className='issue-card'
                                    >
                                        <div className='issue-card-text-wrapper'>
                                            <p className='issue-card-text'>{card.assigneeName}</p>
                                            <p className='issue-card-text'>{card.issuePriority}</p>
                                        </div>

                                        <div className='card-moving-buttons'>
                                            <Button
                                                className='move-left'
                                                onClick={() => handleMoveLeft(card?._id?.toString() || '')}
                                            >
                                                <LeftOutlined />
                                            </Button>
                                            <Button
                                                className='move-right'
                                                onClick={() => handleMoveRight(card?._id?.toString() || '')}
                                                disabled
                                            >
                                                <RightOutlined />
                                            </Button>
                                        </div>
                                    </Card>
                                ))}
                            </>
                        )}
                    </Card>
                </Col>
            </Row>
        </div>
    )
}
