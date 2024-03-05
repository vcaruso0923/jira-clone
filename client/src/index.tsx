import React from 'react'
import ReactDOM from 'react-dom/client'
import './index.css'
import {App} from './App'
import {BrowserRouter} from 'react-router-dom'
import {Auth0Provider} from '@auth0/auth0-react'
import {ConfigProvider, theme} from 'antd'

const root = ReactDOM.createRoot(document.getElementById('root') as HTMLElement)

const {darkAlgorithm} = theme

root.render(
    <React.StrictMode>
        <ConfigProvider theme={{algorithm: darkAlgorithm}}>
            <BrowserRouter>
                <Auth0Provider
                    domain='dev-qj63hh0spxbgfty4.us.auth0.com'
                    clientId='pem4u70sZe2M0aUXqZkjBHPuaIM33jbv'
                    authorizationParams={{
                        redirect_uri: window.location.origin
                    }}
                    useRefreshTokens={true}
                    cacheLocation='localstorage'
                >
                    <App />
                </Auth0Provider>
            </BrowserRouter>
        </ConfigProvider>
    </React.StrictMode>
)
