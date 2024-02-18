const { Quiz, Question, Option } = require("../models");
const Sequelize = require("sequelize");
const ValidationError = require("../errors/ValidationError");

module.exports = function QuizService() {
    return {
        findAll: async function (filters, options) {
        let dbOptions = {
            where: filters,
            include: [
                {
                    model: Question,
                    as: "questions",
                    include: [
                        {
                            model: Option,
                            as: "options",
                        },
                    ],
                },
            ],
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
        return Quiz.findAll(dbOptions);
        },
        findOne: async function (filters) {
        return Quiz.findOne({ 
            where: filters,
        });
        },
        create: async function (quiz) {
        return Quiz.create(quiz);
        },
        update: async (filters, newData) => {
        try {
            const [nbUpdated, quizzes] = await Quiz.update(newData, {
            where: filters,
            returning: true,
            individualHooks: true,
            });
        
            return quizzes;
        } catch (e) {
            if (e instanceof Sequelize.ValidationError) {
            throw ValidationError.fromSequelizeValidationError(e);
            }
            throw e;
        }
        },
        delete: async function (filters) {
        return Quiz.destroy({
            where: filters
        });
        },
    };
}
