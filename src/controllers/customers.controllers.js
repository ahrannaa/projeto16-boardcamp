import connection from "../database/db.js"
import dayjs from "dayjs"

export async function getCustomers(req, res) {
    const { cpf } = req.query
    let rows = []

    if (cpf === undefined) {
        const customersResult = await connection.query("SELECT * FROM customers")
        rows = customersResult.rows
    } else {
        const customerResult = await connection.query('SELECT * FROM customers WHERE cpf ILIKE $1', [cpf + '%'])
        rows = customerResult.rows
    }

    const customers = rows.map((row) => ({ ...row, birthday: dayjs(row.birthday).format("YYYY-MM-DD") }))
    res.send(customers)
    return
}
export async function getCustomersId(req, res) {
    const { id } = req.params

    try {
        const { rows } = await connection.query("SELECT * FROM customers WHERE id=$1", [id])

        if (rows.length === 0) {
            res.status(404).send("Não existe nenhum cliente com esse id")
            return
        }

        const customer = rows[0]

        res.send({ ...customer, birthday: dayjs(customer.birthday).format("YYYY-MM-DD") })
    } catch (err) {
        res.status(500).send(err.mensage)
    }

    return
}
export async function postCustomers(req, res) {
    const { name, phone, cpf, birthday } = req.body

    try {
        await connection.query(
            "INSERT INTO customers (name, phone, cpf, birthday) VALUES ($1,$2,$3,$4)",
            [name, phone, cpf, birthday],
        )
        res.sendStatus(201)
    } catch (err) {
        res.status(500).send(err.message)
    }

    return
}
export async function putCustomersId(req, res) {
    const { name, phone, cpf, birthday } = req.body
    const { id } = req.params

    try {
        await connection.query(
            "UPDATE customers SET name=$1, phone=$2, cpf=$3, birthday=$4 WHERE id=$5",
            [name, phone, cpf, birthday, id]
        )
        res.sendStatus(200)
    } catch (err) {
        res.status(500).send(err.message)
    }

    return
}

