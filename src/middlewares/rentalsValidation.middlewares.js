import { rentalsSchema } from "../models/rentals.models.js"
import connection from "../database/db.js"

export async function rentalsValidation(req, res, next) {
    const { customerId, gameId, daysRented } = req.body

    const validation = rentalsSchema.validate({ daysRented }, { abortEarly: false })

    if (validation.error) {
        const erros = validation.error.details.map((detail) => detail.message)
        res.status(400).send(erros)
        return
    }

    const customersResult = await connection.query("SELECT * FROM customers WHERE id=$1", [customerId])

    if (customersResult.rows.length === 0) {
        res.status(400).send("Esse cliente não existe")
        return
    }

    const gamesResult = await connection.query("SELECT * FROM games WHERE id=$1", [gameId])

    if (gamesResult.rows.length === 0) {
        res.status(400).send("Esse game não existe")
        return
    }

    const rentailsResult = await connection.query(
        `SELECT rentals.id, games."stockTotal" FROM rentals JOIN games ON rentals."gameId" = games.id WHERE rentals."gameId" = $1 AND rentals."returnDate" IS NULL`, 
        [gameId],
    )

    const totalRentals = rentailsResult.rows.length

    if (totalRentals > 0 && totalRentals == rentailsResult.rows[0].stockTotal) {
        res.status(400).send("Este game não está disponível")
        return
    }

    next()
}