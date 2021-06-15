const events = require('./events');
const userService = require('../services/rooms');

module.exports = class SocketAction {
    constructor(socket) {
        this.socket = socket;
        this.socket.on(events.CONNECTION, this.setUpConnection);
    }

    async setUpConnection(socket) {
        console.info('Socket connected:', socket.id);

        const roomId = socket.handshake.query.roomId;
        const res = await userService.increaseCurrentUserCount(roomId);

        if (res) {
            socket.join(roomId);
        } else {
            socket.emit(events.FAIL_TO_JOIN);
            return;
        }

        socket.on(events.DISCONNECT, () => onDisconnect(socket, roomId));
    }
};

const onDisconnect = async (socket, roomId) => {
    console.info('Socket disconnected:', socket.id);
    await userService.decrementCurrentUserCount(roomId);
};
