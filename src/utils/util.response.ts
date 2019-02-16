import { Response } from 'express'
import { ResponseEntity } from '../spec'
import * as memoryCache from 'memory-cache'
import { utcOffset } from './util.time';

export function httpResponseMessage (status) : String {
    switch (status) {
        case 200:
            return 'Endpoint reached'
        case 205:
            return 'Reset content'
        case 400:
            return 'Bad request'
        case 401:
            return 'Not authenticated'
        case 403:
            return 'Forbidden'
        case 404:
            return 'Not found'
        case 422:
            return 'Unprocessable entity'
        case 429:
            return 'Too many requests'
        case 500:
            return 'Server error'
        case 501:
            return 'Not implemented'
        default:
            return 'Endpoint reached'
    }
}

export function normalizeResponseObject (
        status: number = 200,
        result: any,
        message: String = null,
        cache: boolean = false
    ) : ResponseEntity
    {
        return {
            status,
            message: (message != null) ? message : httpResponseMessage(status),
            success: (status >= 200 && status <= 299) ? true : false,
            cache,
            result: (status >= 200 && status <= 299) ? result : null,
        }
    }

export function toUserEntity (u, withId = false) {
    let {
        id,
        password,
        createdAt,
        updatedAt,
        school,
        ...user
    } = u

    if (!withId) {
        return {
            ...user,
            school: { id: school.id, nameTH: school.nameTH, nameEN: school.nameEN }
        }
    } else {
        return {
            id,
            ...user,
            school: { id: school.id, nameTH: school.nameTH, nameEN: school.nameEN }
        }
    }
}

export function toSessionEntity (s) {
    let { id, timeSlot, checkIn, checkOut, status, createdAt, project, time, locationId, type } = s
    return {
        id,
        timeSlot,
        checkIn: utcOffset(checkIn),
        checkOut: utcOffset(checkOut),
        status,
        createdAt: utcOffset(createdAt),
        project: {
            id: project.id,
            name: project.name,
            startDate: utcOffset(project.startDate),
            endDate: utcOffset(project.endDate)
        },
        time: {
            label: time.label,
            startTime: time.startTime,
            endTime: time.endTime
        },
        locationId,
        type
    }
}

export function toBasicSessionEntity (s) {
    let { id, timeSlot, checkIn, checkOut, status, createdAt, project, user, location, type, time } = s
    return {
        id,
        timeSlot,
        checkIn: utcOffset(checkIn),
        checkOut: utcOffset(checkOut),
        status,
        createdAt: utcOffset(createdAt),
        project: {
            name: project.name,
            startDate: utcOffset(project.startDate),
            endDate: utcOffset(project.endDate)
        },
        user: {
            firstName: user.firstName,
            lastName: user.lastName,
            gender: user.gender,
            username: user.username
        },
        location: {
            name: location.nameTH
        },
        time: {
            label: time.label,
            startTime: time.startTime,
            endTime: time.endTime
        },
        type
    }
}

export function apiResponse (
        res: Response,
        status: number = 200,
        result: any = {},
        message: String = null,
        cache: boolean = false,
        cacheKey: String = null,
        cacheDuration: number = 10
    ) : void
    {
        if (cache == false && cacheKey != null) {
            memoryCache.put(cacheKey, result, cacheDuration * 60 * 1000)
        }
        res.status(status).json(normalizeResponseObject(status, result, message, cache))
        res.end()
        return
    }