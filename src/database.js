import { Console } from 'node:console';
import fs from 'node:fs/promises'

const databasePath = new URL('../db.json', import.meta.url)



const dataNowBrasil = (() => {
    const dataNow = new Date()
    return dataNow.toLocaleString();
})

export class Database {
    #database = {}

    constructor() {
        fs.readFile(databasePath, 'utf8')
            .then(data => {
                this.#database = JSON.parse(data)
            })
            .catch(() => {
                this.#persist()
            })
    }

    #persist() {
        fs.writeFile(databasePath, JSON.stringify(this.#database))
    }

    select(table, seach) {
        let data = this.#database[table] ?? []
        if (seach) {
            data = data.filter(row => {
                return Object.entries(seach).some(([key, value]) => {
                    return row[key].toLowerCase().includes(value.toLowerCase())
                })
            })
        }
        return data
    }

    insert(table, data) {
        if (Array.isArray(this.#database[table])) {
            this.#database[table].push(data)
        } else {
            this.#database[table] = [data]
        }
        this.#persist()

        return data;
    }

    delete(table, id) {
        const rowIndex = this.#database[table].findIndex(row => row.id === id)

        if (rowIndex > -1) {
            this.#database[table].splice(rowIndex, 1)
            this.#persist()
        }
    }

    put(table, id, data) {
        const rowIndex = this.#database[table].findIndex(row => row.id === id)

        if (rowIndex > -1) {
            console.log(data.title, data.description)
            this.#database[table][rowIndex].title = data.title ? data.title : this.#database[table][rowIndex].title
            this.#database[table][rowIndex].description = data.description ? data.description : this.#database[table][rowIndex].description
            this.#database[table][rowIndex].update_at = dataNowBrasil()
            this.#persist()
        }
    }




}