import { categoriesSchema } from "../models/categories.models.js"
import connection from "../database/db.js"

export async function categoriesValidation(req, res, next) {
    const { name } = req.body

    const validation = categoriesSchema.validate({ name }, { abortEarly: false })

    if (validation.error) {
        const erros = validation.error.details.map((detail) => detail.message)
        res.status(400).send(erros)
        return
    }

    const categoriesResult = await connection.query("SELECT * FROM categories WHERE name=$1", [name.toLowerCase()])

    if (categoriesResult.rows.length != 0) {
        res.status(409).send("Essa categoria já existe")
        return
    }

    next()
}


