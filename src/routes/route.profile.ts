import { Router, Request, Response, NextFunction } from 'express'
import * as passport from 'passport'
import { IVerifyOptions } from 'passport-local'
import { body } from 'express-validator/check'
import { PassportRequestEntity } from 'spec'
import { Session } from '../models/model.session'
import { Project } from '../models/model.project'
import { User } from '../models/model.user'
import { apiResponse, toUserEntity, toSessionEntity } from '../utils/util.response'
import { isValidated } from '../utils/util.validation'
import { isAuthenticated } from '../middlewares/md.is-authenticated'
import { verifyInternalRequest } from '../middlewares/md.is-internal-request'
import '../utils/util.passport'
import moment = require('moment')
import { Time } from '../models/model.time'
import chalk from 'chalk';
import { verifyPasscode } from '../utils/util.passcode';

class Routes {
    private router: Router = Router()
    public bootstrap () : Router {
        this.router.post('/login', [
            body('username').not().isEmpty().trim().escape(),
            body('password').not().isEmpty().trim().escape(),
            isValidated
        ], (req: PassportRequestEntity, res: Response, next: NextFunction) => {
            passport.authenticate("local", (err: Error, user: any, info: IVerifyOptions) => {
                if (err) {
                    apiResponse(res, 500, err)
                    return
                }
                if (!user) {
                    console.log('[-]', info)
                    apiResponse(res, 401, null, info.message)
                    return
                }
                req.logIn(user, (err) => {
                    if (err) {
                        console.log('[-]', err)
                        apiResponse(res, 401, err)
                        return
                    }
                    apiResponse(res, 200, toUserEntity(user))
                    return
                })
            })(req, res, next)
        })

        this.router.post('/logout', (req: PassportRequestEntity, res: Response) => {
            req.logout()
            req.session.destroy(function (err) {
                if (err) {
                    apiResponse(res, 500, err)
                }
                apiResponse(res, 205)
            })
        })

        // this.router.post('/logout/redirect', (req: PassportRequestEntity, res: Response) => {
        //     req.logout()
        //     req.session.destroy(function (err) {
        //         if (err) {
        //             apiResponse(res, 500, err)
        //         }
        //         res.redirect('/v0/profile/logout/callback')
        //     })
        // })

        // this.router.get('/logout/callback', (req: PassportRequestEntity, res: Response) => {
        //     if (req.isAuthenticated()) {
        //         apiResponse(res, 500, null, "You 're supposed to be unauthenticated!")
        //     } else {
        //         apiResponse(res, 205)
        //     }
        // })

        this.router.post('/create-account', [
            body('firstName').not().isEmpty().trim().escape(),
            body('lastName').not().isEmpty().trim().escape(),
            body('nickname').not().isEmpty().trim().escape(),
            body('gender').not().isEmpty().trim().escape(),
            body('bloodType').not().isEmpty().trim().escape(),
            body('birthday').not().isEmpty().trim().escape(),
            body('username').not().isEmpty().trim().escape(),
            body('password').not().isEmpty().trim().escape(),
            body('phoneNumber').not().isEmpty().trim().escape(),
            body('weight').not().isEmpty().trim().escape(),
            body('medicalCondition').not().isEmpty().trim().escape(),
            body('status').not().isEmpty().trim().escape(),
            body('shirtSize').not().isEmpty().trim().escape(),
            body('nationality').not().isEmpty().trim().escape(),
            body('isDonated').not().isEmpty().trim().escape(),
            body('isEnrolled').not().isEmpty().trim().escape(),
            body('academicYear').not().isEmpty().trim().escape(),
            body('schoolId').not().isEmpty().trim().escape(),
            isValidated
        ], async (req: Request, res: Response) => {
            try {
                // let count = await User.count({
                //     where: {
                //         [sequelize.Op.or]: [{username: (req.body.username).toLowerCase()}, {studentId: String(req.body.studentId).toLowerCase()}]
                //     }
                // })
                // if (count > 0) {
                //     apiResponse(res, 400)
                //     return
                // }
                let data = await User.create(req.body)
                // console.log(data)
                apiResponse(res, 200)
                return
            } catch (e) {
                console.log(e)
                apiResponse(res, 500)
            }
        })

        this.router.post('/forget-password', (req: Request, res: Response) => {
            apiResponse(res)
        })

        this.router.get('/me', [
            isAuthenticated
        ], (req: PassportRequestEntity, res: Response) => {
            // console.log('[*]', req.user)
            apiResponse(res, 200, toUserEntity(req.user))
        })

        this.router.put('/me/update', [
            isAuthenticated,
            isValidated
        ], async (req: PassportRequestEntity, res: Response) => {
            try {
                if (req.body && req.body.studentId) {
                    req.body.studentId = String(req.body.studentId)
                }

                // if (req.body.studentId != req.user.studentId || req.body.username != req.user.username) {
                //     let studentId = (req.body.studentId != req.user.studentId) ? '' : req.body.studentId
                //     let username = req.body.username ? '' : req.body.username
                //     let count = await User.count({
                //         where: {
                //             [sequelize.Op.or]: [{username: (req.body.username).toLowerCase()}, {studentId: String(req.body.studentId).toLowerCase()}]
                //         }
                //     })
                //     if (count > 0) {
                //         apiResponse(res, 400)
                //         return
                //     }
                // }

                let options = {
                    where: {
                        id: req.user.id
                    },
                    individualHooks: true
                }
                let data = await User.update(req.body, options)
                apiResponse(res, 200)
                return
            } catch (e) {
                apiResponse(res, 400)
            }
        })

        this.router.get('/me/sessions', [
            isAuthenticated
        ], async (req: PassportRequestEntity, res: Response) => {
            try {
                let userId = req.user.id
                let options = {
                    where: {
                        userId: userId
                    },
                    include: [Project, Time]
                }
                let data = await Session.findAll(options)
                if (data.length > 0)
                    apiResponse(res, 200, data.map(d => toSessionEntity(d)))
                else
                    apiResponse(res, 404)
            } catch (e) {
                console.log('[-]', e)
                apiResponse(res, 500, e)
            }
        })

        this.router.put('/me/enroll', [
            isAuthenticated,
            body('sessionId').isUUID(4),
            body('locationId').isInt(),
            body('timeSlot').isISO8601(),
            body('timeId').isInt(),
            isValidated
        ], async (req: PassportRequestEntity, res: Response) => {
            let sessionId = req.body.sessionId
            let locationId = req.body.locationId
            let timeSlot = moment(req.body.timeSlot).utcOffset('420')
            let timeId = req.body.timeId
            try {
                let sessionOptions = {
                    where: {
                        id: sessionId
                    }
                }
                let session = await Session.findOne(sessionOptions)
                if (session === 1) {
                    // console.log('[-] session === null', session)
                    apiResponse(res, 400)
                    return
                }

                let projectOptions = {
                    where: {
                        id: session.projectId
                    }
                }
                let project = await Project.findOne(projectOptions)
                if (project === null) {
                    // console.log('[-] project === null', project)
                    apiResponse(res, 400)
                    return
                }

                console.log('[*] project', project)

                let startDate = moment(project.startDate).utcOffset('420')
                let endDate = moment(project.endDate).utcOffset('420')
                let revisionEndDate = moment(project.revisionEndDate).utcOffset('420')
                let now = moment().utcOffset('420')
                let isAfterRevisionEndDate = now.isAfter(moment(revisionEndDate))
                let isPasscodeValid = verifyPasscode(project.passcode, req, res)

                console.log('[*] isAfterRevisionEndDate', isAfterRevisionEndDate)
                console.log('[*] isPasscodeValid', isPasscodeValid)

                if (isPasscodeValid && !isAfterRevisionEndDate) {
                    if (timeSlot.isBetween(startDate, endDate, 'days', '[]')) {
                        let options = {
                            where: {
                                id: sessionId
                            }
                        }
                        let data = await Session.update({ locationId, timeSlot, timeId }, options)
                        apiResponse(res, 200)
                        return
                    } else {
                        apiResponse(res, 400)
                        return
                    }
                } else {
                    apiResponse(res, 400)
                    return
                }
            } catch (e) {
                console.log('[-]', e)
                apiResponse(res, 500)
                return
            }
        })

        this.router.post('/me/enroll', [
            isAuthenticated,
            body('projectId').isInt(),
            body('locationId').isInt(),
            body('timeId').isInt(),
            body('timeSlot').isISO8601(),
            isValidated
        ], async (req: PassportRequestEntity, res: Response) => {
            let projectId = req.body.projectId
            let timeId = req.body.timeId
            let userId = req.user.id
            let now = moment().utcOffset('420')
            try {
                let options = {
                    where: {
                        id: projectId
                    }
                }
                let timeOptions = {
                    where: {
                        id: timeId
                    }
                }
                let data = await Project.findOne(options)
                let timeData = await Time.count(timeOptions)
                if (data != null && timeData > 0) {
                    let locationId = req.body.locationId
                    let timeSlot = moment(req.body.timeSlot).utcOffset('420')
                    let startDate = moment(data.startDate).utcOffset('420')
                    let endDate = moment(data.endDate).utcOffset('420')
                    let registrationStartDate = moment(data.registrationStartDate).utcOffset('420')
                    let registrationEndDate = moment(data.registrationEndDate).utcOffset('420')
                    let isRegisteringInRegistrationSlot = now.isBetween(registrationStartDate, registrationEndDate, 'days', '[]')
                    if (isRegisteringInRegistrationSlot || verifyInternalRequest(req) || verifyPasscode(data.passcode, req, res)) {
                        if (timeSlot.isBetween(startDate, endDate, 'days', '[]')) {
                            try {
                                let options = {
                                    where: {
                                        userId,
                                        projectId
                                    }
                                }
                                let model = {
                                    timeSlot,
                                    locationId,
                                    userId,
                                    projectId,
                                    timeId
                                }
                                let check = await Session.count(options)
                                if (check > 0) {
                                    console.log('[-] check > 0', check)
                                    apiResponse(res, 400)
                                    return
                                }
                                let session = await Session.create(model)
                                session.project = await session.getProject()
                                session.time = await session.getTime()
                                apiResponse(res, 200, toSessionEntity(session))
                                return
                            } catch (e) {
                                console.log(chalk.bgRed('ERROR'))
                                console.log(e)
                                apiResponse(res, 500)
                                return
                            }
                        } else {
                            console.log('[-] timeSlot isBetween')
                            apiResponse(res, 400)
                            return
                        }
                    } else {
                        console.log('[-] now isBetween (registrationDate)')
                        apiResponse(res, 400)
                        return
                    }
                } else {
                    console.log('[-] project === null || timeData < 0')
                    apiResponse(res, 400)
                    return
                }
            } catch (e) {
                console.log('[-]', e)
                apiResponse(res, 500)
                return
            }
        })
        
        return this.router
    }
}

export default (new Routes()).bootstrap()