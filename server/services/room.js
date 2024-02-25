const { Room, Quiz} = require("../models");
const Sequelize = require("sequelize");
const ValidationError = require("../errors/ValidationError");

module.exports = function RoomService() {
    return {
        findAll: async function (filters, options) {
            let dbOptions = {
                where: filters,
                include: [
                    {
                        model: Quiz,
                        as: "quizzes",
                    },
                ],
            };
            options.order = {createdAt: "DESC"}
            if (options.order) {
                dbOptions.order = Object.entries(options.order);
            }
            if (options.limit) {
                dbOptions.limit = options.limit;
                dbOptions.offset = options.offset;
            }
            return Room.findAll(dbOptions);
        },
        findOne: async function (filters) {
            let dbOptions = {
                where: filters,
                include: [
                    {
                        model: Quiz,
                        as: "quizzes",
                    },
                ],
            };
            
            return Room.findOne(dbOptions);
        },
        create: async function (room) {
        return Room.create(room);
        },
        update: async (filters, newData) => {
        try {
            const [nbUpdated, rooms] = await Room.update(newData, {
            where: filters,
            returning: true,
            individualHooks: true,
        });
        if (nbUpdated === 0) {
            throw new ValidationError("No room updated");
        }
        return rooms[0];
        } catch (error) {
            throw new ValidationError("Error while updating room", error);
        }
        },
        delete: async (filters) => {
        try {
            const nbDeleted = await Room.destroy({ where: filters });
            if (nbDeleted === 0) {
            throw new ValidationError("No room deleted");
            }
        } catch (error) {
            throw new ValidationError("Error while deleting room", error);
        }
        },
    };
}