const Fastify = require('fastify');
const plugins = require('src/plugins');
const decorates = require('src/decorate');
const routes = require('src/routes');
const { Sequelize } = require('sequelize');
const logger = require('src/infra/logger');

class ApiConfig {
    constructor() {
        this.fastify = Fastify({ trustProxy: true });
        this._routes();
        this._plugin();
        this._decorateRequest();
    }

    _plugin() {
        plugins.forEach((plugin) =>
            this.fastify.register(plugin.plugin, plugin.properties)
        );
    }

    _decorateRequest() {
        decorates.forEach((decorate) =>
            this.fastify.decorateRequest(decorate.property, decorate.value)
        );
    }

    _routes() {
        routes.forEach((route) => this.fastify.route(route));
    }

    async connectToDatabase(
        username = 'root',
        pwd = 'root',
        host = 'localhost',
        port = 5432,
        table = 'video-chat'
    ) {
        const sequelize = new Sequelize(
            `postgres://${username}:${pwd}@${host}:${port}/${table}`
        );
        try {
            await sequelize.authenticate();
            logger.info('Connection has been established successfully.');
        } catch (error) {
            logger.error(`Unable to connect to the database:${error.message}`);
            throw new Error('Fail connect to database');
        }
    }
}

module.exports = new ApiConfig();
