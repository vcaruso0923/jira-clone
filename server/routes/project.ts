import express, {Router} from 'express'
import db from '../db/conn.ts'
import {ObjectId} from 'mongodb'

const projectRoutes: Router = express.Router()

// Get a list of 50 projects
projectRoutes.get('/search', async (req, res) => {
    let collection = await db.collection('projects')

    try {
        let results = await collection.find({}).limit(50).toArray()
        res.send(results).status(200)
    } catch (error) {
        console.error(error)
        res.status(500).send("Sorry, can't complete your request. Please try again")
    }
})

// Add a new document to the collection
projectRoutes.post('/add', async (req, res) => {
    let collection = await db.collection('projects')
    let newDocument = req.body
    newDocument.date = new Date()

    try {
        let result = await collection.insertOne(newDocument)
        res.send(result).status(204)
    } catch (error) {
        console.error(error)
        res.status(500).send("Sorry, can't complete your request. Please try again")
    }
})

export default projectRoutes
