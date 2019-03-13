import Sequelize from 'sequelize'
import { sequelize } from '../utils/util.database'

export const Event = sequelize.define('event', {
    title: {type: Sequelize.STRING},
    body: {type: Sequelize.TEXT},
    location: {type: Sequelize.STRING},
    displayImage: {type: Sequelize.STRING},
    startDate: {type: Sequelize.DATE},
    endDate: {type: Sequelize.DATE},
}, {
    underscored: false,
    underscoredAll: false
})