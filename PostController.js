import 'dotenv/config'
import { MongoClient, ObjectId } from 'mongodb'
import fileService from './fileService.js'

const { MONGODB_URI } = process.env
const client = new MongoClient(MONGODB_URI)

client.connect()

const db = client.db('rest-api')
const posts = db.collection('posts')

class PostController {
    async create(req, res) {
        try {
            const { author, title, content } = req.body
            const { picture } = req.files
            const fileName = await fileService.saveFile(picture)
            const post = await posts.insertOne(
                { author, title, content, picture: fileName }
            ).then(async (res) => {
                return await posts.findOne({ _id: res.insertedId })
            })
            res.json(post)
        } catch (e) {
            res.status(500).json(e.message)
        }
    }
    async getAll(req, res) {
        try {
            const allPosts = await posts.find().toArray()
            res.json(allPosts)
        } catch (e) {
            res.status(500).json(e.message)
        }
    }
    async getOne(req, res) {
        try {
            const { id } = req.params
            const post = await posts.findOne({ _id: ObjectId(id) })
            res.json(post)
        } catch (e) {
            res.status(500).json(e.message)
        }
    }
    async update(req, res) {
        try {
            const { id } = req.params
            const post = req.body
            const updatedPost = await posts.findOneAndUpdate(
                { _id: ObjectId(id) },
                { $set: post }
            ).then(async (res) => {
                return await posts.findOne({ _id: res.value._id })
            })
            res.json(updatedPost)
        } catch (e) {
            res.status(500).json(e.message)
        }
    }
    async delete(req, res) {
        try {
            const { id } = req.params
            const deletedPost = await posts.findOneAndDelete({ _id: ObjectId(id) })
            res.json(deletedPost.value)
        } catch (e) {
            res.status(500).json(e.message)
        }
    }
}

export default new PostController()