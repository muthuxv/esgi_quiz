const { v4: uuidv4 } = require("uuid");
const { isUUID } = require("validator");

module.exports = function UserController(User) {
  return {
    async create(req, res) {
      try {
        const user = await User.create({
          id: uuidv4(),
          login: req.body.login,
          email: req.body.email,
          password: req.body.password
        });
        res.status(201).send(user);
      } catch (error) {
        res.status(400).send(error);
      }
    },
    async list(req, res) {
      try {
        const users = await User.findAll();
        res.status(200).send(users);
      } catch (error) {
        res.status(400).send(error);
      }
    },
    async retrieve(req, res) {
      try {
        if (!isUUID(req.params.id)) {
          return res.status(400).send({
            message: 'Invalid UUID',
          });
        }
        const user = await User.findByPk(req.params.id);
        if (!user) {
          return res.status(404).send({
            message: 'User Not Found',
          });
        }
        res.status(200).send(user);
      }
        catch (error) {
            res.status
        }
    },
    async update(req, res) {
      try {
        if (!isUUID(req.params.id)) {
          return res.status(400).send({
            message: 'Invalid UUID',
          });
        }
        const user = await User.findByPk(req.params.id);
        if (!user) {
          return res.status(404).send({
            message: 'User Not Found',
          });
        }
        await user.update({
          login: req.body.login,
          email: req.body.email,
          password: req.body.password,
          role: req.body.role
        });
        res.status(200).send(user);
      }
        catch (error) {
            res.status(400).send
        }
    },
    async destroy(req, res) {
        try {
            if (!isUUID(req.params.id)) {
            return res.status(400).send({
                message: 'Invalid UUID',
            });
            }
            const user = await User.findByPk(req.params.id);
            if (!user) {
            return res.status(404).send({
                message: 'User Not Found',
            });
            }
            await user.destroy();
            res.status(204).send();
        } catch (error) {
            res.status(400).send(error);
        }
    }
  };
}