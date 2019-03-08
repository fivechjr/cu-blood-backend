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
const express_1 = require("express");
const passport = require("passport");
const check_1 = require("express-validator/check");
const model_session_1 = require("../models/model.session");
const model_project_1 = require("../models/model.project");
const model_user_1 = require("../models/model.user");
const util_response_1 = require("../utils/util.response");
const util_validation_1 = require("../utils/util.validation");
const md_is_authenticated_1 = require("../middlewares/md.is-authenticated");
const md_is_internal_request_1 = require("../middlewares/md.is-internal-request");
require("../utils/util.passport");
const moment = require("moment");
const model_time_1 = require("../models/model.time");
const chalk_1 = require("chalk");
const util_passcode_1 = require("../utils/util.passcode");
class Routes {
    constructor() {
        this.router = express_1.Router();
    }
    bootstrap() {
        this.router.post('/login', [
            check_1.body('username').not().isEmpty().trim().escape(),
            check_1.body('password').not().isEmpty().trim().escape(),
            util_validation_1.isValidated
        ], (req, res, next) => {
            passport.authenticate("local", (err, user, info) => {
                if (err) {
                    util_response_1.apiResponse(res, 500, err);
                    return;
                }
                if (!user) {
                    console.log('[-]', info);
                    util_response_1.apiResponse(res, 401, null, info.message);
                    return;
                }
                req.logIn(user, (err) => {
                    if (err) {
                        console.log('[-]', err);
                        util_response_1.apiResponse(res, 401, err);
                        return;
                    }
                    util_response_1.apiResponse(res, 200, util_response_1.toUserEntity(user));
                    return;
                });
            })(req, res, next);
        });
        this.router.post('/logout', (req, res) => {
            req.logout();
            req.session.destroy(function (err) {
                if (err) {
                    util_response_1.apiResponse(res, 500, err);
                }
                util_response_1.apiResponse(res, 205);
            });
        });
        // this.router.post('/logout/redirect', (req: PassportRequestEntity, res: Response) => {
        //     req.logout()
        //     req.session.destroy(function (err) {
        //         if (err) {
        //             apiResponse(res, 500, err)
        //         }
        //         res.redirect('/v0/profile/logout/callback')
        //     })
        // })
        // this.router.get('/logout/callback', (req: PassportRequestEntity, res: Response) => {
        //     if (req.isAuthenticated()) {
        //         apiResponse(res, 500, null, "You 're supposed to be unauthenticated!")
        //     } else {
        //         apiResponse(res, 205)
        //     }
        // })
        this.router.post('/create-account', [
            check_1.body('firstName').not().isEmpty().trim().escape(),
            check_1.body('lastName').not().isEmpty().trim().escape(),
            check_1.body('nickname').not().isEmpty().trim().escape(),
            check_1.body('gender').not().isEmpty().trim().escape(),
            check_1.body('bloodType').not().isEmpty().trim().escape(),
            check_1.body('birthday').not().isEmpty().trim().escape(),
            check_1.body('username').not().isEmpty().trim().escape(),
            check_1.body('password').not().isEmpty().trim().escape(),
            check_1.body('phoneNumber').not().isEmpty().trim().escape(),
            check_1.body('weight').not().isEmpty().trim().escape(),
            check_1.body('medicalCondition').not().isEmpty().trim().escape(),
            check_1.body('status').not().isEmpty().trim().escape(),
            check_1.body('shirtSize').not().isEmpty().trim().escape(),
            check_1.body('nationality').not().isEmpty().trim().escape(),
            check_1.body('isDonated').not().isEmpty().trim().escape(),
            check_1.body('isEnrolled').not().isEmpty().trim().escape(),
            check_1.body('academicYear').not().isEmpty().trim().escape(),
            check_1.body('schoolId').not().isEmpty().trim().escape(),
            util_validation_1.isValidated
        ], (req, res) => __awaiter(this, void 0, void 0, function* () {
            try {
                // let count = await User.count({
                //     where: {
                //         [sequelize.Op.or]: [{username: (req.body.username).toLowerCase()}, {studentId: String(req.body.studentId).toLowerCase()}]
                //     }
                // })
                // if (count > 0) {
                //     apiResponse(res, 400)
                //     return
                // }
                let data = yield model_user_1.User.create(req.body);
                // console.log(data)
                util_response_1.apiResponse(res, 200);
                return;
            }
            catch (e) {
                console.log(e);
                util_response_1.apiResponse(res, 500);
            }
        }));
        this.router.post('/forget-password', (req, res) => {
            util_response_1.apiResponse(res);
        });
        this.router.get('/me', [
            md_is_authenticated_1.isAuthenticated
        ], (req, res) => {
            // console.log('[*]', req.user)
            util_response_1.apiResponse(res, 200, util_response_1.toUserEntity(req.user));
        });
        this.router.put('/me/update', [
            md_is_authenticated_1.isAuthenticated,
            util_validation_1.isValidated
        ], (req, res) => __awaiter(this, void 0, void 0, function* () {
            try {
                if (req.body && req.body.studentId) {
                    req.body.studentId = String(req.body.studentId);
                }
                // if (req.body.studentId != req.user.studentId || req.body.username != req.user.username) {
                //     let studentId = (req.body.studentId != req.user.studentId) ? '' : req.body.studentId
                //     let username = req.body.username ? '' : req.body.username
                //     let count = await User.count({
                //         where: {
                //             [sequelize.Op.or]: [{username: (req.body.username).toLowerCase()}, {studentId: String(req.body.studentId).toLowerCase()}]
                //         }
                //     })
                //     if (count > 0) {
                //         apiResponse(res, 400)
                //         return
                //     }
                // }
                let options = {
                    where: {
                        id: req.user.id
                    },
                    individualHooks: true
                };
                let data = yield model_user_1.User.update(req.body, options);
                util_response_1.apiResponse(res, 200);
                return;
            }
            catch (e) {
                util_response_1.apiResponse(res, 400);
            }
        }));
        this.router.get('/me/sessions', [
            md_is_authenticated_1.isAuthenticated
        ], (req, res) => __awaiter(this, void 0, void 0, function* () {
            try {
                let userId = req.user.id;
                let options = {
                    where: {
                        userId: userId
                    },
                    include: [model_project_1.Project, model_time_1.Time]
                };
                let data = yield model_session_1.Session.findAll(options);
                if (data.length > 0)
                    util_response_1.apiResponse(res, 200, data.map(d => util_response_1.toSessionEntity(d)));
                else
                    util_response_1.apiResponse(res, 404);
            }
            catch (e) {
                console.log('[-]', e);
                util_response_1.apiResponse(res, 500, e);
            }
        }));
        this.router.put('/me/enroll', [
            md_is_authenticated_1.isAuthenticated,
            check_1.body('sessionId').isUUID(4),
            check_1.body('locationId').isInt(),
            check_1.body('timeSlot').isISO8601(),
            check_1.body('timeId').isInt(),
            util_validation_1.isValidated
        ], (req, res) => __awaiter(this, void 0, void 0, function* () {
            let sessionId = req.body.sessionId;
            let locationId = req.body.locationId;
            let timeSlot = moment(req.body.timeSlot).utcOffset('420');
            let timeId = req.body.timeId;
            try {
                let sessionOptions = {
                    where: {
                        id: sessionId
                    }
                };
                let session = yield model_session_1.Session.findOne(sessionOptions);
                if (session === 1) {
                    // console.log('[-] session === null', session)
                    util_response_1.apiResponse(res, 400);
                    return;
                }
                let projectOptions = {
                    where: {
                        id: session.projectId
                    }
                };
                let project = yield model_project_1.Project.findOne(projectOptions);
                if (project === null) {
                    // console.log('[-] project === null', project)
                    util_response_1.apiResponse(res, 400);
                    return;
                }
                let startDate = moment(project.startDate).utcOffset('420');
                let endDate = moment(project.endDate).utcOffset('420');
                if (timeSlot.isBetween(startDate, endDate, 'days', '[]')) {
                    let options = {
                        where: {
                            id: sessionId
                        }
                    };
                    let data = yield model_session_1.Session.update({ locationId, timeSlot, timeId }, options);
                    util_response_1.apiResponse(res, 200);
                    return;
                }
                else {
                    // console.log('[-] timeSlot isBetween')
                    util_response_1.apiResponse(res, 400);
                    return;
                }
            }
            catch (e) {
                console.log('[-]', e);
                util_response_1.apiResponse(res, 500);
                return;
            }
        }));
        this.router.post('/me/enroll', [
            md_is_authenticated_1.isAuthenticated,
            check_1.body('projectId').isInt(),
            check_1.body('locationId').isInt(),
            check_1.body('timeId').isInt(),
            check_1.body('timeSlot').isISO8601(),
            util_validation_1.isValidated
        ], (req, res) => __awaiter(this, void 0, void 0, function* () {
            let projectId = req.body.projectId;
            let timeId = req.body.timeId;
            let userId = req.user.id;
            let now = moment().utcOffset('420');
            try {
                let options = {
                    where: {
                        id: projectId
                    }
                };
                let timeOptions = {
                    where: {
                        id: timeId
                    }
                };
                let data = yield model_project_1.Project.findOne(options);
                let timeData = yield model_time_1.Time.count(timeOptions);
                if (data != null && timeData > 0) {
                    let locationId = req.body.locationId;
                    let timeSlot = moment(req.body.timeSlot).utcOffset('420');
                    let startDate = moment(data.startDate).utcOffset('420');
                    let endDate = moment(data.endDate).utcOffset('420');
                    let registrationStartDate = moment(data.registrationStartDate).utcOffset('420');
                    let registrationEndDate = moment(data.registrationEndDate).utcOffset('420');
                    let isRegisteringInRegistrationSlot = now.isBetween(registrationStartDate, registrationEndDate, 'days', '[]');
                    if (isRegisteringInRegistrationSlot || md_is_internal_request_1.verifyInternalRequest(req) || util_passcode_1.verifyPasscode(data.passcode, req, res)) {
                        if (timeSlot.isBetween(startDate, endDate, 'days', '[]')) {
                            try {
                                let options = {
                                    where: {
                                        userId,
                                        projectId
                                    }
                                };
                                let model = {
                                    timeSlot,
                                    locationId,
                                    userId,
                                    projectId,
                                    timeId
                                };
                                let check = yield model_session_1.Session.count(options);
                                if (check > 0) {
                                    console.log('[-] check > 0', check);
                                    util_response_1.apiResponse(res, 400);
                                    return;
                                }
                                let session = yield model_session_1.Session.create(model);
                                session.project = yield session.getProject();
                                session.time = yield session.getTime();
                                util_response_1.apiResponse(res, 200, util_response_1.toSessionEntity(session));
                                return;
                            }
                            catch (e) {
                                console.log(chalk_1.default.bgRed('ERROR'));
                                console.log(e);
                                util_response_1.apiResponse(res, 500);
                                return;
                            }
                        }
                        else {
                            console.log('[-] timeSlot isBetween');
                            util_response_1.apiResponse(res, 400);
                            return;
                        }
                    }
                    else {
                        console.log('[-] now isBetween (registrationDate)');
                        util_response_1.apiResponse(res, 400);
                        return;
                    }
                }
                else {
                    console.log('[-] project === null || timeData < 0');
                    util_response_1.apiResponse(res, 400);
                    return;
                }
            }
            catch (e) {
                console.log('[-]', e);
                util_response_1.apiResponse(res, 500);
                return;
            }
        }));
        return this.router;
    }
}
exports.default = (new Routes()).bootstrap();
//# sourceMappingURL=route.profile.js.map