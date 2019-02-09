import Sequelize from 'sequelize'
import { sequelize } from '../utils/util.database'

export const Announcement = sequelize.define('announcement', {
    title: {type: Sequelize.STRING},
    body: {type: Sequelize.TEXT},
    displayImage: {type: Sequelize.STRING}
}, {
    underscored: false,
    underscoredAll: false
})