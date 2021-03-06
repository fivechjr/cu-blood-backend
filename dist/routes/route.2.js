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
const util_response_1 = require("../utils/util.response");
const md_is_internal_request_1 = require("../middlewares/md.is-internal-request");
const model_session_1 = require("../models/model.session");
const check_1 = require("express-validator/check");
const util_validation_1 = require("../utils/util.validation");
const model_project_1 = require("../models/model.project");
const model_user_1 = require("../models/model.user");
const model_location_1 = require("../models/model.location");
class Routes {
    constructor() {
        this.router = express_1.Router();
    }
    bootstrap() {
        this.router.put('/users/check-in', [
            md_is_internal_request_1.isInternalRequest,
            check_1.body('code').isUUID(),
            util_validation_1.isValidated
        ], (req, res) => __awaiter(this, void 0, void 0, function* () {
            try {
                let uuid = req.body.code;
                let checkIn = new Date(Date.now());
                let options = {
                    where: {
                        id: uuid
                    },
                    include: [model_project_1.Project, model_user_1.User]
                };
                let session = yield model_session_1.Session.findOne(options);
                if (session == null) {
                    util_response_1.apiResponse(res, 404);
                    return;
                }
                let sessionStartDate = new Date(session.project.startDate);
                let sessionEndDate = new Date(session.project.endDate);
                if (checkIn >= sessionStartDate && checkIn <= sessionEndDate && session.checkIn == null) {
                    let data = yield model_session_1.Session.update({ checkIn }, { where: { id: uuid } });
                    if (data != null) {
                        util_response_1.apiResponse(res, 200);
                        return;
                    }
                    else {
                        util_response_1.apiResponse(res, 404);
                        return;
                    }
                }
                else {
                    util_response_1.apiResponse(res, 400);
                    return;
                }
            }
            catch (e) {
                console.log(e);
                util_response_1.apiResponse(res, 500);
            }
        }));
        this.router.put('/users/check-out', [
            md_is_internal_request_1.isInternalRequest,
            check_1.body('code').isUUID(),
            check_1.body('status').isInt({ min: 0, max: 3 }),
            util_validation_1.isValidated
        ], (req, res) => __awaiter(this, void 0, void 0, function* () {
            try {
                let uuid = req.body.code;
                let status = req.body.status;
                let checkOut = new Date(Date.now());
                let options = {
                    where: {
                        id: uuid
                    },
                    include: [model_project_1.Project, model_user_1.User]
                };
                let session = yield model_session_1.Session.findOne(options);
                if (session == null) {
                    util_response_1.apiResponse(res, 404);
                    return;
                }
                let sessionStartDate = new Date(session.project.startDate);
                let sessionEndDate = new Date(session.project.endDate);
                if (checkOut >= sessionStartDate && checkOut <= sessionEndDate && session.checkOut == null && session.status == null && session.checkIn != null) {
                    let data = yield model_session_1.Session.update({ checkOut, status }, { where: { id: uuid } });
                    if (data != null) {
                        util_response_1.apiResponse(res, 200);
                        return;
                    }
                    else {
                        util_response_1.apiResponse(res, 404);
                        return;
                    }
                }
                else {
                    util_response_1.apiResponse(res, 400);
                    return;
                }
            }
            catch (e) {
                console.log(e);
                util_response_1.apiResponse(res, 500);
            }
        }));
        this.router.post('/users/verify', [
            md_is_internal_request_1.isInternalRequest,
            check_1.body('code').isUUID(),
            util_validation_1.isValidated
        ], (req, res) => __awaiter(this, void 0, void 0, function* () {
            try {
                let uuid = req.body.code;
                let options = {
                    where: {
                        id: uuid
                    },
                    include: [model_project_1.Project, model_user_1.User, model_location_1.Location]
                };
                let data = yield model_session_1.Session.findOne(options);
                if (data != null) {
                    util_response_1.apiResponse(res, 200, util_response_1.toBridgeSessionEntity(data));
                    return;
                }
                else {
                    util_response_1.apiResponse(res, 404);
                    return;
                }
            }
            catch (e) {
                console.log(e);
                util_response_1.apiResponse(res, 500);
            }
        }));
        return this.router;
    }
}
exports.default = (new Routes()).bootstrap();
//# sourceMappingURL=route.2.js.map