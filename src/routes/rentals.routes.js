import { Router } from "express"
import { getRentals, postRentals, finalizeRent, deleteRental } from "../controllers/rentals.controllers.js"
import { rentalsValidation } from "../middlewares/rentalsValidation.middlewares.js"

const rentalsRoutes = Router()

rentalsRoutes.get("/rentals", getRentals)
rentalsRoutes.post("/rentals", rentalsValidation, postRentals)
rentalsRoutes.post("/rentals/:id/return", finalizeRent)
rentalsRoutes.delete("/rentals/:id", deleteRental)

export default rentalsRoutes