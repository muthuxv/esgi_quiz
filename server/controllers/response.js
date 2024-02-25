module.exports = function ResponseController(ResponseService) {
    return {
        getAll: async (req, res, next) => {
            const { page, itemsPerPage, order, ...filters } = req.query;
            try {
              const results = await ResponseService.findAll(filters, {
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
                const response = await ResponseService.findOne(req.params);
                if (!response) {
                    return res.status(404).end();
                }
                res.status(200).json(response);
            } catch (e) {
                next(e);
            }
        },
        create: async function (req, res, next) {
            try {
                const response = await ResponseService.create(req.body);
                res.status(201).json(response);
            } catch (e) {
                next(e);
            }
        },
        update: async function (req, res, next) {
            try {
                const responses = await ResponseService.update(req.params, req.body);
                if (responses.length === 0) {
                    return res.status(404).end();
                }
                res.status(200).json(responses[0]);
            } catch (e) {
                next(e);
            }
        },
        delete: async function (req, res, next) {
            try {
                const nbDeleted = await ResponseService.delete(req.params);
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