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
const model_project_1 = require("../models/model.project");
const util_facebook_1 = require("../utils/util.facebook");
const util_response_1 = require("../utils/util.response");
const md_is_cached_1 = require("../middlewares/md.is-cached");
const model_session_1 = require("../models/model.session");
const util_validation_1 = require("../utils/util.validation");
const check_1 = require("express-validator/check");
const util_database_1 = require("../utils/util.database");
const moment = require("moment");
const model_user_1 = require("../models/model.user");
const model_location_1 = require("../models/model.location");
const model_school_1 = require("../models/model.school");
const model_time_1 = require("../models/model.time");
const flatten = require("flat");
const json2csv_1 = require("json2csv");
const basicAuth = require("express-basic-auth");
const util_time_1 = require("../utils/util.time");
class Routes {
    constructor() {
        this.router = express_1.Router();
    }
    bootstrap() {
        this.router.get('/', [
            md_is_cached_1.isCached
        ], (req, res) => __awaiter(this, void 0, void 0, function* () {
            try {
                let enumerateDaysBetweenDates = (startDate, endDate) => {
                    let dates = [];
                    let now = moment().startOf('day');
                    let currDate = now.isAfter(moment(startDate).startOf('day')) ? now : moment(startDate).startOf('day');
                    if (now.isAfter(moment(endDate).endOf('day'))) {
                        return dates;
                    }
                    let lastDate = moment(endDate).endOf('day');
                    dates.push(currDate.clone().format());
                    while (currDate.add(1, 'days').diff(lastDate) <= 0) {
                        dates.push(currDate.clone().format());
                    }
                    return dates;
                };
                let projectOptions = {
                    attributes: ['id', 'name', 'registrationStartDate', 'registrationEndDate', 'revisionEndDate', 'startDate', 'endDate', 'totalVolume', 'firstEnrollmentCount', 'year'],
                    order: [['id', 'DESC']],
                    limit: 1
                };
                let locationOptions = {
                    attributes: ['id', 'nameTH', 'nameEN', 'googleMapsURL', 'addressTH', 'addressEN'],
                    order: [['id', 'ASC']],
                };
                let schoolOptions = {
                    attributes: ['id', 'nameTH', 'nameEN'],
                    order: [['id', 'ASC']],
                };
                let timeOptions = {
                    attributes: ['id', 'startTime', 'endTime', 'label', 'isSunday', 'isMonday', 'isTuesday', 'isWednesday', 'isThursday', 'isFriday', 'isSaturday'],
                    order: [['id', 'ASC']],
                };
                let data = yield model_project_1.Project.findAll(projectOptions);
                let locations = yield model_location_1.Location.findAll(locationOptions);
                let schools = yield model_school_1.School.findAll(schoolOptions);
                let times = yield model_time_1.Time.findAll(timeOptions);
                let result = data[0].toJSON();
                // let firstTimeEnrollmentCount = await sequelize.query('SELECT COUNT(*) FROM (SELECT sessions."projectId", sessions."userId" FROM sessions GROUP BY 1, sessions."userId" HAVING COUNT(*) = 1) AS s WHERE s."projectId" = ' + result.id, { type: sequelize.QueryTypes.SELECT })
                let popularTimes = yield util_database_1.sequelize.query('SELECT count(sessions.id) as count, times.id, times."label", times."startTime", times."endTime" FROM sessions LEFT JOIN times ON times.id = sessions."timeId" WHERE sessions."projectId" = ' + result.id + ' GROUP BY times.id', { type: util_database_1.sequelize.QueryTypes.SELECT });
                popularTimes.forEach((v, i) => {
                    popularTimes[i].count = Number(v.count);
                });
                result.statistics = {
                    // firstTimeEnrollmentCount: Number(firstTimeEnrollmentCount[0].count),
                    popularTimes
                };
                result.locations = locations;
                result.schools = schools;
                result.startDate = moment(result.startDate).utcOffset(420).format();
                result.endDate = moment(result.endDate).utcOffset(420).format();
                result.registrationStartDate = moment(result.registrationStartDate).utcOffset(420).format();
                result.registrationEndDate = moment(result.registrationEndDate).utcOffset(420).format();
                result.revisionEndDate = moment(result.revisionEndDate).utcOffset(420).format();
                result.timeSlots = enumerateDaysBetweenDates(result.startDate, result.endDate);
                result.times = times;
                if (data.length > 0)
                    util_response_1.apiResponse(res, 200, result, null, false, req.cacheKey, 60);
                else
                    util_response_1.apiResponse(res, 404);
            }
            catch (e) {
                console.log(e);
                util_response_1.apiResponse(res, 500);
            }
        }));
        // this.router.post('/passcode', [
        //     body('passcode').not().isEmpty(),
        //     isValidated
        // ], async (req: PassportRequestEntity, res: Response) => {
        //     let projectOptions = {
        //         attributes: ['id', 'passcode'],
        //         order: [['id', 'DESC']],
        //         limit: 1
        //     }
        // })
        this.router.get('/insights/reports/:projectId', [
            // isInternalRequest,
            basicAuth({
                users: { 'root': process.env.API_KEY },
                challenge: true,
                realm: 'Insights',
            }),
            check_1.param('projectId').isInt().not().isEmpty(),
            util_validation_1.isValidated
        ], (req, res) => __awaiter(this, void 0, void 0, function* () {
            // console.log('[*]', req.params.projectId)
            // apiResponse(res, 200)
            let project = yield model_project_1.Project.findOne({
                where: {
                    id: req.params.projectId
                }
            });
            let data = yield model_session_1.Session.findAll({
                where: {
                    projectId: req.params.projectId
                },
                include: [{
                        model: model_user_1.User,
                        include: [model_school_1.School]
                    }, model_location_1.Location, model_time_1.Time]
            });
            let d = data.map(d => d.toJSON());
            // console.log('[*]', d)
            const getGender = (g) => {
                return {
                    0: 'M',
                    1: 'F'
                }[g];
            };
            const getBooleanString = (b) => {
                return {
                    0: 'NO',
                    1: 'YES'
                }[b];
            };
            const getTime = (t) => {
                return `${t.startTime} - ${t.endTime} (${t.label})`;
            };
            const getLocationName = (l) => {
                return l.nameTH;
            };
            const getSchoolName = (s) => {
                return s.nameTH;
            };
            const getNationality = (n) => {
                return {
                    0: 'Thai',
                    1: 'Foreigner'
                }[n];
            };
            // console.log('[*] d', d)
            d.forEach(z => {
                // delete z.id
                delete z.projectId;
                delete z.locationId;
                delete z.userId;
                delete z.timeId;
                delete z.user.uuid;
                delete z.user.schoolId;
                delete z.user.onboarding;
                z.user = util_response_1.toUserEntity(z.user, false);
                z.user.nationality = getNationality(z.user.nationality);
                z.user.bloodType = util_response_1.getBloodType(z.user.bloodType);
                z.user.school = getSchoolName(z.user.school);
                z.user.gender = getGender(z.user.gender);
                z.user.isDonated = getBooleanString(z.user.isDonated);
                z.user.isEnrolled = getBooleanString(z.user.isEnrolled);
                z.location = getLocationName(z.location);
                z.time = getTime(z.time);
                z.checkIn = util_time_1.utcOffset(z.checkIn);
                z.checkOut = util_time_1.utcOffset(z.checkOut);
                z.createdAt = util_time_1.utcOffset(z.createdAt);
                z.updatedAt = util_time_1.utcOffset(z.updatedAt);
            });
            let result = d.map(z => flatten(z));
            const csv = json2csv_1.parse(result);
            // console.log(csv)
            // apiResponse(res, 200, result)
            res.attachment(`${Date.now()} - ${req.params.projectId} - ${project.name} (${util_time_1.utcOffset(project.startDate)} - ${util_time_1.utcOffset(project.endDate)}).csv`);
            res.type('txt/csv');
            res.send(csv);
            res.end();
        }));
        this.router.get('/insights/blood-types/:year', [
            md_is_cached_1.isCached,
            check_1.param('year').isInt().not().isEmpty(),
            util_validation_1.isValidated
        ], (req, res) => __awaiter(this, void 0, void 0, function* () {
            util_database_1.sequelize.query('SELECT users."bloodType", count(sessions.id) as count FROM users LEFT JOIN sessions ON users.id = sessions."userId" WHERE EXTRACT(year FROM sessions."checkOut") = ? AND sessions."status" = 1 GROUP BY 1, users."bloodType"', { replacements: [req.params.year], type: util_database_1.sequelize.QueryTypes.SELECT }).then(d => {
                // console.log(chalk.bgYellow(d))
                util_response_1.apiResponse(res, 200, d, null, false, req.cacheKey, 60);
            }).catch(e => {
                console.log(e);
                util_response_1.apiResponse(res, 400);
            });
        }));
        // this.router.get('/insights/blood-types', [
        //     isCached
        // ], async (req: PassportRequestEntity, res: Response) => {
        //     let options: any = (a, b) => {
        //         return {
        //             where: {
        //                 bloodType: {
        //                     [sequelize.Op.or]: [a, b]
        //                 }
        //             }
        //         }
        //     }
        //     let A = await User.count(options(0, 1))
        //     let B = await User.count(options(2, 3))
        //     let O = await User.count(options(4, 5))
        //     let AB = await User.count(options(6, 7))
        //     let ret = {
        //         A, B, O, AB
        //     }
        //     apiResponse(res, 200, ret, null, false, req.cacheKey, 60)
        // })
        // this.router.get('/insights/sessions/:startDate/:unitOfMeasurement/:duration/:status', [
        //     isCached,
        //     param('startDate').isISO8601(),
        //     param('unitOfMeasurement').isIn(['years', 'months', 'weeks', 'days']),
        //     param('duration').isInt(),
        //     param('status').isIn(['all', '0', '1', '2', '3']),
        //     isValidated
        // ], async (req: PassportRequestEntity, res: Response) => {
        //     try {
        //         let status = req.params.status
        //         let startDate = moment(req.params.startDate).startOf('day').format()
        //         let unitOfMeasurement = req.params.unitOfMeasurement
        //         let duration = Number(req.params.duration)
        //         let endDate = moment(req.params.startDate).add(duration, unitOfMeasurement).endOf('day').format()
        //         let options: any = {
        //             where: {
        //                 checkIn: {
        //                     [sequelize.Op.between]: [startDate, endDate]
        //                 }
        //             }
        //         }
        //         if (status !== 'all') {
        //             options.where.status = Number(status)
        //         }
        //         let data = await Session.count(options)
        //         apiResponse(res, 200, data, null, false, req.cacheKey, 60)
        //     } catch (e) {
        //         apiResponse(res, 500, e)
        //     }
        // })
        this.router.get('/insights/:year', [
            check_1.param('year').isInt().not().isEmpty(),
            util_validation_1.isValidated,
            md_is_cached_1.isCached
        ], (req, res) => __awaiter(this, void 0, void 0, function* () {
            let projectOptions = {
                attributes: ['id', 'name', 'registrationStartDate', 'registrationEndDate', 'revisionEndDate', 'startDate', 'endDate', 'totalVolume', 'firstEnrollmentCount', 'year'],
                order: [['id', 'DESC']],
                where: {
                    year: req.params.year
                },
                raw: true
            };
            let data = yield model_project_1.Project.findAll(projectOptions);
            // console.log('[*] data', data)
            // console.log('[*] data', typeof data)
            for (const [index, value] of data.entries()) {
                // console.log('[*] value', value)
                let popularTimes = yield util_database_1.sequelize.query('SELECT count(sessions.id) as count, times.id, times."label", times."startTime", times."endTime" FROM sessions LEFT JOIN times ON times.id = sessions."timeId" WHERE sessions."projectId" = ' + value.id + ' GROUP BY times.id', { type: util_database_1.sequelize.QueryTypes.SELECT });
                popularTimes.forEach((v, i) => {
                    popularTimes[i].count = Number(v.count);
                });
                data[index].popularTimes = popularTimes;
            }
            util_response_1.apiResponse(res, 200, data, null, false, req.cacheKey, 60);
        }));
        this.router.get('/facebook/posts', [
            md_is_cached_1.isCached
        ], (req, res) => __awaiter(this, void 0, void 0, function* () {
            try {
                let data = yield util_facebook_1.getFacebookPosts();
                if (data != null)
                    util_response_1.apiResponse(res, 200, data, null, false, req.cacheKey, 30);
                else
                    util_response_1.apiResponse(res, 404);
            }
            catch (e) {
                util_response_1.apiResponse(res, 500, e);
            }
        }));
        this.router.get('/facebook/albums', [
            md_is_cached_1.isCached
        ], (req, res) => __awaiter(this, void 0, void 0, function* () {
            try {
                let data = yield util_facebook_1.getFacebookAlbums();
                if (data != null)
                    util_response_1.apiResponse(res, 200, data, null, false, req.cacheKey, 60);
                else
                    util_response_1.apiResponse(res, 404);
            }
            catch (e) {
                util_response_1.apiResponse(res, 500, e);
            }
        }));
        this.router.get('/facebook/albums/:albumId/photos', [
            md_is_cached_1.isCached
        ], (req, res) => __awaiter(this, void 0, void 0, function* () {
            try {
                let data = yield util_facebook_1.getFacebookPhotos(req.params.albumId);
                if (data != null)
                    util_response_1.apiResponse(res, 200, data, null, false, req.cacheKey, 60);
                else
                    util_response_1.apiResponse(res, 404);
            }
            catch (e) {
                util_response_1.apiResponse(res, 500, e);
            }
        }));
        return this.router;
    }
}
exports.default = (new Routes()).bootstrap();
//# sourceMappingURL=route.commons.js.map