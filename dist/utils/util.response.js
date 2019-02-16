"use strict";
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) if (e.indexOf(p[i]) < 0)
            t[p[i]] = s[p[i]];
    return t;
};
Object.defineProperty(exports, "__esModule", { value: true });
const memoryCache = require("memory-cache");
const util_time_1 = require("./util.time");
function httpResponseMessage(status) {
    switch (status) {
        case 200:
            return 'Endpoint reached';
        case 205:
            return 'Reset content';
        case 400:
            return 'Bad request';
        case 401:
            return 'Not authenticated';
        case 403:
            return 'Forbidden';
        case 404:
            return 'Not found';
        case 422:
            return 'Unprocessable entity';
        case 429:
            return 'Too many requests';
        case 500:
            return 'Server error';
        case 501:
            return 'Not implemented';
        default:
            return 'Endpoint reached';
    }
}
exports.httpResponseMessage = httpResponseMessage;
function normalizeResponseObject(status = 200, result, message = null, cache = false) {
    return {
        status,
        message: (message != null) ? message : httpResponseMessage(status),
        success: (status >= 200 && status <= 299) ? true : false,
        cache,
        result: (status >= 200 && status <= 299) ? result : null,
    };
}
exports.normalizeResponseObject = normalizeResponseObject;
function toUserEntity(u, withId = false) {
    let { id, password, createdAt, updatedAt, school } = u, user = __rest(u, ["id", "password", "createdAt", "updatedAt", "school"]);
    if (!withId) {
        return Object.assign({}, user, { school: { id: school.id, nameTH: school.nameTH, nameEN: school.nameEN } });
    }
    else {
        return Object.assign({ id }, user, { school: { id: school.id, nameTH: school.nameTH, nameEN: school.nameEN } });
    }
}
exports.toUserEntity = toUserEntity;
function toSessionEntity(s) {
    let { id, timeSlot, checkIn, checkOut, status, createdAt, project, time, locationId, type } = s;
    return {
        id,
        timeSlot,
        checkIn: util_time_1.utcOffset(checkIn),
        checkOut: util_time_1.utcOffset(checkOut),
        status,
        createdAt: util_time_1.utcOffset(createdAt),
        project: {
            id: project.id,
            name: project.name,
            startDate: util_time_1.utcOffset(project.startDate),
            endDate: util_time_1.utcOffset(project.endDate)
        },
        time: {
            label: time.label,
            startTime: time.startTime,
            endTime: time.endTime
        },
        locationId,
        type
    };
}
exports.toSessionEntity = toSessionEntity;
function getBloodType(b) {
    let suffix = (z) => {
        return {
            0: '+',
            1: '-',
            2: 'Unknown'
        }[z % 3];
    };
    let prefix = (z) => {
        return {
            0: 'A',
            3: 'B',
            6: 'O',
            9: 'AB'
        }[z - (z % 3)];
    };
    return `${prefix(b)} [${suffix(b)}]`;
}
exports.getBloodType = getBloodType;
function toBasicSessionEntity(s) {
    let { id, timeSlot, checkIn, checkOut, status, createdAt, project, user, location, type, time } = s;
    return {
        id,
        timeSlot,
        checkIn: util_time_1.utcOffset(checkIn),
        checkOut: util_time_1.utcOffset(checkOut),
        status,
        createdAt: util_time_1.utcOffset(createdAt),
        project: {
            name: project.name,
            startDate: util_time_1.utcOffset(project.startDate),
            endDate: util_time_1.utcOffset(project.endDate)
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
    };
}
exports.toBasicSessionEntity = toBasicSessionEntity;
function apiResponse(res, status = 200, result = {}, message = null, cache = false, cacheKey = null, cacheDuration = 10) {
    if (cache == false && cacheKey != null) {
        memoryCache.put(cacheKey, result, cacheDuration * 60 * 1000);
    }
    res.status(status).json(normalizeResponseObject(status, result, message, cache));
    res.end();
    return;
}
exports.apiResponse = apiResponse;
//# sourceMappingURL=util.response.js.map