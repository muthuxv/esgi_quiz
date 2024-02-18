const { v4: uuidv4 } = require("uuid");
const { isUUID } = require("validator");

module.exports = function UserController(UserService) {
  return {
    getAll: async (req, res, next) => {
      const { page, itemsPerPage, order, ...filters } = req.query;
      try {
        const results = await UserService.findAll(filters, {
          order,
          limit: itemsPerPage,
          offset: (page - 1) * itemsPerPage,
        });

        res.json(results);
      } catch (err) {
        next(err);
      }
    },
    getOne: async (req, res, next) => {
      try {
        const user = await UserService.findOne({ id: req.params.id });
        if (!user) {
          return res.status(404).json({ error: "Utilisateur non trouvé." });
        }
        res.status(200).json(user);
      } catch (err) {
        next(err);
      }
    },
    create: async (req, res, next) => {
      try {
        const user = req.body;
        user.id = uuidv4();
        const createdUser = await UserService.create(user);
        res.status(201).json(createdUser);
      } catch (err) {
        next(err);
      }
    },
    update: async (req, res, next) => {
      try {
        const user = req.body;
        if (!isUUID(req.params.id)) {
          return res.status(400).json({ error: "L'identifiant est invalide." });
        }
        const updatedUser = await UserService.update({ id: req.params.id }, user);
        if (!updatedUser) {
          return res.status(404).json({ error: "Utilisateur non trouvé." });
        }
        res.status(200).json(updatedUser);
      } catch (err) {
        next(err);
      }
    },
    delete: async (req, res, next) => {
      try {
        if (!isUUID(req.params.id)) {
          return res.status(400).json({ error: "L'identifiant est invalide." });
        }
        const deletedUser = await UserService.delete({ id: req.params.id });
        if (!deletedUser) {
          return res.status(404).json({ error: "Utilisateur non trouvé." });
        }
        res.status(204).end();
      } catch (err) {
        next(err);
      }
    },
  };
}