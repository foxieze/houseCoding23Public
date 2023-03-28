// import sequelize and db connection
const Sequelize = require('sequelize');
const db = require('../config/db');

// create sequelize model for travel methods
const TravelMethod = db.define('travelMethod', {
    id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    name: {
        type: Sequelize.STRING,
        allowNull: false
    },
    carbonOutput: {
        type: Sequelize.FLOAT,
        allowNull: false
    }
});

// export travel method model
module.exports = TravelMethod;