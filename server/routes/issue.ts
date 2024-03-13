import express, {Request, Response, Router} from 'express'
import db from '../db/conn.ts'
import {ObjectId} from 'mongodb'
import {IssueInterface, IssueRequestInterface, IssuesQueryInterface} from '../types.ts'

const issueRoutes: Router = express.Router()

// Gets issues using search criterea
issueRoutes.get('/search', async (req: Request<{}, {}, {}, IssuesQueryInterface>, res) => {
    let collection = await db.collection('issues')

    const {sprint, _id, title, assigneeName, projectId} = req.query

    const filter: any = {}

    if (sprint) {
        filter.sprint = sprint
    }

    if (_id) {
        filter._id = new ObjectId(_id)
    }

    if (title) {
        filter.title = {$regex: title.toString(), $options: 'i'} // Case-insensitive search
    }

    if (assigneeName) {
        filter.assigneeName = decodeURI(assigneeName)
    }

    if (projectId) {
        filter.projectId = new ObjectId(projectId)
    }

    try {
        let results = await collection.find(filter).limit(50).toArray()
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

    try {
        let results = await collection.find(query).toArray()
        res.send(results).status(200)
    } catch (error) {
        console.error(error)
        res.status(500).send("Sorry, can't complete your request. Please try again")
    }
})

// Update a single issue
issueRoutes.put('/update/:id', async (req: Request<{id: string}, {}, {}, IssueInterface>, res: Response) => {
    let collection = await db.collection('issues')
    let query = {_id: new ObjectId(req.params.id)}
    let newValues = {$set: req.body}

    try {
        let result = await collection.updateOne(query, newValues)
        res.send(result).status(204)
    } catch (error) {
        console.error(error)
        res.status(500).send("Sorry, can't complete your request. Please try again")
    }
})

// Get a single issue
issueRoutes.get('/:id', async (req, res) => {
    let collection = await db.collection('issues')
    let query = {_id: new ObjectId(req.params.id)}

    try {
        let result = await collection.findOne(query)
        if (!result) res.send('Not found').status(404)
        else res.send(result).status(200)
    } catch (error) {
        console.error(error)
        res.status(500).send("Sorry, can't complete your request. Please try again")
    }
})

// Add a new document to the collection
issueRoutes.post('/add', async (req: Request<{}, {}, IssueRequestInterface>, res: Response) => {
    let collection = await db.collection('issues')
    let newDocument = req.body
    newDocument.date = new Date()
    newDocument.lastUpdated = new Date()

    try {
        let result = await collection.insertOne(newDocument)
        res.send(result).status(204)
    } catch (error) {
        console.error(error)
        res.status(500).send("Sorry, can't complete your request. Please try again")
    }
})

// This section will help you delete a issue
issueRoutes.route('/delete/:id').delete((req, response) => {
    let myquery = {_id: new ObjectId(req.params.id)}
    try {
        db.collection('issues').deleteOne(myquery, function (err, obj) {
            if (err) throw err
            console.log('1 document deleted')
            response.json(obj)
        })
    } catch (error) {
        console.error(error)
        response.status(500).send("Sorry, can't complete your request. Please try again")
    }
})

export default issueRoutes
