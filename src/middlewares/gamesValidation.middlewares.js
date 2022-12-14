import connection from "../database/db.js"
import { gamesSchema } from "../models/games.models.js"

export async function gamesValidation(req, res, next) {
    const { name, image, stockTotal, pricePerDay } = req.body

    const validation = gamesSchema.validate({ name, image, stockTotal, pricePerDay }, { abortEarly: false })

    if (validation.error) {
        const erros = validation.error.details.map((detail) => detail.message)
        res.status(400).send(erros)
        return
    }

    const game = await connection.query("SELECT * FROM games WHERE name=$1", [name.toLowerCase()])
    if (game.rows.length != 0) {
        res.send("Já existe um jogo cadastrado com esse nome.")
        return
    }
    next()
}