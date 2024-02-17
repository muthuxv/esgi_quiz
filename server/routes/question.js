const { Router } = require("express");
const QuestionController = require("../controllers/question");
const { Question } = require("../models");
const router = Router();
const questionController = QuestionController(Question);

router.post("/", questionController.create);
router.get("/", questionController.list);
router.get("/:questionId", questionController.retrieve);
router.put("/:questionId", questionController.update);
router.delete("/:questionId", questionController.destroy);

module.exports = router;