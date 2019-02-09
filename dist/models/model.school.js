"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_1 = require("sequelize");
const util_database_1 = require("../utils/util.database");
exports.School = util_database_1.sequelize.define('schools', {
    nameTH: {
        type: sequelize_1.default.STRING,
        allowNull: false
    },
    nameEN: {
        type: sequelize_1.default.STRING,
        allowNull: false
    },
}, {
    underscored: false,
    underscoredAll: false
});
//# sourceMappingURL=model.school.js.map