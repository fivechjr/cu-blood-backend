"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_1 = require("sequelize");
const util_database_1 = require("../utils/util.database");
const model_user_1 = require("./model.user");
const model_project_1 = require("./model.project");
const model_location_1 = require("./model.location");
const model_time_1 = require("./model.time");
exports.Session = util_database_1.sequelize.define('session', {
    id: {
        type: sequelize_1.default.UUID,
        defaultValue: sequelize_1.default.UUIDV4,
        primaryKey: true
    },
    timeSlot: { type: sequelize_1.default.DATEONLY },
    checkIn: { type: sequelize_1.default.DATE },
    checkOut: { type: sequelize_1.default.DATE },
    status: { type: sequelize_1.default.INTEGER },
    type: {
        type: sequelize_1.default.INTEGER,
        allowNull: false,
        defaultValue: 0,
        validate: { min: 0, max: 1 }
    }
}, {
    underscored: false,
    underscoredAll: false
});
exports.Session.belongsTo(model_user_1.User, { foreignKey: { allowNull: false }, onDelete: 'CASCADE' });
exports.Session.belongsTo(model_project_1.Project, { foreignKey: { allowNull: false }, onDelete: 'CASCADE' });
exports.Session.belongsTo(model_location_1.Location, { foreignKey: { allowNull: false }, onDelete: 'CASCADE' });
exports.Session.belongsTo(model_time_1.Time, { foreignKey: { allowNull: false }, onDelete: 'CASCADE' });
//# sourceMappingURL=model.session.js.map