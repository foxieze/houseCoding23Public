// import sequelize and db connection
const Sequelize = require('sequelize');
const db = require('../config/db');

// create model for tip
const Tip = db.define('tip', {
    id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    title: {
        type: Sequelize.STRING
    },
    description: {
        type: Sequelize.STRING
    },
    image: {
        type: Sequelize.STRING
    }
});

// export model
module.exports = Tip;