import { Router } from "express"
import { gamesValidation } from "../middlewares/gamesValidation.middlewares.js"
import { getGames,postGames } from "../controllers/games.controllers.js"

const gamesRoutes = Router()

gamesRoutes.get("/games", getGames)
gamesRoutes.post("/games", gamesValidation, postGames)

export default gamesRoutes