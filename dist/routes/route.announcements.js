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
const check_1 = require("express-validator/check");
const model_announcement_1 = require("../models/model.announcement");
const util_response_1 = require("../utils/util.response");
const util_validation_1 = require("../utils/util.validation");
const md_is_cached_1 = require("../middlewares/md.is-cached");
class Routes {
    constructor() {
        this.router = express_1.Router();
    }
    bootstrap() {
        this.router.get('/all', (req, res) => __awaiter(this, void 0, void 0, function* () {
            try {
                let options = {
                    attributes: ['id', 'title', 'updatedAt'],
                    order: [['id', 'DESC']]
                };
                let data = yield model_announcement_1.Announcement.findAll(options);
                if (data.length > 0)
                    util_response_1.apiResponse(res, 200, data);
                else
                    util_response_1.apiResponse(res, 404);
            }
            catch (e) {
                util_response_1.apiResponse(res, 500);
            }
        }));
        this.router.get('/all/:pageIndex', [
            check_1.param('pageIndex').isInt(),
            util_validation_1.isValidated,
            md_is_cached_1.isCached
        ], (req, res) => __awaiter(this, void 0, void 0, function* () {
            let page = req.params.pageIndex - 1;
            let limit = 10;
            let offset = page * limit;
            try {
                let options = {
                    attributes: ['id', 'title', 'displayImage', 'updatedAt'],
                    limit: limit,
                    offset: offset,
                    order: [['id', 'DESC']]
                };
                let data = yield model_announcement_1.Announcement.findAndCountAll(options);
                if (data.rows.length > 0) {
                    let ret = {
                        currentPage: page + 1,
                        pageCount: Math.ceil(data.count / limit),
                        data: data.rows
                    };
                    util_response_1.apiResponse(res, 200, ret, null, false, req.cacheKey);
                }
                else {
                    util_response_1.apiResponse(res, 404);
                }
            }
            catch (e) {
                util_response_1.apiResponse(res, 500);
            }
        }));
        this.router.get('/:announcementId', [
            check_1.param('announcementId').isInt(),
            util_validation_1.isValidated,
            md_is_cached_1.isCached
        ], (req, res) => __awaiter(this, void 0, void 0, function* () {
            try {
                let data = yield model_announcement_1.Announcement.findById(req.params.announcementId);
                if (data != null)
                    util_response_1.apiResponse(res, 200, data, null, false, req.cacheKey);
                else
                    util_response_1.apiResponse(res, 404);
            }
            catch (e) {
                util_response_1.apiResponse(res, 500);
            }
        }));
        return this.router;
    }
}
exports.default = (new Routes()).bootstrap();
//# sourceMappingURL=route.announcements.js.map