module.exports = function QuizController(Quiz) {
  return {
    async create(req, res) {
      try {
        const quiz = await Quiz.create({
          title: req.body.title,
          description: req.body.description
        });
        res.status(201).send(quiz);
      } catch (error) {
        res.status(400).send(error);
      }
    },
    async list(req, res) {
      try {
        const quizzes = await Quiz.findAll();
        res.status(200).send(quizzes);
      } catch (error) {
        res.status(400).send(error);
      }
    },
    async retrieve(req, res) {
      try {
        const quiz = await Quiz.findByPk(req.params.id);
        if (!quiz) {
          return res.status(404).send({
            message: 'Quiz Not Found',
          });
        }
        res.status(200).send(quiz);
      } catch (error) {
        res.status(400).send(error);
      }
    },
    async update(req, res) {
      try {
        const quiz = await Quiz.findByPk(req.params.id);
        if (!quiz) {
          return res.status(404).send({
            message: 'Quiz Not Found',
          });
        }
        await quiz.update({
          title: req.body.title,
          description: req.body.description
        });
        res.status(200).send(quiz);
      } catch (error) {
        res.status(400).send(error);
      }
    },
    async destroy(req, res) {
      try {
        const quiz = await Quiz.findByPk(req.params.id);
        if (!quiz) {
          return res.status(404).send({
            message: 'Quiz Not Found',
          });
        }
        await quiz.destroy();
        res.status(200).send({
          message: 'Quiz deleted successfully',
        });
      } catch (error) {
        res.status(400).send(error);
        }
    }
    };
}