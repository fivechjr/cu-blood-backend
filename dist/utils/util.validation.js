"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const check_1 = require("express-validator/check");
const util_response_1 = require("./util.response");
function isValidated(req, res, next) {
    let validationErrors = check_1.validationResult(req);
    if (!validationErrors.isEmpty()) {
        util_response_1.apiResponse(res, 422, validationErrors.array());
        return;
    }
    else {
        return next();
    }
}
exports.isValidated = isValidated;
//# sourceMappingURL=util.validation.js.map