import './env.ts'
import express from 'express'
import cors from 'cors'
import path from 'path'
import axios from 'axios'
import projectRoutes from './routes/project.ts'
import issueRoutes from './routes/issue.ts'

const app = express()

const port = process.env.PORT || 3001

// Serve up the client buil if we're in production - this way we can
// host the frontend & backend together on one server on heroku
if (process.env.NODE_ENV === 'production') {
    app.use(express.static(path.join('..', 'client', 'build')))

    app.get('*', (req, res) => {
        res.sendFile(path.join('..', 'client', 'build', 'index.html'))
    })
}

app.use(cors())
app.use(express.json())

// Hold on to auth0 managment api access token so we can call get users endpoint later
let auth0ManagementAccessToken = ''

// Function for fetching auth0 managementAPI
const getAuth0ManagementAccessToken = () => {
    var getAuth0ManagementAccessTokenOptions = {
        method: 'POST',
        url: `https://${process.env.SERVER_AUTH0_DOMAIN || ''}/oauth/token`,
        headers: {'content-type': 'application/x-www-form-urlencoded'},
        data: new URLSearchParams({
            grant_type: 'client_credentials',
            client_id: process.env.SERVER_AUTH0_CLIENT_id || '',
            client_secret: process.env.SERVER_AUTH0_CLIENT_SECRET || '',
            audience: `https://${process.env.SERVER_AUTH0_DOMAIN || ''}/api/v2/`
        })
    }

    axios
        .request(getAuth0ManagementAccessTokenOptions)
        .then(function (response) {
            auth0ManagementAccessToken = response.data.access_token

            // Get a new auth0 management api token after this one expires
            setTimeout(() => {
                getAuth0ManagementAccessToken()
            }, response.data.expires_in * 1000)
        })
        .catch(function (error) {
            console.error(error)
        })
}

getAuth0ManagementAccessToken()

// Get all users
app.get('/users', (req, res) => {
    var options = {
        method: 'GET',
        url: `https://${process.env.SERVER_AUTH0_DOMAIN || ''}/api/v2/users`,
        headers: {authorization: `Bearer ${auth0ManagementAccessToken}`}
    }

    axios
        .request(options)
        .then(function (response) {
            const resToSend = response.data.map(user => {
                return user.email
            })
            res.send(resToSend)
        })
        .catch(function (error) {
            res.status(404).send("Sorry, can't complete your request. Please try again")
            console.error(error)
        })
})

app.use('/project', projectRoutes)
app.use('/issue', issueRoutes)

// Global error handling
app.use((err, _req, res, next) => {
    console.log(err)
    res.status(500).send('An unexpected error occured.')
    next()
})

app.listen(port, () => {
    console.log(`Server is running on port: ${port}`)
})
