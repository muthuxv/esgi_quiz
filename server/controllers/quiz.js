module.exports = function QuizController(QuizService) {
    return {
        getAll: async (req, res, next) => {
            const { page, itemsPerPage, order, ...filters } = req.query;
            try {
              const results = await QuizService.findAll(filters, {
                order,
                limit: itemsPerPage,
                offset: (page - 1) * itemsPerPage,
              });
      
              res.json(results);
            } catch (err) {
              next(err);
            }
        },
        getOne: async function (req, res, next) {
            try {
                const quiz = await QuizService.findOne(req.params);
                if (!quiz) {
                    return res.status(404).end();
                }
                res.status(200).json(quiz);
            } catch (e) {
                next(e);
            }
        },
        create: async function (req, res, next) {
            try {
                const quizData = req.body;
                const quiz = await QuizService.create(quizData);
                res.status(201).json(quiz);
            } catch (error) {
                console.error('Erreur lors de la création du quiz :', error);

                if (error.name === 'SequelizeDatabaseError') {
                    return res.status(400).json({ message: 'Erreur de base de données' });
                }

                next(error);
            }
        },
        update: async function (req, res, next) {
            try {
                const quizzes = await QuizService.update(req.params, req.body);
                if (quizzes.length === 0) {
                    return res.status(404).end();
                }
                res.status(200).json(quizzes[0]);
            } catch (e) {
                next(e);
            }
        },
        delete: async function (req, res, next) {
            try {
                const nbDeleted = await QuizService.delete(req.params);
                if (nbDeleted === 0) {
                    return res.status(404).end();
                }
                res.status(204).end();
            } catch (e) {
                next(e);
            }
        },
    };
}