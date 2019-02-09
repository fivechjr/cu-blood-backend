"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const util_response_1 = require("../utils/util.response");
function verifyInternalRequest(req) {
    return req.get('Authorization') === process.env.API_KEY;
}
exports.verifyInternalRequest = verifyInternalRequest;
function isInternalRequest(req, res, next) {
    if (verifyInternalRequest(req)) {
        return next();
    }
    else {
        util_response_1.apiResponse(res, 403);
        return;
    }
}
exports.isInternalRequest = isInternalRequest;
//# sourceMappingURL=md.is-internal-request.js.map