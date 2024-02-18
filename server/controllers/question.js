module.exports = function QuestionController(QuestionService) {
    return {
        getAll: async (req, res, next) => {
            const { page, itemsPerPage, order, ...filters } = req.query;
            try {
              const results = await QuestionService.findAll(filters, {
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
                const question = await QuestionService.findOne(req.params);
                if (!question) {
                    return res.status(404).end();
                }
                res.status(200).json(question);
            } catch (e) {
                next(e);
            }
        },
        create: async function (req, res, next) {
            try {
                const question = await QuestionService.create(req.body);
                res.status(201).json(question);
            } catch (e) {
                next(e);
            }
        },
        update: async function (req, res, next) {
            try {
                const questions = await QuestionService.update(req.params, req.body);
                if (questions.length === 0) {
                    return res.status(404).end();
                }
                res.status(200).json(questions[0]);
            } catch (e) {
                next(e);
            }
        },
        delete: async function (req, res, next) {
            try {
                const nbDeleted = await QuestionService.delete(req.params);
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