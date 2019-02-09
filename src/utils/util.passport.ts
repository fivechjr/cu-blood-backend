import * as passport from 'passport'
import * as passportLocal from 'passport-local'
import { User } from '../models/model.user'
import { toUserEntity } from './util.response'
import { sequelize } from './util.database'
import { School } from '../models/model.school'

const LocalStrategy = passportLocal.Strategy

passport.serializeUser<any, any>((user, done) => {
    done(undefined, user.uuid)
})

passport.deserializeUser(async (id, done) => {
    try {
        let options = {
            where: {
                uuid: id
            },
            include: [School]
        }
        let user = await User.findOne(options)
        if (user) {
            done(undefined, toUserEntity(user, true))
        } else {
            return done(undefined, false)
        }
    } catch (e) {
        return done(e)
    }
})

passport.use(new LocalStrategy(async (username, password, done) => {
    try {
        let options = {
            where: {
                [sequelize.Op.or]: [{username: username.toLowerCase()}, {studentId: username.toLowerCase()}]
            },
            include: [School]
        }
        let user = await User.findOne(options)
        if (!user) {
            return done(undefined, false, { message: 'User not found' })
        } else {
            try {
                let verify = await user.verifyPassword(password)
                if (verify) {
                    return done(undefined, toUserEntity(user))
                } else {
                    return done(undefined, false, { message: 'Invalid credentials' })
                }
            } catch (e) {
                return done(e)
            }
        }
    } catch (e) {
        let { name } = e
        return done({ name })
    }
}))