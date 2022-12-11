import { gamesSchema } from "../models/games.models";

export async function gamesValidation(req, res, next) {
    const { name, image, stockTotal, categoryId, pricePerDay } = req.body

    const validation = gamesSchema.validate({ name, image, stockTotal, categoryId, pricePerDay }, { abortEarly: false })

    if (validation.error) {
        const erros = validation.error.details.map((detail) => detail.message)
        res.status(400).send(erros)
        return;
    }
}