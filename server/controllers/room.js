module.exports = function RoomController(RoomService) {
    return {
        getAll: async (req, res, next) => {
            const { page, itemsPerPage, order, ...filters } = req.query;
            try {
              const results = await RoomService.findAll(filters, {
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
                const room = await RoomService.findOne(req.params);
                if (!room) {
                    return res.status(404).end();
                }
                res.status(200).json(room);
            } catch (e) {
                next(e);
            }
        },
        create: async function (req, res, next) {
            try {
                const room = await RoomService.create(req.body);
                res.status(201).json(room);
            } catch (e) {
                next(e);
            }
        },
        update: async function (req, res, next) {
            try {
                const rooms = await RoomService.update(req.params, req.body);
                if (rooms.length === 0) {
                    return res.status(404).end();
                }
                res.status(200).json(rooms[0]);
            } catch (e) {
                next(e);
            }
        },
        delete: async function (req, res, next) {
            try {
                const nbDeleted = await RoomService.delete(req.params);
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