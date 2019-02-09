"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const util_response_1 = require("../utils/util.response");
function isAuthenticated(req, res, next) {
    if (req.isAuthenticated()) {
        return next();
    }
    else {
        util_response_1.apiResponse(res, 401);
        return;
    }
}
exports.isAuthenticated = isAuthenticated;
//# sourceMappingURL=md.is-authenticated.js.map