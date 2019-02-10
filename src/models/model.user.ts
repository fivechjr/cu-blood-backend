import Sequelize from 'sequelize'
import { v4 as uuidv4 } from 'uuid/v4'
import * as bcrypt from 'bcrypt'
import { sequelize } from '../utils/util.database'
import { School } from './model.school';
import chalk from 'chalk'

const User = sequelize.define('user', {
    uuid: {
        type: Sequelize.UUID,
        unique: true
    },
    firstName: {type: Sequelize.STRING},
    lastName: {type: Sequelize.STRING},
    nickname: {type: Sequelize.STRING},
    gender: {type: Sequelize.INTEGER},
    bloodType: {type: Sequelize.INTEGER},
    birthday: {type: Sequelize.DATEONLY},
    address: {
        type: Sequelize.TEXT
    },
    username: {
        type: Sequelize.STRING,
        unique: true
    },
    password: {type: Sequelize.STRING},
    medicalCondition: {type: Sequelize.STRING},
    studentId: {
        type: Sequelize.STRING,
        unique: true
    },
    weight: {type: Sequelize.INTEGER},
    phoneNumber: {type: Sequelize.STRING},
    status: {type: Sequelize.INTEGER},
    shirtSize: {type: Sequelize.INTEGER},
    onboarding: {
        type: Sequelize.INTEGER,
        allowNull: false,
        defaultValue: -1,
        validate: { min: -1, max: 1 }
    },
    nationality: {
        type: Sequelize.INTEGER,
        allowNull: true,
        validate: { min: 0, max: 1 }
    },
    academicYear: {
        type: Sequelize.INTEGER,
        allowNull: true,
        validate: { min: 0, max: 8 }
    },
    isDonated: {
        type: Sequelize.INTEGER,
        allowNull: true,
        validate: { min: 0, max: 1 }
    },
    isEnrolled: {
        type: Sequelize.INTEGER,
        allowNull: true,
        validate: { min: 0, max: 1 }
    }
}, {
    underscored: false,
    underscoredAll: false,
    hooks: {
        beforeCreate: async function (user) {
            const salt = await bcrypt.genSalt(12)
            const hash = await bcrypt.hash(user.password, salt)
            user.username = user.username.toLowerCase()
            user.password = hash
            user.uuid = uuidv4()
        },
        beforeUpdate: async function (user) {
            if (user.changed('password') && user.password != null) {
                const salt = await bcrypt.genSalt(12)
                const hash = await bcrypt.hash(user.password, salt)
                user.password = hash
            }

            if (user.changed('username') && user.username != null) {
                user.username = user.username.toLowerCase()
            }
        }
    }
})

User.prototype.verifyPassword = async function (candidatePassword) {
    try {
        let res = await bcrypt.compare(candidatePassword, this.password, null)
        return res
    } catch (e) {
        return false
    }
}

User.belongsTo(School, { foreignKey: { allowNull: false }, onDelete: 'CASCADE' })

export { User }