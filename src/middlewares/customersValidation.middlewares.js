import connection from "../database/db.js"
import { customersSchema } from "../models/customers.models.js"

export async function customersValidation(req, res, next) {
    const { name, phone, cpf, birthday } = req.body

    const validation = customersSchema.validate({ name, phone, cpf, birthday }, { abortEarly: false })

    if (validation.error) {
        const erros = validation.error.details.map((detail) => detail.message)
        res.status(400).send(erros)
        return
    }

    const customersResult = await connection.query("SELECT * FROM customers WHERE cpf=$1", [cpf])
    if (customersResult.rows.length != 0) {
        res.status(409).send("Já existe um cliente cadastrado com esses dados.")
        return
    }

    next()
}