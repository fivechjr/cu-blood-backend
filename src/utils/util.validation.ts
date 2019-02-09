import { Request, Response, NextFunction } from 'express'
import { validationResult } from 'express-validator/check'
import { apiResponse } from './util.response'

export function isValidated (req: Request, res: Response, next: NextFunction) : any {
    let validationErrors = validationResult(req)
    if (!validationErrors.isEmpty()) {
        apiResponse(res, 422, validationErrors.array())
        return
    } else {
        return next()
    }
}