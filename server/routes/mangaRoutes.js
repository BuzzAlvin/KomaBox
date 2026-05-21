import express from "express";
import { getHomepage, getChapters, getRecommendations, getMangaDetails, getMangaPages, getRandomManga, searchManga } from "../controllers/mangaController.js";

const router = express.Router();

router.get("/homepage", getHomepage);

router.get("/random-manga", getRandomManga);

router.get("/read/:chapterId", getMangaPages);

router.get("/chapters/:mangaId", getChapters);

router.get("/manga/:mangaId", getMangaDetails);

router.get("/recommendations/:mangaId", getRecommendations);

router.get("/search", searchManga);

export default router;