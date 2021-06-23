const Fastify = require('fastify');
const fastifyCron = require('fastify-cron');
const plugins = require('src/plugins');
const decorates = require('src/decorate');
const routes = require('src/routes');
const SocketAction = require('../sockets/action');

class ApiConfig {
    constructor() {
        this.fastify = Fastify({ trustProxy: true });
        this._routes();
        this._plugin();
        this._decorateRequest();
        this._cron();
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

    _cron() {
        this.fastify.register(fastifyCron, {
            jobs: [
                {
                    cronTime: '0 * * * *',
                    onTick: () =>
                        require('../repository/rooms').updateActualState(),
                },
            ],
        });
    }

    configSocket() {
        this.fastify.ready((err) => {
            if (err) {
                throw err;
            }
            new SocketAction(this.fastify.io);
        });
    }
}

module.exports = new ApiConfig();
