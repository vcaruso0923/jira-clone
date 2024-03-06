import React, {useEffect, useRef, useState} from 'react'
import './App.css'
import {Projects} from './components/Projects'
import {Header} from './components/Header'
import {useAuth0} from '@auth0/auth0-react'
import {AuthForm} from './components/AuthForm'
import {Routes, Route, useNavigate} from 'react-router-dom'
import {IssueInterface, IssuesQueryInterface} from '../../server/types'

export const App = () => {
    const {isAuthenticated, handleRedirectCallback} = useAuth0()
    const navigate = useNavigate()

    const firstUseEffect = useRef(true)

    useEffect(() => {
        if (isAuthenticated) {
            navigate('/projects')
        }

        if (firstUseEffect.current) {
            handleLoad()
            firstUseEffect.current = false
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

        let query

        if (issueSearchRequestBody) {
            query = new URLSearchParams({...issueSearchRequestBody}).toString()
        }

        await fetch(
            `${process.env.NODE_ENV === 'development' ? 'http://localhost:3001' : ''}/issue/search${
                query ? '?' + query : ''
            }`,
            {
                method: 'GET'
            }
        )
            .then(response => {
                if (response.ok) {
                    return response.json()
                } else {
                    throw new Error('Failed to fetch issues')
                }
            })
            .then(data => {
                setIssues(data)
            })
            .catch(error => {
                console.error(error)
            })

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
                </Routes>
            </div>
        </div>
    )
}
