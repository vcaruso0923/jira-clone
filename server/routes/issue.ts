import express, {Request, Response, Router} from 'express'
import db from '../db/conn.ts'
import {ObjectId} from 'mongodb'
import {IssueRequestInterface, IssuesQueryInterface} from '../types.ts'

const issueRoutes: Router = express.Router()

// Gets issues using search criterea
issueRoutes.get('/search', async (req: Request<{}, {}, {}, IssuesQueryInterface>, res) => {
    let collection = await db.collection('issues')

    const {sprint, _Id, title, assigneeId, projectId} = req.query

    const filter: any = {}

    if (sprint) {
        filter.sprint = sprint
    }

    if (_Id) {
        filter._id = new ObjectId(_Id)
    }

    if (title) {
        filter.title = {$regex: title.toString(), $options: 'i'} // Case-insensitive search
    }

    if (assigneeId) {
        filter.assigneeId = new ObjectId(assigneeId)
    }

    if (projectId) {
        filter.projectId = new ObjectId(projectId)
    }

    try {
        let results = await collection.find(filter).limit(50).toArray.toArray()
        res.send(results).status(200)
    } catch (error) {
        console.error(error)
        res.status(500).send("Sorry, can't complete your request. Please try again")
    }
})

// Fetches all issues with a matching project ID
issueRoutes.get('/project/:id', async (req, res) => {
    let collection = await db.collection('issues')
    let query = {projectId: req.params.id}
    let results = await collection.find(query).toArray()
    res.send(results).status(200)
})

// Get a single issue
issueRoutes.get('/:id', async (req, res) => {
    let collection = await db.collection('issues')
    let query = {_id: new ObjectId(req.params.id)}
    let result = await collection.findOne(query)

    if (!result) res.send('Not found').status(404)
    else res.send(result).status(200)
})

// Add a new document to the collection
issueRoutes.post('/add', async (req: Request<{}, {}, IssueRequestInterface>, res: Response) => {
    let collection = await db.collection('issues')
    let newDocument = req.body
    newDocument.date = new Date()

    let result = await collection.insertOne(newDocument)
    res.send(result).status(204)
})

// This section will help you delete a issue
issueRoutes.route('/delete/:id').delete((req, response) => {
    let myquery = {_id: new ObjectId(req.params.id)}
    db.collection('issues').deleteOne(myquery, function (err, obj) {
        if (err) throw err
        console.log('1 document deleted')
        response.json(obj)
    })
})

export default issueRoutes
