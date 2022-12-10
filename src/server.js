import express from "express";
import cors from "cors";
import categoriesRoutes from "./routes/categories.routes.js";
import dotenv from "dotenv";
dotenv.config()


const app = express();
app.use(cors())
app.use(express.json())
app.use(categoriesRoutes)

const port = process.env.PORT || 4000;
app.listen(port, () => console.log(`Server running in port ${port}`))