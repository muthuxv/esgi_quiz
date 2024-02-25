const { Reponse } = require("../models");
const Sequelize = require("sequelize");
const ValidationError = require("../errors/ValidationError");

module.exports = function ResponseService() {
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
            return Reponse.findAll(dbOptions);
        },
        findOne: async function (filters) {
            return Reponse.findOne({ 
                where: filters,
            });
        },
        create: async function (response) {
            return Reponse.create(response);
        },
        update: async (filters, newData) => {
            try {
                const [nbUpdated, responses] = await Reponse.update(newData, {
                where: filters,
                returning: true,
                individualHooks: true,
                });
            
                return responses;
            } catch (e) {
                if (e instanceof Sequelize.ValidationError) {
                throw ValidationError.fromSequelizeValidationError(e);
                }
                throw e;
            }
        },
        delete: async function (filters) {
            return Reponse.destroy({
                where: filters
            });
        },
    };
}