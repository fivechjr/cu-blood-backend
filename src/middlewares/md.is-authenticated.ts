import { apiResponse } from "../utils/util.response"
import { PassportRequestEntity } from 'spec'
import { Response, NextFunction } from "express"

export function isAuthenticated (req: PassportRequestEntity, res: Response, next: NextFunction) {
    if (req.isAuthenticated()) {
        return next()
    } else {
        apiResponse(res, 401)
        return
    }
}