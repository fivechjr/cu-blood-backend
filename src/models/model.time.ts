import Sequelize from 'sequelize'
import { sequelize } from '../utils/util.database'

export const Time = sequelize.define('times', {
    startTime: {
        type: Sequelize.TIME,
        allowNull: false
    },
    endTime: {
        type: Sequelize.TIME,
        allowNull: false
    },
    label: {
        type: Sequelize.STRING,
        allowNull: false
    }
}, {
    underscored: false,
    underscoredAll: false
})