// import sequelize 
const Sequelize = require('sequelize');

// sequelize connect function
const sequelize = new Sequelize(
    process.env.DB_NAME,
    process.env.DB_USER,
    process.env.DB_PASSWORD,
    {
        host: process.env.DB_HOST,
        port: process.env.DB_PORT,
        dialect: 'mariadb',
        logging: false,
        define: {
            timestamps: false
        }
    }
);

// export sequelize connection
module.exports = sequelize;