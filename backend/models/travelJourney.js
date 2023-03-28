// import sequelize and db connection
const Sequelize = require('sequelize');
const db = require('../config/db');

// create sequelize model for travel journeys
const TravelJourney = db.define('travelJourney', {
    id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    date: {
        type: Sequelize.DATE,
        allowNull: false
    },
    distance: {
        type: Sequelize.FLOAT,
        allowNull: false
    }
});

// export travel journey model
module.exports = TravelJourney;