import { Router } from "express"
import { customersValidation } from "../middlewares/customersValidation.middlewares.js"
import { getCustomers,getCustomersId,postCustomers,putCustomersId } from "../controllers/customers.controllers.js"

const customersRoutes = Router()

customersRoutes.get("/customers", getCustomers)
customersRoutes.get("/customers/:id", getCustomersId)
customersRoutes.post("/customers", customersValidation, postCustomers)
customersRoutes.put("/customers/:id", customersValidation, putCustomersId)

export default customersRoutes