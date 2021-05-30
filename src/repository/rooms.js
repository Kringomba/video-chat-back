const client = require('src/infra/db.config')

client.query(`CREATE TABLE IF NOT EXISTS "Rooms"(id SERIAL NOT NULL CONSTRAINT "Rooms_pkey" PRIMARY KEY, uuid VARCHAR(100) CONSTRAINT "Rooms_uuid_key" UNIQUE NOT NULL, options JSONB DEFAULT '{"web": true, "chat": true, "count": null}'::JSONB NOT NULL, is_actual BOOLEAN DEFAULT true NOT NULL, created_at TIMESTAMP WITH TIME ZONE NOT NULL, expired_at TIMESTAMP WITH TIME ZONE NOT NULL)`)

module.exports = {
    insertRecord(room) {
        return client.query({
            text: 'INSERT INTO "Rooms" (uuid,options,created_at,expired_at) values ($1,$2,$3,$4)',
            values: [room.uuid, room.options, room.created_at, room.expired_at],
            rowMode: 'array',
        })
    },
}
