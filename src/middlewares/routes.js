import path from "node:path";
import { Database } from "../database.js";
import { buildRoutePath } from "./utils/buil-route-path.js";
import { randomUUID } from 'node:crypto';


const dataNowBrasil = (() => {
    const dataNow = new Date()
    return dataNow.toLocaleString();
})

const database = new Database

export const routes = [
    {
        method: 'GET',
        path: buildRoutePath('/tasks'),
        handler: (req, res) => {
            const { seach } = req.query
            const tasks = database.select('Tasks', seach ? {
                title: seach,
                description: seach,
            } : null)
            return res
                .setHeader('Content-type', 'application/json')
                .end(JSON.stringify(tasks))
        }
    }, {
        method: 'POST',
        path: buildRoutePath('/tasks'),
        handler: (req, res) => {
            const { title, description } = req.body
            const task = {
                id: randomUUID(),
                title,
                description,
                created_at: dataNowBrasil(),
                completed_at: null,
                update_at: dataNowBrasil(),
            }
            database.insert('Tasks', task)
            return res.writeHead(201).end()
        }
    }, {
        method: 'PUT',
        path: buildRoutePath('/tasks/:id'),
        handler: (req, res) => {
            const { id } = req.params
            const { title, description } = req.body

            if (!title && !description) {
                return res.writeHead(400).end(
                    JSON.stringify({ message: 'title or description are required' })
                )
            }

            const [task] = database.select('Tasks', { id })

            if (!task) {
                return res.writeHead(404).end()
            }
            database.put('Tasks', id, {
                title: title ?? task.title,
                description: description ?? task.description,
                update_at: dataNowBrasil()
            })
            return res.writeHead(204).end()
        }
    },
    {
        method: 'DELETE',
        path: buildRoutePath('/tasks/:id'),
        handler: (req, res) => {
            const { id } = req.params
            database.delete('Tasks', id)
            return res.writeHead(204).end()
        }
    }

]