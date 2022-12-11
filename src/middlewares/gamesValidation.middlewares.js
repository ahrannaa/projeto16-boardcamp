import { gamesSchema } from "../models/games.models.js";

export async function gamesValidation(req, res, next) {
    const { name } = req.body

    const validation = gamesSchema.validate({ name }, { abortEarly: false })

    if (validation.error) {
        const erros = validation.error.details.map((detail) => detail.message)
        res.status(400).send(erros)
        return;
    }
    next()
}