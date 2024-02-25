const { Option } = require("../models");
const Sequelize = require("sequelize");
const ValidationError = require("../errors/ValidationError");

module.exports = function OptionService() {
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
            return Option.findAll(dbOptions);
        },
        findOne: async function (filters) {
            return Option.findOne({ 
                where: filters,
            });
        },
        create: async function (option) {
            return Option.create(option);
        },
        update: async (filters, newData) => {
            try {
                const [nbUpdated, options] = await Option.update(newData, {
                where: filters,
                returning: true,
                individualHooks: true,
                });
            
                return options;
            } catch (e) {
                if (e instanceof Sequelize.ValidationError) {
                throw ValidationError.fromSequelizeValidationError(e);
                }
                throw e;
            }
        },
        delete: async function (filters) {
            return Option.destroy({
                where: filters
            });
        },
    };
}