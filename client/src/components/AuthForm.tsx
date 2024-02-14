import React, {useState} from 'react'
import {Button} from 'antd'
import {useAuth0} from '@auth0/auth0-react'

export const AuthForm = () => {
    const {loginWithRedirect} = useAuth0()

    const onLogin = () => {
        loginWithRedirect()
    }

    return (
        <div className='auth-form-container'>
            <Button className='login-button' onClick={onLogin}>
                Login
            </Button>
        </div>
    )
}
