module.exports = [
    {
        plugin: require('fastify-cors'),
        properties: {},
    },
    {
        plugin: require('fastify-socket.io'),
        properties: {
            cors: {
                origin: '*',
            },
            path: '/socket',
        },
    },
];
