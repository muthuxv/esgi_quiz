module.exports = function OptionController(OptionService) {
    return {
        getAll: async (req, res, next) => {
            const { page, itemsPerPage, order, ...filters } = req.query;
            try {
              const results = await OptionService.findAll(filters, {
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
                const option = await OptionService.findOne(req.params);
                if (!option) {
                    return res.status(404).end();
                }
                res.status(200).json(option);
            } catch (e) {
                next(e);
            }
        },
        create: async function (req, res, next) {
            try {
                const option = await OptionService.create(req.body);
                res.status(201).json(option);
            } catch (e) {
                next(e);
            }
        },
        update: async function (req, res, next) {
            try {
                const options = await OptionService.update(req.params, req.body);
                if (options.length === 0) {
                    return res.status(404).end();
                }
                res.status(200).json(options[0]);
            } catch (e) {
                next(e);
            }
        },
        delete: async function (req, res, next) {
            try {
                const nbDeleted = await OptionService.delete(req.params);
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