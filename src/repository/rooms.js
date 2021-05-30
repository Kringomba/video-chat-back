const client = require('src/infra/db.config');

client.query(
    `CREATE TABLE IF NOT EXISTS "Rooms"(id SERIAL NOT NULL CONSTRAINT "Rooms_pkey" PRIMARY KEY, uuid VARCHAR(100) CONSTRAINT "Rooms_uuid_key" UNIQUE NOT NULL, options JSONB DEFAULT '{"web": true, "chat": true, "max_people_count": null}'::JSONB NOT NULL, current_people_count INTEGER DEFAULT 0, is_actual BOOLEAN DEFAULT true NOT NULL, created_at TIMESTAMP WITH TIME ZONE NOT NULL, expired_at TIMESTAMP WITH TIME ZONE NOT NULL)`
);

module.exports = {
    insertRecord(room) {
        return client.query({
            text: 'INSERT INTO "Rooms" (uuid,options,created_at,expired_at) values ($1,$2,$3,$4)',
            values: [room.uuid, room.options, room.created_at, room.expired_at],
        });
    },
    findByUUID(uuid) {
        return client.query({
            text: 'SELECT * FROM "Rooms" WHERE is_actual=true and uuid=$1',
            values: [uuid],
        });
    },
    updateValue(room) {
        return client.query({
            text: 'UPDATE "Rooms" SET options = $1, current_people_count = $2, is_actual = $3 WHERE id = $4',
            values: [
                room.options,
                room.current_people_count,
                room.is_actual,
                room.id,
            ],
        });
    },
};
