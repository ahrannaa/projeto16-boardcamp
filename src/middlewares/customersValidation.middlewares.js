import { customersSchema } from "../models/customers.models.js";

export async function customersValidation(req, res, next) {
    const { name, phone, cpf, birthday } = req.body

    const validation = customersSchema.validate({ name, phone, cpf, birthday }, { abortEarly: false })

    if (validation.error) {
        const erros = validation.error.details.map((detail) => detail.message)
        res.status(400).send(erros)
        return;
    }
    next()
}