import { Router, Request, Response } from 'express'
import * as listEndpoints from 'express-list-endpoints'

import announcements from './route.announcements'
import events from './route.events'
import commons from './route.commons'
import profile from './route.profile'
import users from './route.users'
import { apiResponse } from '../utils/util.response'

class Routes {
    private router: Router = Router()
    public bootstrap () : Router {
        this.router.all('/endpoints', (req: Request, res: Response) => {
            apiResponse(res, 200, listEndpoints(this.router))
        })
        this.router.use('/announcements', announcements)
        this.router.use('/events', events)
        this.router.use('/profile', profile)
        this.router.use('/commons', commons)
        this.router.use('/users', users)
        
        return this.router
    }
}

export default (new Routes()).bootstrap()