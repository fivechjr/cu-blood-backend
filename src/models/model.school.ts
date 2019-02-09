import Sequelize from 'sequelize'
import { sequelize } from '../utils/util.database'

export const School = sequelize.define('schools', {
    nameTH: {
        type: Sequelize.STRING,
        allowNull: false
    },
    nameEN: {
        type: Sequelize.STRING,
        allowNull: false
    },
}, {
    underscored: false,
    underscoredAll: false
})