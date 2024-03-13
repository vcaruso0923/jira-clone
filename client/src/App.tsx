import React, {useEffect, useRef, useState} from 'react'
import './App.css'
import {Projects} from './components/Projects'
import {Issues} from './components/Issues'
import {Header} from './components/Header'
import {useAuth0} from '@auth0/auth0-react'
import {AuthForm} from './components/AuthForm'
import {Routes, Route, useNavigate} from 'react-router-dom'
import {IssueInterface, IssuesQueryInterface} from '../../server/types'
import {loadAllIssues} from './common/api'

export const App = () => {
    const {isAuthenticated, handleRedirectCallback} = useAuth0()
    const navigate = useNavigate()

    const firstUseEffect = useRef(true)

    useEffect(() => {
        if (firstUseEffect.current) {
            handleLoad()
            firstUseEffect.current = false
        } else if (isAuthenticated) {
            if (window.location.pathname === '/') {
                navigate('/projects')
            }
        }
    }, [isAuthenticated])

    const [issues, setIssues] = useState<IssueInterface[]>([])
    const [isIssuesLoading, setIsIssuesLoading] = useState(false)

    const handleLoad = async () => {
        const url = window.location.href
        const loginCode = url.match(/code=([^&]+)/)
        const appState = url.match(/state=([^&]+)/)

        if (loginCode && appState) {
            try {
                await handleRedirectCallback()
                navigate('/projects')
            } catch (e) {
                console.error(e)
            }
        }
    }

    const loadIssues = async (issueSearchRequestBody?: IssuesQueryInterface) => {
        setIsIssuesLoading(true)

        await loadAllIssues(issueSearchRequestBody, setIssues)

        setIsIssuesLoading(false)
    }

    return (
        <div className='App'>
            {isAuthenticated && (
                <Header
                    loadIssues={loadIssues}
                    isIssuesLoading={isIssuesLoading}
                    setIsIssuesLoading={setIsIssuesLoading}
                />
            )}
            <div className={isAuthenticated ? 'application-wrapper' : 'auth-form-wrapper'}>
                <Routes>
                    <Route index element={<AuthForm />} />
                    <Route
                        path='projects'
                        element={
                            <Projects
                                loadIssues={loadIssues}
                                issues={issues}
                                isIssuesLoading={isIssuesLoading}
                                setIsIssuesLoading={setIsIssuesLoading}
                            />
                        }
                    />
                    <Route
                        path='issues/:issueId'
                        element={
                            <Issues
                                loadIssues={loadIssues}
                                issues={issues}
                                isIssuesLoading={isIssuesLoading}
                                setIsIssuesLoading={setIsIssuesLoading}
                            />
                        }
                    />
                </Routes>
            </div>
        </div>
    )
}
