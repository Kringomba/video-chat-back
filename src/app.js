require('module-alias/register');
const apiInfra = require('./infra/fastify.config');
const logger = require('./infra/logger');
const pgClient = require('./infra/db.config');

const PORT = process.env.PORT || 3002;

const start = async () => {
    try {
        await apiInfra.fastify.listen(PORT, '0.0.0.0');
        apiInfra.fastify.cron.startAllJobs();
        await apiInfra.configSocket();
        await pgClient.connect();
    } catch (err) {
        console.log(err)
        logger.error(err);
        process.exit(1);
    }
};

start();
