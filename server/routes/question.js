const { Router } = require("express");
const QuestionController = require("../controllers/question");
const QuestionService = require("../services/question");

const router = Router();
const questionService = QuestionService();
const questionController = QuestionController(questionService);

router.get("/", questionController.getAll);
router.get("/:id", questionController.getOne);
router.post("/", questionController.create);
router.put("/:id", questionController.update);
router.delete("/:id", questionController.delete);

module.exports = router;