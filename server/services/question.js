const { Question } = require("../models");
const Sequelize = require("sequelize");
const ValidationError = require("../errors/ValidationError");

module.exports = function QuestionService() {
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
            return Question.findAll(dbOptions);
        },
        findOne: async function (filters) {
            return Question.findOne({ 
                where: filters,
            });
        },
        create: async function (question) {
            return Question.create(question);
        },
        update: async (filters, newData) => {
            try {
                const [nbUpdated, questions] = await Question.update(newData, {
                where: filters,
                returning: true,
                individualHooks: true,
                });
            
                return questions;
            } catch (e) {
                if (e instanceof Sequelize.ValidationError) {
                throw ValidationError.fromSequelizeValidationError(e);
                }
                throw e;
            }
        },
        delete: async function (filters) {
            return Question.destroy({
                where: filters
            });
        },
    };
}