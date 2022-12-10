import { Router } from "express"
import { getCategories, postCategories } from "../controllers/categories.controllers.js"

const categoriesRoutes = Router()

categoriesRoutes.get("/categories", getCategories)
categoriesRoutes.post("/categories", postCategories)

export default categoriesRoutes