const constants = require('src/config/constnants');
const roomService = require('src/services/rooms');

const url = `${constants.DEFAULT_API_URL}/room`;

const getValue = async function (request, reply) {
    try {
        reply.send(await roomService.findByUUID(request.params.id));
    } catch (e) {
        reply.code(e.code).send(e);
    }
};

const postValue = async function (request, reply) {
    try {
        reply.send(await roomService.create(request.body));
    } catch (e) {
        reply.code(e.code).send(e);
    }
};

const putValue = async function (request, reply) {
    try {
        reply.send(
            await roomService.updateValue(request.params.id, request.body)
        );
    } catch (e) {
        reply.code(e.code).send(e);
    }
};

const addNewUser = async function (request, reply) {
    try {
        reply.send(
            await roomService.increaseCurrentUserCount(request.params.id)
        );
    } catch (e) {
        reply.code(e.code).send(e);
    }
};

const deleteValue = async function (request, reply) {
    try {
        reply.send(
            await roomService.updateValue(request.params.id, {
                is_actual: false,
            })
        );
    } catch (e) {
        reply.code(e.code).send(e);
    }
};

module.exports = [
    {
        method: constants.requests.GET,
        url: `${url}/:id`,
        handler: getValue,
    },
    {
        method: constants.requests.POST,
        url,
        handler: postValue,
    },
    {
        method: constants.requests.PUT,
        url: `${url}/:id`,
        handler: putValue,
    },
    {
        method: constants.requests.PUT,
        url: `${url}/increase_user_count/:id`,
        handler: addNewUser,
    },
    {
        method: constants.requests.DELETE,
        url: `${url}/:id`,
        handler: deleteValue,
    },
];
