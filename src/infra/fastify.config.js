const Fastify = require('fastify');
const plugins = require('src/plugins');
const decorates = require('src/decorate');
const routes = require('src/routes');

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
}




module.exports = new ApiConfig();
