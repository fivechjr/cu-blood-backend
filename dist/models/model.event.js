"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_1 = require("sequelize");
const util_database_1 = require("../utils/util.database");
exports.Event = util_database_1.sequelize.define('event', {
    title: { type: sequelize_1.default.STRING },
    body: { type: sequelize_1.default.TEXT },
    location: { type: sequelize_1.default.STRING },
    displayImage: { type: sequelize_1.default.STRING },
    startDate: { type: sequelize_1.default.DATE },
    endDate: { type: sequelize_1.default.DATE },
}, {
    underscored: false,
    underscoredAll: false
});
//# sourceMappingURL=model.event.js.map