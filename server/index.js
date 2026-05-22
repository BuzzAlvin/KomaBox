import express from "express";
import cors from "cors";
import mangaRoutes from "./routes/mangaRoutes.js";

const app = express();

app.use(cors());

app.use("/api", mangaRoutes);

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});