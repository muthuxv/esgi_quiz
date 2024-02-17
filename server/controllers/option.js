module.exports = function OptionController(Option) {
    return {
        async create(req, res) {
            try {
                const option = await Option.create(req.body);
                return res.status(201).send(option);
            } catch (error) {
                return res.status(400).send(error);
            }
        },
        async list(req, res) {
            try {
                const options = await Option.findAll();
                return res.status(200).send(options);
            } catch (error) {
                return res.status(400).send(error);
            }
        },
        async retrieve(req, res) {
            try {
                const option = await Option.findByPk(req.params.optionId);
                if (!option) {
                    return res.status(404).send({
                        message: 'Option Not Found',
                    });
                }
                return res.status(200).send(option);
            } catch (error) {
                return res.status(400).send(error);
            }
        },
        async update(req, res) {
            try {
                const option = await Option.findByPk(req.params.optionId);
                if (!option) {
                    return res.status(404).send({
                        message: 'Option Not Found',
                    });
                }
                await option.update(req.body);
                return res.status(200).send(option);
            } catch (error) {
                return res.status(400).send(error);
            }
        },
        async destroy(req, res) {
            try {
                const option = await Option.findByPk(req.params.optionId);
                if (!option) {
                    return res.status(404).send({
                        message: 'Option Not Found',
                    });
                }
                await option.destroy();
                return res.status(204).send();
            } catch (error) {
                return res.status(400).send(error);
            }
        },
    };
}