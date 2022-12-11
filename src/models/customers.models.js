import joi from "joi";

export const customersSchema = joi.object({
    name: joi.string().required().min(3),
    phone:joi.string().required().min(10).max(11),
    cpf:joi.string().required().min(11).max(11),
    birthday: '1992-10-05'
})