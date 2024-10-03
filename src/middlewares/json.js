export async function json(req, res) {

    const buffer = []

    // Coletando os dados da requisição
    for await (const chunk of req) {
        buffer.push(chunk)
    }

    try {
        req.body = JSON.parse(Buffer.concat(buffer).toString())
    } catch {
        req.body = null
    }

    res.setHeader('Content-Type', 'application/json')

}