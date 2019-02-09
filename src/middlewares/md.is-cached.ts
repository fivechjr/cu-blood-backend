import { apiResponse } from "../utils/util.response"
import { PassportRequestEntity } from 'spec'
import { Response, NextFunction } from "express"
import * as memoryCache from 'memory-cache'

export function isCached (req: PassportRequestEntity, res: Response, next: NextFunction) {
    let key = 'cache:' + req.originalUrl || req.url
    let cache = memoryCache.get(key)
    if (cache) {
        apiResponse(res, 200, cache, null, true)
        return
    } else {
        req.cacheKey = key
        return next()
    }
}