const { Router } = require("express");
const QuizController = require("../controllers/quiz");
const { Quiz } = require("../models");
const router = Router();
const quizController = QuizController(Quiz);

router.post("/", quizController.create);
router.get("/", quizController.list);
router.get("/:id", quizController.retrieve);
router.put("/:id", quizController.update);
router.delete("/:id", quizController.destroy);

module.exports = router;
