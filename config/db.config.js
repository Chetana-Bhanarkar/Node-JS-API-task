require('dotenv').config();


const config = {
    database: process.env.DATABASE,
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD
}

module.exports = {
    config
}