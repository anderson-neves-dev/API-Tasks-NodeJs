import http from 'node:http'
import { routes } from './middlewares/routes.js'
import { extractQueryParams } from './middlewares/utils/extract-query-params.js'
import { json } from './middlewares/json.js'

const server = http.createServer(async (req, res) => {
    const { method, url } = req

    await json(req, res)

    const route = routes.find(route => {
        return route.method === method && route.path.test(url)
    })
    console.log(route)
    if (route) {
        const routeParams = req.url.match(route.path)
        const { query, ...params } = routeParams.groups

        req.params = params

        req.query = query ? extractQueryParams(query) : {}

        return route.handler(req, res)
    }

    return res.writeHead(404).end()
})

server.listen(3334)