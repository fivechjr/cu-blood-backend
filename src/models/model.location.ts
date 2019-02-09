import Sequelize from 'sequelize'
import { sequelize } from '../utils/util.database'

export const Location = sequelize.define('location', {
    nameTH: {type: Sequelize.STRING},
    nameEN: {type: Sequelize.STRING},
    googleMapsURL: {type: Sequelize.STRING},
    addressTH: {type: Sequelize.TEXT},
    addressEN: {type: Sequelize.TEXT},
}, {
    underscored: false,
    underscoredAll: false
})