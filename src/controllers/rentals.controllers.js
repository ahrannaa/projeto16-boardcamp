import connection from "../database/db.js"
import dayjs from "dayjs"

export async function getRentals(req, res) {
    try {
        const rentals = await connection.query
            (`SELECT rentals.*, customers.id, customers.name, games.id, games.name, games."categoryId", categories.name AS "categoryName" 
            FROM rentals 
            JOIN customers ON rentals."customerId" = customers.id 
            JOIN games ON rentals."gameId" = games.id
            JOIN categories ON games."categoryId" = categories.id`)
        res.send(rentals.rows)
    } catch (err) {
        console.log(err)
        res.sendStatus(500)
    }
}
export async function postRentals(req, res) {
    const { customerId, gameId, daysRented } = req.body

    const customerResult = await connection.query("SELECT * FROM customers WHERE id=$1", [customerId])

    if (customerResult.rows.length === 0) {
        res.status(400).send("Esse id não existe")
        return
    }
    const gameResult = await connection.query("SELECT * FROM games WHERE id=$1", [gameId])
    if (gameResult.rows.length === 0) {
        res.status(400).send("Esse game não existe")
        return
    }

    const rental = {
        customerId: customerId,
        gameId: gameId,
        rentDate: dayjs().format("YYYY-MM-DD"),
        daysRented: daysRented,
        returnDate: null,
        originalPrice: daysRented * gameResult.rows[0].pricePerDay,
        delayFee: null,
    }

    try {

        await connection.query('INSERT INTO rentals ("customerId", "gameId", "rentDate", "daysRented", "originalPrice") VALUES ($1,$2,$3,$4,$5);',
            [rental.customerId, rental.gameId, rental.rentDate, rental.daysRented, rental.originalPrice])
        res.status(201).send("Aluguel concluído!")

    } catch (err) {
        res.status(500).send(err.message);
    }
}
export async function finalizeRent(req, res) {
    const { id } = req.params
   
    const rentalResult = await connection.query("SELECT * FROM rentals WHERE id=$1", [id])
   if(rentalResult.rows.length === 0){
      res.send("Não existe nenhum aluguel cadastrado com esse cliente")
      return;
   }
    const rental = {
        customerId: rentalResult.rows[0].customerId,
        gameId: rentalResult.rows[0].gameId,
        rentDate: rentalResult.rows[0].rentDate,
        daysRented: rentalResult.rows[0].daysRented,
        returnDate: dayjs().format("YYYY-MM-DD"),
        originalPrice: rentalResult.rows[0].originalPrice,
    }

    try {
       
        res.sendStatus(200)
    
    } catch (err) {
        res.status(500).send(err.message);
    }

}
export async function deleteRental(req, res) {
    const { id } = req.params

    const deleteId = await connection.query("SELECT * FROM rentals WHERE id=$1", [id]);
    if (deleteId.rows.length === 0) {
        res.status(404).send("Não existe nenhum aluguel com esse id")
        return;
    }

    try {
        await connection.query("DELETE FROM rentals WHERE id=$1", [id]);
        res.status(200).send("Excluido com sucesso");
    } catch (err) {
        res.status(500).send(err.message);
    }
}

