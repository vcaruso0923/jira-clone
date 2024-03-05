import React, {useEffect, useRef} from 'react'
import './App.css'
import {Dashboard} from './components/Dashboard'
import { Header } from './components/Header'
import {useAuth0} from '@auth0/auth0-react'
import {AuthForm} from './components/AuthForm'
import {Routes, Route, useNavigate} from 'react-router-dom'
import {Sidebar} from './components/Sidebar'

export const App = () => {
    const {isAuthenticated, handleRedirectCallback} = useAuth0()
    const navigate = useNavigate()

    const firstUseEffect = useRef(true)

    useEffect(() => {
        if (isAuthenticated) {
            navigate('/dashboard')
        }

        if (firstUseEffect.current) {
            handleLoad()
            firstUseEffect.current = false
        }
    }, [isAuthenticated])

    const handleLoad = async () => {
        const url = window.location.href
        const loginCode = url.match(/code=([^&]+)/)
        const appState = url.match(/state=([^&]+)/)

        if (loginCode && appState) {
            try {
                await handleRedirectCallback()
                navigate('/dashboard')
            } catch (e) {
                console.error(e)
            }
        }
    }

    return (
        <div className='App'>
            {isAuthenticated && <Header/>}
            <div className={isAuthenticated ? 'application-wrapper' : 'auth-form-wrapper'}>
                <Routes>
                    <Route index element={<AuthForm />} />
                    <Route path='dashboard' element={<Dashboard />} />
                </Routes>
            </div>
        </div>
    )
}
