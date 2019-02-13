import { Router, Request, Response } from 'express'
import { Project } from '../models/model.project'
import { getFacebookPosts, getFacebookAlbums, getFacebookPhotos } from '../utils/util.facebook'
import { apiResponse } from '../utils/util.response'
import { isCached } from '../middlewares/md.is-cached'
import { PassportRequestEntity } from 'spec'
import { Session } from '../models/model.session'
import { isValidated } from '../utils/util.validation'
import { param } from 'express-validator/check'
import { sequelize } from '../utils/util.database'
import * as moment from 'moment'
import { User } from '../models/model.user';
import { Location } from '../models/model.location';
import { School } from '../models/model.school';
import { Time } from '../models/model.time';
import chalk from 'chalk';

class Routes {
    private router: Router = Router()
    public bootstrap () : Router {
        this.router.get('/', [
            isCached
        ], async (req: PassportRequestEntity, res: Response) => {
            try {
                let enumerateDaysBetweenDates = (startDate, endDate) => {
                    let dates = []
                    let currDate = moment(startDate).startOf('day')
                    let lastDate = moment(endDate).endOf('day')
                    dates.push(currDate.clone().format())
                    while(currDate.add(1, 'days').diff(lastDate) <= 0) {
                        dates.push(currDate.clone().format())
                    }
                    return dates;
                }

                let projectOptions = {
                    attributes: ['id', 'name', 'registrationStartDate', 'registrationEndDate', 'startDate', 'endDate'],
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
                result.locations = locations
                result.schools = schools
                result.startDate = moment(result.startDate).utcOffset(420).format()
                result.endDate = moment(result.endDate).utcOffset(420).format()
                result.registrationStartDate = moment(result.registrationStartDate).utcOffset(420).format()
                result.registrationEndDate = moment(result.registrationEndDate).utcOffset(420).format()
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

        // this.router.get('/insights/sessions/:startDate/:endDate/:status', [
        //     isCached,
        //     param('startDate').isISO8601(),
        //     param('endDate').isISO8601(),
        //     param('status').isIn(['all', '0', '1', '2', '3']),
        //     isValidated
        // ], async (req: PassportRequestEntity, res: Response) => {
        //     try {
        //         let status = req.params.status
        //         let startDate = moment(req.params.startDate).startOf('day').format()
        //         let endDate = moment(req.params.endDate).endOf('day').format()
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

        this.router.get('/insights/blood-types/:year', [
            // isCached,
            param('year').isInt(),
        ], async (req: PassportRequestEntity, res: Response) => {

            // let count = await Session.findAll({
            //     include: [
            //         {
            //             model: User,
            //             attributes: []
            //         }
            //     ],
            //     group: ['users.bloodType'],
            //     attributes: ['id', [sequelize.fn('count', sequelize.col('users.bloodType')) ,'bloodTypeCount']],
            //     where: sequelize.where(sequelize.fn('YEAR', sequelize.col('dateField')), req.params.year)
            // })

            // let count = await User.findAll({
            //     attributes: { 
            //         include: [[sequelize.fn("COUNT", sequelize.col("sessions.id")), "sessionCount"]] 
            //     },
            //     include: [{
            //         model: Session, as: 'sessions', attributes: []
            //     }],
            //     group: ['User.bloodType']
            // })

            // let count = await User.findAll({
            //     attributes: ['User.*', 'Session.*', [sequelize.fn('COUNT', 'Session.id'), 'SessionCount']],
            //     include: [Session],
            //     group: ['User.bloodType']
            // })

            // let count = await Session.findAll({
            //     attributes: ['User.*', 'Session.*', [sequelize.fn('COUNT', 'Session.id'), 'SessionCount']],
            //     include: [User],
            //     group: ['User.bloodType']
            // })

            // let count = await Session.findAndCountAll({
            //     include: [{
            //         model: User,
            //         attributes: [],
            //         duplicating: false,
            //         required: true
            //     }],
            //     group: ['User.bloodType']
            // })

            sequelize.query('SELECT count(sessions.id) as Count FROM users LEFT JOIN sessions on users.id = sessions."userId" GROUP BY users."bloodType"', { type: sequelize.QueryTypes.SELECT}).then(d => {
                console.log(chalk.bgYellow(d))
                apiResponse(res, 200, d, null, false, req.cacheKey, 60)
            }).catch(e => {
                console.log(e)
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