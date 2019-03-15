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
    },
    sunday: { type: Sequelize.INTEGER },
    monday: { type: Sequelize.INTEGER },
    tuesday: { type: Sequelize.INTEGER },
    wednesday: { type: Sequelize.INTEGER },
    thursday: { type: Sequelize.INTEGER },
    friday: { type: Sequelize.INTEGER },
    saturday: { type: Sequelize.INTEGER }
}, {
    underscored: false,
    underscoredAll: false
})