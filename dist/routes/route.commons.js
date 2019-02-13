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
const util_validation_1 = require("../utils/util.validation");
const check_1 = require("express-validator/check");
const util_database_1 = require("../utils/util.database");
const moment = require("moment");
const model_location_1 = require("../models/model.location");
const model_school_1 = require("../models/model.school");
const model_time_1 = require("../models/model.time");
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
                    let currDate = moment(startDate).startOf('day');
                    let lastDate = moment(endDate).endOf('day');
                    dates.push(currDate.clone().format());
                    while (currDate.add(1, 'days').diff(lastDate) <= 0) {
                        dates.push(currDate.clone().format());
                    }
                    return dates;
                };
                let projectOptions = {
                    attributes: ['id', 'name', 'registrationStartDate', 'registrationEndDate', 'startDate', 'endDate'],
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
                    attributes: ['id', 'startTime', 'endTime', 'label'],
                    order: [['id', 'ASC']],
                };
                let data = yield model_project_1.Project.findAll(projectOptions);
                let locations = yield model_location_1.Location.findAll(locationOptions);
                let schools = yield model_school_1.School.findAll(schoolOptions);
                let times = yield model_time_1.Time.findAll(timeOptions);
                let result = data[0].toJSON();
                result.locations = locations;
                result.schools = schools;
                result.startDate = moment(result.startDate).utcOffset(420).format();
                result.endDate = moment(result.endDate).utcOffset(420).format();
                result.registrationStartDate = moment(result.registrationStartDate).utcOffset(420).format();
                result.registrationEndDate = moment(result.registrationEndDate).utcOffset(420).format();
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
        // this.router.get('/insights/sessions/:startDate/:endDate/:status', [
        //     isCached,
        //     param('startDate').isISO8601(),
        //     param('endDate').isISO8601(),
        //     param('status').isIn(['all', '0', '1', '2', '3']),
        //     isValidated
        // ], async (req: PassportRequestEntity, res: Response) => {
        //     try {
        //         let status = req.params.status
        //         let startDate = moment(req.params.startDate).startOf('day').format()
        //         let endDate = moment(req.params.endDate).endOf('day').format()
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
        this.router.get('/insights/blood-types/:year', [
            md_is_cached_1.isCached,
            check_1.param('year').isInt().not().isEmpty(),
            util_validation_1.isValidated
        ], (req, res) => __awaiter(this, void 0, void 0, function* () {
            util_database_1.sequelize.query('SELECT users."bloodType", count(sessions.id) as count FROM users LEFT JOIN sessions ON users.id = sessions."userId" WHERE EXTRACT(year FROM sessions."checkOut") = ? GROUP BY 1, users."bloodType"', { replacements: [req.params.year], type: util_database_1.sequelize.QueryTypes.SELECT }).then(d => {
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