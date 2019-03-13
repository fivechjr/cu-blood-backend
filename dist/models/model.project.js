"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_1 = require("sequelize");
const util_database_1 = require("../utils/util.database");
exports.Project = util_database_1.sequelize.define('project', {
    name: { type: sequelize_1.default.STRING },
    registrationStartDate: { type: sequelize_1.default.DATE },
    registrationEndDate: { type: sequelize_1.default.DATE },
    startDate: { type: sequelize_1.default.DATE },
    endDate: { type: sequelize_1.default.DATE },
    revisionEndDate: { type: sequelize_1.default.DATE },
    passcode: { type: sequelize_1.default.STRING },
    totalVolume: { type: sequelize_1.default.INTEGER },
    firstEnrollmentCount: { type: sequelize_1.default.INTEGER },
    year: { type: sequelize_1.default.INTEGER }
}, {
    underscored: false,
    underscoredAll: false
});
//# sourceMappingURL=model.project.js.map