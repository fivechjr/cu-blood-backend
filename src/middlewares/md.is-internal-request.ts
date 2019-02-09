import { apiResponse } from "../utils/util.response"
import { PassportRequestEntity } from 'spec'
import { Response, NextFunction } from "express"

export function verifyInternalRequest (req: PassportRequestEntity) {
    return req.get('Authorization') === process.env.API_KEY
}

export function isInternalRequest (req: PassportRequestEntity, res: Response, next: NextFunction) {
    if (verifyInternalRequest(req)) {
        return next()
    } else {
        apiResponse(res, 403)
        return
    }
}