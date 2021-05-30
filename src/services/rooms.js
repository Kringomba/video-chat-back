const { v4: uuid } = require('uuid');
const moment = require('moment');
const base64 = require('js-base64');
const roomRepository = require('src/repository/rooms');
const HTTPException = require('http-exception');

class RoomService {
    get _generateRoomID() {
        return base64.encode(uuid());
    }

    get _defaultOptions() {
        return {
            max_people_count: null,
            web: true,
            chat: true,
        };
    }

    async create(body) {
        const room = {
            uuid: this._generateRoomID,
            options: body?.options ? body.options : this._defaultOptions,
            created_at: moment(),
            expired_at: body?.expired_at
                ? body.expired_at
                : moment().add(1, 'day'),
        };
        await roomRepository.insertRecord(room);
        room.is_actual = true;
        room.current_people_count = 0;
        return room;
    }

    async findByUUID(uuid) {
        const { rows } = await roomRepository.findByUUID(uuid);
        if (!rows[0]) {
            throw {
                code: 404,
                message: 'Record not found',
            };
        }
        return rows[0];
    }

    async updateValue(uuid, room) {
        const currentRoom = await this.findByUUID(uuid);
        const updatedRoom = { ...currentRoom, ...room };
        await roomRepository.updateValue(updatedRoom);
        return updatedRoom;
    }

    async increaseCurrentUserCount(uuid) {
        const currentRoom = await this.findByUUID(uuid);
        if (
            currentRoom.options.max_people_count &&
            currentRoom.current_people_count + 1 >
                currentRoom.options.max_people_count
        ) {
            throw {
                code: 406,
                message: 'Value is not acceptable',
            };
        }
        const updatedRoom = {
            ...currentRoom,
            current_people_count: currentRoom.current_people_count + 1,
        };
        await roomRepository.updateValue(updatedRoom);
        return updatedRoom;
    }
}

module.exports = new RoomService();
