import React from 'react'
import ReactDOM from 'react-dom/client'
import './index.css'
import {App} from './App'
import {BrowserRouter} from 'react-router-dom'
import {Auth0Provider} from '@auth0/auth0-react'
import {ConfigProvider, theme} from 'antd'

const root = ReactDOM.createRoot(document.getElementById('root') as HTMLElement)

const {darkAlgorithm} = theme

const auth0Domain = process.env.AUTH0_DOMAIN || ''
const auth0ClientId = process.env.AUTH0_CLIENT_ID || ''

root.render(
    <React.StrictMode>
        <ConfigProvider theme={{algorithm: darkAlgorithm}}>
            <BrowserRouter>
                <Auth0Provider
                    domain={auth0Domain}
                    clientId={auth0ClientId}
                    authorizationParams={{
                        redirect_uri: window.location.origin
                    }}
                    useRefreshTokens={true}
                >
                    <App />
                </Auth0Provider>
            </BrowserRouter>
        </ConfigProvider>
    </React.StrictMode>
)
