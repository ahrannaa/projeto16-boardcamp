import { Router } from "express"
import { getRentals, postRentals, finalizeRent, deleteRental } from "../controllers/rentals.controllers.js"

const rentalsRoutes = Router()

rentalsRoutes.get("/rentals", getRentals)
rentalsRoutes.post("/rentals", postRentals)
rentalsRoutes.post("/rentals/:id/return", finalizeRent)
rentalsRoutes.delete("/rentals/:id", deleteRental)

export default rentalsRoutes