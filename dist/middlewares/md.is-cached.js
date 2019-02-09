"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const util_response_1 = require("../utils/util.response");
const memoryCache = require("memory-cache");
function isCached(req, res, next) {
    let key = 'cache:' + req.originalUrl || req.url;
    let cache = memoryCache.get(key);
    if (cache) {
        util_response_1.apiResponse(res, 200, cache, null, true);
        return;
    }
    else {
        req.cacheKey = key;
        return next();
    }
}
exports.isCached = isCached;
//# sourceMappingURL=md.is-cached.js.map