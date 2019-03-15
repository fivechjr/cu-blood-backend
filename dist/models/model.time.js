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
    isSunday: { type: sequelize_1.default.INTEGER },
    isMonday: { type: sequelize_1.default.INTEGER },
    isTuesday: { type: sequelize_1.default.INTEGER },
    isWednesday: { type: sequelize_1.default.INTEGER },
    isThursday: { type: sequelize_1.default.INTEGER },
    isFriday: { type: sequelize_1.default.INTEGER },
    isSaturday: { type: sequelize_1.default.INTEGER }
}, {
    underscored: false,
    underscoredAll: false
});
//# sourceMappingURL=model.time.js.map