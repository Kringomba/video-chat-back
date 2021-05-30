const { Client } = require('pg')

const connectionOptions = Object.freeze({
    username: process.env.DATABASE_USERNAME || 'root',
    pwd: process.env.DATABASE_PWD || 'root',
    host: process.env.DATABASE_HOST || 'localhost',
    port: process.env.DATABASE_PORT || 5432,
    database: 'video-chat',
});

module.exports = new Client({
    user: connectionOptions.username,
    host: connectionOptions.host,
    database: connectionOptions.database,
    password: connectionOptions.pwd,
    port: connectionOptions.port,
})
