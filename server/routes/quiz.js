const { Router } = require("express");
const QuizController = require("../controllers/quiz");
const QuizService = require("../services/quiz");

const router = Router();
const quizService = QuizService();
const quizController = QuizController(quizService);

router.get("/", quizController.getAll);
router.get("/:id", quizController.getOne);
router.post("/", quizController.create);
router.patch("/:id", quizController.update);
router.delete("/:id", quizController.delete);

module.exports = router;
