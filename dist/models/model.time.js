"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_1 = require("sequelize");
const util_database_1 = require("../utils/util.database");
exports.Time = util_database_1.sequelize.define('times', {
    startTime: {
        type: sequelize_1.default.TIME,
        allowNull: false
    },
    endTime: {
        type: sequelize_1.default.TIME,
        allowNull: false
    },
    label: {
        type: sequelize_1.default.STRING,
        allowNull: false
    },
    sunday: { type: sequelize_1.default.INTEGER },
    monday: { type: sequelize_1.default.INTEGER },
    tuesday: { type: sequelize_1.default.INTEGER },
    wednesday: { type: sequelize_1.default.INTEGER },
    thursday: { type: sequelize_1.default.INTEGER },
    friday: { type: sequelize_1.default.INTEGER },
    saturday: { type: sequelize_1.default.INTEGER }
}, {
    underscored: false,
    underscoredAll: false
});
//# sourceMappingURL=model.time.js.map