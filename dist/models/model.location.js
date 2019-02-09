"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_1 = require("sequelize");
const util_database_1 = require("../utils/util.database");
exports.Location = util_database_1.sequelize.define('location', {
    nameTH: { type: sequelize_1.default.STRING },
    nameEN: { type: sequelize_1.default.STRING },
    googleMapsURL: { type: sequelize_1.default.STRING },
    addressTH: { type: sequelize_1.default.TEXT },
    addressEN: { type: sequelize_1.default.TEXT },
}, {
    underscored: false,
    underscoredAll: false
});
//# sourceMappingURL=model.location.js.map