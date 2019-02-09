"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_1 = require("sequelize");
const util_database_1 = require("../utils/util.database");
exports.Announcement = util_database_1.sequelize.define('announcement', {
    title: { type: sequelize_1.default.STRING },
    body: { type: sequelize_1.default.TEXT },
    displayImage: { type: sequelize_1.default.STRING }
}, {
    underscored: false,
    underscoredAll: false
});
//# sourceMappingURL=model.announcement.js.map