import connection from "../database/db.js"
import dayjs from "dayjs"

export async function getRentals(req, res) {
    const { customerId, gameId } = req.query
    let params = []
    let sqlQuery = `SELECT rentals.*, customers.name AS "customerName", games.name AS "gameName", games."categoryId", categories.name AS "categoryName" 
    FROM rentals 
    JOIN customers ON rentals."customerId" = customers.id 
    JOIN games ON rentals."gameId" = games.id
    JOIN categories ON games."categoryId" = categories.id`

    if (customerId && gameId) {
        sqlQuery += ` WHERE rentals."customerId" = $1 AND rentals."gameId" = $2`
        params = [customerId, gameId]
    } else if (customerId) {
        sqlQuery += ` WHERE rentals."customerId" = $1`
        params = [customerId]
    } else if (gameId) {
        sqlQuery += ` WHERE rentals."gameId" = $1`
        params = [gameId]
    }

    const { rows } = await connection.query(sqlQuery, params)
    const rentals = rows.map(row => (
        {
            id: row.id,
            customerId: row.customerId,
            gameId: row.gameId,
            rentDate: dayjs(row.rentDate).format("YYYY-MM-DD"),
            daysRented: row.daysRented,
            returnDate: row.returnDate,
            originalPrice: row.originalPrice,
            delayFee: row.delayFee,
            customer: {
                id: row.customerId,
                name: row.customerName,
            },
            game: {
                id: row.gameId,
                name: row.gameName,
                categoryId: row.categoryId,
                categoryName: row.categoryName,
            }
        }
    ))

    res.send(rentals)
    return
}
export async function postRentals(req, res) {
    const { customerId, gameId, daysRented } = req.body

    const gamesResult = await connection.query(`SELECT games."pricePerDay" FROM games WHERE id=$1`, [gameId])

    const rental = {
        customerId: customerId,
        gameId: gameId,
        rentDate: dayjs().format("YYYY-MM-DD"),
        daysRented: daysRented,
        originalPrice: daysRented * gamesResult.rows[0].pricePerDay,
    }

    try {

        await connection.query(
            'INSERT INTO rentals ("customerId", "gameId", "rentDate", "daysRented", "originalPrice") VALUES ($1,$2,$3,$4,$5)',
            [rental.customerId, rental.gameId, rental.rentDate, rental.daysRented, rental.originalPrice],
        )
        res.sendStatus(201)

    } catch (err) {
        res.status(500).send(err.message)
    }

    return
}
export async function finalizeRent(req, res) {
    const { id } = req.params

    try {
        const rentalsResult = await connection.query(`SELECT rentals.*, games."pricePerDay" FROM rentals JOIN games ON rentals."gameId" = games.id WHERE rentals.id = $1`, [id])

        if (rentalsResult.rows.length === 0) {
            res.status(404).send("Este aluguel não existe")
            return
        }

        const rental = rentalsResult.rows[0]

        if (rental.returnDate) {
            res.status(400).send("Este aluguel já foi finalizado")
            return
        }

        const returnDate = dayjs()
        const rentDate = dayjs(rental.rentDate)

        const finalDaysRented = returnDate.diff(rentDate, 'day')
        const delayDays = finalDaysRented - rental.daysRented

        let delayFee = 0

        if (delayDays > 0) {
            delayFee = delayDays * rental.pricePerDay
        }

        await connection.query(
            `UPDATE rentals SET "returnDate"=$1, "delayFee"=$2 WHERE id=$3`,
            [returnDate.format("YYYY-MM-DD"), delayFee, id]
        )
        res.sendStatus(200)
    } catch (err) {
        res.status(500).send(err.message)
    }

    return
}
export async function deleteRental(req, res) {
    const { id } = req.params

    const rentalsResult = await connection.query("SELECT * FROM rentals WHERE id=$1", [id])
    if (rentalsResult.rows.length === 0) {
        res.status(404).send("Esse aluguel não existe")
        return
    }

    if (!rentalsResult.rows[0].returnDate) {
        await connection.query("DELETE FROM rentals WHERE id=$1", [id])
        res.senStatus(200)
    } else {
        res.senStatus(400)
    }

}

