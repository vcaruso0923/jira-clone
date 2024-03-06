import React, {useEffect, useState} from 'react'
import {Button, Card, Col, Row} from 'antd'
import {LeftOutlined, RightOutlined} from '@ant-design/icons'
import {IssueInterface} from '../../../server/types'

export const Projects = () => {
    const [plannedCards, setPlannedCards] = useState<IssueInterface[]>([])
    const [developmentCards, setDevelopmentCards] = useState<IssueInterface[]>([])
    const [clarificationCards, setClarificationCards] = useState<IssueInterface[]>([])
    const [qaCards, setQaCards] = useState<IssueInterface[]>([])
    const [closedCards, setClosedCards] = useState<IssueInterface[]>([])

    const cards: IssueInterface[] = [
        {
            _Id: '1',
            title: 'Issue 1',
            assigneeName: 'user 1',
            issuePriority: 'High',
            issueStatus: 'Planned'
        },
        {
            _Id: '2',
            title: 'Issue 2',
            assigneeName: 'user 1',
            issuePriority: 'High',
            issueStatus: 'In Development'
        },
        {
            _Id: '3',
            title: 'Issue 3',
            assigneeName: 'user 1',
            issuePriority: 'High',
            issueStatus: 'In Clarification'
        },
        {
            _Id: '4',
            title: 'Issue 4',
            assigneeName: 'user 1',
            issuePriority: 'High',
            issueStatus: 'In QA'
        },
        {
            _Id: '5',
            title: 'Issue 5',
            assigneeName: 'user 1',
            issuePriority: 'High',
            issueStatus: 'Closed'
        }
    ]

    useEffect(() => {
        setPlannedCards(cards.filter(card => card.issueStatus === 'Planned'))
        setDevelopmentCards(cards.filter(card => card.issueStatus === 'In Development'))
        setClarificationCards(cards.filter(card => card.issueStatus === 'In Clarification'))
        setQaCards(cards.filter(card => card.issueStatus === 'In QA'))
        setClosedCards(cards.filter(card => card.issueStatus === 'Closed'))
    }, [])

    const handleMoveLeft = () => {
        // This is where the logic for moving the cards to the left would go
    }
    const handleMoveRight = () => {
        // This is where the logic for moving the cards to the right would go
    }

    return (
        <div className='projects-wrapper'>
            <Row className='kanban-board' gutter={[16, 16]}>
                <Col span={4}>
                    <Card className='issue-card' title='Planned' style={{minHeight: '300px'}}>
                        {plannedCards?.map(card => (
                            <Card key={card._Id.toString()} title={card.title} style={{marginBottom: '8px'}}>
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
                            <Card key={card._Id.toString()} title={card.title} style={{marginBottom: '8px'}}>
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
                            <Card key={card._Id.toString()} title={card.title} style={{marginBottom: '8px'}}>
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
                            <Card key={card._Id.toString()} title={card.title} style={{marginBottom: '8px'}}>
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
                            <Card key={card._Id.toString()} title={card.title} style={{marginBottom: '8px'}}>
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
            </Row>
        </div>
    )
}
