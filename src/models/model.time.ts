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
    isSunday: { type: Sequelize.INTEGER },
    isMonday: { type: Sequelize.INTEGER },
    isTuesday: { type: Sequelize.INTEGER },
    isWednesday: { type: Sequelize.INTEGER },
    isThursday: { type: Sequelize.INTEGER },
    isFriday: { type: Sequelize.INTEGER },
    isSaturday: { type: Sequelize.INTEGER }
}, {
    underscored: false,
    underscoredAll: false
})