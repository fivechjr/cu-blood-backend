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
    }
}, {
    underscored: false,
    underscoredAll: false
});
//# sourceMappingURL=model.time.js.map