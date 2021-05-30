const { v4: uuid } = require('uuid');
const moment = require('moment')
const base64 = require('js-base64')
const roomRepository = require('src/repository/rooms');

class RoomService {
    get _generateRoomID() {
        return base64.encode(uuid());
    }

    get _defaultOptions() {
        return {
            count: null,
            web: true,
            chat: true
        }
    }

    create(body) {
        const room = {
            uuid: this._generateRoomID,
            options: body?.options ? body.options : this._defaultOptions,
            created_at: moment(),
            expired_at: body?.expired_at ? body.expired_at : moment().add(1, 'day')
        }
        console.log(JSON.stringify(room))
        return roomRepository.insertRecord(room)
    }
}

module.exports = new RoomService();
