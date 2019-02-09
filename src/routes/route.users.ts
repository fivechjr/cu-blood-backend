import { Router, Response } from 'express'
import { apiResponse, toBasicSessionEntity } from '../utils/util.response'
import { isInternalRequest } from '../middlewares/md.is-internal-request';
import { Session } from '../models/model.session';
import { PassportRequestEntity } from 'spec';
import { body } from 'express-validator/check';
import { isValidated } from '../utils/util.validation';
import { Project } from '../models/model.project';
import { User } from '../models/model.user';
import { Location } from '../models/model.location';
import moment = require('moment');

class Routes {
    private router: Router = Router()
    public bootstrap () : Router {
        // @ts-ignore
        this.router.put('/check-in', [
            isInternalRequest,
            body('code').isUUID(),
            isValidated
        ], async (req: PassportRequestEntity, res: Response) => {
            try {
                let uuid = req.body.code
                let checkIn = moment()
                let options = {
                    where: {
                        id: uuid
                    },
                    include: [Project, User]
                }
                let session = await Session.findOne(options)
                if (session == null) {
                    apiResponse(res, 404)
                    return
                }
                let startDate = moment(session.project.startDate).utcOffset('420')
                let endDate = moment(session.project.endDate).utcOffset('420')
                if ((checkIn.isBetween(startDate, endDate, 'days', '[]')) && session.checkIn == null) {
                    let data = await Session.update({ checkIn }, { where: { id: uuid } })
                    if (data != null) {
                        apiResponse(res, 200)
                        return
                    } else {
                        apiResponse(res, 404)
                        return
                    }
                } else {
                    apiResponse(res, 400)
                    return
                }
            } catch (e) {
                console.log(e)
                apiResponse(res, 500)
            }
        })

        // @ts-ignore
        this.router.put('/check-out', [
            isInternalRequest,
            body('code').isUUID(),
            body('status').isInt({ min: 0, max: 3 }),
            isValidated
        ], async (req: PassportRequestEntity, res: Response) => {
            try {
                let uuid = req.body.code
                let status = req.body.status
                let checkOut = moment()
                let options = {
                    where: {
                        id: uuid
                    },
                    include: [Project, User]
                }
                let session = await Session.findOne(options)
                if (session == null) {
                    apiResponse(res, 404)
                    return
                }
                let startDate = moment(session.project.startDate).utcOffset('420')
                let endDate = moment(session.project.endDate).utcOffset('420')
                if ((checkOut.isBetween(startDate, endDate, 'days', '[]')) && session.checkOut == null && session.status == null && session.checkIn != null) {
                    let data = await Session.update({ checkOut, status }, { where: { id: uuid } })
                    if (data != null) {
                        apiResponse(res, 200)
                        return
                    } else {
                        apiResponse(res, 404)
                        return
                    }
                } else {
                    apiResponse(res, 400)
                    return
                }
            } catch (e) {
                console.log(e)
                apiResponse(res, 500)
            }
        })

        // @ts-ignore
        this.router.post('/verify', [
            isInternalRequest,
            body('code').isUUID(),
            isValidated
        ], async (req: PassportRequestEntity, res: Response) => {
            try {
                let uuid = req.body.code
                let options = {
                    where: {
                        id: uuid
                    },
                    include: [Project, User, Location]
                }
                let data = await Session.findOne(options)
                if (data != null) {
                    apiResponse(res, 200, toBasicSessionEntity(data))
                    return
                } else {
                    apiResponse(res, 404)
                    return
                }
            } catch (e) {
                console.log(e)
                apiResponse(res, 500)
            }
        })
        
        return this.router
    }
}

export default (new Routes()).bootstrap()