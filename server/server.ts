import './env.ts'
import express from 'express'
import cors from 'cors'
import path from 'path'
import recordRoutes from './routes/record.ts'

const app = express()

const port = process.env.PORT || 3001

if (process.env.NODE_ENV === 'production') {
    app.use(express.static(path.join('..', 'client', 'build')))

    app.get('*', (req, res) => {
        res.sendFile(path.join('..', 'client', 'build', 'index.html'))
    })
}

app.use(cors())
app.use(express.json())

app.use(recordRoutes)

// Global error handling
app.use((err, _req, res, next) => {
    console.log(err)
    res.status(500).send('An unexpected error occured.')
    next()
})

app.listen(port, () => {
    console.log(`Server is running on port: ${port}`)
})
