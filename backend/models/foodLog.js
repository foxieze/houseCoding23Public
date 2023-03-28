// import sequelize and db connection
const Sequelize = require('sequelize');
const db = require('../config/db');

// create sequelize model for food log items
const FoodLog = db.define('foodLog', {
    id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    date: {
        type: Sequelize.DATE,
        allowNull: false
    },
    mass: {
        type: Sequelize.FLOAT,
        allowNull: false
    }
});

// export food log model
module.exports = FoodLog;