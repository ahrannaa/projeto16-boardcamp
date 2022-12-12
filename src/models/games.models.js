import joi from "joi"

export const gamesSchema = joi.object({
    name: joi.string().required().min(3),
    image:joi.string(),
    stocktotal:joi.number().min(1),
    pricePerDay:joi.number().min(1),
})