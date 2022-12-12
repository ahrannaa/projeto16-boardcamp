import rentalsSchema from "../models/rentals.models"

export async function rentalsValidation(req, res, next) {
    const { daysRented } = req.body

    const validation = rentalsSchema.validate({ daysRented }, { abortEarly: false })

    if (validation.error) {
        const erros = validation.error.details.map((detail) => detail.message)
        res.status(400).send(erros)
        return;
    }
    next()
}