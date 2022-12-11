import { Router } from "express"
import { categoriesValidation } from "../middlewares/categoriesValidation.middlewares.js"
import { getCategories, postCategories } from "../controllers/categories.controllers.js"

const categoriesRoutes = Router()

categoriesRoutes.get("/categories", getCategories)
categoriesRoutes.post("/categories", categoriesValidation, postCategories)

export default categoriesRoutes