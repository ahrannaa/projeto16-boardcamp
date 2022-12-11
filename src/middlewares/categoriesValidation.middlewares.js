import { categoriesSchema } from "../models/categories.models.js";

export async function categoriesValidation(req, res, next) {
    const { name } = req.body

    const validation = categoriesSchema.validate({ name }, { abortEarly: false })

    if (validation.error) {
        const erros = validation.error.details.map((detail) => detail.message)
        res.status(400).send(erros)
        return;
    }
    next()
}


