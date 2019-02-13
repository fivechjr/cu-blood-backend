import Sequelize from 'sequelize'
import { sequelize } from '../utils/util.database'
import { User } from './model.user';
import { Project } from './model.project';
import { Location } from './model.location';
import { Time } from './model.time';

export const Session = sequelize.define('session', {
    id: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
        primaryKey: true
    },
    timeSlot: {type: Sequelize.DATEONLY},
    checkIn: {type: Sequelize.DATE},
    checkOut: {type: Sequelize.DATE},
    status: {type: Sequelize.INTEGER},
    bloodType: {type: Sequelize.INTEGER},
    type: {
        type: Sequelize.INTEGER,
        allowNull: false,
        defaultValue: 0,
        validate: { min: 0, max: 1 }
    }
}, {
    underscored: false,
    underscoredAll: false
})

Session.belongsTo(User, { foreignKey: { allowNull: false }, onDelete: 'CASCADE' })
Session.belongsTo(Project, { foreignKey: { allowNull: false }, onDelete: 'CASCADE' })
Session.belongsTo(Location, { foreignKey: { allowNull: false }, onDelete: 'CASCADE' })
Session.belongsTo(Time, { foreignKey: { allowNull: false }, onDelete: 'CASCADE' })