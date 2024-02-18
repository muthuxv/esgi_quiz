const { User } = require("../models");
const Sequelize = require("sequelize");
const ValidationError = require("../errors/ValidationError");

module.exports = function UserService() {
    return {
        findAll: async function (filters, options) {
            let dbOptions = {
              where: filters,
            };
            options.order = {createdAt: "DESC"}
            if (options.order) {
              // => [["name", "ASC"], ["dob", "DESC"]]
              dbOptions.order = Object.entries(options.order);
            }
            if (options.limit) {
              dbOptions.limit = options.limit;
              dbOptions.offset = options.offset;
            }
            return User.findAll(dbOptions);
        },
        findOne: async function (filters) {
        return User.findOne({ 
            where: filters,
        });
        },
        create: async function (user) {
            return User.create(user);
        },
        update: async (filters, newData) => {
            try {
                const [nbUpdated, users] = await User.update(newData, {
                where: filters,
                returning: true,
                individualHooks: true,
                });
        
                return users;
            } catch (e) {
                if (e instanceof Sequelize.ValidationError) {
                throw ValidationError.fromSequelizeValidationError(e);
                }
                throw e;
            }
        },
        delete: async function (filters) {
            return User.destroy({
                where: filters
            });
        },
        login: async (login, password) => {
            const user = await User.findOne({ where: { login } });
            if (!user) {
                return null;
            }
            if (!user.isPasswordValid(password)) {
                return null;
            }
            return user;
        }
    }
}
