import connection from "../database/db.js"

export async function getGames(req, res) {
    const { name } = req.query;

    if (name === undefined) {
        const games = await connection.query
            ('SELECT games.*, categories.name AS "categoryName" FROM games JOIN categories ON games."categoryId" = categories.id')
        res.send(games.rows)
    } else {
        const games = await connection.query('SELECT * FROM games WHERE name ILIKE $1', ['%' + name + '%'])
        res.send(games.rows)
    }


}
export async function postGames(req, res) {
    const { name, image, stockTotal, categoryId, pricePerDay } = req.body

    const category = await connection.query("SELECT * FROM categories WHERE id=$1", [categoryId])
    console.log(category)
    if (category.rows.length === 0) {
        res.send("Essa categoria não existe")
        return;
    }

    try {
        const result = await connection.query('INSERT INTO games (name, image, "stockTotal", "categoryId", "pricePerDay") VALUES ($1, $2, $3, $4, $5)', [name, image, stockTotal, categoryId, pricePerDay])
        console.log(result)
        res.sendStatus(201)

    } catch (err) {
        console.log(err)
        res.sendStatus(500)
    }
}