"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_1 = require("sequelize");
const v4_1 = require("uuid/v4");
const bcrypt = require("bcrypt");
const util_database_1 = require("../utils/util.database");
const model_school_1 = require("./model.school");
const User = util_database_1.sequelize.define('user', {
    id: {
        type: sequelize_1.default.INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true
    },
    uuid: {
        type: sequelize_1.default.UUID
    },
    firstName: { type: sequelize_1.default.STRING },
    lastName: { type: sequelize_1.default.STRING },
    nickname: { type: sequelize_1.default.STRING },
    gender: { type: sequelize_1.default.INTEGER },
    bloodType: { type: sequelize_1.default.INTEGER },
    birthday: { type: sequelize_1.default.DATEONLY },
    address: {
        type: sequelize_1.default.TEXT
    },
    username: {
        type: sequelize_1.default.STRING,
    },
    password: { type: sequelize_1.default.STRING },
    medicalCondition: { type: sequelize_1.default.STRING },
    studentId: {
        type: sequelize_1.default.STRING,
    },
    weight: { type: sequelize_1.default.INTEGER },
    phoneNumber: { type: sequelize_1.default.STRING },
    status: { type: sequelize_1.default.INTEGER },
    shirtSize: { type: sequelize_1.default.INTEGER },
    onboarding: {
        type: sequelize_1.default.INTEGER,
        allowNull: false,
        defaultValue: -1,
        validate: { min: -1, max: 1 }
    },
    nationality: {
        type: sequelize_1.default.INTEGER,
        allowNull: true,
        validate: { min: 0, max: 1 }
    },
    academicYear: {
        type: sequelize_1.default.INTEGER,
        allowNull: true,
        validate: { min: 0, max: 8 }
    },
    isDonated: {
        type: sequelize_1.default.INTEGER,
        allowNull: true,
        validate: { min: 0, max: 1 }
    },
    isEnrolled: {
        type: sequelize_1.default.INTEGER,
        allowNull: true,
        validate: { min: 0, max: 1 }
    }
}, {
    underscored: false,
    underscoredAll: false,
    indexes: [
        {
            unique: true,
            fields: ['uuid']
        },
        {
            unique: true,
            fields: ['username']
        },
        {
            unique: true,
            fields: ['studentId']
        }
    ],
    hooks: {
        beforeCreate: function (user) {
            return __awaiter(this, void 0, void 0, function* () {
                const salt = yield bcrypt.genSalt(12);
                const hash = yield bcrypt.hash(user.password, salt);
                user.username = user.username.toLowerCase();
                user.password = hash;
                user.uuid = v4_1.v4();
            });
        },
        beforeUpdate: function (user) {
            return __awaiter(this, void 0, void 0, function* () {
                if (user.changed('password') && user.password != null) {
                    const salt = yield bcrypt.genSalt(12);
                    const hash = yield bcrypt.hash(user.password, salt);
                    user.password = hash;
                }
                if (user.changed('username') && user.password != null) {
                    user.username = user.username.toLowerCase();
                }
            });
        }
    }
});
exports.User = User;
User.prototype.verifyPassword = function (candidatePassword) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            let res = yield bcrypt.compare(candidatePassword, this.password, null);
            return res;
        }
        catch (e) {
            return false;
        }
    });
};
User.belongsTo(model_school_1.School, { foreignKey: { allowNull: false }, onDelete: 'CASCADE' });
//# sourceMappingURL=model.user.js.map