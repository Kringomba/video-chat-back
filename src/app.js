require('module-alias/register');
const apiInfra = require('./infra/fastify.config');
const logger = require('./infra/logger');

const PORT = process.env.PORT || 3000;

const start = async () => {
    try {
        await apiInfra.connectToDatabase();
        await apiInfra.fastify.listen(PORT, '0.0.0.0');
        await require('./db/connection')();
    } catch (err) {
        logger.error(err);
        process.exit(1);
    }
};

start();
