import {Button} from 'antd'
import React, {useState} from 'react'
import {CreateIssueModal} from './CreateIssueModal'
import {IssuesQueryInterface} from '../../../server/types'
import {useNavigate} from 'react-router-dom'

interface HeaderProps {
    loadIssues: (issueSearchRequestBody?: IssuesQueryInterface) => void
    isIssuesLoading: boolean
    setIsIssuesLoading: (loading: boolean) => void
}

export const Header: React.FC<HeaderProps> = ({loadIssues, isIssuesLoading, setIsIssuesLoading}) => {
    const [isCreateIssueModalVisible, setIsCreateIssueModalVisible] = useState(false)

    const navigate = useNavigate()

    const navigateTo = (path: string) => {
        if (!window.location.pathname.includes(path)) {
            navigate(path)
        }
    }

    const onCreateIssueModalOpen = () => {
        setIsCreateIssueModalVisible(true)
    }

    const onCreateIssueModalClose = () => {
        setIsCreateIssueModalVisible(false)
    }

    return (
        <div className='application-header'>
            <CreateIssueModal
                isCreateIssueModalVisible={isCreateIssueModalVisible}
                onCreateIssueModalClose={onCreateIssueModalClose}
                loadIssues={loadIssues}
                isIssuesLoading={isIssuesLoading}
                setIsIssuesLoading={setIsIssuesLoading}
            />
            <div className='header-left'>
                <h1 className='header-logo'>Jira Clone</h1>
                <Button size='large' className='header-button' onClick={() => navigateTo('/projects')}>
                    Projects
                </Button>
                <Button size='large' className='header-button' onClick={() => navigateTo('/issues/browse')}>
                    Issues
                </Button>
                <Button size='large' className='header-button' onClick={() => onCreateIssueModalOpen()}>
                    Create
                </Button>
            </div>

            <div className='header-right'>
                <Button size='large'>Profile</Button>
            </div>
        </div>
    )
}
