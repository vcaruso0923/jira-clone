import express, {Router} from 'express'
import db from '../db/conn.ts'
import {ObjectId} from 'mongodb'

const recordRoutes: Router = express.Router()

// Get a list of 50 records
recordRoutes.get('/po', async (req, res) => {
    let collection = await db.collection('records')
    let results = await collection.find({}).limit(50).toArray()

    res.send(results).status(200)
})

// Fetches the latest records
recordRoutes.get('/latest', async (req, res) => {
    let collection = await db.collection('records')
    let results = await collection
        .aggregate([
            {'$project': {'author': 1, 'title': 1, 'tags': 1, 'date': 1}},
            {'$sort': {'date': -1}},
            {'$limit': 3}
        ])
        .toArray()
    res.send(results).status(200)
})

// Get a single post
recordRoutes.get('/:id', async (req, res) => {
    let collection = await db.collection('records')
    let query = {_id: new ObjectId(req.params.id)}
    let result = await collection.findOne(query)

    if (!result) res.send('Not found').status(404)
    else res.send(result).status(200)
})

// Add a new document to the collection
recordRoutes.post('/record/add', async (req, res) => {
    let collection = await db.collection('records')
    let newDocument = req.body
    newDocument.date = new Date()
    let result = await collection.insertOne(newDocument)
    res.send(result).status(204)
})

// Update the post with a new comment
recordRoutes.patch('/comment/:id', async (req, res) => {
    const query = {_id: new ObjectId(req.params.id)}
    const updates = {
        $push: {comments: req.body}
    }

    let collection = await db.collection('records')
    let result = await collection.updateOne(query, updates)

    res.send(result).status(200)
})

// Delete an entry
recordRoutes.delete('/:id', async (req, res) => {
    const query = {_id: new ObjectId(req.params.id)}

    const collection = db.collection('records')
    let result = await collection.deleteOne(query)

    res.send(result).status(200)
})

// This section will help you delete a record
recordRoutes.route('/:id').delete((req, response) => {
    let myquery = {_id: new ObjectId(req.params.id)}
    db.collection('records').deleteOne(myquery, function (err, obj) {
        if (err) throw err
        console.log('1 document deleted')
        response.json(obj)
    })
})

export default recordRoutes
