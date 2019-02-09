import { Request } from 'express'

export interface PassportRequestEntity extends Request {
    user: any,
    logIn: any,
    logout: any,
    isAuthenticated: any,
    cacheKey: String,
    session: any
}

export interface ResponseEntity {
    status: number,
    success: Boolean,
    message: String,
    cache: Boolean,
    result: any
}