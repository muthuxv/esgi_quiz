module.exports = function QuestionController(Question) {
    return {
        async create(req, res) {
        try {
            const question = await Question.create(req.body);
            return res.status(201).send(question);
        } catch (error) {
            return res.status(400).send(error);
        }
        },
        async list(req, res) {
        try {
            const questions = await Question.findAll();
            return res.status(200).send(questions);
        } catch (error) {
            return res.status(400).send(error);
        }
        },
        async retrieve(req, res) {
        try {
            const question = await Question.findByPk(req.params.questionId);
            if (!question) {
            return res.status(404).send({
                message: 'Question Not Found',
            });
            }
            return res.status(200).send(question);
        } catch (error) {
            return res.status(400).send(error);
        }
        },
        async update(req, res) {
        try {
            const question = await Question.findByPk(req.params.questionId);
            if (!question) {
            return res.status(404).send({
                message: 'Question Not Found',
            });
            }
            await question.update(req.body);
            return res.status(200).send(question);
        } catch (error) {
            return res.status(400).send(error);
        }
        },
        async destroy(req, res) {
        try {
            const question = await Question.findByPk(req.params.questionId);
            if (!question) {
            return res.status(404).send({
                message: 'Question Not Found',
            });
            }
            await question.destroy();
            return res.status(204).send();
        } catch (error) {
            return res.status(400).send(error);
        }
        },
    };
}