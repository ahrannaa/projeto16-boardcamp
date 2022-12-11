import connection from "../database/db.js"

export async function getGames(req, res) {

    try {
        const games = await connection.query
            ('SELECT games.*, categories.name AS "categoryName" FROM games JOIN categories ON games."categoryId" = categories.id')
        res.send(games.rows)
    } catch (err) {
        console.log(err)
        res.sendStatus(500)
    }

}
export async function postGames(req, res) {
    const { name, image, stockTotal, categoryId, pricePerDay } = req.body
    try {
        const result = await connection.query('INSERT INTO games (name, image, "stockTotal", "categoryId", "pricePerDay") VALUES ($1, $2, $3, $4, $5)', [name, image, stockTotal, categoryId, pricePerDay])
        console.log(result)
        res.sendStatus(201)

    } catch (err) {
        console.log(err)
        res.sendStatus(500)
    }
 }