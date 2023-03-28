// import sequelize and database connection
const Sequelize = require('sequelize');
const db = require('../config/db');

// create sequelize model for food items
const FoodItem = db.define('foodItem', {
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

// export food item model
module.exports = FoodItem;