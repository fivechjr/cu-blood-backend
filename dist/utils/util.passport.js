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
const passport = require("passport");
const passportLocal = require("passport-local");
const model_user_1 = require("../models/model.user");
const util_response_1 = require("./util.response");
const util_database_1 = require("./util.database");
const model_school_1 = require("../models/model.school");
const LocalStrategy = passportLocal.Strategy;
passport.serializeUser((user, done) => {
    // console.log('[*]', user)
    done(undefined, user.uuid);
});
passport.deserializeUser((id, done) => __awaiter(this, void 0, void 0, function* () {
    try {
        let options = {
            where: {
                uuid: id
            },
            include: [model_school_1.School]
        };
        let user = yield model_user_1.User.findOne(options);
        if (user) {
            done(undefined, util_response_1.toUserEntity(user.toJSON(), true));
        }
        else {
            return done(undefined, false);
        }
    }
    catch (e) {
        return done(e);
    }
}));
passport.use(new LocalStrategy((username, password, done) => __awaiter(this, void 0, void 0, function* () {
    try {
        let options = {
            where: {
                [util_database_1.sequelize.Op.or]: [{ username: username.toLowerCase() }, { studentId: username.toLowerCase() }]
            },
            include: [model_school_1.School]
        };
        let user = yield model_user_1.User.findOne(options);
        if (!user) {
            return done(undefined, false, { message: 'User not found' });
        }
        else {
            try {
                let verify = yield user.verifyPassword(password);
                if (verify) {
                    return done(undefined, util_response_1.toUserEntity(user.toJSON()));
                }
                else {
                    return done(undefined, false, { message: 'Invalid credentials' });
                }
            }
            catch (e) {
                return done(e);
            }
        }
    }
    catch (e) {
        let { name } = e;
        return done({ name });
    }
})));
//# sourceMappingURL=util.passport.js.map