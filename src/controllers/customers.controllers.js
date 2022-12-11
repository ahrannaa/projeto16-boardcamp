import connection from "../database/db.js"

export async function getCustomers(req, res) {
    try {
        const { rows } = await connection.query("SELECT * FROM customers;");
        res.send(rows);
    } catch (err) {
        res.status(500).send(err.message);
    }

}
export async function getCustomersId(req, res) {
    const { id } = req.params;

    try {
        const { rows } = await connection.query("SELECT * FROM customers WHERE id=$1;", [id]
        );

        if (rows.length === 0) {
            res.status(404).send("Não existe nenhum cliente com esse id");
        }

        res.send(rows[0]);
    } catch (err) {
        res.status(500).send(err.mensage)
    }
}
export async function postCustomers(req, res) {
    const { name, phone, cpf, birthday } = req.body;

    try {
        await connection.query("INSERT INTO customers (name, phone, cpf, birthday) VALUES ($1,$2,$3,$4);",
            [name, phone, cpf, birthday]);
        res.sendStatus(201)
    } catch (err) {
        res.status(500).send(err.message);
    }

}
export async function putCustomersId(req, res) {
    const { name, phone, cpf, birthday } = req.body;
   const { id } = req.params;

  try {
    await connection.query(
      "UPDATE customers SET name=$1, phone=$2, cpf=$3, birthday=$4 WHERE id=$5;",
      [name, phone, cpf, birthday, id]
    );
    res.sendStatus(200);
  } catch (err) {
    res.status(500).send(err.message);
  }
}

