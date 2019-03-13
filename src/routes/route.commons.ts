import { Router, Request, Response } from 'express'
import { Project } from '../models/model.project'
import { getFacebookPosts, getFacebookAlbums, getFacebookPhotos } from '../utils/util.facebook'
import { apiResponse, toUserEntity, getBloodType } from '../utils/util.response'
import { isCached } from '../middlewares/md.is-cached'
import { PassportRequestEntity } from 'spec'
import { Session } from '../models/model.session'
import { isValidated } from '../utils/util.validation'
import { param, body } from 'express-validator/check'
import { sequelize } from '../utils/util.database'
import * as moment from 'moment'
import { User } from '../models/model.user'
import { Location } from '../models/model.location'
import { School } from '../models/model.school'
import { Time } from '../models/model.time'
import { isInternalRequest } from '../middlewares/md.is-internal-request'
import * as flatten from 'flat'
import { parse } from 'json2csv'
import * as basicAuth from 'express-basic-auth'
import { utcOffset } from '../utils/util.time';

class Routes {
    private router: Router = Router()
    public bootstrap () : Router {
        this.router.get('/', [
            isCached
        ], async (req: PassportRequestEntity, res: Response) => {
            try {
                let enumerateDaysBetweenDates = (startDate, endDate) => {
                    let dates = []
                    let now = moment().startOf('day')
                    let currDate = now.isAfter(moment(startDate).startOf('day')) ? now : moment(startDate).startOf('day')
                    if (now.isAfter(moment(endDate).endOf('day'))) {
                        return dates
                    }
                    let lastDate = moment(endDate).endOf('day')
                    dates.push(currDate.clone().format())
                    while(currDate.add(1, 'days').diff(lastDate) <= 0) {
                        dates.push(currDate.clone().format())
                    }
                    return dates
                }
                let projectOptions = {
                    attributes: ['id', 'name', 'registrationStartDate', 'registrationEndDate', 'revisionEndDate', 'startDate', 'endDate', 'totalVolume', 'firstEnrollmentCount', 'year'],
                    order: [['id', 'DESC']],
                    limit: 1
                }
                let locationOptions = {
                    attributes: ['id', 'nameTH', 'nameEN', 'googleMapsURL', 'addressTH', 'addressEN'],
                    order: [['id', 'ASC']],
                }
                let schoolOptions = {
                    attributes: ['id', 'nameTH', 'nameEN'],
                    order: [['id', 'ASC']],
                }
                let timeOptions = {
                    attributes: ['id', 'startTime', 'endTime', 'label'],
                    order: [['id', 'ASC']],
                }
                let data = await Project.findAll(projectOptions)
                let locations = await Location.findAll(locationOptions)
                let schools = await School.findAll(schoolOptions)
                let times = await Time.findAll(timeOptions)
                let result = data[0].toJSON()
                // let firstTimeEnrollmentCount = await sequelize.query('SELECT COUNT(*) FROM (SELECT sessions."projectId", sessions."userId" FROM sessions GROUP BY 1, sessions."userId" HAVING COUNT(*) = 1) AS s WHERE s."projectId" = ' + result.id, { type: sequelize.QueryTypes.SELECT })
                let popularTimes = await sequelize.query('SELECT count(sessions.id) as count, times.id, times."label", times."startTime", times."endTime" FROM sessions LEFT JOIN times ON times.id = sessions."timeId" WHERE sessions."projectId" = ' + result.id + ' GROUP BY times.id', { type: sequelize.QueryTypes.SELECT })
                popularTimes.forEach((v, i) => {
                    popularTimes[i].count = Number(v.count)
                })
                result.statistics = {
                    // firstTimeEnrollmentCount: Number(firstTimeEnrollmentCount[0].count),
                    popularTimes
                }
                result.locations = locations
                result.schools = schools
                result.startDate = moment(result.startDate).utcOffset(420).format()
                result.endDate = moment(result.endDate).utcOffset(420).format()
                result.registrationStartDate = moment(result.registrationStartDate).utcOffset(420).format()
                result.registrationEndDate = moment(result.registrationEndDate).utcOffset(420).format()
                result.revisionEndDate = moment(result.revisionEndDate).utcOffset(420).format()
                result.timeSlots = enumerateDaysBetweenDates(result.startDate, result.endDate)
                result.times = times
                if (data.length > 0)
                    apiResponse(res, 200, result, null, false, req.cacheKey, 60)
                else
                    apiResponse(res, 404)
            } catch (e) {
                console.log(e)
                apiResponse(res, 500)
            }
        })

        // this.router.post('/passcode', [
        //     body('passcode').not().isEmpty(),
        //     isValidated
        // ], async (req: PassportRequestEntity, res: Response) => {
        //     let projectOptions = {
        //         attributes: ['id', 'passcode'],
        //         order: [['id', 'DESC']],
        //         limit: 1
        //     }
        // })

        this.router.get('/insights/reports/:projectId', [
            // isInternalRequest,
            basicAuth({
                users: { 'root' : process.env.API_KEY },
                challenge: true,
                realm: 'Insights',
            }),
            param('projectId').isInt().not().isEmpty(),
            isValidated
        ], async (req: PassportRequestEntity, res: Response) => {
            // console.log('[*]', req.params.projectId)
            // apiResponse(res, 200)
            let project = await Project.findOne({
                where: {
                    id: req.params.projectId
                }
            })

            let data = await Session.findAll({
                where: {
                    projectId: req.params.projectId
                },
                include: [{
                    model: User,
                    include: [School]
                }, Location, Time]
            })

            let d = data.map(d => d.toJSON())
            // console.log('[*]', d)

            const getGender = (g) => {
                return {
                    0: 'M',
                    1: 'F'
                }[g]
            }

            const getBooleanString = (b) => {
                return {
                    0: 'NO',
                    1: 'YES'
                }[b]
            }

            const getTime = (t) => {
                return `${t.startTime} - ${t.endTime} (${t.label})`
            }

            const getLocationName = (l) => {
                return l.nameTH
            }

            const getSchoolName = (s) => {
                return s.nameTH
            }

            const getNationality = (n) => {
                return {
                    0: 'Thai',
                    1: 'Foreigner'
                }[n]
            }

            console.log('[*] d', d)

            d.forEach(z => {
                // delete z.id
                delete z.projectId
                delete z.locationId
                delete z.userId
                delete z.timeId
                delete z.user.uuid
                delete z.user.schoolId
                delete z.user.onboarding
                z.user = toUserEntity(z.user, false)
                z.user.nationality = getNationality(z.user.nationality)
                z.user.bloodType = getBloodType(z.user.bloodType)
                z.user.school = getSchoolName(z.user.school)
                z.user.gender = getGender(z.user.gender)
                z.user.isDonated = getBooleanString(z.user.isDonated)
                z.user.isEnrolled = getBooleanString(z.user.isEnrolled)
                z.location = getLocationName(z.location)
                z.time = getTime(z.time)
                z.checkIn = utcOffset(z.checkIn)
                z.checkOut = utcOffset(z.checkOut)
                z.createdAt = utcOffset(z.createdAt)
                z.updatedAt = utcOffset(z.updatedAt)
            });

            let result = d.map(z => flatten(z))
            const csv = parse(result)

            // console.log(csv)
            // apiResponse(res, 200, result)
            res.attachment(`${Date.now()} - ${req.params.projectId} - ${project.name} (${utcOffset(project.startDate)} - ${utcOffset(project.endDate)}).csv`)
            res.type('txt/csv')
            res.send(csv)
            res.end()
        })

        this.router.get('/insights/blood-types/:year', [
            isCached,
            param('year').isInt().not().isEmpty(),
            isValidated
        ], async (req: PassportRequestEntity, res: Response) => {
            sequelize.query('SELECT users."bloodType", count(sessions.id) as count FROM users LEFT JOIN sessions ON users.id = sessions."userId" WHERE EXTRACT(year FROM sessions."checkOut") = ? AND sessions."status" = 1 GROUP BY 1, users."bloodType"', { replacements: [req.params.year], type: sequelize.QueryTypes.SELECT}).then(d => {
                // console.log(chalk.bgYellow(d))
                apiResponse(res, 200, d, null, false, req.cacheKey, 60)
            }).catch(e => {
                console.log(e)
                apiResponse(res, 400)
            })

            
        })

        // this.router.get('/insights/blood-types', [
        //     isCached
        // ], async (req: PassportRequestEntity, res: Response) => {
        //     let options: any = (a, b) => {
        //         return {
        //             where: {
        //                 bloodType: {
        //                     [sequelize.Op.or]: [a, b]
        //                 }
        //             }
        //         }
        //     }

        //     let A = await User.count(options(0, 1))
        //     let B = await User.count(options(2, 3))
        //     let O = await User.count(options(4, 5))
        //     let AB = await User.count(options(6, 7))

        //     let ret = {
        //         A, B, O, AB
        //     }

        //     apiResponse(res, 200, ret, null, false, req.cacheKey, 60)
        // })

        // this.router.get('/insights/sessions/:startDate/:unitOfMeasurement/:duration/:status', [
        //     isCached,
        //     param('startDate').isISO8601(),
        //     param('unitOfMeasurement').isIn(['years', 'months', 'weeks', 'days']),
        //     param('duration').isInt(),
        //     param('status').isIn(['all', '0', '1', '2', '3']),
        //     isValidated
        // ], async (req: PassportRequestEntity, res: Response) => {
        //     try {
        //         let status = req.params.status
        //         let startDate = moment(req.params.startDate).startOf('day').format()
        //         let unitOfMeasurement = req.params.unitOfMeasurement
        //         let duration = Number(req.params.duration)
        //         let endDate = moment(req.params.startDate).add(duration, unitOfMeasurement).endOf('day').format()
        //         let options: any = {
        //             where: {
        //                 checkIn: {
        //                     [sequelize.Op.between]: [startDate, endDate]
        //                 }
        //             }
        //         }
        //         if (status !== 'all') {
        //             options.where.status = Number(status)
        //         }
        //         let data = await Session.count(options)
        //         apiResponse(res, 200, data, null, false, req.cacheKey, 60)
        //     } catch (e) {
        //         apiResponse(res, 500, e)
        //     }
        // })

        this.router.get('/insights/:year', [
            param('year').isInt().not().isEmpty(),
            isValidated,
            isCached
        ], async (req: PassportRequestEntity, res: Response) => {
            let projectOptions = {
                attributes: ['id', 'name', 'registrationStartDate', 'registrationEndDate', 'revisionEndDate', 'startDate', 'endDate', 'totalVolume', 'firstEnrollmentCount', 'year'],
                order: [['id', 'DESC']],
                where: {
                    year: req.params.year
                },
                raw: true
            }
            let data = await Project.findAll(projectOptions)
            console.log('[*] data', data)
            console.log('[*] data', typeof data)
            
            for (const [index, value] of data.entries()) {
                console.log('[*] value', value)
                let popularTimes = await sequelize.query('SELECT count(sessions.id) as count, times.id, times."label", times."startTime", times."endTime" FROM sessions LEFT JOIN times ON times.id = sessions."timeId" WHERE sessions."projectId" = ' + value.id + ' GROUP BY times.id', { type: sequelize.QueryTypes.SELECT })
                popularTimes.forEach((v, i) => {
                    popularTimes[i].count = Number(v.count)
                })
                data[index].popularTimes = popularTimes
            }

            apiResponse(res, 200, data, null, false, req.cacheKey, 60)
        })

        this.router.get('/facebook/posts', [
            isCached
        ], async (req: PassportRequestEntity, res: Response) => {
            try {
                let data = await getFacebookPosts()
                if (data != null)
                    apiResponse(res, 200, data, null, false, req.cacheKey, 30)
                else
                    apiResponse(res, 404)
            } catch (e) {
                apiResponse(res, 500, e)
            }
        })

        this.router.get('/facebook/albums', [
            isCached
        ], async (req: PassportRequestEntity, res: Response) => {
            try {
                let data = await getFacebookAlbums()
                if (data != null)
                    apiResponse(res, 200, data, null, false, req.cacheKey, 60)
                else
                    apiResponse(res, 404)
            } catch (e) {
                apiResponse(res, 500, e)
            }
        })

        this.router.get('/facebook/albums/:albumId/photos', [
            isCached
        ], async (req: PassportRequestEntity, res: Response) => {
            try {
                let data = await getFacebookPhotos(req.params.albumId)
                if (data != null)
                    apiResponse(res, 200, data, null, false, req.cacheKey, 60)
                else
                    apiResponse(res, 404)
            } catch (e) {
                apiResponse(res, 500, e)
            }
        })

        return this.router
    }
}

export default (new Routes()).bootstrap()