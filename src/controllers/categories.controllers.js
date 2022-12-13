import connection from "../database/db.js"

export async function getCategories(req, res) {

    try {
        const categories = await connection.query('SELECT * FROM categories')
        console.log(categories)
        res.send(categories.rows)

    } catch (err) {
        console.log(err)
        res.sendStatus(500)
    }

}

export async function postCategories(req, res) {
    const { name } = req.body
    
    try {
        await connection.query("INSERT INTO categories (name) VALUES ($1)", [name.toLowerCase()])
        res.sendStatus(201)

    } catch (err) {
        console.log(err)
        res.sendStatus(500)
    }
}