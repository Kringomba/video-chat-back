const constants = require('src/config/constnants');
const roomService = require('src/services/rooms');

const url = `${constants.DEFAULT_API_URL}/room`;

const get = async function (request, reply) {
    reply.send('test get');
};

const post = async function (request, reply) {
    try {
        await roomService.create(request.body);
    }catch (e){
        console.log(e)
    }
    reply.send('test post');
};

const put = async function (request, reply) {
    reply.send('test put');
};

module.exports = [
    {
        method: constants.requests.GET,
        url,
        handler: get,
    },
    {
        method: constants.requests.POST,
        url,
        handler: post,
    },
    {
        method: constants.requests.PUT,
        url,
        handler: put,
    },
];
