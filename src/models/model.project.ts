import Sequelize from 'sequelize'
import { sequelize } from '../utils/util.database'

export const Project = sequelize.define('project', {
    name: {type: Sequelize.STRING},
    registrationStartDate: {type: Sequelize.DATE},
    registrationEndDate: {type: Sequelize.DATE},
    startDate: {type: Sequelize.DATE},
    endDate: {type: Sequelize.DATE},
    revisionEndDate: {type: Sequelize.DATE},
    passcode: {type: Sequelize.STRING}
}, {
    underscored: false,
    underscoredAll: false
})