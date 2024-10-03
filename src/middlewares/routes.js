import { Database } from "../database.js";
import { buildRoutePath } from "./utils/buil-route-path.js";
import { randomUUID } from 'node:crypto';


const dataNow = new Date()
const dataNowBrasil = dataNow.toLocaleString();
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
                created_at: dataNowBrasil,
                completed_at: null,
                update_at: dataNowBrasil,
            }
            database.insert('Tasks', task)
            return res.writeHead(201).end()
        }
    }
]