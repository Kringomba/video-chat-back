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
            socket.broadcast
                .to(roomId)
                .emit(events.JOIN_NEW_USER, socket.handshake.query.userPeerId);
        } else {
            socket.emit(events.FAIL_TO_JOIN);
            return;
        }
        socket.on(events.SEND_MESSAGE_TO_SERVER, (event) =>
            onSendMessage(socket, event)
        );
        socket.on(events.DISCONNECT, () => onDisconnect(socket, roomId));
    }
};

const onDisconnect = async (socket, roomId) => {
    console.info('Socket disconnected:', socket.id);
    await userService.decrementCurrentUserCount(roomId);
};

const onSendMessage = async (socket, message) => {
    const roomId = socket.handshake.query.roomId;
    socket.to(roomId).emit(events.SEND_MESSAGE_TO_USER, message);
    console.log('must to send');
};
